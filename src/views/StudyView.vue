<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { hiragana, katakana, type KanaChar } from '@/data/kana';
import { vocabulary, type VocabularyWord } from '@/data/vocabulary';
import { kanjiList, type Kanji } from '@/data/kanji';
import { sentences, type Sentence } from '@/data/sentences';
import { RefreshCw, Volume2 } from 'lucide-vue-next';
import { speakJapanese, playKanaAudio, playSentenceAudio } from '@/utils/audio';

import { useUserStore } from '@/stores/userStore';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { onMounted } from 'vue';

const isLoading = ref(true);

onMounted(() => {
    isLoading.value = false;
});

type CardData = (KanaChar | VocabularyWord | Kanji | Sentence) & {
    romaji?: string;
    meaning?: string[] | string;
    translation?: string;
    japanese?: string;
    character?: string;
    char?: string;
    word?: string;
    id?: string;
};

const userStore = useUserStore();
const mode = ref<'hiragana' | 'katakana' | 'vocabulary' | 'kanji' | 'sentences'>('hiragana');
const isFlipped = ref(false);
const hideMastered = ref(false);

const currentList = computed(() => {
    let list: (KanaChar | VocabularyWord | Kanji | Sentence)[] = [];
    if (mode.value === 'hiragana') list = hiragana.filter(k => k.char);
    else if (mode.value === 'katakana') list = katakana.filter(k => k.char);
    else if (mode.value === 'kanji') list = kanjiList;
    else if (mode.value === 'sentences') list = sentences;
    else list = vocabulary;

    if (hideMastered.value) {
        return list.filter(item => {
            const id = 'char' in item ? item.char : ('word' in item ? item.word : ('japanese' in item ? item.id : item.character));
            return !userStore.masteredItems.includes(id!);
        });
    }
    return list;
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
    if ('character' in card) {
        return (card as Kanji).character;
    }
    if ('word' in card) {
        return (card as VocabularyWord).word;
    }
    if ('japanese' in card) {
        return (card as Sentence).japanese;
    }
    return '';
});

watch([mode, hideMastered], () => {
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

    if ('japanese' in currentCard.value && currentCard.value.id) {
        // Sentences
        playSentenceAudio(currentCard.value.id, currentCard.value.japanese || '');
    }
    else if (mode.value === 'hiragana' || mode.value === 'katakana') {
        const card = currentCard.value as KanaChar;
        // Uses static mp3 from Supabase
        playKanaAudio(card.char, card.romaji);
    } else {
        // Fallback or future implementation for vocabulary
        speakJapanese(frontText.value);
    }
}

const fontSizeClass = computed(() => {
    const len = frontText.value?.length || 0;
    if (len === 1) return 'text-8xl md:text-9xl';
    if (len <= 3) return 'text-6xl md:text-8xl';
    if (len <= 5) return 'text-5xl md:text-7xl';
    if (len <= 7) return 'text-4xl md:text-6xl';
    return 'text-2xl md:text-4xl';
});
</script>

<template>
    <div class="flex flex-col items-center justify-start min-h-[60vh] pb-6 md:pb-0">
        <!-- Loading State -->
        <div v-if="isLoading" class="w-full flex justify-center py-24">
            <LoadingSpinner size="xl" text="Mélange des cartes..." />
        </div>

        <div v-else class="w-full flex flex-col items-center">
            <h2 class="text-3xl md:text-4xl font-display font-bold text-tanuki-green mb-1 md:mb-8">Flashcards</h2>

            <!-- Mode Toggle -->
            <div class="card flex flex-wrap justify-center p-1 mb-2 md:mb-4 max-w-full">
                <button @click="mode = 'hiragana'"
                    :class="['px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold transition-all capitalize text-xs md:text-base', mode === 'hiragana' ? 'bg-tanuki-green text-white shadow-sm' : 'text-gray-500 hover:text-tanuki-green']">
                    Hiragana
                </button>
                <button @click="mode = 'katakana'"
                    :class="['px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold transition-all capitalize text-xs md:text-base', mode === 'katakana' ? 'bg-tanuki-green text-white shadow-sm' : 'text-gray-500 hover:text-tanuki-green']">
                    Katakana
                </button>
                <button @click="mode = 'kanji'"
                    :class="['px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold transition-all capitalize text-xs md:text-base', mode === 'kanji' ? 'bg-tanuki-green text-white shadow-sm' : 'text-gray-500 hover:text-tanuki-green']">
                    Kanji
                </button>
                <button @click="mode = 'vocabulary'"
                    :class="['px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold transition-all capitalize text-xs md:text-base', mode === 'vocabulary' ? 'bg-tanuki-green text-white shadow-sm' : 'text-gray-500 hover:text-tanuki-green']">
                    Vocabulaire
                </button>
                <button @click="mode = 'sentences'"
                    :class="['px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold transition-all capitalize text-xs md:text-base', mode === 'sentences' ? 'bg-tanuki-green text-white shadow-sm' : 'text-gray-500 hover:text-tanuki-green']">
                    Phrases
                </button>
            </div>

            <!-- Filter Toggle -->
            <label
                class="flex items-center gap-2 mb-4 cursor-pointer select-none text-tanuki-brown/80 hover:text-tanuki-green transition-colors">
                <input type="checkbox" v-model="hideMastered"
                    class="w-4 h-4 rounded border-tanuki-green text-tanuki-green focus:ring-tanuki-green">
                <span class="text-sm font-bold">Masquer les éléments maîtrisés</span>
            </label>

            <!-- Flashcard Scene -->
            <div class="scene w-72 h-80 md:w-xl md:h-104 perspective-1000 cursor-pointer group" @click="flipCard">
                <div class="relative w-full h-full transition-transform duration-500 transform-style-3d shadow-xl rounded-2xl"
                    :class="{ 'rotate-y-180': isFlipped }">
                    <!-- Front -->
                    <div
                        class="face front absolute w-full h-full bg-white flex items-center justify-center rounded-2xl backface-hidden border-2 border-tanuki-green">
                        <div class="text-center px-4">
                            <span
                                :class="['block font-bold text-tanuki-brown-dark mb-2 break-word transition-all', fontSizeClass]">{{
                                    frontText }}</span>
                            <!-- Show reading for vocab on front if needed, or keeping it hidden -->
                        </div>

                        <!-- Audio Button -->
                        <button v-if="mode !== 'kanji'" @click="playSound"
                            class="absolute top-4 right-4 p-2 rounded-full hover:bg-tanuki-beige/50 text-tanuki-gold transition-colors">
                            <Volume2 class="w-6 h-6" />
                        </button>

                        <span class="absolute bottom-4 text-gray-400 text-sm">Appuyer pour révéler</span>
                    </div>

                    <!-- Back -->
                    <div
                        class="face back absolute w-full h-full bg-tanuki-green text-white flex flex-col items-center justify-center rounded-2xl backface-hidden rotate-y-180 border-2 border-tanuki-green">
                        <span class="text-4xl md:text-6xl font-bold mb-4 px-4 text-center">
                            {{ 'translation' in currentCard ? currentCard.translation :
                                (Array.isArray(currentCard.meaning) ? currentCard.meaning.join(', ') : (currentCard.meaning
                            || currentCard.romaji)) }}
                        </span>
                        <span v-if="mode !== 'kanji'" class="text-xl opacity-80">{{ ('translation' in currentCard ||
                            currentCard.meaning) ?
                            'Signification' :
                            'Romaji' }}</span>
                        <span
                            v-if="('translation' in currentCard || (currentCard.meaning && !Array.isArray(currentCard.meaning)))"
                            class="text-sm mt-2 opacity-60">({{ currentCard.romaji
                            }})</span>
                    </div>
                </div>
            </div>

            <!-- Controls -->
            <div class="mt-6 flex gap-4">
                <button @click="nextCard" class="btn-3d btn-gold flex items-center gap-2 py-3 px-8 text-lg w-auto">
                    <RefreshCw class="w-5 h-5" />
                    Suivant
                </button>
            </div>
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
