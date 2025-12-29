<script setup lang="ts">
import { ref, computed } from 'vue';
import { hiragana, katakana, type KanaChar } from '@/data/kana';
import { vocabulary, type VocabularyWord } from '@/data/vocabulary';
import { Check, X, Trophy } from 'lucide-vue-next';

type QuizItem = (KanaChar | VocabularyWord) & { romaji?: string; meaning?: string };

import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const allKana = [...hiragana, ...katakana].filter(k => k.char);
const allItems: QuizItem[] = [...allKana, ...vocabulary];

// Use store values for persistent stats
const score = computed(() => userStore.score);
const total = computed(() => userStore.totalQuestions);
// Use store state for "Combo" so it persists across navigation
const combo = computed(() => userStore.currentCombo);

const currentQuestion = ref<QuizItem>(getRandomItem());
const options = ref<QuizItem[]>(generateOptions(currentQuestion.value));
const selectedOption = ref<QuizItem | null>(null);
const isAnswered = ref(false);

function getRandomItem() {
    return allItems[Math.floor(Math.random() * allItems.length)] as QuizItem;
}

function getId(item: QuizItem): string {
    if ('char' in item) return item.char;
    return item.word;
}

function generateOptions(correct: QuizItem): QuizItem[] {
    const opts = [correct];
    while (opts.length < 4) {
        const random = getRandomItem();
        // Check duplication based on unique identifiers AND answer text
        // This prevents having Hiragana 'ho' and Katakana 'ho' in the same question (same answer text)
        const randomId = getId(random);
        const randomAnswer = getAnswerText(random);

        const isDuplicateId = opts.some(o => getId(o) === randomId);
        const isDuplicateAnswer = opts.some(o => getAnswerText(o) === randomAnswer);

        if (!isDuplicateId && !isDuplicateAnswer) {
            opts.push(random);
        }
    }
    return opts.sort(() => Math.random() - 0.5);
}

function checkAnswer(option: QuizItem) {
    if (isAnswered.value) return;

    selectedOption.value = option;
    isAnswered.value = true;

    const isCorrectAnswer = getId(option) === getId(currentQuestion.value);

    // Calculate new combo value
    let newCombo = userStore.currentCombo;
    if (isCorrectAnswer) {
        newCombo++;
    } else {
        newCombo = 0;
    }

    // Update Best Combo & Current Combo in store
    userStore.updateBestCombo(newCombo);

    // Record answer in store (handles persistence, global score, daily streak)
    userStore.recordAnswer(isCorrectAnswer);
}

function nextQuestion() {
    currentQuestion.value = getRandomItem();
    options.value = generateOptions(currentQuestion.value);
    selectedOption.value = null;
    isAnswered.value = false;
}

const isCorrect = computed(() => {
    if (!selectedOption.value) return false;
    return getId(selectedOption.value) === getId(currentQuestion.value);
});

function getDisplayText(item: QuizItem) {
    if ('char' in item) return item.char;
    return item.word;
}

function getAnswerText(item: QuizItem) {
    if ('meaning' in item && item.meaning) return item.meaning;
    return item.romaji || '';
}



const fontSizeClass = computed(() => {
    const text = getDisplayText(currentQuestion.value);
    const len = text ? text.length : 0;

    if (len === 1) return 'text-8xl md:text-9xl';
    if (len <= 3) return 'text-6xl md:text-8xl';
    if (len <= 5) return 'text-5xl md:text-7xl';
    if (len <= 7) return 'text-4xl md:text-6xl';
    return 'text-2xl md:text-4xl';
});
</script>

<template>
    <div class="w-full flex flex-col items-center max-w-3xl mx-auto px-4 md:px-0">
        <h2 class="text-3xl md:text-4xl font-display font-bold text-tanuki-green mb-1 md:mb-8">Quiz</h2>

        <div class="flex justify-between w-full mb-4 card p-3">
            <div class="flex items-center gap-2 text-tanuki-brown font-bold">
                <Trophy class="w-5 h-5 text-tanuki-gold" />
                <span>Score: {{ score }} / {{ total }}</span>
            </div>
            <div class="text-tanuki-green font-bold">
                Série: {{ combo }} 🔥
            </div>
        </div>

        <div
            class="card w-full text-center mb-4 relative overflow-hidden group p-8 md:p-12 min-h-[30vh] flex flex-col items-center justify-center">



            <!-- Fixed height container for question text to prevent layout shift -->
            <div class="h-32 md:h-40 w-full flex items-center justify-center mb-4">
                <div :class="['font-bold text-tanuki-brown-dark break-words text-center', fontSizeClass]">
                    {{ getDisplayText(currentQuestion) }}
                </div>
            </div>

            <p class="text-gray-400">Choisir la bonne Signification / Romaji</p>

            <!-- Feedback Overlay -->
            <div v-if="isAnswered"
                class="absolute inset-0 flex items-center justify-center bg-opacity-90 transition-all backdrop-blur-sm"
                :class="isCorrect ? 'bg-green-100/50' : 'bg-red-100/50'">
                <div v-if="isCorrect" class="text-green-600 flex flex-col items-center animate-bounce-short">
                    <Check class="w-20 h-20" />
                    <span class="text-2xl font-bold">Correct !</span>
                </div>
                <div v-else class="text-red-500 flex flex-col items-center">
                    <X class="w-20 h-20" />
                    <span class="text-2xl font-bold">Oups !</span>
                    <span class="text-lg text-gray-600 mt-2">C'était "{{ getAnswerText(currentQuestion) }}"</span>
                </div>
            </div>
        </div>

        <!-- Options -->
        <div class="grid grid-cols-2 gap-3 md:gap-4 w-full">
            <button v-for="(option, idx) in options" :key="idx" @click="checkAnswer(option)" :disabled="isAnswered"
                class="btn-3d w-full" :class="[
                    isAnswered && getDisplayText(option) === getDisplayText(currentQuestion) ? 'bg-green-500 text-white border-green-700' :
                        isAnswered && selectedOption === option && getDisplayText(option) !== getDisplayText(currentQuestion) ? 'bg-red-500 text-white border-red-700' :
                            'btn-secondary'
                ]">
                {{ getAnswerText(option) }}
            </button>
        </div>

        <!-- Next Button -->
        <button @click="nextQuestion" class="mt-8 btn-3d btn-gold w-full"
            :class="isAnswered ? 'animate-fade-in' : 'invisible'">
            Question Suivante
        </button>
    </div>
</template>

<style scoped>
.animate-bounce-short {
    animation: bounce-short 0.5s;
}

@keyframes bounce-short {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
