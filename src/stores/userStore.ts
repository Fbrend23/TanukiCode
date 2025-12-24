import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './authStore'

export const useUserStore = defineStore('user', () => {
  const auth = useAuthStore()

  const score = ref(0)
  const totalQuestions = ref(0)
  const streak = ref(0)
  const highScore = ref(0)
  const username = ref('')
  const avatarColor = ref('gold') // Default color
  const loading = ref(false)

  // Load progress from Supabase if logged in
  const loadProgress = async () => {
    if (!auth.user) return

    loading.value = true
    const { data, error } = await supabase
      .from('profiles')
      .select('score, total_questions, streak, high_score, username, avatar_url')
      .eq('id', auth.user.id)
      .single()

    if (data && !error) {
      score.value = data.score
      totalQuestions.value = data.total_questions
      streak.value = data.streak
      highScore.value = data.high_score
      if (data.username) username.value = data.username
      if (data.avatar_url) avatarColor.value = data.avatar_url
    }
    loading.value = false
  }

  // Update profile (username & avatar)
  const updateProfile = async (newUsername: string, newColor: string) => {
    if (!auth.user) return

    const { error } = await supabase.from('profiles').upsert({
      id: auth.user.id,
      username: newUsername,
      avatar_url: newColor,
      updated_at: new Date(),
    })

    if (error) throw error

    username.value = newUsername
    avatarColor.value = newColor
  }

  // Save progress to Supabase
  const saveProgress = async () => {
    if (!auth.user) {
      // Logic for local-only users can go here (localStorage)
      localStorage.setItem(
        'tanuki_local_progress',
        JSON.stringify({
          score: score.value,
          totalQuestions: totalQuestions.value,
          streak: streak.value,
          highScore: highScore.value,
        }),
      )
      return
    }

    await supabase.from('profiles').upsert({
      id: auth.user.id,
      score: score.value,
      total_questions: totalQuestions.value,
      streak: streak.value,
      high_score: highScore.value,
      updated_at: new Date(),
    })
  }

  // Methods
  const recordAnswer = (isCorrect: boolean) => {
    totalQuestions.value++
    if (isCorrect) {
      score.value++
      streak.value++
      if (streak.value > highScore.value) {
        highScore.value = streak.value
      }
    } else {
      streak.value = 0
    }
    saveProgress()
  }

  const resetProgress = () => {
    score.value = 0
    totalQuestions.value = 0
    streak.value = 0
    saveProgress()
  }

  // Sync on login
  watch(
    () => auth.user,
    (newUser) => {
      if (newUser) {
        loadProgress()
      } else {
        // Reset local state on logout
        score.value = 0
        totalQuestions.value = 0
        streak.value = 0
        highScore.value = 0
        username.value = ''
        avatarColor.value = 'gold'
      }
    },
  )

  return {
    score,
    totalQuestions,
    streak,
    highScore,
    username,
    avatarColor,
    loading,
    recordAnswer,
    resetProgress,
    loadProgress,
    updateProfile,
  }
})
