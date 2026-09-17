<template>
  <main class="login-page">

    <section class="login-container">

      <!-- Step 1: email + password -->
      <template v-if="step === 'credentials'">

        <h1>Welcome back!</h1>
        <p class="login-description">
          Log in to continue your learning journey.
        </p>

        <form class="login-form" @submit.prevent="submitLogin" novalidate>

          <div class="login-form-field">
            <label for="email">Email</label>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="Enter your email"
              required
            >
          </div>

          <div class="login-form-field">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              name="password"
              autocomplete="current-password"
              placeholder="Enter your password"
              required
            >
          </div>

          <router-link to="/forgot-password" class="forgot-password-link">
            Forgot password?
          </router-link>

          <button type="submit" class="login-submit-button" :disabled="isSubmitting">
            {{ isSubmitting ? 'Logging in…' : 'Log in' }}
          </button>

          <p v-if="errorMessage" class="form-error-message" role="alert">
            {{ errorMessage }}
          </p>

        </form>

        <div class="login-divider">
          <span>No account yet?</span>
        </div>

        <router-link to="/create-account" class="btn btn-login-create-account">
          <img class="inline-crown-icon" src="/images/icons/crown-badge.png" alt="" aria-hidden="true">
          Go premium to create an account
        </router-link>

      </template>

      <!-- Step 2: OTP code (FR-20 — Premium accounts only) -->
      <template v-else>

        <h1>Check your email</h1>
        <p class="login-description">
          We sent a 6-digit code to <strong>{{ otpEmail }}</strong>.
          It expires in a few minutes.
        </p>

        <form class="login-form" @submit.prevent="submitOtp" novalidate>

          <div class="login-form-field">
            <label for="otp-code">Verification code</label>
            <input
              id="otp-code"
              v-model.trim="otpCode"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="6"
              placeholder="123456"
              required
            >
          </div>

          <button type="submit" class="login-submit-button" :disabled="isSubmitting">
            {{ isSubmitting ? 'Verifying…' : 'Verify and log in' }}
          </button>

          <p v-if="errorMessage" class="form-error-message" role="alert">
            {{ errorMessage }}
          </p>

          <p v-if="resendMessage" class="form-helper-text">
            {{ resendMessage }}
          </p>
        </form>

        <p class="create-account-text">
          Didn't get a code?
          <a href="#" @click.prevent="resendCode">Resend code</a>
        </p>

      </template>

    </section>

  </main>
</template>

<script src="./Login.js"></script>
