<template>
  <main class="home-page">
    <section id="home" class="home-hero page-band">
      <div class="home-hero-inner">
        <p class="home-hero-eyebrow">Hello! Where do you need help in?</p>
        <h1>Social Engineering Awareness Platform</h1>
        <p class="home-hero-copy">Foundations of social engineering for remote workers</p>
        <div class="home-hero-actions">
          <a href="#modules" class="home-hero-primary">Browse free modules</a>
          <router-link to="/premium-subscription" class="home-hero-secondary">Explore premium</router-link>
        </div>
      </div>
    </section>

    <section id="modules" class="modules-section">
      <div class="home-content">
        <div class="section-heading">
          <h2>Free modules</h2>
          <p>Foundations of social engineering for remote workers</p>
        </div>

        <div class="modules-grid">
          <router-link to="/modules/quishing" class="module-card">
            <div>
              <h3>Quishing</h3>
              <p>Email Phishing, Fake Login Pages & QR Code Exploits</p>
            </div>
            <span class="module-icon-chip" aria-hidden="true">
              <svg class="ui-icon"><use href="#ui-icon-qr" /></svg>
            </span>
          </router-link>

          <router-link to="/modules/spear-phishing" class="module-card">
            <div>
              <h3>Spear Phishing</h3>
              <p>Targeted Digital Surveillance</p>
            </div>
            <span class="module-icon-chip" aria-hidden="true">
              <svg class="ui-icon"><use href="#ui-icon-target-mail" /></svg>
            </span>
          </router-link>

          <router-link to="/modules/smishing" class="module-card">
            <div>
              <h3>Smishing</h3>
              <p>SMS & Mobile Messaging Attacks</p>
            </div>
            <span class="module-icon-chip" aria-hidden="true">
              <svg class="ui-icon"><use href="#ui-icon-mobile-message" /></svg>
            </span>
          </router-link>

          <router-link to="/modules/vishing" class="module-card">
            <div>
              <h3>Vishing</h3>
              <p>Voice Phishing & Social Engineering Calls</p>
            </div>
            <span class="module-icon-chip" aria-hidden="true">
              <svg class="ui-icon"><use href="#ui-icon-phone" /></svg>
            </span>
          </router-link>

          <router-link to="/modules/pretexting" class="module-card">
            <div>
              <h3>Pretexting</h3>
              <p>Trust-Building Manipulation</p>
            </div>
            <span class="module-icon-chip" aria-hidden="true">
              <svg class="ui-icon"><use href="#ui-icon-identity" /></svg>
            </span>
          </router-link>

          <router-link to="/modules/essential-safe-practices-remote-environments" class="module-card">
            <div>
              <h3>Essential Safe Practices for Remote Environments</h3>
              <p>Universal application across all remote and hybrid employment setups</p>
            </div>
            <span class="module-icon-chip" aria-hidden="true">
              <svg class="ui-icon"><use href="#ui-icon-shield-check" /></svg>
            </span>
          </router-link>
        </div>
      </div>
    </section>

    <section id="premium-modules" class="premium-section">
      <div class="home-content">
        <div class="section-heading premium-heading">
          <h2>
            Premium
            <span class="premium-badge">Pro</span>
          </h2>

          <p>
            Role-based modules, personalized assessment and dashboard
          </p>
        </div>

        <div class="premium-grid">
          <router-link v-if="isPremium" to="/modules/premium" class="premium-card">
            <div>
              <h3>Role-based<br>modules</h3>
              <p>Freelancer and client scam scenarios</p>
            </div>
            <span class="premium-card-icons">
              <span class="module-icon-chip" aria-hidden="true">
                <svg class="ui-icon"><use href="#ui-icon-recruiter" /></svg>
              </span>
            </span>
          </router-link>
          <article v-else class="premium-card">
            <div>
              <h3>Role-based<br>modules</h3>
              <p>Freelancer and client scam scenarios</p>
            </div>
            <span class="premium-card-icons">
              <span class="module-icon-chip" aria-hidden="true">
                <svg class="ui-icon"><use href="#ui-icon-recruiter" /></svg>
              </span>
              <svg class="access-icon" role="img" aria-label="Premium access required"><use href="#ui-icon-lock" /></svg>
            </span>
          </article>

          <router-link v-if="isPremium" to="/dashboard" class="premium-card">
            <div>
              <h3>Personalized<br>dashboard</h3>
              <p>Tracking progress, quiz history, weak areas</p>
            </div>
            <span class="premium-card-icons">
              <span class="module-icon-chip" aria-hidden="true">
                <svg class="ui-icon"><use href="#ui-icon-chart" /></svg>
              </span>
            </span>
          </router-link>
          <article v-else class="premium-card">
            <div>
              <h3>Personalized<br>dashboard</h3>
              <p>Tracking progress, quiz history, weak areas</p>
            </div>
            <span class="premium-card-icons">
              <span class="module-icon-chip" aria-hidden="true">
                <svg class="ui-icon"><use href="#ui-icon-chart" /></svg>
              </span>
              <svg class="access-icon" role="img" aria-label="Premium access required"><use href="#ui-icon-lock" /></svg>
            </span>
          </article>

          <!-- Dati laging naka-lock tong card kahit premium ka na, kasi
               article sya palagi, hindi router-link. -->
          <router-link v-if="isPremium" to="/assessment/question" class="premium-card">
            <div>
              <h3>Awareness<br>assessment</h3>
              <p>Find your current cybersecurity awareness level</p>
            </div>
            <span class="premium-card-icons">
              <span class="module-icon-chip" aria-hidden="true">
                <svg class="ui-icon"><use href="#ui-icon-assessment" /></svg>
              </span>
            </span>
          </router-link>
          <article v-else class="premium-card">
            <div>
              <h3>Awareness<br>assessment</h3>
              <p>Find your current cybersecurity awareness level</p>
            </div>
            <span class="premium-card-icons">
              <span class="module-icon-chip" aria-hidden="true">
                <svg class="ui-icon"><use href="#ui-icon-assessment" /></svg>
              </span>
              <svg class="access-icon" role="img" aria-label="Premium access required"><use href="#ui-icon-lock" /></svg>
            </span>
          </article>
        </div>

        <div v-if="!isPremium" class="premium-action">
          <router-link to="/premium-subscription" class="btn btn-upgrade">
            Upgrade to premium
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script src="./Home.js"></script>
<!-- Styles now load once, globally, via css/framework/tailwind/main.css (see main.js).
     Do not re-add a per-component <style src> here — see the note at the top
     of main.css for why that breaks the @layer components build. -->