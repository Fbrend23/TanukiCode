<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{
    isOpen: boolean
    title?: string
}>()

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void
    (e: 'close'): void
}>()

const close = () => {
    emit('update:isOpen', false)
    emit('close')
}
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="close"></div>

        <!-- Modal Content -->
        <div
            class="relative bg-white rounded-3xl w-full max-w-sm max-h-[80vh] overflow-y-auto shadow-xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">

            <!-- Header -->
            <div class="flex items-center justify-between">
                <h2 class="text-2xl font-display font-bold text-tanuki-green">{{ title || 'Filtres' }}</h2>
                <button @click="close" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X class="w-6 h-6 text-gray-400" />
                </button>
            </div>

            <!-- Slot for Filter Controls -->
            <slot></slot>

            <!-- Footer Button -->
            <button @click="close"
                class="w-full py-3 bg-tanuki-green text-white font-bold rounded-xl shadow-lg shadow-tanuki-green/20 hover:bg-tanuki-green-dark transition-colors mt-2">
                Voir les résultats
            </button>
        </div>
    </div>
</template>
