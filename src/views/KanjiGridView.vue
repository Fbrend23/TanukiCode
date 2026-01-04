<script setup lang="ts">
import { ref, computed } from 'vue'
import { kanjiList, type Kanji } from '@/data/kanji'
import KanjiCard from '@/components/KanjiCard.vue'
import KanjiModal from '@/components/KanjiModal.vue'
import { Search, Settings2, X } from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore'

const searchQuery = ref('')
const selectedLevel = ref(5)
const selectedKanji = ref<Kanji | null>(null)
const isModalOpen = ref(false)
const isFilterModalOpen = ref(false)
const selectedCategories = ref<string[]>([])
const userStore = useUserStore()
const hideMastered = ref(false)

// Mastery Stats
const totalKanji = computed(() => kanjiList.filter(k => k.jlpt === selectedLevel.value).length)
const masteredKanji = computed(() => {
  return kanjiList.filter(k =>
    k.jlpt === selectedLevel.value &&
    userStore.masteredItems.includes(k.character)
  ).length
})
const progressPercentage = computed(() => {
  if (totalKanji.value === 0) return 0
  return Math.round((masteredKanji.value / totalKanji.value) * 100)
})

const categories = [
  'All',
  'Numbers',
  'Time',
  'People',
  'Nature',
  'Directions',
  'Verbs',
  'Adjectives',
  'Life'
]

const categoryTranslations: Record<string, string> = {
  'All': 'Tous',
  'Numbers': 'Chiffres',
  'Time': 'Temps',
  'People': 'Personnes',
  'Nature': 'Nature',
  'Directions': 'Directions',
  'Verbs': 'Verbes',
  'Adjectives': 'Adjectifs',
  'Life': 'Quotidien'
}

const filteredKanji = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return kanjiList.filter(k => {
    // Filter by JLPT level
    if (k.jlpt !== selectedLevel.value) return false

    // Filter by Category
    if (selectedCategories.value.length > 0 && !selectedCategories.value.includes(k.category)) return false

    // Filter by Mastery
    if (hideMastered.value && userStore.masteredItems.includes(k.character)) return false

    // Search by character, reading, or meaning
    if (!query) return true

    return (
      k.character.includes(query) ||
      k.meaning.some(m => m.toLowerCase().includes(query)) ||
      k.onyomi.some(r => r.toLowerCase().includes(query)) ||
      k.kunyomi.some(r => r.toLowerCase().includes(query))
    )
  })
})

const openModal = (kanji: Kanji) => {
  selectedKanji.value = kanji
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    selectedKanji.value = null
  }, 300)
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
</script>

<template>
  <div class="flex flex-col items-center w-full px-4 py-0 pb-24">
    <div class="flex flex-col items-center w-full max-w-4xl mb-6">
      <div class="text-center mb-2">
        <h1 class="text-3xl md:text-4xl font-display font-bold text-tanuki-green mb-1 md:mb-8">Kanji N{{ selectedLevel
          }}</h1>
      </div>

      <div class="relative w-full max-w-2xl flex flex-col md:block gap-2 mb-6">
        <!-- Search (Centered) -->
        <div class="relative w-full max-w-md mx-auto z-10">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input v-model="searchQuery" type="text" placeholder="Rechercher (日, Soleil...)" class="search-bar" />
        </div>

        <!-- Filter Button (Absolute Right on Desktop) -->
        <div class="flex justify-center md:absolute md:right-0 md:top-0 md:bottom-0 md:flex items-center">
          <button @click="isFilterModalOpen = true" class="btn-filter md:w-auto w-full max-w-md">
            <Settings2 class="w-5 h-5" />
            <span>Filtres</span>
            <div v-if="hideMastered || selectedCategories.length > 0" class="w-2 h-2 rounded-full bg-tanuki-gold"></div>
          </button>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="w-full max-w-4xl px-2 mb-1">
        <div class="flex flex-col gap-1 ">
          <div class="flex justify-between text-sm font-bold text-tanuki-brown">
            <span>Progression N{{ selectedLevel }}</span>
            <span>{{ masteredKanji }} / {{ totalKanji }} ({{ progressPercentage }}%)</span>
          </div>
          <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-tanuki-gold transition-all duration-500 ease-out"
              :style="{ width: `${progressPercentage}%` }"></div>
          </div>
        </div>


      </div>


    </div>



    <!-- Grid -->
    <div v-if="filteredKanji.length > 0" class="flex flex-wrap justify-center items-stretch gap-2 md:gap-4 w-full">
      <KanjiCard v-for="k in filteredKanji" :key="k.character" :kanji="k" @click="openModal(k)"
        class="w-[calc(50%-0.5rem)] flex-grow md:flex-grow-0 md:w-52 lg:w-60" />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-400">
      <p>Aucun Kanji trouvé pour "{{ searchQuery }}" dans cette catégorie.</p>
    </div>

    <!-- Modal -->
    <KanjiModal :kanji="selectedKanji" :is-open="isModalOpen" @close="closeModal" />

    <!-- Filter Modal -->
    <div v-if="isFilterModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="isFilterModalOpen = false"></div>
      <div
        class="relative bg-white rounded-3xl w-full max-w-sm max-h-[80vh] overflow-y-auto shadow-xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-display font-bold text-tanuki-green">Filtres</h2>
          <button @click="isFilterModalOpen = false" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X class="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <!-- Categories -->
        <div class="flex flex-col gap-3">
          <h3 class="font-bold text-tanuki-brown">Catégorie</h3>
          <div class="flex flex-wrap gap-2">
            <button v-for="cat in categories" :key="cat" @click="toggleCategory(cat)" :class="['px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors border-2',
              (cat === 'All' ? selectedCategories.length === 0 : selectedCategories.includes(cat))
                ? 'bg-tanuki-green text-white border-tanuki-green'
                : 'bg-white text-gray-500 border-gray-200 hover:border-tanuki-green/50']">
              {{ categoryTranslations[cat] }}
            </button>
          </div>
        </div>

        <div class="h-[1px] bg-gray-100 w-full"></div>

        <!-- Toggle Mastered -->
        <label
          class="flex items-center justify-between p-4 bg-white border-2 border-tanuki-brown rounded-xl cursor-pointer select-none">
          <span class="font-bold text-tanuki-brown">Masquer maîtrisés</span>
          <div class="relative">
            <input type="checkbox" v-model="hideMastered" class="peer sr-only">
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tanuki-green">
            </div>
          </div>
        </label>

        <button @click="isFilterModalOpen = false"
          class="w-full py-3 bg-tanuki-green text-white font-bold rounded-xl shadow-lg shadow-tanuki-green/20 hover:bg-tanuki-green-dark transition-colors mt-2">
          Voir les résultats
        </button>
      </div>
    </div>
  </div>
</template>
