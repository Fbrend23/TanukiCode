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

  // XP & Leveling
  const xp = ref(0)
  const level = ref(1)
  const xpToNextLevel = ref(100)
  // Daily Activity (YYYY-MM-DD -> count)
  const dailyActivity = ref<Record<string, number>>({})

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
  const avatarImage = ref('default') // Default image (tanuki-head)
  const lastStudiedAt = ref<string | null>(null)
  const loading = ref(false)

  // Load progress from Supabase if logged in
  const loadProgress = async () => {
    if (!auth.user) return

    loading.value = true
    const { data, error } = await supabase
      .from('profiles')
      .select(
        'score, total_questions, streak, high_score, best_combo, current_combo, username, avatar_url, last_studied_at, mastered_items, xp, daily_activity',
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
      if (data.avatar_url) {
        if (data.avatar_url.includes('|')) {
          const [c, i] = data.avatar_url.split('|')
          avatarColor.value = c
          avatarImage.value = i
        } else if (data.avatar_url.includes('.')) {
          // Legacy: it was just an image
          avatarColor.value = 'white'
          avatarImage.value = data.avatar_url
        } else {
          // Legacy: it was just a color
          avatarColor.value = data.avatar_url
          avatarImage.value = 'default'
        }
      }
      if (data.last_studied_at) lastStudiedAt.value = data.last_studied_at
      if (data.mastered_items) masteredItems.value = data.mastered_items || []
      if (data.xp) {
        xp.value = data.xp
        calculateLevel()
      }
      if (data.daily_activity) {
        dailyActivity.value = data.daily_activity
      }
      username.value = data.username || ''
      xp.value = data.xp ?? 0
      calculateLevel()
    }
    loading.value = false
  }

  const calculateLevel = () => {
    // Simple formula: Level N requires N * 100 XP
    // Or cumulative: Level = floor(sqrt(XP / 100)) + 1
    // Let's use a progressive scale similar to RPGs
    // Level 1: 0-100
    // Level 2: 101-300 (diff 200)
    // Level 3: 301-600 (diff 300)
    // Formula: XP = (Level * (Level - 1) / 2) * 100
    // Inverse: Level = floor((1 + sqrt(1 + 8 * XP / 100)) / 2)

    // Using simple linear for now for easy testing: 100 XP per level? No, clearly user wants "Premium" feel.
    // Let's stick to valid formula: Level = floor(sqrt(XP)/10) + 1?
    // Let's use: level = Math.floor(xp.value / 100) + 1 strictly for MVP, but user wants "Global XP Bar".

    // Better formula for engagement: Level = Math.floor(0.1 * Math.sqrt(xp.value)) + 1 is too slow.
    // Let's go with: Level N threshold = 100 * N * N? No.
    // Let's go with: Constant growth. 50 XP per level increment?
    // Let's use: Threshold for Level L = 100 * (L-1) + 50 * (L-1)^2 ?

    // Simple Gamification:
    // Level 1 -> 2: 100 XP
    // Level 2 -> 3: 150 XP
    // Level 3 -> 4: 225 XP (1.5x)

    // Current Logic:
    // Just store XP.
    // Derived Level:
    let lvl = 1
    let threshold = 100
    let currentXp = xp.value

    while (currentXp >= threshold) {
      currentXp -= threshold
      lvl++
      threshold = Math.floor(threshold * 1.2) // 20% harder each level
    }

    level.value = lvl
    xpToNextLevel.value = threshold
  }

  // Update profile (username & avatar)
  const updateProfile = async (newUsername: string, newColor: string, newImage: string) => {
    if (!auth.user) return

    const combinedAvatar = `${newColor}|${newImage}`

    const { error } = await supabase.from('profiles').upsert({
      id: auth.user.id,
      username: newUsername,
      avatar_url: combinedAvatar,
      updated_at: new Date(),
    })

    if (error) throw error

    username.value = newUsername
    avatarColor.value = newColor
    avatarImage.value = newImage
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
      xp: xp.value,
      daily_activity: dailyActivity.value,
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

  const recordAnswer = async (isCorrect: boolean, multiplier: number = 1) => {
    totalQuestions.value++

    if (!isCorrect) {
      await saveProgress()
      return
    }

    score.value++

    // Add XP: (10 XP + streak bonus) * multiplier
    const baseXp = 10 + Math.min(streak.value, 10)
    const xpGain = Math.round(baseXp * multiplier)
    xp.value += xpGain
    calculateLevel()

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

    // Record Daily Activity (local fallback if needed)
    const dateKey = now.toISOString().split('T')[0] as string
    if (!dailyActivity.value[dateKey]) {
      dailyActivity.value[dateKey] = 0
    }
    dailyActivity.value[dateKey]++

    await saveProgress()
  }

  const resetProgress = (shouldSave = true) => {
    score.value = 0
    totalQuestions.value = 0
    streak.value = 0
    bestCombo.value = 0
    currentCombo.value = 0
    masteredItems.value = []
    lastStudiedAt.value = null
    xp.value = 0
    level.value = 1
    dailyActivity.value = {}
    masteredItems.value = []
    if (shouldSave) saveProgress()
  }

  // Sync on login
  watch(
    () => auth.user,
    (newUser) => {
      if (newUser) {
        resetProgress(false)
        loadProgress()
      } else {
        resetProgress()
        username.value = ''
        avatarColor.value = 'gold'
        avatarImage.value = 'default'
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
    avatarImage,
    lastStudiedAt,
    loading,
    recordAnswer,
    updateBestCombo,
    resetProgress,
    loadProgress,
    updateProfile,
    markAsMastered,
    toggleMastery,
    xp,
    level,
    xpToNextLevel,
    dailyActivity,
  }
})
