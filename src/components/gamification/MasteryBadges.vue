<script setup lang="ts">
import { computed, type Component } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { Award, Zap, Crown, Scroll, GraduationCap, Medal, Star, Flame, Check } from 'lucide-vue-next';

const userStore = useUserStore();

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: Component;
  color: string;
  isUnlocked: boolean;
  condition: string;
}

const badges = computed<Badge[]>(() => {
  const list: Badge[] = [
    {
      id: 'novice',
      name: 'Débutant Curieux',
      description: 'Atteindre le niveau 2',
      icon: Star,
      color: 'text-yellow-400',
      isUnlocked: userStore.level >= 2,
      condition: 'Niveau 2'
    },
    {
      id: 'apprentice',
      name: 'Apprenti Tanuki',
      description: 'Atteindre le niveau 5',
      icon: GraduationCap,
      color: 'text-blue-500',
      isUnlocked: userStore.level >= 5,
      condition: 'Niveau 5'
    },
    {
      id: 'streak_3',
      name: 'Sérieux',
      description: 'Maintenir une série de 3 jours',
      icon: Flame,
      color: 'text-orange-500',
      isUnlocked: userStore.streak >= 3,
      condition: '3 jours de suite'
    },
    {
      id: 'streak_7',
      name: 'Inarrêtable',
      description: 'Maintenir une série de 7 jours',
      icon: Zap,
      color: 'text-red-500',
      isUnlocked: userStore.streak >= 7,
      condition: '7 jours de suite'
    },
    {
      id: 'kana_master',
      name: 'Maître des Kanas',
      description: 'Maîtriser 50 Kanas',
      icon: Scroll,
      color: 'text-emerald-500',
      isUnlocked: userStore.masteredItems.length >= 50, // Simplified check
      condition: '50 Kanas'
    },
    {
      id: 'expert',
      name: 'Expert Tanuki',
      description: 'Atteindre le niveau 10',
      icon: Crown,
      color: 'text-purple-500',
      isUnlocked: userStore.level >= 10,
      condition: 'Niveau 10'
    },
    {
      id: 'legend',
      name: 'Légende Vivante',
      description: 'Atteindre le niveau 20',
      icon: Medal,
      color: 'text-tanuki-gold',
      isUnlocked: userStore.level >= 20,
      condition: 'Niveau 20'
    },
    {
      id: 'score_1000',
      name: 'Collectionneur',
      description: 'Obtenir 1000 points de score global',
      icon: Award,
      color: 'text-indigo-500',
      isUnlocked: userStore.score >= 1000,
      condition: '1000 pts'
    }
  ];
  return list;
});

const unlockedCount = computed(() => badges.value.filter(b => b.isUnlocked).length);
</script>

<template>
  <div class="card p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-tanuki-brown flex items-center gap-2">
        <Medal class="w-5 h-5 text-tanuki-gold" />
        Badges & Succès
      </h3>
      <span
        class="text-xs font-bold bg-tanuki-green/10 text-tanuki-green px-3 py-1 rounded-full border border-tanuki-green/20">
        {{ unlockedCount }} / {{ badges.length }}
      </span>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="badge in badges" :key="badge.id"
        class="relative flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all duration-300"
        :class="badge.isUnlocked ? 'bg-white border-tanuki-green/30 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-60 grayscale'">

        <div class="p-3 rounded-full mb-3" :class="badge.isUnlocked ? 'bg-gray-50' : 'bg-gray-200'">
          <component :is="badge.icon" class="w-8 h-8" :class="badge.isUnlocked ? badge.color : 'text-gray-400'" />
        </div>

        <h4 class="font-bold text-sm text-tanuki-brown mb-1">{{ badge.name }}</h4>
        <p class="text-[10px] text-gray-500 leading-tight mb-2">{{ badge.description }}</p>

        <div v-if="!badge.isUnlocked"
          class="mt-auto pt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wide border-t border-gray-100 w-full">
          Verrouillé
        </div>
        <div v-else
          class="mt-auto pt-2 text-[10px] font-bold text-tanuki-green uppercase tracking-wide border-t border-gray-100 w-full flex items-center justify-center gap-1">
          <Check class="w-3 h-3" /> Acquis
        </div>
      </div>
    </div>
  </div>
</template>
