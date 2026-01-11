<script setup lang="ts">
import { ref } from 'vue';
import { Code2, X } from 'lucide-vue-next';

// Only show if strictly in DEV environment
const isDev = import.meta.env.DEV;
const isVisible = ref(true);

const close = () => {
    isVisible.value = false;
};
</script>

<template>
    <div v-if="isDev && isVisible"
        class="fixed bottom-4 left-4 z-[9999] flex items-center gap-3 bg-gray-900/90 text-white px-4 py-2 rounded-lg shadow-xl backdrop-blur-sm border border-gray-700 animate-fade-in group hover:bg-gray-900 transition-colors">

        <div class="flex items-center gap-2">
            <div class="p-1 bg-tanuki-gold/20 rounded text-tanuki-gold">
                <Code2 class="w-4 h-4" />
            </div>
            <div class="flex flex-col">
                <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Environment</span>
                <span class="text-sm font-bold text-tanuki-gold">Development Mode</span>
            </div>
        </div>

        <div class="h-8 w-px bg-gray-700 mx-1"></div>

        <button @click="close"
            class="text-gray-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10">
            <X class="w-4 h-4" />
        </button>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
