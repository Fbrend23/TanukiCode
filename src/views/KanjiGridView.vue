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

const filteredKanji = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return kanjiList.filter(k => {
    // Filter by JLPT level (for future expansion)
    if (k.jlpt !== selectedLevel.value) return false

    // Search by character, reading, or meaning
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
  }, 300) // Clear after animation
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 pb-24">
    <div class="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-display font-bold text-tanuki-brown-dark mb-2">Kanji N{{ selectedLevel }}</h1>
        <p class="text-tanuki-brown font-medium">Maîtrisez les idéogrammes japonais.</p>
      </div>

      <!-- Search Bar -->
      <div class="relative w-full md:w-64">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input v-model="searchQuery" type="text" placeholder="Rechercher (日, Sun...)"
          class="w-full pl-10 pr-4 py-2 bg-white border-2 border-tanuki-beige/50 focus:border-tanuki-green outline-none rounded-xl transition-colors" />
      </div>
    </div>

    <!-- Grid -->
    <div v-if="filteredKanji.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
      <KanjiCard v-for="k in filteredKanji" :key="k.character" :kanji="k" @click="openModal(k)" />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-400">
      <p>Aucun Kanji trouvé pour "{{ searchQuery }}".</p>
    </div>

    <!-- Modal -->
    <KanjiModal :kanji="selectedKanji" :is-open="isModalOpen" @close="closeModal" />
  </div>
</template>
