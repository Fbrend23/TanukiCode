<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { hiragana, katakana, type KanaChar } from '@/data/kana';
import { vocabulary, type VocabularyWord } from '@/data/vocabulary';
import { RefreshCw, Volume2 } from 'lucide-vue-next';
import { speakJapanese } from '@/utils/audio';

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
    const list = currentList.value;
    if (list.length === 0) {
        // Fallback or handle empty list - though typically shouldn't happen with static data
        return list[0] as CardData;
    }
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex] as CardData;
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

function playSound(e?: Event) {
    if (e) e.stopPropagation();
    speakJapanese(frontText.value);
}

const fontSizeClass = computed(() => {
    const len = frontText.value.length;
    if (len === 1) return 'text-8xl md:text-9xl';
    if (len <= 3) return 'text-6xl md:text-8xl';
    if (len <= 5) return 'text-5xl md:text-7xl';
    if (len <= 7) return 'text-4xl md:text-6xl';
    return 'text-2xl md:text-4xl';
});
</script>

<template>
    <div class="flex flex-col items-center justify-start min-h-[60vh]">
        <h2 class="text-3xl md:text-4xl font-display font-bold text-tanuki-green mb-1 md:mb-8">Flashcards</h2>

        <!-- Mode Toggle -->
        <div class="card flex flex-wrap justify-center p-1 mb-2 md:mb-8 max-w-full">
            <button @click="mode = 'hiragana'"
                :class="['px-4 py-2 rounded-full font-bold transition-all capitalize text-sm md:text-base', mode === 'hiragana' ? 'bg-tanuki-green text-white shadow-sm' : 'text-gray-500 hover:text-tanuki-green']">
                Hiragana
            </button>
            <button @click="mode = 'katakana'"
                :class="['px-4 py-2 rounded-full font-bold transition-all capitalize text-sm md:text-base', mode === 'katakana' ? 'bg-tanuki-green text-white shadow-sm' : 'text-gray-500 hover:text-tanuki-green']">
                Katakana
            </button>
            <button @click="mode = 'vocabulary'"
                :class="['px-4 py-2 rounded-full font-bold transition-all capitalize text-sm md:text-base', mode === 'vocabulary' ? 'bg-tanuki-green text-white shadow-sm' : 'text-gray-500 hover:text-tanuki-green']">
                Vocabulaire
            </button>
        </div>

        <!-- Flashcard Scene -->
        <div class="scene w-72 h-80 md:w-80 md:h-96 perspective-1000 cursor-pointer group" @click="flipCard">
            <div class="relative w-full h-full transition-transform duration-500 transform-style-3d shadow-xl rounded-2xl"
                :class="{ 'rotate-y-180': isFlipped }">
                <!-- Front -->
                <div
                    class="face front absolute w-full h-full bg-white flex items-center justify-center rounded-2xl backface-hidden border-2 border-tanuki-green">
                    <div class="text-center px-4">
                        <span
                            :class="['block font-bold text-tanuki-brown-dark mb-2 break-all transition-all', fontSizeClass]">{{
                                frontText }}</span>
                        <!-- Show reading for vocab on front if needed, or keeping it hidden -->
                    </div>

                    <!-- Audio Button -->
                    <button @click="playSound"
                        class="absolute top-4 right-4 p-2 rounded-full hover:bg-tanuki-beige/50 text-tanuki-gold transition-colors">
                        <Volume2 class="w-6 h-6" />
                    </button>

                    <span class="absolute bottom-4 text-gray-400 text-sm">Appuyer pour révéler</span>
                </div>

                <!-- Back -->
                <div
                    class="face back absolute w-full h-full bg-tanuki-green text-white flex flex-col items-center justify-center rounded-2xl backface-hidden rotate-y-180 border-2 border-tanuki-green">
                    <span class="text-4xl font-bold mb-4 px-4 text-center">{{ currentCard.meaning ||
                        currentCard.romaji
                        }}</span>
                    <span class="text-xl opacity-80">{{ currentCard.meaning ? 'Signification' : 'Romaji' }}</span>
                    <span v-if="currentCard.meaning" class="text-sm mt-2 opacity-60">({{ currentCard.romaji
                        }})</span>
                </div>
            </div>
        </div>

        <!-- Controls -->
        <div class="mt-6 flex gap-4">
            <button @click="nextCard"
                class="btn-3d btn-gold flex items-center gap-2 py-3 px-8 text-lg w-auto inline-flex">
                <RefreshCw class="w-5 h-5" />
                Suivant
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
