<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { grammarLessons } from '../data/grammar';
import { Search, ChevronRight, Check, Settings2 } from 'lucide-vue-next';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import MasteryBar from '@/components/MasteryBar.vue';
import FilterModal from '@/components/FilterModal.vue';

const router = useRouter();
const searchQuery = ref('');
const selectedCategories = ref<string[]>([]);
const isFilterModalOpen = ref(false);
const userStore = useUserStore();
const authStore = useAuthStore();

const isMastered = (id: string) => userStore.masteredItems.includes(id);

// Mastery Stats
const totalLessons = computed(() => grammarLessons.length);
const masteredLessons = computed(() => {
    return grammarLessons.filter(l => userStore.masteredItems.includes(l.id)).length;
});

const categories = [
    { value: 'all', label: 'Tout' },
    { value: 'particles', label: 'Particules' },
    { value: 'basics', label: 'Bases' },
    { value: 'conjugation', label: 'Conjugaison' },
];

const toggleCategory = (cat: string) => {
    if (cat === 'all') {
        selectedCategories.value = []
        return
    }

    const index = selectedCategories.value.indexOf(cat)
    if (index === -1) {
        selectedCategories.value.push(cat)
    } else {
        selectedCategories.value.splice(index, 1)
    }
}

const filteredLessons = computed(() => {
    return grammarLessons.filter((lesson) => {
        const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            lesson.summary.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesCategory = selectedCategories.value.length === 0 || selectedCategories.value.includes(lesson.category);
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
    if (selectedCategories.value.length > 0) return `Aucune leçon dans les catégories sélectionnées`;
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
            <div class="relative w-full max-w-2xl flex flex-col md:block gap-2 mb-6">
                <!-- Search (Centered) -->
                <div class="relative w-full max-w-md mx-auto z-10">
                    <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input v-model="searchQuery" type="text" placeholder="Rechercher une leçon..." class="search-bar" />
                </div>

                <!-- Filter Button (Absolute Right on Desktop) -->
                <div class="flex justify-center md:absolute md:right-0 md:top-0 md:bottom-0 md:flex items-center">
                    <button @click="isFilterModalOpen = true" class="btn-filter md:w-auto w-full max-w-md">
                        <Settings2 class="w-5 h-5" />
                        <span>Filtres</span>
                        <div v-if="selectedCategories.length > 0" class="w-2 h-2 rounded-full bg-tanuki-gold"></div>
                    </button>
                </div>
            </div>

            <!-- Progress Bar -->
            <MasteryBar label="Progression Grammaire" :current="masteredLessons" :total="totalLessons" />
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

        <!-- Filter Modal -->
        <FilterModal v-model:isOpen="isFilterModalOpen">
            <!-- Categories -->
            <div class="flex flex-col gap-3">
                <h3 class="font-bold text-tanuki-brown">Catégorie</h3>
                <div class="flex flex-wrap gap-2">
                    <button v-for="cat in categories" :key="cat.value" @click="toggleCategory(cat.value)" :class="['px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors border-2',
                        (cat.value === 'all' ? selectedCategories.length === 0 : selectedCategories.includes(cat.value))
                            ? 'bg-tanuki-green text-white border-tanuki-green'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-tanuki-green/50']">
                        {{ cat.label }}
                    </button>
                </div>
            </div>
        </FilterModal>
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
