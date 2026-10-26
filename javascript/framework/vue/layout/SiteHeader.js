import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'SiteHeader',

  data() {
    return {
      searchQuery: '',
      menuOpen: false,
      // Totoo kapag hindi kasya sa isang hanay ang buong header (sinusukat,
      // hindi hinuhulaan): saka lang lumalabas ang Menu.
      compact: false,
      // Null means "no choice made" - follow the operating system. Only an
      // explicit pick is written to storage and to the data-theme attribute.
      theme: null,
      modules: [
        { id: 1, title: 'Phishing', link: '/modules/phishing' },
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
    },

    /* Yung route mismo ang nagsasabi, hindi yung tao: naka-adminOnly na
       ang /admin sa router, kaya wala nang bagong watawat na aalagaan. */
    isAdminPage() {
      return Boolean(this.$route.meta && this.$route.meta.adminOnly)
    },

    // Parehong mga link ng malaking header, para sa Menu sa maliit na screen.
    menuLinks() {
      const links = [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About' },
        { to: '/dashboard', label: 'Dashboard' }
      ]
      if (this.isPremium) {
        links.push({ to: '/modules/premium', label: 'Modules' })
        links.push({ to: '/assessment/question', label: 'Assessment' })
      }
      if (this.isAdmin) links.push({ to: '/admin', label: 'Admin Portal' })
      return links
    }
  },

  watch: {
    // Bagong pahina = sarado ang Menu, at sukatin ulit (iba ang laman).
    '$route.fullPath'() {
      this.menuOpen = false
      this.measure()
    },
    isAuthenticated(value) {
      if (!value) this.menuOpen = false
      this.measure()
    },
    isPremium() { this.measure() },
    isAdmin() { this.measure() },
    firstName() { this.measure() }
  },

  mounted() {
    this.theme = this.readStoredTheme()
    document.addEventListener('click', this.onDocumentClick)
    window.addEventListener('resize', this.onResize)
    this.measure()
  },

  beforeUnmount() {
    document.removeEventListener('click', this.onDocumentClick)
    window.removeEventListener('resize', this.onResize)
    if (this.resizeFrame) cancelAnimationFrame(this.resizeFrame)
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

    /* Ipinapakita muna ang buong header, sinusukat, at kung hindi kasya sa
       isang hanay ay lumilipat sa Menu. Nangyayari lahat bago mag-drawing
       ang browser, kaya walang kurap. Ang bisita ay laging buong header:
       kasya naman (Home, About, Log in, Go Premium). */
    async measure() {
      if (!this.isAuthenticated) {
        this.compact = false
        return
      }
      this.compact = false
      await this.$nextTick()
      const nav = this.$refs.navbar
      const left = this.$refs.navLeft
      const right = this.$refs.navRight
      if (!nav || !left || !right) return
      const style = getComputedStyle(nav)
      const room = nav.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
      const gap = parseFloat(style.columnGap) || 0
      const needed = left.scrollWidth + right.scrollWidth + gap
      this.compact = needed > room
      if (!this.compact) this.menuOpen = false
    },

    onResize() {
      if (this.resizeFrame) cancelAnimationFrame(this.resizeFrame)
      this.resizeFrame = requestAnimationFrame(() => {
        this.resizeFrame = null
        this.measure()
      })
    },

    async toggleMenu() {
      this.menuOpen = !this.menuOpen
      // Pagbukas, nasa unang link ng Menu ang cursor (para sa keyboard).
      if (this.menuOpen) {
        await this.$nextTick()
        this.$el.querySelector('#site-menu-panel .nav-menu-link')?.focus()
      }
    },

    closeMenu() {
      if (!this.menuOpen) return
      this.menuOpen = false
      this.$refs.menuButton?.focus()
    },

    // Pindot sa labas ng header = isara ang Menu.
    onDocumentClick(event) {
      if (this.menuOpen && !this.$el.contains(event.target)) this.menuOpen = false
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
      this.menuOpen = false
      await this.authStore.logout()
      this.$router.push('/login')
    }
  }
}
