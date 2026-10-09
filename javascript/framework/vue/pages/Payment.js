// javascript/framework/vue/pages/Payment.js
//
// Step 3 ng sign-up funnel: ang bayad mismo.
//
// WALA NANG CARD FORM DITO.
//
// Dati, dito tinatanggap yung card number, dito rin sinusuri, tapos
// tinatawag na lang yung endpoint na nagsasabing "Premium na ako".
// Ibig sabihin, ang browser pala ang nagpapasya kung may bayad --
// at kayang baguhin ng kahit sino yung browser niya.
//
// Ngayon, isang bagay lang ang ginagawa ng page na ito: hihingi ng
// checkout session sa sarili nating backend, tapos ilalabas yung user
// papunta sa hosted checkout page ng PayMongo. Doon ilalagay yung card
// o GCash -- sa PayMongo, hindi dito -- kaya walang card number na
// dumadaan sa site natin kahit minsan.
//
// Ang pagbabalik ng Premium ay nasa /payment/confirm, at ang server
// ang nagtatanong sa PayMongo kung bayad na nga ba.

import { useAuthStore } from '../stores/auth.js'
import { usePlanStore } from '../stores/plan.js'
import { apiFetch } from '../lib/api.js'

export default {
  name: 'Payment',

  setup() {
    const planStore = usePlanStore()
    return { planStore }
  },

  data() {
    return {
      isSubmitting: false,
      errorMessage: '',
      // Pinapatay yung button kapag walang naka-set na PayMongo key sa
      // server, para malinaw yung dahilan sa halip na pumalya nang tahimik.
      paymentsAvailable: true,
      methods: [],
      // Kapag bumalik yung user galing sa checkout page nang hindi
      // nagbayad, ?cancelled=1 yung dala niya.
      wasCancelled: false
    }
  },

  computed: {
    // Hindi ipinapakita yung tunay na pera ng tao: test mode ito, at
    // dapat alam niya yun bago pa siya mag-click.
    isTestMode() {
      return true
    }
  },

  async created() {
    this.wasCancelled = this.$route.query.cancelled === '1'

    // Ang presyo ay galing sa server ngayon, hindi na sa Vue store, kaya
    // iisa lang ang pinagmumulan niya.
    try {
      const data = await apiFetch('/api/billing/plans')
      this.paymentsAvailable = data.configured === true
      this.methods = Array.isArray(data.methods) ? data.methods : []
      const selected = data.plans?.find(
        (plan) => plan.billing_period === this.planStore.billing
      )
      if (selected) this.planStore.setServerPrice(selected.amount_display)
      if (!this.paymentsAvailable) {
        this.errorMessage =
          'Online payment is not available right now. Please try again later.'
      }
    } catch (error) {
      // Hindi ito nagpapatigil ng page. Kung hindi mabasa yung plans,
      // yung checkout pa rin ang huhusga -- doon nangyayari yung totoong
      // tseke, hindi dito.
      this.methods = []
    }
  },

  methods: {
    async pay() {
      if (this.isSubmitting) return
      this.errorMessage = ''
      this.wasCancelled = false
      this.isSubmitting = true

      const authStore = useAuthStore()

      try {
        const data = await apiFetch('/api/billing/checkout', {
          method: 'POST',
          token: authStore.token,
          // Yung period lang ang pinapadala. Kahit magpadala pa tayo ng
          // halaga dito, hindi ito binabasa ng server -- doon nakatira
          // yung presyo.
          body: { billing_period: this.planStore.billing }
        })

        if (!data.checkout_url) {
          throw new Error('Could not start the payment. Please try again.')
        }

        // Papunta na sa PayMongo. Iniiwan natin yung site dito.
        window.location.href = data.checkout_url
      } catch (error) {
        this.errorMessage = error.message
        this.isSubmitting = false
      }
    }
  }
}
