<script setup lang="ts">
import { ref, computed } from 'vue'
import { vocabulary, type VocabularyWord } from '@/data/vocabulary'
import { Search, Volume2, Check, Settings2 } from 'lucide-vue-next'
import { speakJapanese } from '@/utils/audio'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'
import MasteryBar from '@/components/MasteryBar.vue'
import FilterModal from '@/components/FilterModal.vue'

const userStore = useUserStore()
const authStore = useAuthStore()
const isMastered = (word: VocabularyWord) => userStore.masteredItems.includes(word.word)
const toggleMastery = (word: VocabularyWord) => userStore.toggleMastery(word.word)

const searchQuery = ref('')
const selectedCategories = ref<string[]>([])
const isFilterModalOpen = ref(false)

// Mastery Stats
const totalWords = computed(() => vocabulary.length)
const masteredWords = computed(() => {
  return vocabulary.filter(w => userStore.masteredItems.includes(w.word)).length
})

// Extract unique categories from data
const categories = ['All', ...new Set(vocabulary.map(v => v.category))]

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
    // Filter by Category
    if (selectedCategories.value.length > 0 && !selectedCategories.value.includes(word.category)) return false

    // Search by word, reading, romaji, or meaning
    if (!query) return true

    return (
      word.word.includes(query) ||
      word.reading.includes(query) ||
      word.romaji.toLowerCase().includes(query) ||
      word.meaning.toLowerCase().includes(query)
    )
  })
})

const playAudio = (word: VocabularyWord) => {
  speakJapanese(word.reading || word.word)
}

import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { onMounted } from 'vue'

const isLoading = ref(true)

onMounted(() => {
  isLoading.value = false
})
</script>

<template>
  <div class="flex flex-col items-center w-full px-4 py-0 pb-24">
    <div v-if="isLoading" class="w-full flex justify-center py-24">
      <LoadingSpinner size="xl" text="Recherche du vocabulaire..." />
    </div>

    <template v-else>
      <div class="flex flex-col items-center w-full max-w-4xl mb-6">
        <div class="text-center mb-2">
          <h1 class="text-3xl md:text-4xl font-display font-bold text-tanuki-green mb-1 md:mb-8">Vocabulaire</h1>
        </div>

        <div class="relative w-full max-w-2xl flex flex-col md:block gap-2 mb-6">
          <!-- Search (Centered) -->
          <div class="relative w-full max-w-md mx-auto z-10">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input v-model="searchQuery" type="text" placeholder="Rechercher (Chat, Inu...)" class="search-bar" />
          </div>

          <!-- Filter Button (Absolute Right on Desktop) -->
          <div class="flex justify-center md:absolute md:right-0 md:top-0 md:bottom-0 md:flex items-center">
            <button @click="isFilterModalOpen = true" class="btn-filter md:w-auto w-full max-w-md">
              <Settings2 class="w-5 h-5" />
              <span>Filtres</span>
              <div v-if="selectedCategories.length > 0" class="w-2 h-2 rounded-full bg-tanuki-gold"></div>
            </button>
          </div>
        </div>

        <!-- Progress Bar -->
        <MasteryBar label="Progression Vocabulaire" :current="masteredWords" :total="totalWords" />
      </div>

      <!-- Grid -->
      <div v-if="filteredVocabulary.length > 0"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full max-w-5xl">
        <div v-for="word in filteredVocabulary" :key="word.romaji" @click="playAudio(word)"
          class="card p-4 flex flex-col items-center text-center bg-white hover:shadow-xl transition-all border-2 cursor-pointer relative group"
          :class="[isMastered(word) ? 'border-tanuki-green bg-tanuki-green/5' : 'hover:border-tanuki-green-light']">

          <button v-if="authStore.user" @click.stop="toggleMastery(word)"
            class="absolute top-2 left-2 p-1 rounded-full transition-colors z-20"
            :class="[isMastered(word) ? 'bg-tanuki-green text-white hover:bg-tanuki-green-light' : 'bg-gray-100 text-gray-300 hover:bg-gray-200 hover:text-gray-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity']">
            <Check class="w-3 h-3 stroke-4" />
          </button>

          <button @click.stop="playAudio(word)"
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
    </template>

    <!-- Filter Modal -->
    <FilterModal v-model:isOpen="isFilterModalOpen">
      <!-- Categories -->
      <div class="flex flex-col gap-3">
        <h3 class="font-bold text-tanuki-brown">Catégorie</h3>
        <div class="flex flex-wrap gap-2">
          <button v-for="cat in categories" :key="cat" @click="toggleCategory(cat)" :class="['px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors border-2',
            (cat === 'All' ? selectedCategories.length === 0 : selectedCategories.includes(cat))
              ? 'bg-tanuki-green text-white border-tanuki-green'
              : 'bg-white text-gray-500 border-gray-200 hover:border-tanuki-green/50']">
            {{ categoryTranslations[cat as string] || cat }}
          </button>
        </div>
      </div>
    </FilterModal>
  </div>
</template>
