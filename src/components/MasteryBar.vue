<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
    label: string
    current: number
    total: number
}>()

const isMounted = ref(false)

onMounted(() => {
    setTimeout(() => {
        isMounted.value = true
    }, 100)
})

const percentage = computed(() => {
    if (props.total === 0) return 0
    return Math.round((props.current / props.total) * 100)
})
</script>

<template>
    <div class="w-full max-w-4xl px-2 mb-1">
        <div class="flex flex-col gap-1">
            <div class="flex justify-between text-sm font-bold text-tanuki-brown">
                <span>{{ label }}</span>
                <span>{{ current }} / {{ total }} ({{ percentage }}%)</span>
            </div>
            <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-tanuki-gold transition-all duration-500 ease-out"
                    :style="{ width: `${isMounted ? percentage : 0}%` }"></div>
            </div>
        </div>
    </div>
</template>
