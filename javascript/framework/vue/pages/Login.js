// javascript/framework/vue/pages/Login.js
import { safeRedirect } from '../lib/safeRedirect.js'
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
      return safeRedirect(this.$route.query.redirect)
    },

    // Libreng account: dala ang redirect, para bumalik siya kung saan siya
    // galing (hal. sa resulta ng quiz).
    freeSignupLink() {
      const query = { plan: 'free' }
      if (this.$route.query.redirect) query.redirect = this.postLoginPath
      return { path: '/create-account', query }
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
      if (this.isSubmitting) return

      this.errorMessage = ''
      this.resendMessage = ''
      this.isSubmitting = true
      const authStore = useAuthStore()

      try {
        const result = await authStore.resendOtp({ pendingToken: this.pendingToken })
        this.pendingToken = result.pendingToken
        this.otpCode = ''
        this.resendMessage = 'A new code has been sent.'
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
