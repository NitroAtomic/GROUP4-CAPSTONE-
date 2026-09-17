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
          <span class="subscription-progress-number" aria-hidden="true">✓</span>
          <span>Choose plan</span>
        </div>

        <div class="subscription-progress-line" aria-hidden="true"></div>

        <div class="subscription-progress-step subscription-progress-complete">
          <span class="subscription-progress-number" aria-hidden="true">✓</span>
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
          <img class="inline-crown-icon" src="/images/icons/crown-badge.png" alt="" aria-hidden="true">
          Premium plan • {{ planStore.billingLabel }}
        </span>

        <span>
          <strong>{{ planStore.price }}</strong>
          <small>{{ planStore.pricePeriod }}</small>
        </span>

      </div>


      <!-- =========================
           Simulation Notice
           AUTHENTICATION.md: "The page carries a prominent 'Simulation
           only' banner" — no real payment is processed, real-looking
           card numbers are rejected. See FR-10 / Scope & Limitations.
           ========================= -->

      <div class="payment-simulation-banner" role="note">
        <strong>Simulation only.</strong> No real payment is processed. Use
        demo card <strong>4242 4242 4242 4242</strong> with any future
        expiry and any 3-digit CVV.
      </div>


      <!-- =========================
           Payment Form
           ========================= -->

      <section class="payment-card">

        <div class="payment-card-heading">

          <h2>Payment details</h2>

          <p>
            Your subscription starts once payment is confirmed
          </p>

        </div>


        <form class="payment-form" @submit.prevent="submit" novalidate>

          <div class="payment-form-field">

            <label for="cardholder-name">
              Name on card
            </label>

            <input
              id="cardholder-name"
              v-model.trim="cardholderName"
              type="text"
              name="cardholder-name"
              autocomplete="cc-name"
              placeholder="Juan Dela Cruz"
              required
            >

          </div>


          <div class="payment-form-field">

            <label for="card-number">
              Card number
            </label>

            <input
              id="card-number"
              v-model="cardNumber"
              type="text"
              name="card-number"
              inputmode="numeric"
              autocomplete="cc-number"
              placeholder="1234 5678 9012 3456"
              required
            >

          </div>


          <div class="payment-card-details">

            <div class="payment-form-field">

              <label for="card-expiry">
                Expiry
              </label>

              <input
                id="card-expiry"
                v-model="cardExpiry"
                type="text"
                name="card-expiry"
                inputmode="numeric"
                autocomplete="cc-exp"
                placeholder="MM / YY"
                required
              >

            </div>


            <div class="payment-form-field">

              <label for="card-security-code">
                CVV
              </label>

              <input
                id="card-security-code"
                v-model="cardSecurityCode"
                type="text"
                name="card-security-code"
                inputmode="numeric"
                autocomplete="cc-csc"
                placeholder="123"
                required
              >

            </div>

          </div>


          <button
            type="submit"
            class="payment-subscribe-button"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Processing…' : 'Subscribe' }}
          </button>

          <p v-if="errorMessage" class="form-error-message" role="alert">
            {{ errorMessage }}
          </p>

        </form>

      </section>

    </section>

  </main>
</template>

<script src="./Payment.js"></script>
