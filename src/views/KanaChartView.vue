<script setup lang="ts">
import { ref, computed } from 'vue';
import { hiragana, katakana } from '@/data/kana';

const mode = ref<'hiragana' | 'katakana'>('hiragana');

const currentKana = computed(() => mode.value === 'hiragana' ? hiragana : katakana);
</script>

<template>
    <div class="flex flex-col items-center">
        <h2 class="text-4xl font-display font-bold text-tanuki-green mb-8">Tableaux des Kana</h2>

        <!-- Toggle -->
        <div class="flex bg-white rounded-full p-1 shadow-md mb-8 border border-gray-200">
            <button @click="mode = 'hiragana'"
                :class="['px-6 py-2 rounded-full font-bold transition-all', mode === 'hiragana' ? 'bg-tanuki-green text-white shadow-sm' : 'text-gray-500 hover:text-tanuki-green']">
                Hiragana
            </button>
            <button @click="mode = 'katakana'"
                :class="['px-6 py-2 rounded-full font-bold transition-all', mode === 'katakana' ? 'bg-tanuki-green text-white shadow-sm' : 'text-gray-500 hover:text-tanuki-green']">
                Katakana
            </button>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-5 gap-2 md:gap-4 max-w-2xl w-full p-4">
            <div v-for="(item, index) in currentKana" :key="index"
                class="aspect-square flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-tanuki-beige/50 hover:shadow-md hover:border-tanuki-gold transition-all cursor-pointer group">
                <template v-if="item.char">
                    <span
                        class="text-3xl font-bold text-tanuki-brown-dark group-hover:scale-110 transition-transform">{{
                            item.char }}</span>
                    <span class="text-sm text-gray-400 group-hover:text-tanuki-gold mt-1">{{ item.romaji }}</span>
                </template>
            </div>
        </div>
    </div>
</template>
