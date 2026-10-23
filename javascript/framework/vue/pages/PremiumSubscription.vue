<template>
  <main class="premium-page">
    <section class="premium-container">
      <!-- Premium Heading -->
      <div class="premium-page-heading">
        <div class="premium-crown-icon" aria-hidden="true">
          <img src="/images/icons/crown-hero.png" alt="">
        </div>
        <h1>Go premium</h1>
        <p>Unlock role-based modules and your personal dashboard</p>
      </div>

      <!-- Billing Options -->
      <div class="premium-billing-options">
        <button
          type="button"
          class="premium-billing-button"
          :class="{ 'premium-billing-button-active': !planStore.isYearly }"
          data-billing="monthly"
          :aria-pressed="!planStore.isYearly"
          @click="planStore.setBilling('monthly')"
        >Monthly</button>
        <button
          type="button"
          class="premium-billing-button"
          :class="{ 'premium-billing-button-active': planStore.isYearly }"
          data-billing="yearly"
          :aria-pressed="planStore.isYearly"
          @click="planStore.setBilling('yearly')"
        >
          Yearly <span class="premium-save-label">Save 33%</span>
        </button>
      </div>

      <!-- Premium Plan -->
      <section class="premium-plan-card" aria-labelledby="premium-plan-title">
        <div class="premium-plan-header">
          <div>
            <h2 id="premium-plan-title">Premium plan</h2>
            <p id="premium-billing-description">{{ planStore.billingDescription }}</p>
          </div>
          <div class="premium-plan-price">
            <strong>{{ planStore.price }}</strong>
            <span id="premium-price-period">{{ planStore.pricePeriod }}</span>
          </div>
        </div>

        <!-- Savings message spans the full card width beneath the price row -->
        <div v-if="!planStore.isYearly" class="premium-monthly-tip">
          <span class="premium-tip-bulb" aria-hidden="true">💡</span>
          <span>Pay yearly and save ₱589 a year.
            <button type="button" class="premium-switch-yearly" @click="planStore.setBilling('yearly')">Switch to yearly</button>
          </span>
        </div>

        <div v-else id="premium-yearly-savings" class="premium-yearly-savings">
          <div class="premium-yearly-copy">
            <strong>Save 33% with the Annual Plan</strong>
            <span>₱1,199/year instead of ₱1,788</span>
            <b>Save ₱589/year</b>
          </div>
          <div class="premium-yearly-perks">
            <span>Almost 4 months free</span>
            <span>About ₱100/month</span>
          </div>
        </div>

        <div class="premium-plan-divider"></div>
        <ul class="premium-features-list">
          <li>
            <svg class="premium-feature-check ui-icon" aria-hidden="true"><use href="#ui-icon-check" /></svg>
            <span>Role-based social engineering modules</span>
          </li>
          <li>
            <svg class="premium-feature-check ui-icon" aria-hidden="true"><use href="#ui-icon-check" /></svg>
            <span>Personalized learning dashboard</span>
          </li>
          <li>
            <svg class="premium-feature-check ui-icon" aria-hidden="true"><use href="#ui-icon-check" /></svg>
            <span>Progress and quiz history tracking</span>
          </li>
          <li>
            <svg class="premium-feature-check ui-icon" aria-hidden="true"><use href="#ui-icon-check" /></svg>
            <span>Cybersecurity awareness assessment</span>
          </li>
          <li>
            <svg class="premium-feature-check ui-icon" aria-hidden="true"><use href="#ui-icon-check" /></svg>
            <span>AI-recommended modules and weak areas explained based on the assessment</span>
          </li>
        </ul>
        <router-link :to="continueTo" class="premium-continue-button">
          {{ continueLabel }}
        </router-link>
      </section>

      <!-- Account Information: preserve existing account-state behavior -->
      <div class="premium-account-information">
        <template v-if="alreadyPremium">
          <p>You are already on Premium.</p>
        </template>
        <template v-else-if="isSignedIn">
          <p>Signed in as <strong>{{ authStore.user.email }}</strong></p>
          <p>Your plan is upgraded on this account &mdash; no new account needed.</p>
        </template>
        <template v-else>
          <p>You will create your account in the next step</p>
          <p>Already have an account? <router-link to="/login">Log in</router-link></p>
        </template>
      </div>
    </section>

    <!-- Free vs Premium Comparison -->
    <section class="premium-comparison-section" aria-labelledby="premium-comparison-title">
      <div class="premium-comparison-heading">
        <span class="premium-section-eyebrow">Free vs Premium</span>
        <h2 id="premium-comparison-title">See what you unlock</h2>
        <p>Start free with the foundational modules. Go premium when you want training built for your work, and a dashboard that shows you where to improve.</p>
      </div>
      <div class="premium-comparison-table-wrapper">
        <table class="premium-comparison-table">
          <thead>
            <tr>
              <th scope="col">What you get</th>
              <th scope="col">Free</th>
              <th scope="col" class="premium-highlight-column">Premium</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Free foundational modules<small>Phishing, spear phishing and more</small></td>
              <td class="comparison-check"><span aria-label="Included">✓</span></td>
              <td class="comparison-check premium-column"><span aria-label="Included">✓</span></td>
            </tr>
            <tr>
              <td>Module quizzes</td>
              <td class="comparison-check"><span aria-label="Included">✓</span></td>
              <td class="comparison-check premium-column"><span aria-label="Included">✓</span></td>
            </tr>
            <tr>
              <td>Role-based social engineering modules<small>Scenarios written for freelance and contract work</small></td>
              <td class="comparison-unavailable"><span aria-label="Not included">—</span></td>
              <td class="comparison-check premium-column"><span aria-label="Included">✓</span></td>
            </tr>
            <tr>
              <td>Personalized learning dashboard</td>
              <td class="comparison-unavailable"><span aria-label="Not included">—</span></td>
              <td class="comparison-check premium-column"><span aria-label="Included">✓</span></td>
            </tr>
            <tr>
              <td>Progress and quiz history tracking</td>
              <td class="comparison-unavailable"><span aria-label="Not included">—</span></td>
              <td class="comparison-check premium-column"><span aria-label="Included">✓</span></td>
            </tr>
            <tr>
              <td>Cybersecurity awareness assessment</td>
              <td class="comparison-unavailable"><span aria-label="Not included">—</span></td>
              <td class="comparison-check premium-column"><span aria-label="Included">✓</span></td>
            </tr>
            <tr>
              <td>AI-recommended modules and weak areas explained<small>Based on your assessment</small></td>
              <td class="comparison-unavailable"><span aria-label="Not included">—</span></td>
              <td class="comparison-check premium-column"><span aria-label="Included">✓</span></td>
            </tr>
            <tr class="comparison-price-row">
              <td>Price</td>
              <td>Free</td>
              <td class="premium-column"><strong>₱149/month</strong><small>or ₱1,199/year</small></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Final Premium CTA -->
    <section class="premium-final-cta" aria-labelledby="premium-final-title">
      <h2 id="premium-final-title">Ready to unlock premium?</h2>
      <p>
        Premium plan: {{ planStore.price }}{{ planStore.pricePeriod }}, cancel anytime.
        <template v-if="!planStore.isYearly"> Switch to yearly and <strong class="premium-final-saving">save ₱589.</strong></template>
        <template v-else> <strong class="premium-final-saving">Save ₱589 a year.</strong></template>
        <button type="button" class="premium-final-switch" @click="planStore.setBilling(planStore.isYearly ? 'monthly' : 'yearly')">{{ planStore.isYearly ? 'Switch to monthly' : 'Switch to yearly' }}</button>
      </p>
      <router-link :to="continueTo" class="premium-final-button">
        {{ continueLabel }}
      </router-link>
    </section>
  </main>
</template>

<script src="./PremiumSubscription.js"></script>
