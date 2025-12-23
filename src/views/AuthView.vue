<script setup lang="ts">
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'
import { Leaf, Mail, Lock, ArrowRight, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const titleText = computed(() => isLogin.value ? 'Connexion' : 'Inscription')
const subtitleText = computed(() =>
    isLogin.value
        ? 'Content de vous revoir sur TanukiCode !'
        : 'Rejoignez-nous pour sauvegarder votre progression.'
)

const handleAuth = async () => {
    loading.value = true
    errorMsg.value = ''

    try {
        if (isLogin.value) {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.value,
                password: password.value
            })
            if (error) throw error
        } else {
            const { error } = await supabase.auth.signUp({
                email: email.value,
                password: password.value,
                options: {
                    emailRedirectTo: window.location.origin
                }
            })
            if (error) throw error
            alert('Vérifiez vos emails pour confirmer votre inscription !')
        }
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
                    <Leaf class="w-10 h-10 text-tanuki-green" />
                </div>
                <h1 class="text-3xl font-display font-bold text-tanuki-brown-dark">
                    {{ titleText }}
                </h1>
                <p class="text-gray-500 text-center mt-2">
                    {{ subtitleText }}
                </p>
            </div>

            <form @submit.prevent="handleAuth" class="space-y-4">
                <div>
                    <label class="block text-sm font-bold text-tanuki-brown mb-1">Email</label>
                    <div class="relative">
                        <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input v-model="email" type="email" required placeholder="votre@email.com"
                            class="w-full pl-10 pr-4 py-3 bg-tanuki-beige/20 border-2 border-transparent focus:border-tanuki-green outline-none rounded-xl transition-all" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-tanuki-brown mb-1">Mot de passe</label>
                    <div class="relative">
                        <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input v-model="password" type="password" required placeholder="••••••••"
                            class="w-full pl-10 pr-4 py-3 bg-tanuki-beige/20 border-2 border-transparent focus:border-tanuki-green outline-none rounded-xl transition-all" />
                    </div>
                </div>

                <div v-if="errorMsg"
                    class="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-medium border border-red-100">
                    {{ errorMsg }}
                </div>

                <button :disabled="loading" type="submit"
                    class="w-full bg-tanuki-green hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    <template v-if="loading">
                        <Loader2 class="w-6 h-6 animate-spin" />
                        Chargement...
                    </template>
                    <template v-else>
                        {{ isLogin ? 'Se connecter' : "S'inscrire" }}
                        <ArrowRight class="w-5 h-5" />
                    </template>
                </button>
            </form>

            <div class="mt-8 text-center">
                <button @click="isLogin = !isLogin" class="text-tanuki-green font-bold hover:underline">
                    {{ isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter' }}
                </button>
            </div>
        </div>
    </div>
</template>
