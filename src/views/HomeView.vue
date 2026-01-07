<script setup lang="ts">
import { Grid3x3, BookOpen, Gamepad2, ScrollText, PenTool, Layers } from 'lucide-vue-next';
import XPBar from '@/components/gamification/XPBar.vue';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { hiragana, katakana } from '@/data/kana';
import { vocabulary } from '@/data/vocabulary';
import { kanjiList } from '@/data/kanji';
import { grammarLessons } from '@/data/grammar';
import { computed } from 'vue';

const userStore = useUserStore();
const authStore = useAuthStore();

const getMasteryProgress = (items: { char?: string; character?: string; word?: string; id?: string }[]) => {
  const total = items.length;
  const mastered = items.filter(i => {
    const id = i.char || i.character || i.word || i.id;
    return userStore.masteredItems.includes(id || '');
  }).length;
  return { mastered, total };
};

const kanaProgress = computed(() => getMasteryProgress([...hiragana.filter(k => k.char), ...katakana.filter(k => k.char)]));
const vocabProgress = computed(() => getMasteryProgress(vocabulary));
const kanjiProgress = computed(() => getMasteryProgress(kanjiList));
const grammarProgress = computed(() => getMasteryProgress(grammarLessons));

const getPercentage = (progress: { mastered: number; total: number }) => {
  return (progress.mastered / progress.total) * 100;
};

import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { ref, onMounted } from 'vue';

const isLoading = ref(true);

onMounted(() => {
  isLoading.value = false;
});
</script>

<template>
  <main class="grow container mx-auto py-1 md:py-8 flex flex-col items-center px-4 w-full max-w-4xl">

    <!-- Loading State -->
    <div v-if="isLoading" class="w-full flex justify-center py-12">
      <LoadingSpinner size="xl" text="Réveil du Tanuki..." />
    </div>

    <div v-else class="w-full flex flex-col items-center">
      <div class="relative w-full mb-4 md:mb-8 flex flex-col items-center py-6 md:py-10">
        <div
          class="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none -z-10 translate-y-[-10%]">
          <img src="@/assets/tanuki-mascot.png" alt="Tanuki Mascot" class="h-48 md:h-80 object-contain" />
        </div>

        <h1
          class="text-4xl md:text-7xl font-display font-bold text-tanuki-green mb-1 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
          TanukiCode
        </h1>
        <p class="text-lg md:text-2xl text-tanuki-brown-dark max-w-lg font-bold text-center">
          Apprenez le japonais en vous amusant
        </p>
      </div>

      <div v-if="!authStore.user" class="w-full max-w-4xl mb-8 flex justify-center">
        <RouterLink to="/auth"
          class="bg-white border-2 border-tanuki-green/20 text-tanuki-green px-6 py-3 rounded-xl font-bold hover:bg-tanuki-green hover:text-white transition-all shadow-sm hover:shadow-md flex items-center gap-2 group">
          <img src="@/assets/tanuki-scroll.png" alt="Tanuki Étudiant" class="w-10 h-10 object-contain -ml-2" />
          Connectez-vous pour sauvegarder votre progression
        </RouterLink>
      </div>

      <div v-if="authStore.user" class="w-full max-w-4xl mb-8">
        <XPBar />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <RouterLink to="/charts"
          class="card p-6 flex flex-col items-center hover:scale-[1.02] transition-transform group cursor-pointer relative overflow-hidden">
          <div class="absolute -right-4 -top-4 opacity-5 font-display text-9xl text-tanuki-brown">あ</div>
          <div v-if="authStore.user"
            class="absolute top-2 right-4 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
            {{ kanaProgress.mastered }}/{{ kanaProgress.total }}
          </div>
          <div class="bg-blue-100 p-3 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
            <Grid3x3 class="w-8 h-8 text-blue-600" />
          </div>
          <h3 class="text-xl font-bold text-tanuki-brown group-hover:text-tanuki-green transition-colors">Kanas
          </h3>
          <p class="text-sm text-gray-400 mb-4">Hiragana & Katakana</p>

          <div v-if="authStore.user" class="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-auto">
            <div class="h-full bg-blue-500 transition-all duration-500"
              :style="{ width: getPercentage(kanaProgress) + '%' }"></div>
          </div>
        </RouterLink>



        <RouterLink to="/kanji"
          class="card p-6 flex flex-col items-center hover:scale-[1.02] transition-transform group cursor-pointer relative overflow-hidden">
          <div class="absolute -right-4 -top-4 opacity-5 font-display text-9xl text-tanuki-brown">日</div>
          <div v-if="authStore.user"
            class="absolute top-2 right-4 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">
            {{ kanjiProgress.mastered }}/{{ kanjiProgress.total }}
          </div>
          <div class="bg-red-100 p-3 rounded-full mb-3 group-hover:bg-red-200 transition-colors z-10">
            <ScrollText class="w-8 h-8 text-red-600" />
          </div>
          <h3 class="text-xl font-bold text-tanuki-brown group-hover:text-tanuki-green transition-colors z-10">
            Kanjis</h3>
          <p class="text-sm text-gray-400 mb-4 z-10">Niveau N5</p>

          <div v-if="authStore.user" class="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-auto z-10">
            <div class="h-full bg-red-500 transition-all duration-500"
              :style="{ width: getPercentage(kanjiProgress) + '%' }"></div>
          </div>
        </RouterLink>

        <RouterLink to="/grammar"
          class="card p-6 flex flex-col items-center hover:scale-[1.02] transition-transform group cursor-pointer relative overflow-hidden h-full">
          <div class="absolute -right-4 -top-4 opacity-5 font-display text-9xl text-tanuki-brown">文</div>
          <div v-if="authStore.user"
            class="absolute top-2 right-4 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
            {{ grammarProgress.mastered }}/{{ grammarProgress.total }}
          </div>
          <div class="bg-indigo-100 p-3 rounded-full mb-3 group-hover:bg-indigo-200 transition-colors">
            <PenTool class="w-8 h-8 text-indigo-600" />
          </div>
          <h3 class="text-xl font-bold text-tanuki-brown group-hover:text-tanuki-green transition-colors">
            Grammaire</h3>
          <p class="text-sm text-gray-400 mb-4">Particules & Phrases</p>

          <div v-if="authStore.user" class="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-auto">
            <div class="h-full bg-indigo-500 transition-all duration-500"
              :style="{ width: getPercentage(grammarProgress) + '%' }"></div>
          </div>
        </RouterLink>

        <RouterLink to="/vocabulary"
          class="card p-6 flex flex-col items-center hover:scale-[1.02] transition-transform group cursor-pointer relative overflow-hidden">
          <div class="absolute -right-4 -top-4 opacity-5 font-display text-9xl text-tanuki-brown">語</div>
          <div v-if="authStore.user"
            class="absolute top-2 right-4 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
            {{ vocabProgress.mastered }}/{{ vocabProgress.total }}
          </div>
          <div class="bg-green-100 p-3 rounded-full mb-3 group-hover:bg-green-200 transition-colors">
            <BookOpen class="w-8 h-8 text-green-600" />
          </div>
          <h3 class="text-xl font-bold text-tanuki-brown group-hover:text-tanuki-green transition-colors">
            Vocabulaire
          </h3>
          <p class="text-sm text-gray-400 mb-4">Mots & Expressions</p>

          <div v-if="authStore.user" class="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-auto">
            <div class="h-full bg-green-500 transition-all duration-500"
              :style="{ width: getPercentage(vocabProgress) + '%' }"></div>
          </div>
        </RouterLink>

        <RouterLink to="/study"
          class="card p-6 flex flex-col items-center hover:scale-[1.02] transition-transform group cursor-pointer relative overflow-hidden">
          <div class="absolute -right-4 -top-4 opacity-5 font-display text-9xl text-tanuki-brown">カ</div>
          <div class="bg-pink-100 p-3 rounded-full mb-3 group-hover:bg-pink-200 transition-colors">
            <Layers class="w-8 h-8 text-pink-600" />
          </div>
          <h3 class="text-xl font-bold text-tanuki-brown group-hover:text-tanuki-green transition-colors">
            Flashcards
          </h3>
          <p class="text-sm text-gray-400 mb-4">Révision Kanas & Vocab</p>

          <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-auto opacity-0">
            <!-- Placeholder for alignment -->
          </div>
        </RouterLink>

        <RouterLink to="/quiz"
          class="card p-6 flex flex-col items-center hover:scale-[1.02] transition-transform group cursor-pointer relative overflow-hidden">
          <div class="absolute -right-4 -top-4 opacity-5 font-display text-9xl text-tanuki-brown">問</div>
          <div v-if="authStore.user"
            class="absolute top-2 right-4 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
            {{ userStore.masteredItems.length }} acquis
          </div>
          <div class="bg-orange-100 p-3 rounded-full mb-3 group-hover:bg-orange-200 transition-colors">
            <Gamepad2 class="w-8 h-8 text-orange-600" />
          </div>
          <h3 class="text-xl font-bold text-tanuki-brown group-hover:text-tanuki-green transition-colors">Quiz
          </h3>
          <p class="text-sm text-gray-400 mb-4">Testez vos connaissances</p>

          <div v-if="authStore.user" class="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-auto">
            <div class="h-full bg-orange-500 transition-all duration-500"
              :style="{ width: (userStore.masteredItems.length / (kanaProgress.total + vocabProgress.total + kanjiProgress.total + grammarProgress.total) * 100) + '%' }">
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </main>
</template>
