// javascript/framework/vue/pages/CreateAccount.js
import { useAuthStore } from '../stores/auth.js'
import { usePlanStore } from '../stores/plan.js'

export default {
  name: 'CreateAccount',

  setup() {
    const planStore = usePlanStore()
    return { planStore }
  },

  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      isSubmitting: false,
      errorMessage: ''
    }
  },

  computed: {
    // The 5 rules from the Handoff Notes, checked live as the user types.
    // Reuses the exact .password-requirement-valid class the CSS already
    // handles — see css/framework/tailwind/pages/create-account.css.
    passwordRules() {
      const value = this.password
      return {
        length: value.length >= 8,
        lowercase: /[a-z]/.test(value),
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[^A-Za-z0-9]/.test(value)
      }
    },

    allPasswordRulesValid() {
      return Object.values(this.passwordRules).every(Boolean)
    },

    passwordsMatch() {
      return this.password.length > 0 && this.password === this.confirmPassword
    },

    canSubmit() {
      return (
        this.firstName.trim().length > 0 &&
        this.email.trim().length > 0 &&
        this.allPasswordRulesValid &&
        this.passwordsMatch
      )
    }
  },

  methods: {
    async submit() {
      this.errorMessage = ''

      // Belt-and-suspenders: the button is already disabled until
      // canSubmit is true, but a submit can still fire via Enter.
      if (!this.canSubmit) {
        this.errorMessage = 'Please fill out every field and meet all password requirements.'
        return
      }

      this.isSubmitting = true
      const authStore = useAuthStore()

      try {
        await authStore.register({
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password
        })

        // Registration signs the user in immediately (backend returns a
        // token — see backend-node/routes/auth.js). Continuing to Payment
        // (Step 3) is next in the documented flow.
        this.$router.push('/payment')
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
