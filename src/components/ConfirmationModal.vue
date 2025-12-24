<script setup lang="ts">
import { AlertTriangle, X } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
}>()

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click="emit('close')">
        <div 
          class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative transform transition-all"
          @click.stop
        >
          <!-- Close Button -->
          <button @click="emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>

          <!-- Content -->
          <div class="flex flex-col items-center text-center">
            <div class="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              :class="isDestructive ? 'bg-red-100 text-red-500' : 'bg-tanuki-beige text-tanuki-brown'">
              <AlertTriangle class="w-6 h-6" />
            </div>

            <h3 class="text-xl font-bold text-gray-900 mb-2 font-display">
              {{ title }}
            </h3>
            <p class="text-gray-500 mb-8 leading-relaxed">
              {{ message }}
            </p>

            <!-- Actions -->
            <div class="flex gap-3 w-full">
              <button 
                @click="emit('close')"
                class="flex-1 px-4 py-3 rounded-xl border-2 border-tanuki-beige text-tanuki-brown font-bold hover:bg-tanuki-beige/20 transition-colors"
              >
                {{ cancelText || 'Annuler' }}
              </button>
              <button 
                @click="emit('confirm')"
                class="flex-1 px-4 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95"
                :class="isDestructive ? 'bg-red-500 hover:bg-red-600' : 'bg-tanuki-green hover:bg-green-700'"
              >
                {{ confirmText || 'Confirmer' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
