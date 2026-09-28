import assessmentData from '../data/assessment-data.js'
import { apiFetch } from '../lib/api.js'
import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'AssessmentResults',

  data() {
    return {
      results: null,
      isSubmitting: false
    }
  },

  computed: {
    percentageScore() {
      return this.results ? this.results.percentageScore : 0
    },

    level() {
      return this.results ? this.results.level : 'Beginner'
    },

    levelKey() {
      return this.results ? this.results.levelKey : 'beginner'
    },

    score() {
      return this.results ? this.results.score : 0
    },

    totalPoints() {
      return this.results ? this.results.totalPoints : 0
    },

    weakAreas() {
      // weak_areas is stored as topic slugs (['spear-phishing', ...]);
      // results saved by older versions may still be {topic, percentage}
      // objects — normalize both to { topic, percentage } for the template,
      // pulling the percentage back out of by_topic when needed.
      const stored = (this.results && this.results.weak_areas) || []
      return stored.map((entry) => {
        if (typeof entry === 'string') {
          const stats = (this.results.by_topic || {})[entry] || { correct: 0, total: 0 }
          return {
            topic: entry,
            percentage: stats.total ? Math.round((stats.correct / stats.total) * 100) : 0
          }
        }
        return entry
      })
    },

    byTopic() {
      const empty = { correct: 0, total: 0 }
      const stored = (this.results && this.results.by_topic) || {}
      return {
        phishing: stored.phishing || empty,
        'spear-phishing': stored['spear-phishing'] || empty,
        vishing: stored.vishing || empty,
        smishing: stored.smishing || empty,
        pretexting: stored.pretexting || empty,
        quishing: stored.quishing || empty,
        'safe-practices': stored['safe-practices'] || empty
      }
    },

    reviewItems() {
      if (!this.results) return []
      const questions = assessmentData.questions || []
      const storedReview = Array.isArray(this.results.review) ? this.results.review : []
      const storedById = Object.fromEntries(storedReview.map((item) => [String(item.id), item]))
      const sourceQuestions = storedReview.length
        ? storedReview
            .map((item) => questions.find((question) => String(question.id) === String(item.id)))
            .filter(Boolean)
        : questions

      return sourceQuestions.map((question) => {
        const stored = storedById[String(question.id)] || {}
        return {
          id: question.id,
          questionText: question.questionText,
          questionType: question.questionType,
          selectedAnswerText: stored.selectedAnswerText || '',
          correctAnswerText: this.formatAnswer(question, question.correctAnswer),
          explanation: question.explanation || stored.explanation || '',
          isCorrect: Boolean(stored.isCorrect),
          attemptRecorded: stored.attemptRecorded !== false && Boolean(stored.selectedAnswerText)
        }
      })
    }
  },

  created() {
    this.loadResults()
  },

  methods: {
    optionLabel(question, value) {
      const option = (question.options || []).find((item) => String(item.value) === String(value))
      if (!option) return String(value).toUpperCase()
      return `${String(option.value).toUpperCase()}) ${option.text}`
    },

    formatAnswer(question, answer) {
      if (answer == null || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
        return 'No answer'
      }
      const values = Array.isArray(answer) ? answer : [answer]
      return values.map((value) => this.optionLabel(question, value)).join('; ')
    },

    loadResults() {
      const raw = sessionStorage.getItem('assessment-results')
      this.results = raw ? JSON.parse(raw) : null
    },

    async submitToBackend() {
      if (!this.results || this.results.submitted || this.isSubmitting) return
      this.isSubmitting = true

      try {
        const authStore = useAuthStore()
        const token = authStore.token

        await apiFetch('/api/assessment/submit', {
          method: 'POST',
          token,
          body: {
            score: this.results.score,
            total: this.results.totalPoints,
            level: this.results.level,
            level_key: this.results.levelKey,
            by_topic: this.results.by_topic,
            weak_areas: this.results.weak_areas
          }
        })
        this.results.submitted = true
        sessionStorage.setItem('assessment-results', JSON.stringify(this.results))
      } catch (error) {
        console.error('Error submitting assessment:', error)
      } finally {
        this.isSubmitting = false
      }
    },

    retakeAssessment() {
      sessionStorage.removeItem('assessment-results')
      this.$router.push('/assessment/question')
    },

    goToDashboard() {
      this.$router.push('/dashboard')
    },

    formatTopic(topic) {
      if (!topic) return ''
      return topic
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }
  },

  mounted() {
    // Auto-submit to backend when results page loads
    if (this.results) {
      this.submitToBackend()
    }
  }
}
