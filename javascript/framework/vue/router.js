import { createRouter, createWebHistory } from 'vue-router'
import examLock from './lib/examLock.js'
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
import PaymentConfirm from './pages/PaymentConfirm.vue'
import Dashboard from './pages/Dashboard.vue'
import Admin from './pages/Admin.vue'

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
    meta: { minimalNav: true, requiresAuth: true }
  },
  {
    // Dito ibinabalik ng PayMongo yung user. requiresAuth ito kasi ang
    // pagkumpirma ay nakatali sa account — hindi pwedeng i-confirm ng
    // isang tao yung bayad ng iba kahit alam pa niya yung reference.
    path: '/payment/confirm',
    name: 'PaymentConfirm',
    component: PaymentConfirm,
    meta: { minimalNav: true, requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, adminOnly: true }
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
    // Listahan ng apat na role-based courses. Dati walang ganito, kaya walang
    // paraan para marating sila maliban sa pag-type ng URL.
    path: '/modules/premium',
    name: 'PremiumModules',
    component: () => import('./pages/PremiumModules.vue'),
    meta: { requiresAuth: true, requiresPremium: true }
  },
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

// Quiz routes take a dynamic :moduleId, so the premium check can't live in
// static route meta — these are the frontend quiz ids whose question banks
// (and Premium entitlement) belong to the four Premium modules.
const PREMIUM_QUIZ_MODULE_IDS = new Set([
  'client-impersonation',
  'client-data',
  'fake-recruiters',
  'invoice-scams'
])

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Babala bago umalis sa gitna ng quiz o assessment. Dati, sapat na ang
// pag-click sa Dashboard o Home para mawala lahat ng nasagutan na.
const isTestRoute = (path) =>
  /^\/quiz\/[^/]+\/question/.test(path) || path.startsWith('/assessment/question')

router.beforeEach((to, from) => {
  if (isTestRoute(from.path) && !isTestRoute(to.path) && examLock.isActive()) {
    if (!to.path.includes('/results')) {
      const leave = window.confirm(
        'Your progress will be lost. Do you want to continue exiting the test?'
      )
      if (!leave) return false
      examLock.stop()
    }
  }

  const authStore = useAuthStore()

  const isPremiumQuizRoute =
    to.path.startsWith('/quiz/') && PREMIUM_QUIZ_MODULE_IDS.has(String(to.params.moduleId))
  const requiresAuth = to.meta.requiresAuth || isPremiumQuizRoute
  const requiresPremium = to.meta.requiresPremium || isPremiumQuizRoute

  if (requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  if (to.meta.adminOnly && authStore.user?.role !== 'admin') {
    return { name: 'Home' }
  }

  // Logged in, but not Premium — send to the sign-up funnel, not Login,
  // since the person already has an account.
  if (requiresPremium && !authStore.isPremium) {
    return { name: 'PremiumSubscription' }
  }

  return true
})

export default router
