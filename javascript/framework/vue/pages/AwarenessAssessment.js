import assessmentData from '../data/assessment-data.js'
import examLock from '../lib/examLock.js'

// Fisher-Yates shuffle — randomizes ORDER only.
function shuffleOrder(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Select N random questions from the pool
function selectRandomQuestions(array, count) {
  const shuffled = shuffleOrder(array)
  return shuffled.slice(0, count)
}

export default {
  name: 'AwarenessAssessment',

  data() {
    return {
      assessmentData: null,
      shuffledQuestions: [],
      currentIndex: 0,
      answers: {},
      checkedIds: {}
    }
  },

  computed: {
    totalQuestions() {
      return this.shuffledQuestions.length
    },

    currentQuestion() {
      return this.shuffledQuestions[this.currentIndex] || null
    },

    isLastQuestion() {
      return this.currentIndex === this.totalQuestions - 1
    },

    progressPercent() {
      if (this.totalQuestions === 0) return 0
      return ((this.currentIndex + 1) / this.totalQuestions) * 100
    },

    isCurrentAnswered() {
      if (!this.currentQuestion) return false
      const saved = this.answers[this.currentQuestion.id]
      if (this.currentQuestion.answerType === 'multiple') {
        return Array.isArray(saved) && saved.length > 0
      }
      return !!saved
    },

    isCurrentChecked() {
      return this.currentQuestion ? !!this.checkedIds[this.currentQuestion.id] : false
    },

    currentFeedback() {
      if (!this.currentQuestion || !this.isCurrentChecked) return null
      const selected = this.answers[this.currentQuestion.id]
      const isCorrect = this.answersMatch(this.currentQuestion.correctAnswer, selected)
      return {
        isCorrect,
        correctAnswerText: this.formatAnswer(this.currentQuestion, this.currentQuestion.correctAnswer),
        explanation: this.currentQuestion.explanation || ''
      }
    },

    selectedAnswer: {
      get() {
        return this.currentQuestion ? this.answers[this.currentQuestion.id] || null : null
      },
      set(value) {
        this.answers = { ...this.answers, [this.currentQuestion.id]: value }
      }
    },

    selectedAnswers: {
      get() {
        if (!this.currentQuestion) return []
        const saved = this.answers[this.currentQuestion.id]
        return Array.isArray(saved) ? saved : []
      },
      set(value) {
        this.answers = { ...this.answers, [this.currentQuestion.id]: [...value] }
      }
    }
  },

  created() {
    examLock.start()

    this.loadAssessment()
  },

  beforeUnmount() {
    examLock.stop()
  },

  methods: {
    loadAssessment() {
      this.assessmentData = assessmentData
      const questionsPerAttempt = assessmentData.questionsPerAttempt || 10
      this.shuffledQuestions = selectRandomQuestions(assessmentData.questions, questionsPerAttempt)
      this.currentIndex = 0
      this.answers = {}
      this.checkedIds = {}
    },

    checkAnswer() {
      if (!this.currentQuestion || !this.isCurrentAnswered) return
      this.checkedIds = { ...this.checkedIds, [this.currentQuestion.id]: true }
    },

    isOptionCorrect(value) {
      if (!this.currentQuestion) return false
      const correct = this.currentQuestion.correctAnswer
      if (Array.isArray(correct)) {
        return correct.map(String).includes(String(value))
      }
      return String(correct) === String(value)
    },

    isOptionSelected(value) {
      if (!this.currentQuestion) return false
      if (this.currentQuestion.answerType === 'multiple') {
        return this.selectedAnswers.map(String).includes(String(value))
      }
      return String(this.selectedAnswer) === String(value)
    },

    goNext() {
      if (this.currentIndex < this.totalQuestions - 1) {
        this.currentIndex++
      }
    },

    goBack() {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    },

    toggleMultipleAnswer(value) {
      const current = Array.isArray(this.selectedAnswers) ? [...this.selectedAnswers] : []
      const index = current.indexOf(value)
      if (index >= 0) {
        current.splice(index, 1)
      } else {
        current.push(value)
      }
      this.selectedAnswers = current
    },

    answersMatch(expected, saved) {
      if (Array.isArray(expected)) {
        if (!Array.isArray(saved)) return false
        const left = [...expected].map(String).sort()
        const right = [...saved].map(String).sort()
        return left.length === right.length && left.every((value, index) => value === right[index])
      }
      return String(saved) === String(expected)
    },

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

    submitAssessment() {
      const typeTotals = {
        phishing: { correct: 0, total: 0 },
        'spear-phishing': { correct: 0, total: 0 },
        vishing: { correct: 0, total: 0 },
        smishing: { correct: 0, total: 0 },
        pretexting: { correct: 0, total: 0 },
        quishing: { correct: 0, total: 0 },
        'safe-practices': { correct: 0, total: 0 }
      }

      let correctCount = 0
      const review = []

      // Topic mapping based on question ID ranges
      const topicMap = {
        'assessment-1': 'phishing',
        'assessment-2': 'phishing',
        'assessment-16': 'phishing',
        'assessment-3': 'spear-phishing',
        'assessment-4': 'spear-phishing',
        'assessment-17': 'spear-phishing',
        'assessment-5': 'vishing',
        'assessment-6': 'vishing',
        'assessment-18': 'vishing',
        'assessment-7': 'smishing',
        'assessment-8': 'smishing',
        'assessment-19': 'smishing',
        'assessment-9': 'pretexting',
        'assessment-10': 'pretexting',
        'assessment-20': 'pretexting',
        'assessment-11': 'quishing',
        'assessment-12': 'quishing',
        'assessment-13': 'safe-practices',
        'assessment-14': 'safe-practices',
        'assessment-15': 'safe-practices'
      }

      for (const question of this.shuffledQuestions) {
        const topic = topicMap[question.id] || 'standard'
        typeTotals[topic].total += 1
        const selectedAnswer = this.answers[question.id]
        const isCorrect = this.answersMatch(question.correctAnswer, selectedAnswer)
        if (isCorrect) {
          typeTotals[topic].correct += 1
          correctCount += 1
        }

        review.push({
          id: question.id,
          questionText: question.questionText,
          questionType: question.questionType,
          selectedAnswerText: this.formatAnswer(question, selectedAnswer),
          correctAnswerText: this.formatAnswer(question, question.correctAnswer),
          explanation: question.explanation || '',
          isCorrect,
          attemptRecorded: true
        })
      }

      const totalQuestions = this.shuffledQuestions.length
      const percentageScore = totalQuestions === 0
        ? 0
        : Math.round((correctCount / totalQuestions) * 100)

      // Determine awareness level based on score
      let level = 'Beginner'
      let levelKey = 'beginner'
      if (percentageScore >= 80) {
        level = 'Advanced'
        levelKey = 'advanced'
      } else if (percentageScore >= 60) {
        level = 'Intermediate'
        levelKey = 'intermediate'
      }

      // Weak areas: topics scoring < 70%. Stored as plain topic slugs —
      // the backend's recommendations endpoint binds this array directly
      // against module.category, so objects would never match. Per-topic
      // percentages stay available in by_topic for display.
      const weakAreas = []
      for (const [topic, stats] of Object.entries(typeTotals)) {
        if (stats.total > 0) {
          const topicPercent = Math.round((stats.correct / stats.total) * 100)
          if (topicPercent < 70) {
            weakAreas.push(topic)
          }
        }
      }

      const results = {
        score: correctCount,
        totalPoints: totalQuestions,
        percentageScore,
        level,
        levelKey,
        by_topic: typeTotals,
        weak_areas: weakAreas,
        review
      }

      sessionStorage.setItem('assessment-results', JSON.stringify(results))
      this.$router.push('/assessment/results')
    }
  }
}
