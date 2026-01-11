<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { vocabulary, type VocabularyWord } from '@/data/vocabulary'
import { sentences, type Sentence } from '@/data/sentences'
import { Search, Volume2, Check, Settings2, Play, Info } from 'lucide-vue-next'
import { speakJapanese, playSentenceAudio } from '@/utils/audio'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'
import MasteryBar from '@/components/MasteryBar.vue'
import FilterModal from '@/components/FilterModal.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const userStore = useUserStore()
const authStore = useAuthStore()

// --- TABS STATE ---
type Tab = 'words' | 'sentences'
const activeTab = ref<Tab>('words')

// --- VOCABULARY LOGIC ---
const isMastered = (word: VocabularyWord) => userStore.masteredItems.includes(word.word)
const toggleMastery = (word: VocabularyWord) => userStore.toggleMastery(word.word)

const searchQuery = ref('')
const selectedCategories = ref<string[]>([])
const isFilterModalOpen = ref(false)

const totalWords = computed(() => vocabulary.length)
const masteredWords = computed(() => {
  return vocabulary.filter(w => userStore.masteredItems.includes(w.word)).length
})

const totalSentences = computed(() => sentences.length)
const masteredSentences = computed(() => {
  return sentences.filter(s => userStore.masteredItems.includes(s.id)).length
})

const vocabCategories = ['All', ...new Set(vocabulary.map(v => v.category))]

const categoryTranslations: Record<string, string> = {
  'All': 'Tous',
  'greetings': 'Salutations',
  'numbers': 'Chiffres',
  'colors': 'Couleurs',
  'animals': 'Animaux',
  'food': 'Nourriture',
  'nature': 'Nature',
  'family': 'Famille'
}

const toggleCategory = (cat: string) => {
  if (cat === 'All') {
    selectedCategories.value = []
    return
  }
  const index = selectedCategories.value.indexOf(cat)
  if (index === -1) {
    selectedCategories.value.push(cat)
  } else {
    selectedCategories.value.splice(index, 1)
  }
}

const filteredVocabulary = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return vocabulary.filter(word => {
    if (selectedCategories.value.length > 0 && !selectedCategories.value.includes(word.category)) return false
    if (!query) return true
    return (
      word.word.includes(query) ||
      word.reading.includes(query) ||
      word.romaji.toLowerCase().includes(query) ||
      word.meaning.toLowerCase().includes(query)
    )
  })
})

const playWordAudio = (word: VocabularyWord) => {
  speakJapanese(word.reading || word.word)
}

// --- LISTENING LOGIC ---
const searchSentenceQuery = ref('')
const selectedSentenceCategories = ref<string[]>([])
const isSentenceFilterModalOpen = ref(false)
const playingId = ref(null as string | null)

const sentenceCategories = computed(() => {
  const cats = new Set(sentences.map(s => s.category))
  return ['all', ...Array.from(cats)]
})

const toggleSentenceCategory = (cat: string) => {
  if (cat === 'all') {
    selectedSentenceCategories.value = []
    return
  }
  const index = selectedSentenceCategories.value.indexOf(cat)
  if (index === -1) {
    selectedSentenceCategories.value.push(cat)
  } else {
    selectedSentenceCategories.value.splice(index, 1)
  }
}

const filteredSentences = computed(() => {
  const query = searchSentenceQuery.value.toLowerCase()
  return sentences.filter(s => {
    // Category Filter
    if (selectedSentenceCategories.value.length > 0 && !selectedSentenceCategories.value.includes(s.category)) return false

    // Search Filter
    if (!query) return true
    return (
      s.japanese.includes(query) ||
      s.romaji.toLowerCase().includes(query) ||
      s.translation.toLowerCase().includes(query)
    )
  })
})

const playSentence = (s: Sentence) => {
  playingId.value = s.id
  playSentenceAudio(s.id, s.japanese)
  setTimeout(() => {
    if (playingId.value === s.id) playingId.value = null
  }, 3000)
}



const getSentenceCategoryLabel = (cat: string) => {
  switch (cat) {
    case 'greetings': return 'Salutations'
    case 'shopping': return 'Magasin'
    case 'restaurant': return 'Restaurant'
    case 'travel': return 'Voyage'
    case 'all': return 'Tout'
    default: return cat
  }
}


const isLoading = ref(true)
onMounted(() => {
  isLoading.value = false
})
</script>

<template>
  <div class="flex flex-col items-center w-full px-4 py-0 pb-24 font-outfit">

    <div v-if="isLoading" class="w-full flex justify-center py-24">
      <LoadingSpinner size="xl" text="Chargement..." />
    </div>

    <template v-else>
      <div class="flex flex-col items-center w-full max-w-6xl mb-6">
        <div class="text-center mb-6">
          <h1 class="text-3xl md:text-4xl font-display font-bold text-tanuki-green mb-1 md:mb-8 text-center">
            Vocabulaire</h1>

          <!-- TABS -->
          <div class="card flex p-1 shadow-none border-2 border-tanuki-green bg-white inline-flex cursor-default">
            <button @click="activeTab = 'words'"
              class="px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2"
              :class="activeTab === 'words' ? 'bg-tanuki-green text-white shadow-sm' : 'text-stone-500 hover:text-tanuki-green'">
              Mots
            </button>
            <button @click="activeTab = 'sentences'"
              class="px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2"
              :class="activeTab === 'sentences' ? 'bg-tanuki-green text-white shadow-sm' : 'text-stone-500 hover:text-tanuki-green'">
              Phrases
            </button>
          </div>
        </div>

        <!-- === TAB: WORDS === -->
        <div v-if="activeTab === 'words'"
          class="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div class="relative w-full max-w-2xl flex flex-col md:block gap-2 mb-6 mx-auto">
            <!-- Search (Centered) -->
            <div class="relative w-full max-w-md mx-auto z-10">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input v-model="searchQuery" type="text" placeholder="Rechercher (Chat, Inu...)" class="search-bar" />
            </div>

            <!-- Filter Button -->
            <div
              class="flex justify-center md:absolute md:right-0 md:top-0 md:bottom-0 md:flex items-center w-full md:w-auto mt-2 md:mt-0">
              <button @click="isFilterModalOpen = true" class="btn-filter md:w-auto w-full max-w-md">
                <Settings2 class="w-5 h-5" />
                <span>Filtres</span>
                <div v-if="selectedCategories.length > 0" class="w-2 h-2 rounded-full bg-tanuki-gold"></div>
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <MasteryBar label="Progression Vocabulaire" :current="masteredWords" :total="totalWords" />

          <!-- Grid -->
          <div v-if="filteredVocabulary.length > 0"
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full max-w-6xl mt-6">
            <div v-for="word in filteredVocabulary" :key="word.romaji" @click="playWordAudio(word)"
              class="card p-4 flex flex-col items-center text-center bg-white hover:shadow-xl transition-all border-2 cursor-pointer relative group"
              :class="[isMastered(word) ? 'border-tanuki-green bg-tanuki-green/5' : 'hover:border-tanuki-green-light']">

              <button v-if="authStore.user" @click.stop="toggleMastery(word)"
                class="absolute top-2 left-2 p-1 rounded-full transition-colors z-20"
                :class="[isMastered(word) ? 'bg-tanuki-gold text-white hover:bg-amber-400' : 'bg-gray-100 text-gray-300 hover:bg-gray-200 hover:text-gray-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity']">
                <Check class="w-3 h-3 stroke-4" />
              </button>

              <button @click.stop="playWordAudio(word)"
                class="absolute top-1.5 right-2 text-tanuki-brown/40 hover:text-tanuki-green transition-colors p-1 rounded-full hover:bg-tanuki-green/10">
                <Volume2 class="w-4 h-4" />
              </button>

              <div class="mb-1">
                <p class="text-xs text-tanuki-brown/60 font-bold tracking-wide uppercase">{{
                  categoryTranslations[word.category] }}</p>
              </div>

              <div class="flex flex-col items-center justify-center grow py-2">
                <h2 class="text-2xl md:text-3xl font-bold text-tanuki-brown mb-1">{{ word.word }}</h2>
                <p v-if="word.reading !== word.word" class="text-sm text-tanuki-brown/80 mb-1 font-japanese">{{
                  word.reading }}</p>
                <p class="text-xs text-tanuki-brown/50 font-mono mb-2">/{{ word.romaji }}/</p>
                <p class="text-base md:text-lg font-bold text-tanuki-green">{{ word.meaning }}</p>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12 text-gray-400">
            <p>Aucun mot trouvé pour "{{ searchQuery }}" dans cette catégorie.</p>
          </div>
        </div>

        <!-- === TAB: SENTENCES === -->
        <div v-if="activeTab === 'sentences'"
          class="w-full max-w-6xl animate-in fade-in slide-in-from-bottom-2 duration-300">

          <div class="relative w-full max-w-2xl flex flex-col md:block gap-2 mb-6 mx-auto">
            <!-- Search (Centered) -->
            <div class="relative w-full max-w-md mx-auto z-10">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input v-model="searchSentenceQuery" type="text" placeholder="Rechercher une phrase..."
                class="search-bar" />
            </div>

            <!-- Filter Button -->
            <div
              class="flex justify-center md:absolute md:right-0 md:top-0 md:bottom-0 md:flex items-center w-full md:w-auto mt-2 md:mt-0">
              <button @click="isSentenceFilterModalOpen = true" class="btn-filter md:w-auto w-full max-w-md">
                <Settings2 class="w-5 h-5" />
                <span>Filtres</span>
                <div v-if="selectedSentenceCategories.length > 0" class="w-2 h-2 rounded-full bg-tanuki-gold"></div>
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <MasteryBar label="Progression Phrases" :current="masteredSentences" :total="totalSentences"
            class="mb-6 max-w-2xl mx-auto" />

          <!-- Sentences List -->
          <div class="space-y-6">


            <!-- Grid of Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="s in filteredSentences" :key="s.id"
                class="card p-4 hover:shadow-xl transition-all border-2 group flex flex-col relative"
                :class="playingId === s.id ? 'bg-tanuki-green/5 border-tanuki-green' : 'hover:border-tanuki-green-light'">

                <div class="flex items-start gap-4 mb-2">
                  <!-- Audio Button -->
                  <button @click="playSentence(s)"
                    class="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-all shadow-sm border-2"
                    :class="playingId === s.id
                      ? 'bg-tanuki-green text-white border-tanuki-green scale-110'
                      : 'bg-white text-stone-400 border-stone-200 hover:border-tanuki-green hover:text-tanuki-green'">
                    <Play class="w-4 h-4 fill-current" />
                  </button>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span
                        class="text-[10px] font-bold px-2 py-0.5 rounded bg-tanuki-beige text-tanuki-brown-dark uppercase tracking-wide border border-tanuki-gold/20">
                        {{ getSentenceCategoryLabel(s.category) }}
                      </span>
                    </div>
                    <p class="text-sm text-stone-400 font-mono truncate">{{ s.romaji }}</p>
                  </div>
                </div>

                <div class="grow flex flex-col justify-center py-2">
                  <p class="text-lg font-bold text-tanuki-brown-dark leading-relaxed mb-1">{{ s.japanese }}</p>
                  <p class="text-stone-600 font-medium text-sm">
                    {{ s.translation }}
                  </p>
                </div>

                <div v-if="s.context"
                  class="mt-3 pt-2 border-t border-stone-100 text-xs text-stone-400 italic flex items-center gap-1.5">
                  <Info class="w-3 h-3" />
                  {{ s.context }}
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredSentences.length === 0" class="text-center py-12 text-stone-400">
              <p>Aucune phrase dans cette catégorie pour le moment !</p>
            </div>
          </div>
        </div>

      </div>
    </template>

    <!-- Filter Modal (Words only) -->
    <FilterModal v-model:isOpen="isFilterModalOpen">
      <div class="flex flex-col gap-3">
        <h3 class="font-bold text-tanuki-brown">Catégorie</h3>
        <div class="flex flex-wrap gap-2">
          <button v-for="cat in vocabCategories" :key="cat" @click="toggleCategory(cat)" :class="['px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors border-2',
            (cat === 'All' ? selectedCategories.length === 0 : selectedCategories.includes(cat))
              ? 'bg-tanuki-green text-white border-tanuki-green'
              : 'bg-white text-gray-500 border-gray-200 hover:border-tanuki-green/50']">
            {{ categoryTranslations[cat as string] || cat }}
          </button>
        </div>
      </div>
    </FilterModal>

    <!-- Filter Modal (Sentences) -->
    <FilterModal v-model:isOpen="isSentenceFilterModalOpen">
      <div class="flex flex-col gap-3">
        <h3 class="font-bold text-tanuki-brown">Catégorie</h3>
        <div class="flex flex-wrap gap-2">
          <button v-for="cat in sentenceCategories" :key="cat" @click="toggleSentenceCategory(cat as string)" :class="['px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors border-2 flex items-center gap-2',
            (cat === 'all' ? selectedSentenceCategories.length === 0 : selectedSentenceCategories.includes(cat as string))
              ? 'bg-tanuki-green text-white border-tanuki-green'
              : 'bg-white text-gray-500 border-gray-200 hover:border-tanuki-green/50']">
            {{ getSentenceCategoryLabel(cat as string) }}
          </button>
        </div>
      </div>
    </FilterModal>
  </div>
</template>
