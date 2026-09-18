import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'Home',
  setup() {
    const authStore = useAuthStore()
    return {
      authStore
    }
  },
  computed: {
    isAuthenticated() {
      return this.authStore.isAuthenticated
    },
    isPremium() {
      return this.authStore.isPremium
    }
  }
}