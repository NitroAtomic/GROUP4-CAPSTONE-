// javascript/framework/vue/pages/Dashboard.js
import { useAuthStore } from '../stores/auth.js'
import { apiFetch } from '../lib/api.js'

// Backend module slugs (backend-node/sql/03-seed.sql) → the actual frontend
// route for each module. Two of them differ from the slug (the Phishing page
// is the Quishing component; Safety Practices uses a longer route name), and
// Premium modules live under /modules/premium/, so a bare /modules/:slug
// cannot be assumed to exist.
const MODULE_ROUTE_BY_SLUG = {
  'phishing': '/modules/quishing',
  'spear-phishing': '/modules/spear-phishing',
  'smishing': '/modules/smishing',
  'vishing': '/modules/vishing',
  'pretexting': '/modules/pretexting',
  'safety-practices': '/modules/essential-safe-practices-remote-environments',
  'client-impersonation': '/modules/premium/client-impersonation',
  'client-data': '/modules/premium/client-data',
  'fake-recruiters': '/modules/premium/fake-recruiters',
  'invoice-scams': '/modules/premium/invoice-scams'
}

export default {
  name: 'Dashboard',

  data() {
    return {
      isLoading: true,
      errorMessage: '',
      firstName: '',
      planLabel: '',
      accountStatusLabel: '',
      completedModulesCount: 0,
      totalModulesCount: 0,
      averageQuizScoreLabel: '0%',
      weakAreas: [],
      // Walang assessment pa: guhit muna imbis na "0", kasi ibang ibig sabihin
      // ng zero weak areas kaysa sa hindi pa sumasagot ng assessment.
      hasAssessment: false,
      recommendations: [],
      quizHistoryRows: []
    }
  },

  async mounted() {
    await this.loadDashboardData()
  },

  methods: {
    async loadDashboardData() {
      this.isLoading = true
      this.errorMessage = ''

      try {
        const authStore = useAuthStore()

        // Load dashboard data from backend (apiFetch already throws on
        // non-2xx with the backend's own error message)
        const data = await apiFetch('/api/dashboard', { token: authStore.token })
        
        // Set user data
        this.firstName = authStore.user?.first_name || 'User'
        this.planLabel = authStore.user?.subscription_type || 'Free'
        this.accountStatusLabel = authStore.user?.subscription_status || 'inactive'

        // Calculate completed modules
        this.completedModulesCount = data.progress?.filter(p => p.completion_status === 'completed').length || 0
        this.totalModulesCount = 6 // Total free modules

        // Calculate average quiz score
        const quizHistory = data.quiz_history || []
        if (quizHistory.length > 0) {
          const totalScore = quizHistory.reduce((sum, q) => sum + (q.score / q.total) * 100, 0)
          this.averageQuizScoreLabel = Math.round(totalScore / quizHistory.length) + '%'
        }

        // Set weak areas from assessment — weak_areas is a JSON array of
        // topic slugs (['spear-phishing', ...]); the matching module category
        // lives in the module table. Older stored results may be objects
        // ({topic, percentage}) — tolerate both, then title-case for display.
        this.hasAssessment = Boolean(data.assessment)
        if (data.assessment?.weak_areas) {
          this.weakAreas = data.assessment.weak_areas.map(area => {
            const slug = typeof area === 'string' ? area : area && area.topic
            return {
              topic: String(slug || '')
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
              scoreLabel: 'Needs improvement'
            }
          })
        }

        // Set quiz history rows
        this.quizHistoryRows = quizHistory.map(q => ({
          slug: q.slug,
          title: q.module_title,
          percentageLabel: Math.round((q.score / q.total) * 100) + '%',
          isLowScore: (q.score / q.total) < 0.7
        }))

        // Load recommendations
        await this.loadRecommendations()

      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },

    async loadRecommendations() {
      try {
        const authStore = useAuthStore()
        this.recommendations = await apiFetch('/api/dashboard/recommendations', {
          token: authStore.token
        })
      } catch (error) {
        console.error('Failed to load recommendations:', error)
      }
    },

    recommendationTag(module) {
      return 'router-link'
    },

    recommendationBind(module) {
      return {
        to: MODULE_ROUTE_BY_SLUG[module.slug] || `/modules/${module.slug}`
      }
    },

    recommendationKind(module) {
      return module.category || 'Free module'
    }
  }
}
