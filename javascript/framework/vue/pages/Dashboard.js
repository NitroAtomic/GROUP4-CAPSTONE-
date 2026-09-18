// javascript/framework/vue/pages/Dashboard.js
import { useAuthStore } from '../stores/auth.js'

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
        
        // Load dashboard data from backend
        const response = await fetch('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('A Premium subscription is required to view the dashboard.')
          }
          throw new Error('Failed to load dashboard data.')
        }

        const data = await response.json()
        
        // Set user data
        this.firstName = authStore.user?.firstName || 'User'
        this.planLabel = authStore.user?.subscriptionType || 'Free'
        this.accountStatusLabel = authStore.user?.subscriptionStatus || 'inactive'

        // Calculate completed modules
        this.completedModulesCount = data.progress?.filter(p => p.completion_status === 'completed').length || 0
        this.totalModulesCount = 6 // Total free modules

        // Calculate average quiz score
        const quizHistory = data.quiz_history || []
        if (quizHistory.length > 0) {
          const totalScore = quizHistory.reduce((sum, q) => sum + (q.score / q.total) * 100, 0)
          this.averageQuizScoreLabel = Math.round(totalScore / quizHistory.length) + '%'
        }

        // Set weak areas from assessment
        if (data.assessment?.weak_areas) {
          this.weakAreas = data.assessment.weak_areas.map(area => ({
            topic: area.charAt(0).toUpperCase() + area.slice(1),
            scoreLabel: 'Needs improvement'
          }))
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
        const response = await fetch('/api/dashboard/recommendations', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })

        if (response.ok) {
          this.recommendations = await response.json()
        }
      } catch (error) {
        console.error('Failed to load recommendations:', error)
      }
    },

    recommendationTag(module) {
      return 'router-link'
    },

    recommendationBind(module) {
      return {
        to: `/modules/${module.slug}`
      }
    },

    recommendationKind(module) {
      return module.category || 'Free module'
    }
  }
}
