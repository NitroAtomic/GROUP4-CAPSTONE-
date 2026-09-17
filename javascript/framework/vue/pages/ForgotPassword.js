// javascript/framework/vue/pages/ForgotPassword.js
import { useAuthStore } from '../stores/auth.js'

// Simple, deliberately permissive check — this only gates whether the
// button is clickable, not whether the email is real. The backend is the
// actual source of truth (and always returns the same response either
// way, per AUTHENTICATION.md, so it can't be used to probe accounts).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default {
  name: 'ForgotPassword',

  data() {
    return {
      email: '',
      isSubmitting: false,
      errorMessage: ''
    }
  },

  computed: {
    isEmailValid() {
      return EMAIL_PATTERN.test(this.email)
    }
  },

  methods: {
    async submit() {
      this.errorMessage = ''

      if (!this.isEmailValid) {
        this.errorMessage = 'Please enter a valid email address.'
        return
      }

      this.isSubmitting = true
      const authStore = useAuthStore()

      try {
        await authStore.requestPasswordReset({ email: this.email })

        // Pass the submitted email forward as a query param — needed by
        // ForgotPasswordConfirmation.vue to display it and to resend /
        // complete the reset against the same address.
        this.$router.push({
          name: 'ForgotPasswordConfirmation',
          query: { email: this.email }
        })
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
