<template>
  <button
    v-show="show"
    type="button"
    class="back-to-top-button"
    aria-label="Back to top"
    @click="scrollToTop"
  >
    ↑
  </button>
</template>

<script src="./BackToTop.js"></script>
