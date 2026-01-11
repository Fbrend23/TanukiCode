<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { sentences, type Sentence } from '@/data/sentences';
import { ArrowLeft, Volume2, HelpCircle, Trophy, Heart, Flame, ArrowRight, Settings2, Check } from 'lucide-vue-next';
import { playSentenceAudio } from '@/utils/audio';
import { useUserStore } from '@/stores/userStore';
import { happyConfetti } from '@/utils/confetti';

const router = useRouter();
const userStore = useUserStore();

// Types for Token Management
interface Token {
    id: number;
    text: string;
    used: boolean;
}

// Game State
const currentSentence = ref<Sentence | null>(null);
const poolTokens = ref<Token[]>([]);
const answerTokens = ref<Token[]>([]); // Subset of tokens that are currently in the answer zone
const isCorrect = ref(false);
const showHint = ref(false);
const hasChecked = ref(false); // Has the user clicked "Valider"?
const mistakeCount = ref(0);
const roundTokenMode = ref<'romaji' | 'kana'>('romaji');
const xpMultiplier = 1.5; // Fixed bonus for higher difficulty

// Display Settings - Init from LocalStorage
const savedDisplaySettings = localStorage.getItem('tanuki-construction-display');
const displaySettings = ref(savedDisplaySettings ? JSON.parse(savedDisplaySettings) : {
    tokenMode: 'romaji' as 'romaji' | 'kana'
});

watch(displaySettings, (newVal) => {
    localStorage.setItem('tanuki-construction-display', JSON.stringify(newVal));
}, { deep: true });

const showSettings = ref(false);

const score = computed(() => userStore.score);

// Initialize a new round
const initRound = () => {
    isCorrect.value = false;
    showHint.value = false;
    hasChecked.value = false;
    mistakeCount.value = 0;
    answerTokens.value = [];

    // Pick random sentence
    const random = sentences[Math.floor(Math.random() * sentences.length)];
    if (!random) return;
    currentSentence.value = random;

    // Create tokens from Romaji (Space separated)
    const romajiWords = random.romaji.split(' ');

    let tokensToUse = romajiWords;
    roundTokenMode.value = 'romaji';

    // If Kana mode, try to segment the kana string
    if (displaySettings.value.tokenMode === 'kana' && random.kana) {
        if (random.kana.includes(' ')) {
            tokensToUse = random.kana.split(' ');
            roundTokenMode.value = 'kana';
        } else {
            // Fallback to romaji but notify logic
            tokensToUse = romajiWords;
            roundTokenMode.value = 'romaji';
        }
    }

    // Add Distractors (3-5 random words from other sentences)
    const isRoundRomaji = roundTokenMode.value === 'romaji';
    const allWords = sentences.flatMap(s => {
        if (!isRoundRomaji && s.kana && s.kana.includes(' ')) {
            return s.kana.split(' ');
        }
        return s.romaji.split(' ');
    });

    const distractors: string[] = [];
    let attempts = 0;
    while (distractors.length < 4 && attempts < 50) {
        attempts++;
        const word = allWords[Math.floor(Math.random() * allWords.length)];
        if (word && !tokensToUse.includes(word) && !distractors.includes(word) && word.length >= 1) {
            distractors.push(word);
        }
    }

    // Combine
    const combined = [...tokensToUse, ...distractors];

    // Create Stable Pool with Unique IDs
    poolTokens.value = combined.map((text, index) => ({
        id: index,
        text,
        used: false
    })).sort(() => Math.random() - 0.5); // Shuffle initially
};

// Interaction: Add to Answer
const addToAnswer = (token: Token) => {
    // Stop interaction if won OR lost (3 strikes)
    if (isCorrect.value || mistakeCount.value >= 3 || token.used) return;

    // Mark as used in pool (Visual change only, no shift)
    token.used = true;

    // Add reference to answer list
    answerTokens.value.push(token);

    // Reset check state on modification
    if (hasChecked.value) hasChecked.value = false;
};

// Interaction: Remove from Answer
const removeFromAnswer = (token: Token) => {
    if (isCorrect.value || mistakeCount.value >= 3) return;

    // Remove from answer list
    const index = answerTokens.value.findIndex(t => t.id === token.id);
    if (index !== -1) {
        answerTokens.value.splice(index, 1);
    }

    // Mark as unused in pool (Re-activates button)
    const poolToken = poolTokens.value.find(t => t.id === token.id);
    if (poolToken) {
        poolToken.used = false;
    }

    // Reset check state
    if (hasChecked.value) hasChecked.value = false;
};

// Reveal the correct solution
const revealSolution = () => {
    if (!currentSentence.value) return;

    let correctWords = currentSentence.value.romaji.split(' ');
    if (roundTokenMode.value === 'kana') {
        correctWords = currentSentence.value.kana.split(' ');
    }
    const solution: Token[] = [];

    // Reset pool and answer
    poolTokens.value.forEach(t => t.used = false);
    answerTokens.value = [];

    // Find and sequence tokens
    correctWords.forEach(word => {
        const token = poolTokens.value.find(t => t.text === word && !t.used);
        if (token) {
            token.used = true;
            solution.push(token);
        }
    });

    answerTokens.value = solution;
};

// Manual Validation
const checkAnswer = () => {
    if (!currentSentence.value || mistakeCount.value >= 3) return;
    hasChecked.value = true;

    const isRomaji = roundTokenMode.value === 'romaji';
    const built = answerTokens.value.map(t => t.text).join(isRomaji ? ' ' : '');

    const target = isRomaji
        ? currentSentence.value.romaji
        : currentSentence.value.kana.replace(/\s/g, '');

    // Normalize: remove trailing dot/punctuation if inconsistent? Maybe not yet.
    // Standard string compare
    if (built.toLowerCase().trim() === target.toLowerCase().trim()) {
        handleSuccess();
    } else {
        mistakeCount.value++;

        if (mistakeCount.value >= 3) {
            // Failure State
            userStore.updateBestCombo(0); // Reset local streak
            userStore.recordAnswer(false); // Global record (increments totalQuestions)
            revealSolution();
        }
    }
};

const handleSuccess = () => {
    isCorrect.value = true;
    happyConfetti();
    // Play Audio
    if (currentSentence.value) {
        // playSentenceAudio(currentSentence.value.id, currentSentence.value.japanese);
        userStore.recordAnswer(true, xpMultiplier); // Handles score++, XP, totalQuestions++
        userStore.updateBestCombo(userStore.currentCombo + 1); // Internal combo++
    }
};

// Drag and Drop Logic
const draggedItemIndex = ref<number | null>(null);

const onDragStart = (event: DragEvent, index: number) => {
    draggedItemIndex.value = index;
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.dropEffect = 'move';
    }
};

const onDrop = (event: DragEvent, targetIndex: number) => {
    if (draggedItemIndex.value === null) return;

    const itemToMove = answerTokens.value[draggedItemIndex.value];
    if (!itemToMove) return;

    // Remove from old pos
    answerTokens.value.splice(draggedItemIndex.value, 1);

    // Insert at new pos
    answerTokens.value.splice(targetIndex, 0, itemToMove);

    draggedItemIndex.value = null;

    // Reset check state
    if (hasChecked.value) hasChecked.value = false;
};

onMounted(() => {
    initRound();
});
</script>

<template>
    <div class="flex flex-col items-center w-full px-2 md:px-4">

        <div class="w-full relative flex items-center justify-center mb-0 md:mb-4">
            <!-- Header Section (Top of Page) -->
            <button @click="router.push('/training')"
                class="absolute left-0 text-tanuki-brown/60 hover:text-tanuki-brown transition-colors p-2 rounded-full hover:bg-stone-100">
                <ArrowLeft class="w-6 h-6" />
            </button>
            <h2 class="text-2xl md:text-4xl font-display font-bold text-tanuki-green text-center">
                Construction
            </h2>
        </div>

        <div class="w-full flex flex-col items-center max-w-4xl mx-auto">

            <div class="relative w-full max-w-2xl flex flex-col md:block mb-2">
                <!-- Score & Streak (Centered) -->
                <div class="relative w-full max-w-md mx-auto z-10">
                    <div
                        class="flex items-center justify-between gap-0 card p-2 px-4 shadow-sm text-sm border-2 border-tanuki-green w-full bg-white">
                        <div class="flex-1 flex items-center justify-center gap-2 font-bold text-tanuki-brown">
                            <Trophy class="w-4 h-4 text-tanuki-gold" />
                            <span>{{ score }}/{{ userStore.totalQuestions }}</span>
                        </div>

                        <div class="h-4 w-0.5 bg-tanuki-brown/20 rounded-full"></div>

                        <!-- Streak -->
                        <div class="flex-1 font-bold text-tanuki-green flex items-center justify-center gap-1">
                            <span>{{ userStore.currentCombo }}</span>
                            <Flame class="w-4 h-4 fill-orange-500 text-orange-600" />
                        </div>

                        <div class="h-4 w-0.5 bg-tanuki-brown/20 rounded-full"></div>

                        <!-- Hearts / Lives -->
                        <div class="flex-1 flex justify-center items-center gap-1">
                            <Heart v-for="i in 3" :key="i" class="w-4 h-4 transition-all"
                                :class="i > (3 - mistakeCount) ? 'fill-gray-200 text-gray-200 opacity-50 scale-75' : 'fill-red-500 text-red-600'" />
                        </div>

                        <!-- Bonus Pill -->
                        <div
                            class="absolute -right-3 -top-3 bg-linear-to-r from-amber-500 to-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            XP x{{ xpMultiplier }}
                        </div>
                    </div>
                </div>

                <!-- Filter Button (Absolute Right Desktop) -->
                <div
                    class="mt-3 md:mt-0 flex justify-center md:absolute md:right-0 md:top-0 md:bottom-0 md:flex items-center z-10">
                    <button @click="showSettings = !showSettings"
                        class="btn-filter py-2! px-3! shadow-sm md:w-auto w-full max-w-md">
                        <Settings2 class="w-5 h-5" />
                        <span class="inline">Filtres</span>
                    </button>
                </div>
            </div>

            <!-- Settings Panel -->
            <Transition name="fade">
                <div v-if="showSettings"
                    class="card w-full mb-6 p-6 animate-fade-in shadow-none border-2 border-tanuki-green bg-white">
                    <h3 class="text-lg font-bold text-tanuki-brown-dark mb-4 flex items-center gap-2">
                        <Settings2 class="w-5 h-5 text-tanuki-green" />
                        Options d'entraînement
                    </h3>

                    <div class="space-y-6">
                        <!-- Token Mode Mode -->
                        <div>
                            <p class="text-sm font-bold text-tanuki-brown/60 uppercase tracking-widest mb-3">Affichage
                                des
                                mots</p>
                            <div class="grid grid-cols-2 gap-3">
                                <button v-for="mode in ['romaji', 'kana']" :key="mode"
                                    @click="displaySettings.tokenMode = mode as 'romaji' | 'kana'; initRound()"
                                    class="flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-bold"
                                    :class="displaySettings.tokenMode === mode
                                        ? 'border-tanuki-green bg-green-50 text-tanuki-green'
                                        : 'border-tanuki-brown/10 hover:border-tanuki-brown/30 text-tanuki-brown/40'">
                                    <span class="capitalize">{{ mode }}</span>
                                    <div v-if="displaySettings.tokenMode === mode"
                                        class="w-5 h-5 bg-tanuki-green rounded-full flex items-center justify-center text-white">
                                        <Check class="w-3 h-3 stroke-3" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>

            <div v-if="currentSentence" class="w-full flex flex-col items-center">

                <!-- Main Game Card -->
                <div
                    class="card w-full text-center mb-4 md:mb-8 relative overflow-hidden group pt-2 px-2 pb-1 md:pt-4 md:pb-4 md:px-4 min-h-[250px] md:min-h-[unset] flex flex-col items-center justify-start bg-white border-2 border-tanuki-green shadow-lg">

                    <!-- Context -->
                    <div class="mb-2 md:mb-6 flex flex-col items-center w-full">
                        <h2 class="text-lg md:text-3xl font-bold text-tanuki-brown-dark leading-relaxed">
                            {{ currentSentence.translation }}
                        </h2>

                        <!-- Hint / See Hint Toggle -->
                        <div class="mt-2 min-h-[2rem] flex items-center justify-center">
                            <button v-if="!showHint && !isCorrect && mistakeCount < 3" @click="showHint = true"
                                class="text-tanuki-brown/40 hover:text-tanuki-green text-xs font-bold flex items-center gap-1 transition-colors px-3 py-1 border border-tanuki-brown/10 rounded-full hover:bg-tanuki-green/5">
                                <HelpCircle class="w-3 h-3" />
                                <span>Voir l'indice</span>
                            </button>
                            <p v-else-if="showHint"
                                class="text-tanuki-green text-lg animate-fade-in font-bold opacity-80 leading-relaxed font-japanese">
                                {{ currentSentence.japanese }}
                            </p>
                        </div>
                    </div>

                    <!-- Answer Zone (Drop Target) -->
                    <div class="w-full min-h-[80px] md:min-h-[100px] border-b-2 border-tanuki-brown/20 mb-1 md:mb-4 flex flex-wrap gap-1 md:gap-1.5 justify-center items-center pb-2 transition-colors"
                        :class="[isCorrect ? 'border-tanuki-green' : '', hasChecked && !isCorrect ? 'border-red-300 bg-red-50/50' : '']">

                        <p v-if="answerTokens.length === 0" class="text-gray-300 italic text-sm mb-2 select-none">
                            Cliquez sur les mots ci-dessous pour construire la phrase...
                        </p>

                        <div v-for="(token, idx) in answerTokens" :key="token.id" draggable="true"
                            @dragstart="onDragStart($event, idx)" @dragover.prevent @drop="onDrop($event, idx)"
                            class="animate-pop-in btn-3d btn-primary py-2 px-1.5 md:px-2 shadow-md cursor-move flex items-center gap-2 select-none active:cursor-grabbing hover:scale-105 transition-transform"
                            :class="[
                                roundTokenMode === 'kana' ? 'font-japanese font-medium text-base md:text-xl' : 'text-xs md:text-base'
                            ]" @click="removeFromAnswer(token)">
                            <span>{{ token.text }}</span>
                        </div>
                    </div>

                    <!-- Manual Validation Feedback -->
                    <div class="mb-1 transition-opacity duration-300 min-h-[1.2rem]"
                        :class="(hasChecked && !isCorrect) ? 'opacity-100' : 'opacity-0 select-none pointer-events-none'">
                        <span class="text-red-500 font-bold animate-bounce-short inline-block text-xs md:text-base">
                            {{ mistakeCount >= 3 ? 'Dommage ! La série est perdue.' : "Ce n'est pas tout à fait ça." }}
                        </span>
                    </div>

                    <!-- Validation Button (Directly under answer zone) -->
                    <div v-if="!isCorrect && mistakeCount < 3"
                        class="w-full flex justify-center min-h-[40px] md:min-h-[44px]">
                        <button v-if="answerTokens.length > 0" @click="checkAnswer"
                            class="btn-3d btn-primary w-full max-w-[140px] flex items-center justify-center gap-2 animate-pop-in shadow-lg py-1.5!">
                            <span class="font-bold text-sm">Valider</span>
                        </button>
                    </div>

                </div>

            </div>

            <!-- Pool (Source) with Border -->
            <div
                class="w-full max-w-4xl mb-2 md:mb-4 p-2 md:p-4 border-2 border-tanuki-green rounded-3xl bg-white/50 relative">
                <div
                    class="absolute -top-3 left-6 px-2 bg-[#FDFBF7] text-tanuki-brown/60 text-xs font-bold uppercase tracking-widest">
                    Propositions
                </div>
                <div class="flex flex-wrap justify-center gap-1 md:gap-2">
                    <button v-for="token in poolTokens" :key="token.id" @click="addToAnswer(token)"
                        :disabled="token.used"
                        class="btn-3d btn-secondary py-2 px-1.5 md:px-2 md:py-2.5 md:px-3 h-auto whitespace-normal transition-all duration-300"
                        :class="[
                            token.used ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 scale-100',
                            roundTokenMode === 'kana' ? 'font-japanese font-medium text-base md:text-xl' : 'text-xs md:text-base'
                        ]">
                        {{ token.text }}
                    </button>
                </div>
            </div>

        </div>

        <!-- Bottom Feedback Drawer (Duolingo Style) -->
        <Transition name="drawer">
            <div v-if="isCorrect || mistakeCount >= 3"
                class="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-6 md:pb-8! border-t-2 animate-drawer-in"
                :class="isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'">
                <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

                    <div class="flex items-center gap-4 md:gap-6 flex-1">
                        <img :src="isCorrect ? '/images/tanuki_success.png' : '/images/tanuki_failure.png'"
                            :alt="isCorrect ? 'Succès' : 'Échec'"
                            class="w-16 h-16 md:w-24 md:h-24 object-contain animate-bounce-short" />

                        <div class="flex-1">
                            <h3 class="text-xl md:text-2xl font-bold"
                                :class="isCorrect ? 'text-green-700' : 'text-red-700'">
                                {{ isCorrect ? 'Excellent !' : 'Oups !' }}
                            </h3>
                            <div v-if="!isCorrect" class="mt-1">
                                <p class="text-xs font-bold text-red-400 uppercase tracking-widest">Réponse correcte :
                                </p>
                                <p class="text-base md:text-lg font-bold text-gray-800 leading-tight">
                                    {{ currentSentence?.romaji }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
                        <button v-if="currentSentence"
                            @click="playSentenceAudio(currentSentence.id, currentSentence.japanese)"
                            class="flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-2xl transition-all w-full sm:w-auto overflow-hidden whitespace-nowrap"
                            :class="isCorrect ? 'text-green-700 bg-green-200/50 hover:bg-green-200' : 'text-red-700 bg-red-200/50 hover:bg-red-200'">
                            <Volume2 class="w-5 h-5" />
                            <span>Écouter</span>
                        </button>

                        <button @click="initRound"
                            class="btn-3d w-full sm:w-48 flex items-center justify-center gap-2 group py-3!"
                            :class="isCorrect ? 'btn-primary' : 'btn-danger'">
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
.animate-pop-in {
    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
    from {
        opacity: 0;
        transform: scale(0.5);
    }

    to {
        opacity: 1;
        transform: scale(1);
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
