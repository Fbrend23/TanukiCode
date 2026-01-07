<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Moon, Sun } from 'lucide-vue-next';

const isDark = ref(false);

const toggleTheme = () => {
    isDark.value = !isDark.value;
    updateTheme();
};

const updateTheme = () => {
    if (isDark.value) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('tanuki_theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('tanuki_theme', 'light');
    }
};

onMounted(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('tanuki_theme');
    if (savedTheme) {
        isDark.value = savedTheme === 'dark';
    } else {
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    updateTheme();
});
</script>

<template>
    <button @click="toggleTheme"
        class="p-2 rounded-full transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10"
        :title="isDark ? 'Passer en mode jour' : 'Passer en mode nuit (Night Tanuki)'" aria-label="Basculer le thème">
        <div class="relative w-6 h-6">
            <Sun class="w-6 h-6 text-tanuki-gold absolute inset-0 transition-all duration-500 transform"
                :class="isDark ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'" />
            <Moon class="w-6 h-6 text-tanuki-beige absolute inset-0 transition-all duration-500 transform"
                :class="isDark ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'" />
        </div>
    </button>
</template>
