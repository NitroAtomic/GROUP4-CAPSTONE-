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
      successMessage: ''
    }
  },

  computed: {
    formTitle() {
      return this.editingModuleId === null ? 'Create module' : 'Edit module'
    }
  },

  async mounted() {
    await this.loadModules()
  },

  methods: {
    async loadModules() {
      this.isLoading = true
      this.errorMessage = ''
      try {
        const authStore = useAuthStore()
        this.modules = await apiFetch('/api/modules', { token: authStore.token })
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
      this.isSaving = true
      this.errorMessage = ''
      this.successMessage = ''

      const authStore = useAuthStore()
      const payload = {
        ...this.form,
        description: this.form.description || null,
        category: this.form.category || null,
        video_url: this.form.video_url || null
      }

      try {
        if (this.editingModuleId === null) {
          await apiFetch('/api/modules', {
            method: 'POST',
            token: authStore.token,
            body: payload
          })
          this.successMessage = 'Module created.'
        } else {
          await apiFetch(`/api/modules/${this.editingModuleId}`, {
            method: 'PUT',
            token: authStore.token,
            body: payload
          })
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
      if (!window.confirm(`Delete "${module.module_title}"? This cannot be undone.`)) return

      this.deletingModuleId = module.module_id
      this.errorMessage = ''
      this.successMessage = ''
      try {
        const authStore = useAuthStore()
        await apiFetch(`/api/modules/${module.module_id}`, {
          method: 'DELETE',
          token: authStore.token
        })
        if (this.editingModuleId === module.module_id) {
          this.form = EMPTY_FORM()
          this.editingModuleId = null
        }
        this.successMessage = 'Module deleted.'
        await this.loadModules()
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.deletingModuleId = null
      }
    }
  }
}
