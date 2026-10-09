<template>
  <main class="premium-page">

    <section class="premium-container">

      <!-- =========================
           Premium Heading
           ========================= -->

      <div class="premium-page-heading">

        <div class="premium-crown-icon" aria-hidden="true">
          <img src="/images/icons/crown-hero.png" alt="">
        </div>

        <h1>Go premium</h1>

        <p>
          Unlock role-based modules and your personal dashboard
        </p>

      </div>


      <!-- =========================
           Billing Options
           ========================= -->

      <div class="premium-billing-options">

        <button
          type="button"
          class="premium-billing-button"
          :class="{ 'premium-billing-button-active': !planStore.isYearly }"
          data-billing="monthly"
          @click="planStore.setBilling('monthly')"
        >
          Monthly
        </button>

        <button
          type="button"
          class="premium-billing-button"
          :class="{ 'premium-billing-button-active': planStore.isYearly }"
          data-billing="yearly"
          @click="planStore.setBilling('yearly')"
        >
          Yearly

          <span class="premium-save-label">
            Save 33%
          </span>
        </button>

      </div>


      <!-- =========================
           Premium Plan
           ========================= -->

      <section class="premium-plan-card">

        <div class="premium-plan-header">

          <div>
            <h2>Premium plan</h2>

            <p id="premium-billing-description">
              {{ planStore.billingDescription }}
            </p>

            <p
              v-if="planStore.isYearly"
              id="premium-yearly-savings"
              class="premium-yearly-savings"
            >
              <strong>Save 33% with the Annual Plan</strong>
              <span>₱1,199/year instead of ₱1,788</span>
              <span>Save ₱589/year</span>
            </p>
          </div>


          <div class="premium-plan-price">
            <strong>{{ planStore.price }}</strong>

            <span id="premium-price-period">
              {{ planStore.pricePeriod }}
            </span>
          </div>

        </div>


        <div class="premium-plan-divider"></div>


        <!-- =========================
             Premium Features
             ========================= -->

        <ul class="premium-features-list">

          <li>
            <svg class="premium-feature-check ui-icon" aria-hidden="true"><use href="#ui-icon-check" /></svg>

            <span>
              Role-based social engineering modules
            </span>
          </li>

          <li>
            <svg class="premium-feature-check ui-icon" aria-hidden="true"><use href="#ui-icon-check" /></svg>

            <span>
              Personalized learning dashboard
            </span>
          </li>

          <li>
            <svg class="premium-feature-check ui-icon" aria-hidden="true"><use href="#ui-icon-check" /></svg>

            <span>
              Progress and quiz history tracking
            </span>
          </li>

          <li>
            <svg class="premium-feature-check ui-icon" aria-hidden="true"><use href="#ui-icon-check" /></svg>

            <span>
              Cybersecurity awareness assessment
            </span>
          </li>

          <li>
            <svg class="premium-feature-check ui-icon" aria-hidden="true"><use href="#ui-icon-check" /></svg>

            <span>
              AI-recommended modules and weak areas explained
              based on the assessment
            </span>
          </li>

        </ul>


        <!-- =========================
             Continue Button
             ========================= -->

        <router-link
          :to="continueTo"
          class="premium-continue-button"
        >
          {{ continueLabel }}
        </router-link>

      </section>


      <!-- =========================
           Account Information
           ========================= -->

      <!-- Iba yung sinasabi depende kung may account ka na. Dati, "you
           will create your account in the next step" ang nakasulat kahit
           naka-login ka na — at doon mismo nabubunggo yung may Free
           account na: dinadala siya sa paggawa ng account gamit yung
           email na mayroon na siya. -->
      <div class="premium-account-information">

        <template v-if="alreadyPremium">
          <p>You are already on Premium.</p>
        </template>

        <template v-else-if="isSignedIn">
          <p>
            Signed in as <strong>{{ authStore.user.email }}</strong>
          </p>
          <p>
            Your plan is upgraded on this account &mdash; no new account needed.
          </p>
        </template>

        <template v-else>
          <p>
            You will create your account in the next step
          </p>
          <p>
            Already have an account?
            <router-link to="/login">Log in</router-link>
          </p>
        </template>

      </div>

    </section>

  </main>
</template>

<script src="./PremiumSubscription.js"></script>
