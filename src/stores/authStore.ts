import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)

  // Initialize
  supabase.auth.getSession().then(({ data: { session } }) => {
    user.value = session?.user ?? null
    loading.value = false
  })

  // Listen for changes
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
    loading.value = false
  })

  const signOut = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  return {
    user,
    loading,
    signOut,
  }
})
