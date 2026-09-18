<template>
  <main class="dashboard-page">

    <section class="dashboard-container">

      <p v-if="isLoading" class="dashboard-empty-copy">Loading your dashboard…</p>

      <p v-else-if="errorMessage" class="form-error-message" role="alert">
        {{ errorMessage }}
      </p>

      <template v-else>

        <section class="dashboard-heading">
          <h1>
            Welcome back, <span id="dashboard-user-first-name">{{ firstName }}</span>
          </h1>
          <p>Here's your progress so far</p>
          <p class="dashboard-account-status">
            Current plan: {{ planLabel }} · Account status: {{ accountStatusLabel }}
          </p>
        </section>

        <section class="dashboard-summary-grid">

          <article class="dashboard-summary-card">
            <p class="dashboard-summary-label">Modules completed</p>
            <p class="dashboard-summary-value">
              <span id="completed-modules-count">{{ completedModulesCount }}</span>/<span id="total-modules-count">{{ totalModulesCount }}</span>
            </p>
          </article>

          <article class="dashboard-summary-card">
            <p class="dashboard-summary-label">Average quiz score</p>
            <p class="dashboard-summary-value" id="average-quiz-score">
              {{ averageQuizScoreLabel }}
            </p>
          </article>

          <article class="dashboard-summary-card">
            <p class="dashboard-summary-label">Weak areas found</p>
            <p class="dashboard-summary-value" id="weak-areas-count">
              {{ weakAreas.length }}
            </p>
          </article>

        </section>

        <section class="dashboard-section">
          <div class="dashboard-section-heading dashboard-section-heading-row">
            <div>
              <h2>Recommended for you</h2>
              <p>Based on your assessment results</p>
            </div>
            <router-link
              to="/assessment/question"
              class="dashboard-assessment-link"
            >
              Retake assessment
            </router-link>
          </div>

          <div v-if="recommendations.length" class="dashboard-recommendations-grid">
            <component
              :is="recommendationTag(module)"
              v-for="module in recommendations"
              :key="module.module_id || module.slug"
              class="dashboard-recommendation-card"
              v-bind="recommendationBind(module)"
            >
              <span class="dashboard-recommended-label">Recommended</span>
              <h3>{{ module.module_title }}</h3>
              <p>{{ recommendationKind(module) }}</p>
            </component>
          </div>
          <p v-else class="dashboard-empty-copy">
            No recommended modules yet. Complete an assessment or a quiz to get personalized suggestions.
          </p>
        </section>

        <section class="dashboard-section">
          <div class="dashboard-section-heading">
            <h2>Your weak areas</h2>
            <p>Topics to focus on next</p>
          </div>

          <div v-if="weakAreas.length" class="dashboard-weak-areas-list">
            <div
              v-for="area in weakAreas"
              :key="area.topic"
              class="dashboard-weak-area"
            >
              <span>{{ area.topic }}</span>
              <span class="dashboard-score-badge">{{ area.scoreLabel }}</span>
            </div>
          </div>
          <p v-else class="dashboard-empty-copy">
            No weak areas recorded yet. Take the Awareness Assessment once it is available.
          </p>
        </section>

        <section class="dashboard-section">
          <div class="dashboard-section-heading">
            <h2>Quiz history</h2>
          </div>

          <ol v-if="quizHistoryRows.length" class="dashboard-quiz-history">
            <li
              v-for="(row, index) in quizHistoryRows"
              :key="`${row.slug}-${index}`"
              class="dashboard-quiz-history-row"
            >
              <span>{{ row.title }}</span>
              <strong :class="{ 'dashboard-low-score': row.isLowScore }">
                {{ row.percentageLabel }}
              </strong>
            </li>
          </ol>
          <p v-else class="dashboard-empty-copy">
            No quiz attempts yet. Complete a module quiz to see your scores here.
          </p>
        </section>

      </template>

    </section>

  </main>
</template>

<script src="./dashboard.js"></script>
