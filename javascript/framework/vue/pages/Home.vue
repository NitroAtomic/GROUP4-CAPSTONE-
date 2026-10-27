<template>
  <main class="home-page">
    <section id="home" class="home-hero page-band">
      <div class="home-hero-inner home-hero-layout">
        <div class="home-hero-text">
          <p class="home-hero-eyebrow">Security awareness for remote work</p>
          <h1>Social Engineering Awareness Platform</h1>
          <p class="home-hero-copy">
            Learn to recognise the phishing, smishing, vishing and pretexting aimed at
            remote workers, freelancers and virtual assistants. Six modules, free,
            no account needed.
          </p>
          <div class="home-hero-actions">
            <a href="#modules" class="home-hero-primary">Browse free modules</a>
            <router-link to="/premium-subscription" class="home-hero-secondary">Explore premium</router-link>
          </div>
        </div>
        <div class="home-hero-visual">
          <span class="home-hero-mark-wrap" aria-label="SE-AWARE platform logo"
            @pointerdown="setHeroMarkDirection" @pointermove="setHeroMarkDirection"
            @pointerup="resetHeroMarkDirection" @pointerleave="resetHeroMarkDirection"
            @pointercancel="resetHeroMarkDirection" @lostpointercapture="resetHeroMarkDirection">
            <img class="home-hero-mark" src="/images/icons/se-aware-logo-mark.png" alt="SE-AWARE logo" draggable="false">
          </span>
        </div>
      </div>
    </section>

    <section id="modules" class="modules-section">
      <div class="home-content">
        <div class="section-heading">
          <h2>Free modules</h2>
          <p>Five core attack types, each with a short quiz, plus the everyday practices that stop them.</p>
        </div>
        <div class="modules-grid">
          <router-link to="/modules/phishing" class="module-card">
            <div><h3>Phishing</h3><p>Email Scams, Fake Login Pages &amp; QR Code Phishing (Quishing)</p></div>
            <span class="module-icon-chip" aria-hidden="true"><svg class="ui-icon"><use href="#ui-icon-qr" /></svg></span>
          </router-link>
          <router-link to="/modules/spear-phishing" class="module-card">
            <div><h3>Spear Phishing</h3><p>Targeted Digital Surveillance</p></div>
            <span class="module-icon-chip" aria-hidden="true"><svg class="ui-icon"><use href="#ui-icon-target-mail" /></svg></span>
          </router-link>
          <router-link to="/modules/smishing" class="module-card">
            <div><h3>Smishing</h3><p>SMS &amp; Mobile Messaging Attacks</p></div>
            <span class="module-icon-chip" aria-hidden="true"><svg class="ui-icon"><use href="#ui-icon-mobile-message" /></svg></span>
          </router-link>
          <router-link to="/modules/vishing" class="module-card">
            <div><h3>Vishing</h3><p>Voice Phishing &amp; Social Engineering Calls</p></div>
            <span class="module-icon-chip" aria-hidden="true"><svg class="ui-icon"><use href="#ui-icon-phone" /></svg></span>
          </router-link>
          <router-link to="/modules/pretexting" class="module-card">
            <div><h3>Pretexting</h3><p>Trust-Building Manipulation</p></div>
            <span class="module-icon-chip" aria-hidden="true"><svg class="ui-icon"><use href="#ui-icon-identity" /></svg></span>
          </router-link>
          <router-link to="/modules/essential-safe-practices-remote-environments" class="module-card">
            <div><h3>Essential Safe Practices for Remote Environments</h3><p>Universal application across all remote and hybrid employment setups</p></div>
            <span class="module-icon-chip" aria-hidden="true"><svg class="ui-icon"><use href="#ui-icon-shield-check" /></svg></span>
          </router-link>
        </div>
      </div>
    </section>

    <section id="premium-modules" class="premium-section">
      <div class="home-content">
        <div class="section-heading premium-heading">
          <h2>Premium <span class="premium-badge">Pro</span></h2>
          <p>Role-based modules, personalized assessment and dashboard</p>
        </div>
        <div class="premium-grid">
          <router-link v-if="isPremium" to="/modules/premium" class="premium-card">
            <div><h3>Role-based<br>modules</h3><p>Freelancer and client scam scenarios</p></div>
            <span class="premium-card-icons"><span class="module-icon-chip" aria-hidden="true"><svg class="ui-icon"><use href="#ui-icon-recruiter" /></svg></span></span>
          </router-link>
          <article v-else class="premium-card">
            <div><h3>Role-based<br>modules</h3><p>Freelancer and client scam scenarios</p></div>
            <span class="premium-card-icons"><span class="module-icon-chip" aria-hidden="true"><svg class="ui-icon"><use href="#ui-icon-recruiter" /></svg></span><svg class="access-icon" role="img" aria-label="Premium access required"><use href="#ui-icon-lock" /></svg></span>
          </article>
          <router-link v-if="isPremium" to="/dashboard" class="premium-card">
            <div><h3>Personalized<br>dashboard</h3><p>Tracking progress, quiz history, weak areas</p></div>
            <span class="premium-card-icons"><span class="module-icon-chip" aria-hidden="true"><svg class="ui-icon"><use href="#ui-icon-chart" /></svg></span></span>
          </router-link>
          <article v-else class="premium-card">
            <div><h3>Personalized<br>dashboard</h3><p>Tracking progress, quiz history, weak areas</p></div>
            <span class="premium-card-icons"><span class="module-icon-chip" aria-hidden="true"><svg class="ui-icon"><use href="#ui-icon-chart" /></svg></span><svg class="access-icon" role="img" aria-label="Premium access required"><use href="#ui-icon-lock" /></svg></span>
          </article>
          <router-link v-if="isPremium" to="/assessment/question" class="premium-card">
            <div><h3>Awareness<br>assessment</h3><p>Find your current cybersecurity awareness level</p></div>
            <span class="premium-card-icons"><span class="module-icon-chip" aria-hidden="true"><svg class="ui-icon"><use href="#ui-icon-assessment" /></svg></span></span>
          </router-link>
          <article v-else class="premium-card">
            <div><h3>Awareness<br>assessment</h3><p>Find your current cybersecurity awareness level</p></div>
            <span class="premium-card-icons"><span class="module-icon-chip" aria-hidden="true"><svg class="ui-icon"><use href="#ui-icon-assessment" /></svg></span><svg class="access-icon" role="img" aria-label="Premium access required"><use href="#ui-icon-lock" /></svg></span>
          </article>
        </div>
        <div v-if="!isPremium" class="premium-action">
          <router-link to="/premium-subscription" class="btn btn-upgrade">Upgrade to premium</router-link>
        </div>
      </div>
    </section>

    <section id="professional-feedback" class="feedback-section" aria-labelledby="feedback-heading">
      <div class="home-content">
        <div class="feedback-heading">
          <span class="feedback-heading-icon" aria-hidden="true">
            <svg class="ui-icon"><use href="#ui-icon-shield-check" /></svg>
          </span>
          <div>
            <h2 id="feedback-heading">What cybersecurity professionals say about SE-AWARE</h2>
            <p>Feedback on SE-AWARE’s Free and Premium learning modules, interactive scenarios, and answer explanations.</p>
          </div>
        </div>
        <div class="feedback-grid">
          <article class="feedback-card feedback-card--featured">
            <p class="feedback-featured-label">
              <span>Featured feedback</span>
            </p>
            <svg class="feedback-quote-mark" viewBox="0 0 32 28" aria-hidden="true" focusable="false">
              <path d="M2 25V14C2 6.8 6.1 3 12.5 3v5.1c-3.4.3-5.2 2.2-5.2 5.2h5.2V25H2Zm16 0V14c0-7.2 4.1-11 10.5-11v5.1c-3.4.3-5.2 2.2-5.2 5.2h5.2V25H18Z" />
            </svg>
            <blockquote>
              <p><span class="feedback-quote-delimiter" aria-hidden="true">“</span>One of the system’s greatest strengths is its free learning modules, which make cybersecurity education accessible to users regardless of their technical background or financial capacity. These modules help users understand social engineering techniques, recognize potential cyber threats, avoid common scams, and make safer decisions online. Overall, the platform promotes cybersecurity awareness and empowers users to navigate the digital world more safely and responsibly.<span class="feedback-quote-delimiter" aria-hidden="true">”</span></p>
            </blockquote>
            <footer class="feedback-attribution">
              <svg class="feedback-profile-icon ui-icon" aria-hidden="true"><use href="#ui-icon-user" /></svg>
              <cite>Cybersecurity SOC Engineer</cite>
            </footer>
          </article>
          <article class="feedback-card feedback-card--support-one">
            <svg class="feedback-quote-mark" viewBox="0 0 32 28" aria-hidden="true" focusable="false">
              <path d="M2 25V14C2 6.8 6.1 3 12.5 3v5.1c-3.4.3-5.2 2.2-5.2 5.2h5.2V25H2Zm16 0V14c0-7.2 4.1-11 10.5-11v5.1c-3.4.3-5.2 2.2-5.2 5.2h5.2V25H18Z" />
            </svg>
            <blockquote>
              <p><span class="feedback-quote-delimiter" aria-hidden="true">“</span>It is informative, detailed, and user-friendly.<span class="feedback-quote-delimiter" aria-hidden="true">”</span></p>
            </blockquote>
            <footer class="feedback-attribution">
              <svg class="feedback-profile-icon ui-icon" aria-hidden="true"><use href="#ui-icon-user" /></svg>
              <cite>CyberSecurity Researcher, Tech Support Specialist</cite>
            </footer>
          </article>
          <article class="feedback-card feedback-card--support-two">
            <svg class="feedback-quote-mark" viewBox="0 0 32 28" aria-hidden="true" focusable="false">
              <path d="M2 25V14C2 6.8 6.1 3 12.5 3v5.1c-3.4.3-5.2 2.2-5.2 5.2h5.2V25H2Zm16 0V14c0-7.2 4.1-11 10.5-11v5.1c-3.4.3-5.2 2.2-5.2 5.2h5.2V25H18Z" />
            </svg>
            <blockquote>
              <p><span class="feedback-quote-delimiter" aria-hidden="true">“</span>It’s great to see projects like this being promoted in colleges and universities. Overall, it’s a great website.<span class="feedback-quote-delimiter" aria-hidden="true">”</span></p>
            </blockquote>
            <footer class="feedback-attribution">
              <svg class="feedback-profile-icon ui-icon" aria-hidden="true"><use href="#ui-icon-user" /></svg>
              <cite>Security Engineer</cite>
            </footer>
          </article>
          <article class="feedback-card feedback-card--full" data-feedback-final-card>
            <svg class="feedback-quote-mark" viewBox="0 0 32 28" aria-hidden="true" focusable="false">
              <path d="M2 25V14C2 6.8 6.1 3 12.5 3v5.1c-3.4.3-5.2 2.2-5.2 5.2h5.2V25H2Zm16 0V14c0-7.2 4.1-11 10.5-11v5.1c-3.4.3-5.2 2.2-5.2 5.2h5.2V25H18Z" />
            </svg>
            <blockquote>
              <p><span class="feedback-quote-delimiter" aria-hidden="true">“</span>The training material is well-designed and presented. It effectively explains incorrect answers and provides meaningful feedback, helping users understand why a particular choice is unsafe rather than simply being told that their answer is wrong.</p>
              <p>The interactive learning approach is another major strength, encouraging users to engage with the material, think through realistic scenarios, and apply the concepts they have learned.</p>
              <p>The user interface is intuitive, easy to navigate, and aesthetically pleasing, with an overall design that aligns well with the cybersecurity theme.</p>
              <p>Overall, excellent work on the training material and its presentation.<span class="feedback-quote-delimiter" aria-hidden="true">”</span></p>
            </blockquote>
            <footer class="feedback-attribution">
              <svg class="feedback-profile-icon ui-icon" aria-hidden="true"><use href="#ui-icon-user" /></svg>
              <cite>Vulnerability Analyst</cite>
            </footer>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Home from './Home.js'
export default {
  ...Home,
  methods: {
    ...(Home.methods || {}),
    setHeroMarkDirection(event) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        event.currentTarget.style.transform = ''
        return
      }
      if (event.type === 'pointerdown') event.currentTarget.setPointerCapture(event.pointerId)
      const bounds = event.currentTarget.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width))
      const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height))
      const rotateX = (0.5 - y) * 24
      const rotateY = (x - 0.5) * 24
      const translateX = (x - 0.5) * 6
      const translateY = (y - 0.5) * 6
      event.currentTarget.style.transform = `perspective(420px) translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    },
    resetHeroMarkDirection(event) {
      if (event.type === 'pointerleave' && event.currentTarget.hasPointerCapture(event.pointerId)) return
      event.currentTarget.style.transform = ''
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }
}
</script>
