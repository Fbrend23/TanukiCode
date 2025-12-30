<script setup lang="ts">
import { ref, computed } from 'vue';
import { hiragana, katakana, type KanaType, type KanaChar } from '@/data/kana';
import { speakJapanese, playKanaAudio } from '@/utils/audio';
import { Volume2, Info } from 'lucide-vue-next';

const mode = ref<'hiragana' | 'katakana'>('hiragana');
const currentTab = ref<KanaType | 'modified'>('basic'); // 'modified' includes dakuten + handakuten

const currentKanaList = computed(() => mode.value === 'hiragana' ? hiragana : katakana);

const displayedKana = computed(() => {
    if (currentTab.value === 'basic') {
        return currentKanaList.value.filter(k => k.type === 'basic');
    }
    if (currentTab.value === 'modified') {
        return currentKanaList.value.filter(k => k.type === 'dakuten' || k.type === 'handakuten');
    }
    if (currentTab.value === 'yoon') {
        const raw = currentKanaList.value.filter(k => k.type === 'yoon');
        // Insert spacer every 3 items for desktop layout
        // Define a union type for items in the grid
        type GridItem = typeof raw[0] | { type: 'spacer'; char?: string; romaji?: string };
        const result: GridItem[] = [];

        for (let i = 0; i < raw.length; i += 3) {
            result.push(...raw.slice(i, i + 3));
            if (i + 3 < raw.length) { // Verify if it's strictly inside the list logic?
                // actually we want spacer at pos 3, 7, etc.
                // Row 1: 0,1,2 (Spacer) 3,4,5
                // The spacer is visually between Left and Right groups.
                // Since we fill Row by Row.
                // We need a spacer after every *Odd* group of 3?
                // Group 0 (Left), Spacer, Group 1 (Right)
                // Group 2 (Left), Spacer, Group 3 (Right)
                // So insert spacer after index i+3 only if (i/3) is even?
                // i=0 (Group 0): Push 0,1,2. Push Spacer.
                // i=3 (Group 1): Push 3,4,5. New Row.
                // i=6 (Group 2): Push 6,7,8. Push Spacer.
                if ((i / 3) % 2 === 0) {
                    result.push({ type: 'spacer' });
                }
            } else if ((i / 3) % 2 === 0) {
                // Even if it is the last group, if it is on the Left, we might want a spacer for grid alignment?
                // If last group is Left, and we don't have a Right group, spacer pushes nothing.
                // But consistent grid structure is better.
                result.push({ type: 'spacer' });
            }
        }
        return result;
    }
    return [];
});

const gridLayoutClass = computed(() => {
    if (currentTab.value === 'yoon') {
        // Desktop: 3 cols | Spacer (3rem) | 3 cols
        return 'grid-cols-3 md:grid-cols-[repeat(3,minmax(0,1fr))_3rem_repeat(3,minmax(0,1fr))] max-w-5xl gap-2 md:gap-4';
    }
    return 'grid-cols-4 sm:grid-cols-5 max-w-5xl gap-2 md:gap-4';
});

type GridItem = KanaChar | { type: 'spacer'; char?: string; romaji?: string };

function playSound(item: GridItem) {
    if (item.char && 'romaji' in item && item.romaji) {
        playKanaAudio(item.char, item.romaji);
    } else if (item.char) {
        // Fallback if no romaji (shouldn't happen for KanaChar)
        speakJapanese(item.char);
    }
}
</script>

<template>
    <div class="flex flex-col items-center">
        <h2 class="text-3xl md:text-4xl font-display font-bold text-tanuki-green mb-1 md:mb-8">Tableaux des Kana</h2>

        <!-- Mode Toggle (Hiragana/Katakana) -->
        <div class="card flex p-1 mb-4">
            <button @click="mode = 'hiragana'"
                :class="['px-6 py-2 rounded-full font-bold transition-all', mode === 'hiragana' ? 'bg-tanuki-green text-white shadow-sm' : 'text-gray-500 hover:text-tanuki-green']">
                Hiragana
            </button>
            <button @click="mode = 'katakana'"
                :class="['px-6 py-2 rounded-full font-bold transition-all', mode === 'katakana' ? 'bg-tanuki-green text-white shadow-sm' : 'text-gray-500 hover:text-tanuki-green']">
                Katakana
            </button>
        </div>

        <!-- Tabs (Type) -->
        <div class="flex gap-2 mb-6 overflow-x-auto max-w-full px-4 text-sm md:text-base">
            <button @click="currentTab = 'basic'"
                :class="['px-4 py-1.5 rounded-lg font-bold transition-all border-2', currentTab === 'basic' ? 'bg-tanuki-gold text-white border-tanuki-gold' : 'bg-transparent text-tanuki-brown border-tanuki-brown/20 hover:border-tanuki-gold']">
                De base
            </button>
            <button @click="currentTab = 'modified'"
                :class="['px-4 py-1.5 rounded-lg font-bold transition-all border-2', currentTab === 'modified' ? 'bg-tanuki-gold text-white border-tanuki-gold' : 'bg-transparent text-tanuki-brown border-tanuki-brown/20 hover:border-tanuki-gold']">
                Dérivés (Dakuten)
            </button>
            <button @click="currentTab = 'yoon'"
                :class="['px-4 py-1.5 rounded-lg font-bold transition-all border-2', currentTab === 'yoon' ? 'bg-tanuki-gold text-white border-tanuki-gold' : 'bg-transparent text-tanuki-brown border-tanuki-brown/20 hover:border-tanuki-gold']">
                Combos (Yoon)
            </button>
        </div>

        <!-- Hint -->
        <div
            class="flex items-center gap-2 text-tanuki-brown/80 bg-tanuki-beige/30 px-4 py-2 rounded-lg mb-1 text-sm animate-fade-in">
            <Info class="w-4 h-4 text-tanuki-gold" />
            <span>Cliquez sur un kana pour écouter sa prononciation.</span>
        </div>

        <!-- Grid -->
        <div :class="['grid w-full p-4 transition-all relative', gridLayoutClass]">
            <!-- Divider is now rendered inside spacer items or we keep absolute?
                 If we rely on spacers, we can render the line inside every spacer!
                 Let's drop absolute divider and put it in the spacer. -->

            <template v-for="(item, index) in displayedKana" :key="index">
                <!-- Spacer (Desktop Divider) -->
                <div v-if="item.type === 'spacer'" class="hidden md:flex items-center justify-center">
                    <div class="h-full w-0.5 bg-tanuki-brown/10 rounded-full"></div>
                </div>

                <!-- Card -->
                <div v-else @click="playSound(item)"
                    class="aspect-square flex flex-col items-center justify-center bg-white rounded-2xl shadow-md border-2 border-tanuki-green hover:shadow-lg hover:bg-tanuki-beige/20 transition-all cursor-pointer group relative overflow-hidden z-10">
                    <template v-if="item.char">
                        <span
                            :class="['font-bold text-tanuki-brown-dark group-hover:scale-110 transition-transform', item.char.length > 1 ? 'text-3xl md:text-5xl' : 'text-4xl md:text-6xl']">{{
                                item.char }}</span>
                        <span class="text-sm md:text-xl text-gray-400 group-hover:text-tanuki-gold mt-1">{{ item.romaji
                            }}</span>

                        <!-- Audio Icon Overlay -->
                        <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Volume2 class="w-3 h-3 text-tanuki-gold/50" />
                        </div>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>
