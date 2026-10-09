// javascript/framework/vue/pages/PaymentConfirm.js
//
// Dito bumabalik yung user galing sa checkout page ng PayMongo.
//
// Mahalagang maintindihan kung ano ang HINDI ginagawa nito: hindi nito
// ipinapalagay na bayad na dahil lang nandito siya. Yung URL na ito ay
// kayang i-type ng kahit sino. Ang ginagawa nito ay hingin sa sarili
// nating backend na tanungin ang PayMongo, at ang sagot ng PayMongo ang
// nagpapasya -- hindi yung pagdating niya sa page na ito.
//
// Kaya kapag tinype mo lang ito nang diretso, "hindi pa natatanggap ang
// bayad" ang makukuha mo, kahit gaano karaming beses mo pang i-refresh.

import { useAuthStore } from '../stores/auth.js'
import { apiFetch } from '../lib/api.js'

export default {
  name: 'PaymentConfirm',

  data() {
    return {
      state: 'checking', // checking | paid | unpaid | error
      message: '',
      reference: ''
    }
  },

  created() {
    this.reference = String(this.$route.query.ref || '')
    if (!this.reference) {
      this.state = 'error'
      this.message = 'We could not tell which payment this was.'
      return
    }
    this.check()
  },

  methods: {
    async check() {
      this.state = 'checking'
      this.message = ''

      const authStore = useAuthStore()

      try {
        const data = await apiFetch('/api/billing/confirm', {
          method: 'POST',
          token: authStore.token,
          body: { reference_number: this.reference }
        })

        if (!data.paid) {
          this.state = 'unpaid'
          this.message = data.error || 'This payment has not come through yet.'
          return
        }

        /* Kinukuha ulit yung account galing server imbes na i-set na lang
           dito yung "Premium na". Yung server ang nakakaalam kung ano
           talaga yung plano niya ngayon; kung dito natin ise-set, puro
           haka-haka lang yung ipinapakita ng nav at ng mga locked cards. */
        await authStore.refreshUser()
        this.state = 'paid'
      } catch (error) {
        // Yung 402 ("hindi pa bayad") ay normal na sagot, hindi sira.
        // Nangyayari ito kapag mabagal pa yung e-wallet na kumpirmahin.
        if (/not received|not come through/i.test(error.message)) {
          this.state = 'unpaid'
          this.message = error.message
          return
        }
        this.state = 'error'
        this.message = error.message
      }
    },

    goToDashboard() {
      this.$router.push('/dashboard')
    }
  }
}
