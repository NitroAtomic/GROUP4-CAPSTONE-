<template>
  <main class="forgot-password-page">

    <section class="forgot-password-container">

      <div class="forgot-password-icon" aria-hidden="true">
        <img src="/images/icons/envelope.png" alt="">
      </div>

      <h1>Check your email</h1>

      <p class="forgot-password-description">
        We've sent a password reset code to
      </p>

      <p class="forgot-password-email">
        {{ email || 'your email address' }}
      </p>

      <!-- The real backend (backend-node/routes/auth.js) resets a password
           by taking the emailed code and the new password together in one
           call — there's no separate reset-token link to click. So this
           screen, unlike the legacy static page, also collects the code
           and the new password directly. -->
      <form class="forgot-password-reset-form" @submit.prevent="submitReset" novalidate>

        <div class="forgot-password-field">
          <label for="reset-code">Reset code</label>
          <input
            id="reset-code"
            v-model.trim="code"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="6"
            placeholder="123456"
            required
          >
        </div>

        <div class="forgot-password-field">
          <label for="new-password">New password</label>
          <input
            id="new-password"
            v-model="newPassword"
            type="password"
            autocomplete="new-password"
            placeholder="At least 8 characters"
            required
          >
        </div>

        <button
          type="submit"
          class="forgot-password-submit-button"
          :disabled="!canSubmit || isSubmitting"
        >
          {{ isSubmitting ? 'Resetting…' : 'Reset password' }}
        </button>

        <p v-if="errorMessage" class="form-error-message" role="alert">
          {{ errorMessage }}
        </p>

        <p v-if="successMessage" class="form-success-message">
          {{ successMessage }}
        </p>

      </form>

      <button
        type="button"
        class="forgot-password-submit-button"
        :disabled="isResending"
        @click="resend"
      >
        {{ isResending ? 'Resending…' : 'Resend code' }}
      </button>

      <p v-if="resendMessage" class="form-helper-text">
        {{ resendMessage }}
      </p>

      <router-link to="/login" class="forgot-password-inside-link">
        Back to log in
      </router-link>

    </section>

  </main>
</template>

<script src="./ForgotPasswordConfirmation.js"></script>
