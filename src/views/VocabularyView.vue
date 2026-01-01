<script setup lang="ts">
import { ref, computed } from 'vue'
import { vocabulary, type VocabularyWord } from '@/data/vocabulary'
import { Search, Volume2, Info, Check } from 'lucide-vue-next'
import { speakJapanese } from '@/utils/audio'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const isMastered = (word: VocabularyWord) => userStore.masteredItems.includes(word.word)
const toggleMastery = (word: VocabularyWord) => userStore.toggleMastery(word.word)

const searchQuery = ref('')
const currentCategory = ref('All')

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

const filteredVocabulary = computed(() => {
    const query = searchQuery.value.toLowerCase()
    return vocabulary.filter(word => {
        // Filter by Category
        if (currentCategory.value !== 'All' && word.category !== currentCategory.value) return false

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
</script>

<template>
    <div class="flex flex-col items-center w-full px-4 py-0 pb-24">
        <div class="flex flex-col items-center w-full max-w-4xl mb-6">
            <div class="text-center mb-2">
                <h1 class="text-3xl md:text-4xl font-display font-bold text-tanuki-green mb-1 md:mb-8">Vocabulaire</h1>
            </div>

            <!-- Search Bar -->
            <div class="relative w-full max-w-md mb-4">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input v-model="searchQuery" type="text" placeholder="Rechercher (Chat, Inu...)"
                    class="w-full pl-10 pr-4 py-2 bg-white border-2 border-tanuki-green focus:border-tanuki-green outline-none rounded-xl transition-colors shadow-sm" />
            </div>

            <!-- Category Tabs -->
            <div class="w-full">
                <div class="flex flex-wrap justify-center gap-2 px-2">
                    <button v-for="cat in categories" :key="cat" @click="currentCategory = cat" :class="['px-4 py-1.5 rounded-full font-bold transition-all border-2 text-sm md:text-base whitespace-nowrap',
                        currentCategory === cat
                            ? 'bg-tanuki-green text-white border-tanuki-green shadow-sm'
                            : 'bg-white text-tanuki-brown border-tanuki-brown/20 hover:border-tanuki-green/50']">
                        {{ categoryTranslations[cat as string] || cat }}
                    </button>
                </div>
            </div>
        </div>

        <div
            class="flex items-center gap-2 text-tanuki-brown/80 bg-tanuki-beige/30 px-4 py-2 rounded-lg mb-1 text-sm animate-fade-in border border-tanuki-beige">
            <Info class="w-4 h-4 text-tanuki-gold" />
            <span>Cliquez sur un mot pour écouter sa prononciation.</span>
        </div>


        <!-- Grid -->
        <div v-if="filteredVocabulary.length > 0"
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full max-w-5xl">
            <div v-for="word in filteredVocabulary" :key="word.romaji" @click="playAudio(word)"
                class="card p-4 flex flex-col items-center text-center bg-white hover:shadow-xl transition-all border-2 cursor-pointer relative group"
                :class="[isMastered(word) ? 'border-tanuki-green bg-tanuki-green/5' : 'hover:border-tanuki-green-light']">

                <button @click.stop="toggleMastery(word)"
                    class="absolute top-2 left-2 p-1 rounded-full transition-colors z-20"
                    :class="[isMastered(word) ? 'bg-tanuki-green text-white hover:bg-tanuki-green-light' : 'bg-gray-100 text-gray-300 hover:bg-gray-200 hover:text-gray-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity']">
                    <Check class="w-3 h-3 stroke-[4]" />
                </button>

                <button @click.stop="playAudio(word)"
                    class="absolute top-1.5 right-2 text-tanuki-brown/40 hover:text-tanuki-green transition-colors p-1 rounded-full hover:bg-tanuki-green/10">
                    <Volume2 class="w-4 h-4" />
                </button>

                <div class="mb-1">
                    <p class="text-xs text-tanuki-brown/60 font-bold tracking-wide uppercase">{{
                        categoryTranslations[word.category] }}</p>
                </div>

                <div class="flex flex-col items-center justify-center flex-grow py-2">
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
</template>
