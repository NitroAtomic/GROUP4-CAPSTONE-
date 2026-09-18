<template>
  <SiteHeader />
  <router-view />
  <ChatbotWidget v-if="!isAssessmentRoute" />
</template>

<script>
import SiteHeader from './layout/SiteHeader.vue'
import ChatbotWidget from './layout/ChatbotWidget.vue'

export default {
  components: {
    SiteHeader,
    ChatbotWidget
  },
  computed: {
    isAssessmentRoute() {
      // Hide chatbot on assessment routes to maintain assessment integrity
      return this.$route.path.startsWith('/assessment')
    }
  }
}
</script>
