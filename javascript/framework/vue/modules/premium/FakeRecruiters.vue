<template>
  <div class="module-page premium-role-module">
    <!-- Premium Badge -->
    <div class="premium-badge">
      <svg class="ui-icon premium-badge-icon" aria-hidden="true"><use href="#ui-icon-crown" /></svg>
      <span>Premium Course</span>
    </div>

    <!-- Module Header -->
    <header class="module-header page-band">
      <nav>
        <router-link to="/" class="home-breadcrumb-link">
          <svg class="ui-icon home-breadcrumb-icon" aria-hidden="true"><use href="#ui-icon-home" /></svg>
          <span>Home</span>
        </router-link>
        <span> / </span>
        <router-link to="/dashboard">Dashboard</router-link>
        <span> / </span>
        <span class="module-breadcrumb-current">Fake Job Offers</span>
      </nav>
      <h1>Fake Job Offers</h1>
      <p>How a fake recruiter collects your passport scan, your bank details and your money &mdash; and what to check before you send any of it.</p>
    </header>

    <p class="module-key-details">
      <strong>Who this is for:</strong> remote job seekers, freelancers between contracts, contract workers, and remote HR coordinators.
    </p>

    <!-- Learning Objectives -->
    <section class="learning-objectives">
      <h3>By the end of this module you can</h3>
      <ol>
        <li>Explain how fake outreach, fake postings and counterfeit contracts fit together.</li>
        <li>Recognise PII harvesting dressed up as a background check or onboarding.</li>
        <li>Explain the fake equipment check scam aimed at new remote hires.</li>
        <li>Verify a recruiter&rsquo;s identity, their corporate domain and the contract before sharing personal records.</li>
      </ol>
    </section>

    <!-- Reading Material -->
    <section class="module-awareness-guide">
      <h2>What to know</h2>

      <article>
        <h3>Why remote hiring is easy to fake</h3>
        <p>Remote hiring opened up global recruiting, and recruitment fraud with it. Resumes, contact details and career histories sit in public on LinkedIn, Indeed and Upwork. Attackers harvest that and build an offer shaped around what you are hoping to earn (Ravenelle et al., 2022).</p>
      </article>

      <article>
        <h3>Fake recruiters and PII harvesting</h3>
        <p>The profile is either invented or copied from a real talent acquisition specialist at a company you have heard of.</p>
        <ul>
          <li><strong>The text-only interview.</strong> An email or message offers an interview for a well-paid, fully remote role. It runs entirely in Telegram, Signal or Google Chat, or an automated questionnaire. No voice, no video.</li>
          <li><strong>The onboarding forms.</strong> With the &ldquo;job offer&rdquo; comes a demand for personally identifiable information (PII): passport scans, government ID numbers, bank account details for direct deposit, your social security number &mdash; all for the &ldquo;pre-employment background check&rdquo; or &ldquo;tax form processing.&rdquo; The data goes straight to identity theft and financial fraud (Anbarasu et al., 2024).</li>
        </ul>
      </article>

      <article>
        <h3>The fake equipment check</h3>
        <p>A widespread scam aimed at new remote hires. It turns on how long a bank takes to clear a check.</p>
        <ul>
          <li>A counterfeit check arrives &mdash; say $3,500 &mdash; to buy home office equipment: laptop, monitors, an ergonomic desk.</li>
          <li>You are told to deposit it in your personal account and wire the money straight on to a &ldquo;certified vendor,&rdquo; which is them.</li>
          <li>Days later the bank finds the check is fraudulent and reverses the $3,500. You are out the money you wired, and your account may be closed for depositing a fake check.</li>
        </ul>
      </article>
    </section>

    <!-- Scenario Simulation -->
    <section class="scenario-section">
      <h2>Scenario: the exclusive coordinator offer</h2>
      <p>You have been applying for remote roles online. An email from <code>careers@tech-global-corp.net</code> offers you a &ldquo;Remote Operations Coordinator&rdquo; post at $95,000 a year.</p>

      <div class="scenario-stage">
        <h3>Stage 1 &mdash; the interview</h3>
        <p>The recruiter, &ldquo;David Miller,&rdquo; writes: &ldquo;Congratulations! Our board selected you from your resume. No video interview required &mdash; just complete the attached employment contract and background form.&rdquo; <code>Onboarding_Form.pdf</code> asks for your full government ID number, a passport scan, and your bank account credentials.</p>
        <div class="scenario-decision">
          <h4>What do you do?</h4>
          <ul>
            <li><strong>A:</strong> Complete the form and attach the passport scan to secure the $95,000 offer.</li>
            <li><strong>B:</strong> Pause and investigate. An offer with no video or voice interview that demands your bank login is a major fraud indicator. <em>(Correct)</em></li>
          </ul>
        </div>
      </div>

      <div class="scenario-stage">
        <h3>Stage 2 &mdash; the equipment check</h3>
        <p>David Miller messages: &ldquo;We are mailing you a check for $4,000. Deposit it and wire $3,200 to our approved hardware supplier via Zelle today.&rdquo;</p>
        <div class="scenario-decision">
          <h4>What do you do?</h4>
          <ul>
            <li><strong>A:</strong> Deposit the check and wire the $3,200 now, so your work laptop arrives.</li>
            <li><strong>B:</strong> Refuse the check, report the posting as fraudulent, and wire none of your own money. <em>(Correct)</em></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Red Flag Checklist -->
    <section class="red-flag-checklist">
      <h3>Red flags</h3>
      <ul>
        <li>An offer made without a single live video or voice interview.</li>
        <li>A check sent in advance to buy equipment from a named &ldquo;approved vendor&rdquo; by irreversible wire.</li>
        <li>A request for your bank account password or full tax ID before any contract is signed.</li>
        <li>A hiring address on a domain that is not the company&rsquo;s own &mdash; <code>@company-careers-jobs.com</code> instead of <code>@company.com</code>.</li>
      </ul>
    </section>

    <!-- Curated Resources -->
    <section class="curated-resources">
      <h3>References</h3>
      <ul>
        <li>Anbarasu, V., Selvakani, S., & Vasumathi, K. (2024). Fake job prediction using machine learning. <em>International Journal of Darshan Institute</em>, 13(1), 12–20.</li>
        <li>Ravenelle, A. J., Janko, E., & Kowalski, K. C. (2022). Good jobs, scam jobs: Detecting, normalizing, and internalizing online job scams. <em>New Media & Society</em>, 24(7), 1591–1610.</li>
        <li>Ticona, J. (2022). Red flags, sob stories, and scams: The contested meaning of governance on labor platforms. <em>New Media & Society</em>, 24(7), 1548–1566.</li>
      </ul>
    </section>

    <!-- Quiz Section -->
    <section class="module-quiz-section">
      <h2>Course Assessment</h2>
      <p>Test your knowledge with the 10-question assessment for this course.</p>
      <button class="take-quiz-button" @click="startQuiz">Take Assessment</button>
      <router-link to="/" class="module-home-button">Back to Homepage</router-link>
    </section>
  </div>
</template>

<script src="./FakeRecruiters.js"></script>
