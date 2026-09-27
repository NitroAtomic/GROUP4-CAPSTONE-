<template>
  <SiteHeader />
  <router-view />
  <ChatbotWidget v-if="!isAssessmentRoute" />
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
    isAssessmentRoute() {
      // Hide chatbot on assessment routes to maintain assessment integrity
      return this.$route.path.startsWith('/assessment')
    }
  }
}
</script>
