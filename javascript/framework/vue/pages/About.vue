<template>
  <main class="about-page">
      <section class="about-hero page-band" aria-labelledby="about-title">
        <div class="about-hero-inner">
        <span class="about-hero-logo-shell">
          <span class="about-hero-logo-wrap" @pointerdown="tiltLogo" @pointermove="tiltLogo" @pointerup="resetLogo" @pointerleave="resetLogo" @pointercancel="resetLogo" @lostpointercapture="resetLogo">
            <img class="about-hero-logo" src="/images/icons/se-aware-logo-mark.png" alt="" aria-hidden="true">
          </span>
        </span>
        <p class="about-eyebrow">LEARN • RECOGNIZE • STAY SAFE</p>
        <h1 id="about-title">About the Platform</h1>
        <p class="about-hero-description">Helping remote workers recognize and defend against social engineering attacks, one module at a time.</p>
        </div>
      </section>

    <div class="about-container">
      <section class="about-section about-mission-section" aria-labelledby="about-mission-title">
        <div class="about-mission-grid">
          <div class="about-mission-copy">
            <p class="about-section-kicker">WHY WE BUILT THIS</p>
            <h2 id="about-mission-title">Our Mission</h2>
            <p>Remote workers and virtual assistants are increasingly targeted by phishing, impersonation, and other social engineering attacks, often without the in-house security training available to office-based employees.</p>
            <p>Our platform helps close that gap through free, accessible foundational training and specialized role-based learning for people working with clients and teams online.</p>
          </div>
          <div class="about-mission-features">
            <article class="about-feature-card"><span class="about-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M9 7h6M9 11h4"/></svg></span><div><h3>Accessible Learning</h3><p>Practical security awareness lessons designed for everyday remote work.</p></div></article>
            <article class="about-feature-card"><span class="about-feature-icon" aria-hidden="true"><svg class="ui-icon"><use href="#ui-icon-user-shield" /></svg></span><div><h3>Role-Based Training</h3><p>Targeted learning experiences for different roles and responsibilities.</p></div></article>
          </div>
        </div>
      </section>

      <section class="about-section about-audience-section" aria-labelledby="about-audience-title">
        <div class="about-section-heading"><p class="about-section-kicker">BUILT FOR YOUR WORKDAY</p><h2 id="about-audience-title">Who It's For</h2><p>Security awareness for people who work, collaborate, and communicate online.</p></div>
        <div class="about-audience-grid">
          <article class="about-audience-card"><span class="about-audience-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m2 10 10-8 10 8"/><path d="M4 9v12h16V9"/><rect x="7" y="12" width="10" height="6" rx="1"/><path d="M6 20h12"/></svg></span><h3>Remote Workers</h3><p>Protect your accounts, devices, and workplace communications.</p></article>
          <article class="about-audience-card"><span class="about-audience-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="12" rx="2"/><path d="M2 20h20l-2-4H4l-2 4Z"/></svg></span><h3>Freelancers</h3><p>Spot suspicious client requests and protect your independent work.</p></article>
          <article class="about-audience-card"><span class="about-audience-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="2" y="12" width="4" height="7" rx="2"/><rect x="18" y="12" width="4" height="7" rx="2"/><path d="M20 19c0 2-3 3-6 3h-2"/><path d="M9 22h3"/></svg></span><h3>Virtual Assistants</h3><p>Handle sensitive information and client access with confidence.</p></article>
        </div>
      </section>

      <section class="about-section about-plans-section" aria-labelledby="about-plans-title">
        <div class="about-section-heading"><p class="about-section-kicker">CHOOSE YOUR LEARNING PATH</p><h2 id="about-plans-title">Free Foundations. More Ways to Grow.</h2><p>Start with essential skills, then explore personalized learning when you're ready.</p></div>
        <div class="about-plans-grid">
          <article class="about-plan-card"><span class="about-plan-tag">FREE</span><h3>Foundational Learning</h3><p>Build everyday awareness at your own pace.</p><ul><li>Six foundational learning modules</li><li>Interactive examples and practice</li><li>Knowledge checks in applicable modules</li></ul><router-link class="about-button about-button-outline" to="/">Start Learning Free <span aria-hidden="true">→</span></router-link></article>
          <article class="about-plan-card about-plan-premium"><span class="about-plan-tag">PREMIUM</span><h3>Specialized Learning</h3><p>Go further with training tailored to your needs.</p><ul><li>Role-based security modules</li><li>Personalized learning dashboard</li><li>Cybersecurity awareness assessment</li></ul><router-link class="about-button about-button-orange" to="/subscription">Explore Premium <span aria-hidden="true">→</span></router-link></article>
        </div>
      </section>

      <section class="about-section about-how-section" aria-labelledby="about-how-title">
        <div class="about-section-heading"><p class="about-section-kicker">SIMPLE, PRACTICAL, INTERACTIVE</p><h2 id="about-how-title">How It Works</h2><p>Learn a concept, practice recognizing it, and check your understanding.</p></div>
        <div class="about-how-grid">
          <article class="about-how-card"><span class="about-step-number">01</span><span class="about-how-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18V4a2 2 0 0 1 2-2h3a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3a2 2 0 0 1 2 2v14h-5a4 4 0 0 0-4 3 4 4 0 0 0-4-3H3Z"/></svg></span><h3>Read</h3><p>Explore short lessons and relatable workplace situations.</p></article>
          <article class="about-how-card"><span class="about-step-number">02</span><span class="about-how-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg></span><h3>Practice</h3><p>Identify warning signs and choose safer responses.</p></article>
          <article class="about-how-card"><span class="about-step-number">03</span><span class="about-how-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3.5h6M8 10l2 2 4-4M8 16h8"/></svg></span><h3>Check Your Knowledge</h3><p>Take quizzes where available to reinforce what you've learned.</p></article>
        </div>
        <div class="about-cta"><div><h3>Ready to build safer online habits?</h3><p>Get started with foundational lessons or meet the people behind the platform.</p></div><div class="about-cta-actions"><router-link class="about-button about-button-orange" to="/">Start Learning</router-link><a class="about-button about-button-light" href="#meet-the-team">Contact the Team</a></div></div>
      </section>

      <section id="meet-the-team" class="about-section about-team-section" aria-labelledby="about-team-title">
        <div class="about-section-heading"><p class="about-section-kicker">THE PEOPLE BEHIND THE PLATFORM</p><h2 id="about-team-title">Meet the Team</h2><p>A group of student developers working to make cybersecurity awareness more approachable.</p></div>
        <div class="about-team-grid">
          <article v-for="member in team" :key="member.name" class="about-team-member"><div class="about-team-member-image"><img :src="member.image" :alt="`Illustration of ${member.name}`"></div><h3>{{ member.name }}</h3><div class="about-team-roles"><span v-for="role in member.roles" :key="role" class="about-team-role">{{ role }}</span></div><a class="about-team-email" :href="`mailto:${member.email}`"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></svg>{{ member.email }}</a></article>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
const team = [
  { name: 'Shane Mishael Abrasaldo', roles: ['Project Manager', 'Frontend Developer', 'UI/UX', 'AI Lead'], email: 'lr.smabrasaldo@mmdc.mcl.edu.ph', image: '/images/icons/team-member-girl-1.png' },
  { name: 'Juan Paolo Dente', roles: ['Backend Developer'], email: 'lr.jpdente@mmdc.mcl.edu.ph', image: '/images/icons/team-member-boy-1.png' },
  { name: 'Joshua Ricohermozo', roles: ['Frontend Developer'], email: 'lr.jricohermozo@mmdc.mcl.edu.ph', image: '/images/icons/team-member-boy-2.png' },
  { name: 'Jyan Estanislao', roles: ['Database Developer', 'Content Manager', 'QA Tester'], email: 'lr.jestanislao@mmdc.mcl.edu.ph', image: '/images/icons/team-member-boy-3.png' },
  { name: 'Kim Charlotte Anicete', roles: ['Content Manager', 'QA Tester'], email: 'lr.kcanicete@mmdc.mcl.edu.ph', image: '/images/icons/team-member-girl-2.png' }
]

function tiltLogo(event) {
  const element = event.currentTarget
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { element.style.transform = ''; return }
  if (event.type === 'pointerdown') element.setPointerCapture(event.pointerId)
  const bounds = element.getBoundingClientRect()
  const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width))
  const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height))
  element.style.transform = `perspective(420px) translate3d(${(x - 0.5) * 6}px, ${(y - 0.5) * 6}px, 0) rotateX(${(0.5 - y) * 24}deg) rotateY(${(x - 0.5) * 24}deg)`
}
function resetLogo(event) {
  const element = event.currentTarget
  if (event.type === 'pointerleave' && element.hasPointerCapture(event.pointerId)) return
  element.style.transform = ''
  if (event.pointerId !== undefined && element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId)
}
</script>
