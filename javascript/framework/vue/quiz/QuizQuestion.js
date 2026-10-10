// Static import of all 5 built modules' question data.
import examLock from '../lib/examLock.js'
import { useAuthStore } from '../stores/auth.js'
import { apiFetch } from '../lib/api.js'
// Vite bundles .json imports automatically — no extra config needed.
import module1 from '../data/module-1.json'
import module2 from '../data/module-2.json'
import module3 from '../data/module-3.json'
import module4 from '../data/module-4.json'
import module5 from '../data/module-5.json'

/* Yung libreng tanungan lang ang nakasama sa bundle.

   Yung apat na bayad (dating course-1.json … course-4.json) ay nasa
   server na at hinihingi sa GET /api/modules/:slug/quiz, na may
   kaparehong tseke ng bayad. Dati silang naka-import dito nang diretso,
   kaya napupunta sila sa pangunahing bundle kasama ang mga tamang sagot
   -- mababasa ng kahit sino, bayad man o hindi. */
const MODULE_DATA = {
  'module-1': module1,
  'module-2': module2,
  'module-3': module3,
  'module-4': module4,
  'module-5': module5
}

const PREMIUM_QUIZ_SLUGS = new Set([
  'client-impersonation', 'client-data', 'fake-recruiters', 'invoice-scams'
])

// Fisher-Yates shuffle — randomizes ORDER only.
function shuffleOrder(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Randomly select N questions from the pool.
// If pool size is <= count, shuffles and returns all questions.
function selectRandomQuestions(array, count) {
  const shuffled = shuffleOrder(array)
  return shuffled.slice(0, count)
}

export default {
  name: 'QuizQuestion',

  data() {
    return {
      moduleData: null,        // the loaded question bank (name, totals, etc.)
      loadError: '',           // kung bakit walang tanong na lumabas
      shuffledQuestions: [],   // the 10 questions, order randomized for this attempt
      currentIndex: 0,         // which question (0-9) is currently shown
      answers: {},             // { [questionId]: 'b' }  or  { [questionId]: ['a','b'] }
      checkedIds: {}           // { [questionId]: true } — has this question been "checked" (feedback flashed) yet?
    }
  },

  computed: {
    // Reads the moduleId straight from the URL (e.g. /quiz/module-1)
    moduleId() {
      return this.$route.params.moduleId
    },

    moduleTitle() {
      return this.moduleData ? this.moduleData.moduleName : ''
    },

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

    // Has the CURRENT question been answered? Controls whether "Check Answer" is enabled.
    isCurrentAnswered() {
      if (!this.currentQuestion) return false
      const saved = this.answers[this.currentQuestion.id]
      if (this.currentQuestion.answerType === 'multiple') {
        return Array.isArray(saved) && saved.length > 0
      }
      return !!saved
    },

    // Has the CURRENT question already been "checked" (feedback flashed) this attempt?
    // Persists across Back/Next so returning to an earlier question re-shows its feedback
    // instead of asking the user to check it again.
    isCurrentChecked() {
      return this.currentQuestion ? !!this.checkedIds[this.currentQuestion.id] : false
    },

    // Per-question feedback shown immediately after "Check Answer" is clicked.
    // Built entirely from data already in the module JSON (correctAnswer + explanation) —
    // no new content needed.
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

    // v-model target for single-answer (radio) questions.
    // Getter reads from `answers`, setter writes back into `answers` —
    // this is how the selection survives clicking Back and returning later.
    selectedAnswer: {
      get() {
        return this.currentQuestion ? this.answers[this.currentQuestion.id] || null : null
      },
      set(value) {
        this.answers = { ...this.answers, [this.currentQuestion.id]: value }
      }
    },

    // v-model target for multi-answer (checkbox) questions.
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

    this.loadModule()
  },

  beforeUnmount() {
    examLock.stop()
  },

  methods: {
    async loadModule() {
      this.loadError = ''
      let data = MODULE_DATA[this.moduleId]

      if (!data && PREMIUM_QUIZ_SLUGS.has(this.moduleId)) {
        try {
          data = await apiFetch(`/api/modules/${this.moduleId}/quiz`, {
            token: useAuthStore().token,
          })
        } catch (error) {
          this.loadError = error.message
          return
        }
      }

      if (!data) {
        // Dati, console.error lang ito at blangkong pahina ang nakikita
        // ng tao. Ngayon may sinasabi na.
        this.loadError = 'This quiz could not be found.'
        return
      }

      this.moduleData = data
      const count = data.questionsPerAttempt || 10
      this.shuffledQuestions = selectRandomQuestions(data.questions, count)
      this.currentIndex = 0
      this.answers = {}
      this.checkedIds = {}
    },

    // Flashes the correct/incorrect feedback for the current question.
    // The answer is locked in at this point (inputs get :disabled once checked)
    // so a user can't see the correct answer and then quietly switch to it.
    checkAnswer() {
      if (!this.currentQuestion || !this.isCurrentAnswered) return
      this.checkedIds = { ...this.checkedIds, [this.currentQuestion.id]: true }
    },

    // Used to highlight the correct option (and the user's wrong pick, if any)
    // once a question has been checked.
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

    submitQuiz() {
      const typeTotals = {
        standard: { correct: 0, total: 0 },
        'scenario-based': { correct: 0, total: 0 },
        simulation: { correct: 0, total: 0 }
      }

      let correctCount = 0
      const review = []

      for (const question of this.shuffledQuestions) {
        const typeKey = typeTotals[question.questionType] ? question.questionType : 'standard'
        typeTotals[typeKey].total += 1
        const selectedAnswer = this.answers[question.id]
        const isCorrect = this.answersMatch(question.correctAnswer, selectedAnswer)
        if (isCorrect) {
          typeTotals[typeKey].correct += 1
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

      const results = {
        moduleId: this.moduleId,
        moduleName: this.moduleTitle,
        score: correctCount,
        totalPoints: totalQuestions,
        percentageScore,
        passed: percentageScore >= 70,
        breakdown: typeTotals,
        review
      }

      sessionStorage.setItem(`quiz-results-${this.moduleId}`, JSON.stringify(results))
      this.$router.push(`/quiz/${this.moduleId}/results`)
    }
  },

  watch: {
    moduleId() {
      this.loadModule()
    }
  }
}