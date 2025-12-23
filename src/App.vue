<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { Leaf, LogOut, User as UserIcon } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/authStore'

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
              <RouterLink to="/profile"
                class="flex items-center gap-2 text-tanuki-gold group cursor-pointer hover:text-white transition-colors"
                title="Mon Profil">
                <UserIcon class="w-6 h-6" />
              </RouterLink>
              <button @click="handleLogout"
                class="hover:text-red-300 transition-colors flex items-center gap-1 font-bold ml-2 cursor-pointer"
                title="Se déconnecter">
                <LogOut class="w-5 h-5" />
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
    <footer class="bg-tanuki-brown-dark text-tanuki-beige py-8">
      <div class="container mx-auto px-4 flex flex-col items-center gap-4">
        <p>&copy; 2025 TanukiCode. Apprendre en s'amusant.</p>
        <div class="flex gap-4 text-xs opacity-60">
          <RouterLink to="/legal" class="hover:underline">Mentions Légales & Confidentialité</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* Global resets if needed, but Tailwind handles most */
</style>
