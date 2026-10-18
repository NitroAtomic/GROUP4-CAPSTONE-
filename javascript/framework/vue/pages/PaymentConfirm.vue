<template>
  <main class="payment-page">

    <section class="payment-container payment-confirm">

      <!-- Checking -->
      <div v-if="state === 'checking'" class="payment-confirm-panel">
        <div class="payment-confirm-spinner" aria-hidden="true"></div>
        <h1>Confirming your payment</h1>
        <p>
          We&rsquo;re checking with PayMongo. This usually takes a few seconds.
        </p>
      </div>

      <!-- Paid -->
      <div v-else-if="state === 'paid'" class="payment-confirm-panel payment-confirm-ok">
        <div class="payment-confirm-badge" aria-hidden="true">
          <svg class="ui-icon" aria-hidden="true"><use href="#ui-icon-check" /></svg>
        </div>
        <h1>You&rsquo;re on Premium</h1>
        <p>
          Your payment came through and your account has been upgraded.
          The role-based modules and the awareness assessment are open now.
        </p>
        <p class="payment-confirm-reference">
          Reference <strong>{{ reference }}</strong>
        </p>
        <button type="button" class="payment-subscribe-button" @click="goToDashboard">
          Go to dashboard
        </button>
      </div>

      <!-- Paid pa rin naman siya, hindi lang pa dumadating. Hindi ito
           error: mabagal lang minsan kumpirmahin ng e-wallet. -->
      <div v-else-if="state === 'unpaid'" class="payment-confirm-panel payment-confirm-pending">
        <h1>No payment yet</h1>
        <p>{{ message }}</p>
        <p class="payment-confirm-reference">
          Reference <strong>{{ reference }}</strong>
        </p>
        <div class="payment-confirm-actions">
          <button type="button" class="payment-subscribe-button" @click="check">
            Check again
          </button>
          <router-link class="payment-confirm-secondary" to="/payment">
            Back to payment
          </router-link>
        </div>
      </div>

      <!-- Error -->
      <div v-else class="payment-confirm-panel payment-confirm-error">
        <h1>We couldn&rsquo;t confirm this</h1>
        <p>{{ message }}</p>
        <div class="payment-confirm-actions">
          <button type="button" class="payment-subscribe-button" @click="check">
            Try again
          </button>
          <router-link class="payment-confirm-secondary" to="/payment">
            Back to payment
          </router-link>
        </div>
      </div>

    </section>

  </main>
</template>

<script src="./PaymentConfirm.js"></script>
