<template>
  <dialog
    ref="dialog"
    class="premium-expiry-dialog"
    aria-labelledby="premium-expiry-title"
    aria-describedby="premium-expiry-text"
    @cancel.prevent="goFree"
  >
    <p class="premium-expiry-eyebrow">Your subscription</p>
    <h2 id="premium-expiry-title">Your Premium has ended</h2>
    <p id="premium-expiry-text">
      Premium access ended<template v-if="endedLabel"> on <strong>{{ endedLabel }}</strong></template>.
      Your progress and quiz scores are saved. You can keep learning with the
      free modules, or renew Premium any time.
    </p>
    <div class="premium-expiry-actions">
      <button type="button" class="premium-expiry-secondary" @click="renew">Renew Premium</button>
      <button type="button" class="premium-expiry-primary" autofocus @click="goFree">Go to free modules</button>
    </div>
  </dialog>
</template>

<script>
import { useAuthStore } from '../stores/auth.js'
import { routeNeedsPremium } from '../router.js'

/* Kapag natapos ang Premium habang nasa site siya.

   Dati, walang nangyayari sa harap: hinaharang na ng server ang bayad na
   nilalaman pagdating ng petsa, pero nananatili siya sa pahina, at ang
   susunod na pindot ay isang error lang. Ngayon, gaya ng Netflix/Spotify:
   may paalala, at ibinabalik siya sa pahina ng Free.

   Hindi siya nila-log out. Hindi nagbago kung sino siya, ang plano lang;
   ang pilitin siyang mag-login ulit ay dagdag na abala na walang
   binabantayan. */
const CHECK_EVERY_MS = 30 * 1000

// Ang ?premium=ended ang nagsasabi sa pahina ng aral na huwag nang
// magtanong ng "Leave this module?" -- wala na siyang maiiwanan.
const FREE_HOME = { path: '/', query: { premium: 'ended' }, hash: '#modules' }

export default {
  name: 'PremiumExpiryNotice',

  data() {
    return { endedAt: null, timer: null, open: false }
  },

  computed: {
    endedLabel() {
      if (!this.endedAt) return ''
      const date = new Date(this.endedAt)
      return Number.isNaN(date.getTime())
        ? ''
        : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    }
  },

  mounted() {
    this.check()
    this.timer = setInterval(this.check, CHECK_EVERY_MS)
    window.addEventListener('focus', this.check)
    document.addEventListener('visibilitychange', this.check)
  },

  beforeUnmount() {
    clearInterval(this.timer)
    window.removeEventListener('focus', this.check)
    document.removeEventListener('visibilitychange', this.check)
  },

  methods: {
    /* Premium pa ba sa nakatala, pero lampas na ang petsa? Ang admin ay
       hindi kasama: dumadaan siya kahit walang plano. */
    hasJustExpired(user) {
      if (!user || user.role === 'admin') return false
      if (user.subscription_type !== 'Premium' || !user.subscription_expires_at) return false
      return new Date(user.subscription_expires_at).getTime() <= Date.now()
    },

    async check() {
      if (this.open || document.visibilityState === 'hidden') return
      const auth = useAuthStore()
      if (!auth.isAuthenticated || !this.hasJustExpired(auth.user)) return

      const endedAt = auth.user.subscription_expires_at

      // Ang server ang nagpapasya at naglilipat sa Free (GET /me). Kung
      // hindi maabot, dito na lang binababa para hindi umulit ang paalala.
      try {
        await auth.refreshUser()
      } catch {
        auth._applyPlan({
          subscription_type: 'Free',
          subscription_status: 'inactive',
          subscription_expires_at: endedAt
        })
      }

      // Nag-renew pala sa ibang tab: walang dapat sabihin.
      if (auth.isPremium) return

      this.endedAt = endedAt
      this.open = true
      if (routeNeedsPremium(this.$route)) {
        this.$router.replace(FREE_HOME)
      }
      this.$nextTick(() => this.$refs.dialog?.showModal())
    },

    close() {
      this.$refs.dialog?.close()
      this.open = false
    },

    goFree() {
      this.close()
      this.$router.push(FREE_HOME)
    },

    renew() {
      this.close()
      this.$router.push('/premium-subscription')
    }
  }
}
</script>
