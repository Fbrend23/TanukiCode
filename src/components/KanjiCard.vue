<script setup lang="ts">
import type { Kanji } from '@/data/kanji'

defineProps<{
  kanji: Kanji
}>()
</script>

<template>
  <div class="flex flex-col items-center bg-white rounded-2xl shadow-md border-2 border-tanuki-green hover:shadow-lg hover:bg-tanuki-beige/20 transition-all cursor-pointer group relative overflow-hidden p-4 h-full">
    <!-- JLPT Badge -->
    <div class="absolute top-2 right-2 bg-tanuki-brown/10 text-tanuki-brown text-[10px] font-bold px-2 py-0.5 rounded-full">
      N{{ kanji.jlpt }}
    </div>

    <!-- Character -->
    <div class="text-6xl font-display font-medium text-tanuki-brown-dark mb-4 group-hover:text-tanuki-green transition-colors">
      {{ kanji.character }}
    </div>

    <!-- Meanings -->
    <div class="text-center mb-4 min-h-[1.5em]">
      <p class="font-bold text-tanuki-brown text-lg leading-tight">{{ kanji.meaning.slice(0, 2).join(', ') }}</p>
    </div>

    <!-- Readings -->
    <div class="w-full space-y-2 border-t border-tanuki-beige/30 pt-3">
        <div class="flex justify-between items-baseline">
            <span class="text-xs text-blue-400 font-bold tracking-widest">ON</span>
            <span class="text-base font-bold text-blue-900 font-body">{{ kanji.onyomi.slice(0, 2).join('・') }}</span>
        </div>
        <div class="flex justify-between items-baseline">
            <span class="text-xs text-tanuki-green font-bold tracking-widest">KUN</span>
            <span class="text-base font-bold text-tanuki-brown-dark font-body">{{ kanji.kunyomi.slice(0, 2).join('・') }}</span>
        </div>
    </div>
  </div>
</template>
