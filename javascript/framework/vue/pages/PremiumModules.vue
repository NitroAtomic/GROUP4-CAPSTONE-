<template>
  <!-- Wala pang pahina na naglilista ng role-based modules: yung apat na
       course ay may sariling URL lang, walang link papunta sa kanila mula
       kahit saan. Ibig sabihin, kahit nakabayad ka, hindi mo sila mahahanap
       kung hindi mo alam yung address. -->
  <main class="premium-list-page">
    <header class="premium-list-header">
      <h1>Role-based modules</h1>
      <p>
        Scenarios written for freelance and contract work. Each course ends
        with a 10-question assessment.
      </p>
    </header>

    <div class="premium-list-grid">
      <router-link
        v-for="course in courses"
        :key="course.path"
        :to="course.path"
        class="premium-list-card"
      >
        <h2>{{ course.title }}</h2>
        <p>{{ course.summary }}</p>
        <span class="premium-list-open">Open course →</span>
      </router-link>
    </div>

    <router-link to="/" class="module-home-button">Back to Homepage</router-link>
  </main>
</template>

<script src="./PremiumModules.js"></script>
