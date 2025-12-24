<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { User, Trash2, LogOut, Trophy, Flame, Edit2, Check, X as XIcon, Palette } from 'lucide-vue-next'
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

const formUsername = ref('')
const formColor = ref('')

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

        <div class="bg-[#FDFBF7] rounded-3xl shadow-lg border border-tanuki-beige p-8 space-y-8">
            <!-- User Info -->
            <!-- User Info -->
            <div class="flex flex-col md:flex-row items-center md:items-start gap-6 pb-8 border-b border-tanuki-beige/30 relative">
                
                <!-- Helper: Edit Button (Top Right) -->
                <button v-if="!isEditing" @click="startEditing" class="absolute top-0 right-0 p-2 text-tanuki-brown/50 hover:text-tanuki-green transition-colors">
                    <Edit2 class="w-5 h-5" />
                </button>

                <!-- Avatar Display/Edit -->
                <div class="relative group">
                     <div class="w-24 h-24 rounded-full flex items-center justify-center text-white shadow-inner transition-colors border-4 border-white ring-2 ring-tanuki-beige/20"
                        :class="isEditing ? getColorClass(formColor) : getColorClass(userStore.avatarColor)">
                        <User class="w-12 h-12" />
                     </div>
                     <!-- Color Picker Overlay in Edit Mode -->
                     <div v-if="isEditing" class="absolute -bottom-2 -right-2 bg-white rounded-full shadow-lg p-2 cursor-pointer border border-tanuki-beige">
                        <Palette class="w-4 h-4 text-gray-500" />
                     </div>
                </div>

                <!-- Colors Selection Grid (Only visible in edit mode) -->
                <div v-if="isEditing" class="flex-1 w-full space-y-4">
                     <div>
                        <label for="username" class="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Pseudo</label>
                        <input id="username" v-model="formUsername" type="text" placeholder="Votre pseudo" 
                            class="w-full px-4 py-2 bg-tanuki-beige/10 border-2 border-tanuki-beige rounded-xl focus:border-tanuki-green outline-none font-bold text-tanuki-brown" />
                     </div>
                     
                     <div>
                        <span class="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Couleur d'Avatar</span>
                        <div class="flex gap-2 flex-wrap">
                            <button v-for="c in colors" :key="c.value" 
                                @click="formColor = c.value"
                                class="w-8 h-8 rounded-full border-2 transition-all transform hover:scale-110"
                                :class="[c.bg, formColor === c.value ? 'border-tanuki-brown scale-110 ring-2 ring-offset-2 ring-tanuki-brown/20' : 'border-transparent']"
                                :title="c.name">
                            </button>
                        </div>
                     </div>

                     <div class="flex gap-2 pt-2">
                        <button @click="saveProfile" class="flex-1 bg-tanuki-green hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                            <Check class="w-4 h-4" /> Enregistrer
                        </button>
                        <button @click="cancelEditing" class="px-4 py-2 rounded-lg font-bold text-sm text-gray-500 hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors">
                            <XIcon class="w-4 h-4" /> Annuler
                        </button>
                     </div>
                </div>

                <!-- View Mode Display -->
                <div v-else class="flex-1 text-center md:text-left">
                    <div>
                        <span class="block text-sm font-bold text-gray-400 uppercase tracking-wide cursor-help" title="Email (Privé)">{{ auth.user?.email }}</span>
                        <h2 class="text-3xl font-display font-bold text-tanuki-brown mt-1">
                            {{ userStore.username || 'Tanuki Anonyme' }}
                        </h2>
                        <p v-if="!userStore.username" class="text-sm text-tanuki-brown/60 italic mt-1">
                            Ajoutez un pseudo pour personnaliser votre profil !
                        </p>
                    </div>
                </div>
            </div>

            <!-- Stats Preview -->
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-white p-4 rounded-xl flex items-center gap-3 border-2 border-tanuki-beige shadow-sm">
                    <Trophy class="w-6 h-6 text-tanuki-gold" />
                    <div>
                        <p class="text-xs font-bold text-tanuki-brown/50 uppercase tracking-wide">Score Total</p>
                        <p class="text-xl font-bold text-tanuki-brown">{{ userStore.score }}</p>
                    </div>
                </div>
                <div class="bg-white p-4 rounded-xl flex items-center gap-3 border-2 border-tanuki-beige shadow-sm">
                    <Flame class="w-6 h-6 text-amber-500" />
                    <div>
                        <p class="text-xs font-bold text-tanuki-brown/50 uppercase tracking-wide">Série</p>
                        <p class="text-xl font-bold text-tanuki-brown">{{ userStore.streak }} jours</p>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="space-y-4 pt-4">
                <button @click="handleLogout"
                    class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white border-2 border-tanuki-beige text-tanuki-brown font-bold hover:border-tanuki-brown hover:bg-tanuki-beige/10 transition-all shadow-sm">
                    <LogOut class="w-5 h-5" />
                    Se déconnecter
                </button>

                <button @click="confirmDeleteAccount"
                    class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white border-2 border-red-100 text-red-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 font-bold transition-all shadow-sm opacity-80 hover:opacity-100">
                    <Trash2 class="w-5 h-5" />
                    Supprimer mon compte
                </button>
            </div>
        </div>

        <ConfirmationModal
            :is-open="isDeleteModalOpen"
            title="Supprimer mon compte ?"
            message="Êtes-vous sûr de vouloir supprimer votre compte et toutes vos données ? Cette action est irréversible."
            confirm-text="Oui, tout supprimer"
            :is-destructive="true"
            @close="isDeleteModalOpen = false"
            @confirm="handleDeleteAccount"
        />
    </div>
</template>
