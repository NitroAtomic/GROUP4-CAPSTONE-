<template>
  <div class="module-page premium-role-module premium-step-module">
    <header class="module-header page-band">
      <nav class="premium-header-navigation" aria-label="Course navigation">
        <button type="button" class="premium-location-button" @click="requestLeave('/dashboard')">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" /></svg>Dashboard
        </button>
        <button type="button" class="premium-location-button" @click="requestLeave('/modules/premium')">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3zM12 6v16" /></svg>Modules
        </button>
      </nav>
      <h1>{{ meta.title }}</h1><p>{{ meta.intro }}</p>
      <div class="premium-course-meta"><div class="premium-badge"><svg class="ui-icon premium-badge-icon" aria-hidden="true"><use href="#ui-icon-crown" /></svg><span>Premium Course</span></div><span v-if="state === 'ready'">{{ estimatedTime }}</span></div>
    </header>
    <p v-if="state === 'loading'" class="module-key-details" role="status">Loading this module&hellip;</p>
    <template v-else-if="state === 'ready'">
      <div class="premium-progress-band"><div class="premium-progress-inner"><div class="premium-progress-label"><strong><span class="premium-progress-book" aria-hidden="true">📖</span>{{ meta.title }} Module Progress</strong><span>Step {{ activeStep + 1 }} of {{ totalSteps }}</span></div><div class="premium-progress-track" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100" aria-label="Learning sections reviewed"><span :style="{ width: progressPercent + '%' }"></span></div></div></div>
      <div class="premium-learning-layout" :class="{ 'menu-collapsed': !menuOpen }">
        <aside v-if="menuOpen" class="premium-lesson-menu">
          <div class="premium-menu-heading"><strong>In this module</strong><span class="premium-mini-badge">Premium</span></div>
          <div v-show="menuOpen" id="premium-menu-details"><p class="premium-menu-estimate">{{ estimatedTime }} · {{ totalSteps }} short steps</p>
            <nav id="premium-step-menu" aria-label="Lesson sections"><ol>
              <li v-for="(step, index) in steps" :key="index"><button type="button" :class="{ 'is-current': activeStep === index, 'is-reviewed': reviewed.includes(index) }" :aria-current="activeStep === index ? 'step' : undefined" @click="goToStep(index)"><span class="premium-step-number">{{ String(index + 1).padStart(2, '0') }} ·</span><span>{{ step.label }}</span><span v-if="reviewed.includes(index)" class="premium-step-check" aria-label="Reviewed">✓</span></button></li>
              <li><button type="button" :class="{ 'is-current': isAssessment }" :aria-current="isAssessment ? 'step' : undefined" @click="goToStep(steps.length)"><span class="premium-step-number">{{ String(totalSteps).padStart(2, '0') }} ·</span><span>Assessment</span></button></li>
            </ol></nav>
          </div>
          <div class="premium-menu-footer"><p>Step {{ activeStep + 1 }} of {{ totalSteps }}</p><div class="premium-progress-track" aria-hidden="true"><span :style="{ width: progressPercent + '%' }"></span></div><button type="button" class="premium-menu-toggle" :aria-expanded="menuOpen" aria-controls="premium-menu-details" @click="menuOpen = !menuOpen">{{ menuOpen ? '‹ Hide menu' : '› Show menu' }}</button></div>
        </aside>
        <div class="premium-step-main">
          <h2 ref="stepHeading" class="premium-step-eyebrow" tabindex="-1">Step {{ activeStep + 1 }} of {{ totalSteps }} · {{ currentLabel }}</h2>
          <div v-if="!isAssessment" :key="activeStep" ref="lessonContent" class="premium-module-body premium-step-content" @click="onLessonClick" v-html="renderedStep"></div>
          <section v-else class="module-quiz-section premium-assessment-card"><h2>Course Assessment</h2><p>Test your knowledge with the 10-question assessment for this course.</p><div class="premium-assessment-actions"><button type="button" class="take-quiz-button" @click="startQuiz">Take Assessment</button><button type="button" class="module-home-button" @click="requestLeave('/modules/premium')">Back to Modules</button></div></section>
          <p v-if="isAssessment && lessonComplete" class="premium-completion-note" role="status">✓ All learning sections reviewed</p>
          <div class="premium-step-navigation"><button v-if="activeStep > 0" type="button" class="premium-previous" @click="goToStep(activeStep - 1)">← {{ steps[activeStep - 1].label }}</button><button v-if="!isAssessment" type="button" class="premium-next" @click="nextStep">Next: {{ activeStep + 1 === steps.length ? 'Assessment' : steps[activeStep + 1].label }} →</button></div>
        </div>
      </div>
      <footer v-if="references" class="premium-references"><div class="premium-references-inner"><h2>References used in this module</h2><div v-html="references"></div></div></footer>
    </template>
    <section v-else class="module-quiz-section"><h2>{{ state === 'locked' ? 'This module is Premium' : 'We couldn’t load this' }}</h2><p>{{ message }}</p><router-link v-if="state === 'locked'" to="/premium-subscription" class="take-quiz-button">See Premium plans</router-link><button v-else type="button" class="take-quiz-button" @click="load">Try again</button><router-link to="/" class="module-home-button">Back to Homepage</router-link></section>

    <button v-if="state === 'ready' && !menuOpen" type="button" class="premium-floating-menu-button" aria-label="Show module menu" aria-expanded="false" @click="menuOpen = true">☰ Menu</button>

    <dialog ref="progressDialog" class="premium-dialog" aria-labelledby="premium-dialog-title" aria-describedby="premium-dialog-description" @cancel.prevent="closeDialog">
      <template v-if="dialogKind === 'definition'"><div class="premium-dialog-icon">?</div><p class="premium-dialog-eyebrow">Quick definition</p><h2 id="premium-dialog-title">{{ definition.term }}</h2><p id="premium-dialog-description">{{ definition.text }}</p><div class="premium-dialog-divider"></div><div class="premium-dialog-actions"><button type="button" class="premium-dialog-primary" autofocus @click="closeDialog">Got it ✓</button></div></template>
      <template v-else-if="dialogKind === 'leave'"><div class="premium-dialog-icon is-gold">↗</div><p class="premium-dialog-eyebrow">Learning progress</p><h2 id="premium-dialog-title">Leave this module?</h2><p id="premium-dialog-description">You’re on step {{ activeStep + 1 }} of {{ totalSteps }}. {{ progressSaved ? 'Your progress is saved in this browser, so you can pick up where you left off when you return.' : 'Progress could not be saved in this browser. Leaving may reset your current lesson progress.' }}</p><div class="premium-dialog-actions two-columns"><button type="button" class="premium-dialog-secondary" autofocus @click="closeDialog">Stay here</button><button type="button" class="premium-dialog-primary" @click="confirmLeave">Leave module</button></div></template>
      <template v-else-if="dialogKind === 'resume'"><div class="premium-dialog-icon">↻</div><p class="premium-dialog-eyebrow">Pick up where you left off</p><h2 id="premium-dialog-title">Welcome back!</h2><p id="premium-dialog-description">You previously reached Step {{ (savedProgress?.activeStep || 0) + 1 }} of {{ totalSteps }}. What would you like to do?</p><div class="premium-dialog-actions"><button type="button" class="premium-dialog-primary" autofocus @click="continueProgress">Continue Progress</button><div class="two-columns"><button type="button" class="premium-dialog-secondary" @click="startOver">Start Over</button><button type="button" class="premium-dialog-secondary" @click="startQuiz">Take/Retake Assessment</button></div></div></template>
    </dialog>
    <!-- The shared application AI widget and back-to-top controls remain unchanged. -->
  </div>
</template>
<script src="./PremiumModule.js"></script>
