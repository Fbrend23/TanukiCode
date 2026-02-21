<script setup lang="ts">
import { Trophy, Flame, Heart } from 'lucide-vue-next'

defineProps<{
  score: number
  total: number
  combo: number
  lives?: number // Current number of lives remaining
  maxLives?: number // Total max lives (to calculate lost hearts)
  xpMultiplier?: number
}>()
</script>

<template>
  <div class="relative w-full max-w-md mx-auto z-10">
    <div
      class="flex items-center justify-between card p-2 px-4 shadow-sm text-sm border-2 border-tanuki-green w-full bg-white"
    >
      <!-- Score -->
      <div class="flex-1 flex items-center justify-center gap-2 font-bold text-tanuki-brown">
        <Trophy class="w-4 h-4 text-tanuki-gold" />
        <span>{{ score }}/{{ total }}</span>
      </div>

      <div class="h-4 w-0.5 bg-tanuki-brown/20 rounded-full"></div>

      <!-- Combo -->
      <div class="flex-1 flex items-center justify-center gap-1 font-bold text-tanuki-green">
        <span>{{ combo }}</span>
        <Flame class="w-4 h-4 fill-orange-500 text-orange-600" />
      </div>

      <!-- Lives (Optional) -->
      <template v-if="maxLives">
        <div class="h-4 w-0.5 bg-tanuki-brown/20 rounded-full"></div>
        <div class="flex-1 flex justify-center items-center gap-1">
          <Heart
            v-for="i in maxLives"
            :key="i"
            class="w-4 h-4 transition-all"
            :class="
              lives !== undefined && i > lives
                ? 'fill-gray-200 text-gray-200 opacity-50 scale-75'
                : 'fill-red-500 text-red-600'
            "
          />
        </div>
      </template>

      <!-- XP Multiplier (Optional) -->
      <template v-if="xpMultiplier">
        <div class="h-4 w-0.5 bg-tanuki-brown/20 rounded-full"></div>
        <div
          class="ml-2 bg-linear-to-r from-amber-500 to-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap"
        >
          XP x{{ xpMultiplier }}
        </div>
      </template>
    </div>
  </div>
</template>
