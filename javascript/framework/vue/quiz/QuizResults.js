import { useAuthStore } from '../stores/auth.js'
import { apiFetch } from '../lib/api.js'

/* Wala nang tanungan na iniimport dito.

   Dati naka-import lahat ng siyam para mabuo ang review -- kasama ang
   apat na bayad, kaya napupunta sila sa pampublikong bundle na may mga
   sagot. Hindi naman pala kailangan: lahat ng kailangan ng review
   (tanong, piniling sagot, tamang sagot, paliwanag) ay nakatago na ng
   QuizQuestion sa resulta bago pa dumating dito. */

const MODULE_PATHS = {
  'module-1': '/modules/quishing',
  'module-2': '/modules/spear-phishing',
  'module-3': '/modules/smishing',
  'module-4': '/modules/vishing',
  'module-5': '/modules/pretexting',
  'client-impersonation': '/modules/premium/client-impersonation',
  'client-data': '/modules/premium/client-data',
  'fake-recruiters': '/modules/premium/fake-recruiters',
  'invoice-scams': '/modules/premium/invoice-scams'
}

const NEXT_MODULE = {
  'module-1': { path: '/modules/spear-phishing', label: 'Continue to Spear Phishing' },
  'module-2': { path: '/modules/smishing', label: 'Continue to Smishing' },
  'module-3': { path: '/modules/vishing', label: 'Continue to Vishing' },
  'module-4': { path: '/modules/pretexting', label: 'Continue to Pretexting' },
  'module-5': {
    path: '/modules/essential-safe-practices-remote-environments',
    label: 'Continue to Safe Practices'
  }
}

// Frontend quiz ids → the module.slug values seeded in the database
// (backend-node/sql/03-seed.sql). /api/quizzes/record-attempt resolves the
// quiz by slug, so sending 'module-1' would 404.
//
// Yung seed ay slug 'quishing' na ang category ay 'phishing' — hindi
// 'phishing' ang slug, gaya ng mali kong nasulat dito dati. Tama yung
// mapa sa ibaba; yung komento ang mali, at paanyaya yun para may
// "magtama" ng linyang tama naman.
const RECORD_ATTEMPT_SLUGS = {
  // Yung module-1 ay Quishing, hindi 'phishing'. Dati magkaiba yung slug dito
  // at yung nasa database, kaya hindi kailanman mairekomenda yung Quishing
  // module kahit mahina dun yung user.
  'module-1': 'quishing',
  'module-2': 'spear-phishing',
  'module-3': 'smishing',
  'module-4': 'vishing',
  'module-5': 'pretexting',
  'client-impersonation': 'client-impersonation',
  'client-data': 'client-data',
  'fake-recruiters': 'fake-recruiters',
  'invoice-scams': 'invoice-scams'
}

export default {
  name: 'QuizResults',

  data() {
    return {
      results: null
    }
  },

  computed: {
    moduleId() {
      return this.$route.params.moduleId
    },

    modulePath() {
      return MODULE_PATHS[this.moduleId] || '/'
    },

    nextModule() {
      return NEXT_MODULE[this.moduleId] || null
    },

    breakdown() {
      const empty = { correct: 0, total: 0 }
      const stored = (this.results && this.results.breakdown) || {}
      return {
        standard: stored.standard || empty,
        'scenario-based': stored['scenario-based'] || empty,
        simulation: stored.simulation || empty
      }
    },

    reviewItems() {
      if (!this.results) return []
      const storedReview = Array.isArray(this.results.review) ? this.results.review : []

      return storedReview.map((stored) => {
        return {
          id: stored.id,
          questionText: stored.questionText || '',
          questionType: stored.questionType || 'standard',
          selectedAnswerText: stored.selectedAnswerText || '',
          correctAnswerText: stored.correctAnswerText || '',
          explanation: stored.explanation || '',
          isCorrect: Boolean(stored.isCorrect),
          attemptRecorded: stored.attemptRecorded !== false && Boolean(stored.selectedAnswerText)
        }
      })
    }
  },

  async created() {
    this.loadResults()
    await this.recordAttempt()
  },

  methods: {
    optionLabel(question, value) {
      const option = (question.options || []).find((item) => String(item.value) === String(value))
      if (!option) return String(value).toUpperCase()
      return option.text
    },

    formatAnswer(question, answer) {
      if (answer == null || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
        return 'No answer'
      }
      const values = Array.isArray(answer) ? answer : [answer]
      return values.map((value) => this.optionLabel(question, value)).join('; ')
    },

    loadResults() {
      const raw = sessionStorage.getItem(`quiz-results-${this.moduleId}`)
      this.results = raw ? JSON.parse(raw) : null
    },

    async recordAttempt() {
      if (!this.results || this.results.attemptRecorded) return

      const authStore = useAuthStore()
      if (!authStore.token) return

      try {
        // apiFetch throws on any non-2xx, so attemptRecorded is only set
        // after a real success — a failed response stays retryable.
        await apiFetch('/api/quizzes/record-attempt', {
          method: 'POST',
          token: authStore.token,
          body: {
            slug: RECORD_ATTEMPT_SLUGS[this.moduleId] || this.moduleId,
            score: this.results.score,
            total: this.results.totalPoints
          }
        })
        this.results.attemptRecorded = true
        sessionStorage.setItem(`quiz-results-${this.moduleId}`, JSON.stringify(this.results))
      } catch (error) {
        console.error('Failed to record quiz attempt:', error)
      }
    },

    retakeQuiz() {
      sessionStorage.removeItem(`quiz-results-${this.moduleId}`)
      this.$router.push(`/quiz/${this.moduleId}/question`)
    }
  },

  watch: {
    moduleId() {
      this.loadResults()
    }
  }
}
