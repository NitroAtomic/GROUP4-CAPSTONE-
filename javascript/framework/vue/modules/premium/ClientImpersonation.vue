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
        <span class="module-breadcrumb-current">Fake Clients and Escrow Fraud</span>
      </nav>
      <h1>Fake Clients and Escrow Fraud</h1>
      <p>How a fake client takes your login, your work or your money &mdash; and how to check who you are dealing with before you hand anything over.</p>
    </header>

    <p class="module-key-details">
      <strong>Who this is for:</strong> independent freelancers, remote designers, software engineers, copywriters, and digital marketing contractors.
    </p>

    <!-- Learning Objectives -->
    <section class="learning-objectives">
      <h3>By the end of this module you can</h3>
      <ol>
        <li>Recognise a fake client or job inquiry built to harvest credentials or get free work.</li>
        <li>Spot the portfolio trick, where a login is demanded before you can see the brief.</li>
        <li>Explain what you lose when a client moves you off-platform, away from escrow and contract cover.</li>
        <li>Verify a client out of band before you grant access or deliver work.</li>
      </ol>
    </section>

    <!-- Reading Material -->
    <section class="module-awareness-guide">
      <h2>What to know</h2>

      <article>
        <h3>Why freelancers get targeted</h3>
        <p>A freelancer has no corporate IT perimeter, no in-house legal team and nobody doing security for them. Income depends on landing the next project, so the fear of losing a good one is always there. Attackers build a convincing &ldquo;high-budget client&rdquo; persona for exactly that reason: to make you drop your usual checks (Ticona, 2022).</p>
      </article>

      <article>
        <h3>Portfolio credential harvesting</h3>
        <p>Not mass phishing. The pretext is a commercial brief written for you.</p>
        <ul>
          <li><strong>The review portal.</strong> A client interested in a high-value contract sends a link to a &ldquo;prototype review portal&rdquo; or &ldquo;shared client workspace&rdquo; &mdash; <code>figma-client-verify.com</code>, <code>adobe-portfolio-review.site</code>. Sign in with your professional account to see the brief, they say.</li>
          <li><strong>The client&rsquo;s own system.</strong> You are asked to log into their staging server, CMS or cloud repository using credentials they supply. The login page is a harvester, built to capture your main password and your multi-factor code.</li>
        </ul>
      </article>

      <article>
        <h3>Getting you off the platform</h3>
        <p>Upwork, Fiverr and Toptal log the contract, verify identities and hold payment in escrow. So the first move is to get you talking somewhere else.</p>
        <ul>
          <li><strong>The convenience story.</strong> Their accounting department cannot pay through the platform, and there is a 30% bonus if you accept a direct wire, PayPal Friends &amp; Family, or cryptocurrency.</li>
          <li><strong>The overpayment.</strong> An advance check or wire arrives for more than the agreed fee. An accounting error, they say &mdash; please return the difference now, by a method that cannot be reversed. The original payment is later flagged as fraudulent, leaving you owing what you refunded.</li>
        </ul>
      </article>
    </section>

    <!-- Scenario Simulation -->
    <section class="scenario-section">
      <h2>Scenario: the high-retainer brand</h2>
      <p>You are a freelance web developer. &ldquo;Marcus Vance&rdquo; emails you, says he is Marketing Director at an international agency, and offers a $12,000 retainer to redesign their core web platform.</p>

      <div class="scenario-stage">
        <h3>Stage 1 &mdash; first contact</h3>
        <p>He sends a link to review the current environment and sitemap: <code>nexus-agency-auth.net/sitemap</code>. It opens a page identical to Google Workspace, asking you to log in with Google to view the protected brand assets.</p>
        <div class="scenario-decision">
          <h4>What do you do?</h4>
          <ul>
            <li><strong>A:</strong> Enter your Google credentials to see the sitemap and secure the $12,000 project.</li>
            <li><strong>B:</strong> Enter nothing, look at the domain &mdash; <code>nexus-agency-auth.net</code> &mdash; and ask for the brief by email or as a PDF. <em>(Correct)</em></li>
          </ul>
        </div>
      </div>

      <div class="scenario-stage">
        <h3>Stage 2 &mdash; the escrow bypass</h3>
        <p>A PDF brief arrives. &ldquo;Our legal team needs us to start immediately. To avoid platform fees we will transfer $4,000 straight to your bank today &mdash; just send us full administrative access to your development server now.&rdquo;</p>
        <div class="scenario-decision">
          <h4>What do you do?</h4>
          <ul>
            <li><strong>A:</strong> Grant the server access. He seems legitimate and the payment is coming direct.</li>
            <li><strong>B:</strong> No administrative access until there is a signed contract with escrow on a recognised platform. <em>(Correct)</em></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Red Flag Checklist -->
    <section class="red-flag-checklist">
      <h3>Red flags</h3>
      <ul>
        <li>A client who needs you to log into an unfamiliar third-party portal to read the spec or submit work.</li>
        <li>An early push to move the conversation, or the payment, off an escrow-protected platform.</li>
        <li>An advance for more than the agreed amount, with a request to refund the difference.</li>
        <li>A major agency writing from a lookalike domain or a free webmail account.</li>
      </ul>
    </section>

    <!-- Curated Resources -->
    <section class="curated-resources">
      <h3>References</h3>
      <ul>
        <li>Ravenelle, A. J., Janko, E., & Kowalski, K. C. (2022). Good jobs, scam jobs: Detecting, normalizing, and internalizing online job scams during the COVID-19 pandemic. <em>New Media & Society</em>, 24(7), 1591–1610.</li>
        <li>Ticona, J. (2022). Red flags, sob stories, and scams: The contested meaning of governance on carework labor platforms. <em>New Media & Society</em>, 24(7), 1548–1566.</li>
        <li>Papathanasiou, A., et al. (2023). Business Email Compromise (BEC) Attacks: Threats, Vulnerabilities and Countermeasures. <em>Journal of Cybersecurity and Privacy</em>, 3(3), 610–637.</li>
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

<script src="./ClientImpersonation.js"></script>
