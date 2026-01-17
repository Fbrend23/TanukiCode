<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  subtitle?: string
  backRoute?: string
}>()

const router = useRouter()

const goBack = () => {
  router.push(props.backRoute || '/training')
}
</script>

<template>
  <div class="w-full relative flex items-center justify-center mb-0 md:mb-4">
    <button
      @click="goBack"
      class="absolute left-0 text-tanuki-brown/60 hover:text-tanuki-brown transition-colors p-2 rounded-full hover:bg-stone-100"
    >
      <ArrowLeft class="w-6 h-6" />
    </button>
    <div class="flex flex-col items-center">
      <h2 class="text-2xl md:text-4xl font-display font-bold text-tanuki-green text-center">
        {{ title }}
      </h2>
      <span
        v-if="subtitle"
        class="text-xs font-bold text-tanuki-brown/50 uppercase tracking-widest hidden md:block"
      >
        {{ subtitle }}
      </span>
    </div>

    <!-- Optional slot for right-side actions (like Settings) -->
    <div class="absolute right-0">
      <slot name="actions"></slot>
    </div>
  </div>
</template>
