<template>
  <SiteHeader />
  <router-view />
  <UiIconSprite />
  <footer class="site-footer">
    <div class="site-footer-inner">
      <div class="site-footer-brand">
        <span
          class="site-footer-mark-wrap"
          @pointerdown="setFooterMarkDirection"
          @pointermove="setFooterMarkDirection"
          @pointerup="resetFooterMarkDirection"
          @pointerleave="resetFooterMarkDirection"
          @pointercancel="resetFooterMarkDirection"
          @lostpointercapture="resetFooterMarkDirection"
        >
          <img class="site-footer-mark" src="/images/icons/se-aware-logo-mark.png" alt="" aria-hidden="true">
        </span>
        <div class="site-footer-brand-copy">
          <strong>Social Engineering Awareness Platform</strong>
        </div>
      </div>
      <!-- Walang nav links dito. Pareho lang sila ng nasa header, at
           dalawang nakatayong link sa gilid ng talata ang mukhang
           naligaw na teksto sa halip na footer menu. Isang lugar lang
           ang navigation: yung header. -->
      <div class="site-footer-content">
        <p class="site-footer-note">
          Educational guidance to support awareness and learning. This resource does not replace formal organizational training.
        </p>
      </div>
      <p class="site-footer-legal">
        &copy; 2026 SE-AWARE &middot; Group 4, S3102 &middot; Capstone project, for academic use.
      </p>
    </div>
  </footer>
  <ChatbotWidget />
  <BackToTop />
</template>

<script>
import SiteHeader from './layout/SiteHeader.vue'
import ChatbotWidget from './layout/ChatbotWidget.vue'
import BackToTop from './layout/BackToTop.vue'
import UiIconSprite from './components/UiIconSprite.vue'

export default {
  components: {
    SiteHeader,
    ChatbotWidget,
    BackToTop,
    UiIconSprite
  },
  methods: {
    setFooterMarkDirection(event) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        event.currentTarget.style.transform = ''
        return
      }

      if (event.type === 'pointerdown') {
        event.currentTarget.setPointerCapture(event.pointerId)
      }

      const bounds = event.currentTarget.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width))
      const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height))
      const rotateX = (0.5 - y) * 24
      const rotateY = (x - 0.5) * 24
      const translateX = (x - 0.5) * 6
      const translateY = (y - 0.5) * 6

      event.currentTarget.style.transform =
        `perspective(420px) translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    },
    resetFooterMarkDirection(event) {
      if (event.type === 'pointerleave' && event.currentTarget.hasPointerCapture(event.pointerId)) {
        return
      }

      event.currentTarget.style.transform = ''

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    }
  }
}
</script>
