import { useAuthStore } from '../stores/auth.js'
import { apiFetch } from '../lib/api.js'

const EMPTY_FORM = () => ({
  module_title: '',
  slug: '',
  description: '',
  module_type: 'Free',
  category: '',
  video_url: ''
})

const EMPTY_QUESTION = () => ({
  question_text: '',
  options: ['', '', '', ''],
  correct_option_index: 0,
  order_index: 0
})

const authRequest = (path, options = {}) => {
  const { token } = useAuthStore()
  return apiFetch(path, { ...options, token })
}

export default {
  name: 'Admin',

  data() {
    return {
      modules: [],
      form: EMPTY_FORM(),
      editingModuleId: null,
      isLoading: true,
      isSaving: false,
      deletingModuleId: null,
      errorMessage: '',
      successMessage: '',
      quizModuleId: null,
      quizId: null,
      questions: [],
      isLoadingQuestions: false,
      isSavingQuestion: false,
      editingQuestionId: null,
      questionForm: EMPTY_QUESTION(),
      questionError: ''
    }
  },

  computed: {
    formTitle() {
      return this.editingModuleId === null ? 'Create module' : 'Edit module'
    }
  },

  async created() {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      this.$router.replace('/login')
      return
    }
    if (!authStore.user || authStore.user.role !== 'admin') {
      this.$router.replace('/dashboard')
      return
    }
    await this.loadModules()
  },

  methods: {
    async loadModules() {
      this.isLoading = true
      this.errorMessage = ''
      try {
        this.modules = await authRequest('/api/modules')
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },

    resetForm() {
      this.form = EMPTY_FORM()
      this.editingModuleId = null
      this.errorMessage = ''
      this.successMessage = ''
    },

    editModule(module) {
      this.form = {
        module_title: module.module_title || '',
        slug: module.slug || '',
        description: module.description || '',
        module_type: module.module_type === 'Premium' ? 'Premium' : 'Free',
        category: module.category || '',
        video_url: module.video_url || ''
      }
      this.editingModuleId = module.module_id
      this.errorMessage = ''
      this.successMessage = ''
    },

    async saveModule() {
      if (this.isSaving) return
      this.errorMessage = ''
      this.successMessage = ''

      const title = this.form.module_title.trim()
      const slug = this.form.slug.trim()
      if (!title) {
        this.errorMessage = 'Enter a module title.'
        return
      }
      if (!/^[a-z0-9-]+$/.test(slug)) {
        this.errorMessage = 'The slug can only contain lowercase letters, numbers and hyphens.'
        return
      }

      this.isSaving = true
      const payload = {
        ...this.form,
        module_title: title,
        slug,
        description: this.form.description.trim() || null,
        category: this.form.category.trim() || null,
        video_url: this.form.video_url.trim() || null
      }

      try {
        if (this.editingModuleId === null) {
          await authRequest('/api/modules', { method: 'POST', body: payload })
          this.successMessage = 'Module created.'
        } else {
          await authRequest(`/api/modules/${this.editingModuleId}`, { method: 'PUT', body: payload })
          this.successMessage = 'Module updated.'
        }
        this.form = EMPTY_FORM()
        this.editingModuleId = null
        await this.loadModules()
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isSaving = false
      }
    },

    async deleteModule(module) {
      if (this.deletingModuleId !== null) return
      const confirmed = window.confirm(
        `Delete "${module.module_title}"? Deletion is blocked when learner progress or quiz history exists.`
      )
      if (!confirmed) return

      this.deletingModuleId = module.module_id
      this.errorMessage = ''
      this.successMessage = ''
      try {
        await authRequest(`/api/modules/${module.module_id}`, { method: 'DELETE' })
        if (this.editingModuleId === module.module_id) this.resetForm()
        this.successMessage = 'Module deleted.'
        await this.loadModules()
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.deletingModuleId = null
      }
    },

    async manageQuiz(module) {
      if (this.quizModuleId === module.module_id) {
        this.closeQuiz()
        return
      }
      this.quizModuleId = module.module_id
      this.quizId = null
      this.questions = []
      this.questionError = ''
      this.resetQuestionForm()
      this.isLoadingQuestions = true
      try {
        const quiz = await authRequest(`/api/quizzes/by-module/${module.slug}`)
        this.quizId = quiz.quiz_id
        await this.loadQuestions()
      } catch (error) {
        this.questionError = error.message
      } finally {
        this.isLoadingQuestions = false
      }
    },

    async loadQuestions() {
      this.questions = await authRequest(`/api/quizzes/${this.quizId}/questions`)
    },

    questionOptions(question) {
      if (Array.isArray(question.options)) return question.options
      if (typeof question.options !== 'string') return []
      try {
        const options = JSON.parse(question.options)
        return Array.isArray(options) ? options : []
      } catch {
        return []
      }
    },

    closeQuiz() {
      this.quizModuleId = null
      this.quizId = null
      this.questions = []
      this.questionError = ''
      this.resetQuestionForm()
    },

    resetQuestionForm() {
      this.editingQuestionId = null
      this.questionForm = { ...EMPTY_QUESTION(), order_index: this.questions.length }
    },

    editQuestion(question) {
      let options = question.options
      if (typeof options === 'string') {
        try {
          options = JSON.parse(options)
        } catch {
          this.questionError = 'The saved options for this question are invalid.'
          return
        }
      }
      this.editingQuestionId = question.question_id
      this.questionForm = {
        question_text: question.question_text,
        options: Array.isArray(options) ? [...options] : ['', '', '', ''],
        correct_option_index: Number(question.correct_option_index),
        order_index: Number(question.order_index) || 0
      }
      this.questionError = ''
    },

    async saveQuestion() {
      if (this.isSavingQuestion) return
      const questionText = this.questionForm.question_text.trim()
      const options = this.questionForm.options.map((option) => option.trim())
      if (!questionText) {
        this.questionError = 'Enter the question text.'
        return
      }
      if (options.length !== 4 || options.some((option) => !option)) {
        this.questionError = 'Fill in all four options.'
        return
      }
      if (!Number.isInteger(Number(this.questionForm.correct_option_index)) ||
          Number(this.questionForm.correct_option_index) < 0 ||
          Number(this.questionForm.correct_option_index) > 3) {
        this.questionError = 'Choose a valid correct answer.'
        return
      }

      this.isSavingQuestion = true
      this.questionError = ''
      const payload = {
        question_text: questionText,
        options,
        correct_option_index: Number(this.questionForm.correct_option_index),
        order_index: Number(this.questionForm.order_index) || 0
      }
      try {
        if (this.editingQuestionId === null) {
          await authRequest(`/api/quizzes/${this.quizId}/questions`, { method: 'POST', body: payload })
        } else {
          await authRequest(`/api/quizzes/questions/${this.editingQuestionId}`, { method: 'PUT', body: payload })
        }
        await this.loadQuestions()
        this.resetQuestionForm()
      } catch (error) {
        this.questionError = error.message
      } finally {
        this.isSavingQuestion = false
      }
    },

    async deleteQuestion(question) {
      if (this.isSavingQuestion || !window.confirm('Delete this quiz question?')) return
      this.isSavingQuestion = true
      this.questionError = ''
      try {
        await authRequest(`/api/quizzes/questions/${question.question_id}`, { method: 'DELETE' })
        await this.loadQuestions()
        if (this.editingQuestionId === question.question_id) this.resetQuestionForm()
      } catch (error) {
        this.questionError = error.message
      } finally {
        this.isSavingQuestion = false
      }
    }
  }
}
