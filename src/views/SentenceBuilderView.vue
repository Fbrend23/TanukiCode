<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { sentences, type Sentence } from '@/data/sentences';
import { ArrowLeft, RefreshCw, Check, Volume2, HelpCircle, Trophy, Heart, Flame, X } from 'lucide-vue-next';
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
const xpMultiplier = 1.5; // Fixed bonus for higher difficulty

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
    const rawTokens = random.romaji.split(' ');

    // Add Distractors (3-5 random words from other sentences)
    const allWords = sentences.flatMap(s => s.romaji.split(' '));
    const distractors: string[] = [];
    // Safety break after 50 attempts
    let attempts = 0;
    while (distractors.length < 4 && attempts < 50) {
        attempts++;
        const word = allWords[Math.floor(Math.random() * allWords.length)];
        // Avoid duplicates in distractors and correct sentence
        // Also filter out punctuation if possible, but simplest is exact match check
        if (word && !rawTokens.includes(word) && !distractors.includes(word) && word.length > 1) {
            distractors.push(word);
        }
    }

    // Combine
    const combined = [...rawTokens, ...distractors];

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

    const correctWords = currentSentence.value.romaji.split(' ');
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

    const built = answerTokens.value.map(t => t.text).join(' ');

    if (built === currentSentence.value.romaji) {
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
    <div class="flex flex-col items-center w-full px-4 font-outfit min-h-screen">

        <div class="flex flex-col items-center w-full relative">
            <!-- Header Section (Top of Page) -->
            <button @click="router.push('/training')"
                class="absolute left-0 top-1 text-tanuki-brown/60 hover:text-tanuki-brown transition-colors p-2 rounded-full hover:bg-stone-100 md:top-2">
                <ArrowLeft class="w-6 h-6" />
            </button>
            <h2 class="text-2xl md:text-4xl font-display font-bold text-tanuki-green mb-1 md:mb-8 text-center">
                Construction
            </h2>
        </div>

        <div class="w-full flex flex-col items-center max-w-3xl mx-auto">

            <!-- Score & Streak -->
            <div class="relative w-full max-w-md md:max-w-lg mx-auto z-10 mb-4 md:mb-6">
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

            <div v-if="currentSentence" class="w-full flex flex-col items-center">

                <!-- Main Game Card -->
                <div
                    class="card w-full text-center mb-6 md:mb-8 relative overflow-hidden group p-4 md:p-10 min-h-[25vh] md:min-h-[30vh] flex flex-col items-center justify-center bg-white border-2 border-tanuki-green shadow-lg">



                    <!-- Context -->
                    <div class="mb-4 md:mb-8">
                        <h2 class="text-lg md:text-3xl font-bold text-tanuki-brown-dark leading-relaxed">
                            {{ currentSentence.translation }}
                        </h2>
                        <p v-if="showHint"
                            class="text-tanuki-green font-jp text-lg mt-2 animate-fade-in font-bold opacity-80">
                            {{ currentSentence.japanese }}
                        </p>
                    </div>

                    <!-- Answer Zone (Drop Target) -->
                    <div class="w-full min-h-[80px] md:min-h-[100px] border-b-2 border-tanuki-brown/20 mb-2 md:mb-8 flex flex-wrap gap-2 justify-center items-center pb-4 transition-colors"
                        :class="[isCorrect ? 'border-tanuki-green' : '', hasChecked && !isCorrect ? 'border-red-300 bg-red-50/50' : '']">

                        <p v-if="answerTokens.length === 0" class="text-gray-300 italic text-sm mb-2 select-none">
                            Cliquez sur les mots ci-dessous pour construire la phrase...
                        </p>

                        <div v-for="(token, idx) in answerTokens" :key="token.id" draggable="true"
                            @dragstart="onDragStart($event, idx)" @dragover.prevent @drop="onDrop($event, idx)"
                            class="animate-pop-in btn-3d btn-primary py-2 px-3 shadow-md text-xs md:text-base cursor-move flex items-center gap-2 select-none active:cursor-grabbing hover:scale-105 transition-transform"
                            @click="removeFromAnswer(token)">
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

                    <!-- Success/Failure Overlay -->
                    <div v-if="isCorrect || mistakeCount >= 3"
                        class="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-20 animate-fade-in flex-col">
                        <div v-if="isCorrect"
                            class="text-green-600 flex flex-col items-center animate-bounce-short mb-4">
                            <Check class="w-16 h-16 border-4 border-current rounded-full p-2 mb-2" />
                            <span class="text-2xl font-bold">Correct !</span>
                        </div>
                        <div v-else class="text-red-500 flex flex-col items-center animate-bounce-short mb-4">
                            <X class="w-16 h-16 border-4 border-current rounded-full p-2 mb-2" />
                            <span class="text-2xl font-bold">Échec</span>
                        </div>
                        <button @click="playSentenceAudio(currentSentence.id, currentSentence.japanese)"
                            class="flex items-center gap-2 text-tanuki-green font-bold bg-tanuki-green/10 px-4 py-2 rounded-full hover:bg-tanuki-green/20 transition-colors">
                            <Volume2 class="w-5 h-5" />
                            <span>Écouter</span>
                        </button>
                    </div>

                </div>

                <!-- Pool (Source) with Border -->
                <div
                    class="w-full max-w-2xl mb-6 md:mb-8 p-4 md:p-6 border-2 border-tanuki-green rounded-3xl bg-white/50 relative">
                    <div
                        class="absolute -top-3 left-6 px-2 bg-[#FDFBF7] text-tanuki-brown/60 text-xs font-bold uppercase tracking-widest">
                        Propositions
                    </div>
                    <div class="flex flex-wrap justify-center gap-2 md:gap-3">
                        <button v-for="token in poolTokens" :key="token.id" @click="addToAnswer(token)"
                            :disabled="token.used"
                            class="btn-3d btn-secondary py-2 px-3 text-xs md:py-3 md:px-4 md:text-base h-auto whitespace-normal transition-all duration-300"
                            :class="token.used ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 scale-100'">
                            {{ token.text }}
                        </button>
                    </div>
                </div>

                <!-- Controls -->
                <div class="flex gap-4 w-full max-w-md justify-center items-center">
                    <button v-if="!isCorrect && mistakeCount < 3" @click="showHint = !showHint"
                        class="text-tanuki-brown/60 hover:text-tanuki-green text-sm font-bold flex items-center gap-1 transition-colors px-4 py-2">
                        <HelpCircle class="w-4 h-4" />
                        <span>Indice</span>
                    </button>

                    <!-- Validation Button (Visible if tokens exist) -->
                    <button v-if="!isCorrect && mistakeCount < 3 && answerTokens.length > 0" @click="checkAnswer"
                        class="btn-3d btn-primary px-6 md:px-8 py-2 md:py-3 text-sm md:text-base animate-pop-in">
                        <span>Valider</span>
                    </button>

                    <button v-if="isCorrect || mistakeCount >= 3" @click="initRound"
                        class="btn-3d btn-gold flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 text-sm md:text-base animate-pop-in">
                        <RefreshCw class="w-4 h-4" />
                        <span>Suivant</span>
                    </button>
                </div>

            </div>
        </div>
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
</style>
