<script setup lang="ts">
import { ref, computed } from 'vue';
import { Volume2, Info, Check } from 'lucide-vue-next';
import { hiragana, katakana, type KanaChar, type KanaType } from '@/data/kana';
import { speakJapanese, playKanaAudio } from '@/utils/audio';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';

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
        type GridItem = typeof raw[0] | { type: 'spacer'; char?: string; romaji?: string };
        const result: GridItem[] = [];

        for (let i = 0; i < raw.length; i += 3) {
            result.push(...raw.slice(i, i + 3));
            if ((i / 3) % 2 === 0) {
                result.push({ type: 'spacer' });
            }
        }
        return result;
    }
    return [];
});

const gridLayoutClass = computed(() => {
    if (currentTab.value === 'yoon') {
        return 'grid-cols-3 md:grid-cols-[repeat(3,1fr)_auto_repeat(3,1fr)] max-w-5xl gap-2 md:gap-4';
    }
    return 'grid-cols-5 max-w-5xl gap-2 md:gap-4';
});

const userStore = useUserStore();
const authStore = useAuthStore();
const isMastered = (item: { char?: string; romaji?: string }) => {
    const id = item.char || item.romaji; // Fallback to romaji if needed, but char is best
    return userStore.masteredItems.includes(id || '');
};

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
        <h2 class="text-3xl md:text-4xl font-display font-bold text-tanuki-green mb-1 md:mb-8">Kanas</h2>

        <div class="card flex p-1 mb-4 shadow-none border-tanuki-green/40">
            <button @click="mode = 'hiragana'"
                :class="['px-6 py-2 rounded-full font-bold transition-all', mode === 'hiragana' ? 'bg-tanuki-green text-white shadow-sm' : 'text-gray-500 hover:text-tanuki-green']">
                Hiragana
            </button>
            <button @click="mode = 'katakana'"
                :class="['px-6 py-2 rounded-full font-bold transition-all', mode === 'katakana' ? 'bg-tanuki-green text-white shadow-sm' : 'text-gray-500 hover:text-tanuki-green']">
                Katakana
            </button>
        </div>

        <div class="flex gap-2 mb-6 overflow-x-auto max-w-full px-4 text-sm md:text-base scrollbar-hide">
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

        <div
            class="flex items-center gap-2 text-tanuki-brown/80 bg-tanuki-beige/30 px-4 rounded-lg mb-1 text-sm animate-fade-in border border-tanuki-beige">
            <Info class="w-4 h-4 text-tanuki-gold" />
            <span>Cliquez sur un kana pour écouter sa prononciation.</span>
        </div>

        <div :class="['grid w-full px-4 pb-4 pt-0 transition-all relative', gridLayoutClass]">
            <template v-for="(item, index) in displayedKana" :key="index">
                <div v-if="item.type === 'spacer'" class="hidden md:flex items-center justify-center">
                    <div class="h-full w-0.5 bg-tanuki-brown/10 rounded-full"></div>
                </div>

                <div v-else @click="playSound(item)"
                    class="aspect-[4/5] flex flex-col items-center justify-center pt-4 bg-white rounded-2xl border-2 transition-all cursor-pointer group relative overflow-hidden z-10"
                    :class="[isMastered(item) ? 'border-tanuki-green bg-tanuki-green/5' : 'hover:shadow-xl hover:border-tanuki-green-light']">
                    <template v-if="item.char">
                        <span
                            :class="['font-bold', isMastered(item) ? 'text-tanuki-green' : 'text-tanuki-brown-dark', item.char.length > 1 ? 'text-2xl md:text-5xl' : 'text-3xl md:text-6xl']">
                            {{ item.char }}
                        </span>
                        <span
                            :class="['text-xs md:text-xl transition-colors mt-1', isMastered(item) ? 'text-tanuki-green/60' : 'text-gray-400 group-hover:text-tanuki-gold']">
                            {{ item.romaji }}
                        </span>

                        <button v-if="authStore.user"
                            @click.stop="userStore.toggleMastery(item.char || item.romaji || '')"
                            class="absolute top-1 left-1 p-1 rounded-full transition-colors z-20"
                            :class="[isMastered(item) ? 'bg-tanuki-green text-white hover:bg-tanuki-green-light' : 'bg-gray-100 text-gray-300 hover:bg-gray-200 hover:text-gray-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity']">
                            <Check class="w-3 h-3 stroke-[4]" />
                        </button>

                        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Volume2 class="w-4 h-4 text-tanuki-gold/50" />
                        </div>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>
