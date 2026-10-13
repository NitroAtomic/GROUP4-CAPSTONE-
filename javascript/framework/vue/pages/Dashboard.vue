<template>
  <main class="dashboard-page">
    <section class="dashboard-container" :aria-busy="isLoading">
      <p v-if="isLoading" class="dashboard-empty-copy" role="status">Loading your dashboard…</p>
      <div v-else-if="errorMessage" class="dashboard-state-card">
        <p class="form-error-message" role="alert">{{ errorMessage }}</p>
        <button type="button" class="dashboard-button is-teal" @click="loadDashboardData">Try again</button>
      </div>
      <template v-else>
        <header class="dashboard-heading">
          <div>
            <h1>Welcome back, <span id="dashboard-user-first-name">{{ firstName }}</span></h1>
            <p>Here's your progress so far</p>
            <span class="dashboard-status-pill" :class="{ 'dashboard-status-pill-plan': canTakeAssessment }">{{ planLabel }}</span>
          </div>
          <div v-if="!isAdmin && (expiryDateLabel || canCancelSubscription)" class="dashboard-subscription">
            <p class="dashboard-summary-label">Your subscription</p>
            <p v-if="expiryDateLabel">Premium access ends <strong>{{ expiryDateLabel }}</strong></p>
            <button v-if="canCancelSubscription" ref="cancelButton" type="button" class="dashboard-button is-muted" :disabled="Boolean(refreshWarning)" @click="openCancellation">Cancel subscription</button>
          </div>
        </header>
        <p v-if="subscriptionMessage" class="dashboard-notice" role="status">{{ subscriptionMessage }}</p>
        <p v-if="refreshWarning" class="dashboard-notice" role="status">{{ refreshWarning }}</p>

        <section class="dashboard-summary-grid" aria-label="Your learning at a glance">
          <article class="dashboard-summary-card">
            <p class="dashboard-summary-label">Modules completed</p>
            <p class="dashboard-summary-value"><span id="completed-modules-count">{{ completedModulesCount }}</span><span class="dashboard-summary-of">/</span><span id="total-modules-count">{{ totalModulesCount }}</span></p>
            <div class="dashboard-meter" role="progressbar" :aria-valuenow="completionPercent" aria-valuemin="0" aria-valuemax="100" aria-label="Modules completed"><span :style="{ width: completionPercent + '%' }"></span></div>
          </article>
          <article class="dashboard-summary-card">
            <p class="dashboard-summary-label">Average quiz score</p><p id="average-quiz-score" class="dashboard-summary-value" :class="scoreClass(quizHistoryRows.length ? parseFloat(averageQuizScoreLabel) : null)">{{ averageQuizScoreLabel }}</p>
            <p class="dashboard-summary-note">{{ quizHistoryRows.length ? quizHistoryRows.length + ' recorded quiz attempts' : 'Complete a module quiz to get started' }}</p>
          </article>
          <article class="dashboard-summary-card">
            <p class="dashboard-summary-label">Awareness level</p><p id="awareness-level" class="dashboard-summary-value dashboard-summary-value-word">{{ awarenessLabel }}</p>
            <p v-if="hasAssessment" class="dashboard-summary-note">Scored {{ assessmentScoreLabel }}<span v-if="assessmentDateLabel"> on {{ assessmentDateLabel }}</span></p>
          </article>
          <article class="dashboard-summary-card">
            <p class="dashboard-summary-label">Weak areas found</p><p id="weak-areas-count" class="dashboard-summary-value" :class="{ 'dashboard-summary-value-word': !hasAssessment }">{{ hasAssessment ? weakAreas.length : 'Not assessed' }}</p>
            <p v-if="hasAssessment" class="dashboard-summary-note">{{ weakAreas.length === 1 ? 'topic to review' : 'topics to review' }}</p>
          </article>
        </section>

        <div class="dashboard-learning-grid">
          <section class="dashboard-recommendations" aria-labelledby="dashboard-recommendations-title">
            <div class="dashboard-section-heading dashboard-section-heading-row">
              <div><h2 id="dashboard-recommendations-title">Recommended for you</h2><p>{{ hasAssessment ? 'Based on your assessment results' : 'Suggested starting points for your learning' }}</p></div>
              <router-link :to="assessmentPath" class="dashboard-button is-gold"><svg v-if="canTakeAssessment && hasAssessment" class="dashboard-retry-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10a9 9 0 1 1 2 8M3 4v6h6" /></svg>{{ assessmentLinkLabel }}</router-link>
            </div>
            <ol v-if="recommendations.length" class="dashboard-recommendations-list">
              <li v-for="(module, index) in recommendations" :key="module.module_id || module.slug" class="dashboard-recommendation-card" :class="{ 'is-first': index === 0 }">
                <span class="dashboard-recommendation-number" aria-hidden="true">{{ index + 1 }}</span>
                <div class="dashboard-recommendation-copy"><span class="dashboard-recommended-label">{{ hasAssessment ? 'Recommended' : 'Suggested' }}{{ index === 0 ? ' · Start here' : '' }}</span><h3>{{ module.module_title }}</h3><p v-if="recommendationKind(module)">{{ recommendationKind(module) }}</p></div>
                <router-link v-bind="recommendationBind(module)" class="dashboard-button" :class="{ 'is-teal': index === 0 }">Start module <span aria-hidden="true">→</span></router-link>
              </li>
            </ol>
            <div v-else class="dashboard-state-card"><p class="dashboard-empty-copy">{{ hasAssessment ? 'No recommended modules yet. Complete a quiz to get additional suggestions.' : 'Browse the modules below, or take the Awareness Assessment for personalised recommendations.' }}</p></div>
            <router-link to="/modules/premium" class="dashboard-button dashboard-browse-button is-teal">Browse all 10 modules <span aria-hidden="true">→</span></router-link>
          </section>

          <section class="dashboard-assessment-panel" aria-labelledby="dashboard-assessment-title">
            <p class="dashboard-summary-label">Cybersecurity awareness assessment</p><h2 id="dashboard-assessment-title">Your awareness level</h2>
            <div class="dashboard-assessment-result">
              <div class="dashboard-score-ring" :class="scoreClass(assessmentPercent)" :style="{ '--score-progress': (assessmentPercent || 0) + '%' }" :aria-label="hasAssessment ? 'Assessment score: ' + assessmentScoreLabel : 'Not assessed'"><strong>{{ assessmentScoreLabel }}</strong></div>
              <div><h3>{{ awarenessLabel }}</h3><p v-if="hasAssessment">Scored {{ assessmentScoreLabel }}<span v-if="assessmentDateLabel"> on {{ assessmentDateLabel }}</span></p><p v-else>Discover where to focus next</p></div>
            </div>
            <p class="dashboard-assessment-copy">{{ awarenessCopy }}</p>
            <dl v-if="hasAssessment" class="dashboard-assessment-details"><div><dt>Assessment score</dt><dd :class="scoreClass(assessmentPercent)">{{ assessmentPercent == null ? 'Unavailable' : assessmentPercent + '%' }}</dd></div><div><dt>Topics to review</dt><dd>{{ weakAreas.length }}</dd></div><div><dt>Topics mastered</dt><dd>{{ masteredCount }}</dd></div></dl>
            <div v-else class="dashboard-assessment-details"><p>Realistic scenarios</p><p>Immediate results</p><p>Personalised recommendations</p></div>
            <div v-if="hasAssessment && recommendations.length" class="dashboard-assessment-next"><p class="dashboard-summary-label">Next recommended module</p><strong>{{ recommendations[0].module_title }}</strong><p>Review this topic, then retake the assessment to check your progress.</p></div><div class="dashboard-assessment-cta"><router-link :to="assessmentPath" class="dashboard-button is-gold"><svg v-if="canTakeAssessment && hasAssessment" class="dashboard-retry-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10a9 9 0 1 1 2 8M3 4v6h6" /></svg>{{ assessmentLinkLabel }}</router-link><p>10 scenario-based questions<span v-if="!canTakeAssessment"> · Premium feature</span></p></div>
          </section>
        </div>

        <section class="dashboard-premium-section" aria-labelledby="dashboard-premium-title">
          <div class="dashboard-premium-heading"><div><span class="dashboard-premium-tag">♛ Premium</span><h2 id="dashboard-premium-title">Explore premium courses</h2><p>Scenarios written for freelance and contract work. {{ canTakeAssessment ? 'Available with your current access.' : 'Unlock these courses with Premium.' }}</p></div><router-link to="/modules/premium" class="dashboard-button">See all modules <span aria-hidden="true">→</span></router-link></div>
          <div class="dashboard-premium-grid">
            <article v-for="course in premiumCourses" :key="course.slug" class="dashboard-course-card is-premium">
              <div class="dashboard-course-top"><span class="dashboard-course-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path :d="course.iconPath" /></svg></span><span class="dashboard-premium-tag">♛ Premium</span></div>
              <h3>{{ course.title }}</h3><p>{{ course.summary }}</p><div class="dashboard-course-bottom"><span>{{ courseStatus(course) }}</span><router-link :to="courseDestination(course)" class="dashboard-button is-gold">{{ canTakeAssessment ? 'Open course' : 'Unlock' }} <span aria-hidden="true">→</span></router-link></div>
            </article>
          </div>
        </section>

        <div class="dashboard-review-grid">
          <section aria-labelledby="dashboard-topics-title">
            <div class="dashboard-section-heading"><h2 id="dashboard-topics-title">{{ masteredCount ? 'Your topic progress' : 'Your weak areas' }}</h2><p>Topics to focus on next</p></div>
            <template v-if="hasAssessment && topicResults.length"><p class="dashboard-notice">{{ topicSummary }}</p><ul class="dashboard-weak-areas-list"><li v-for="area in topicResults" :key="area.slug" class="dashboard-weak-area" :class="area.statusClass"><div class="dashboard-weak-area-main"><div class="dashboard-topic-heading"><h3>{{ area.topic }}</h3><span class="dashboard-topic-status">{{ area.status }}</span></div><p class="dashboard-weak-area-score">{{ area.scoreLabel }}</p></div><div v-if="area.percent != null" class="dashboard-meter" role="progressbar" :aria-valuenow="area.percent" aria-valuemin="0" aria-valuemax="100" :aria-label="area.topic + ' assessment score'"><span :style="{ width: area.percent + '%' }"></span></div><router-link v-if="area.modulePath" :to="area.modulePath" class="dashboard-button dashboard-weak-area-action">{{ area.status === 'Mastered' ? 'Revisit topic' : 'Review topic' }} <span aria-hidden="true">→</span></router-link></li></ul></template>
            <p v-else-if="hasAssessment" class="dashboard-empty-copy">No topic results recorded yet.</p>
            <div v-else class="dashboard-state-card"><p class="dashboard-empty-copy">Topic results come from the Awareness Assessment, separately from your module quizzes.</p><router-link :to="assessmentPath" class="dashboard-button is-teal">{{ assessmentLinkLabel }}</router-link></div>
          </section>
          <section aria-labelledby="dashboard-history-title">
            <div class="dashboard-section-heading"><h2 id="dashboard-history-title">Quiz history</h2><p>Your module quiz scores</p><p class="dashboard-score-legend"><span class="score-strong">90–100% Strong</span><span class="score-developing">70–89% Developing</span><span class="score-needs-work">Below 70% Needs work</span></p></div>
            <ol v-if="quizHistoryRows.length" class="dashboard-quiz-history"><li v-for="row in quizHistoryRows" :key="row.key" class="dashboard-quiz-history-row"><div><h3>{{ row.title }}</h3><p>{{ row.scoreLabel }}</p><router-link v-if="row.modulePath" :to="row.modulePath" class="dashboard-history-link">Review module <span aria-hidden="true">→</span></router-link></div><strong :class="scoreClass(row.percentage)">{{ row.percentageLabel }}</strong></li></ol>
            <div v-else class="dashboard-state-card dashboard-history-empty"><span class="dashboard-history-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2h10l4 4v16H5zM15 2v5h4M8 11h8M8 15h8M8 19h5" /></svg></span><p>No quiz attempts yet. Complete a module quiz to see your scores here.</p><router-link to="/modules/premium" class="dashboard-button is-teal">Browse modules</router-link></div>
          </section>
        </div>
      </template>
    </section>
    <dialog ref="cancelDialog" class="dashboard-cancel-dialog" aria-labelledby="dashboard-cancel-title" aria-describedby="dashboard-cancel-description" @cancel="cancelBusy && $event.preventDefault()">
      <p class="dashboard-summary-label">Your subscription</p><div class="dashboard-cancel-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17h.01"/></svg></div><h2 id="dashboard-cancel-title">Are you sure you want to cancel Premium?</h2><p id="dashboard-cancel-description">Cancelling switches your account to Free immediately. You will lose access to Premium courses and the Awareness Assessment now, even if your displayed access end date is later.</p><div class="dashboard-cancel-warning"><strong>No refund is issued by this action.</strong><p>Your current cancellation ends Premium access immediately. It does not preserve access until the displayed end date.</p></div><p>Your completed module quizzes remain recorded.</p><p v-if="cancelError" class="form-error-message" role="alert">{{ cancelError }}</p><div class="dashboard-dialog-actions"><button type="button" class="dashboard-button is-muted" :disabled="cancelBusy" autofocus @click="closeCancellation">Keep Premium</button><button type="button" class="dashboard-button is-gold" :disabled="cancelBusy" @click="confirmCancellation">{{ cancelBusy ? 'Cancelling…' : 'Yes, cancel Premium' }}</button></div>
    </dialog>
  </main>
</template>

<script src="./Dashboard.js"></script>
