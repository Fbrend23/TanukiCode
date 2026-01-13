import fs from 'node:fs'
import path from 'node:path'
import https from 'node:https'
import { fileURLToPath } from 'node:url'
import { createJiti } from 'jiti'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// Initialize Jiti to load TypeScript files
const jiti = createJiti(import.meta.url)
const grammarData = jiti('../src/data/grammar.ts')
const kanaData = jiti('../src/data/kana.ts')
const kanjiData = jiti('../src/data/kanji.ts')

const lessons = grammarData.grammarLessons
const allKana = [...kanaData.hiragana, ...kanaData.katakana]
const kanjiList = kanjiData.kanjiList

// Load credentials from .env and .env.local
const loadEnvFile = (filename) => {
  const filepath = path.resolve(projectRoot, filename)
  return fs.existsSync(filepath) ? fs.readFileSync(filepath, 'utf-8') : ''
}
const envContent = loadEnvFile('.env') + '\n' + loadEnvFile('.env.local')

const getEnv = (key) => {
  // Match key=value, tolerating spaces and optional quotes
  const match = envContent.match(new RegExp(`^\\s*${key}\\s*=\\s*["']?(.*?)["']?\\s*$`, 'm'))
  return match ? match[1].trim() : process.env[key]
}

const supabaseUrl = getEnv('VITE_SUPABASE_URL')
const supabaseAnonKey = getEnv('VITE_SUPABASE_KEY')
const supabaseServiceKey = getEnv('SUPABASE_SERVICE_KEY') || getEnv('VITE_SUPABASE_SERVICE_KEY')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY in .env')
  process.exit(1)
}

// Prefer Service Key (Admin) for scripts to bypass RLS, otherwise use Anon Key
const supabaseKey = supabaseServiceKey || supabaseAnonKey
const isServiceKey = !!supabaseServiceKey

if (isServiceKey) {
  console.log('✅ Using SUPABASE_SERVICE_KEY (Admin Mode) - RLS bypassed.')
} else {
  console.log('⚠️  Using VITE_SUPABASE_KEY (Public Mode) - Ensure RLS policies allow uploads!')
}

const supabase = createClient(supabaseUrl, supabaseKey)
const BUCKET = 'audio-assets'

const uploadAudio = async (text, filePathInBucket) => {
  return new Promise((resolve, reject) => {
    const encodedText = encodeURIComponent(text)
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=gtx&q=${encodedText}`

    https
      .get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
        },
        (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to fetch TTS ${url}: ${response.statusCode}`))
            return
          }

          const chunks = []
          response.on('data', (chunk) => chunks.push(chunk))
          response.on('end', async () => {
            const buffer = Buffer.concat(chunks)
            const { error } = await supabase.storage.from(BUCKET).upload(filePathInBucket, buffer, {
              contentType: 'audio/mpeg',
              upsert: true,
            })

            if (error) reject(error)
            else resolve()
          })
        },
      )
      .on('error', reject)
  })
}

const getExistingFiles = async (folder) => {
  const { data, error } = await supabase.storage.from(BUCKET).list(folder, { limit: 1000 })
  if (error) {
    console.warn(
      `Could not list files in ${folder} (Bucket might be empty or missing):`,
      error.message,
    )
    return new Set()
  }
  return new Set(data.map((f) => f.name))
}

const main = async () => {
  console.log('Starting Supabase audio sync...')

  // 1. Process Grammar
  console.log('--- Grammar ---')
  const existingGrammar = await getExistingFiles('grammar')

  for (const lesson of lessons) {
    for (let i = 0; i < lesson.examples.length; i++) {
      const example = lesson.examples[i]
      const filename = `${lesson.id}_${i}.mp3`
      const filePathInBucket = `grammar/${filename}`

      if (existingGrammar.has(filename)) {
        process.stdout.write('.')
        continue
      }

      console.log(`Uploading: ${filename}...`)
      try {
        await new Promise((r) => setTimeout(r, 200)) // Rate limit
        await uploadAudio(example.japanese, filePathInBucket)
      } catch (e) {
        console.error(`Failed ${filename}:`, e.message)
      }
    }
  }

  // 2. Process Kana
  console.log('\n--- Kana ---')
  const existingKana = await getExistingFiles('kana')

  const uniqueKana = new Map()
  allKana.forEach((k) => {
    if (k.char && k.romaji) {
      uniqueKana.set(k.romaji, k.char)
    }
  })

  for (const [romaji, char] of uniqueKana.entries()) {
    const filename = `${romaji}.mp3`
    const filePathInBucket = `kana/${filename}`

    if (existingKana.has(filename)) {
      process.stdout.write('.')
      continue
    }

    console.log(`Uploading: ${filename}...`)
    try {
      await new Promise((r) => setTimeout(r, 200))
      await uploadAudio(char, filePathInBucket)
    } catch (e) {
      console.error(`Failed ${filename}:`, e.message)
    }
  }

  // 3. Process Kanji
  console.log('\n--- Kanji ---')
  const existingKanji = await getExistingFiles('kanji')

  for (const kanji of kanjiList) {
    if (kanji.examples) {
      for (let i = 0; i < kanji.examples.length; i++) {
        const example = kanji.examples[i]
        // Use Hex code for Kanji filename to avoid "Invalid key" errors in storage
        const hex = (kanji.character.codePointAt(0) || 0).toString(16)
        const filename = `k_${hex}_${i}.mp3`
        const filePathInBucket = `kanji/${filename}`

        if (existingKanji.has(filename)) {
          process.stdout.write('.')
          continue
        }

        console.log(`Uploading: ${filename} (for ${kanji.character})...`)
        try {
          await new Promise((r) => setTimeout(r, 200))
          await uploadAudio(example.reading, filePathInBucket)
        } catch (e) {
          console.error(`Failed ${filename}:`, e.message)
        }
      }
    }
  }

  // 4. Process Sentences
  console.log('\n--- Sentences ---')
  const sentencesData = jiti('../src/data/sentences.ts')
  const sentencesList = sentencesData.sentences
  const existingSentences = await getExistingFiles('sentences')

  // Check for --force flag
  const forceMode = process.argv.includes('--force')

  for (const sentence of sentencesList) {
    const filename = `${sentence.id}.mp3`
    const filePathInBucket = `sentences/${filename}`

    if (existingSentences.has(filename) && !forceMode) {
      process.stdout.write('.')
      continue
    }

    console.log(`Uploading: ${filename} ("${sentence.kana}")...`)
    try {
      await new Promise((r) => setTimeout(r, 200))
      // Use Kana text for TTS to ensure correct reading (e.g. Nimei vs Futari)
      await uploadAudio(sentence.kana, filePathInBucket)
    } catch (e) {
      console.error(`Failed ${filename}:`, e.message)
    }
  }

  console.log('\nSupabase sync complete!')
}

main()
