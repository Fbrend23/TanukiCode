/**
 * Utility for Japanese Text-to-Speech using the Web Speech API.
 */

/**
 * Finds a suitable Japanese voice from the available list.
 */
const findJapaneseVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
  const jaVoices = voices.filter((v) => v.lang.toLowerCase().replace('_', '-') === 'ja-jp')

  if (jaVoices.length > 0) {
    const premiumVoice = jaVoices.find(
      (v) =>
        v.name.includes('Google') ||
        v.name.includes('Premium') ||
        v.name.includes('Natural') ||
        v.name.includes('Online'),
    )
    const selected = premiumVoice || jaVoices[0]
    if (selected) return selected
  }
  return null
}

// Prime the voices list
if (typeof globalThis !== 'undefined' && globalThis.speechSynthesis) {
  globalThis.speechSynthesis.getVoices()
}

/**
 * Speaks the provided text In Japanese.
 * @param text The string to speak (Kana or Kanji)
 * @param rate Speed of speech (default 0.9 for clarity)
 */
/**
 * Speaks the provided text In Japanese.
 * @param text The string to speak (Kana or Kanji)
 * @param rate Speed of speech (default 0.9 for clarity)
 */
export const speakJapanese = (text: string, rate: number = 0.9) => {
  if (typeof globalThis === 'undefined') return

  const encodedText = encodeURIComponent(text)
  const sources: string[] = [
    `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=gtx&q=${encodedText}`,
    `https://dict.youdao.com/dictvoice?audio=${encodedText}&le=ja`,
    `https://tts.baidu.com/text2audio?lan=ja&ie=UTF-8&spd=4&text=${encodedText}`,
  ]

  const playNativeFallback = () => {
    if (globalThis.speechSynthesis) {
      globalThis.speechSynthesis.cancel()
      const voices = globalThis.speechSynthesis.getVoices()
      const voice = findJapaneseVoice(voices)

      const utterance = new SpeechSynthesisUtterance(text)
      if (voice) utterance.voice = voice

      utterance.lang = 'ja-JP'
      utterance.rate = rate
      utterance.pitch = 1

      globalThis.speechSynthesis.speak(utterance)
    }
  }

  const playSource = (index: number) => {
    // If all cloud sources failed, use Native Fallback
    if (index >= sources.length) {
      playNativeFallback()
      return
    }

    const src = sources[index]
    if (!src) return

    const audio = new Audio()
    audio.src = src
    audio.playbackRate = rate

    const playTimeout = setTimeout(() => {
      audio.pause()
      playSource(index + 1)
    }, 5000)

    audio
      .play()
      .then(() => {
        clearTimeout(playTimeout)
      })
      .catch((e) => {
        clearTimeout(playTimeout)
        console.warn('TTS source failed', sources[index], e)
        playSource(index + 1)
      })
  }

  playSource(0)
}

const AUDIO_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/audio-assets`

/**
 * Attempts to play a static audio file for a grammar example.
 * URL: {AUDIO_BASE_URL}/grammar/{id}_{index}.mp3
 * Falls back to TTS (speakJapanese) if the file is missing or fails.
 *
 * @param lessonId - The ID of the lesson (e.g. 'basic-desu')
 * @param index - The index of the example in the lesson
 * @param text - The fallback Japanese text to speak
 */
export const playGrammarAudio = (lessonId: string, index: number, text: string) => {
  const audioPath = `${AUDIO_BASE_URL}/grammar/${lessonId}_${index}.mp3`
  const audio = new Audio(audioPath)

  audio.play().catch(() => {
    speakJapanese(text)
  })
}

/**
 * Attempts to play a static audio file for a Kana character.
 * Uses romaji filename (e.g. 'a.mp3').
 *
 * @param char - The Japanese character (Fallback text)
 * @param romaji - The romaji representation (Filename)
 */
export const playKanaAudio = (char: string, romaji: string) => {
  if (!romaji) {
    speakJapanese(char)
    return
  }
  const audioPath = `${AUDIO_BASE_URL}/kana/${romaji}.mp3`
  const audio = new Audio(audioPath)

  audio.play().catch(() => {
    speakJapanese(char)
  })
}

/**
 * Attempts to play a static audio file for a Kanji example word.
 * Filename format: k_{hex}_{index}.mp3 (Hex encoded char)
 *
 * @param character - The Kanji character (e.g. '日')
 * @param index - The index of the example in the list
 * @param text - The reading to speak if file missing
 */
export const playKanjiAudio = (character: string, index: number, text: string) => {
  const hex = (character.codePointAt(0) || 0).toString(16)
  const audioPath = `${AUDIO_BASE_URL}/kanji/k_${hex}_${index}.mp3`
  const audio = new Audio(audioPath)

  audio.play().catch(() => {
    speakJapanese(text)
  })
}

/**
 * Attempts to play a sentence audio file.
 * URL: {AUDIO_BASE_URL}/sentences/{id}.mp3
 *
 * @param id - The sentence ID (e.g. 'aisatsu_01')
 * @param text - Fallback text to speak via TTS if file missing
 */
export const playSentenceAudio = (id: string, text: string) => {
  // Add timestamp to bust browser cache since files might update
  const audioPath = `${AUDIO_BASE_URL}/sentences/${id}.mp3?t=${Date.now()}`
  const audio = new Audio(audioPath)

  audio.play().catch(() => {
    console.warn(`Missing audio file for sentence: ${id}`)
    // Fallback to TTS or just log warning depending on preference.
    // For now, let's fallback to TTS so it works even if files aren't uploaded yet.
    speakJapanese(text)
  })
}
