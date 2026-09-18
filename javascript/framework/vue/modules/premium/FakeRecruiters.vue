<template>
  <div class="module-page">
    <!-- Premium Badge -->
    <div class="premium-badge">
      <span class="premium-badge-icon">👑</span>
      <span>Premium Course</span>
    </div>

    <!-- Course Metadata -->
    <dl class="course-metadata">
      <dt>Target Stakeholders:</dt>
      <dd>Remote Job Seekers, Freelancers in Transition, Contract Workers, Remote HR Coordinators.</dd>
      <dt>Access Tier:</dt>
      <dd>Premium (target_role = 'Job Seeker / Freelancer')</dd>
    </dl>

    <!-- Module Header -->
    <header class="module-header">
      <nav>
        <router-link to="/">Home</router-link>
        <span> / </span>
        <router-link to="/dashboard">Dashboard</router-link>
        <span> / </span>
        <span class="text-gray-900">Remote Recruitment, HR Impersonation & Onboarding Scams</span>
      </nav>
      <h1>Remote Recruitment, HR Impersonation & Onboarding Scams (Job Offer & Identity Theft Lures)</h1>
      <p>Learn to analyze fake recruiter outreach, identify PII harvesting tactics, and execute verification workflows for recruiter identities and contract authenticity.</p>
    </header>

    <!-- Learning Objectives -->
    <section class="learning-objectives">
      <h3>Learning Objectives</h3>
      <p>After completing this module, the learner should be able to:</p>
      <ol>
        <li>Analyze the structural mechanics of fake recruiter outreach, fraudulent job postings, and counterfeit employment contracts.</li>
        <li>Identify Personally Identifiable Information (PII) harvesting tactics executed under the guise of pre-employment background checks or onboarding.</li>
        <li>Deconstruct fake equipment check/check-clearing scams targeting newly hired remote workers.</li>
        <li>Execute verification workflows to validate recruiter identities, corporate domains, and contract authenticity before sharing sensitive personal records.</li>
      </ol>
    </section>

    <!-- Reading Material -->
    <section class="module-awareness-guide">
      <h2>Website Reading Material</h2>
      
      <article>
        <h3>1. The Threat Architecture of Remote Recruitment Fraud</h3>
        <p>The transition to remote hiring has enabled global talent acquisition, but it has also created opportunities for recruitment fraud. Job seekers and remote contractors frequently share resumes, contact details, and career histories on public job boards (LinkedIn, Indeed, Upwork). Threat actors harvest this data to craft targeted fake job offers that exploit job seekers' financial expectations (Ravenelle et al., 2022).</p>
      </article>

      <article>
        <h3>2. Fake Recruiter Outreach & PII Harvesting</h3>
        <p>Scammers create fake recruiter profiles or impersonate actual talent acquisition specialists from well-known corporations:</p>
        <ul>
          <li><strong>The Fake Interview Lure:</strong> The "recruiter" reaches out via email or direct message, offering an interview for a lucrative, fully remote position. The interview is conducted entirely over text-based messaging apps (Telegram, Signal, Google Chat) or through automated questionnaires, skipping voice or video calls.</li>
          <li><strong>Pre-Employment PII Harvesting:</strong> Upon extending a fake "job offer," the scammer demands sensitive Personally Identifiable Information (PII)—including passport scans, government ID numbers, bank account details for direct deposit, and social security numbers—under the pretext of "pre-employment background checks" or "tax form processing." The harvested data is used for identity theft and financial fraud (Anbarasu et al., 2024).</li>
        </ul>
      </article>

      <article>
        <h3>3. The Fake Equipment Check Scam</h3>
        <p>A widespread financial scam targeting newly hired remote employees is the <strong>Check-Clearing Equipment Trap</strong>:</p>
        <ul>
          <li>The scammer sends the newly hired remote worker a counterfeit check (e.g., $3,500) to purchase home office equipment (laptops, monitors, ergonomic desks).</li>
          <li>The worker is instructed to deposit the check into their personal bank account and wire the funds immediately to a "certified vendor" controlled by the scammer.</li>
          <li>Days later, the bank discovers the check is fraudulent and reverses the $3,500 credit. The worker loses the transferred money and faces potential account closure for depositing fake checks.</li>
        </ul>
      </article>
    </section>

    <!-- Scenario Simulation -->
    <section class="scenario-section">
      <h2>Interactive Scenario Simulation Game</h2>
      <p><strong>Scenario Name:</strong> The Exclusive Remote Regional Coordinator Offer</p>
      <p><strong>Context:</strong> You applied for remote positions online. You receive an email from careers@tech-global-corp.net extending a job offer as a "Remote Operations Coordinator" with a starting salary of $95,000/year.</p>

      <div class="scenario-stage">
        <h3>Stage 1 (The Interview Process)</h3>
        <p>The recruiter, "David Miller," says: "Congratulations! Based on your resume, our board has selected you. We do not require a video interview. Please fill out the attached employment contract and background form (Onboarding_Form.pdf)." The form asks for your full government ID number, passport scan, and bank account credentials.</p>
        <div class="scenario-decision">
          <h4>Decision Point:</h4>
          <ul>
            <li><strong>Option A:</strong> Fill out the form and attach your passport scan immediately to secure the $95,000 job offer.</li>
            <li><strong>Option B:</strong> Pause and investigate. A job offer without a video or voice interview that demands bank login credentials is a major fraud indicator. <em>(Correct Path)</em></li>
          </ul>
        </div>
      </div>

      <div class="scenario-stage">
        <h3>Stage 2 (Equipment Check Directive)</h3>
        <p>David Miller messages: "We are mailing you a check for $4,000. Deposit it and wire $3,200 to our approved hardware supplier via Zelle today."</p>
        <div class="scenario-decision">
          <h4>Decision Point:</h4>
          <ul>
            <li><strong>Option A:</strong> Deposit the check and wire the $3,200 immediately to get your work laptop.</li>
            <li><strong>Option B:</strong> Refuse the check, report the job posting as fraudulent, and do not wire personal funds. <em>(Correct Path)</em></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Red Flag Checklist -->
    <section class="red-flag-checklist">
      <h3>Red Flag Indicators & Actionable Checklist</h3>
      <ul>
        <li>Text-Only Interviews: Job offers extended without any live video or voice interviews.</li>
        <li>Advance Equipment Checks: Employers sending checks to purchase equipment from specific "approved vendors" via irreversible wire transfers.</li>
        <li>Demands for Bank Login Credentials: Requests for bank account passwords or full tax IDs before official contract signing.</li>
        <li>Lookalike Hiring Domains: Communications originating from domains differing from the company's official website (e.g., @company-careers-jobs.com vs. @company.com).</li>
      </ul>
    </section>

    <!-- Curated Resources -->
    <section class="curated-resources">
      <h3>Curated Resources & References</h3>
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
    </section>
  </div>
</template>

<script src="./FakeRecruiters.js"></script>
