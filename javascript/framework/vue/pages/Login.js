// javascript/framework/vue/pages/Login.js
import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'Login',

  data() {
    return {
      step: 'credentials', // 'credentials' | 'otp'
      email: '',
      password: '',
      isSubmitting: false,
      errorMessage: '',

      // OTP step (FR-20: Premium accounts get a second factor)
      otpCode: '',
      pendingToken: '',
      otpEmail: '',
      resendMessage: ''
    }
  },

  computed: {
    postLoginPath() {
      const redirect = this.$route.query.redirect
      return typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/dashboard'
    }
  },

  methods: {
    async submitLogin() {
      this.errorMessage = ''

      if (!this.email || !this.password) {
        this.errorMessage = 'Please enter your email and password.'
        return
      }

      this.isSubmitting = true
      const authStore = useAuthStore()

      try {
        const result = await authStore.login({ email: this.email, password: this.password })

        if (result.requiresOtp) {
          this.pendingToken = result.pendingToken
          this.otpEmail = result.email
          this.step = 'otp'
        } else {
          // Handoff Notes: "Successful login should eventually redirect
          // the user to dashboard.html."
          this.$router.push(this.postLoginPath)
        }
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isSubmitting = false
      }
    },

    async submitOtp() {
      this.errorMessage = ''

      if (!this.otpCode) {
        this.errorMessage = 'Please enter the code we sent you.'
        return
      }

      this.isSubmitting = true
      const authStore = useAuthStore()

      try {
        await authStore.verifyOtp({ pendingToken: this.pendingToken, code: this.otpCode })
        this.$router.push(this.postLoginPath)
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isSubmitting = false
      }
    },

    async resendCode() {
      this.errorMessage = ''
      this.resendMessage = ''
      const authStore = useAuthStore()

      try {
        await authStore.resendOtp({ pendingToken: this.pendingToken })
        this.resendMessage = 'A new code has been sent.'
      } catch (error) {
        this.errorMessage = error.message
      }
    }
  }
}
