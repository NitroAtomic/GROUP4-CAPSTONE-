<template>
  <SiteHeader />
  <router-view />
  <ChatbotWidget v-if="!isQuizOrAssessmentRoute" />
  <BackToTop />
</template>

<script>
import SiteHeader from './layout/SiteHeader.vue'
import ChatbotWidget from './layout/ChatbotWidget.vue'
import BackToTop from './layout/BackToTop.vue'

export default {
  components: {
    SiteHeader,
    ChatbotWidget,
    BackToTop
  },
  computed: {
    isQuizOrAssessmentRoute() {
      const path = this.$route.path
      return path.startsWith('/assessment') || path.startsWith('/quiz')
    }
  }
}
</script>
