import assessmentData, { ASSESSMENT_TOPICS } from '../data/assessment-data.js'
import examLock from '../lib/examLock.js'
import { shuffleEachQuestionsOptions } from '../lib/shuffleOptions.js'

// Fisher-Yates shuffle — randomizes ORDER only.
function shuffleOrder(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/* Pare-parehong bilang ng tanong bawat paksa, hindi basta random.

   Dati 10 ang hinuhugot nang random sa buong pool, kaya may paksang
   isang tanong lang ang lumalabas, o wala pa. Isang maling sagot doon at
   "weak area" na ang buong paksa (puna ni Pena sa expert review). Ngayon
   kumukuha ng `perTopic` mula sa bawat paksa, tapos ginugulo ang ayos. */
export function selectQuestionsByTopic(questions, perTopic) {
  const picked = []
  for (const topic of ASSESSMENT_TOPICS) {
    const pool = questions.filter((question) => question.topic === topic)
    picked.push(...shuffleOrder(pool).slice(0, perTopic))
  }
  return shuffleOrder(picked)
}

/* Weak area kapag isa o wala ang tama sa tatlong tanong ng paksa.
   Kailangan din ng kahit dalawang tanong sa paksa bago ito husgahan, para
   hindi na mauulit na isang tanong lang ang batayan. */
export const WEAK_AREA_MIN_QUESTIONS = 2
export const WEAK_AREA_MAX_CORRECT_RATIO = 1 / 3

export function findWeakAreas(byTopic) {
  const weakAreas = []
  for (const [topic, stats] of Object.entries(byTopic)) {
    if (stats.total >= WEAK_AREA_MIN_QUESTIONS
        && stats.correct / stats.total <= WEAK_AREA_MAX_CORRECT_RATIO) {
      weakAreas.push(topic)
    }
  }
  return weakAreas
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
      const perTopic = assessmentData.questionsPerTopic || 3
      this.shuffledQuestions = shuffleEachQuestionsOptions(
        selectQuestionsByTopic(assessmentData.questions, perTopic)
      )
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
      const typeTotals = Object.fromEntries(
        ASSESSMENT_TOPICS.map((topic) => [topic, { correct: 0, total: 0 }])
      )

      let correctCount = 0
      const review = []

      // Nasa bawat tanong na ang paksa nito (assessment-data.js).
      for (const question of this.shuffledQuestions) {
        const topic = typeTotals[question.topic] ? question.topic : null
        if (topic) typeTotals[topic].total += 1
        const selectedAnswer = this.answers[question.id]
        const isCorrect = this.answersMatch(question.correctAnswer, selectedAnswer)
        if (isCorrect) {
          if (topic) typeTotals[topic].correct += 1
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

      // Weak areas: 1 or 0 correct out of 3 in a topic (findWeakAreas sa
      // itaas). Stored as plain topic slugs — the backend's recommendations
      // endpoint binds this array directly against module.category, so
      // objects would never match. Per-topic percentages stay available in
      // by_topic for display.
      const weakAreas = findWeakAreas(typeTotals)

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
