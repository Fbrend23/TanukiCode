<script setup lang="ts">
import { SkipForward } from 'lucide-vue-next'
</script>

<template>
  <button
    class="btn-3d btn-secondary flex items-center justify-center gap-2 py-2! px-3! md:px-4! text-sm rounded-xl! border-b-2 active:translate-y-0.5 active:border-b-0"
  >
    <span class="hidden md:inline">Passer</span>
    <SkipForward class="w-4 h-4 opacity-60" />
  </button>
</template>
