<template>
  <main class="account-creation-page">

    <section class="account-creation-container">

      <!-- =========================
           Premium Heading
           ========================= -->

      <div class="account-creation-heading">
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

        <div class="subscription-progress-step subscription-progress-active">
          <span class="subscription-progress-number" aria-hidden="true">2</span>
          <span>Create account</span>
        </div>

        <div class="subscription-progress-line" aria-hidden="true"></div>

        <div class="subscription-progress-step">
          <span class="subscription-progress-number" aria-hidden="true">3</span>
          <span>Payment</span>
        </div>

      </nav>


      <!-- =========================
           Selected Plan Summary
           Price is still "Price TBD" (Handoff Notes: final pricing not
           decided). Billing period reads live from the Pinia plan store,
           set on PremiumSubscription.vue and carried through Create
           Account and Payment per the Handoff Notes.
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
           Account Form
           ========================= -->

      <section class="account-creation-card">

        <div class="account-creation-card-heading">
          <h2>Create your account</h2>
          <p>
            This is the account you'll use to log in and access
            premium features
          </p>
        </div>

        <form class="account-creation-form" @submit.prevent="submit" novalidate>

          <div class="account-name-fields">

            <div class="account-form-field">
              <label for="first-name">First Name</label>
              <input
                id="first-name"
                v-model.trim="firstName"
                type="text"
                name="first-name"
                autocomplete="given-name"
                placeholder="Juan"
                required
              >
            </div>

            <div class="account-form-field">
              <label for="last-name">Last Name</label>
              <input
                id="last-name"
                v-model.trim="lastName"
                type="text"
                name="last-name"
                autocomplete="family-name"
                placeholder="Dela Cruz"
              >
            </div>

          </div>


          <div class="account-form-field">
            <label for="email">Email</label>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="name@email.com"
              required
            >
          </div>


          <div class="account-form-field">

            <label for="password">Password</label>

            <div class="password-input-container">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                autocomplete="new-password"
                placeholder="Create a password"
                required
              >

              <button
                type="button"
                class="password-visibility-button"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                <img
                  :src="showPassword ? '/images/icons/eye-hide.png' : '/images/icons/eye-show.png'"
                  alt=""
                >
              </button>
            </div>

            <div class="password-requirements">

              <p>Your password must contain at least:</p>

              <div class="password-requirements-grid">
                <span :class="{ 'password-requirement-valid': passwordRules.length }">
                  8 characters
                </span>
                <span :class="{ 'password-requirement-valid': passwordRules.lowercase }">
                  1 lowercase letter (a-z)
                </span>
                <span :class="{ 'password-requirement-valid': passwordRules.special }">
                  1 special character
                </span>
                <span :class="{ 'password-requirement-valid': passwordRules.uppercase }">
                  1 uppercase letter (A-Z)
                </span>
                <span :class="{ 'password-requirement-valid': passwordRules.number }">
                  1 number (0-9)
                </span>
              </div>

            </div>

          </div>


          <div class="account-form-field">

            <label for="confirm-password">Confirm Password</label>

            <div class="password-input-container">
              <input
                id="confirm-password"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                name="confirm-password"
                autocomplete="new-password"
                placeholder="Re-enter your password"
                required
              >

              <button
                type="button"
                class="password-visibility-button"
                :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <img
                  :src="showConfirmPassword ? '/images/icons/eye-hide.png' : '/images/icons/eye-show.png'"
                  alt=""
                >
              </button>
            </div>

            <p v-if="confirmPassword && !passwordsMatch" class="form-error-message">
              Passwords don't match.
            </p>

          </div>


          <button
            type="submit"
            class="continue-to-payment-button"
            :disabled="!canSubmit || isSubmitting"
          >
            {{ isSubmitting ? 'Creating account…' : 'Continue to payment' }}
          </button>

          <p v-if="errorMessage" class="form-error-message" role="alert">
            {{ errorMessage }}
          </p>

        </form>

      </section>

      <p class="account-login-message">
        Already have an account?
        <router-link to="/login">Log in instead</router-link>
      </p>

    </section>

  </main>
</template>

<script src="./CreateAccount.js"></script>
