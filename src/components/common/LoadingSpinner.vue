<script setup lang="ts">
import tanukiHead from '@/assets/tanuki-detective.png';

withDefaults(defineProps<{
    size?: 'sm' | 'md' | 'lg' | 'xl'
    text?: string
}>(), {
    size: 'lg'
})

const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
}
</script>

<template>
    <div class="flex flex-col items-center justify-center p-8 space-y-4 animate-fade-in">
        <div class="relative flex items-center justify-center">
            <!-- Outer ring (Spinner) -->
            <div :class="[sizeClasses[size]]"
                class="rounded-full border-4 border-tanuki-green/10 absolute inset-0 m-auto"></div>
            <div :class="[sizeClasses[size]]"
                class="rounded-full border-4 border-tanuki-green border-t-transparent animate-spin absolute inset-0 m-auto">
            </div>

            <!-- Tanuki in middle -->
            <div :class="[sizeClasses[size]]" class="flex items-center justify-center p-2 relative z-10">
                <img :src="tanukiHead" alt="Loading..." class="w-full h-full object-contain" />
            </div>
        </div>

        <p v-if="text" class="text-tanuki-brown/60 font-bold text-sm tracking-wide animate-pulse mt-4">
            {{ text }}
        </p>
    </div>
</template>
