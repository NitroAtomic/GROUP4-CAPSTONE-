<template>
  <main class="forgot-password-page">

    <section class="forgot-password-container">

      <div class="forgot-password-icon" aria-hidden="true">
        <img src="/images/icons/padlock.png" alt="">
      </div>

      <h1>Forgot password</h1>

      <p class="forgot-password-description">
        Enter your email and we'll send you a code to reset it.
      </p>

      <form class="forgot-password-form" @submit.prevent="submit" novalidate>

        <div class="forgot-password-field">
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

        <button
          type="submit"
          class="forgot-password-submit-button"
          :disabled="!isEmailValid || isSubmitting"
        >
          {{ isSubmitting ? 'Sending…' : 'Send reset code' }}
        </button>

        <p v-if="errorMessage" class="form-error-message" role="alert">
          {{ errorMessage }}
        </p>

      </form>

    </section>

    <router-link to="/login" class="forgot-password-back-link">
      Back to log in
    </router-link>

  </main>
</template>

<script src="./ForgotPassword.js"></script>
