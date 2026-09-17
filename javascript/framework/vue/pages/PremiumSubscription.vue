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
            Save
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
              Save compared to paying monthly
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
            <span class="premium-feature-check">✓</span>

            <span>
              Role-based social engineering modules
            </span>
          </li>

          <li>
            <span class="premium-feature-check">✓</span>

            <span>
              Personalized learning dashboard
            </span>
          </li>

          <li>
            <span class="premium-feature-check">✓</span>

            <span>
              Progress and quiz history tracking
            </span>
          </li>

          <li>
            <span class="premium-feature-check">✓</span>

            <span>
              Cybersecurity awareness assessment
            </span>
          </li>

          <li>
            <span class="premium-feature-check">✓</span>

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
          to="/create-account"
          class="premium-continue-button"
        >
          Continue
        </router-link>

      </section>


      <!-- =========================
           Account Information
           ========================= -->

      <div class="premium-account-information">

        <p>
          You will create your account in the next step
        </p>

        <p>
          Already have an account?
          <router-link to="/login">Log in</router-link>
        </p>

      </div>

    </section>

  </main>
</template>

<script src="./PremiumSubscription.js"></script>
