<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'
import { Lock, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-vue-next'
import { useNotificationStore } from '@/stores/notificationStore'

const router = useRouter()
const notification = useNotificationStore()

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleUpdatePassword = async () => {
    if (password.value !== confirmPassword.value) {
        errorMsg.value = "Les mots de passe ne correspondent pas."
        return
    }

    loading.value = true
    errorMsg.value = ''

    try {
        const { error } = await supabase.auth.updateUser({
            password: password.value
        })
        if (error) throw error

        notification.addNotification('Votre mot de passe a été mis à jour avec succès.', 'success')
        router.push('/')
    } catch (e: unknown) {
        errorMsg.value = e instanceof Error ? e.message : String(e)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div class="w-full max-w-md bg-white rounded-3xl shadow-xl border-2 border-tanuki-beige p-8">
            <div class="flex flex-col items-center mb-8">
                <div class="bg-tanuki-green/10 p-4 rounded-2xl mb-4">
                    <Lock class="w-10 h-10 text-tanuki-green" />
                </div>
                <h1 class="text-3xl font-display font-bold text-tanuki-brown-dark text-center">
                    Nouveau mot de passe
                </h1>
                <p class="text-gray-500 text-center mt-2">
                    Choisissez un nouveau mot de passe sécurisé.
                </p>
            </div>

            <form @submit.prevent="handleUpdatePassword" class="space-y-4">
                <div>
                    <label for="new-password" class="block text-sm font-bold text-tanuki-brown mb-1">Nouveau mot de passe</label>
                    <div class="relative">
                        <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input id="new-password" v-model="password" type="password" required placeholder="••••••••" minlength="6"
                            class="w-full pl-10 pr-4 py-3 bg-tanuki-beige/20 border-2 border-transparent focus:border-tanuki-green outline-none rounded-xl transition-all" />
                    </div>
                </div>

                <div>
                    <label for="confirm-password" class="block text-sm font-bold text-tanuki-brown mb-1">Confirmer</label>
                    <div class="relative">
                        <CheckCircle class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input id="confirm-password" v-model="confirmPassword" type="password" required placeholder="••••••••" minlength="6"
                            class="w-full pl-10 pr-4 py-3 bg-tanuki-beige/20 border-2 border-transparent focus:border-tanuki-green outline-none rounded-xl transition-all" />
                    </div>
                </div>

                <div v-if="errorMsg"
                    class="p-3 rounded-lg text-sm font-medium border flex items-center gap-2 bg-red-50 text-red-500 border-red-100">
                    <AlertCircle class="w-4 h-4 flex-shrink-0" />
                    {{ errorMsg }}
                </div>

                <button :disabled="loading" type="submit"
                    class="w-full bg-tanuki-green hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    <template v-if="loading">
                        <Loader2 class="w-6 h-6 animate-spin" />
                        Enregistrement...
                    </template>
                    <template v-else>
                        Mettre à jour
                        <ArrowRight class="w-5 h-5" />
                    </template>
                </button>
            </form>
        </div>
    </div>
</template>
