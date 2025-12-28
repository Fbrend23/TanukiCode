<script setup lang="ts">
import { X, Info } from 'lucide-vue-next'
import { ref } from 'vue'
import type { Kanji } from '@/data/kanji'

defineProps<{
    kanji: Kanji | null
    isOpen: boolean
}>()

const emit = defineEmits(['close'])

const showInfo = ref(false)
</script>

<template>
    <Transition name="fade">
        <div v-if="isOpen && kanji" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="emit('close')"></div>

            <!-- Modal Content -->
            <div
                class="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden z-10 animate-modal-in border-4 border-tanuki-green">
                <!-- Header Pattern -->
                <div class="h-24 bg-tanuki-green relative overflow-hidden flex items-center justify-center">
                    <div
                        class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                    </div>
                    <!-- Close Button -->
                    <button @click="emit('close')"
                        class="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors">
                        <X class="w-6 h-6" />
                    </button>
                </div>

                <!-- Body -->
                <div class="p-8 -mt-12 relative">
                    <!-- Character Circle -->
                    <div
                        class="w-32 h-32 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg border-4 border-tanuki-gold mb-6">
                        <span class="font-display text-8xl text-tanuki-brown-dark">{{ kanji.character }}</span>
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
                                <div class="text-lg font-mono text-blue-900 font-bold break-words">{{
                                    kanji.onyomi.join('・') }}
                                </div>
                            </div>
                            <!-- Kunyomi Card -->
                            <div
                                class="bg-tanuki-beige/50 border-2 border-tanuki-green-light/30 p-4 rounded-2xl text-center">
                                <div class="text-xs font-bold text-tanuki-green-light uppercase tracking-widest mb-2">
                                    Kunyomi</div>
                                <div class="text-lg font-mono text-tanuki-brown-dark font-bold break-words">{{
                                    kanji.kunyomi.join('・') }}
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
