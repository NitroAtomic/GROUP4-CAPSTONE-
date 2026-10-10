// javascript/framework/vue/pages/Dashboard.js
import { useAuthStore } from '../stores/auth.js'
import { apiFetch } from '../lib/api.js'

// Backend module slugs (backend-node/sql/03-seed.sql) → the actual frontend
// route for each module. Two of them differ from the slug (the Phishing page
// is the Quishing component; Safety Practices uses a longer route name), and
// Premium modules live under /modules/premium/, so a bare /modules/:slug
// cannot be assumed to exist.
/* Saan papunta ang taong mahina sa isang paksa.

   Kapareho ng mga katumbas na nasa backend (routes/dashboard.js):
   "phishing" ang itinatala ng assessment, pero "quishing" ang module. */
const TOPIC_MODULE_PATH = {
  'phishing': '/modules/quishing',
  'quishing': '/modules/quishing',
  'spear-phishing': '/modules/spear-phishing',
  'smishing': '/modules/smishing',
  'vishing': '/modules/vishing',
  'pretexting': '/modules/pretexting',
  'safe-practices': '/modules/essential-safe-practices-remote-environments',
  'safety-practices': '/modules/essential-safe-practices-remote-environments'
}

const TOPIC_MODULE_TITLE = {
  'phishing': 'Quishing',
  'quishing': 'Quishing',
  'spear-phishing': 'Spear Phishing',
  'smishing': 'Smishing',
  'vishing': 'Vishing',
  'pretexting': 'Pretexting',
  'safe-practices': 'Essential Safe Practices',
  'safety-practices': 'Essential Safe Practices'
}

const MODULE_ROUTE_BY_SLUG = {
  // Slug ang ipinapadala ng API, hindi category. Dati 'phishing' at
  // 'safety-practices' ang nakasulat dito -- category at maling baybay --
  // kaya hindi sila tumatama kahit kailan.
  'quishing': '/modules/quishing',
  'spear-phishing': '/modules/spear-phishing',
  'smishing': '/modules/smishing',
  'vishing': '/modules/vishing',
  'pretexting': '/modules/pretexting',
  'essential-safe-practices-remote-environments': '/modules/essential-safe-practices-remote-environments',
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
      hasAssessment: false,
      // Resulta ng assessment: iskor, antas, at petsa. Ipinapadala na ito ng
      // backend, hindi lang naipapakita, kaya parang hindi nare-record ang
      // ginawang exam.
      assessment: null,
      weakAreas: [],
      recommendations: [],
      quizHistoryRows: []
    }
  },

  async mounted() {
    await this.loadDashboardData()
  },

  computed: {
    /* Yung assessment ay Premium. Dati, laging nakaturo sa
       /assessment/question yung button dito kahit sino yung nakatingin --
       at tahimik lang na ibinabalik ng guard sa pricing page yung Free
       user. Pinindot niya ang "Take assessment", presyo ang nakita niya,
       walang paliwanag.

       Ganito na rin yung ginagawa sa Home.vue: naka-lock yung card kapag
       hindi pa Premium. Dito, imbes na patay na padlock, sinasabi na lang
       kung saan papunta. */
    canTakeAssessment() {
      return useAuthStore().isPremium
    },

    assessmentPath() {
      return this.canTakeAssessment ? '/assessment/question' : '/premium-subscription'
    },

    assessmentLinkLabel() {
      if (!this.canTakeAssessment) return 'Unlock with Premium'
      return this.hasAssessment ? 'Retake assessment' : 'Take assessment'
    },

    assessmentScoreLabel() {
      if (!this.assessment) return ''
      const { score, total } = this.assessment
      return `${score}/${total}`
    },

    assessmentDateLabel() {
      if (!this.assessment || !this.assessment.assessment_date) return ''
      return new Date(this.assessment.assessment_date).toLocaleDateString()
    }
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
        this.hasAssessment = Boolean(data.assessment)
        this.assessment = data.assessment || null

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
        if (this.hasAssessment && data.assessment?.weak_areas) {
          /* Dati "Needs improvement" lang ang nakasulat sa bawat isa --
             alam mo na mahina ka, pero hindi kung gaano, at hindi kung
             ano ang gagawin. Nandiyan naman na ang bilang (by_topic) at
             may module para sa bawat paksa; hindi lang ginagamit. */
          const byTopic = data.assessment.by_topic || {}

          this.weakAreas = data.assessment.weak_areas.map(area => {
            const slug = String((typeof area === 'string' ? area : area && area.topic) || '')
            const tally = byTopic[slug]
            const hasTally = tally && Number(tally.total) > 0
            const percent = hasTally
              ? Math.round((Number(tally.correct) / Number(tally.total)) * 100)
              : null

            return {
              slug,
              topic: slug
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
              // Yung aktwal na nangyari, hindi yung panlahatang label.
              scoreLabel: hasTally
                ? `${tally.correct} of ${tally.total} correct`
                : 'Needs improvement',
              percent,
              modulePath: TOPIC_MODULE_PATH[slug] || null,
              moduleTitle: TOPIC_MODULE_TITLE[slug] || null
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

    /* Yung paglalarawan, hindi yung category.

       Dati `module.category || 'Free module'` ito, kaya panloob na susi
       yung lumalabas sa ilalim ng pamagat: "spear-phishing" sa ilalim ng
       "Spear Phishing", "quishing" sa ilalim ng "Quishing". Inuulit lang
       nito yung pamagat sa anyong pang-database, at mukhang hindi tapos.

       Kapag walang paglalarawan, mas mabuting wala kaysa may susing
       lumalabas. */
    recommendationKind(module) {
      return module.description || ''
    }
  }
}
