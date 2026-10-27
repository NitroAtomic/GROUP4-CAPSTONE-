import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'Home',
  setup() {
    const authStore = useAuthStore()
    return {
      authStore
    }
  },
  data() {
    return {
      feedbackObserver: null
    }
  },
  mounted() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const feedbackSection = this.$el.querySelector('.feedback-section')
    if (!feedbackSection || typeof IntersectionObserver === 'undefined') return

    this.feedbackObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      feedbackSection.classList.add('feedback-icons-entered')
      observer.disconnect()
      this.feedbackObserver = null
    })
    this.feedbackObserver.observe(feedbackSection)
  },
  beforeUnmount() {
    if (this.feedbackObserver) {
      this.feedbackObserver.disconnect()
      this.feedbackObserver = null
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