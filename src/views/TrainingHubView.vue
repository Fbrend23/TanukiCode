<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Brain, Ear, Hammer } from 'lucide-vue-next';

const router = useRouter();

const games = [
    {
        id: 'quiz',
        title: 'Quiz Classique',
        description: 'Testez vos connaissances en lecture et écriture sur tout le contenu.',
        icon: Brain,
        color: 'bg-tanuki-green',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        text: 'text-white',
        route: '/training/quiz'
    },
    {
        id: 'audio',
        title: 'Quiz Rapide',
        description: 'Écoutez et trouvez la bonne réponse le plus vite possible.',
        icon: Ear,
        color: 'bg-blue-500',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        text: 'text-white',
        route: '/training/audio',
        disabled: true // Coming soon
    },
    {
        id: 'construction',
        title: 'Construction',
        description: 'Remettez les fragments de phrase dans le bon ordre.',
        icon: Hammer,
        color: 'bg-amber-500',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        text: 'text-white',
        route: '/training/construction'
    }
];

const navigateTo = (route: string, disabled?: boolean) => {
    if (disabled) return;
    router.push(route);
};
</script>

<template>
    <div class="flex flex-col items-center w-full px-4 py-0 pb-24">
        <!-- Header -->
        <div class="flex flex-col items-center w-full max-w-6xl mb-6">
            <div class="text-center mb-8">
                <h1 class="text-3xl md:text-4xl font-display font-bold text-tanuki-green mb-1 text-center">
                    Entraînement
                </h1>
                <p class="text-tanuki-brown-dark text-lg font-bold opacity-60">Perfectionnez votre maîtrise</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <button v-for="game in games" :key="game.id" @click="navigateTo(game.route, game.disabled)"
                    class="card p-6 flex flex-col items-center text-center gap-2 transition-all border-2 relative group overflow-hidden h-full bg-white hover:shadow-xl"
                    :class="[
                        game.disabled
                            ? 'opacity-60 cursor-not-allowed border-gray-200 bg-gray-50'
                            : 'cursor-pointer border-tanuki-brown hover:border-tanuki-green'
                    ]">

                    <!-- Watermark Character -->
                    <div
                        class="absolute -right-4 -top-4 opacity-5 font-display text-9xl text-tanuki-brown select-none pointer-events-none">
                        {{ game.id === 'quiz' ? '問' : game.id === 'construction' ? '建' : '聴' }}
                    </div>

                    <!-- Coming Soon Badge -->
                    <div v-if="game.disabled"
                        class="absolute top-2 right-2 bg-gray-100 text-gray-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider z-10">
                        Bientôt
                    </div>

                    <!-- Decorator Circle -->
                    <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors shadow-sm"
                        :class="game.disabled ? 'bg-gray-100' : game.iconBg">
                        <component :is="game.icon" class="w-8 h-8"
                            :class="game.disabled ? 'text-gray-400' : game.iconColor" />
                    </div>

                    <h2
                        class="text-xl font-bold text-tanuki-brown group-hover:text-tanuki-green transition-colors z-10">
                        {{ game.title }}</h2>
                    <p class="text-sm text-gray-400 leading-relaxed z-10">{{ game.description }}</p>

                    <!-- Play Button Visual -->
                    <div v-if="!game.disabled"
                        class="mt-auto pt-4 text-tanuki-green font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 text-sm">
                        <span>COMMENCER</span>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>
