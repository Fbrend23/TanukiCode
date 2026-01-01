import { createRouter, createWebHistory } from 'vue-router'

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
      path: '/quiz',
      name: 'quiz',
      component: () => import('../views/QuizView.vue'),
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
    },
    {
      path: '/update-password',
      name: 'update-password',
      component: () => import('../views/UpdatePasswordView.vue'),
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

export default router
