<script setup lang="ts">
import { Grid3x3, BookOpen, Gamepad2, ScrollText } from 'lucide-vue-next';
</script>

<template>
    <div class="flex flex-col items-center justify-center flex-grow h-full text-center px-4 w-full max-w-4xl mx-auto">
        <div class="relative w-32 h-32 md:w-48 md:h-48 mb-6 animate-bounce-slow">
            <!-- Mascot Image -->
            <img src="@/assets/tanuki-mascot.png" alt="Tanuki Mascot"
                class="w-full h-full object-contain drop-shadow-lg" />
        </div>

        <h1 class="text-3xl md:text-5xl font-display font-bold text-tanuki-green mb-2">
            TanukiCode
        </h1>

        <p class="text-xl text-tanuki-brown-dark mb-8 max-w-lg">
            Apprenez le japonais en vous amusant !
        </p>

        <!-- Feature Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <RouterLink to="/charts"
                class="card p-6 flex flex-col items-center hover:scale-105 transition-transform group cursor-pointer hover:border-tanuki-green-light">
                <div class="bg-blue-100 p-3 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
                    <Grid3x3 class="w-8 h-8 text-blue-600" />
                </div>
                <h3 class="text-xl font-bold text-tanuki-brown group-hover:text-tanuki-green transition-colors">Kanas
                </h3>
                <p class="text-sm text-gray-500">Hiragana & Katakana</p>
            </RouterLink>

            <RouterLink to="/study"
                class="card p-6 flex flex-col items-center hover:scale-105 transition-transform group cursor-pointer hover:border-tanuki-green-light">
                <div class="bg-green-100 p-3 rounded-full mb-3 group-hover:bg-green-200 transition-colors">
                    <BookOpen class="w-8 h-8 text-green-600" />
                </div>
                <h3 class="text-xl font-bold text-tanuki-brown group-hover:text-tanuki-green transition-colors">Étude
                </h3>
                <p class="text-sm text-gray-500">Cartes & Vocabulaire</p>
            </RouterLink>

            <RouterLink to="/quiz"
                class="card p-6 flex flex-col items-center hover:scale-105 transition-transform group cursor-pointer hover:border-tanuki-green-light">
                <div class="bg-orange-100 p-3 rounded-full mb-3 group-hover:bg-orange-200 transition-colors">
                    <Gamepad2 class="w-8 h-8 text-orange-600" />
                </div>
                <h3 class="text-xl font-bold text-tanuki-brown group-hover:text-tanuki-green transition-colors">Quiz
                </h3>
                <p class="text-sm text-gray-500">Testez vos connaissances</p>
            </RouterLink>

            <RouterLink to="/kanji"
                class="card p-6 flex flex-col items-center hover:scale-105 transition-transform group cursor-pointer hover:border-tanuki-green-light relative overflow-hidden">
                <div class="absolute -right-4 -top-4 opacity-10 font-display text-9xl text-tanuki-brown">日</div>

                <!-- Badge -->
                <div
                    class="absolute top-3 right-3 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full z-20">
                    Nouveau
                </div>

                <div class="bg-red-100 p-3 rounded-full mb-3 group-hover:bg-red-200 transition-colors z-10">
                    <ScrollText class="w-8 h-8 text-red-600" />
                </div>
                <h3 class="text-xl font-bold text-tanuki-brown group-hover:text-tanuki-green transition-colors z-10">
                    Kanjis</h3>
                <p class="text-sm text-gray-500 z-10">Niveau N5</p>
            </RouterLink>
        </div>
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
