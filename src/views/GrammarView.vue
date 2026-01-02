<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { grammarLessons } from '../data/grammar';
import { Search, ChevronRight, Check } from 'lucide-vue-next';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const searchQuery = ref('');
const selectedCategory = ref<string | 'all'>('all');
const userStore = useUserStore();
const authStore = useAuthStore();

const isMastered = (id: string) => userStore.masteredItems.includes(id);

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
        <div class="text-center mb-2">
            <h1 class="text-3xl md:text-4xl font-display font-bold text-tanuki-green mb-1 md:mb-8 text-center">
                Grammaire (N5)
            </h1>
        </div>

        <div class="flex flex-col items-center w-full max-w-4xl mb-6">
            <div class="relative w-full max-w-md mb-4">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input v-model="searchQuery" type="text" placeholder="Rechercher une leçon..."
                    class="w-full pl-10 pr-4 py-2 bg-white border-2 border-tanuki-green rounded-xl focus:border-tanuki-green focus:outline-none transition-colors shadow-sm" />
            </div>

            <div class="flex flex-wrap justify-center gap-2 w-full">
                <button v-for="cat in categories" :key="cat.value" @click="selectedCategory = cat.value" :class="['px-4 py-1.5 rounded-full font-bold transition-all border-2 text-sm md:text-base whitespace-nowrap',
                    selectedCategory === cat.value
                        ? 'bg-tanuki-green text-white border-tanuki-green shadow-sm'
                        : 'bg-white text-tanuki-brown border-tanuki-brown/20 hover:border-tanuki-green/50']">
                    {{ cat.label }}
                </button>
            </div>
        </div>


        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 w-full max-w-6xl px-0 md:px-4">
            <div v-for="lesson in filteredLessons" :key="lesson.id" @click="navigateToLesson(lesson.id)"
                class="card p-3 md:p-6 group cursor-pointer hover:shadow-md transition-all flex flex-col h-full border-2"
                :class="[isMastered(lesson.id) ? 'border-tanuki-green bg-tanuki-green/5' : 'hover:border-tanuki-green-light']">

                <button v-if="authStore.user" @click.stop="userStore.toggleMastery(lesson.id)"
                    class="absolute top-2 left-2 p-1 rounded-full transition-colors z-20"
                    :class="[isMastered(lesson.id) ? 'bg-tanuki-green text-white hover:bg-tanuki-green-light' : 'bg-gray-100 text-gray-300 hover:bg-gray-200 hover:text-gray-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity']">
                    <Check class="w-3 h-3 stroke-[4]" />
                </button>

                <div class="flex justify-between items-start mb-2 pl-4 md:pl-0">
                    <div class="flex flex-wrap gap-1">
                        <span
                            class="bg-gray-100 text-gray-600 text-[10px] md:text-sm font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                            {{ getCategoryLabel(lesson.category) }}
                        </span>
                    </div>
                    <span
                        class="bg-tanuki-beige text-tanuki-brown-dark text-[10px] md:text-sm font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded flex-shrink-0">
                        {{ lesson.level }}
                    </span>
                </div>

                <h3 class="text-sm md:text-2xl font-bold transition-colors mb-1 md:mb-2"
                    :class="isMastered(lesson.id) ? 'text-tanuki-green' : 'text-tanuki-brown group-hover:text-tanuki-green'">
                    {{ lesson.title }}
                </h3>

                <p class="text-gray-500 text-xs md:text-base mb-3 md:mb-6 line-clamp-2 md:line-clamp-3 flex-grow">
                    {{ lesson.summary }}
                </p>

                <div class="flex items-center text-tanuki-green font-bold text-xs md:text-base mt-auto">
                    <span class="hidden md:inline">Commencer la leçon</span>
                    <span class="md:hidden">Voir</span>
                    <ChevronRight class="w-4 h-4 ml-1 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>

        <div v-if="filteredLessons.length === 0" class="text-center py-12 text-gray-500">
            <p>{{ emptyStateMessage }}</p>
        </div>
    </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
