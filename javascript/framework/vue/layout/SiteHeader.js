import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'SiteHeader',

  data() {
    return {
      searchQuery: '',
      modules: [
        { id: 1, title: 'Quishing', link: '/modules/quishing' },
        { id: 2, title: 'Spear Phishing', link: '/modules/spear-phishing' },
        { id: 3, title: 'Smishing', link: '/modules/smishing' },
        { id: 4, title: 'Vishing', link: '/modules/vishing' },
        { id: 5, title: 'Pretexting', link: '/modules/pretexting' },
        {
          id: 6,
          title: 'Essential Safe Practices for Remote Environments',
          link: '/modules/essential-safe-practices-remote-environments'
        }
      ]
    }
  },

  computed: {
    searchResults() {
      const query = this.searchQuery.trim().toLowerCase()
      if (!query) return []
      return this.modules.filter((module) =>
        module.title.toLowerCase().includes(query)
      )
    },

    // Reads live from the Pinia auth store — so the navbar updates the
    // moment Login.vue / CreateAccount.vue sign someone in, with no
    // manual event wiring needed between components.
    authStore() {
      return useAuthStore()
    },

    isAuthenticated() {
      return this.authStore.isAuthenticated
    },

    firstName() {
      return this.authStore.firstName
    },

    isPremium() {
      return this.authStore.isPremium
    },

    // Checkout-funnel pages (Create Account, Payment) hide the search
    // box and "Go Premium" upsell — matching the legacy static pages
    // and the UI/UX mockups, where someone already mid-signup shouldn't
    // be re-prompted to go Premium or get pulled away by search.
    isMinimalNav() {
      return Boolean(this.$route.meta && this.$route.meta.minimalNav)
    }
  },

  methods: {
    clearSearch() {
      this.searchQuery = ''
    },

    goToFirstResult() {
      if (this.searchResults.length === 0) return
      this.$router.push(this.searchResults[0].link)
      this.clearSearch()
    },

    async logout() {
      await this.authStore.logout()
      this.$router.push('/login')
    }
  }
}
