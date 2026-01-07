<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { Star, Info } from 'lucide-vue-next';

const userStore = useUserStore();
const isMounted = ref(false);

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true;
  }, 100);
});

const level = computed(() => userStore.level);
const xp = computed(() => userStore.xp);

const currentLevelProgress = computed(() => {

  let threshold = 100;
  let currentXp = xp.value;

  while (currentXp >= threshold) {
    currentXp -= threshold;
    threshold = Math.floor(threshold * 1.2);
  }

  return {
    current: currentXp,
    total: threshold,
    percent: (currentXp / threshold) * 100
  };
});
</script>

<template>
  <div class="card p-4 flex items-center gap-4 w-full relative group">
    <!-- Shine Effect Wrapper (Masked) -->
    <div class="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
      <div
        class="absolute top-0 -left-full w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-shine group-hover:animate-shine-fast">
      </div>
    </div>

    <!-- Level Badge -->
    <div class="relative shrink-0">
      <div
        class="w-16 h-16 bg-tanuki-gold rounded-full flex items-center justify-center border-4 border-tanuki-brown shadow-md z-10 relative">
        <span class="text-2xl font-display font-bold text-white">{{ level }}</span>
      </div>
      <div
        class="absolute -bottom-2 -right-2 bg-tanuki-green text-xs text-white px-2 py-0.5 rounded-full font-bold border-2 border-white z-20">
        LVL
      </div>
    </div>

    <!-- Progress Section -->
    <div class="grow flex flex-col gap-1 z-10">
      <div class="flex justify-between items-end mb-1">
        <span
          class="font-bold text-tanuki-brown text-sm uppercase tracking-wider flex items-center gap-1 relative group/info cursor-help">
          <Star class="w-4 h-4 text-tanuki-gold fill-tanuki-gold" />
          Expérience
          <Info class="w-3.5 h-3.5 text-tanuki-brown/40" />

          <!-- Tooltip -->
          <div
            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-tanuki-brown-dark text-white text-xs p-2 rounded-lg shadow-xl opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-50 text-center normal-case font-normal leading-relaxed">
            Gagnez de l'XP via les Quiz :<br>
            <span class="text-tanuki-gold font-bold">+10 XP</span> par bonne réponse<br>
            <span class="text-tanuki-green font-bold">+ Bonus</span> de série !
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-tanuki-brown-dark rotate-45"></div>
          </div>
        </span>
        <span class="text-xs font-bold text-gray-500">
          {{ Math.floor(currentLevelProgress.current) }} / {{ currentLevelProgress.total }} XP
        </span>
      </div>

      <div class="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner border border-gray-100 relative">
        <div class="h-full bg-linear-to-r from-tanuki-gold to-yellow-400 transition-all duration-1000 ease-out relative"
          :style="{ width: `${isMounted ? currentLevelProgress.percent : 0}%` }">
          <!-- Inner glint -->
          <div class="absolute top-0 left-0 w-full h-px bg-white/50"></div>
          <div class="absolute bottom-0 left-0 w-full h-px bg-black/10"></div>
        </div>
      </div>

      <p class="text-[10px] text-gray-400 text-right mt-1">
        Prochain niveau dans {{ Math.ceil(currentLevelProgress.total - currentLevelProgress.current) }} XP
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes shine {
  0% {
    left: -100%;
  }

  100% {
    left: 200%;
  }
}

.animate-shine {
  animation: shine 8s infinite linear;
}

.animate-shine-fast {
  animation: shine 3s infinite linear;
}
</style>
