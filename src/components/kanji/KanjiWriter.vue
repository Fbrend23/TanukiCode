<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import HanziWriter from 'hanzi-writer';
import { Play, Pencil, Loader2 } from 'lucide-vue-next';
import tanukiImg from '@/assets/tanuki-detective.png';

const props = defineProps<{
    character: string;
    size?: number;
    initialMode?: 'view' | 'quiz';
}>();

const emit = defineEmits<{
    (e: 'quiz-success'): void;
}>();

const writerContainer = ref<HTMLElement | null>(null);
const writer = ref<HanziWriter | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const mode = ref<'view' | 'quiz'>(props.initialMode || 'view');

const initWriter = () => {
    if (!writerContainer.value) return;

    isLoading.value = true;
    error.value = null;
    mode.value = 'view';

    // Cleanup previous instance
    if (writer.value) {
        // HanziWriter doesn't have a specific destroy method, but we can clear the container
        writerContainer.value.innerHTML = '';
        writer.value = null;
    }

    try {
        const containerWidth = writerContainer.value.clientWidth || 200;
        const size = props.size || Math.min(containerWidth, 400); // Cap auto-size

        writer.value = HanziWriter.create(writerContainer.value, props.character, {
            width: size,
            height: size,
            padding: 20,
            showOutline: true,
            strokeAnimationSpeed: 1,
            delayBetweenStrokes: 200,
            // Main color for the Kanji
            strokeColor: '#5D4037', // tanuki-brown-dark
            // Color for radical/outline
            outlineColor: '#DDD',
            // Color when drawing in quiz mode
            drawingColor: '#333',
            // Highlight color for correct stroke
            highlightColor: '#4ADE80', // green-400
            // Load Japanese data from GitHub raw (since npm/cdn package is missing data)
            charDataLoader: (char, onComplete) => {
                fetch(`https://raw.githubusercontent.com/chanind/hanzi-writer-data-jp/master/data/${char}.json`)
                    .then(res => {
                        if (!res.ok) throw new Error('Character data not found');
                        return res.json();
                    })
                    .then(onComplete)
                    .catch(e => {
                        console.warn('Failed to load JP data', e);
                        // No fallback to Chinese data per user request
                        isLoading.value = false;
                        error.value = "Tracé introuvable...";
                    });
            },
            onLoadCharDataSuccess: () => {
                isLoading.value = false;
                if (props.initialMode === 'quiz') {
                    startQuiz();
                } else {
                    animate();
                }
            },
            onLoadCharDataError: () => {
                isLoading.value = false;
                error.value = "Impossible de charger le tracé.";
            }
        });

        // Removed invalid listener code
    } catch (e) {
        console.error(e);
        error.value = "Erreur d'initialisation du moteur d'écriture.";
        isLoading.value = false;
    }
};

const animate = () => {
    if (!writer.value) return;
    mode.value = 'view';
    writer.value.animateCharacter();
};

const startQuiz = () => {
    if (!writer.value) return;
    mode.value = 'quiz';
    writer.value.quiz({
        onComplete: () => {
            emit('quiz-success');
        }
    });
};

watch(() => props.character, () => {
    initWriter();
});

onMounted(() => {
    // Small delay to ensure container is ready and measured correctly
    setTimeout(initWriter, 50);
});

onUnmounted(() => {
    // Basic cleanup
    if (writerContainer.value) {
        writerContainer.value.innerHTML = '';
    }
});
</script>

<template>
    <div class="flex flex-col items-center">
        <!-- Canvas Container -->
        <div class="relative bg-white rounded-xl shadow-inner border-2 border-tanuki-beige p-4 mb-4 min-h-55 flex items-center justify-center"
            :class="{ 'opacity-50': isLoading }">

            <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center z-10">
                <Loader2 class="w-8 h-8 text-tanuki-green animate-spin" />
            </div>

            <div v-if="error"
                class="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 text-center bg-white/95 rounded-xl">
                <div class="w-16 h-16 mb-2 opacity-50 grayscale">
                    <img :src="tanukiImg" alt="Tanuki Confused" class="w-full h-full object-contain" />
                </div>
                <span class="text-tanuki-brown/70 font-bold text-sm">Désolé, je ne connais pas encore le tracé de ce
                    Kanji !</span>
            </div>

            <div ref="writerContainer" class="cursor-pointer"></div>
        </div>

        <!-- Controls (Hidden if initialMode is set, e.g. in Quiz) -->
        <div v-if="!initialMode" class="flex gap-4">
            <button @click="animate"
                class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm"
                :class="mode === 'view' ? 'bg-tanuki-green text-white shadow-md' : 'bg-white text-tanuki-green border border-tanuki-green hover:bg-green-50'">
                <Play class="w-4 h-4" />
                Voir
            </button>

            <button @click="startQuiz"
                class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm"
                :class="mode === 'quiz' ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-amber-500 border border-amber-500 hover:bg-amber-50'">
                <Pencil class="w-4 h-4" />
                Pratiquer
            </button>
        </div>

        <p v-if="!initialMode || mode === 'quiz'" class="text-xs text-stone-500 italic max-w-xs text-center">
            <span v-if="mode === 'view'">Regardez l'animation pour apprendre l'ordre des traits.</span>
            <span v-else>Dessinez le caractère par-dessus le modèle.
                <span class="block mt-1 text-amber-600 font-bold">Respectez l'ordre et le sens !</span>
            </span>
        </p>
    </div>
</template>
