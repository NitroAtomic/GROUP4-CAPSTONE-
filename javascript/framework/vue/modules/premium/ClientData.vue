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
      <dd>Virtual Assistants (VAs), Executive Assistants, Remote Administrative Coordinators, Project Support Specialists.</dd>
      <dt>Access Tier:</dt>
      <dd>Premium (target_role = 'Virtual Assistant')</dd>
    </dl>

    <!-- Module Header -->
    <header class="module-header">
      <nav>
        <router-link to="/">Home</router-link>
        <span> / </span>
        <router-link to="/dashboard">Dashboard</router-link>
        <span> / </span>
        <span class="text-gray-900">Executive Support & VA Impersonation Defense</span>
      </nav>
      <h1>Executive Support & VA Impersonation Defense (Authority Scams & Delegation Exploits)</h1>
      <p>Learn to deconstruct executive authority exploitation, identify fake supervisor directives, and implement out-of-band authentication channels.</p>
    </header>

    <!-- Learning Objectives -->
    <section class="learning-objectives">
      <h3>Learning Objectives</h3>
      <p>After completing this module, the learner should be able to:</p>
      <ol>
        <li>Deconstruct the psychological mechanics of Executive Authority Exploitation targeting Virtual Assistants.</li>
        <li>Identify fake supervisor directives and emergency gift card/wire transfer purchase requests.</li>
        <li>Detect password reset traps and Single Sign-On (SSO) credential requests originating from impersonated executive profiles.</li>
        <li>Implement mandatory Out-of-Band (OOB) authentication channels to verify high-stakes administrative requests regardless of perceived executive rank.</li>
      </ol>
    </section>

    <!-- Reading Material -->
    <section class="module-awareness-guide">
      <h2>Website Reading Material</h2>
      
      <article>
        <h3>1. The Virtual Assistant as an Attack Surface</h3>
        <p>Virtual Assistants (VAs) hold significant operational access within distributed companies. VAs routinely manage executive calendars, process travel arrangements, handle sensitive corporate communications, and possess elevated access to cloud management portals. Threat actors recognize that VAs are built-in administrative hubs—gaining control of a VA's credentials or manipulating their trust gives the attacker indirect administrative access to the entire company (Lazarus, 2024).</p>
      </article>

      <article>
        <h3>2. Executive Authority Exploitation & Fear Tactics</h3>
        <p>VAs are socialized to respond quickly to executive requests. Threat actors exploit this professional responsiveness through <strong>Authority Manipulation</strong>:</p>
        <ul>
          <li><strong>The "In-a-Meeting" Communication Barrier:</strong> The attacker impersonates a C-suite executive (CEO, CFO) using a lookalike email address or messaging profile (WhatsApp/Telegram). The attacker establishes a narrative: "I am currently locked in an all-day executive board meeting and cannot take calls. I need you to handle an urgent task immediately."</li>
          <li><strong>Emergency Gift Card / Wire Purchase Directives:</strong> The fake executive instructs the VA to purchase digital gift cards (Apple, Google Play, Amazon) or execute an urgent wire transfer for a "client appreciation gift" or "emergency vendor deposit." The attacker stresses that failing to do so immediately will jeopardize a multi-million dollar business deal.</li>
        </ul>
      </article>

      <article>
        <h3>3. Single Sign-On (SSO) & Password Reset Traps</h3>
        <p>Because VAs often assist with technical setup, attackers impersonate executive management to bypass authentication controls:</p>
        <ul>
          <li><strong>The Emergency Access Request:</strong> The fake executive messages the VA: "I lost my phone and cannot receive my Multi-Factor Authentication (MFA) push code. Please contact IT or use your admin access to reset my password to TempPassword2026! immediately."</li>
          <li><strong>The MFA Approval Trick:</strong> The attacker attempts to log into the executive's actual account, triggering repeated push notifications to the VA's device. The fake executive then calls or texts the VA: "Accept that push notification on your screen right now—it's me trying to log in from the airport."</li>
        </ul>
      </article>
    </section>

    <!-- Scenario Simulation -->
    <section class="scenario-section">
      <h2>Interactive Scenario Simulation Game</h2>
      <p><strong>Scenario Name:</strong> The CEO Boardroom Wire Emergency</p>
      <p><strong>Context:</strong> You are a remote Virtual Assistant for a tech startup. It is 4:30 PM on a Friday. You receive a direct message on WhatsApp from a number displaying the photo and name of your CEO, Sarah Jenkins.</p>

      <div class="scenario-stage">
        <h3>Stage 1 (Initial Hook)</h3>
        <p>The message reads: "Hi! I'm in a closed-door meeting with investors. My laptop died and I can't access Slack. I need you to purchase 5 x $200 digital Apple gift cards right now for the investor team. Use the corporate card. Send the codes here ASAP. Do not call me, I'm presenting."</p>
        <div class="scenario-decision">
          <h4>Decision Point:</h4>
          <ul>
            <li><strong>Option A:</strong> Purchase the gift cards immediately using the corporate card to impress the CEO and avoid ruining the investor meeting.</li>
            <li><strong>Option B:</strong> Recognize the classic indicators of executive impersonation (gift cards, urgency, prohibition of phone calls) and pause. <em>(Correct Path)</em></li>
          </ul>
        </div>
      </div>

      <div class="scenario-stage">
        <h3>Stage 2 (Verification Action)</h3>
        <p>What is your next step?</p>
        <div class="scenario-decision">
          <h4>Decision Point:</h4>
          <ul>
            <li><strong>Option A:</strong> Reply on WhatsApp asking: "Are you sure it's you, Sarah?"</li>
            <li><strong>Option B:</strong> Contact the CEO or Executive Operations team through an established internal channel (e.g., calling the CEO's verified phone number or checking with the Chief of Staff). <em>(Correct Path)</em></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Red Flag Checklist -->
    <section class="red-flag-checklist">
      <h3>Red Flag Indicators & Actionable Checklist</h3>
      <ul>
        <li>Demands for Gift Cards / Instant Wires: Any request from an executive to purchase digital gift cards, cryptocurrency, or execute unverified wire transfers.</li>
        <li>Prohibition of Phone Verification: Messages explicitly instructing you NOT to call the executive because they are "in a meeting" or "on a flight."</li>
        <li>Communication Channel Shifts: Executives reaching out via personal WhatsApp, Telegram, or non-corporate webmail accounts (ceo.company@gmail.com).</li>
        <li>Requests to Bypass Security Controls: Instructions to disable MFA, reset passwords to weak defaults, or share login tokens over chat.</li>
      </ul>
    </section>

    <!-- Curated Resources -->
    <section class="curated-resources">
      <h3>Curated Resources & References</h3>
      <ul>
        <li>Lazarus, S. (2024). Cybercriminal Networks and Operational Dynamics of Business Email Compromise (BEC) Scammers. <em>Deviant Behavior</em>, 46, 456–480.</li>
        <li>Papathanasiou, A., et al. (2023). Business Email Compromise (BEC) Attacks: Threats, Vulnerabilities and Countermeasures. <em>Journal of Cybersecurity and Privacy</em>, 3(3), 610–637.</li>
        <li>Birthriya, S. K., Ahlawat, P., & Jain, A. K. (2025). Detection and prevention of spear phishing attacks: A comprehensive survey. <em>Computers & Security</em>, 151, 104317.</li>
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

<script src="./ClientData.js"></script>
