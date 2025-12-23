<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { User, Trash2, LogOut, Trophy, Flame } from 'lucide-vue-next'

const auth = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

const handleLogout = async () => {
    await auth.signOut()
    router.push('/')
}

const handleDeleteAccount = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte et toutes vos données ? Cette action est irréversible.')) {
        alert('Pour la sécurité, la suppression effective doit être confirmée par email ou via les paramètres. Vous allez être déconnecté.')
        await auth.signOut()
        router.push('/')
    }
}
</script>

<template>
    <div class="max-w-2xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-display font-bold text-tanuki-brown-dark mb-8 flex items-center gap-3">
            <User class="w-8 h-8" />
            Mon Profil
        </h1>

        <div class="bg-white rounded-3xl shadow-lg border border-tanuki-beige p-8 space-y-8">
            <!-- User Info -->
            <div class="flex items-center gap-4 pb-8 border-b border-tanuki-beige/30">
                <div class="bg-tanuki-green/10 p-4 rounded-full">
                    <User class="w-8 h-8 text-tanuki-green" />
                </div>
                <div>
                    <span class="block text-sm font-bold text-gray-400 uppercase tracking-wide">Email</span>
                    <p class="text-xl font-bold text-tanuki-brown-dark">{{ auth.user?.email }}</p>
                </div>
            </div>

            <!-- Stats Preview -->
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-tanuki-beige/20 p-4 rounded-xl flex items-center gap-3">
                    <Trophy class="w-6 h-6 text-tanuki-gold" />
                    <div>
                        <p class="text-sm text-gray-500">Score Total</p>
                        <p class="text-xl font-bold text-tanuki-brown">{{ userStore.score }}</p>
                    </div>
                </div>
                <div class="bg-tanuki-beige/20 p-4 rounded-xl flex items-center gap-3">
                    <Flame class="w-6 h-6 text-orange-400" />
                    <div>
                        <p class="text-sm text-gray-500">Série</p>
                        <p class="text-xl font-bold text-tanuki-brown">{{ userStore.streak }} jours</p>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="space-y-4 pt-4">
                <button @click="handleLogout"
                    class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-tanuki-beige hover:bg-tanuki-beige/20 text-tanuki-brown font-bold transition-colors">
                    <LogOut class="w-5 h-5" />
                    Se déconnecter
                </button>

                <button @click="handleDeleteAccount"
                    class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-100 text-red-400 hover:bg-red-50 hover:text-red-500 font-bold transition-all opacity-80 hover:opacity-100">
                    <Trash2 class="w-5 h-5" />
                    Supprimer mon compte
                </button>
            </div>
        </div>
    </div>
</template>
