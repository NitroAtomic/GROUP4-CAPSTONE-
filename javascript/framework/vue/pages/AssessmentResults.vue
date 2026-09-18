<template>
  <main class="quiz-page">
    <section class="quiz-container">

      <!-- Results Header -->
      <div class="quiz-header">
        <h1>Assessment Results</h1>
      </div>

      <div v-if="results" class="quiz-results-content">

        <!-- Score Summary -->
        <div class="quiz-score-summary">
          <div class="quiz-score-circle">
            <span class="quiz-score-number">{{ percentageScore }}%</span>
          </div>
          <div class="quiz-score-details">
            <h2 class="quiz-score-level">{{ level }}</h2>
            <p class="quiz-score-text">
              You scored {{ score }} out of {{ totalPoints }} questions correctly.
            </p>
          </div>
        </div>

        <!-- Weak Areas -->
        <div v-if="weakAreas.length > 0" class="quiz-weak-areas">
          <h3>Areas for Improvement</h3>
          <ul class="quiz-weak-areas-list">
            <li v-for="area in weakAreas" :key="area.topic" class="quiz-weak-area-item">
              <span class="quiz-weak-area-topic">{{ formatTopic(area.topic) }}</span>
              <span class="quiz-weak-area-score">{{ area.percentage }}%</span>
            </li>
          </ul>
        </div>

        <!-- Topic Breakdown -->
        <div class="quiz-topic-breakdown">
          <h3>Performance by Topic</h3>
          <div class="quiz-topic-grid">
            <div
              v-for="(stats, topic) in byTopic"
              :key="topic"
              class="quiz-topic-item"
            >
              <span class="quiz-topic-name">{{ formatTopic(topic) }}</span>
              <span class="quiz-topic-score">
                {{ stats.correct }}/{{ stats.total }}
              </span>
            </div>
          </div>
        </div>

        <!-- Review Section -->
        <div class="quiz-review-section">
          <h3>Question Review</h3>
          <div
            v-for="item in reviewItems"
            :key="item.id"
            class="quiz-review-item"
            :class="item.isCorrect ? 'quiz-review-correct' : 'quiz-review-incorrect'"
          >
            <span class="quiz-review-type">
              {{ item.questionType === 'scenario-based' ? 'Scenario-Based' : 'Standard' }}
            </span>
            <p class="quiz-review-question">{{ item.questionText }}</p>
            <div class="quiz-review-details">
              <p class="quiz-review-answer">
                <strong>Your answer:</strong> {{ item.selectedAnswerText }}
              </p>
              <p class="quiz-review-correct-answer">
                <strong>Correct answer:</strong> {{ item.correctAnswerText }}
              </p>
              <p v-if="item.explanation" class="quiz-review-explanation">
                {{ item.explanation }}
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="quiz-results-actions">
          <button class="quiz-nav-button" @click="retakeAssessment">
            Retake Assessment
          </button>
          <button class="quiz-nav-button" @click="goToDashboard">
            Return to Dashboard
          </button>
        </div>

      </div>

      <div v-else class="quiz-no-results">
        <p>No assessment results found. Please complete the assessment first.</p>
        <button class="quiz-nav-button" @click="goToDashboard">
          Return to Dashboard
        </button>
      </div>

    </section>
  </main>
</template>

<script src="./AssessmentResults.js"></script>
