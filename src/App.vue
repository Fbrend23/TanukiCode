<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { LogOut, User as UserIcon } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/authStore'
import ToastContainer from '@/components/ToastContainer.vue'
import pkg from '../package.json'

const auth = useAuthStore()
const router = useRouter()
const appVersion = pkg.version;

const handleLogout = async () => {
  await auth.signOut()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex flex-col font-body bg-tanuki-beige/10">
    <!-- Header -->
    <header class="bg-tanuki-green text-tanuki-beige p-2 shadow-md sticky top-0 z-50">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-3 cursor-pointer group" @click="router.push('/')">
          <img src="@/assets/tanuki-head.png" alt="Tanuki Logo"
            class="w-10 h-10 object-contain group-hover:scale-110 transition-transform drop-shadow-md" />
          <span class="text-2xl font-display font-bold">TanukiCode</span>
        </div>
        <nav class="flex items-center gap-4 md:gap-6 text-sm md:text-base overflow-x-auto max-w-full pb-1 md:pb-0">
          <RouterLink to="/" class="font-bold hover:text-tanuki-brown transition-colors whitespace-nowrap">Accueil
          </RouterLink>
          <RouterLink to="/charts" class="font-bold hover:text-tanuki-brown transition-colors whitespace-nowrap">
            Tableaux</RouterLink>
          <RouterLink to="/study" class="font-bold hover:text-tanuki-brown transition-colors whitespace-nowrap">Étude
          </RouterLink>
          <RouterLink to="/kanji" class="font-bold hover:text-tanuki-brown transition-colors whitespace-nowrap">Kanjis
          </RouterLink>
          <RouterLink to="/quiz" class="font-bold hover:text-tanuki-brown transition-colors whitespace-nowrap">Quiz
          </RouterLink>

          <!-- Auth Section -->
          <div class="flex items-center gap-4 border-l border-tanuki-beige/30 pl-4">
            <template v-if="auth.user">
              <RouterLink to="/profile"
                class="flex items-center gap-2 text-tanuki-gold group hover:text-tanuki-brown transition-colors"
                title="Mon Profil">
                <div class="bg-tanuki-gold/20 p-2 rounded-full hover:bg-tanuki-gold/30 transition-colors">
                  <UserIcon class="w-6 h-6" />
                </div>
              </RouterLink>
              <button @click="handleLogout"
                class="hover:text-red-400 text-tanuki-beige/80 transition-colors flex items-center gap-1 font-bold ml-2">
                <LogOut class="w-4 h-4 cursor-pointer" />
              </button>
            </template>
            <template v-else>
              <RouterLink to="/auth"
                class="bg-tanuki-gold hover:bg-yellow-500 text-white px-4 py-1 rounded-full font-bold transition-all shadow-sm">
                Connexion
              </RouterLink>
            </template>
          </div>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto py-8 flex flex-col">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-tanuki-brown-dark text-tanuki-beige py-4">
      <div class="container mx-auto px-4 flex flex-col items-center gap-4">
        <p>&copy; 2025 TanukiCode. Apprendre en s'amusant.</p>
        <div class="flex gap-4 text-xs opacity-60">
          <RouterLink to="/legal" class="hover:underline hover:text-tanuki-gold transition-colors">Mentions Légales &
            Confidentialité</RouterLink>
          <span>•</span>
          <a :href="`https://github.com/Fbrend23/TanukiCode/releases/tag/v${appVersion}`" target="_blank"
            class="flex items-center gap-1 hover:underline hover:text-tanuki-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"
              class="w-4 h-4">
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            v{{ appVersion }}
          </a>
        </div>
      </div>
    </footer>
    <ToastContainer />
  </div>
</template>

<style>
/* Global resets if needed, but Tailwind handles most */
</style>
