<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { particleQuestions, type ParticleQuestion } from '@/data/particleQuiz'
import { Volume2 } from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore'
import { happyConfetti } from '@/utils/confetti'
import TrainingHeader from '@/components/training/TrainingHeader.vue'
import TrainingStats from '@/components/training/TrainingStats.vue'
import SkipButton from '@/components/training/SkipButton.vue'
import FeedbackDrawer from '@/components/training/FeedbackDrawer.vue'
import { playParticleAudio } from '@/utils/audio'

const userStore = useUserStore()

// Game State
const currentQuestion = ref<ParticleQuestion | null>(null)
const selectedOption = ref<string | null>(null)
const isCorrect = ref(false)
const hasChecked = ref(false)
const mistakeCount = ref(0)
const xpMultiplier = 1.2 // Bonus for grammar

const initRound = () => {
    isCorrect.value = false
    hasChecked.value = false
    selectedOption.value = null
    mistakeCount.value = 0

    // Pick random question, different from current if possible
    const randomIndex = Math.floor(Math.random() * particleQuestions.length)
    let nextQ = particleQuestions[randomIndex]

    if (currentQuestion.value && particleQuestions.length > 1 && nextQ) {
        while (nextQ && nextQ.id === currentQuestion.value.id) {
            const newRandomIndex = Math.floor(Math.random() * particleQuestions.length)
            const potentialNext = particleQuestions[newRandomIndex]
            if (potentialNext) nextQ = potentialNext
        }
    }

    if (nextQ) {
        currentQuestion.value = nextQ
    }
}

const selectOption = (option: string) => {
    if (hasChecked.value || mistakeCount.value >= 1) return
    selectedOption.value = option
    checkAnswer()
}

const checkAnswer = () => {
    if (!currentQuestion.value || !selectedOption.value || hasChecked.value) return

    hasChecked.value = true

    if (selectedOption.value === currentQuestion.value.correctParticle) {
        handleSuccess()
    } else {
        handleFailure()
    }
}

const handleSuccess = () => {
    isCorrect.value = true
    const newCombo = userStore.currentCombo + 1
    if ([5, 10, 25, 50, 100].includes(newCombo)) {
        happyConfetti()
    }
    userStore.recordAnswer(true, xpMultiplier)
    userStore.updateBestCombo(newCombo)
}

const handleFailure = () => {
    mistakeCount.value++
    if (mistakeCount.value >= 1) {
        // User requested 1 life for particles.
        userStore.updateBestCombo(0)
        userStore.recordAnswer(false)
    }
}

const skipQuestion = () => {
    userStore.updateBestCombo(0)
    initRound()
}

onMounted(() => {
    initRound()
})
</script>

<template>
    <div class="flex flex-col items-center w-full px-2 md:px-4 pb-24">
        <TrainingHeader title="Particules">
            <template #actions>
                <SkipButton @click="skipQuestion" />
            </template>
        </TrainingHeader>

        <div class="w-full flex flex-col items-center max-w-4xl mx-auto">
            <!-- Stats -->
            <TrainingStats :score="userStore.score" :total="userStore.totalQuestions" :combo="userStore.currentCombo"
                :lives="1 - mistakeCount" :maxLives="1" :xpMultiplier="xpMultiplier" class="mb-6" />

            <div v-if="currentQuestion" class="w-full flex flex-col items-center">
                <!-- Question Card -->
                <div
                    class="card w-full max-w-2xl p-8 mb-8 text-center bg-white border-2 border-tanuki-green shadow-xl relative overflow-hidden group">
                    <!-- Japanese Sentence with Gap -->
                    <div class="flex flex-wrap justify-center items-center gap-2 mb-8">
                        <template v-for="(part, index) in currentQuestion.sentence.split('_')" :key="index">
                            <span class="text-3xl md:text-5xl font-japanese font-bold text-tanuki-brown-dark">
                                {{ part }}
                            </span>
                            <div v-if="index < currentQuestion.sentence.split('_').length - 1"
                                class="w-12 h-12 md:w-16 md:h-16 border-b-4 border-tanuki-green flex items-center justify-center bg-tanuki-beige/20 rounded-t-lg transition-all"
                                :class="[
                                    selectedOption ? 'bg-tanuki-green/10' : '',
                                    hasChecked && isCorrect ? 'bg-green-100 border-green-500 text-green-600' : '',
                                    hasChecked && !isCorrect ? 'bg-red-100 border-red-500 text-red-600' : '',
                                ]">
                                <span v-if="selectedOption" class="text-2xl md:text-4xl font-japanese font-bold">
                                    {{ selectedOption }}
                                </span>
                                <span v-else class="text-tanuki-green/30 animate-pulse">?</span>
                            </div>
                        </template>
                    </div>

                    <!-- Translation -->
                    <h2 class="text-xl md:text-2xl font-bold text-tanuki-brown-dark/60 italic mb-4">
                        {{ currentQuestion.translation }}
                    </h2>
                </div>

                <!-- Options Grid -->
                <div class="grid grid-cols-2 gap-4 w-full max-w-md">
                    <button v-for="option in currentQuestion.options" :key="option" @click="selectOption(option)"
                        :disabled="hasChecked && mistakeCount >= 1"
                        class="btn-3d flex items-center justify-center p-6 text-3xl font-japanese font-bold transition-all"
                        :class="[
                            selectedOption === option
                                ? 'btn-primary scale-105'
                                : 'btn-secondary text-tanuki-brown-dark',
                            hasChecked && option === currentQuestion.correctParticle
                                ? 'bg-green-500! border-green-700! text-white!'
                                : '',
                            hasChecked && selectedOption === option && !isCorrect
                                ? 'bg-red-500! border-red-700! text-white!'
                                : '',
                        ]">
                        {{ option }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Feedback Drawer -->
        <FeedbackDrawer :isOpen="isCorrect || mistakeCount >= 1" :isCorrect="isCorrect"
            :correctAnswer="currentQuestion?.romaji" @next="initRound">
            <template #details>
                <div class="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto mt-4 md:mt-0">
                    <button v-if="currentQuestion" @click="
                        playParticleAudio(
                            currentQuestion.id,
                            currentQuestion.sentence.replace('_', currentQuestion.correctParticle),
                        )
                        " class="flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-2xl transition-all w-full sm:w-auto overflow-hidden whitespace-nowrap"
                        :class="isCorrect
                                ? 'text-green-700 bg-green-200/50 hover:bg-green-200'
                                : 'text-red-700 bg-red-200/50 hover:bg-red-200'
                            ">
                        <Volume2 class="w-5 h-5" />
                        <span>Écouter</span>
                    </button>
                </div>
            </template>
        </FeedbackDrawer>
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
</style>
