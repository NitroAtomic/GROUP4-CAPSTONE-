// javascript/framework/vue/pages/CreateAccount.js
import { useAuthStore } from '../stores/auth.js'
import { safeRedirect } from '../lib/safeRedirect.js'
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
      errorMessage: '',
      // Ipinapakita lang ang mali kapag na-alis na ang cursor sa field o
      // pinindot na ang button, para hindi pula agad ang bagong form.
      touched: {},
      submitAttempted: false
    }
  },

  computed: {
    /* Libreng account (?plan=free, galing sa Login o sa resulta ng quiz).
       Walang plano at walang bayad: diretso sa dashboard o pabalik kung
       saan siya galing. Ang server ay laging Free ang gawa sa bagong
       account, kaya walang binabago sa likod. */
    isFreeSignup() {
      return this.$route.query.plan === 'free'
    },

    afterSignupPath() {
      return safeRedirect(this.$route.query.redirect)
    },

    loginLink() {
      return this.$route.query.redirect
        ? { path: '/login', query: { redirect: this.afterSignupPath } }
        : '/login'
    },

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

    // Isang mensahe kada field (UAT: markahan ang kulang o maling field).
    fieldErrors() {
      const email = this.email.trim()
      return {
        firstName: this.firstName.trim() ? '' : 'Enter your first name.',
        email: !email
          ? 'Enter your email address.'
          : (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email, like name@email.com.'),
        password: !this.password
          ? 'Create a password.'
          : (this.allPasswordRulesValid ? '' : 'Your password does not meet all the requirements below.'),
        confirmPassword: !this.confirmPassword
          ? 'Re-enter your password.'
          : (this.passwordsMatch ? '' : "Passwords don't match.")
      }
    },

    canSubmit() {
      return Object.values(this.fieldErrors).every((message) => !message)
    }
  },

  methods: {
    fieldError(field) {
      return (this.submitAttempted || this.touched[field]) ? this.fieldErrors[field] : ''
    },

    markTouched(field) {
      this.touched = { ...this.touched, [field]: true }
    },

    async submit() {
      this.errorMessage = ''
      this.submitAttempted = true

      // Hindi na naka-disable ang button: kapag may kulang, ipinapakita
      // kung alin, at doon inilalagay ang cursor.
      if (!this.canSubmit) {
        const ids = { firstName: 'first-name', email: 'email', password: 'password', confirmPassword: 'confirm-password' }
        const first = Object.keys(ids).find((field) => this.fieldErrors[field])
        this.errorMessage = 'Please fix the highlighted fields.'
        this.$nextTick(() => document.getElementById(ids[first])?.focus())
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
        this.$router.push(this.isFreeSignup ? this.afterSignupPath : '/payment')
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
