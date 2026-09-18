import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth.js'

// Import page components
import Home from './pages/Home.vue'
import About from './pages/About.vue'
import Login from './pages/Login.vue'
import ForgotPassword from './pages/ForgotPassword.vue'
import ForgotPasswordConfirmation from './pages/ForgotPasswordConfirmation.vue'
import PremiumSubscription from './pages/PremiumSubscription.vue'
import CreateAccount from './pages/CreateAccount.vue'
import Payment from './pages/Payment.vue'
import Dashboard from './pages/Dashboard.vue'

// Import module components
import Quishing from './modules/Quishing.vue'
import SpearPhishing from './modules/SpearPhishing.vue'
import Smishing from './modules/Smishing.vue'
import Vishing from './modules/Vishing.vue'
import Pretexting from './modules/Pretexting.vue'
import EssentialSafePracticesRemoteEnv from './modules/EssentialSafePracticesRemoteEnv.vue'

// Import quiz components
import QuizQuestion from './quiz/QuizQuestion.vue'
import QuizResults from './quiz/QuizResults.vue'

// Import assessment components
import AwarenessAssessment from './pages/AwarenessAssessment.vue'
import AssessmentResults from './pages/AssessmentResults.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/forgot-password-confirmation',
    name: 'ForgotPasswordConfirmation',
    component: ForgotPasswordConfirmation
  },
  {
    path: '/premium-subscription',
    name: 'PremiumSubscription',
    component: PremiumSubscription
  },
  {
    path: '/create-account',
    name: 'CreateAccount',
    component: CreateAccount,
    meta: { minimalNav: true }
  },
  {
    path: '/payment',
    name: 'Payment',
    component: Payment,
    meta: { minimalNav: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    // FR-12: Dashboard is Premium-only, not just "logged in" — requiresPremium
    // catches a logged-in Free user the same way requiresAuth catches a
    // logged-out visitor. The 4 upcoming /modules/premium/... routes (Phase B)
    // will set the same two meta flags and reuse this same guard below.
    meta: { requiresAuth: true, requiresPremium: true }
  },
  // Module routes
  {
    path: '/modules/quishing',
    name: 'Quishing',
    component: Quishing
  },
  {
    path: '/modules/spear-phishing',
    name: 'SpearPhishing',
    component: SpearPhishing
  },
  {
    path: '/modules/smishing',
    name: 'Smishing',
    component: Smishing
  },
  {
    path: '/modules/vishing',
    name: 'Vishing',
    component: Vishing
  },
  {
    path: '/modules/pretexting',
    name: 'Pretexting',
    component: Pretexting
  },
  {
    path: '/modules/essential-safe-practices-remote-environments',
    name: 'EssentialSafePracticesRemoteEnv',
    component: EssentialSafePracticesRemoteEnv
  },
  // Premium module routes (FR-16 - Role-Based Modules)
  {
    path: '/modules/premium/client-impersonation',
    name: 'ClientImpersonation',
    component: () => import('./modules/premium/ClientImpersonation.vue'),
    meta: { requiresAuth: true, requiresPremium: true }
  },
  {
    path: '/modules/premium/client-data',
    name: 'ClientData',
    component: () => import('./modules/premium/ClientData.vue'),
    meta: { requiresAuth: true, requiresPremium: true }
  },
  {
    path: '/modules/premium/fake-recruiters',
    name: 'FakeRecruiters',
    component: () => import('./modules/premium/FakeRecruiters.vue'),
    meta: { requiresAuth: true, requiresPremium: true }
  },
  {
    path: '/modules/premium/invoice-scams',
    name: 'InvoiceScams',
    component: () => import('./modules/premium/InvoiceScams.vue'),
    meta: { requiresAuth: true, requiresPremium: true }
  },
  // Quiz routes
  {
    path: '/quiz/:moduleId/question',
    name: 'QuizQuestion',
    component: QuizQuestion
  },
  {
    path: '/quiz/:moduleId/results',
    name: 'QuizResults',
    component: QuizResults
  },
  // Assessment routes (FR-11 - Awareness Assessment)
  {
    path: '/assessment/question',
    name: 'AwarenessAssessment',
    component: AwarenessAssessment,
    meta: { requiresAuth: true, requiresPremium: true }
  },
  {
    path: '/assessment/results',
    name: 'AssessmentResults',
    component: AssessmentResults,
    meta: { requiresAuth: true, requiresPremium: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  // Logged in, but not Premium — send to the sign-up funnel, not Login,
  // since the person already has an account.
  if (to.meta.requiresPremium && !authStore.isPremium) {
    return { name: 'PremiumSubscription' }
  }

  return true
})

export default router
