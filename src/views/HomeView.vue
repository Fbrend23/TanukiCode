<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';
</script>

<template>
    <div class="flex flex-col items-center justify-center flex-grow h-full text-center px-4">
        <div class="relative w-40 h-40 md:w-64 md:h-64 mb-4 md:mb-8 animate-bounce-slow">
            <!-- Mascot Image -->
            <img src="@/assets/tanuki-mascot.png" alt="Tanuki Mascot"
                class="w-full h-full object-contain drop-shadow-lg" />
        </div>

        <h1 class="text-3xl md:text-5xl font-display font-bold text-tanuki-green mb-4">
            Bienvenue sur TanukiCode
        </h1>

        <p class="text-xl text-tanuki-brown-dark mb-4 md:mb-8 max-w-lg">
            Maîtrisez les Hiragana, Katakana et le vocabulaire japonais de base avec notre sympathique compagnon tanuki
            !
        </p>

        <button
            class="bg-tanuki-gold hover:bg-yellow-500 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2 cursor-pointer">
            Commencer à apprendre
            <ArrowRight class="w-6 h-6" />
        </button>
    </div>
</template>

<style scoped>
.animate-bounce-slow {
    animation: bounce 3s infinite;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(-5%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }

    50% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
}
</style>
