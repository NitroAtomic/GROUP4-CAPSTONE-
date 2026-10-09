// javascript/framework/vue/pages/PremiumSubscription.js
import { usePlanStore } from '../stores/plan.js'
import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'PremiumSubscription',

  // Exposed to the template as `planStore` — the Monthly/Yearly buttons,
  // price period, billing description, and yearly-savings message all
  // read/write through it directly. Handoff Notes: "When switching to
  // Yearly, JS should update the active billing button, billing
  // description, price period (/month → /year), and show the yearly
  // savings message."
  setup() {
    const planStore = usePlanStore()
    const authStore = useAuthStore()
    return { planStore, authStore }
  },

  computed: {
    isSignedIn() {
      return this.authStore.isAuthenticated
    },

    alreadyPremium() {
      return this.authStore.isPremium
    },

    /* Dati, laging /create-account ang Continue.

       Okay yun sa bagong tao, pero yung may Free account na ay ipinapadala
       nito pabalik sa pag-gawa ng account gamit yung email na mayroon na
       siya — "This email is already used", patay na yung daan. Ibig sabihin,
       yung mismong "upgrade free tier to premium" na binanggit ni sir, hindi
       magawa ng kahit sino na may account na.

       Naka-login na? Diretso na sa bayad. Yung account, meron na siya. */
    continueTo() {
      if (this.alreadyPremium) return '/dashboard'
      return this.isSignedIn ? '/payment' : '/create-account'
    },

    continueLabel() {
      if (this.alreadyPremium) return 'Go to dashboard'
      return this.isSignedIn ? 'Continue to payment' : 'Continue'
    }
  }
}
