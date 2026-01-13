import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/charts',
      name: 'charts',
      component: () => import('../views/study/KanaChartView.vue'),
    },
    {
      path: '/study',
      name: 'study',
      component: () => import('../views/study/StudyView.vue'),
    },
    {
      path: '/training',
      name: 'training',
      component: () => import('../views/training/TrainingHubView.vue'),
    },
    {
      path: '/training/quiz',
      name: 'quiz',
      component: () => import('../views/training/QuizView.vue'),
    },
    {
      path: '/training/construction',
      name: 'construction',
      component: () => import('../views/training/SentenceBuilderView.vue'),
    },
    {
      path: '/kanji',
      name: 'kanji',
      component: () => import('../views/study/KanjiGridView.vue'),
    },

    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/auth/AuthView.vue'),
    },
    {
      path: '/legal',
      name: 'legal',
      component: () => import('../views/legal/LegalView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/user/UserProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/update-password',
      name: 'update-password',
      component: () => import('../views/auth/UpdatePasswordView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/grammar',
      name: 'grammar',
      component: () => import('../views/grammar/GrammarView.vue'),
    },
    {
      path: '/grammar/:id',
      name: 'grammar-detail',
      component: () => import('../views/grammar/GrammarDetailView.vue'),
    },
    {
      path: '/vocabulary',
      name: 'vocabulary',
      component: () => import('../views/study/VocabularyView.vue'),
    },
  ],
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // Wait for session initialization
  await auth.initialized

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !auth.user) {
    next('/auth')
  } else if (to.path === '/auth' && auth.user) {
    next('/')
  } else {
    next()
  }
})

export default router
