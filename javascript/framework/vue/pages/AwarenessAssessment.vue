<template>
  <main class="quiz-page">
    <section class="quiz-container">

      <!-- Assessment Header -->
      <div class="quiz-header">
        <div>
          <h1>Cybersecurity Awareness Assessment</h1>
        </div>
        <p class="quiz-question-counter">
          Question {{ currentIndex + 1 }} of {{ totalQuestions }}
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="quiz-progress-container">
        <div class="quiz-progress-bar" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <!-- Current Question -->
      <div v-if="currentQuestion" class="quiz-question-content">

        <span class="quiz-question-type">
          {{ currentQuestion.questionType === 'scenario-based' ? 'Scenario-Based' : 'Standard' }}
        </span>

        <h2 class="quiz-question-text">
          {{ currentQuestion.questionText }}
        </h2>

        <!-- Single-answer question: radio buttons -->
        <div v-if="currentQuestion.answerType === 'single'" class="quiz-answer-list">
          <label
            v-for="option in currentQuestion.options"
            :key="option.value"
            class="quiz-answer-option"
            :class="{
              'quiz-answer-option-correct': isCurrentChecked && isOptionCorrect(option.value),
              'quiz-answer-option-incorrect': isCurrentChecked && isOptionSelected(option.value) && !isOptionCorrect(option.value)
            }"
          >
            <input
              type="radio"
              name="answer"
              :value="option.value"
              v-model="selectedAnswer"
              :disabled="isCurrentChecked"
            >
            <span>{{ option.text }}</span>
          </label>
        </div>

        <!-- Multi-answer question ("Select ALL that apply"): checkboxes -->
        <div v-else class="quiz-answer-list">
          <label
            v-for="option in currentQuestion.options"
            :key="option.value"
            class="quiz-answer-option"
            :class="{
              'quiz-answer-option-correct': isCurrentChecked && isOptionCorrect(option.value),
              'quiz-answer-option-incorrect': isCurrentChecked && isOptionSelected(option.value) && !isOptionCorrect(option.value)
            }"
          >
            <input
              type="checkbox"
              :value="option.value"
              :checked="selectedAnswers.includes(option.value)"
              :disabled="isCurrentChecked"
              @change="toggleMultipleAnswer(option.value)"
            >
            <span>{{ option.text }}</span>
          </label>
        </div>

        <!-- Immediate per-question feedback, flashed after "Check Answer" -->
        <div
          v-if="currentFeedback"
          class="quiz-feedback-panel"
          :class="currentFeedback.isCorrect ? 'quiz-feedback-correct' : 'quiz-feedback-incorrect'"
        >
          <p v-if="currentFeedback.isCorrect" class="quiz-feedback-title">Correct!</p>
          <p v-else class="quiz-feedback-title">Incorrect</p>
          <p class="quiz-feedback-text">
            <strong>Correct answer:</strong> {{ currentFeedback.correctAnswerText }}
          </p>
          <p v-if="currentFeedback.explanation" class="quiz-feedback-explanation">
            {{ currentFeedback.explanation }}
          </p>
        </div>

        <!-- Navigation Buttons -->
        <div class="quiz-navigation">
          <button
            class="quiz-nav-button"
            @click="goBack"
            :disabled="currentIndex === 0"
          >
            Back
          </button>

          <button
            v-if="!isCurrentChecked"
            class="quiz-nav-button quiz-check-button"
            @click="checkAnswer"
            :disabled="!isCurrentAnswered"
          >
            Check Answer
          </button>

          <button
            v-else-if="!isLastQuestion"
            class="quiz-nav-button quiz-next-button"
            @click="goNext"
          >
            Next
          </button>

          <button
            v-else
            class="quiz-nav-button quiz-submit-button"
            @click="submitAssessment"
          >
            Submit Assessment
          </button>
        </div>
      </div>

    </section>
  </main>
</template>

<script src="./AwarenessAssessment.js"></script>
