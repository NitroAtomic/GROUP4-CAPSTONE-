<template>
  <button
    v-show="show"
    ref="backToTopButton"
    type="button"
    class="back-to-top-button"
    aria-label="Back to top"
    :class="{
      'feedback-control-suppressed': feedbackCardOverlaps && !feedbackControlFocused,
      'feedback-control-repositioned': feedbackCardOverlaps && feedbackControlFocused
    }"
    :style="feedbackCardOverlaps && feedbackControlFocused ? feedbackControlPosition : null"
    @focus="handleFeedbackControlFocus"
    @blur="handleFeedbackControlBlur"
    @click="scrollToTop"
  >
    ↑
  </button>
</template>

<script src="./BackToTop.js"></script>
