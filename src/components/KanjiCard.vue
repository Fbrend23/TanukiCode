<script setup lang="ts">
import type { Kanji } from '@/data/kanji'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'
import { Check } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{ kanji: Kanji }>()

const userStore = useUserStore()
const authStore = useAuthStore()
const isMastered = computed(() => userStore.masteredItems.includes(props.kanji.character))
const toggleMastery = () => userStore.toggleMastery(props.kanji.character)
</script>

<template>
  <div
    class="flex flex-col items-center bg-white rounded-2xl border-2 transition-all cursor-pointer group relative overflow-hidden p-4 h-full"
    :class="[isMastered ? 'border-tanuki-green bg-tanuki-green/5' : 'hover:shadow-xl hover:border-tanuki-green-light']">

    <button v-if="authStore.user" @click.stop="toggleMastery" class="absolute top-2 left-2 p-1 rounded-full transition-colors z-20"
      :class="[isMastered ? 'bg-tanuki-green text-white hover:bg-tanuki-green-light' : 'bg-gray-100 text-gray-300 hover:bg-gray-200 hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity']">
      <Check class="w-3 h-3 stroke-[4]" />
    </button>

    <div class="absolute top-2 right-2 font-bold px-2 py-0.5 rounded-full text-[10px]"
      :class="isMastered ? 'text-tanuki-green bg-tanuki-green/10' : 'text-tanuki-brown bg-tanuki-brown/10'">
      N{{ kanji.jlpt }}
    </div>

    <div class="text-6xl font-display font-medium mb-4 transition-colors"
      :class="isMastered ? 'text-tanuki-green' : 'text-tanuki-brown-dark group-hover:text-tanuki-green'">
      {{ kanji.character }}
    </div>

    <div class="text-center mb-4 min-h-[1.5em]">
      <p class="font-bold text-tanuki-brown text-lg leading-tight">{{ kanji.meaning.slice(0, 2).join(', ') }}</p>
    </div>

    <div class="w-full space-y-2 border-t border-tanuki-beige/30 pt-3">
      <div class="flex justify-between items-baseline">
        <span class="text-xs text-blue-400 font-bold tracking-widest">ON</span>
        <span class="text-base font-bold text-blue-900 font-body">{{ kanji.onyomi.slice(0, 2).join('・') }}</span>
      </div>
      <div class="flex justify-between items-baseline">
        <span class="text-xs text-tanuki-green font-bold tracking-widest">KUN</span>
        <span class="text-base font-bold text-tanuki-brown-dark font-body">{{ kanji.kunyomi.slice(0, 2).join('・')
          }}</span>
      </div>
    </div>
  </div>
</template>
