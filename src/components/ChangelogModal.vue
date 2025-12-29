<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { changelog } from '@/data/changelog'
import tanukiScroll from '@/assets/tanuki-scroll.png'

defineProps<{
    isOpen: boolean
}>()

defineEmits<(e: 'close') => void>()
</script>

<template>
    <Transition name="fade">
        <div v-if="isOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/50 backdrop-blur-sm"
            @click.self="$emit('close')">

            <div
                class="bg-tanuki-beige w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col relative overflow-hidden animate-scale-in">

                <!-- Header -->
                <!-- Header -->
                <div
                    class="bg-tanuki-green text-white py-12 px-6 flex flex-col items-center text-center shrink-0 relative overflow-hidden">

                    <!-- Background Watermark -->
                    <img :src="tanukiScroll" alt=""
                        class="absolute inset-0 w-full h-full object-contain opacity-40 pointer-events-none scale-110 translate-y-2" />

                    <div class="relative z-10">
                        <h2 class="text-4xl font-display font-bold !text-tanuki-beige">Notes de version
                        </h2>
                        <p class="!text-tanuki-beige/80 text-sm">L'histoire de TanukiCode</p>
                    </div>
                    <button @click="$emit('close')"
                        class="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors active:scale-95 z-20">
                        <X class="w-6 h-6" />
                    </button>
                </div>

                <!-- Content -->
                <div class="overflow-y-auto p-4 md:p-6 space-y-8 overscroll-contain">
                    <div v-for="release in changelog" :key="release.version"
                        class="relative pl-4 border-l-2 border-tanuki-green/20 last:border-0 pb-8 last:pb-0">

                        <!-- Timeline Dot -->
                        <div
                            class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-tanuki-green border-4 border-tanuki-beige">
                        </div>

                        <!-- Version Header -->
                        <div class="flex items-baseline gap-3 mb-4">
                            <h3 class="text-xl font-bold text-tanuki-brown-dark">v{{ release.version }}</h3>
                            <span class="text-sm text-gray-500 font-mono">{{ release.date }}</span>
                            <span v-if="changelog[0] && release.version === changelog[0].version"
                                class="px-2 py-0.5 bg-tanuki-gold text-white text-[10px] font-bold rounded-full animate-pulse self-center">
                                NOUVEAU
                            </span>
                        </div>

                        <!-- Sections -->
                        <div class="space-y-6">
                            <div v-for="section in release.sections" :key="section.title"
                                class="bg-white p-6 rounded-xl shadow-sm border border-tanuki-green/10">
                                <h4
                                    class="font-bold text-tanuki-green text-lg mb-3 flex items-center gap-2 border-b border-tanuki-beige/50 pb-2">
                                    {{ section.title }}
                                </h4>
                                <ul class="space-y-4">
                                    <li v-for="(item, idx) in section.items" :key="idx"
                                        class="text-base text-gray-700 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-tanuki-gold">
                                        <!-- Auto-bold text before colon -->
                                        <span
                                            v-html="item.replace(/^([^:]+):/, '<strong class=\'text-tanuki-brown-dark font-bold uppercase tracking-wide\'>$1</strong> :')"></span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>


            </div>
        </div>
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.animate-scale-in {
    animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleIn {
    from {
        transform: scale(0.95);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
