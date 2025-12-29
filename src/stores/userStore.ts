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
  const bestCombo = ref(0) // Best Combo tracking
  // Initialize from localStorage to persist across refreshes
  const currentCombo = ref(Number.parseInt(localStorage.getItem('tanuki_current_combo') || '0'))

  // Watch currentCombo to persist it immediately
  watch(currentCombo, (newVal) => {
    localStorage.setItem('tanuki_current_combo', String(newVal))
  })

  const username = ref('')
  const avatarColor = ref('gold') // Default color
  const lastStudiedAt = ref<string | null>(null)
  const loading = ref(false)

  // Load progress from Supabase if logged in
  const loadProgress = async () => {
    if (!auth.user) return

    loading.value = true
    const { data, error } = await supabase
      .from('profiles')
      .select(
        'score, total_questions, streak, high_score, best_combo, current_combo, username, avatar_url, last_studied_at',
      )
      .eq('id', auth.user.id)
      .single()

    if (data && !error) {
      score.value = data.score
      totalQuestions.value = data.total_questions
      streak.value = data.streak
      highScore.value = data.high_score
      if (data.best_combo) bestCombo.value = data.best_combo // Load best_combo
      if (data.current_combo) currentCombo.value = data.current_combo // Load current_combo
      if (data.username) username.value = data.username
      if (data.avatar_url) avatarColor.value = data.avatar_url
      if (data.last_studied_at) lastStudiedAt.value = data.last_studied_at
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
          bestCombo: bestCombo.value,
          currentCombo: currentCombo.value, // Save currentCombo locally
          lastStudiedAt: lastStudiedAt.value,
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
      best_combo: bestCombo.value,
      current_combo: currentCombo.value, // Persist current_combo to Cloud
      last_studied_at: lastStudiedAt.value,
      updated_at: new Date(),
    })
  }

  // Methods
  const updateBestCombo = (combo: number) => {
    // Also update currentCombo in state to keep it in sync
    currentCombo.value = combo
    if (combo > bestCombo.value) {
      bestCombo.value = combo
      saveProgress()
    }
  }

  const recordAnswer = (isCorrect: boolean) => {
    // Total always increments
    totalQuestions.value++

    if (!isCorrect) return

    // Score only increments on correct answer
    score.value++

    // Daily Streak Logic
    const now = new Date()
    const lastDate = lastStudiedAt.value ? new Date(lastStudiedAt.value) : null

    // Helper to check same day (simple local date check)
    const isSameDay = (d1: Date, d2: Date) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()

    // Helper to check if d2 is exactly yesterday relative to d1
    const isYesterday = (today: Date, past: Date) => {
      const oneDay = 24 * 60 * 60 * 1000
      // Strip time
      const t = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
      const p = new Date(past.getFullYear(), past.getMonth(), past.getDate()).getTime()
      return t - p === oneDay
    }

    if (lastDate) {
      if (isSameDay(now, lastDate)) {
        // Already played today: do nothing with streak
      } else if (isYesterday(now, lastDate)) {
        // Played yesterday: continue streak
        streak.value++
      } else {
        // Missed one or more days: reset to 1
        streak.value = 1
      }
    } else {
      // First time playing ever
      streak.value = 1
    }

    if (streak.value > highScore.value) {
      highScore.value = streak.value
    }

    lastStudiedAt.value = now.toISOString()
    saveProgress()
  }

  const resetProgress = () => {
    score.value = 0
    totalQuestions.value = 0
    streak.value = 0
    bestCombo.value = 0
    currentCombo.value = 0
    lastStudiedAt.value = null
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
        bestCombo.value = 0
        username.value = ''
        avatarColor.value = 'gold'
        lastStudiedAt.value = null
      }
    },
    { immediate: true },
  )

  return {
    score,
    totalQuestions,
    streak,
    highScore,
    bestCombo,
    currentCombo,
    username,
    avatarColor,
    lastStudiedAt,
    loading,
    recordAnswer,
    updateBestCombo,
    resetProgress,
    loadProgress,
    updateProfile,
  }
})
