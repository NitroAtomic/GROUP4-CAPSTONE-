// javascript/framework/vue/pages/ForgotPasswordConfirmation.js
import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'ForgotPasswordConfirmation',

  data() {
    return {
      code: '',
      newPassword: '',
      isSubmitting: false,
      isResending: false,
      errorMessage: '',
      successMessage: '',
      resendMessage: ''
    }
  },

  computed: {
    // Read from the route's query string — passed forward by
    // ForgotPassword.js when it navigates here.
    email() {
      return this.$route.query.email || ''
    },

    canSubmit() {
      return this.code.length > 0 && this.newPassword.length >= 8
    }
  },

  methods: {
    async submitReset() {
      this.errorMessage = ''
      this.successMessage = ''

      if (!this.email) {
        this.errorMessage = 'We lost track of which email this code was sent to. Please request a new code.'
        return
      }
      if (!this.canSubmit) {
        this.errorMessage = 'Enter the code and a new password of at least 8 characters.'
        return
      }

      this.isSubmitting = true
      const authStore = useAuthStore()

      try {
        await authStore.resetPassword({
          email: this.email,
          code: this.code,
          newPassword: this.newPassword
        })
        this.successMessage = 'Password updated. You can now log in with your new password.'
        this.code = ''
        this.newPassword = ''
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isSubmitting = false
      }
    },

    // Re-sends the reset request to the same stored email (Handoff Notes:
    // "Resend link ... should resend the reset request to the same email").
    async resend() {
      this.errorMessage = ''
      this.resendMessage = ''

      if (!this.email) {
        this.errorMessage = 'We lost track of which email this code was sent to. Please request a new code.'
        return
      }

      this.isResending = true
      const authStore = useAuthStore()

      try {
        await authStore.requestPasswordReset({ email: this.email })
        this.resendMessage = 'A new code has been sent, if that email has an account.'
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isResending = false
      }
    }
  }
}
