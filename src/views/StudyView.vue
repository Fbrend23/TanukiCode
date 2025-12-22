<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { hiragana, katakana, type KanaChar } from '@/data/kana';
import { vocabulary, type VocabularyWord } from '@/data/vocabulary';
import { RefreshCw } from 'lucide-vue-next';

type CardData = (KanaChar | VocabularyWord) & { romaji?: string; meaning?: string };

const mode = ref<'hiragana' | 'katakana' | 'vocabulary'>('hiragana');
const isFlipped = ref(false);

const currentList = computed(() => {
    if (mode.value === 'hiragana') return hiragana.filter(k => k.char);
    if (mode.value === 'katakana') return katakana.filter(k => k.char);
    return vocabulary;
});

const currentCard = ref<CardData>(getRandomItem());

function getRandomItem() {
    const randomIndex = Math.floor(Math.random() * currentList.value.length);
    return currentList.value[randomIndex];
}


const frontText = computed(() => {
    const card = currentCard.value;
    if ('char' in card) {
        return (card as KanaChar).char;
    }
    if ('word' in card) {
        return (card as VocabularyWord).word;
    }
    return '';
});

watch(mode, () => {
    isFlipped.value = false;
    currentCard.value = getRandomItem();
});

function nextCard() {
    isFlipped.value = false;
    setTimeout(() => {
        currentCard.value = getRandomItem();
    }, 200); // Wait for unflip animation
}

function flipCard() {
    isFlipped.value = !isFlipped.value;
}
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 class="text-4xl font-display font-bold text-tanuki-green mb-8">Flashcards</h2>

        <!-- Mode Toggle -->
        <div class="flex bg-white rounded-full p-1 shadow-md mb-8 border border-gray-200">
            <button v-for="m in ['hiragana', 'katakana', 'vocabulary']" :key="m" @click="mode = m as any"
                :class="['px-6 py-2 rounded-full font-bold transition-all capitalize', mode === m ? 'bg-tanuki-green text-white shadow-sm' : 'text-gray-500 hover:text-tanuki-green']">
                {{ m }}
            </button>
        </div>

        <!-- Flashcard Scene -->
        <div class="scene w-80 h-96 perspective-1000 cursor-pointer group" @click="flipCard">
            <div class="card relative w-full h-full transition-transform duration-500 transform-style-3d shadow-xl rounded-2xl"
                :class="{ 'rotate-y-180': isFlipped }">
                <!-- Front -->
                <div
                    class="face front absolute w-full h-full bg-white flex items-center justify-center rounded-2xl backface-hidden border-2 border-tanuki-green/10">
                    <div class="text-center">
                        <span class="block text-6xl font-bold text-tanuki-brown-dark mb-2">{{ frontText }}</span>
                        <!-- Show reading for vocab on front if needed, or keeping it hidden -->
                    </div>
                    <span class="absolute bottom-4 text-gray-400 text-sm">Tap to reveal</span>
                </div>

                <!-- Back -->
                <div
                    class="face back absolute w-full h-full bg-tanuki-green text-white flex flex-col items-center justify-center rounded-2xl backface-hidden rotate-y-180">
                    <span class="text-4xl font-bold mb-4 px-4 text-center">{{ currentCard.meaning || currentCard.romaji
                        }}</span>
                    <span class="text-xl opacity-80">{{ currentCard.meaning ? 'Meaning' : 'Romaji' }}</span>
                    <span v-if="currentCard.meaning" class="text-sm mt-2 opacity-60">({{ currentCard.romaji }})</span>
                </div>
            </div>
        </div>

        <!-- Controls -->
        <div class="mt-12 flex gap-4">
            <button @click="nextCard"
                class="flex items-center gap-2 bg-tanuki-gold hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md transition-transform hover:scale-105">
                <RefreshCw class="w-5 h-5" />
                Next Card
            </button>
        </div>
    </div>
</template>

<style scoped>
.perspective-1000 {
    perspective: 1000px;
}

.transform-style-3d {
    transform-style: preserve-3d;
}

.backface-hidden {
    backface-visibility: hidden;
}

.rotate-y-180 {
    transform: rotateY(180deg);
}
</style>
