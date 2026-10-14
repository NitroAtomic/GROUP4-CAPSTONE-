<template>
  <main class="premium-list-page premium-catalog-page">
    <div class="catalog-container">
      <header class="premium-list-header catalog-heading">
        <h1>Modules</h1>
        <p>10 modules in two tracks: premium role-based courses and free foundational modules.</p>
        <nav class="catalog-track-links" aria-label="Module tracks"><a href="#catalog-premium" class="catalog-track-link is-premium">♛ Premium courses (4)</a><a href="#catalog-free" class="catalog-track-link">Free modules (6)</a></nav>
      </header>

      <section v-if="resumeCourse && resumeDetails" class="catalog-resume" aria-labelledby="catalog-resume-title">
        <div class="catalog-resume-icon" aria-hidden="true"><svg class="ui-icon"><use :href="`#ui-icon-${resumeCourse.icon}`" /></svg></div>
        <div class="catalog-resume-copy"><p class="catalog-eyebrow">Last opened module</p><h2 id="catalog-resume-title">{{ resumeCourse.title }}</h2><p class="catalog-resume-position">{{ resumeDetails.title }}</p><p>{{ resumeDetails.copy }}</p></div>
        <router-link :to="resumeDetails.destination" class="catalog-button is-teal">{{ resumeDetails.action }} <span aria-hidden="true">→</span></router-link>
      </section>
      <section v-else class="catalog-resume catalog-resume-empty" aria-labelledby="catalog-resume-empty-title">
        <div class="catalog-resume-copy">
          <p class="catalog-eyebrow">Last opened module</p>
          <h2 id="catalog-resume-empty-title">{{ progressState === 'loading' ? 'Looking for saved progress…' : 'Ready to start learning?' }}</h2>
          <p>{{ progressState === 'loading' ? 'Your courses are listed below while we check your progress.' : 'Open a course below. Your last opened module will appear here when you return; saved Premium steps stay in this browser.' }}</p>
        </div>
      </section>
      <p v-if="progressState === 'unavailable'" class="catalog-progress-note" role="status">Courses are available below. Account progress could not be loaded; any saved lesson position shown is local to this browser.</p>

      <section id="catalog-premium" class="catalog-track is-premium" aria-labelledby="catalog-premium-title">
        <div class="catalog-track-heading"><span class="catalog-badge is-premium">♛ Premium</span><div><h2 id="catalog-premium-title">Premium role-based courses</h2><p>Scenarios written for freelance and contract work. Each course ends with a 10-question assessment.</p></div><span class="catalog-access-pill">{{ isPremium ? '✓ ' : '' }}{{ accessLabel }}</span></div>
        <div class="premium-list-grid catalog-premium-grid">
          <router-link v-for="course in premiumCourses" :key="course.slug" :to="destination(course)" class="premium-list-card catalog-course-card is-premium" @click="rememberCourse(course)">
            <div class="catalog-card-top"><span class="catalog-course-icon" aria-hidden="true"><svg class="ui-icon"><use :href="`#ui-icon-${course.icon}`" /></svg></span><span class="catalog-badge is-premium">♛ Premium</span></div>
            <h3>{{ course.title }}</h3><p>{{ course.summary }}</p>
            <div class="catalog-card-footer"><span class="catalog-course-status" :class="{ 'is-completed': status(course) === 'Completed' }">{{ status(course) }}</span><span class="catalog-button is-gold">{{ isPremium ? 'Open course' : 'Unlock course' }} <span aria-hidden="true">→</span></span></div>
          </router-link>
        </div>
      </section>

      <section id="catalog-free" class="catalog-track" aria-labelledby="catalog-free-title">
        <div class="catalog-track-heading"><span class="catalog-badge">Free</span><div><h2 id="catalog-free-title">Free modules</h2><p>Foundational training, open to everyone.</p></div></div>
        <div class="catalog-free-grid">
          <router-link v-for="(course, index) in freeCourses" :key="course.slug" :to="course.path" class="catalog-course-card" @click="rememberCourse(course)">
            <div class="catalog-card-top"><span class="catalog-course-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span><span class="catalog-badge">Free</span></div>
            <h3>{{ course.title }}</h3><p>{{ course.summary }}</p>
            <div class="catalog-card-footer"><span class="catalog-course-status" :class="{ 'is-completed': status(course) === 'Completed' }">{{ status(course) }}</span><span class="catalog-button is-teal">{{ status(course) === 'Completed' ? 'Review' : 'Start' }} <span aria-hidden="true">→</span></span></div>
          </router-link>
        </div>
      </section>
      <nav class="catalog-footer-navigation" aria-label="Page navigation"><router-link to="/dashboard" class="catalog-button">← Back to Dashboard</router-link><router-link to="/" class="catalog-button">Back to Homepage</router-link></nav>
    </div>
    <!-- Shared navbar, footer, AI widget and back-to-top remain in the app shell. -->
  </main>
</template>

<script src="./PremiumModules.js"></script>
