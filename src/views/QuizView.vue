<script setup lang="ts">
import { ref, computed } from 'vue';
import { hiragana, katakana, type KanaChar } from '@/data/kana';
import { vocabulary, type VocabularyWord } from '@/data/vocabulary';
import { Check, X, Trophy } from 'lucide-vue-next';

type QuizItem = (KanaChar | VocabularyWord) & { romaji?: string; meaning?: string };

const allKana = [...hiragana, ...katakana].filter(k => k.char);
const allItems: QuizItem[] = [...allKana, ...vocabulary];

const score = ref(0);
const total = ref(0);
const streak = ref(0);

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
        // Check duplication based on unique identifiers (char or word)
        const randomId = getId(random);
        const optsIds = opts.map(getId);

        if (!optsIds.includes(randomId)) {
            opts.push(random);
        }
    }
    return opts.sort(() => Math.random() - 0.5);
}

function checkAnswer(option: QuizItem) {
    if (isAnswered.value) return;

    selectedOption.value = option;
    isAnswered.value = true;
    total.value++;

    if (getId(option) === getId(currentQuestion.value)) {
        score.value++;
        streak.value++;
    } else {
        streak.value = 0;
    }
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
</script>

<template>
    <div class="flex flex-col items-center max-w-lg mx-auto">
        <div class="flex justify-between w-full mb-8 bg-white p-4 rounded-xl shadow-sm border border-tanuki-beige/50">
            <div class="flex items-center gap-2 text-tanuki-brown font-bold">
                <Trophy class="w-5 h-5 text-tanuki-gold" />
                <span>Score: {{ score }} / {{ total }}</span>
            </div>
            <div class="text-tanuki-green font-bold">
                Série: {{ streak }} 🔥
            </div>
        </div>

        <div
            class="bg-white p-6 md:p-12 rounded-3xl shadow-lg border-2 border-tanuki-beige w-full text-center mb-8 relative overflow-hidden">
            <div class="text-4xl md:text-6xl font-bold text-tanuki-brown-dark mb-4 break-words">{{
                getDisplayText(currentQuestion) }}</div>
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <button v-for="(option, idx) in options" :key="idx" @click="checkAnswer(option)" :disabled="isAnswered"
                class="py-4 px-6 rounded-xl font-bold text-xl shadow-sm border-2 transition-all transform active:scale-95 disabled:cursor-default"
                :class="[
                    isAnswered && getDisplayText(option) === getDisplayText(currentQuestion) ? 'bg-green-500 text-white border-green-600' :
                        isAnswered && selectedOption === option && getDisplayText(option) !== getDisplayText(currentQuestion) ? 'bg-red-500 text-white border-red-600' :
                            'bg-white text-tanuki-brown hover:border-tanuki-gold hover:text-tanuki-gold border-transparent'
                ]">
                {{ getAnswerText(option) }}
            </button>
        </div>

        <!-- Next Button -->
        <button v-if="isAnswered" @click="nextQuestion"
            class="mt-8 bg-tanuki-green text-white font-bold py-3 px-12 rounded-full shadow-lg hover:bg-green-700 transition-colors animate-fade-in">
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
