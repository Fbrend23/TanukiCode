<script setup lang="ts">
import type { Kanji } from '@/data/kanji'

defineProps<{
  kanji: Kanji
}>()
</script>

<template>
  <div class="card p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer border-2 border-tanuki-beige/50 hover:border-tanuki-green bg-white/80 backdrop-blur-sm group relative overflow-hidden">
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
        <div class="flex justify-between text-xs">
            <span class="text-gray-400 font-bold">ON</span>
            <span class="text-tanuki-brown font-mono">{{ kanji.onyomi.slice(0, 2).join('・') }}</span>
        </div>
        <div class="flex justify-between text-xs">
            <span class="text-gray-400 font-bold">KUN</span>
            <span class="text-tanuki-brown font-mono">{{ kanji.kunyomi.slice(0, 2).join('・') }}</span>
        </div>
    </div>
  </div>
</template>
