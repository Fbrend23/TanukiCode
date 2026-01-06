<script setup lang="ts">
withDefaults(defineProps<{
    type?: 'text' | 'avatar' | 'image' | 'card'
    lines?: number
    class?: string
}>(), {
    type: 'text',
    lines: 1,
    class: ''
})
</script>

<template>
    <div :class="['animate-pulse', $props.class]">

        <!-- Text Line -->
        <template v-if="type === 'text'">
            <div v-for="n in lines" :key="n" class="h-4 bg-gray-200 rounded w-full mb-2 last:mb-0"
                :style="{ width: n === lines && lines > 1 ? '70%' : '100%' }"></div>
        </template>

        <!-- Avatar Circle -->
        <template v-if="type === 'avatar'">
            <div class="rounded-full bg-gray-200 w-full h-full aspect-square"></div>
        </template>

        <!-- Image / Block -->
        <template v-if="type === 'image'">
            <div class="rounded-xl bg-gray-200 w-full h-full"></div>
        </template>

        <!-- Complex Card -->
        <template v-if="type === 'card'">
            <div class="border border-gray-100 rounded-xl p-4 bg-white space-y-4">
                <div class="w-full h-32 bg-gray-200 rounded-lg"></div>
                <div class="space-y-2">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        </template>

    </div>
</template>
