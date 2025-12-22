<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Leaf } from 'lucide-vue-next';
</script>

<template>
  <div class="min-h-screen flex flex-col font-body">
    <!-- Header -->
    <header class="bg-tanuki-green text-tanuki-beige p-4 shadow-md sticky top-0 z-50">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-2">
          <Leaf class="w-8 h-8 text-tanuki-gold" />
          <span class="text-2xl font-display font-bold">TanukiCode</span>
        </div>
        <nav class="flex gap-4 md:gap-6 text-sm md:text-base overflow-x-auto max-w-full pb-1 md:pb-0">
          <RouterLink to="/" class="font-bold hover:text-tanuki-brown transition-colors whitespace-nowrap">Accueil
          </RouterLink>
          <RouterLink to="/charts" class="font-bold hover:text-tanuki-brown transition-colors whitespace-nowrap">
            Tableaux</RouterLink>
          <RouterLink to="/study" class="font-bold hover:text-tanuki-brown transition-colors whitespace-nowrap">Étude
          </RouterLink>
          <RouterLink to="/quiz" class="font-bold hover:text-tanuki-brown transition-colors whitespace-nowrap">Quiz
          </RouterLink>
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
  </div>
</template>

<style>
/* Global resets if needed, but Tailwind handles most */
</style>
