<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { grammarLessons } from '../data/grammar';
import { Search, ChevronRight } from 'lucide-vue-next';

const router = useRouter();
const searchQuery = ref('');
const selectedCategory = ref<string | 'all'>('all');

const categories = [
    { value: 'all', label: 'Tout' },
    { value: 'particles', label: 'Particules' },
    { value: 'basics', label: 'Bases' },
    { value: 'conjugation', label: 'Conjugaison' },
];

const filteredLessons = computed(() => {
    return grammarLessons.filter((lesson) => {
        const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            lesson.summary.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesCategory = selectedCategory.value === 'all' || lesson.category === selectedCategory.value;
        return matchesSearch && matchesCategory;
    });
});

const navigateToLesson = (id: string) => {
    router.push(`/grammar/${id}`);
};

const getCategoryLabel = (cat: string) => {
    return categories.find(c => c.value === cat)?.label || cat;
};

const emptyStateMessage = computed(() => {
    if (searchQuery.value) return `Aucune leçon trouvée pour "${searchQuery.value}"`;
    if (selectedCategory.value !== 'all') return `Aucune leçon dans la catégorie "${getCategoryLabel(selectedCategory.value)}"`;
    return 'Aucune leçon disponible.';
});
</script>

<template>
    <div class="flex flex-col items-center w-full px-4 mb-4 md:mb-0">
        <!-- Header Section -->
        <h1 class="text-3xl md:text-4xl font-display font-bold text-tanuki-green mb-1 md:mb-8 text-center">
            Grammaire (N5)
        </h1>

        <!-- Filters & Search -->
        <div class="flex flex-col items-center gap-4 mb-6 w-full max-w-6xl">
            <!-- Search Bar -->
            <div class="relative w-full max-w-md">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input v-model="searchQuery" type="text" placeholder="Rechercher une leçon..."
                    class="w-full pl-10 pr-4 py-2 bg-white border-2 border-tanuki-green rounded-xl focus:border-tanuki-green focus:outline-none transition-colors shadow-sm" />
            </div>

            <!-- Category Tabs -->
            <div class="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:justify-center">
                <button v-for="cat in categories" :key="cat.value" @click="selectedCategory = cat.value"
                    class="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors flex-shrink-0"
                    :class="selectedCategory === cat.value ? 'bg-tanuki-green text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'">
                    {{ cat.label }}
                </button>
            </div>
        </div>

        <!-- Lessons Grid -->
        <!-- Mobile: 2 Cols | Desktop: 3 Cols -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 w-full max-w-6xl px-0 md:px-4">
            <div v-for="lesson in filteredLessons" :key="lesson.id" @click="navigateToLesson(lesson.id)"
                class="card p-3 md:p-6 group cursor-pointer hover:border-tanuki-green-light hover:shadow-md transition-all flex flex-col h-full">

                <!-- Lesson Metadata (Tags) -->
                <div class="flex justify-between items-start mb-2">
                    <span
                        class="bg-gray-100 text-gray-600 text-[10px] md:text-sm font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                        {{ getCategoryLabel(lesson.category) }}
                    </span>
                    <span
                        class="bg-tanuki-beige text-tanuki-brown-dark text-[10px] md:text-sm font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                        {{ lesson.level }}
                    </span>
                </div>

                <!-- Lesson Title -->
                <h3
                    class="text-sm md:text-2xl font-bold text-tanuki-brown group-hover:text-tanuki-green transition-colors mb-1 md:mb-2">
                    {{ lesson.title }}
                </h3>

                <!-- Description -->
                <p class="text-gray-500 text-xs md:text-base mb-3 md:mb-6 line-clamp-2 md:line-clamp-3 flex-grow">
                    {{ lesson.summary }}
                </p>

                <!-- Footer / CTA -->
                <div class="flex items-center text-tanuki-green font-bold text-xs md:text-base mt-auto">
                    <span class="hidden md:inline">Commencer la leçon</span>
                    <span class="md:hidden">Voir</span>
                    <ChevronRight class="w-4 h-4 ml-1 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>

        <!-- Empty State Message -->
        <div v-if="filteredLessons.length === 0" class="text-center py-12 text-gray-500">
            <p>{{ emptyStateMessage }}</p>
        </div>
    </div>
</template>

<style scoped>
/* Utility to hide scrollbar while keeping functionality */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
