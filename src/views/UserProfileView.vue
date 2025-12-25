<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { User, Trash2, LogOut, Trophy, Flame, Edit2, Check, X as XIcon, Palette, Lock } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'
import { useNotificationStore } from '@/stores/notificationStore'
import ConfirmationModal from '@/components/ConfirmationModal.vue'

const auth = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

const notification = useNotificationStore()
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const editLoading = ref(false)

// Edit Profile State
const formUsername = ref('')
const formColor = ref('')

// Change Password State
const isChangingPassword = ref(false)
const passNew = ref('')
const passConfirm = ref('')
const passLoading = ref(false)

const colors = [
    { name: 'Tanuki Gold', value: 'gold', bg: 'bg-tanuki-gold' },
    { name: 'Forêt', value: 'green', bg: 'bg-emerald-500' },
    { name: 'Océan', value: 'blue', bg: 'bg-blue-500' },
    { name: 'Feu', value: 'red', bg: 'bg-red-500' },
    { name: 'Nuit', value: 'black', bg: 'bg-gray-800' },
    { name: 'Sakura', value: 'pink', bg: 'bg-pink-400' },
]

const getColorClass = (colorName: string) => {
    const c = colors.find(c => c.value === colorName)
    return c ? c.bg : 'bg-tanuki-gold'
}

const startEditing = () => {
    formUsername.value = userStore.username || ''
    formColor.value = userStore.avatarColor || 'gold'
    isEditing.value = true
}

const cancelEditing = () => {
    isEditing.value = false
    formUsername.value = ''
    formColor.value = ''
}

const startChangingPassword = () => {
    isChangingPassword.value = true
    passNew.value = ''
    passConfirm.value = ''
}

const cancelChangingPassword = () => {
    isChangingPassword.value = false
    passNew.value = ''
    passConfirm.value = ''
}

const updatePassword = async () => {
    if (passNew.value !== passConfirm.value) {
        notification.addNotification('Les mots de passe ne correspondent pas.', 'error')
        return
    }
    if (passNew.value.length < 6) {
        notification.addNotification('Le mot de passe doit faire au moins 6 caractères.', 'error')
        return
    }

    passLoading.value = true
    try {
        const { error } = await supabase.auth.updateUser({ password: passNew.value })
        if (error) throw error
        notification.addNotification('Mot de passe mis à jour !', 'success')
        isChangingPassword.value = false
    } catch (e) {
        console.error('Erreur password:', e)
        notification.addNotification('Erreur lors de la mise à jour.', 'error')
    } finally {
        passLoading.value = false
    }
}

const saveProfile = async () => {
    editLoading.value = true
    try {
        await userStore.updateProfile(formUsername.value, formColor.value)
        notification.addNotification('Profil mis à jour avec succès !', 'success')
        isEditing.value = false
    } catch (e) {
        console.error('Erreur update profile:', e)
        notification.addNotification('Erreur lors de la mise à jour.', 'error')
    } finally {
        editLoading.value = false
    }
}

const handleLogout = async () => {
    await auth.signOut()
    router.push('/')
    notification.addNotification('Vous avez été déconnecté.', 'info')
}

const confirmDeleteAccount = async () => {
    isDeleteModalOpen.value = true
}

const handleDeleteAccount = async () => {
    isDeleteModalOpen.value = false
    try {
        const { error } = await supabase.rpc('delete_user')
        if (error) throw error

        await auth.signOut()
        router.push('/')
        notification.addNotification('Votre compte a été supprimé avec succès.', 'success')
    } catch (e) {
        console.error('Erreur lors de la suppression du compte:', e)
        notification.addNotification('Une erreur est survenue lors de la suppression. Veuillez réessayer.', 'error')
    }
}
</script>

<template>
    <div class="max-w-2xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-display font-bold text-tanuki-brown mb-8 flex items-center gap-3">
            <User class="w-8 h-8" />
            Mon Profil
        </h1>

        <div class="space-y-6">
            <!-- 1. Identity Card -->
            <div class="bg-white rounded-3xl shadow-lg border-2 border-tanuki-green p-8 relative">
                <!-- Helper: Edit Button (Top Right) -->
                <button v-if="!isEditing" @click="startEditing"
                    class="absolute top-4 right-4 p-2 text-tanuki-brown/50 hover:text-tanuki-green transition-colors">
                    <Edit2 class="w-5 h-5" />
                </button>

                <!-- Avatar & Identity -->
                <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <!-- Avatar Display/Edit -->
                    <div class="relative group">
                        <div class="w-24 h-24 rounded-full flex items-center justify-center text-white shadow-inner transition-colors border-4 border-white ring-4 ring-tanuki-green/20"
                            :class="isEditing ? getColorClass(formColor) : getColorClass(userStore.avatarColor)">
                            <User class="w-12 h-12" />
                        </div>
                        <!-- Color Picker Overlay -->
                        <div v-if="isEditing"
                            class="absolute -bottom-2 -right-2 bg-white rounded-full shadow-lg p-2 cursor-pointer border-2 border-tanuki-green">
                            <Palette class="w-4 h-4 text-tanuki-green" />
                        </div>
                    </div>

                    <!-- Identity Fields -->
                    <div v-if="isEditing" class="flex-1 w-full space-y-4">
                        <div>
                            <label for="username"
                                class="block text-xs font-bold text-tanuki-green uppercase tracking-wide mb-1">Pseudo</label>
                            <input id="username" v-model="formUsername" type="text" placeholder="Votre pseudo"
                                class="w-full px-4 py-2 bg-white border-2 border-tanuki-green rounded-xl focus:ring-2 focus:ring-tanuki-green/50 outline-none font-bold text-tanuki-brown" />
                        </div>

                        <div>
                            <span class="block text-xs font-bold text-tanuki-green uppercase tracking-wide mb-2">Couleur
                                d'Avatar</span>
                            <div class="flex gap-2 flex-wrap">
                                <button v-for="c in colors" :key="c.value" @click="formColor = c.value"
                                    class="w-8 h-8 rounded-full border-2 transition-all transform hover:scale-110"
                                    :class="[c.bg, formColor === c.value ? 'border-tanuki-brown scale-110 ring-2 ring-offset-2 ring-tanuki-brown/20' : 'border-transparent']"
                                    :title="c.name">
                                </button>
                            </div>
                        </div>

                        <div class="flex gap-2 pt-2">
                            <button @click="saveProfile"
                                class="flex-1 btn-3d btn-primary flex items-center justify-center gap-2">
                                <Check class="w-5 h-5" /> Enregistrer
                            </button>
                            <button @click="cancelEditing"
                                class="px-6 btn-3d btn-secondary border-t-2 border-x-2 border-b-4 flex items-center justify-center gap-2">
                                <XIcon class="w-5 h-5" /> Annuler
                            </button>
                        </div>
                    </div>

                    <div v-else class="flex-1 text-center md:text-left">
                        <span class="block text-sm font-bold text-gray-400 uppercase tracking-wide cursor-help"
                            title="Email (Privé)">{{ auth.user?.email }}</span>
                        <h2 class="text-3xl font-display font-bold text-tanuki-brown mt-1">
                            {{ userStore.username || 'Tanuki Anonyme' }}
                        </h2>
                        <p v-if="!userStore.username" class="text-sm text-tanuki-brown/60 italic mt-1">
                            Ajoutez un pseudo pour personnaliser votre profil !
                        </p>
                    </div>
                </div>
            </div>

            <!-- 2. Stats Card -->
            <div class="grid grid-cols-2 gap-4">
                <div class="card p-6 flex flex-col items-center justify-center gap-2 text-center">
                    <Trophy class="w-8 h-8 text-tanuki-gold mb-1" />
                    <p class="text-xs font-bold text-tanuki-brown/50 uppercase tracking-wide">Score Total</p>
                    <p class="text-3xl font-bold text-tanuki-brown">{{ userStore.score }}</p>
                </div>
                <div class="card p-6 flex flex-col items-center justify-center gap-2 text-center">
                    <Flame class="w-8 h-8 text-amber-500 mb-1" />
                    <p class="text-xs font-bold text-tanuki-brown/50 uppercase tracking-wide">Série</p>
                    <p class="text-3xl font-bold text-tanuki-brown">{{ userStore.streak }} <span
                            class="text-sm font-normal text-tanuki-brown/60">j</span></p>
                </div>
            </div>

            <!-- 3. Security & Actions -->
            <div class="card p-8 space-y-6">
                <h3 class="text-xl font-bold text-tanuki-brown mb-4 flex items-center gap-2 opacity-80">
                    <Lock class="w-5 h-5 text-tanuki-green" /> Mon compte
                </h3>

                <div class="space-y-4">
                    <!-- Change Password Toggle -->
                    <button v-if="!isChangingPassword" @click="startChangingPassword"
                        class="w-full text-left btn-3d btn-secondary border-t-2 border-x-2 border-b-4 flex items-center justify-between group">
                        <span>Changer de mot de passe</span>
                        <Edit2 class="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <!-- Change Password Form -->
                    <div v-else class="bg-white rounded-xl p-6 border-2 border-tanuki-green space-y-4 shadow-inner">
                        <h4 class="font-bold text-tanuki-green text-sm uppercase tracking-wide mb-2">Nouveau mot de
                            passe</h4>
                        <div>
                            <input v-model="passNew" type="password" placeholder="Nouveau mot de passe"
                                class="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-tanuki-green outline-none font-bold text-tanuki-brown" />
                        </div>
                        <div>
                            <input v-model="passConfirm" type="password" placeholder="Confirmer le mot de passe"
                                class="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-tanuki-green outline-none font-bold text-tanuki-brown" />
                        </div>

                        <div class="flex gap-2">
                            <button @click="updatePassword" :disabled="passLoading"
                                class="flex-1 btn-3d btn-primary flex items-center justify-center gap-2">
                                <Check class="w-5 h-5" />
                                <span v-if="passLoading">...</span>
                                <span v-else>Valider</span>
                            </button>
                            <button @click="cancelChangingPassword"
                                class="btn-3d btn-secondary border-t-2 border-x-2 border-b-4 px-6 flex items-center justify-center gap-2">
                                <XIcon class="w-5 h-5" /> Annuler
                            </button>
                        </div>
                    </div>

                    <div class="border-t border-gray-100 my-4"></div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button @click="handleLogout"
                            class="w-full btn-3d btn-secondary border-t-2 border-x-2 border-b-4 flex items-center justify-center gap-2">
                            <LogOut class="w-5 h-5" />
                            Se déconnecter
                        </button>
                        <button @click="confirmDeleteAccount"
                            class="w-full btn-3d btn-danger border-t-2 border-x-2 border-b-4 flex items-center justify-center gap-2">
                            <Trash2 class="w-5 h-5" />
                            Supprimer
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <ConfirmationModal :is-open="isDeleteModalOpen" title="Supprimer mon compte ?"
            message="Êtes-vous sûr de vouloir supprimer votre compte et toutes vos données ? Cette action est irréversible."
            confirm-text="Oui, tout supprimer" :is-destructive="true" @close="isDeleteModalOpen = false"
            @confirm="handleDeleteAccount" />
    </div>
</template>
