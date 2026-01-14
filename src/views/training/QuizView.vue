<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { hiragana, katakana, type KanaChar } from '@/data/kana'
import { vocabulary, type VocabularyWord } from '@/data/vocabulary'
import { kanjiList, type Kanji } from '@/data/kanji'
import { grammarLessons, type GrammarLesson } from '@/data/grammar'
import { sentences, type Sentence } from '@/data/sentences'
import {
  Check,
  Trophy,
  Settings2,
  Grid3x3,
  BookOpen,
  ScrollText,
  PenTool,
  Eye,
  Pencil,
  MessageSquare,
  ArrowLeft,
  Flame,
} from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore'
import { happyConfetti } from '@/utils/confetti'
import { onMounted } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import KanjiWriter from '@/components/kanji/KanjiWriter.vue'
import KanaWriter from '@/components/kana/KanaWriter.vue'
import FeedbackDrawer from '@/components/training/FeedbackDrawer.vue'

const router = useRouter()
const isLoading = ref(true)

type QuizItem = (KanaChar | VocabularyWord | Kanji | GrammarLesson | Sentence) & {
  romaji?: string
  meaning?: string | string[]
  title?: string
  summary?: string
  char?: string
  character?: string
  word?: string
  japanese?: string
  translation?: string
}

const userStore = useUserStore()

// Categories - Init from LocalStorage
const savedCategories = localStorage.getItem('tanuki-quiz-categories')
const categories = ref(
  savedCategories
    ? JSON.parse(savedCategories)
    : {
        kana: true,
        vocabulary: true,
        kanji: true,
        grammar: true,
        sentences: true,
      },
)

// Modes - Init from LocalStorage
const savedModes = localStorage.getItem('tanuki-quiz-modes')
const modes = ref(
  savedModes
    ? JSON.parse(savedModes)
    : {
        reading: true, // QCM
        writing: false, // Draw
      },
)

// Persist settings
watch(
  categories,
  (newVal) => {
    localStorage.setItem('tanuki-quiz-categories', JSON.stringify(newVal))
  },
  { deep: true },
)

watch(
  modes,
  (newVal) => {
    localStorage.setItem('tanuki-quiz-modes', JSON.stringify(newVal))
  },
  { deep: true },
)

// Display Settings - Init from LocalStorage
const savedDisplaySettings = localStorage.getItem('tanuki-quiz-display')
const displaySettings = ref(
  savedDisplaySettings
    ? JSON.parse(savedDisplaySettings)
    : {
        answerMode: 'translation' as 'translation' | 'romaji',
      },
)

watch(
  displaySettings,
  (newVal) => {
    localStorage.setItem('tanuki-quiz-display', JSON.stringify(newVal))
  },
  { deep: true },
)

// Game State
const currentQuestion = ref<QuizItem>({} as QuizItem)
const currentQuestionType = ref<'reading' | 'writing'>('reading')
const options = ref<QuizItem[]>([])
const selectedOption = ref<QuizItem | null>(null)
const isAnswered = ref(false)
const isSkipped = ref(false)
const xpMultiplier = ref(1)

const score = computed(() => userStore.score)
const combo = computed(() => userStore.currentCombo)

const filteredItems = computed(() => {
  const items: QuizItem[] = []
  if (categories.value.kana) items.push(...hiragana, ...katakana)
  if (categories.value.vocabulary) items.push(...vocabulary)
  if (categories.value.kanji) items.push(...kanjiList)
  if (categories.value.grammar) items.push(...grammarLessons)
  if (categories.value.sentences) items.push(...sentences)
  return items
})

const fontSizeClass = computed(() => {
  const text = getDisplayText(currentQuestion.value)
  if (text.length <= 2) return 'text-6xl md:text-8xl'
  if (text.length <= 6) return 'text-4xl md:text-6xl'
  if (text.length <= 15) return 'text-2xl md:text-4xl'
  return 'text-xl md:text-2xl'
})

function getRandomItem(): QuizItem {
  const items = filteredItems.value
  if (items.length === 0) return hiragana[0] as QuizItem
  return items[Math.floor(Math.random() * items.length)] as QuizItem
}

function getId(item: QuizItem): string {
  if ('char' in item && item.char) return item.char
  if ('character' in item && item.character) return item.character
  if ('word' in item && item.word) return item.word
  if ('id' in item && item.id) return item.id
  return 'unknown'
}

function getAnswerText(item: QuizItem): string {
  if ('translation' in item && 'romaji' in item) {
    return displaySettings.value.answerMode === 'romaji' ? item.romaji! : item.translation!
  }
  if ('word' in item) {
    if (displaySettings.value.answerMode === 'romaji') return item.romaji!
  }
  if ('char' in item && item.romaji) return item.romaji
  if ('translation' in item && item.translation) return item.translation
  if ('meaning' in item && item.meaning) {
    const m = item.meaning
    if (Array.isArray(m)) return m[0] || ''
    return m || ''
  }
  if ('romaji' in item && item.romaji) return item.romaji
  if ('summary' in item && item.summary) return item.summary
  return ''
}

function generateOptions(correct: QuizItem): QuizItem[] {
  const opts = [correct]
  const correctId = getId(correct)

  const sameCategoryItems = filteredItems.value.filter((i) => {
    const isCorrectType =
      ('char' in correct && 'char' in i) ||
      ('character' in correct && 'character' in i) ||
      ('word' in correct && 'word' in i) ||
      ('id' in correct && 'id' in i)
    return isCorrectType && getId(i) !== correctId
  })

  const pool = sameCategoryItems.length >= 3 ? sameCategoryItems : filteredItems.value

  while (opts.length < 4) {
    const randomItem = pool[Math.floor(Math.random() * pool.length)]
    if (!randomItem) break

    const randomId = getId(randomItem)
    const randomAns = getAnswerText(randomItem)

    const isDuplicateId = opts.some((o) => getId(o) === randomId)
    const isDuplicateAns = opts.some((o) => getAnswerText(o) === randomAns)

    if (!isDuplicateId && !isDuplicateAns) {
      opts.push(randomItem)
    }
  }
  return opts.sort(() => Math.random() - 0.5)
}

function determineQuestionType(item: QuizItem): 'reading' | 'writing' {
  const isKanji = 'character' in item && 'onyomi' in item
  const isKana = 'char' in item && item.char

  if (!modes.value.writing) return 'reading'
  if (!isKanji && !isKana) return 'reading'
  if (!modes.value.reading) return 'writing'
  return Math.random() > 0.5 ? 'writing' : 'reading'
}

async function checkAnswer(option: QuizItem) {
  if (isAnswered.value) return

  selectedOption.value = option
  isAnswered.value = true

  const isCorrectAnswer = getId(option) === getId(currentQuestion.value)

  let newCombo = userStore.currentCombo
  if (isCorrectAnswer) {
    newCombo++
    if ([10, 25, 50, 100].includes(newCombo)) {
      happyConfetti()
    }
    userStore.markAsMastered(getId(currentQuestion.value))
  } else {
    newCombo = 0
  }

  userStore.updateBestCombo(newCombo)
  await userStore.recordAnswer(isCorrectAnswer, xpMultiplier.value)
}

async function handleWritingSuccess() {
  if (isAnswered.value) return
  isAnswered.value = true

  let newCombo = userStore.currentCombo
  newCombo++
  if ([10, 25, 50, 100].includes(newCombo)) {
    happyConfetti()
  }
  userStore.markAsMastered(getId(currentQuestion.value))
  userStore.updateBestCombo(newCombo)
  await userStore.recordAnswer(true, xpMultiplier.value)
}

async function handleManualSuccess() {
  if (isAnswered.value) return
  isAnswered.value = true
  isSkipped.value = true
  userStore.markAsMastered(getId(currentQuestion.value))
}

const showSettings = ref(false)

function nextQuestion() {
  const item = getRandomItem()
  currentQuestion.value = item
  currentQuestionType.value = determineQuestionType(item)

  if (currentQuestionType.value === 'reading') {
    options.value = generateOptions(currentQuestion.value)
  } else {
    options.value = []
  }

  selectedOption.value = null
  isAnswered.value = false
  isSkipped.value = false
}

const isCorrect = computed(() => {
  if (!selectedOption.value) return false
  return getId(selectedOption.value) === getId(currentQuestion.value)
})

function getDisplayText(item: QuizItem) {
  if ('char' in item && item.char) return item.char
  if ('character' in item && item.character) return item.character
  if ('word' in item && item.word) return item.word
  if ('id' in item && item.id) return item.japanese!
  if ('title' in item && item.title) return item.title
  return '?'
}

// Ensure at least one category/mode is active
watch(
  categories,
  (newVal) => {
    if (!Object.values(newVal).some(Boolean)) {
      categories.value.kana = true
    }
    nextQuestion()
  },
  { deep: true },
)

watch(
  modes,
  (newVal) => {
    if (!newVal.reading && !newVal.writing) {
      modes.value.reading = true
    }
    nextQuestion()
  },
  { deep: true },
)

onMounted(() => {
  isLoading.value = false
  nextQuestion()
})
</script>

<template>
  <div class="flex flex-col items-center w-full px-2 md:px-4">
    <div v-if="isLoading" class="w-full flex justify-center py-32">
      <LoadingSpinner size="xl" text="Préparation..." />
    </div>

    <template v-else>
      <div class="w-full relative flex items-center justify-center mb-0 md:mb-4">
        <button
          @click="router.push('/training')"
          class="absolute left-0 text-tanuki-brown/60 hover:text-tanuki-brown transition-colors p-2 rounded-full hover:bg-stone-100"
        >
          <ArrowLeft class="w-6 h-6" />
        </button>
        <h2 class="text-2xl md:text-4xl font-display font-bold text-tanuki-green text-center">
          Quiz
        </h2>
      </div>

      <div class="w-full flex flex-col items-center max-w-4xl mx-auto">
        <div class="relative w-full max-w-2xl flex flex-col md:block mb-2">
          <!-- Score & Streak (Centered) -->
          <div class="relative w-full max-w-md mx-auto z-10">
            <div
              class="flex items-center justify-between gap-0 card p-2 px-4 shadow-sm text-sm border-2 border-tanuki-green w-full bg-white"
            >
              <div
                class="flex-1 flex items-center justify-center gap-2 font-bold text-tanuki-brown"
              >
                <Trophy class="w-4 h-4 text-tanuki-gold" />
                <span>{{ score }}/{{ userStore.totalQuestions }}</span>
              </div>

              <div class="h-4 w-0.5 bg-tanuki-brown/20 rounded-full"></div>

              <div
                class="flex-1 flex items-center justify-center gap-1 font-bold text-tanuki-green"
              >
                <span>{{ combo }}</span>
                <Flame class="w-4 h-4 fill-orange-500 text-orange-600" />
              </div>
            </div>
          </div>

          <!-- Filter Button (Absolute Right Desktop) -->
          <div
            class="mt-3 md:mt-0 flex justify-center md:absolute md:right-0 md:top-0 md:bottom-0 md:flex items-center z-10"
          >
            <button
              @click="showSettings = !showSettings"
              class="btn-filter py-2! px-3! shadow-sm md:w-auto w-full max-w-md"
            >
              <Settings2 class="w-5 h-5" />
              <span class="inline">Filtres</span>
            </button>
          </div>
        </div>

        <!-- Settings Panel -->
        <Transition name="fade">
          <div
            v-if="showSettings"
            class="card w-full mb-6 p-6 animate-fade-in shadow-none border-2 border-tanuki-green bg-white"
          >
            <h3 class="text-lg font-bold text-tanuki-brown-dark mb-4 flex items-center gap-2">
              <Settings2 class="w-5 h-5 text-tanuki-green" />
              Options du Quiz
            </h3>

            <div class="space-y-6">
              <!-- Mode Selection -->
              <div>
                <p class="text-sm font-bold text-tanuki-brown/60 uppercase tracking-widest mb-3">
                  Mode de réponse
                </p>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    @click="modes.reading = !modes.reading"
                    class="flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-bold"
                    :class="
                      modes.reading
                        ? 'border-tanuki-green bg-green-50 text-tanuki-green'
                        : 'border-tanuki-brown/10 hover:border-tanuki-brown/30 text-tanuki-brown/40'
                    "
                  >
                    <span class="flex items-center gap-2">
                      <Eye class="w-4 h-4" />
                      Lecture
                    </span>
                    <div
                      v-if="modes.reading"
                      class="w-5 h-5 bg-tanuki-green rounded-full flex items-center justify-center text-white"
                    >
                      <Check class="w-3 h-3 stroke-3" />
                    </div>
                  </button>

                  <button
                    @click="modes.writing = !modes.writing"
                    class="flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-bold"
                    :class="
                      modes.writing
                        ? 'border-tanuki-green bg-green-50 text-tanuki-green'
                        : 'border-tanuki-brown/10 hover:border-tanuki-brown/30 text-tanuki-brown/40'
                    "
                  >
                    <span class="flex items-center gap-2">
                      <Pencil class="w-4 h-4" />
                      Écriture
                    </span>
                    <div
                      v-if="modes.writing"
                      class="w-5 h-5 bg-tanuki-green rounded-full flex items-center justify-center text-white"
                    >
                      <Check class="w-3 h-3 stroke-3" />
                    </div>
                  </button>
                </div>
              </div>

              <!-- Answer Display Mode -->
              <div>
                <p class="text-sm font-bold text-tanuki-brown/60 uppercase tracking-widest mb-3">
                  Affichage des réponses (Vocabulaire)
                </p>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    @click="displaySettings.answerMode = 'translation'"
                    class="flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-bold"
                    :class="
                      displaySettings.answerMode === 'translation'
                        ? 'border-tanuki-green bg-green-50 text-tanuki-green'
                        : 'border-tanuki-brown/10 hover:border-tanuki-brown/30 text-tanuki-brown/40'
                    "
                  >
                    <span>Traduction</span>
                    <div
                      v-if="displaySettings.answerMode === 'translation'"
                      class="w-5 h-5 bg-tanuki-green rounded-full flex items-center justify-center text-white"
                    >
                      <Check class="w-3 h-3 stroke-3" />
                    </div>
                  </button>

                  <button
                    @click="displaySettings.answerMode = 'romaji'"
                    class="flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-bold"
                    :class="
                      displaySettings.answerMode === 'romaji'
                        ? 'border-tanuki-green bg-green-50 text-tanuki-green'
                        : 'border-tanuki-brown/10 hover:border-tanuki-brown/30 text-tanuki-brown/40'
                    "
                  >
                    <span>Romaji</span>
                    <div
                      v-if="displaySettings.answerMode === 'romaji'"
                      class="w-5 h-5 bg-tanuki-green rounded-full flex items-center justify-center text-white"
                    >
                      <Check class="w-3 h-3 stroke-3" />
                    </div>
                  </button>
                </div>
              </div>

              <!-- Categories -->
              <div>
                <p class="text-sm font-bold text-tanuki-brown/60 uppercase tracking-widest mb-3">
                  Contenu inclus
                </p>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <button
                    @click="categories.kana = !categories.kana"
                    class="flex items-center gap-3 px-3 py-2 rounded-lg border-2 transition-all text-sm font-bold"
                    :class="
                      categories.kana
                        ? 'border-tanuki-green bg-green-50 text-tanuki-green'
                        : 'border-tanuki-brown/10 hover:border-tanuki-brown/30 text-tanuki-brown/40'
                    "
                  >
                    <Grid3x3 class="w-4 h-4" />
                    Kana
                  </button>
                  <button
                    @click="categories.vocabulary = !categories.vocabulary"
                    class="flex items-center gap-3 px-3 py-2 rounded-lg border-2 transition-all text-sm font-bold"
                    :class="
                      categories.vocabulary
                        ? 'border-tanuki-green bg-green-50 text-tanuki-green'
                        : 'border-tanuki-brown/10 hover:border-tanuki-brown/30 text-tanuki-brown/40'
                    "
                  >
                    <BookOpen class="w-4 h-4" />
                    Vocab
                  </button>
                  <button
                    @click="categories.kanji = !categories.kanji"
                    class="flex items-center gap-3 px-3 py-2 rounded-lg border-2 transition-all text-sm font-bold"
                    :class="
                      categories.kanji
                        ? 'border-tanuki-green bg-green-50 text-tanuki-green'
                        : 'border-tanuki-brown/10 hover:border-tanuki-brown/30 text-tanuki-brown/40'
                    "
                  >
                    <ScrollText class="w-4 h-4" />
                    Kanji
                  </button>
                  <button
                    @click="categories.grammar = !categories.grammar"
                    class="flex items-center gap-3 px-3 py-2 rounded-lg border-2 transition-all text-sm font-bold"
                    :class="
                      categories.grammar
                        ? 'border-tanuki-green bg-green-50 text-tanuki-green'
                        : 'border-tanuki-brown/10 hover:border-tanuki-brown/30 text-tanuki-brown/40'
                    "
                  >
                    <PenTool class="w-4 h-4" />
                    Grammaire
                  </button>
                  <button
                    @click="categories.sentences = !categories.sentences"
                    class="flex items-center gap-3 px-3 py-2 rounded-lg border-2 transition-all text-sm font-bold"
                    :class="
                      categories.sentences
                        ? 'border-tanuki-green bg-green-50 text-tanuki-green'
                        : 'border-tanuki-brown/10 hover:border-tanuki-brown/30 text-tanuki-brown/40'
                    "
                  >
                    <MessageSquare class="w-4 h-4" />
                    Phrases
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Quiz Card -->
        <div
          class="card w-full text-center mb-4 relative overflow-hidden group p-4 md:p-8 pt-8! min-h-[250px] md:min-h-[unset] flex flex-col items-center justify-center bg-white border-2 border-tanuki-green"
        >
          <!-- Type Badge -->
          <div
            class="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-widest text-tanuki-brown/40 border border-tanuki-brown/20 px-2 py-1 rounded flex items-center gap-2 z-20"
          >
            <span>
              {{
                'char' in currentQuestion
                  ? 'Kana'
                  : 'character' in currentQuestion
                    ? 'Kanji'
                    : 'word' in currentQuestion
                      ? 'Vocabulaire'
                      : 'japanese' in currentQuestion
                        ? 'Phrase'
                        : 'Grammaire'
              }}
            </span>
            <span
              v-if="currentQuestionType === 'writing'"
              class="bg-tanuki-green text-white px-1.5 rounded-sm"
            >
              ÉCRITURE
            </span>
          </div>

          <!-- Fixed height container for question text to prevent layout shift -->
          <div
            v-if="currentQuestionType === 'reading'"
            class="h-32 md:h-40 w-full flex items-center justify-center mb-4 pt-4"
          >
            <div :class="['font-bold text-tanuki-brown-dark text-wrap text-center', fontSizeClass]">
              {{ getDisplayText(currentQuestion) }}
            </div>
          </div>

          <div
            v-else-if="currentQuestionType === 'writing'"
            class="w-full h-full flex items-center justify-center"
          >
            <div class="relative z-10 md:scale-125 flex flex-col items-center">
              <KanjiWriter
                v-if="'character' in currentQuestion"
                :character="currentQuestion.character!"
                :size="200"
                initialMode="quiz"
                @quiz-success="handleWritingSuccess"
              />

              <KanaWriter
                v-else-if="'char' in currentQuestion"
                :character="currentQuestion.char!"
                :size="200"
                initialMode="quiz"
                @quiz-success="handleWritingSuccess"
              />

              <!-- Manual Validation Button -->
              <div v-if="!isAnswered" class="mt-4">
                <button
                  @click="handleManualSuccess"
                  class="text-xs text-gray-400 hover:text-tanuki-brown underline decoration-dotted transition-colors"
                >
                  Passer (pas de gain d'expérience)
                </button>
              </div>
            </div>
          </div>

          <p v-if="currentQuestionType === 'reading'" class="text-gray-400">
            Choisir la bonne Signification / Romaji
          </p>
        </div>

        <!-- Options -->
        <div
          v-if="currentQuestionType === 'reading'"
          class="grid grid-cols-2 gap-3 md:gap-4 w-full"
        >
          <button
            v-for="(option, idx) in options"
            :key="idx"
            @click="checkAnswer(option)"
            :disabled="isAnswered"
            class="btn-3d w-full z-10 relative group"
            :class="[
              isAnswered && getId(option) === getId(currentQuestion)
                ? 'bg-green-500 text-white border-green-700'
                : isAnswered &&
                    selectedOption === option &&
                    getId(option) !== getId(currentQuestion)
                  ? 'bg-red-500 text-white border-red-700'
                  : 'btn-secondary',
            ]"
          >
            <span
              class="absolute top-2 left-3 text-[10px] font-bold opacity-30 group-hover:opacity-100 transition-opacity hidden md:block border border-current px-1 rounded"
              >{{ idx + 1 }}</span
            >
            <span class="text-sm md:text-base leading-tight">{{ getAnswerText(option) }}</span>
          </button>
        </div>
      </div>
    </template>

    <FeedbackDrawer
      :isOpen="isAnswered"
      :isCorrect="isCorrect || currentQuestionType === 'writing'"
      :isSkipped="isSkipped"
      :correctAnswer="getAnswerText(currentQuestion)"
      @next="nextQuestion"
    />
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
