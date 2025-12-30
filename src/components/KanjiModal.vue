<script setup lang="ts">
import { X, Info, Volume2 } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import type { Kanji } from '@/data/kanji'
import { playKanjiAudio } from '@/utils/audio'

const props = defineProps<{
    kanji: Kanji | null
    isOpen: boolean
}>()

const emit = defineEmits(['close'])

const showInfo = ref(false)

const playExample = (reading: string, index: number) => {
    if (!props.kanji) return
    playKanjiAudio(props.kanji.character, index, reading)
}

// Auto-play sound when modal opens
watch(() => props.isOpen, (newVal) => {
    if (newVal && props.kanji) {
        // Auto-play removed per user request
    }
})
</script>

<template>
    <Transition name="fade">
        <div v-if="isOpen && kanji" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="emit('close')"></div>

            <!-- Modal Content -->
            <div
                class="bg-white rounded-3xl w-full max-w-lg md:max-w-2xl shadow-2xl relative max-h-[90vh] z-10 animate-modal-in border-4 border-tanuki-green overflow-y-auto overscroll-contain">
                <!-- Header Pattern -->
                <div class="h-16 md:h-20 bg-tanuki-green relative shrink-0 flex items-center justify-center z-0">
                    <div
                        class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                    </div>
                </div>

                <!-- Close Button (Fixed above everything) -->
                <button @click="emit('close')"
                    class="absolute top-3 right-3 md:top-4 md:right-4 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white p-3 rounded-full transition-colors z-50 shadow-sm backdrop-blur-sm">
                    <X class="w-6 h-6" />
                </button>

                <!-- Body (Scrollable) -->
                <div class="p-5 md:p-8 -mt-10 md:-mt-12 relative z-10">
                    <!-- Character Circle -->
                    <div
                        class="relative w-24 h-24 md:w-32 md:h-32 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg border-4 border-tanuki-gold mb-4 md:mb-6 shrink-0">
                        <span class="font-display text-6xl md:text-8xl text-tanuki-brown-dark">{{ kanji.character
                            }}</span>
                    </div>

                    <div class="text-center mb-6">
                        <h2 class="text-3xl font-bold text-tanuki-green mb-2 capitalize">{{ kanji.meaning.join(', ') }}
                        </h2>
                        <div class="flex items-center justify-center gap-2">
                            <span
                                class="bg-tanuki-beige px-3 py-1 rounded-full text-tanuki-brown text-sm font-bold">JLPT
                                N{{ kanji.jlpt }}</span>
                            <span class="bg-tanuki-beige px-3 py-1 rounded-full text-tanuki-brown text-sm font-bold">{{
                                kanji.strokes }} Traits</span>
                        </div>
                    </div>

                    <!-- Readings Grid -->
                    <div class="space-y-4">
                        <!-- Info Toggle -->
                        <div class="flex justify-center">
                            <button @click="showInfo = !showInfo"
                                class="text-xs flex items-center gap-1 text-tanuki-green font-bold hover:underline transition-colors">
                                <Info class="w-4 h-4" />
                                {{ showInfo ? 'Masquer les explications' : 'Comprendre les lectures' }}
                            </button>
                        </div>

                        <div v-if="showInfo"
                            class="bg-blue-50 p-4 rounded-xl text-sm text-gray-700 space-y-2 border border-blue-100 animate-fade-in">
                            <p><span class="font-bold text-blue-600">Onyomi (Lecture Chinoise)</span> : Utilisée quand
                                le kanji est combiné (ex: 日本).</p>
                            <p><span class="font-bold text-tanuki-green">Kunyomi (Lecture Japonaise)</span> : Utilisée
                                quand le kanji est seul (ex: 日).</p>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <!-- Onyomi Card -->
                            <div class="bg-blue-50/50 border-2 border-blue-100 p-4 rounded-2xl text-center">
                                <div class="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Onyomi</div>
                                <div class="text-xl font-bold text-blue-900 font-body break-words">{{
                                    kanji.onyomi.join('・') }}
                                </div>
                            </div>
                            <!-- Kunyomi Card -->
                            <div
                                class="bg-tanuki-beige/50 border-2 border-tanuki-green-light/30 p-4 rounded-2xl text-center">
                                <div class="text-xs font-bold text-tanuki-green-light uppercase tracking-widest mb-2">
                                    Kunyomi</div>
                                <div class="text-xl font-bold text-tanuki-brown-dark font-body break-words">{{
                                    kanji.kunyomi.join('・') }}
                                </div>
                            </div>
                        </div>

                        <!-- Examples Section -->
                        <div v-if="kanji.examples && kanji.examples.length > 0"
                            class="mt-6 border-t border-tanuki-beige pt-6 pb-8">
                            <h3 class="text-center text-tanuki-brown text-lg font-bold mb-4">Exemples</h3>
                            <div class="space-y-3">
                                <div v-for="(ex, idx) in kanji.examples" :key="idx"
                                    class="bg-white border border-tanuki-beige rounded-xl p-3 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                    <div class="flex flex-col">
                                        <div class="flex flex-wrap items-baseline gap-x-2 md:gap-x-3 gap-y-1">
                                            <span class="font-bold text-tanuki-brown-dark text-xl md:text-2xl">{{
                                                ex.word }}</span>
                                            <span
                                                class="text-lg md:text-xl text-tanuki-brown-dark/80 font-bold bg-tanuki-beige/50 px-2 rounded-md">{{
                                                    ex.reading }}</span>
                                        </div>
                                        <span class="text-sm md:text-base text-tanuki-green font-bold mt-1">{{
                                            ex.meaning }}</span>
                                    </div>
                                    <button @click="playExample(ex.reading, idx)"
                                        class="bg-tanuki-gold/10 hover:bg-tanuki-gold/20 active:bg-tanuki-gold/30 text-tanuki-brown p-3 rounded-full transition-colors shrink-0 ml-2">
                                        <Volume2 class="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.animate-modal-in {
    animation: modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-in {
    from {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}
</style>
