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

  // Mastery Tracking (Set of IDs/Strings)
  const masteredItems = ref<string[]>([])

  // Load from localStorage for quick access
  const loadLocalMastery = () => {
    const saved = localStorage.getItem('tanuki_mastered_items')
    if (saved) {
      try {
        masteredItems.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse local mastery', e)
      }
    }
  }
  loadLocalMastery()

  // Watch currentCombo to persist it immediately
  watch(currentCombo, (newVal) => {
    localStorage.setItem('tanuki_current_combo', String(newVal))
  })

  // Watch masteredItems to persist it immediately
  watch(
    masteredItems,
    (newVal) => {
      localStorage.setItem('tanuki_mastered_items', JSON.stringify(newVal || []))
    },
    { deep: true },
  )

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
        'score, total_questions, streak, high_score, best_combo, current_combo, username, avatar_url, last_studied_at, mastered_items',
      )
      .eq('id', auth.user.id)
      .single()

    if (data && !error) {
      score.value = data.score || 0
      totalQuestions.value = data.total_questions || 0
      streak.value = data.streak || 0
      highScore.value = data.high_score || 0
      if (data.best_combo) bestCombo.value = data.best_combo
      if (data.current_combo) currentCombo.value = data.current_combo
      if (data.username) username.value = data.username
      if (data.avatar_url) avatarColor.value = data.avatar_url
      if (data.last_studied_at) lastStudiedAt.value = data.last_studied_at
      if (data.mastered_items) masteredItems.value = data.mastered_items || []
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
      // Logic for local-only users
      localStorage.setItem(
        'tanuki_local_progress',
        JSON.stringify({
          score: score.value,
          totalQuestions: totalQuestions.value,
          streak: streak.value,
          highScore: highScore.value,
          bestCombo: bestCombo.value,
          currentCombo: currentCombo.value,
          lastStudiedAt: lastStudiedAt.value,
          masteredItems: masteredItems.value,
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
      current_combo: currentCombo.value,
      last_studied_at: lastStudiedAt.value,
      mastered_items: masteredItems.value, // Persist mastery
      updated_at: new Date(),
    })
  }

  // Methods
  const updateBestCombo = (combo: number) => {
    currentCombo.value = combo
    if (combo > bestCombo.value) {
      bestCombo.value = combo
      saveProgress()
    }
  }

  const markAsMastered = (itemId: string) => {
    if (!masteredItems.value.includes(itemId)) {
      masteredItems.value.push(itemId)
      saveProgress()
    }
  }

  const toggleMastery = (itemId: string) => {
    const index = masteredItems.value.indexOf(itemId)
    if (index === -1) {
      masteredItems.value.push(itemId)
    } else {
      masteredItems.value.splice(index, 1)
    }
    saveProgress()
  }

  const recordAnswer = (isCorrect: boolean) => {
    totalQuestions.value++

    if (!isCorrect) return

    score.value++

    const now = new Date()
    const lastDate = lastStudiedAt.value ? new Date(lastStudiedAt.value) : null

    const isSameDay = (d1: Date, d2: Date) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()

    const isYesterday = (today: Date, past: Date) => {
      const oneDay = 24 * 60 * 60 * 1000
      const t = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
      const p = new Date(past.getFullYear(), past.getMonth(), past.getDate()).getTime()
      return t - p === oneDay
    }

    if (lastDate) {
      if (!isSameDay(now, lastDate)) {
        if (isYesterday(now, lastDate)) {
          streak.value++
        } else {
          streak.value = 1
        }
      }
    } else {
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
    masteredItems.value = []
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
        score.value = 0
        totalQuestions.value = 0
        streak.value = 0
        highScore.value = 0
        bestCombo.value = 0
        username.value = ''
        avatarColor.value = 'gold'
        lastStudiedAt.value = null
        masteredItems.value = []
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
    masteredItems,
    username,
    avatarColor,
    lastStudiedAt,
    loading,
    recordAnswer,
    updateBestCombo,
    resetProgress,
    loadProgress,
    updateProfile,
    markAsMastered,
    toggleMastery,
  }
})
