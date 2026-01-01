<script setup lang="ts">
import { ref, computed } from 'vue'
import { kanjiList, type Kanji } from '@/data/kanji'
import KanjiCard from '@/components/KanjiCard.vue'
import KanjiModal from '@/components/KanjiModal.vue'
import { Search } from 'lucide-vue-next'

const searchQuery = ref('')
const selectedLevel = ref(5)
const selectedKanji = ref<Kanji | null>(null)
const isModalOpen = ref(false)
const currentCategory = ref('All')

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
    if (currentCategory.value !== 'All' && k.category !== currentCategory.value) return false

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
</script>

<template>
  <div class="flex flex-col items-center w-full px-4 py-0 pb-24">
    <div class="flex flex-col items-center w-full max-w-4xl mb-6">
      <div class="text-center mb-2">
        <h1 class="text-3xl md:text-4xl font-display font-bold text-tanuki-green mb-1 md:mb-8">Kanji N{{ selectedLevel
        }}</h1>
      </div>

      <!-- Search Bar -->
      <div class="relative w-full max-w-md mb-4">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input v-model="searchQuery" type="text" placeholder="Rechercher (日, Soleil...)"
          class="w-full pl-10 pr-4 py-2 bg-white border-2 border-tanuki-green focus:border-tanuki-green outline-none rounded-xl transition-colors shadow-sm" />
      </div>

      <!-- Category Tabs -->
      <div class="w-full">
        <div class="flex flex-wrap justify-center gap-2 px-2">
          <button v-for="cat in categories" :key="cat" @click="currentCategory = cat" :class="['px-4 py-1.5 rounded-full font-bold transition-all border-2 text-sm md:text-base whitespace-nowrap',
            currentCategory === cat
              ? 'bg-tanuki-green text-white border-tanuki-green shadow-sm'
              : 'bg-white text-tanuki-brown border-tanuki-brown/20 hover:border-tanuki-green/50']">
            {{ categoryTranslations[cat] }}
          </button>
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
  </div>
</template>
