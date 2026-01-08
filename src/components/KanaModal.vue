<script setup lang="ts">
import { X, PenTool, Volume2, Check } from 'lucide-vue-next';
import { type KanaChar } from '@/data/kana';
import { onUnmounted, watch, computed } from 'vue';
import KanaWriter from './kana/KanaWriter.vue';
import { playKanaAudio, speakJapanese } from '@/utils/audio';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';

const props = defineProps<{
  kana: KanaChar | null;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const userStore = useUserStore();
const authStore = useAuthStore();

const isMastered = computed(() => {
  if (!props.kana) return false;
  const key = props.kana.char || props.kana.romaji || '';
  return userStore.masteredItems.includes(key);
});

const toggleMastery = () => {
  if (props.kana) {
    userStore.toggleMastery(props.kana.char || props.kana.romaji || '');
  }
};

const playSound = () => {
  if (!props.kana) return;
  if (props.kana.romaji) {
    playKanaAudio(props.kana.char, props.kana.romaji);
  } else {
    speakJapanese(props.kana.char);
  }
}

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
    <div v-if="isOpen && kana" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="emit('close')"></div>

      <!-- Modal Content -->
      <div
        class="relative w-full max-w-lg min-h-[85vh] md:min-h-0 bg-tanuki-beige-light rounded-3xl shadow-2xl overflow-hidden transform transition-all border-4 border-tanuki-beige flex flex-col">

        <!-- Header with Kana -->
        <div class="relative bg-tanuki-green text-white p-4 md:p-6 flex flex-col items-center shrink-0">
          <button @click="emit('close')"
            class="absolute top-2 right-2 md:top-4 md:right-4 p-2 rounded-full hover:bg-white/20 transition-colors">
            <X class="w-5 h-5 md:w-6 md:h-6" />
          </button>



          <div class="flex items-center gap-4 md:gap-8 mb-1">
            <!-- Speaker (Left) -->
            <button @click="playSound" class="p-3 rounded-full hover:bg-white/20 transition-colors">
              <Volume2 class="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <!-- Kana (Center) -->
            <div
              class="font-display font-bold filter drop-shadow-md bg-white/10 rounded-3xl w-24 h-24 md:w-32 md:h-32 flex items-center justify-center border-2 border-white/20"
              :class="kana.char.length > 1 ? 'text-4xl md:text-6xl' : 'text-6xl md:text-8xl'">
              {{ kana.char }}
            </div>

            <!-- Check (Right) -->
            <button v-if="authStore.user" @click="toggleMastery" class="p-3 rounded-full transition-all duration-300"
              :class="isMastered ? 'bg-tanuki-gold text-white shadow-lg scale-110 ring-2 ring-white/50' : 'bg-black/20 text-white/40 hover:bg-black/30 hover:text-white'">
              <Check class="w-6 h-6 md:w-8 md:h-8" :class="{ 'stroke-4': isMastered }" />
            </button>
            <div v-else class="w-12 md:w-14"></div> <!-- Spacer for balance if no user -->
          </div>

          <div class="text-xl md:text-2xl font-bold opacity-90 mb-1">{{ kana.romaji }}</div>
        </div>

        <!-- Content -->
        <div class="p-4 md:p-6 bg-white flex-1 flex flex-col items-center overflow-y-auto">
          <div class="flex items-center gap-2 mb-2 md:mb-2 text-tanuki-green font-bold text-sm md:text-base">
            <PenTool class="w-4 h-4 md:w-5 md:h-5" />
            <span>Entraînement</span>
          </div>

          <!-- Only show writer for single characters (length 1) to avoid errors with combos -->
          <div v-if="kana.char.length === 1" class="w-full flex justify-center">
            <KanaWriter :character="kana.char" :size="undefined" class="w-70 h-70 md:w-80 md:h-80" />
          </div>
          <div v-else class="text-center py-8 text-stone-500 text-sm">
            Le tracé n'est pas disponible pour les combinaisons.
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
</style>
