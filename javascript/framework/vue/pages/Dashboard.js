import { useAuthStore } from '../stores/auth.js'
import { apiFetch } from '../lib/api.js'

const FREE_MODULE_ROUTES = {
  phishing: '/modules/quishing',
  quishing: '/modules/quishing',
  'spear-phishing': '/modules/spear-phishing',
  smishing: '/modules/smishing',
  vishing: '/modules/vishing',
  pretexting: '/modules/pretexting',
  'safety-practices': '/modules/essential-safe-practices-remote-environments'
}

function parseJsonField(value) {
  if (value == null || value === '') return null
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function formatTopicLabel(topic) {
  return String(topic)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default {
  name: 'Dashboard',

  data() {
    return {
      isLoading: true,
      errorMessage: '',
      progress: [],
      quizHistory: [],
      assessment: null,
      recommendations: [],
      availableModules: []
    }
  },

  computed: {
    authStore() {
      return useAuthStore()
    },

    firstName() {
      return this.authStore.firstName || 'User'
    },

    planLabel() {
      return this.authStore.isPremium ? 'Premium' : 'Free'
    },

    accountStatusLabel() {
      const status = this.authStore.user && this.authStore.user.subscription_status
      if (!status) return this.authStore.isPremium ? 'Active' : 'Free'
      return String(status).replace(/_/g, ' ')
    },

    completedModulesCount() {
      return this.progress.filter((row) => String(row.completion_status).toLowerCase() === 'completed').length
    },

    totalModulesCount() {
      if (this.availableModules.length) return this.availableModules.length
      return this.progress.length || 0
    },

    averageQuizScore() {
      if (!this.quizHistory.length) return null
      const percentages = this.quizHistory.map((row) => this.quizPercentage(row)).filter((value) => value != null)
      if (!percentages.length) return null
      return Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length)
    },

    averageQuizScoreLabel() {
      return this.averageQuizScore == null ? '—' : `${this.averageQuizScore}%`
    },

    weakAreas() {
      const assessment = this.assessment
      if (!assessment) return []

      const byTopic = parseJsonField(assessment.by_topic) || {}
      const rawWeakAreas = parseJsonField(assessment.weak_areas)

      if (Array.isArray(rawWeakAreas) && rawWeakAreas.length) {
        return rawWeakAreas.map((item) => {
          if (item && typeof item === 'object') {
            const topic = item.topic || item.name || item.category || 'Topic'
            const score = item.score ?? item.percentage ?? byTopic[topic]
            return {
              topic: formatTopicLabel(topic),
              scoreLabel: score == null ? 'Needs review' : `${Math.round(Number(score))}% score`
            }
          }
          const score = byTopic[item]
          return {
            topic: formatTopicLabel(item),
            scoreLabel: score == null ? 'Needs review' : `${Math.round(Number(score))}% score`
          }
        })
      }

      return Object.entries(byTopic)
        .filter(([, score]) => Number(score) < 70)
        .map(([topic, score]) => ({
          topic: formatTopicLabel(topic),
          scoreLabel: `${Math.round(Number(score))}% score`
        }))
    },

    quizHistoryRows() {
      return this.quizHistory.map((row) => {
        const percentage = this.quizPercentage(row)
        return {
          slug: row.slug,
          title: `${row.module_title} quiz`,
          percentageLabel: percentage == null ? '—' : `${percentage}%`,
          isLowScore: percentage != null && percentage < 70
        }
      })
    }
  },

  created() {
    this.loadDashboard()
  },

  methods: {
    quizPercentage(row) {
      const total = Number(row.total)
      const score = Number(row.score)
      if (!total || Number.isNaN(score)) return null
      return Math.round((score / total) * 100)
    },

    recommendationPath(module) {
      return FREE_MODULE_ROUTES[module.slug] || null
    },

    recommendationTag(module) {
      return this.recommendationPath(module) ? 'router-link' : 'article'
    },

    recommendationBind(module) {
      const path = this.recommendationPath(module)
      return path ? { to: path } : {}
    },

    recommendationKind(module) {
      if (module.category === 'role-based' || module.module_type === 'Premium') {
        return 'Role-based module'
      }
      return 'Foundational module'
    },

    async loadDashboard() {
      this.errorMessage = ''
      this.isLoading = true
      const token = this.authStore.token

      try {
        const [dashboard, recommendations, modules] = await Promise.all([
          apiFetch('/api/dashboard', { token }),
          apiFetch('/api/dashboard/recommendations', { token }),
          apiFetch('/api/modules', { token })
        ])

        this.progress = dashboard.progress || []
        this.quizHistory = dashboard.quiz_history || []
        this.assessment = dashboard.assessment || null
        this.recommendations = Array.isArray(recommendations) ? recommendations : []
        this.availableModules = Array.isArray(modules) ? modules : []
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    }
  }
}
