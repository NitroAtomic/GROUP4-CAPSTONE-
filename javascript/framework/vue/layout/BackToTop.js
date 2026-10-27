export default {
  name: 'BackToTop',

  data() {
    return {
      show: false,
      feedbackCardOverlaps: false,
      feedbackControlFocused: false,
      feedbackControlPosition: null,
      feedbackResizeObserver: null,
      feedbackAnimationFrame: null
    }
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    window.addEventListener('scroll', this.scheduleFeedbackOverlapCheck, { passive: true })
    window.addEventListener('resize', this.scheduleFeedbackOverlapCheck)
    if (typeof ResizeObserver !== 'undefined') {
      this.feedbackResizeObserver = new ResizeObserver(this.scheduleFeedbackOverlapCheck)
    }
    this.handleScroll()
    this.$nextTick(this.observeFeedbackCard)
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('scroll', this.scheduleFeedbackOverlapCheck)
    window.removeEventListener('resize', this.scheduleFeedbackOverlapCheck)
    if (this.feedbackResizeObserver) this.feedbackResizeObserver.disconnect()
    if (this.feedbackAnimationFrame !== null) {
      window.cancelAnimationFrame(this.feedbackAnimationFrame)
    }
  },

  watch: {
    '$route'() {
      this.$nextTick(this.observeFeedbackCard)
    }
  },

  methods: {
    observeFeedbackCard() {
      if (this.feedbackResizeObserver) this.feedbackResizeObserver.disconnect()
      const feedbackTargets = document.querySelectorAll('#feedback-heading, .feedback-heading p, [data-feedback-final-card]')
      const button = this.$refs.backToTopButton
      if (this.feedbackResizeObserver && feedbackTargets.length && button) {
        feedbackTargets.forEach((target) => this.feedbackResizeObserver.observe(target))
        this.feedbackResizeObserver.observe(button)
      }
      this.scheduleFeedbackOverlapCheck()
    },

    scheduleFeedbackOverlapCheck() {
      if (this.feedbackAnimationFrame !== null) return
      this.feedbackAnimationFrame = window.requestAnimationFrame(() => {
        this.feedbackAnimationFrame = null
        this.checkFeedbackOverlap()
      })
    },

    checkFeedbackOverlap() {
      const feedbackTargets = document.querySelectorAll('#feedback-heading, .feedback-heading-icon, .feedback-heading p, [data-feedback-final-card]')
      const button = this.$refs.backToTopButton
      let overlaps = false

      if (this.show && feedbackTargets.length && button && button.isConnected) {
        const buttonBounds = this.getDefaultFeedbackControlBounds(button)
        const safetyMargin = 8
        overlaps = Array.from(feedbackTargets).some((target) => {
          if (!target.isConnected) return false
          const targetBounds = target.getBoundingClientRect()
          return (
            targetBounds.left < buttonBounds.right + safetyMargin &&
            targetBounds.right > buttonBounds.left - safetyMargin &&
            targetBounds.top < buttonBounds.bottom + safetyMargin &&
            targetBounds.bottom > buttonBounds.top - safetyMargin
          )
        })
      }

      this.feedbackCardOverlaps = overlaps
      this.feedbackControlPosition = overlaps && this.feedbackControlFocused
        ? this.findSafeFeedbackControlPosition(button, '.chatbot-floating-button')
        : null
    },

    getDefaultFeedbackControlBounds(control) {
      if (!control.classList.contains('feedback-control-repositioned')) {
        return control.getBoundingClientRect()
      }

      const className = control.getAttribute('class')
      const inlineStyle = control.getAttribute('style')
      control.classList.remove('feedback-control-repositioned')
      control.removeAttribute('style')
      control.style.setProperty('transition', 'none', 'important')
      const bounds = control.getBoundingClientRect()
      control.setAttribute('class', className)

      if (inlineStyle !== null) {
        control.setAttribute('style', inlineStyle)
      } else {
        control.removeAttribute('style')
      }

      return bounds
    },

    findSafeFeedbackControlPosition(control, otherSelector) {
      const bounds = control.getBoundingClientRect()
      const margin = 8
      const maxTop = Math.max(margin, window.innerHeight - bounds.height - margin)
      const leftPositions = [...new Set([margin, Math.max(margin, window.innerWidth - bounds.width - margin)])]
      const targets = document.querySelectorAll('#feedback-heading, .feedback-heading-icon, .feedback-heading p, [data-feedback-final-card]')
      const otherControl = document.querySelector(otherSelector)
      const otherBounds = otherControl && getComputedStyle(otherControl).display !== 'none'
        ? otherControl.getBoundingClientRect()
        : null

      for (let top = margin; top <= maxTop; top += margin) {
        for (const left of leftPositions) {
          const candidate = {
            left,
            right: left + bounds.width,
            top,
            bottom: top + bounds.height
          }
          const overlapsFeedback = Array.from(targets).some((target) => {
            const targetBounds = target.getBoundingClientRect()
            return (
              targetBounds.left < candidate.right &&
              targetBounds.right > candidate.left &&
              targetBounds.top < candidate.bottom &&
              targetBounds.bottom > candidate.top
            )
          })
          const overlapsOtherControl = otherBounds &&
            otherBounds.left < candidate.right &&
            otherBounds.right > candidate.left &&
            otherBounds.top < candidate.bottom &&
            otherBounds.bottom > candidate.top

          if (!overlapsFeedback && !overlapsOtherControl) {
            return { left: `${left}px`, top: `${top}px` }
          }
        }
      }

      return null
    },

    handleFeedbackControlBlur() {
      this.feedbackControlFocused = false
      this.feedbackControlPosition = null
      this.scheduleFeedbackOverlapCheck()
    },

    handleFeedbackControlFocus() {
      this.feedbackControlFocused = true
      this.scheduleFeedbackOverlapCheck()
    },

    handleScroll() {
      this.show = window.scrollY > 400
      this.scheduleFeedbackOverlapCheck()
    },

    scrollToTop() {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      })
    }
  }
}
