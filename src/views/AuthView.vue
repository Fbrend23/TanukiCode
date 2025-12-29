<script setup lang="ts">
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-vue-next'
import tanukiHead from '@/assets/tanuki-head.png'

const router = useRouter()
// const notification = useNotificationStore() // Not used for AuthView anymore per user request
const isLogin = ref(true)
const isResetMode = ref(false)
const email = ref('')
const password = ref('')
const loading = ref(false)
const authMessage = ref<{ text: string, type: 'success' | 'error' } | null>(null)

const titleText = computed(() => {
    if (isResetMode.value) return 'Réinitialisation'
    return isLogin.value ? 'Connexion' : 'Inscription'
})

const subtitleText = computed(() => {
    if (isResetMode.value) return 'Entrez votre email pour recevoir le lien.'
    return isLogin.value
        ? 'Content de vous revoir sur TanukiCode !'
        : 'Rejoignez-nous pour sauvegarder votre progression.'
})

const handleAuth = async () => {
    loading.value = true
    authMessage.value = null

    try {
        if (isResetMode.value) {
            const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
                redirectTo: `${globalThis.location.origin}/update-password`
            })
            if (error) throw error
            authMessage.value = { text: 'Email de réinitialisation envoyé !', type: 'success' }
        } else if (isLogin.value) {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.value,
                password: password.value
            })
            if (error) throw error
            router.push('/')
        } else {
            const { error } = await supabase.auth.signUp({
                email: email.value,
                password: password.value,
                options: {
                    emailRedirectTo: globalThis.location.origin
                }
            })
            if (error) throw error
            authMessage.value = { text: 'Vérifiez vos emails pour confirmer votre inscription !', type: 'success' }
        }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e)
        authMessage.value = { text: message, type: 'error' }
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-[70vh] px-4 md:px-0">
        <div class="w-full max-w-md card p-6 md:p-8">
            <div class="flex flex-col items-center mb-6 md:mb-8">
                <div class="bg-tanuki-green/10 p-3 md:p-4 rounded-full mb-4">
                    <img :src="tanukiHead" alt="Tanuki Logo" class="w-12 h-12 md:w-16 md:h-16 object-contain" />
                </div>
                <h1 class="text-3xl font-display font-bold text-tanuki-brown-dark text-center">
                    {{ titleText }}
                </h1>
                <p class="text-gray-500 text-center mt-2">
                    {{ subtitleText }}
                </p>
            </div>

            <form @submit.prevent="handleAuth" class="space-y-4">
                <div>
                    <label for="email" class="block text-sm font-bold text-tanuki-brown mb-1">Email</label>
                    <div class="relative">
                        <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input id="email" v-model="email" type="email" required placeholder="votre@email.com"
                            class="w-full pl-10 pr-4 py-3 bg-tanuki-beige/20 border-2 border-transparent focus:border-tanuki-green outline-none rounded-xl transition-all" />
                    </div>
                </div>

                <div v-if="!isResetMode">
                    <div class="flex justify-between items-center mb-1">
                        <label for="password" class="block text-sm font-bold text-tanuki-brown">Mot de passe</label>
                        <button v-if="isLogin" type="button" @click="isResetMode = true"
                            class="text-xs text-tanuki-green hover:underline font-medium">
                            Mot de passe oublié ?
                        </button>
                    </div>
                    <div class="relative">
                        <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input id="password" v-model="password" type="password" required placeholder="••••••••"
                            class="w-full pl-10 pr-4 py-3 bg-tanuki-beige/20 border-2 border-transparent focus:border-tanuki-green outline-none rounded-xl transition-all" />
                    </div>
                </div>

                <div v-if="authMessage" class="p-3 rounded-lg text-sm font-medium border flex items-center gap-2"
                    :class="authMessage.type === 'error' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-600 border-green-100'">
                    <component :is="authMessage.type === 'error' ? AlertCircle : CheckCircle" class="w-4 h-4" />
                    {{ authMessage.text }}
                </div>

                <button :disabled="loading" type="submit"
                    class="w-full btn-3d btn-primary transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    <template v-if="loading">
                        <Loader2 class="w-6 h-6 animate-spin" />
                        Chargement...
                    </template>
                    <template v-else>
                        {{ isResetMode ? 'Envoyer le lien' : (isLogin ? 'Se connecter' : "S'inscrire") }}
                        <ArrowRight class="w-5 h-5" />
                    </template>
                </button>

                <!-- Legal Notice -->
                <p v-if="!isLogin" class="text-[10px] text-center text-gray-400 mt-4 leading-tight">
                    En cliquant sur s'inscrire, vous acceptez nos
                    <RouterLink to="/legal" class="underline hover:text-tanuki-green">mentions légales</RouterLink>
                    et notre politique de confidentialité.
                </p>
            </form>

            <div class="mt-8 text-center">
                <button v-if="isResetMode" @click="isResetMode = false"
                    class="text-tanuki-green font-bold hover:underline">
                    Retour à la connexion
                </button>
                <button v-else @click="isLogin = !isLogin" class="text-tanuki-green font-bold hover:underline">
                    {{ isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter' }}
                </button>
            </div>
        </div>
    </div>
</template>
