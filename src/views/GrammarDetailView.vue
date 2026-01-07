<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { useRoute, useRouter } from 'vue-router';
import { grammarLessons } from '../data/grammar';
import { ArrowLeft, BookOpen, Volume2 } from 'lucide-vue-next';
import { playGrammarAudio } from '@/utils/audio';

const route = useRoute();
const router = useRouter();
const lessonId = route.params.id as string;

const lesson = computed(() => {
    return grammarLessons.find((l) => l.id === lessonId);
});

// Simple Markdown Parser for the content
const parsedContent = computed(() => {
    if (!lesson.value) return [];

    return lesson.value.content.split('\n').map(line => {
        // Handle bold text: **text** -> <strong>text</strong>
        let text = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Handle italic text: *text* -> <em>text</em>
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Handle blockquotes
        if (line.trim().startsWith('>')) {
            return { type: 'quote', text: text.replace(/^>\s*/, '') };
        }

        // Handle Empty lines
        if (line.trim() === '') {
            return { type: 'break' };
        }

        return { type: 'paragraph', text };
    });
});

const goBack = () => {
    router.back();
};

const isLoading = ref(true);

onMounted(() => {
    isLoading.value = false;
});
</script>

<template>
    <div v-if="isLoading" class="w-full flex justify-center py-24">
        <LoadingSpinner size="xl" text="Préparation de la leçon..." />
    </div>
    <div v-else-if="lesson" class="p-4 md:p-8 max-w-4xl mx-auto mb-20 md:mb-0">
        <!-- Navigation -->
        <button @click="goBack"
            class="flex items-center text-gray-500 hover:text-tanuki-brown mb-6 transition-colors font-bold">
            <ArrowLeft class="w-5 h-5 mr-2" />
            Retour à la liste
        </button>

        <!-- Header -->
        <header class="mb-8">
            <div class="flex items-center gap-2 mb-2">
                <span class="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                    {{ lesson.category }}
                </span>
                <span class="bg-tanuki-beige text-tanuki-brown-dark text-xs font-bold px-2 py-1 rounded-md">
                    {{ lesson.level }}
                </span>
            </div>
            <h1 class="text-3xl md:text-5xl font-bold text-tanuki-brown font-display mb-4">
                {{ lesson.title }}
            </h1>
            <p class="text-xl text-gray-500 font-medium leading-relaxed">
                {{ lesson.summary }}
            </p>
        </header>

        <!-- Main Content (generated from simple MD) -->
        <!-- Just using "card" class applies the standard Tanuki border/shadow -->
        <div class="card p-6 md:p-10 mb-10 space-y-6">
            <template v-for="(block, index) in parsedContent" :key="index">
                <p v-if="block.type === 'paragraph'" v-html="block.text"
                    class="text-gray-700 text-lg leading-relaxed font-body"></p>

                <div v-else-if="block.type === 'quote'"
                    class="bg-tanuki-beige/20 border-l-4 border-tanuki-green p-5 rounded-r-lg text-tanuki-brown-dark font-medium italic">
                    <p v-html="block.text"></p>
                </div>

                <div v-else-if="block.type === 'break'" class="h-2"></div>
            </template>
        </div>

        <!-- Examples Section -->
        <div v-if="lesson.examples.length > 0">
            <div class="flex items-center gap-3 mb-6">
                <div class="p-2 bg-tanuki-green/10 rounded-full">
                    <BookOpen class="w-6 h-6 text-tanuki-green" />
                </div>
                <h2 class="text-2xl md:text-3xl font-bold text-tanuki-brown font-display">Exemples</h2>
            </div>

            <div class="grid gap-4 md:grid-cols-1">
                <div v-for="(ex, index) in lesson.examples" :key="index"
                    class="card p-5 flex items-start justify-between gap-4 group">

                    <div class="grow">
                        <p class="text-xl md:text-2xl font-bold text-gray-800 mb-1">{{ ex.japanese }}</p>
                        <p class="text-tanuki-green font-medium mb-2 opacity-90">{{ ex.romaji }}</p>
                        <p class="text-gray-500 border-t-2 border-tanuki-beige pt-2 italic">{{ ex.french }}</p>
                    </div>

                    <button @click="playGrammarAudio(lesson.id, index, ex.japanese)"
                        class="p-3 rounded-full bg-gray-50 text-gray-400 hover:bg-tanuki-green hover:text-white transition-all shadow-sm shrink-0"
                        title="Écouter">
                        <Volume2 class="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
        <h2 class="text-2xl font-bold text-gray-400 mb-4">Leçon introuvable</h2>
        <button @click="router.push('/grammar')" class="btn-3d btn-primary">
            Retour à la liste
        </button>
    </div>
</template>

<style scoped>
/* Scoped styles if needed, currently using Utility classes */
</style>
