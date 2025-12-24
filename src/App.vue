<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { Leaf, LogOut, User as UserIcon } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/authStore'
import ToastContainer from '@/components/ToastContainer.vue'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await auth.signOut()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex flex-col font-body bg-tanuki-beige/10">
    <!-- Header -->
    <header class="bg-tanuki-green text-tanuki-beige p-4 shadow-md sticky top-0 z-50">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-2 cursor-pointer" @click="router.push('/')">
          <Leaf class="w-8 h-8 text-tanuki-gold" />
          <span class="text-2xl font-display font-bold">TanukiCode</span>
        </div>
        <nav class="flex items-center gap-4 md:gap-6 text-sm md:text-base overflow-x-auto max-w-full pb-1 md:pb-0">
          <RouterLink to="/" class="font-bold hover:text-tanuki-brown transition-colors whitespace-nowrap">Accueil
          </RouterLink>
          <RouterLink to="/charts" class="font-bold hover:text-tanuki-brown transition-colors whitespace-nowrap">
            Tableaux</RouterLink>
          <RouterLink to="/study" class="font-bold hover:text-tanuki-brown transition-colors whitespace-nowrap">Étude
          </RouterLink>
          <RouterLink to="/quiz" class="font-bold hover:text-tanuki-brown transition-colors whitespace-nowrap">Quiz
          </RouterLink>

          <!-- Auth Section -->
          <div class="flex items-center gap-4 border-l border-tanuki-beige/30 pl-4">
            <template v-if="auth.user">
              <div class="flex items-center gap-2 text-tanuki-gold group cursor-help" :title="auth.user.email">
                <UserIcon class="w-5 h-5" />
                <span class="hidden lg:inline text-xs font-mono opacity-80 truncate max-w-[100px]">{{ auth.user.email
                  }}</span>
              </div>
              <button @click="handleLogout"
                class="hover:text-red-300 transition-colors flex items-center gap-1 font-bold">
                <LogOut class="w-4 h-4" />
                <span class="hidden sm:inline">Quitter</span>
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
    <footer class="bg-tanuki-brown-dark text-tanuki-beige py-6 text-center">
      <p>&copy; 2025 TanukiCode. Apprendre en s'amusant.</p>
    </footer>
    <ToastContainer />
  </div>
</template>

<style>
/* Global resets if needed, but Tailwind handles most */
</style>
