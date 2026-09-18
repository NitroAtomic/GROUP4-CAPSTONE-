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
      <dd>Independent Freelancers, Remote Designers, Software Engineers, Copywriters, Digital Marketing Contractors.</dd>
      <dt>Access Tier:</dt>
      <dd>Premium (target_role = 'Freelancer')</dd>
    </dl>

    <!-- Module Header -->
    <header class="module-header">
      <nav>
        <router-link to="/">Home</router-link>
        <span> / </span>
        <router-link to="/dashboard">Dashboard</router-link>
        <span> / </span>
        <span class="text-gray-900">Freelancer Exploitation & Client Verification</span>
      </nav>
      <h1>Freelancer Exploitation & Client Verification (Fake Clients, Portfolio Scams & Escrow Fraud)</h1>
      <p>Learn to identify fake client personas, detect portfolio credential harvesting, and implement secure verification procedures.</p>
    </header>

    <!-- Learning Objectives -->
    <section class="learning-objectives">
      <h3>Learning Objectives</h3>
      <p>After completing this module, the learner should be able to:</p>
      <ol>
        <li>Identify fake client personas and fraudulent job inquiries designed to harvest credentials or extract unpaid labor.</li>
        <li>Detect portfolio credential harvesting tricks where attackers demand login credentials to view sample work or project environments.</li>
        <li>Analyze the social engineering tactics used to trick freelancers into moving off-platform, bypassing secure escrow and contract protections.</li>
        <li>Implement rigorous out-of-band client verification procedures and secure asset delivery protocols before granting access to work.</li>
      </ol>
    </section>

    <!-- Reading Material -->
    <section class="module-awareness-guide">
      <h2>Website Reading Material</h2>
      
      <article>
        <h3>1. The Vulnerability of Independent Contractors</h3>
        <p>Freelancers operate without corporate IT perimeters, internal legal teams, or dedicated security support. Their financial stability depends directly on securing client projects, creating an inherent psychological vulnerability: the fear of losing lucrative opportunities. Threat actors actively exploit this income pressure by constructing convincing "high-budget client" personas that manipulate freelancers into lowering their standard verification vigilance (Ticona, 2022).</p>
      </article>

      <article>
        <h3>2. Portfolio Credential Harvesting & Fake Client Briefs</h3>
        <p>A prevalent tactic targeting freelancers is <strong>Portfolio Credential Harvesting</strong>. Unlike mass phishing, this attack uses a tailored commercial pretext:</p>
        <ul>
          <li><strong>The Fake Review Portal Trap:</strong> An attacker impersonating a client contacts a designer or developer, expressing interest in a high-value contract. The attacker sends a link to an alleged "prototype review portal" or "shared client workspace" (e.g., figma-client-verify.com or adobe-portfolio-review.site) and claims the freelancer must sign in using their professional credentials to view the project brief.</li>
          <li><strong>Asset Access Exploitation:</strong> The attacker asks the freelancer to log into a client's staging server, CMS, or cloud repository using credentials supplied by the client. The login page is a credential harvester designed to capture the freelancer's primary password and multi-factor authentication tokens.</li>
        </ul>
      </article>

      <article>
        <h3>3. Off-Platform Manipulation & Escrow Bypasses</h3>
        <p>Secure freelancing platforms (e.g., Upwork, Fiverr, Toptal) enforce built-in contract logging, identity verification, and escrow payment holds. Scammers systematically attempt to lure freelancers off these platforms during initial communications:</p>
        <ul>
          <li><strong>The Convenience Pretext:</strong> The "client" claims their corporate accounting department cannot process payments through the platform and offers a 30% bonus if the freelancer agrees to direct wire transfers, PayPal Friends & Family, or cryptocurrency.</li>
          <li><strong>The Overpayment Scam:</strong> The client sends an advance check or wire transfer exceeding the agreed project fee, claims an administrative accounting error, and asks the freelancer to immediately refund the difference via an irreversible payment method. The initial check is later flagged as fraudulent, leaving the freelancer responsible for the refunded balance.</li>
        </ul>
      </article>
    </section>

    <!-- Scenario Simulation -->
    <section class="scenario-section">
      <h2>Interactive Scenario Simulation Game</h2>
      <p><strong>Scenario Name:</strong> The High-Retainer Global Brand Opportunity</p>
      <p><strong>Context:</strong> You are an independent remote web developer. An individual named "Marcus Vance" contacts you via email, claiming to be the Marketing Director for an international agency. He offers a $12,000 retainer to redesign their core web platform.</p>

      <div class="scenario-stage">
        <h3>Stage 1 (Initial Contact)</h3>
        <p>Marcus sends a link: "Review our current environment and sitemap here: <a href="https://nexus-agency-auth.net/sitemap" target="_blank">https://nexus-agency-auth.net/sitemap</a>". Clicking the link opens a page that looks identical to Google Workspace, prompting you to "Log in with Google to view protected brand assets."</p>
        <div class="scenario-decision">
          <h4>Decision Point:</h4>
          <ul>
            <li><strong>Option A:</strong> Enter your Google credentials to view the sitemap and secure the $12,000 project.</li>
            <li><strong>Option B:</strong> Refuse to enter credentials, inspect the domain (nexus-agency-auth.net), and request the brief via email or a standard PDF. <em>(Correct Path)</em></li>
          </ul>
        </div>
      </div>

      <div class="scenario-stage">
        <h3>Stage 2 (Escrow Bypass)</h3>
        <p>Marcus sends a PDF brief and says: "Our legal team requires us to start immediately. To avoid freelancing platform fees, we will transfer $4,000 directly to your bank account today if you send us full administrative access to your development server now."</p>
        <div class="scenario-decision">
          <h4>Decision Point:</h4>
          <ul>
            <li><strong>Option A:</strong> Grant server access immediately since Marcus seems legitimate and is offering direct payment.</li>
            <li><strong>Option B:</strong> Insist on executing a verified contract with escrow protection through a recognized platform before sharing administrative server access. <em>(Correct Path)</em></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Red Flag Checklist -->
    <section class="red-flag-checklist">
      <h3>Red Flag Indicators & Actionable Checklist</h3>
      <ul>
        <li>Demands for External Login: Clients requiring you to log into unknown third-party portals to view project specifications or submit work.</li>
        <li>Push to Move Off-Platform: Immediate requests to move communications or payments away from escrow-protected freelancing platforms.</li>
        <li>Unrealistic Advances / Overpayments: Clients sending advance payments exceeding agreed amounts and demanding immediate partial refunds.</li>
        <li>Unverified Business Domains: Emails originating from lookalike domains or generic free webmail accounts claiming to represent major agencies.</li>
      </ul>
    </section>

    <!-- Curated Resources -->
    <section class="curated-resources">
      <h3>Curated Resources & References</h3>
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
    </section>
  </div>
</template>

<script src="./ClientImpersonation.js"></script>
