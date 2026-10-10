<template>
  <div class="module-page premium-role-module">
    <!-- Premium Badge -->
    <div class="premium-badge">
      <svg class="ui-icon premium-badge-icon" aria-hidden="true"><use href="#ui-icon-crown" /></svg>
      <span>Premium Course</span>
    </div>

    <!-- Module Header. Walang lihim dito: nasa pampublikong
         premium-list na ang mga pamagat, kaya nananatili sila sa
         browser para may makita agad habang kinukuha ang aral. -->
    <header class="module-header page-band">
      <nav>
        <router-link to="/" class="home-breadcrumb-link">
          <svg class="ui-icon home-breadcrumb-icon" aria-hidden="true"><use href="#ui-icon-home" /></svg>
          <span>Home</span>
        </router-link>
        <span> / </span>
        <router-link to="/dashboard">Dashboard</router-link>
        <span> / </span>
        <span class="module-breadcrumb-current">{{ meta.title }}</span>
      </nav>
      <h1>{{ meta.title }}</h1>
      <p>{{ meta.intro }}</p>
    </header>

    <!-- Yung aral mismo, galing sa server. -->
    <p v-if="state === 'loading'" class="module-key-details">
      Loading this module&hellip;
    </p>

    <div v-else-if="state === 'ready'" class="premium-module-body" v-html="html"></div>

    <section v-else class="module-quiz-section">
      <h2>{{ state === 'locked' ? 'This module is Premium' : 'We couldn&rsquo;t load this' }}</h2>
      <p>{{ message }}</p>
      <router-link
        v-if="state === 'locked'"
        to="/premium-subscription"
        class="take-quiz-button"
      >
        See Premium plans
      </router-link>
      <button v-else type="button" class="take-quiz-button" @click="load">
        Try again
      </button>
      <router-link to="/" class="module-home-button">
        Back to Homepage
      </router-link>
    </section>

    <!-- Quiz Section -->
    <section v-if="state === 'ready'" class="module-quiz-section">
      <h2>Course Assessment</h2>
      <p>Test your knowledge with the 10-question assessment for this course.</p>
      <button class="take-quiz-button" @click="startQuiz">Take Assessment</button>
      <router-link to="/" class="module-home-button">Back to Homepage</router-link>
    </section>
  </div>
</template>

<script src="./PremiumModule.js"></script>
