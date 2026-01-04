<script setup lang="ts">
import { ref, computed } from 'vue';
import { hiragana, katakana, type KanaChar } from '@/data/kana';
import { vocabulary, type VocabularyWord } from '@/data/vocabulary';
import { kanjiList, type Kanji } from '@/data/kanji';
import { grammarLessons, type GrammarLesson } from '@/data/grammar';
import { Check, X, Trophy, Settings2, Grid3x3, BookOpen, ScrollText, PenTool } from 'lucide-vue-next';
import { useUserStore } from '@/stores/userStore';

type QuizItem = (KanaChar | VocabularyWord | Kanji | GrammarLesson) & {
    romaji?: string;
    meaning?: string | string[];
    title?: string;
    summary?: string;
    char?: string;
    character?: string;
    word?: string;
};

const userStore = useUserStore();

// Categories
const categories = ref({
    kana: true,
    vocabulary: true,
    kanji: true,
    grammar: true
});

const showSettings = ref(false);

const filteredItems = computed(() => {
    let items: QuizItem[] = [];
    if (categories.value.kana) {
        items = [...items, ...hiragana.filter(k => k.char), ...katakana.filter(k => k.char)] as QuizItem[];
    }
    if (categories.value.vocabulary) {
        items = [...items, ...vocabulary] as QuizItem[];
    }
    if (categories.value.kanji) {
        items = [...items, ...kanjiList] as QuizItem[];
    }
    if (categories.value.grammar) {
        items = [...items, ...grammarLessons] as QuizItem[];
    }
    return items;
});

const currentQuestion = ref<QuizItem>(getRandomItem() || (hiragana[0] as QuizItem));
const options = ref<QuizItem[]>(generateOptions(currentQuestion.value));
const selectedOption = ref<QuizItem | null>(null);
const isAnswered = ref(false);

const score = computed(() => userStore.score);
const total = computed(() => userStore.totalQuestions);
const combo = computed(() => userStore.currentCombo);

function getRandomItem(): QuizItem {
    const items = filteredItems.value;
    if (items.length === 0) return (hiragana[0] as QuizItem);
    return items[Math.floor(Math.random() * items.length)] as QuizItem;
}

function getId(item: QuizItem): string {
    if ('char' in item && item.char) return item.char;
    if ('character' in item && item.character) return item.character;
    if ('word' in item && item.word) return item.word;
    if ('id' in item && item.id) return item.id;
    return 'unknown';
}

function getAnswerText(item: QuizItem): string {
    if ('meaning' in item && item.meaning) {
        const m = item.meaning;
        if (Array.isArray(m)) return m[0] || '';
        return m || '';
    }
    if ('romaji' in item && item.romaji) return item.romaji;
    if ('summary' in item && item.summary) return item.summary;
    return '';
}

function generateOptions(correct: QuizItem): QuizItem[] {
    const opts = [correct];
    const correctId = getId(correct);

    // Try to pick options from the same category first for difficulty
    const sameCategoryItems = filteredItems.value.filter(i => {
        const isCorrectType = ('char' in correct && 'char' in i) ||
            ('character' in correct && 'character' in i) ||
            ('word' in correct && 'word' in i) ||
            ('id' in correct && 'id' in i);
        return isCorrectType && getId(i) !== correctId;
    });

    const pool = sameCategoryItems.length >= 3 ? sameCategoryItems : filteredItems.value;

    while (opts.length < 4) {
        const randomItem = pool[Math.floor(Math.random() * pool.length)];
        if (!randomItem) break;

        const randomId = getId(randomItem);
        const randomAns = getAnswerText(randomItem);

        const isDuplicateId = opts.some(o => getId(o) === randomId);
        const isDuplicateAns = opts.some(o => getAnswerText(o) === randomAns);

        if (!isDuplicateId && !isDuplicateAns) {
            opts.push(randomItem);
        }
    }
    return opts.sort(() => Math.random() - 0.5);
}

async function checkAnswer(option: QuizItem) {
    if (isAnswered.value) return;

    selectedOption.value = option;
    isAnswered.value = true;

    const isCorrectAnswer = getId(option) === getId(currentQuestion.value);

    let newCombo = userStore.currentCombo;
    if (isCorrectAnswer) {
        newCombo++;
        userStore.markAsMastered(getId(currentQuestion.value));
    } else {
        newCombo = 0;
    }

    userStore.updateBestCombo(newCombo);
    await userStore.recordAnswer(isCorrectAnswer);
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
    if ('char' in item && item.char) return item.char;
    if ('character' in item && item.character) return item.character;
    if ('word' in item && item.word) return item.word;
    if ('title' in item && item.title) return item.title;
    return '';
}

const fontSizeClass = computed(() => {
    const text = getDisplayText(currentQuestion.value);
    const len = text ? text.length : 0;
    if (len <= 1) return 'text-8xl md:text-9xl';
    if (len <= 3) return 'text-6xl md:text-8xl';
    if (len <= 5) return 'text-5xl md:text-7xl';
    if (len <= 10) return 'text-3xl md:text-5xl';
    return 'text-xl md:text-3xl';
});

function toggleCategory(cat: keyof typeof categories.value) {
    categories.value[cat] = !categories.value[cat];
    // Ensure at least one is active
    if (!Object.values(categories.value).some(Boolean)) {
        categories.value[cat] = true;
    }
    nextQuestion();
}
</script>

<template>
    <div class="w-full flex flex-col items-center max-w-3xl mx-auto px-4 md:px-0">
        <!-- Center Title -->
        <h2 class="text-3xl md:text-4xl font-display font-bold text-tanuki-green mb-6 text-center">Quiz</h2>

        <!-- Toolbar: Score + Filter -->
        <div class="relative w-full max-w-2xl flex flex-col md:block mb-6">

            <!-- Score & Streak (Centered) -->
            <div class="relative w-full max-w-md mx-auto z-10">
                <div
                    class="flex items-center justify-between gap-0 card p-2 px-4 shadow-sm text-sm border-2 border-tanuki-green w-full bg-white">
                    <div class="flex-1 flex items-center justify-center gap-2 font-bold text-tanuki-brown">
                        <Trophy class="w-4 h-4 text-tanuki-gold" />
                        <span>{{ score }}/{{ total }}</span>
                    </div>
                    <div class="h-4 w-[2px] bg-tanuki-brown rounded-full"></div>
                    <div class="flex-1 font-bold text-tanuki-green flex items-center justify-center gap-1">
                        <span>{{ combo }}</span>
                        <span class="text-xs">🔥</span>
                    </div>
                </div>
            </div>

            <!-- Filter Button (Absolute Right Desktop) -->
            <div
                class="mt-3 md:mt-0 flex justify-center md:absolute md:right-0 md:top-0 md:bottom-0 md:flex items-center z-0">
                <button @click="showSettings = !showSettings"
                    class="btn-filter !py-2 !px-3 shadow-sm md:w-auto w-full max-w-md">
                    <Settings2 class="w-5 h-5" />
                    <span class="inline">Filtres</span>
                </button>
            </div>
        </div>

        <!-- Settings Section - Redesigned (Flat/Premium) -->
        <div v-if="showSettings" class="card w-full mb-6 p-6 animate-fade-in shadow-none border-2 border-tanuki-green">
            <h3 class="font-bold text-tanuki-brown-dark mb-6 flex items-center gap-2 text-lg">
                <Settings2 class="w-5 h-5 text-tanuki-green" />
                <span>Configuration du Quiz</span>
            </h3>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button v-for="(val, key) in categories" :key="key" @click="toggleCategory(key as any)" :class="['flex flex-col items-center gap-3 p-4 rounded-2xl transition-all border-2 relative group',
                    val
                        ? 'bg-tanuki-green/5 border-tanuki-green text-tanuki-green'
                        : 'bg-white border-tanuki-beige text-gray-400 hover:border-tanuki-green/20']">

                    <div :class="['p-3 rounded-full transition-colors',
                        val ? 'bg-tanuki-green/20' : 'bg-tanuki-beige/50 group-hover:bg-tanuki-beige']">
                        <Grid3x3 v-if="key === 'kana'" class="w-6 h-6" />
                        <BookOpen v-else-if="key === 'vocabulary'" class="w-6 h-6" />
                        <ScrollText v-else-if="key === 'kanji'" class="w-6 h-6" />
                        <PenTool v-else-if="key === 'grammar'" class="w-6 h-6" />
                    </div>

                    <span class="font-bold capitalize text-sm">
                        {{ key === 'kana' ? 'Kanas' : key === 'vocabulary' ? 'Vocabulaire' : key === 'kanji' ? 'Kanjis'
                            : 'Grammaire' }}
                    </span>

                    <!-- Check Indicator -->
                    <div v-if="val"
                        class="absolute -top-2 -right-2 bg-tanuki-green text-white p-1 rounded-full border-2 border-white">
                        <Check class="w-3 h-3 stroke-[3]" />
                    </div>
                </button>
            </div>

            <p class="text-xs text-gray-400 mt-6 text-center italic">
                Activez les catégories pour les inclure dans votre session d'entraînement.
            </p>
        </div>

        <!-- Quiz Card -->
        <div
            class="card w-full text-center mb-4 relative overflow-hidden group p-8 md:p-12 min-h-[30vh] flex flex-col items-center justify-center">

            <!-- Type Badge -->
            <div
                class="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-widest text-tanuki-brown/40 border border-tanuki-brown/20 px-2 py-1 rounded">
                {{ 'char' in currentQuestion ? 'Kana' : 'character' in currentQuestion ? 'Kanji' : 'word' in
                    currentQuestion ? 'Vocabulaire' : 'Grammaire' }}
            </div>

            <!-- Fixed height container for question text to prevent layout shift -->
            <div class="h-32 md:h-40 w-full flex items-center justify-center mb-4 pt-4">
                <div :class="['font-bold text-tanuki-brown-dark break-words text-center', fontSizeClass]">
                    {{ getDisplayText(currentQuestion) }}
                </div>
            </div>

            <p class="text-gray-400">Choisir la bonne Signification / Romaji</p>

            <!-- Feedback Overlay -->
            <div v-if="isAnswered"
                class="absolute inset-0 flex items-center justify-center bg-opacity-90 transition-all backdrop-blur-sm z-20"
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
                class="btn-3d w-full z-10" :class="[
                    isAnswered && getId(option) === getId(currentQuestion) ? 'bg-green-500 text-white border-green-700' :
                        isAnswered && selectedOption === option && getId(option) !== getId(currentQuestion) ? 'bg-red-500 text-white border-red-700' :
                            'btn-secondary'
                ]">
                <span class="text-sm md:text-base leading-tight">{{ getAnswerText(option) }}</span>
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
