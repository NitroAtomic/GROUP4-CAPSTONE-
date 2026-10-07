import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'SiteHeader',

  data() {
    return {
      searchQuery: '',
      // Null means "no choice made" - follow the operating system. Only an
      // explicit pick is written to storage and to the data-theme attribute.
      theme: null,
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
      return this.authStore.user?.first_name || ''
    },

    isAdmin() {
      return Boolean(this.authStore.user && this.authStore.user.role === 'admin')
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

  mounted() {
    this.theme = this.readStoredTheme()
  },

  methods: {
    readStoredTheme() {
      try {
        const saved = localStorage.getItem('se-theme')
        return saved === 'dark' || saved === 'light' ? saved : null
      } catch (err) {
        return null
      }
    },

    systemPrefersDark() {
      return typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-color-scheme: dark)').matches
    },

    /* What the toggle should switch to. With no stored choice the page is
       showing whatever the system asked for, so the button has to offer the
       opposite of THAT rather than assuming light. */
    isDark() {
      return this.theme ? this.theme === 'dark' : this.systemPrefersDark()
    },

    toggleTheme() {
      const next = this.isDark() ? 'light' : 'dark'
      this.theme = next
      document.documentElement.setAttribute('data-theme', next)
      try {
        localStorage.setItem('se-theme', next)
      } catch (err) {
        // Storage blocked: the change still applies for this page.
      }
    },

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
