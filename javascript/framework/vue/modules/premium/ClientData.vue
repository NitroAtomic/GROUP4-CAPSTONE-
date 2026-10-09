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
        <span class="module-breadcrumb-current">Executive Impersonation</span>
      </nav>
      <h1>Executive Impersonation</h1>
      <p>How someone posing as your boss gets gift cards bought and passwords reset &mdash; and the one check that stops it, whatever rank is on the message.</p>
    </header>

    <p class="module-key-details">
      <strong>Who this is for:</strong> virtual assistants, executive assistants, remote administrative coordinators, and project support specialists.
    </p>

    <!-- Learning Objectives -->
    <section class="learning-objectives">
      <h3>By the end of this module you can</h3>
      <ol>
        <li>Explain why an instruction that appears to come from an executive is hard to question.</li>
        <li>Recognise a fake supervisor directive, including the urgent gift card or wire request.</li>
        <li>Spot password reset traps and single sign-on credential requests from an impersonated executive.</li>
        <li>Apply out-of-band (OOB) verification &mdash; confirming on a separate, already-trusted channel &mdash; to any high-stakes request, whatever rank it seems to come from.</li>
      </ol>
    </section>

    <!-- Reading Material -->
    <section class="module-awareness-guide">
      <h2>What to know</h2>

      <article>
        <h3>Why the assistant is the target</h3>
        <p>A virtual assistant runs the executive calendar, books the travel, handles sensitive corporate mail, and often holds elevated access to cloud management portals. That makes the VA an administrative hub. Take their credentials, or just their trust, and you have indirect administrative access to the whole company (Lazarus, 2024).</p>
      </article>

      <article>
        <h3>Authority and urgency</h3>
        <p>A VA is expected to act on an executive request quickly. That responsiveness is the thing being exploited.</p>
        <ul>
          <li><strong>The meeting excuse.</strong> A lookalike email address, or a WhatsApp or Telegram profile, carries the name of your CEO or CFO. They are locked in an all-day board meeting and cannot take calls, but they need an urgent task handled now. The story is built so you cannot phone to check.</li>
          <li><strong>The purchase.</strong> Buy digital gift cards &mdash; Apple, Google Play, Amazon &mdash; or send an urgent wire, for a &ldquo;client appreciation gift&rdquo; or an &ldquo;emergency vendor deposit.&rdquo; Any delay, you are told, costs a multi-million dollar deal.</li>
        </ul>
      </article>

      <article>
        <h3>Single sign-on and password reset traps</h3>
        <p>VAs often help with technical setup, so the same fake executive is used to get round the login controls.</p>
        <ul>
          <li><strong>The reset.</strong> &ldquo;I lost my phone and cannot receive my multi-factor push code. Contact IT, or use your admin access, and reset my password to <code>TempPassword2026!</code> immediately.&rdquo;</li>
          <li><strong>The push.</strong> The attacker logs into the executive&rsquo;s real account, which sends repeated push notifications to your device. Then the call or text arrives: &ldquo;Accept that notification on your screen right now &mdash; it&rsquo;s me, logging in from the airport.&rdquo;</li>
        </ul>
      </article>
    </section>

    <!-- Scenario Simulation -->
    <section class="scenario-section">
      <h2>Scenario: the Friday afternoon emergency</h2>
      <p>You are a remote virtual assistant at a tech startup. It is 4:30 PM on a Friday. A WhatsApp message arrives from a number showing the photo and name of your CEO, Sarah Jenkins.</p>

      <div class="scenario-stage">
        <h3>Stage 1 &mdash; the hook</h3>
        <p>&ldquo;Hi! I&rsquo;m in a closed-door meeting with investors. My laptop died and I can&rsquo;t access Slack. Purchase 5 x $200 digital Apple gift cards right now for the investor team. Use the corporate card. Send the codes here ASAP. Do not call me, I&rsquo;m presenting.&rdquo;</p>
        <div class="scenario-decision">
          <h4>What do you do?</h4>
          <ul>
            <li><strong>A:</strong> Buy the gift cards on the corporate card, to impress the CEO and avoid ruining the investor meeting.</li>
            <li><strong>B:</strong> Notice the familiar pattern &mdash; gift cards, urgency, no phone calls allowed &mdash; and pause. <em>(Correct)</em></li>
          </ul>
        </div>
      </div>

      <div class="scenario-stage">
        <h3>Stage 2 &mdash; verifying</h3>
        <p>What is your next step?</p>
        <div class="scenario-decision">
          <h4>What do you do?</h4>
          <ul>
            <li><strong>A:</strong> Reply on WhatsApp: &ldquo;Are you sure it&rsquo;s you, Sarah?&rdquo;</li>
            <li><strong>B:</strong> Use an established internal channel &mdash; the CEO&rsquo;s verified phone number, or a check with the Chief of Staff. <em>(Correct)</em></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Red Flag Checklist -->
    <section class="red-flag-checklist">
      <h3>Red flags</h3>
      <ul>
        <li>An executive asking you to buy digital gift cards or cryptocurrency, or to send an unverified wire.</li>
        <li>A message that tells you not to call, because they are in a meeting or on a flight.</li>
        <li>An executive turning up on personal WhatsApp or Telegram, or a non-corporate webmail address like <code>ceo.company@gmail.com</code>.</li>
        <li>Instructions to disable MFA, reset a password to a weak default, or share a login token over chat.</li>
      </ul>
    </section>

    <!-- Curated Resources -->
    <section class="curated-resources">
      <h3>References</h3>
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
      <router-link to="/" class="module-home-button">Back to Homepage</router-link>
    </section>
  </div>
</template>

<script src="./ClientData.js"></script>
