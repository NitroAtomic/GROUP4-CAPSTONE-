// javascript/framework/vue/pages/Payment.js
//
// Simulated checkout — see AUTHENTICATION.md "The payment page is a
// simulation" and FR-10 / the paper's Scope and Limitations, which
// excludes real payment-gateway integration. No card data is sent
// anywhere; only the demo number below is accepted, and anything that
// passes the Luhn checksum (i.e. looks like a real card) is refused.

import { useAuthStore } from '../stores/auth.js'
import { usePlanStore } from '../stores/plan.js'

const DEMO_CARD = '4242424242424242'

// Standard Luhn checksum — the algorithm real card numbers satisfy.
// Used here to actively refuse real-looking numbers, not to "validate"
// a card for acceptance.
function passesLuhn(digits) {
  let sum = 0
  let shouldDouble = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i])
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    shouldDouble = !shouldDouble
  }
  return sum % 10 === 0
}

export default {
  name: 'Payment',

  setup() {
    const planStore = usePlanStore()
    return { planStore }
  },

  data() {
    return {
      cardholderName: '',
      cardNumber: '',
      cardExpiry: '',
      cardSecurityCode: '',
      isSubmitting: false,
      errorMessage: ''
    }
  },

  methods: {
    // MM/YY (or MM / YY as typed) must be a real month and not already
    // in the past. "Any future date" per AUTHENTICATION.md's demo-card
    // instructions.
    isExpiryValid() {
      const match = this.cardExpiry.replace(/\s/g, '').match(/^(\d{1,2})\/(\d{2})$/)
      if (!match) return false

      const month = Number(match[1])
      const year = 2000 + Number(match[2])
      if (month < 1 || month > 12) return false

      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1
      if (year < currentYear) return false
      if (year === currentYear && month < currentMonth) return false
      return true
    },

    async submit() {
      this.errorMessage = ''

      const digits = this.cardNumber.replace(/\s/g, '')

      if (!this.cardholderName || !digits || !this.cardExpiry || !this.cardSecurityCode) {
        this.errorMessage = 'Please fill out every field.'
        return
      }

      if (!/^\d{13,19}$/.test(digits)) {
        this.errorMessage = 'Enter a valid card number.'
        return
      }

      if (digits !== DEMO_CARD) {
        // Real-looking card numbers are refused outright, not just
        // discouraged — see AUTHENTICATION.md.
        if (passesLuhn(digits)) {
          this.errorMessage =
            'This is a simulation — real card numbers aren\'t accepted. Use the demo card 4242 4242 4242 4242.'
        } else {
          this.errorMessage = 'Enter a valid card number.'
        }
        return
      }

      if (!this.isExpiryValid()) {
        this.errorMessage = 'Enter a valid future expiry date (MM / YY).'
        return
      }

      if (!/^\d{3}$/.test(this.cardSecurityCode)) {
        this.errorMessage = 'Enter a valid 3-digit CVV.'
        return
      }

      this.isSubmitting = true
      const authStore = useAuthStore()

      try {
        // Records the plan change on the account — no payment is
        // actually processed (FR-10 / Scope & Limitations).
        await authStore.upgradeToPremium()
        this.$router.push('/dashboard')
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
