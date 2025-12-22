<script setup lang="ts">
import { ref } from 'vue';
import { hiragana, katakana, type KanaChar } from '@/data/kana';
import { RefreshCw } from 'lucide-vue-next';

const allKana = [...hiragana, ...katakana].filter(k => k.char); // Filter out empty spacers
const currentCard = ref<KanaChar>(getRandomKana());
const isFlipped = ref(false);

function getRandomKana() {
    const randomIndex = Math.floor(Math.random() * allKana.length);
    return allKana[randomIndex];
}

function nextCard() {
    isFlipped.value = false;
    setTimeout(() => {
        currentCard.value = getRandomKana();
    }, 200); // Wait for unflip animation
}

function flipCard() {
    isFlipped.value = !isFlipped.value;
}
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 class="text-4xl font-display font-bold text-tanuki-green mb-12">Flashcards</h2>

        <!-- Flashcard Scene -->
        <div class="scene w-80 h-96 perspective-1000 cursor-pointer group" @click="flipCard">
            <div class="card relative w-full h-full transition-transform duration-500 transform-style-3d shadow-xl rounded-2xl"
                :class="{ 'rotate-y-180': isFlipped }">
                <!-- Front -->
                <div
                    class="face front absolute w-full h-full bg-white flex items-center justify-center rounded-2xl backface-hidden border-2 border-tanuki-green/10">
                    <span class="text-9xl font-bold text-tanuki-brown-dark">{{ currentCard.char }}</span>
                    <span class="absolute bottom-4 text-gray-400 text-sm">Tap to reveal</span>
                </div>

                <!-- Back -->
                <div
                    class="face back absolute w-full h-full bg-tanuki-green text-white flex flex-col items-center justify-center rounded-2xl backface-hidden rotate-y-180">
                    <span class="text-6xl font-bold mb-4">{{ currentCard.romaji }}</span>
                    <span class="text-xl opacity-80">Romaji</span>
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
