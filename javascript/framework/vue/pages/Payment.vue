<template>
  <main class="payment-page">

    <section class="payment-container">

      <!-- =========================
           Premium Heading
           ========================= -->

      <div class="payment-heading">

        <div class="premium-crown-icon" aria-hidden="true">
          <img src="/images/icons/crown-hero.png" alt="">
        </div>

        <h1>Go premium</h1>

      </div>


      <!-- =========================
           Subscription Progress
           ========================= -->

      <nav class="subscription-progress" aria-label="Sign-up progress">

        <div class="subscription-progress-step subscription-progress-complete">
          <span class="subscription-progress-number" aria-hidden="true">
            <svg class="ui-icon" aria-hidden="true"><use href="#ui-icon-check" /></svg>
          </span>
          <span>Choose plan</span>
        </div>

        <div class="subscription-progress-line" aria-hidden="true"></div>

        <div class="subscription-progress-step subscription-progress-complete">
          <span class="subscription-progress-number" aria-hidden="true">
            <svg class="ui-icon" aria-hidden="true"><use href="#ui-icon-check" /></svg>
          </span>
          <span>Create account</span>
        </div>

        <div class="subscription-progress-line" aria-hidden="true"></div>

        <div class="subscription-progress-step subscription-progress-active">
          <span class="subscription-progress-number" aria-hidden="true">3</span>
          <span>Payment</span>
        </div>

      </nav>


      <!-- =========================
           Selected Plan Summary
           ========================= -->

      <div class="selected-plan-summary">
        <span>
          <svg class="inline-crown-icon ui-icon" aria-hidden="true"><use href="#ui-icon-crown" /></svg>
          Premium plan • {{ planStore.billingLabel }}
        </span>

        <span>
          <strong>{{ planStore.price }}</strong>
          <small>{{ planStore.pricePeriod }}</small>
        </span>

      </div>


      <!-- =========================
           Test mode notice

           Totoong payment gateway ito (PayMongo), naka-test mode lang.
           Dapat halata yun bago pa mag-click ang kahit sino, lalo na
           sa UAT kung saan iba-ibang tao ang susubok.
           ========================= -->

      <div class="payment-simulation-banner" role="note">
        <strong>Test mode.</strong> Payments go through PayMongo&rsquo;s
        sandbox, so no real money moves. Use test card
        <strong>4343 4343 4343 4345</strong> with any future expiry and any
        3-digit CVC, or pick GCash and choose <em>Authorize</em> on the
        test page.
      </div>


      <!-- =========================
           Handoff to PayMongo

           Walang card field dito at hindi ito aksidente. Yung PayMongo
           ang nag-ho-host ng checkout page, kaya walang card number na
           dumaraan o naiimbak sa server natin.
           ========================= -->

      <section class="payment-card">

        <div class="payment-card-heading">

          <h2>Payment details</h2>

          <p>
            You&rsquo;ll be taken to PayMongo&rsquo;s secure checkout to pay.
            Your subscription starts once the payment is confirmed.
          </p>

        </div>

        <ul class="payment-assurance-list">
          <li>
            <svg class="ui-icon" aria-hidden="true"><use href="#ui-icon-check" /></svg>
            Card details are entered on PayMongo&rsquo;s page, never on ours
          </li>
          <li>
            <svg class="ui-icon" aria-hidden="true"><use href="#ui-icon-check" /></svg>
            Premium is unlocked only after PayMongo confirms the payment
          </li>
          <li>
            <svg class="ui-icon" aria-hidden="true"><use href="#ui-icon-check" /></svg>
            Every attempt is recorded against your account
          </li>
        </ul>

        <p v-if="wasCancelled" class="payment-cancelled-note" role="status">
          You came back without completing the payment. Your account is
          unchanged &mdash; you can try again whenever you&rsquo;re ready.
        </p>

        <button
          type="button"
          class="payment-subscribe-button"
          :disabled="isSubmitting || !paymentsAvailable"
          @click="pay"
        >
          {{ isSubmitting ? 'Taking you to PayMongo…' : 'Continue to payment' }}
        </button>

        <p v-if="errorMessage" class="form-error-message" role="alert">
          {{ errorMessage }}
        </p>

      </section>

    </section>

  </main>
</template>

<script src="./Payment.js"></script>
