<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { hiragana, katakana, type KanaChar } from '@/data/kana'
import { vocabulary, type VocabularyWord } from '@/data/vocabulary'
import { sentences, type Sentence } from '@/data/sentences'
import { Volume2, Trophy, Flame, Play } from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore'
import { happyConfetti } from '@/utils/confetti'
import { playKanaAudio, speakJapanese, playSentenceAudio } from '@/utils/audio'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import TrainingHeader from '@/components/training/TrainingHeader.vue'
import FeedbackDrawer from '@/components/training/FeedbackDrawer.vue'

const isLoading = ref(true)
const userStore = useUserStore()

// --- Types ---
type QuizItem = (KanaChar | VocabularyWord | Sentence) & {
  // Common properties
  id?: string
  japanese?: string // Sentence
  char?: string // Kana
  word?: string // Vocab
  romaji?: string
  translation?: string
  meaning?: string | string[]
}

// --- Game State ---
const currentQuestion = ref<QuizItem | null>(null)
const options = ref<QuizItem[]>([])
const selectedOption = ref<QuizItem | null>(null)
const isAnswered = ref(false)
const isCorrect = ref(false)
const isPlaying = ref(false)

const score = computed(() => userStore.score)
const combo = computed(() => userStore.currentCombo)

// --- Logic ---
const allItems = computed(() => {
  // Combine all listenable content
  const kanaItems = [...hiragana, ...katakana].filter((k) => k.char)
  // For Vocab, ensure we have reading/word
  const vocabItems = vocabulary
  // For Sentences, ensure we have id/japanese
  const sentenceItems = sentences

  return [...kanaItems, ...vocabItems, ...sentenceItems] as QuizItem[]
})

// Helper to get unique ID/String for comparison
const getId = (item: QuizItem): string => {
  if ('id' in item && item.id) return item.id // Sentence
  if ('word' in item && item.word) return item.word // Vocab
  if ('char' in item && item.char) return item.char // Kana
  return 'unknown'
}

// Helper to get Display Text for Options (Meaning/Translation)
const getOptionText = (item: QuizItem): string => {
  if ('translation' in item && item.translation) return item.translation
  if ('meaning' in item && item.meaning) {
    if (Array.isArray(item.meaning)) {
      return item.meaning[0] || '???'
    }
    return item.meaning as string
  }
  if ('romaji' in item && item.romaji) return item.romaji
  return '???'
}

const playAudio = () => {
  if (!currentQuestion.value) return
  isPlaying.value = true

  const item = currentQuestion.value

  // Sentence
  if ('japanese' in item && item.id) {
    playSentenceAudio(item.id, item.japanese || '')
  }
  // Kana
  else if ('char' in item && item.char) {
    playKanaAudio(item.char, item.romaji || '')
  }
  // Vocab (Fallback TTS)
  else if ('word' in item && item.word) {
    const reading = (item as VocabularyWord).reading
    speakJapanese(reading || item.word || '')
  }

  // Simple timeout to reset playing state visual
  setTimeout(() => {
    isPlaying.value = false
  }, 2000)
}

const generateOptions = (correct: QuizItem): QuizItem[] => {
  const opts = [correct]
  const correctId = getId(correct)

  // Filter pool to same type to make it fair (don't mix kana options with sentence options)
  const isSentence = 'japanese' in correct
  const isKana = 'char' in correct
  const isVocab = 'word' in correct

  const pool = allItems.value.filter((i) => {
    if (getId(i) === correctId) return false
    if (isSentence && 'japanese' in i) return true
    if (isKana && 'char' in i) return true
    if (isVocab && 'word' in i) return true
    return false
  })

  while (opts.length < 4) {
    const random = pool[Math.floor(Math.random() * pool.length)]
    if (random && !opts.some((o) => getId(o) === getId(random))) {
      opts.push(random)
    }
  }

  return opts.sort(() => Math.random() - 0.5)
}

const nextQuestion = () => {
  isAnswered.value = false
  selectedOption.value = null
  isCorrect.value = false

  // Pick random item
  const random = allItems.value[Math.floor(Math.random() * allItems.value.length)]

  if (random) {
    currentQuestion.value = random
    options.value = generateOptions(random)

    // Auto play
    setTimeout(() => {
      playAudio()
    }, 300)
  }
}

const checkAnswer = async (option: QuizItem) => {
  if (isAnswered.value || !currentQuestion.value) return

  selectedOption.value = option
  isAnswered.value = true

  const isRight = getId(option) === getId(currentQuestion.value)
  isCorrect.value = isRight

  let newCombo = userStore.currentCombo

  if (isRight) {
    newCombo++
    if ([10, 25, 50, 100].includes(newCombo)) happyConfetti()
    userStore.markAsMastered(getId(currentQuestion.value))
    await userStore.recordAnswer(true, 1.5) // 1.5x multiplier for Audio
  } else {
    newCombo = 0
    await userStore.recordAnswer(false, 1.5)
  }
  userStore.updateBestCombo(newCombo)
}

onMounted(() => {
  isLoading.value = false
  nextQuestion()
})
</script>

<template>
  <div class="flex flex-col items-center w-full px-4 font-outfit">
    <div v-if="isLoading" class="w-full flex justify-center py-32">
      <LoadingSpinner size="xl" text="Préparation..." />
    </div>

    <template v-else>
      <TrainingHeader title="Quiz Audio" />

      <!-- Stats -->
      <div class="card p-2 px-4 shadow-sm border-2 border-tanuki-green bg-white flex items-center gap-4 mb-6">
        <div class="flex items-center gap-2 font-bold text-tanuki-brown">
          <Trophy class="w-4 h-4 text-tanuki-gold" />
          <span>{{ score }}</span>
        </div>
        <div class="h-4 w-0.5 bg-tanuki-brown/20 rounded-full"></div>
        <div class="flex items-center gap-1 font-bold text-tanuki-green">
          <span>{{ combo }}</span>
          <Flame class="w-4 h-4 fill-orange-500 text-orange-600" />
        </div>
      </div>

      <!-- Main Game Area -->
      <div class="w-full max-w-2xl flex flex-col items-center">
        <!-- Audio Player (Question) -->
        <div class="mb-8 w-full flex justify-center">
          <button @click="playAudio" aria-label="Réécouter"
            class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-linear-to-b from-tanuki-green to-green-700 shadow-xl border-4 border-white ring-4 ring-tanuki-green/20 flex items-center justify-center text-white transition-all active:scale-95 group relative overflow-hidden">
            <!-- Ping Animation -->
            <span v-if="isPlaying" class="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></span>

            <Volume2 v-if="isPlaying" class="w-12 h-12 md:w-16 md:h-16 animate-pulse" />
            <Play v-else class="w-12 h-12 md:w-16 md:h-16 fill-current ml-2" />

            <span
              class="absolute -bottom-8 text-xs font-bold text-tanuki-brown/50 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Réécouter</span>
          </button>
        </div>

        <!-- Options Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mb-24">
          <button v-for="(opt, idx) in options" :key="idx" @click="checkAnswer(opt)" :disabled="isAnswered"
            class="btn-3d w-full z-10 relative group py-4 md:py-6 text-lg md:text-xl" :class="[
              isAnswered && getId(opt) === getId(currentQuestion!)
                ? 'bg-green-500 text-white border-green-700'
                : isAnswered && selectedOption === opt && getId(opt) !== getId(currentQuestion!)
                  ? 'bg-red-500 text-white border-red-700'
                  : 'btn-secondary',
            ]">
            <span class="relative z-10">{{ getOptionText(opt) }}</span>
          </button>
        </div>
      </div>

      <FeedbackDrawer :isOpen="isAnswered" :isCorrect="isCorrect"
        :correctAnswer="currentQuestion ? getOptionText(currentQuestion) : ''" @next="nextQuestion">
        <template #details>
          <div v-if="currentQuestion" class="mt-1 flex flex-col">
            <div class="flex items-center gap-2 text-lg font-bold text-gray-800">
              <span class="font-japanese">
                {{
                  'word' in currentQuestion
                    ? (currentQuestion as any).word
                    : 'char' in currentQuestion
                      ? (currentQuestion as any).char
                      : (currentQuestion as any).japanese
                }}
              </span>
              <span class="opacity-40 font-normal text-base">
                {{ 'romaji' in currentQuestion ? (currentQuestion as any).romaji : '' }}
              </span>
            </div>
            <p v-if="isCorrect" class="text-sm font-bold text-green-600">
              {{ getOptionText(currentQuestion) }}
            </p>
          </div>
        </template>
      </FeedbackDrawer>
    </template>
  </div>
</template>
