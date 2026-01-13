<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { hiragana, katakana, type KanaChar } from '@/data/kana';
import { vocabulary, type VocabularyWord } from '@/data/vocabulary';
import { kanjiList, type Kanji } from '@/data/kanji';
import { grammarLessons, type GrammarLesson } from '@/data/grammar';
import { sentences, type Sentence } from '@/data/sentences';
import { Check, Trophy, Settings2, Grid3x3, BookOpen, ScrollText, PenTool, Eye, Pencil, MessageSquare, ArrowLeft, Flame, ArrowRight } from 'lucide-vue-next';
import { useUserStore } from '@/stores/userStore';
import { happyConfetti } from '@/utils/confetti';
import { onMounted, onUnmounted } from 'vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import KanjiWriter from '@/components/kanji/KanjiWriter.vue';
import KanaWriter from '@/components/kana/KanaWriter.vue';

const router = useRouter();
const isLoading = ref(true);

type QuizItem = (KanaChar | VocabularyWord | Kanji | GrammarLesson | Sentence) & {
    romaji?: string;
    meaning?: string | string[];
    title?: string;
    summary?: string;
    char?: string;
    character?: string;
    word?: string;
    japanese?: string;
    translation?: string;
};

const userStore = useUserStore();

// Categories - Init from LocalStorage
const savedCategories = localStorage.getItem('tanuki-quiz-categories');
const categories = ref(savedCategories ? JSON.parse(savedCategories) : {
    kana: true,
    vocabulary: true,
    kanji: true,
    grammar: true,
    sentences: true
});

// Modes - Init from LocalStorage
const savedModes = localStorage.getItem('tanuki-quiz-modes');
const modes = ref(savedModes ? JSON.parse(savedModes) : {
    reading: true, // QCM
    writing: false // Draw
});

// Persist settings
watch(categories, (newVal) => {
    localStorage.setItem('tanuki-quiz-categories', JSON.stringify(newVal));
}, { deep: true });

watch(modes, (newVal) => {
    localStorage.setItem('tanuki-quiz-modes', JSON.stringify(newVal));
}, { deep: true });

// Display Settings - Init from LocalStorage
const savedDisplaySettings = localStorage.getItem('tanuki-quiz-display');
const displaySettings = ref(savedDisplaySettings ? JSON.parse(savedDisplaySettings) : {
    answerMode: 'translation' as 'translation' | 'romaji'
});

watch(displaySettings, (newVal) => {
    localStorage.setItem('tanuki-quiz-display', JSON.stringify(newVal));
}, { deep: true });

// Watch Categories to disable Writing if both Kanji and Kana are disabled
watch(() => [categories.value.kanji, categories.value.kana], ([isKanji, isKana]) => {
    if (!isKanji && !isKana) {
        modes.value.writing = false;
    }
});

// Prevent disabling both reading and writing
const toggleMode = (mode: 'reading' | 'writing') => {
    // If we're turning off the last active mode, force the other one on
    if (modes.value[mode]) {
        if (mode === 'reading' && !modes.value.writing) return;
        if (mode === 'writing' && !modes.value.reading) return;
    }

    // If enabling writing, check if Kanji OR Kana is supported
    if (mode === 'writing' && !modes.value.writing) {
        if (!categories.value.kanji && !categories.value.kana) return; // Cannot enable writing without Kanji or Kana
    }

    modes.value[mode] = !modes.value[mode];

    // Only skip if the current question is no longer valid
    if (!isQuestionValid(currentQuestion.value, currentQuestionType.value)) {
        // If unanswered, skipping resets the streak (prevents cheating)
        if (!isAnswered.value) {
            userStore.updateBestCombo(0);
        }
        nextQuestion();
    }
}

function isQuestionValid(item: QuizItem, type: 'reading' | 'writing'): boolean {
    // 1. Check Mode
    if (type === 'reading' && !modes.value.reading) return false;
    if (type === 'writing' && !modes.value.writing) return false;

    // 2. Check Category
    if ('char' in item && !categories.value.kana) return false;
    if ('character' in item && !categories.value.kanji) return false;
    if ('word' in item && !categories.value.vocabulary) return false;
    if ('japanese' in item && !categories.value.sentences) return false;
    // Fallback for Grammar
    if (!('char' in item) && !('character' in item) && !('word' in item) && !('japanese' in item) && !categories.value.grammar) return false;

    return true;
}

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
    if (categories.value.sentences) {
        items = [...items, ...sentences] as QuizItem[];
    }
    return items;
});

const currentQuestion = ref<QuizItem>(getRandomItem() || (hiragana[0] as QuizItem));
const currentQuestionType = ref<'reading' | 'writing'>('reading');
const options = ref<QuizItem[]>(generateOptions(currentQuestion.value));
const selectedOption = ref<QuizItem | null>(null);
const isAnswered = ref(false);
const isSkipped = ref(false);

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
    if ('translation' in item && 'romaji' in item) {
        return displaySettings.value.answerMode === 'romaji' ? item.romaji! : item.translation!;
    }
    if ('word' in item) {
        if (displaySettings.value.answerMode === 'romaji') return item.romaji!;
    }
    if ('char' in item && item.romaji) return item.romaji;
    if ('translation' in item && item.translation) return item.translation;
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

function determineQuestionType(item: QuizItem): 'reading' | 'writing' {
    const isKanji = 'character' in item && 'onyomi' in item;
    const isKana = 'char' in item && item.char;

    if (!modes.value.writing) return 'reading';
    if (!isKanji && !isKana) return 'reading';
    if (!modes.value.reading) return 'writing';
    return Math.random() > 0.5 ? 'writing' : 'reading';
}

async function checkAnswer(option: QuizItem) {
    if (isAnswered.value) return;

    selectedOption.value = option;
    isAnswered.value = true;

    const isCorrectAnswer = getId(option) === getId(currentQuestion.value);

    let newCombo = userStore.currentCombo;
    if (isCorrectAnswer) {
        newCombo++;
        if ([10, 25, 50, 100].includes(newCombo)) {
            happyConfetti();
        }
        userStore.markAsMastered(getId(currentQuestion.value));
    } else {
        newCombo = 0;
    }

    userStore.updateBestCombo(newCombo);
    await userStore.recordAnswer(isCorrectAnswer, xpMultiplier.value);
}

async function handleWritingSuccess() {
    if (isAnswered.value) return;
    isAnswered.value = true;

    let newCombo = userStore.currentCombo;
    newCombo++;
    if ([10, 25, 50, 100].includes(newCombo)) {
        happyConfetti();
    }
    userStore.markAsMastered(getId(currentQuestion.value));
    userStore.updateBestCombo(newCombo);
    await userStore.recordAnswer(true, xpMultiplier.value);
}

async function handleManualSuccess() {
    if (isAnswered.value) return;
    isAnswered.value = true;
    isSkipped.value = true;
    userStore.markAsMastered(getId(currentQuestion.value));
}

const showSettings = ref(false);

function nextQuestion() {
    const item = getRandomItem();
    currentQuestion.value = item;
    currentQuestionType.value = determineQuestionType(item);

    if (currentQuestionType.value === 'reading') {
        options.value = generateOptions(currentQuestion.value);
    } else {
        options.value = [];
    }

    selectedOption.value = null;
    isAnswered.value = false;
    isSkipped.value = false;
}

const isCorrect = computed(() => {
    if (!selectedOption.value) return false;
    return getId(selectedOption.value) === getId(currentQuestion.value);
});

const feedbackTitle = computed(() => {
    if (isSkipped.value) return 'Passé';
    if (isCorrect.value || currentQuestionType.value === 'writing') return 'Excellent !';
    return 'Oups !';
});

function getDisplayText(item: QuizItem) {
    if ('char' in item && item.char) return item.char;
    if ('character' in item && item.character) return item.character;
    if ('word' in item && item.word) return item.word;
    if ('japanese' in item && item.japanese) return item.japanese;
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
    if (!Object.values(categories.value).some(Boolean)) {
        categories.value[cat] = true;
    }

    if (!isQuestionValid(currentQuestion.value, currentQuestionType.value)) {
        if (!isAnswered.value) {
            userStore.updateBestCombo(0);
        }
        nextQuestion();
    }
}

const xpMultiplier = computed(() => {
    let multiplier = 1.0;
    const activeCount = Object.values(categories.value).filter(Boolean).length;

    switch (activeCount) {
        case 5: multiplier = 3.0; break;
        case 4: multiplier = 2.0; break;
        case 3: multiplier = 1.5; break;
        case 2: multiplier = 1.2; break;
        default: multiplier = 1.0;
    }

    if (modes.value.writing) {
        multiplier += 0.5;
    }

    return multiplier;
});

const handleKeydown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    if (isAnswered.value) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            nextQuestion();
        }
    } else {
        if (['1', '2', '3', '4'].includes(e.key)) {
            const idx = parseInt(e.key) - 1;
            if (options.value[idx]) {
                checkAnswer(options.value[idx]);
            }
        }
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
    isLoading.value = false;
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <div class="flex flex-col items-center w-full px-4">
        <!-- Loading State -->
        <div v-if="isLoading" class="w-full flex justify-center py-32">
            <LoadingSpinner size="xl" text="Préparation du Quiz..." />
        </div>

        <template v-else>
            <div class="w-full relative flex items-center justify-center mb-0 md:mb-4">
                <!-- Header -->
                <button @click="router.push('/training')"
                    class="absolute left-0 text-tanuki-brown/60 hover:text-tanuki-brown transition-colors p-2 rounded-full hover:bg-stone-100">
                    <ArrowLeft class="w-6 h-6" />
                </button>
                <h2 class="text-3xl md:text-4xl font-display font-bold text-tanuki-green text-center">
                    Quiz
                </h2>
            </div>

            <div class="w-full flex flex-col items-center max-w-3xl mx-auto">
                <div class="relative w-full max-w-2xl flex flex-col md:block mb-2">

                    <!-- Score & Streak (Centered) -->
                    <div class="relative w-full max-w-md mx-auto z-10">
                        <div
                            class="flex items-center justify-between gap-0 card p-2 px-4 shadow-sm text-sm border-2 border-tanuki-green w-full bg-white">
                            <div class="flex-1 flex items-center justify-center gap-2 font-bold text-tanuki-brown">
                                <Trophy class="w-4 h-4 text-tanuki-gold" />
                                <span>{{ score }}/{{ total }}</span>
                            </div>
                            <div class="h-4 w-0.5 bg-tanuki-brown rounded-full"></div>
                            <div class="flex-1 font-bold text-tanuki-green flex items-center justify-center gap-1">
                                <span>{{ combo }}</span>
                                <Flame class="w-4 h-4 fill-orange-500 text-orange-600" />
                            </div>

                            <!-- Bonus Pill -->
                            <div v-if="xpMultiplier > 1"
                                class="absolute -right-3 -top-3 bg-linear-to-r from-amber-500 to-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                XP x{{ xpMultiplier }}
                            </div>
                        </div>
                    </div>

                    <!-- Filter Button (Absolute Right Desktop) -->
                    <div
                        class="mt-3 md:mt-0 flex justify-center md:absolute md:right-0 md:top-0 md:bottom-0 md:flex items-center z-0">
                        <button @click="showSettings = !showSettings"
                            class="btn-filter py-2! px-3! shadow-sm md:w-auto w-full max-w-md">
                            <Settings2 class="w-5 h-5" />
                            <span class="inline">Filtres</span>
                        </button>
                    </div>
                </div>

                <!-- Settings Section -->
                <div v-if="showSettings"
                    class="card w-full mb-6 p-6 animate-fade-in shadow-none border-2 border-tanuki-green">

                    <!-- Display Mode Section -->
                    <div class="mb-8 border-b border-tanuki-beige pb-6">
                        <h3
                            class="font-bold text-tanuki-brown-dark mb-4 flex items-center gap-2 text-md uppercase tracking-wider opacity-70">
                            Affichage des Réponses
                        </h3>
                        <div class="grid grid-cols-2 gap-4">
                            <button @click="displaySettings.answerMode = 'translation'" :class="['flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-bold',
                                displaySettings.answerMode === 'translation'
                                    ? 'bg-tanuki-green text-white border-tanuki-green shadow-md'
                                    : 'bg-white text-gray-400 border-gray-200 hover:border-tanuki-green/30']">
                                <span class="text-lg">A</span>
                                <span>Traduction</span>
                            </button>
                            <button @click="displaySettings.answerMode = 'romaji'" :class="['flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-bold',
                                displaySettings.answerMode === 'romaji'
                                    ? 'bg-tanuki-green text-white border-tanuki-green shadow-md'
                                    : 'bg-white text-gray-400 border-gray-200 hover:border-tanuki-green/30']">
                                <span class="text-lg">あ</span>
                                <span>Romaji</span>
                            </button>
                        </div>
                    </div>

                    <!-- Modes Section -->
                    <div class="mb-8 border-b border-tanuki-beige pb-6">
                        <h3
                            class="font-bold text-tanuki-brown-dark mb-4 flex items-center gap-2 text-md uppercase tracking-wider opacity-70">
                            Modes de Jeu
                        </h3>
                        <div class="grid grid-cols-2 gap-4">
                            <button @click="toggleMode('reading')" :class="['flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-bold',
                                modes.reading
                                    ? 'bg-tanuki-green text-white border-tanuki-green shadow-md'
                                    : 'bg-white text-gray-400 border-gray-200 hover:border-tanuki-green/30']">
                                <Eye class="w-5 h-5" />
                                <span>Lecture (QCM)</span>
                            </button>

                            <button @click="toggleMode('writing')" :disabled="!categories.kanji && !categories.kana"
                                :class="['flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-bold relative',
                                    (!categories.kanji && !categories.kana) ? 'opacity-40 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400' :
                                        modes.writing
                                            ? 'bg-tanuki-green text-white border-tanuki-green shadow-md'
                                            : 'bg-white text-gray-400 border-gray-200 hover:border-tanuki-green/30']">
                                <Pencil class="w-5 h-5" />
                                <span>Écriture (Tracé)</span>

                                <!-- Disabled Tooltip -->
                                <span v-if="!categories.kanji && !categories.kana"
                                    class="absolute -bottom-8 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                    Kanjis ou Kanas requis
                                </span>
                            </button>
                        </div>
                    </div>

                    <h3 class="font-bold text-tanuki-brown-dark mb-6 flex items-center gap-2 text-lg">
                        <Settings2 class="w-5 h-5 text-tanuki-green" />
                        <span>Catégories</span>
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
                                <MessageSquare v-else-if="key === 'sentences'" class="w-6 h-6" />
                            </div>

                            <span class="font-bold capitalize text-sm">
                                {{ key === 'kana' ? 'Kanas' : key === 'vocabulary' ? 'Vocabulaire' : key === 'kanji' ?
                                    'Kanjis' : key === 'sentences' ? 'Phrases' : 'Grammaire' }}
                            </span>

                            <!-- Check Indicator -->
                            <div v-if="val"
                                class="absolute -top-2 -right-2 bg-tanuki-green text-white p-1 rounded-full border-2 border-white">
                                <Check class="w-3 h-3 stroke-3" />
                            </div>
                        </button>
                    </div>

                    <p class="text-xs text-gray-400 mt-6 text-center italic">
                        Activez les catégories pour les inclure dans votre session d'entraînement.
                    </p>
                </div>

                <!-- Quiz Card -->
                <div
                    class="card w-full text-center mb-4 relative overflow-hidden group p-4 md:p-8 pt-8! min-h-[250px] md:min-h-[unset] flex flex-col items-center justify-center bg-white border-2 border-tanuki-green">

                    <!-- Type Badge -->
                    <div
                        class="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-widest text-tanuki-brown/40 border border-tanuki-brown/20 px-2 py-1 rounded flex items-center gap-2 z-20">
                        <span>
                            {{ 'char' in currentQuestion ? 'Kana' : 'character' in currentQuestion ? 'Kanji' :
                                'word' in currentQuestion ? 'Vocabulaire' : 'japanese' in currentQuestion ? 'Phrase' :
                                    'Grammaire' }}
                        </span>
                        <span v-if="currentQuestionType === 'writing'"
                            class="bg-tanuki-green text-white px-1.5 rounded-sm">
                            ÉCRITURE
                        </span>
                    </div>

                    <!-- Fixed height container for question text to prevent layout shift -->
                    <div v-if="currentQuestionType === 'reading'"
                        class="h-32 md:h-40 w-full flex items-center justify-center mb-4 pt-4">
                        <div :class="['font-bold text-tanuki-brown-dark text-wrap text-center', fontSizeClass]">
                            {{ getDisplayText(currentQuestion) }}
                        </div>
                    </div>

                    <div v-else-if="currentQuestionType === 'writing'"
                        class="w-full h-full flex items-center justify-center">
                        <div class="relative z-10 md:scale-125 flex flex-col items-center">
                            <KanjiWriter v-if="'character' in currentQuestion" :character="currentQuestion.character!"
                                :size="200" initialMode="quiz" @quiz-success="handleWritingSuccess" />

                            <KanaWriter v-else-if="'char' in currentQuestion" :character="currentQuestion.char!"
                                :size="200" initialMode="quiz" @quiz-success="handleWritingSuccess" />

                            <!-- Manual Validation Button -->
                            <div v-if="!isAnswered" class="mt-4">
                                <button @click="handleManualSuccess"
                                    class="text-xs text-gray-400 hover:text-tanuki-brown underline decoration-dotted transition-colors">
                                    Passer (pas de gain d'expérience)
                                </button>
                            </div>
                        </div>
                    </div>

                    <p v-if="currentQuestionType === 'reading'" class="text-gray-400">Choisir la bonne Signification /
                        Romaji</p>

                </div>

                <!-- Options -->
                <div v-if="currentQuestionType === 'reading'" class="grid grid-cols-2 gap-3 md:gap-4 w-full">
                    <button v-for="(option, idx) in options" :key="idx" @click="checkAnswer(option)"
                        :disabled="isAnswered" class="btn-3d w-full z-10 relative group" :class="[
                            isAnswered && getId(option) === getId(currentQuestion) ? 'bg-green-500 text-white border-green-700' :
                                isAnswered && selectedOption === option && getId(option) !== getId(currentQuestion) ? 'bg-red-500 text-white border-red-700' :
                                    'btn-secondary'
                        ]">
                        <span
                            class="absolute top-2 left-3 text-[10px] font-bold opacity-30 group-hover:opacity-100 transition-opacity hidden md:block border border-current px-1 rounded">{{
                                idx + 1 }}</span>
                        <span class="text-sm md:text-base leading-tight">{{ getAnswerText(option) }}</span>
                    </button>
                </div>

            </div>
        </template>

        <!-- Bottom Feedback Drawer (Unified Style) -->
        <Transition name="drawer">
            <div v-if="isAnswered"
                class="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-6 md:pb-8! border-t-2 animate-drawer-in"
                :class="isSkipped ? 'bg-gray-50 border-gray-200' : (isCorrect || currentQuestionType === 'writing' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200')">
                <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

                    <div class="flex items-center gap-4 md:gap-6 flex-1">
                        <img :src="isSkipped ? '/images/tanuki_skip.png' : (isCorrect || currentQuestionType === 'writing' ? '/images/tanuki_success.png' : '/images/tanuki_failure.png')"
                            :alt="isCorrect ? 'Succès' : 'Échec'"
                            class="w-16 h-16 md:w-24 md:h-24 object-contain animate-bounce-short" />

                        <div class="flex-1">
                            <h3 class="text-xl md:text-2xl font-bold"
                                :class="isSkipped ? 'text-gray-700' : (isCorrect || currentQuestionType === 'writing' ? 'text-green-700' : 'text-red-700')">
                                {{ feedbackTitle }}
                            </h3>
                            <div v-if="!isCorrect && !isSkipped && currentQuestionType !== 'writing'" class="mt-1">
                                <p class="text-xs font-bold text-red-400 uppercase tracking-widest">Réponse correcte :
                                </p>
                                <p class="text-base md:text-lg font-bold text-gray-800 leading-tight">
                                    {{ getAnswerText(currentQuestion) }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center w-full md:w-auto">
                        <button @click="nextQuestion"
                            class="btn-3d w-full md:w-48 flex items-center justify-center gap-2 group py-3!"
                            :class="isSkipped ? 'btn-secondary' : (isCorrect || currentQuestionType === 'writing' ? 'btn-primary' : 'btn-danger')">
                            <span class="font-bold">Continuer</span>
                            <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
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

/* Drawer Transitions */
.drawer-enter-active,
.drawer-leave-active {
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}

.drawer-enter-from,
.drawer-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

@keyframes drawer-in {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}

.animate-drawer-in {
    animation: drawer-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-danger {
    background: #ef4444;
    color: white;
    border-bottom: 4px solid #b91c1c;
}

.btn-danger:active {
    border-bottom-width: 0;
    transform: translateY(4px);
}
</style>
