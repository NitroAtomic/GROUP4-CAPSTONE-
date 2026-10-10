<template>
  <main class="notfound-page">
    <section class="notfound-panel">
      <p class="notfound-code">404</p>
      <h1>That page isn&rsquo;t here</h1>
      <p>
        The address may be mistyped, or the page may have moved. Nothing is
        wrong with your account.
      </p>
      <div class="notfound-actions">
        <router-link to="/" class="notfound-primary">Back to home</router-link>
        <router-link to="/dashboard" class="notfound-secondary">Go to dashboard</router-link>
      </div>
    </section>
  </main>
</template>
