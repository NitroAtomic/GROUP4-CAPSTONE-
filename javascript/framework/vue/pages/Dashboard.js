// javascript/framework/vue/pages/Dashboard.js
import { useAuthStore } from '../stores/auth.js'
import { apiFetch } from '../lib/api.js'

// Public course metadata only. Premium lessons still come from protected APIs.
const ICONS = {
  qr: 'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h3v3h-3zM21 15v6h-6M12 3v3M3 12h6M12 9v6',
  'target-mail': 'M3 6h18v13H3zM3 6l9 7 9-7M15 3h6v6',
  'mobile-message': 'M6 2h12v20H6zM10 18h4M9 6h6v7H9z',
  phone: 'M6 3l3 4-2 3c2 3 4 5 7 6l3-2 4 3c-1 3-3 5-6 4C8 19 3 14 2 7c0-2 2-4 4-4z',
  identity: 'M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM3 21v-3a7 7 0 0 1 9-7M17 12l4 2v4l-4 3-4-3v-4z',
  'shield-check': 'M12 2l8 4v6c0 5-8 10-8 10S4 17 4 12V6zM8 12l3 3 5-6',
  invoice: 'M5 2h10l4 4v16H5zM15 2v5h4M8 11h8M8 15h8M8 19h5',
  recruiter: 'M14 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM4 21v-3a7 7 0 0 1 14 0v3M17 4a3 3 0 0 1 0 6M18 13a5 5 0 0 1 4 5v3',
  'data-lock': 'M5 2h10l4 4v16H5zM15 2v5h4M9 13h6v6H9zM10 13v-2a2 2 0 0 1 4 0v2',
}

const COURSES = [
  {
    slug: 'quishing',
    title: 'Phishing',
    summary: 'Email scams, fake login pages and QR code phishing.',
    icon: 'qr',
    path: '/modules/phishing',
  },
  {
    slug: 'spear-phishing',
    title: 'Spear Phishing',
    summary: 'Targeted attacks using real details about you or your work.',
    icon: 'target-mail',
  },
  {
    slug: 'smishing',
    title: 'Smishing',
    summary: 'Scam text messages and mobile messaging attacks.',
    icon: 'mobile-message',
  },
  {
    slug: 'vishing',
    title: 'Vishing',
    summary: 'Voice phishing and social engineering calls.',
    icon: 'phone',
  },
  {
    slug: 'pretexting',
    title: 'Pretexting',
    summary: 'Trust-building manipulation and invented identities.',
    icon: 'identity',
  },
  {
    slug: 'essential-safe-practices-remote-environments',
    title: 'Essential Safe Practices for Remote Environments',
    summary: 'Everyday security habits for remote and hybrid work.',
    icon: 'shield-check',
  },
  {
    slug: 'client-impersonation',
    title: 'Client Impersonation',
    summary: 'Fake clients, portfolio scams and escrow fraud aimed at freelancers.',
    icon: 'identity',
    premium: true,
  },
  {
    slug: 'invoice-scams',
    title: 'Invoice and Payment Scams',
    summary: 'Business email compromise, invoice manipulation and vendor account changes.',
    icon: 'invoice',
    premium: true,
  },
  {
    slug: 'fake-recruiters',
    title: 'Fake Job and Recruiter Offers',
    summary: 'Recruitment and onboarding scams that harvest identity documents.',
    icon: 'recruiter',
    premium: true,
  },
  {
    slug: 'client-data',
    title: 'Secure Client Data Handling',
    summary: 'Protecting client data, passwords and files from exposure.',
    icon: 'data-lock',
    premium: true,
  },
].map(course => ({
  ...course,
  iconPath: ICONS[course.icon],
  path: course.path || `/modules/${course.premium ? 'premium/' : ''}${course.slug}`,
}))

const TOPIC_SLUGS = {
  phishing: 'quishing',
  quishing: 'quishing',
  'safe-practices': 'essential-safe-practices-remote-environments',
  'safety-practices': 'essential-safe-practices-remote-environments',
}

function courseFor(slug) {
  return COURSES.find(course => course.slug === (TOPIC_SLUGS[slug] || slug))
}

function percent(score, total) {
  const numerator = Number(score)
  const denominator = Number(total)

  return score != null &&
    Number.isFinite(numerator) &&
    Number.isFinite(denominator) &&
    denominator > 0
    ? Math.max(0, Math.min(100, Math.round(numerator / denominator * 100)))
    : null
}

function formatDate(value) {
  if (!value) return ''

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
}

function titleCase(value) {
  return String(value)
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default {
  name: 'Dashboard',

  setup() {
    return { authStore: useAuthStore() }
  },

  data() {
    return {
      isLoading: true,
      errorMessage: '',
      assessment: null,
      progress: [],
      visibleModules: [],
      recommendations: [],
      quizHistoryRows: [],
      weakAreas: [],
      topicResults: [],
      cancelBusy: false,
      cancelError: '',
      subscriptionMessage: '',
      refreshWarning: '',
    }
  },

  computed: {
    firstName() {
      return this.authStore.user?.first_name || 'there'
    },

    isAdmin() {
      return this.authStore.user?.role === 'admin'
    },

    canTakeAssessment() {
      return this.authStore.isPremium
    },

    planLabel() {
      return this.isAdmin
        ? 'Administrator access'
        : `${this.canTakeAssessment ? 'Premium' : 'Free'} plan`
    },

    expiryDateLabel() {
      return formatDate(this.authStore.user?.subscription_expires_at)
    },

    canCancelSubscription() {
      return !this.isAdmin &&
        this.authStore.isPremium &&
        this.authStore.user?.subscription_status === 'active'
    },

    /* Naka-cancel pero bayad pa: Premium pa rin hanggang sa petsa, at
       puwede pang bawiin ang cancel. */
    isCancelledButActive() {
      return !this.isAdmin &&
        this.authStore.isPremium &&
        this.authStore.user?.subscription_status === 'cancelled'
    },

    /* Lumang demo account na walang petsa: wala itong binayarang panahon,
       kaya agad na Free kapag na-cancel. Iba ang babala para sa kanila. */
    cancelEndsNow() {
      return !this.authStore.user?.subscription_expires_at
    },

    hasAssessment() {
      return Boolean(this.assessment)
    },

    assessmentPath() {
      return this.canTakeAssessment
        ? '/assessment/question'
        : '/premium-subscription'
    },

    assessmentLinkLabel() {
      return this.canTakeAssessment
        ? (this.hasAssessment ? 'Retake assessment' : 'Take assessment')
        : 'Unlock with Premium'
    },

    assessmentScoreLabel() {
      return this.hasAssessment
        ? `${this.assessment.score}/${this.assessment.total}`
        : '—'
    },

    assessmentDateLabel() {
      return formatDate(this.assessment?.assessment_date)
    },

    assessmentPercent() {
      return percent(this.assessment?.score, this.assessment?.total)
    },

    awarenessLabel() {
      return this.assessment?.awareness_level || 'Not assessed'
    },

    totalModulesCount() {
      return this.visibleModules.length || (this.canTakeAssessment ? 10 : 6)
    },

    completedModulesCount() {
      const allowed = new Set(
        this.visibleModules.length
          ? this.visibleModules.map(module => TOPIC_SLUGS[module.slug] || module.slug)
          : COURSES
              .filter(course => !course.premium || this.canTakeAssessment)
              .map(course => course.slug)
      )

      return new Set(
        this.progress
          .filter(row =>
            row.completion_status === 'completed' &&
            allowed.has(TOPIC_SLUGS[row.slug] || row.slug)
          )
          .map(row => TOPIC_SLUGS[row.slug] || row.slug)
      ).size
    },

    completionPercent() {
      return percent(this.completedModulesCount, this.totalModulesCount) || 0
    },

    averageQuizScoreLabel() {
      const scores = this.quizHistoryRows.filter(row => row.percentage != null)

      return scores.length
        ? `${Math.round(
            scores.reduce((sum, row) => sum + row.percentage, 0) / scores.length
          )}%`
        : '—'
    },

    premiumCourses() {
      return COURSES.filter(course => course.premium)
    },

    masteredCount() {
      return this.topicResults.filter(area => area.status === 'Mastered').length
    },

    topicSummary() {
      const needs = this.topicResults.filter(area => area.percent === 0).length
      const partly = this.topicResults.filter(area =>
        area.percent > 0 && area.percent < 100
      ).length

      const parts = []

      if (needs) {
        parts.push(`${needs} ${needs === 1 ? 'topic needs' : 'topics need'} work`)
      }

      if (partly) {
        parts.push(`${partly} ${partly === 1 ? 'topic is' : 'topics are'} getting there`)
      }

      if (this.masteredCount) {
        parts.push(
          `${this.masteredCount} ${
            this.masteredCount === 1 ? 'topic mastered' : 'topics mastered'
          }`
        )
      }

      return parts.length
        ? `${parts.join(' · ')}.${
            needs
              ? ' Review the topics marked Needs work first.'
              : ' Keep practising to reinforce your learning.'
          }`
        : 'Your assessment identifies topics to focus on next.'
    },

    awarenessCopy() {
      if (!this.hasAssessment) {
        return 'Answer realistic security scenarios to discover your strengths and the topics that need more practice.'
      }

      if (this.assessmentPercent === 100) {
        return 'You answered every question correctly in this assessment. Keep practising with the modules to reinforce those habits.'
      }

      return 'Use your results to choose what to learn next. Start with a recommendation, then review the topics where you missed questions.'
    },
  },

  mounted() {
    this.loadDashboardData()
  },

  methods: {
    async loadDashboardData() {
      this.isLoading = true
      this.errorMessage = ''
      this.refreshWarning = ''

      try {
        // Never infer purchased billing from the checkout selection.
        try {
          await this.authStore.refreshUser()
        } catch {
          this.refreshWarning =
            'Could not refresh subscription details. Please reload before making subscription changes.'
        }

        const data = await apiFetch('/api/dashboard', {
          token: this.authStore.token,
        })

        this.assessment = data.assessment || null
        this.progress = Array.isArray(data.progress) ? data.progress : []
        this.visibleModules = await this.loadVisibleModules()

        this.weakAreas = Array.isArray(this.assessment?.weak_areas)
          ? this.assessment.weak_areas
          : []

        this.topicResults = this.buildTopicResults()

        const history = Array.isArray(data.quiz_history) ? data.quiz_history : []

        // Preserve the API's history order.
        this.quizHistoryRows = history.map((row, index) => {
          const percentage = percent(row.score, row.total)

          return {
            ...row,
            key: `${row.slug}-${index}`,
            title: row.module_title || courseFor(row.slug)?.title || 'Module quiz',
            percentage,
            percentageLabel:
              percentage == null ? 'Score unavailable' : `${percentage}%`,
            isLowScore: percentage != null && percentage < 70,
            scoreLabel:
              percentage == null ? '' : `${row.score} of ${row.total} correct`,
            modulePath: courseFor(row.slug)?.path || null,
          }
        })

        await this.loadRecommendations()
      } catch (error) {
        this.errorMessage = error.message || 'Could not load your dashboard.'
      } finally {
        this.isLoading = false
      }
    },

    async loadVisibleModules() {
      try {
        const result = await apiFetch('/api/modules', {
          token: this.authStore.token,
        })

        return Array.isArray(result) ? result : []
      } catch (error) {
        console.error('Failed to load module list:', error)
        return []
      }
    },

    async loadRecommendations() {
      this.recommendations = []

      try {
        const result = await apiFetch('/api/dashboard/recommendations', {
          token: this.authStore.token,
        })

        this.recommendations = Array.isArray(result) ? result : []
      } catch (error) {
        console.error('Failed to load recommendations:', error)
      }
    },

    buildTopicResults() {
      const tallies = this.assessment?.by_topic || {}

      const topics = [...new Set([
        ...Object.keys(tallies),
        ...this.weakAreas
          .map(area => typeof area === 'string' ? area : area?.topic)
          .filter(Boolean),
      ])]

      return topics
        .map(slug => {
          const tally = tallies[slug]
          const course = courseFor(slug)
          const value = percent(tally?.correct, tally?.total)

          const mastered =
            value != null && Number(tally.correct) === Number(tally.total)

          const status = mastered
            ? 'Mastered'
            : value === 0
              ? 'Needs work'
              : value == null
                ? 'Needs review'
                : 'Getting there'

          return {
            slug,
            topic: course?.title || titleCase(slug),
            percent: value,
            status,
            statusClass: mastered
              ? 'mastered'
              : value === 0
                ? 'needs-work'
                : value == null
                  ? 'unknown'
                  : 'getting-there',
            scoreLabel: value == null
              ? 'Topic score unavailable'
              : `${tally.correct} of ${tally.total} correct`,
            modulePath: course?.path || null,
            moduleTitle: course?.title || '',
          }
        })
        .sort((a, b) => (a.percent ?? 101) - (b.percent ?? 101))
    },

    recommendationBind(module) {
      const course = courseFor(module.slug)

      return {
        to: course?.premium && !this.canTakeAssessment
          ? '/premium-subscription'
          : course?.path || '/#modules',
      }
    },

    scoreClass(value) {
      return value == null
        ? 'score-unavailable'
        : value >= 90
          ? 'score-strong'
          : value >= 70
            ? 'score-developing'
            : 'score-needs-work'
    },

    recommendationKind(module) {
      return module.description || courseFor(module.slug)?.summary || ''
    },

    courseDestination(course) {
      return course.premium && !this.canTakeAssessment
        ? '/premium-subscription'
        : course.path
    },

    courseStatus(course) {
      if (course.premium && !this.canTakeAssessment) return 'Premium required'

      const row = this.progress.find(item =>
        (TOPIC_SLUGS[item.slug] || item.slug) === course.slug
      )

      return row?.completion_status === 'completed'
        ? 'Completed'
        : row && row.completion_status !== 'not_started'
          ? 'In progress'
          : 'Not started'
    },

    openCancellation() {
      this.cancelError = ''
      this.subscriptionMessage = ''

      if (!this.canCancelSubscription || this.refreshWarning) return

      this.$refs.cancelDialog.showModal()
    },

    closeCancellation() {
      if (!this.cancelBusy) this.$refs.cancelDialog.close()
    },

    async confirmCancellation() {
      if (this.cancelBusy || !this.canCancelSubscription) return

      this.cancelBusy = true
      this.cancelError = ''

      try {
        const result = await this.authStore.cancelSubscription()

        this.$refs.cancelDialog.close()
        this.subscriptionMessage = result.subscription_status === 'cancelled'
          ? `Subscription cancelled. You keep Premium until ${formatDate(result.subscription_expires_at)}, then your account moves to Free.`
          : 'Subscription cancelled. Your account is now on the Free plan.'

        await this.loadDashboardData()
      } catch (error) {
        this.cancelError = error.message || 'Cancellation failed. Please try again.'
      } finally {
        this.cancelBusy = false
      }
    },

    async resumeSubscription() {
      if (this.cancelBusy || !this.isCancelledButActive) return

      this.cancelBusy = true
      this.cancelError = ''
      this.subscriptionMessage = ''

      try {
        await this.authStore.resumeSubscription()
        this.subscriptionMessage = 'Your Premium subscription will continue.'
      } catch (error) {
        this.cancelError = error.message || 'Could not resume. Please try again.'
      } finally {
        this.cancelBusy = false
      }
    },
  },
}
