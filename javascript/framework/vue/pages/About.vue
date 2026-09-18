<template>
  <main class="about-page">

    <section class="about-container">

      <div class="about-page-heading">
        <h1>About the platform</h1>
        <p>
          Helping remote workers recognize and defend against
          social engineering attacks, one module at a time.
        </p>
      </div>

      <section class="about-mission-section">
        <h2>Our mission</h2>
        <p>
          Remote workers and virtual assistants are increasingly
          targeted by phishing, impersonation, and other social
          engineering attacks, often without the in-house security
          training available to office-based employees. This platform
          was built to close that gap with free, accessible
          foundational training, and specialized role-based modules
          for those working directly with international clients.
        </p>
      </section>

      <section class="about-audience-section">
        <h2>Who it's for</h2>

        <div class="about-audience-grid">

          <article class="about-audience-card">
            <div class="about-audience-icon" aria-hidden="true">
              <img src="/images/icons/audience-remote-workers.png" alt="">
            </div>
            <h3>Remote workers</h3>
          </article>

          <article class="about-audience-card">
            <div class="about-audience-icon" aria-hidden="true">
              <img src="/images/icons/audience-freelancers.png" alt="">
            </div>
            <h3>Freelancers</h3>
          </article>

          <article class="about-audience-card">
            <div class="about-audience-icon" aria-hidden="true">
              <img src="/images/icons/audience-virtual-assistants.png" alt="">
            </div>
            <h3>Virtual assistants</h3>
          </article>

        </div>
      </section>

      <section class="about-team-section">
        <h2>Meet the team</h2>

        <div class="about-team-grid">

          <article class="about-team-member">
            <div class="about-team-member-image" aria-hidden="true">
              <img src="/images/icons/team-member-girl-1.png" alt="">
            </div>
            <h3>Shane Mishael Abrasaldo</h3>
            <p>Project Manager, Frontend Developer, UI/UX, AI Lead</p>
          </article>

          <article class="about-team-member">
            <div class="about-team-member-image" aria-hidden="true">
              <img src="/images/icons/team-member-boy-1.png" alt="">
            </div>
            <h3>Juan Paolo Dente</h3>
            <p>Backend Developer</p>
          </article>

          <article class="about-team-member">
            <div class="about-team-member-image" aria-hidden="true">
              <img src="/images/icons/team-member-boy-2.png" alt="">
            </div>
            <h3>Joshua Ricohermozo</h3>
            <p>Frontend Developer</p>
          </article>

          <article class="about-team-member">
            <div class="about-team-member-image" aria-hidden="true">
              <img src="/images/icons/team-member-boy-3.png" alt="">
            </div>
            <h3>Jyan Estanislao</h3>
            <p>Database Developer, Content Manager, QA Tester</p>
          </article>

          <article class="about-team-member">
            <div class="about-team-member-image" aria-hidden="true">
              <img src="/images/icons/team-member-girl-2.png" alt="">
            </div>
            <h3>Kim Charlotte Anicete</h3>
            <p>Content Manager, QA Tester</p>
          </article>

        </div>
      </section>

    </section>

  </main>
</template>

<script src="./About.js"></script>
<!-- Styles now load once, globally, via css/framework/tailwind/main.css (see main.js).
     Do not re-add a per-component <style src> here — see the note at the top
     of main.css for why that breaks the @layer components build. -->
