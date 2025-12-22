<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Leaf } from 'lucide-vue-next';
</script>

<template>
  <div class="min-h-screen flex flex-col font-body">
    <!-- Header -->
    <header class="bg-tanuki-green text-tanuki-beige p-4 shadow-md sticky top-0 z-50">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center gap-2">
          <Leaf class="w-8 h-8 text-tanuki-gold" />
          <span class="text-2xl font-display font-bold">TanukiCode</span>
        </div>
        <nav class="flex gap-4">
          <RouterLink to="/" class="font-bold hover:text-tanuki-brown transition-colors">Home</RouterLink>
          <RouterLink to="/charts" class="font-bold hover:text-tanuki-brown transition-colors">Charts</RouterLink>
          <RouterLink to="/study" class="font-bold hover:text-tanuki-brown transition-colors">Study</RouterLink>
          <RouterLink to="/quiz" class="font-bold hover:text-tanuki-brown transition-colors">Quiz</RouterLink>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto py-8">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-tanuki-brown-dark text-tanuki-beige py-6 text-center">
      <p>&copy; 2025 TanukiCode. Learning made fun.</p>
    </footer>
  </div>
</template>

<style>
/* Global resets if needed, but Tailwind handles most */
</style>
