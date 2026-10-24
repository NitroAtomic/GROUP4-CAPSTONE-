<template>
  <main class="account-creation-page">

    <section class="account-creation-container">

      <!-- =========================
           Premium Heading
           ========================= -->

      <div v-if="isFreeSignup" class="account-creation-heading free-signup-heading">
        <h1>Create a free account</h1>
        <p class="free-signup-lead">Save your quiz scores and track your progress on your dashboard. You can go premium any time.</p>
      </div>
      <div v-else class="account-creation-heading">
        <div class="premium-crown-icon" aria-hidden="true">
          <img src="/images/icons/crown-hero.png" alt="">
        </div>
        <h1>Go premium</h1>
      </div>


      <!-- =========================
           Subscription Progress
           ========================= -->

      <nav v-if="!isFreeSignup" class="subscription-progress" aria-label="Sign-up progress">

        <div class="subscription-progress-step subscription-progress-complete">
          <span class="subscription-progress-number" aria-hidden="true">
            <svg class="ui-icon" aria-hidden="true"><use href="#ui-icon-check" /></svg>
          </span>
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

      <div v-if="!isFreeSignup" class="selected-plan-summary">
        <span>
          <svg class="inline-crown-icon ui-icon" aria-hidden="true"><use href="#ui-icon-crown" /></svg>
          Premium plan • {{ planStore.billingLabel }}
        </span>
        <span>
          <strong>{{ planStore.price }}</strong>
          <small>{{ planStore.pricePeriod }}</small>
        </span>
        <router-link to="/premium-subscription" class="selected-plan-change">Change plan</router-link>
      </div>


      <!-- =========================
           Account Form
           ========================= -->

      <section class="account-creation-card">

        <div class="account-creation-card-heading">
          <h2>Create your account</h2>
          <p v-if="isFreeSignup">This is the account you'll use to log in.</p>
          <p v-else>
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
                :class="{ 'is-invalid': fieldError('firstName') }"
                :aria-invalid="fieldError('firstName') ? 'true' : 'false'"
                aria-describedby="first-name-error"
                @blur="markTouched('firstName')"
              >
              <p v-if="fieldError('firstName')" id="first-name-error" class="field-error-message">{{ fieldError('firstName') }}</p>
            </div>

            <div class="account-form-field">
              <label for="last-name">Last Name <span class="field-optional">(optional)</span></label>
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
              :class="{ 'is-invalid': fieldError('email') }"
              :aria-invalid="fieldError('email') ? 'true' : 'false'"
              aria-describedby="email-error"
              @blur="markTouched('email')"
            >
            <p v-if="fieldError('email')" id="email-error" class="field-error-message">{{ fieldError('email') }}</p>
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
                :class="{ 'is-invalid': fieldError('password') }"
                :aria-invalid="fieldError('password') ? 'true' : 'false'"
                aria-describedby="password-error"
                @blur="markTouched('password')"
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

            <p v-if="fieldError('password')" id="password-error" class="field-error-message">{{ fieldError('password') }}</p>

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
                :class="{ 'is-invalid': fieldError('confirmPassword') || (confirmPassword && !passwordsMatch) }"
                :aria-invalid="fieldError('confirmPassword') ? 'true' : 'false'"
                aria-describedby="confirm-password-error"
                @blur="markTouched('confirmPassword')"
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

            <p v-if="fieldError('confirmPassword') || (confirmPassword && !passwordsMatch)" id="confirm-password-error" class="field-error-message">
              {{ fieldError('confirmPassword') || "Passwords don't match." }}
            </p>

          </div>


          <button
            type="submit"
            class="continue-to-payment-button"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Creating account…' : (isFreeSignup ? 'Create account' : 'Continue to payment') }}
          </button>

          <p v-if="errorMessage" class="form-error-message" role="alert">
            {{ errorMessage }}
          </p>

        </form>

      </section>

      <p class="account-login-message">
        Already have an account?
        <router-link :to="loginLink">Log in instead</router-link>
      </p>

    </section>

  </main>
</template>

<script src="./CreateAccount.js"></script>
