// javascript/framework/vue/stores/plan.js
//
// Holds the Monthly/Yearly billing choice made on PremiumSubscription.vue
// so CreateAccount.vue and Payment.vue can both show the same plan and
// price without re-asking the user — Handoff Notes: "The selected billing
// plan needs to carry over into Create Account and Payment so those
// pages show the correct Monthly/Yearly plan and price."
//
// Kept in sessionStorage, same pattern as stores/auth.js, so the choice
// survives a page reload mid-flow but doesn't linger forever.

import { defineStore } from 'pinia'

const BILLING_KEY = 'se_selected_billing'
const MONTHLY_PRICE = 149
const YEARLY_PRICE = 1199

function formatPhp(amount) {
  return `₱${amount.toLocaleString('en-PH')}`
}

function readStoredBilling() {
  const raw = sessionStorage.getItem(BILLING_KEY)
  return raw === 'yearly' ? 'yearly' : 'monthly'
}

export const usePlanStore = defineStore('plan', {
  state: () => ({
    billing: readStoredBilling()
  }),

  getters: {
    isYearly: (state) => state.billing === 'yearly',

    // Centralizes the Monthly/Yearly display strings so every page that
    // shows the selected plan (Premium Subscription, Create Account,
    // Payment) reads the same source instead of re-deriving it.
    billingLabel: (state) => (state.billing === 'yearly' ? 'Yearly' : 'Monthly'),
    pricePeriod: (state) => (state.billing === 'yearly' ? '/year' : '/month'),
    price: (state) => formatPhp(state.billing === 'yearly' ? YEARLY_PRICE : MONTHLY_PRICE),
    billingDescription: (state) =>
      state.billing === 'yearly'
        ? 'Billed yearly, cancel anytime'
        : 'Billed monthly, cancel anytime'
  },

  actions: {
    setBilling(billing) {
      this.billing = billing === 'yearly' ? 'yearly' : 'monthly'
      sessionStorage.setItem(BILLING_KEY, this.billing)
    }
  }
})
