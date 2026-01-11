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
      component: () => import('../views/KanaChartView.vue'),
    },
    {
      path: '/study',
      name: 'study',
      component: () => import('../views/StudyView.vue'),
    },
    {
      path: '/training',
      name: 'training',
      component: () => import('../views/TrainingHubView.vue'),
    },
    {
      path: '/training/quiz',
      name: 'quiz',
      component: () => import('../views/QuizView.vue'),
    },
    {
      path: '/training/construction',
      name: 'construction',
      component: () => import('../views/SentenceBuilderView.vue'),
    },
    {
      path: '/kanji',
      name: 'kanji',
      component: () => import('../views/KanjiGridView.vue'),
    },

    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
    },
    {
      path: '/legal',
      name: 'legal',
      component: () => import('../views/LegalView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/UserProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/update-password',
      name: 'update-password',
      component: () => import('../views/UpdatePasswordView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/grammar',
      name: 'grammar',
      component: () => import('../views/GrammarView.vue'),
    },
    {
      path: '/grammar/:id',
      name: 'grammar-detail',
      component: () => import('../views/GrammarDetailView.vue'),
    },
    {
      path: '/vocabulary',
      name: 'vocabulary',
      component: () => import('../views/VocabularyView.vue'),
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
