<script setup lang="ts">
import { X, BookOpen, PenTool } from 'lucide-vue-next';
import { type Kanji } from '@/data/kanji';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import KanjiWriter from './kanji/KanjiWriter.vue';
import { playKanjiAudio } from '@/utils/audio'
import { Info, Volume2 } from 'lucide-vue-next'


const props = defineProps<{
  kanji: Kanji | null;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const activeTab = ref<'details' | 'write'>('details');



const showInfo = ref(false)

const playExample = (reading: string, index: number) => {
  if (!props.kanji) return
  playKanjiAudio(props.kanji.character, index, reading)
}

// Reset tab when modal opens
onMounted(() => {
  activeTab.value = 'details';
});

// Empêcher le scroll du body quand la modale est ouverte
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
});

onUnmounted(() => {
  document.body.style.overflow = 'auto';
});
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen && kanji" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="emit('close')"></div>

      <!-- Modal Content -->
      <div
        class="relative w-full max-w-lg bg-tanuki-beige-light rounded-3xl shadow-2xl overflow-hidden transform transition-all border-4 border-tanuki-beige flex flex-col max-h-[90vh]">

        <!-- Header with Kanji -->
        <div class="relative bg-tanuki-green text-white p-8 pb-12 flex flex-col items-center shrink-0">
          <button @click="emit('close')"
            class="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors">
            <X class="w-6 h-6" />
          </button>

          <div
            class="text-8xl font-serif font-bold mb-2 filter drop-shadow-md bg-white/10 rounded-3xl w-32 h-32 flex items-center justify-center border-2 border-white/20">
            {{ kanji.character }}
          </div>

          <div class="flex flex-wrap gap-2 justify-center mt-4">
            <span v-for="m in kanji.meaning" :key="m"
              class="px-4 py-1.5 bg-white/90 text-tanuki-green font-bold rounded-full shadow-sm text-sm">
              {{ m }}
            </span>
          </div>

          <!-- Tab Navigation -->
          <div class="absolute bottom-0 left-0 right-0 flex justify-center translate-y-1/2 px-6 z-10">
            <div class="flex bg-white rounded-full shadow-lg p-1.5 border border-tanuki-beige">
              <button @click="activeTab = 'details'"
                class="flex items-center gap-2 px-6 py-2.5 rounded-full transition-all text-sm font-bold"
                :class="activeTab === 'details' ? 'bg-tanuki-green text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'">
                <BookOpen class="w-4 h-4" />
                Détails
              </button>
              <button @click="activeTab = 'write'"
                class="flex items-center gap-2 px-6 py-2.5 rounded-full transition-all text-sm font-bold"
                :class="activeTab === 'write' ? 'bg-tanuki-green text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'">
                <PenTool class="w-4 h-4" />
                Écriture
              </button>
            </div>
          </div>
        </div>

        <!-- Scrollable Content -->
        <div class="p-8 pt-12 overflow-y-auto bg-white flex-1">

          <!-- Writer Tab -->
          <div v-if="activeTab === 'write'" class="flex flex-col items-center animate-fadeIn min-h-75">
            <KanjiWriter :character="kanji.character" :size="280" />
          </div>

          <!-- Details Tab -->
          <div v-else class="space-y-8 animate-fadeIn">

            <!-- Header Info -->
            <div class="flex justify-center gap-4">
              <span class="bg-tanuki-beige px-3 py-1 rounded-full text-tanuki-brown text-sm font-bold">JLPT
                N{{ kanji.jlpt }}</span>
              <span class="bg-tanuki-beige px-3 py-1 rounded-full text-tanuki-brown text-sm font-bold">{{
                kanji.strokes }} Traits</span>
            </div>

            <!-- Info Toggle -->
            <div class="flex justify-center">
              <button @click="showInfo = !showInfo"
                class="text-xs flex items-center gap-1 text-tanuki-green font-bold hover:underline transition-colors">
                <Info class="w-4 h-4" />
                {{ showInfo ? 'Masquer les explications' : 'Comprendre les lectures' }}
              </button>
            </div>

            <div v-if="showInfo"
              class="bg-blue-50 p-4 rounded-xl text-sm text-gray-700 space-y-2 border border-blue-100 animate-fade-in">
              <p><span class="font-bold text-blue-600">Onyomi (Lecture Chinoise)</span> : Utilisée quand
                le kanji est combiné (ex: 日本).</p>
              <p><span class="font-bold text-tanuki-green">Kunyomi (Lecture Japonaise)</span> : Utilisée
                quand le kanji est seul (ex: 日).</p>
            </div>

            <!-- Readings Grid -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Onyomi Card -->
              <div class="bg-blue-50/50 border-2 border-blue-100 p-4 rounded-2xl text-center">
                <div class="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Onyomi</div>
                <div class="text-xl font-bold text-blue-900 font-body wrap-break-word">
                  {{ kanji.onyomi.length ? kanji.onyomi.join('・') : '-' }}
                </div>
              </div>
              <!-- Kunyomi Card -->
              <div class="bg-tanuki-beige/50 border-2 border-tanuki-green-light/30 p-4 rounded-2xl text-center">
                <div class="text-xs font-bold text-tanuki-green-light uppercase tracking-widest mb-2">
                  Kunyomi</div>
                <div class="text-xl font-bold text-tanuki-brown-dark font-body wrap-break-word">
                  {{ kanji.kunyomi.length ? kanji.kunyomi.join('・') : '-' }}
                </div>
              </div>
            </div>

            <!-- Examples Section -->
            <div v-if="kanji.examples && kanji.examples.length > 0"
              class="mt-6 border-t-2 border-tanuki-brown pt-6 pb-8">
              <h3 class="text-center text-tanuki-brown text-lg font-bold mb-4">Exemples</h3>
              <div class="space-y-3">
                <div v-for="(ex, idx) in kanji.examples" :key="idx"
                  class="bg-white border-2 border-tanuki-brown rounded-xl p-3 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex flex-col">
                    <div class="flex flex-wrap items-baseline gap-x-2 md:gap-x-3 gap-y-1">
                      <span class="font-bold text-tanuki-brown-dark text-xl md:text-2xl">{{
                        ex.word }}</span>
                      <span
                        class="text-lg md:text-xl text-tanuki-brown-dark/80 font-bold bg-tanuki-beige/50 px-2 rounded-md">{{
                          ex.reading }}</span>
                    </div>
                    <span class="text-sm md:text-base text-tanuki-green font-bold mt-1">{{
                      ex.meaning }}</span>
                  </div>
                  <button @click="playExample(ex.reading, idx)"
                    class="bg-tanuki-gold/10 hover:bg-tanuki-gold/20 active:bg-tanuki-gold/30 text-tanuki-brown p-3 rounded-full transition-colors shrink-0 ml-2">
                    <Volume2 class="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-modal-in {
  animation: modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
