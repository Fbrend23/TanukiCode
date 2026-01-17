<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

const props = defineProps<{
  // State
  isOpen: boolean
  isCorrect: boolean
  isSkipped?: boolean

  // Content
  correctAnswer?: string

  // Customization
  successMessage?: string
  failureMessage?: string
  skipMessage?: string
}>()

const emit = defineEmits(['next'])

const feedbackTitle = computed(() => {
  if (props.isSkipped) return props.skipMessage || 'Passé'
  if (props.isCorrect) return props.successMessage || 'Excellent !'
  return props.failureMessage || 'Dommage...'
})

const drawerClass = computed(() => {
  if (props.isSkipped) return 'bg-gray-50 border-gray-200'
  if (props.isCorrect) return 'bg-green-50 border-green-200'
  return 'bg-red-50 border-red-200'
})

const mascotSrc = computed(() => {
  if (props.isSkipped) return '/images/tanuki_skip.png'
  if (props.isCorrect) return '/images/tanuki_success.png'
  return '/images/tanuki_failure.png'
})

const textClass = computed(() => {
  if (props.isSkipped) return 'text-gray-700'
  if (props.isCorrect) return 'text-green-700'
  return 'text-red-700'
})

const buttonClass = computed(() => {
  if (props.isSkipped) return 'btn-secondary'
  if (props.isCorrect) return 'btn-primary'
  return 'btn-danger-filled'
})
</script>

<template>
  <Transition name="drawer">
    <div
      v-if="isOpen"
      class="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-6 md:pb-8 border-t-2 animate-drawer-in"
      :class="drawerClass"
    >
      <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Mascot & Message -->
        <div class="flex items-center gap-4 md:gap-6 flex-1">
          <img
            :src="mascotSrc"
            :alt="isCorrect ? 'Succès' : 'Échec'"
            class="w-16 h-16 md:w-24 md:h-24 object-contain animate-bounce-short"
          />

          <div class="flex-1">
            <h3 class="text-xl md:text-2xl font-bold" :class="textClass">
              {{ feedbackTitle }}
            </h3>

            <!-- Standard correction display if not correct/skipped -->
            <div v-if="!isCorrect && !isSkipped && correctAnswer" class="mt-1">
              <p class="text-xs font-bold text-red-400 uppercase tracking-widest">
                Réponse correcte :
              </p>
              <p class="text-base md:text-lg font-bold text-gray-800 leading-tight">
                {{ correctAnswer }}
              </p>
            </div>

            <!-- Slot for extra details -->
            <slot name="details"></slot>
          </div>
        </div>

        <!-- Action Button -->
        <div class="flex items-center w-full md:w-auto">
          <button
            @click="emit('next')"
            class="btn-3d w-full md:w-48 flex items-center justify-center gap-2 group py-3"
            :class="buttonClass"
          >
            <span class="font-bold">Continuer</span>
            <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.animate-bounce-short {
  animation: bounce-short 0.5s;
}

@keyframes bounce-short {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* Drawer Transitions */
.drawer-enter-active,
.drawer-leave-active {
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.4s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@keyframes drawer-in {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

.animate-drawer-in {
  animation: drawer-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
