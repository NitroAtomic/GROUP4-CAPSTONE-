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
      <dd>Remote Bookkeepers, Finance Coordinators, Payroll Assistants, Account Managers, Small Business Operations Staff.</dd>
      <dt>Access Tier:</dt>
      <dd>Premium (target_role = 'Remote Finance / Bookkeeping')</dd>
    </dl>

    <!-- Module Header -->
    <header class="module-header">
      <nav>
        <router-link to="/">Home</router-link>
        <span> / </span>
        <router-link to="/dashboard">Dashboard</router-link>
        <span> / </span>
        <span class="text-gray-900">Remote BEC, Invoice Manipulation & Payment Fraud</span>
      </nav>
      <h1>Remote BEC, Invoice Manipulation & Payment Fraud (Vendor Account Updates & Direct Deposit Scams)</h1>
      <p>Learn to analyze Business Email Compromise attacks, identify vendor invoice manipulation tactics, and implement dual-custody approval controls for financial distributions.</p>
    </header>

    <!-- Learning Objectives -->
    <section class="learning-objectives">
      <h3>Learning Objectives</h3>
      <p>After completing this module, the learner should be able to:</p>
      <ol>
        <li>Analyze the structural mechanics of Business Email Compromise (BEC) attacks targeting distributed financial workflows.</li>
        <li>Identify vendor invoice manipulation tactics, altered banking details, and lookalike domain spoofing.</li>
        <li>Detect employee payroll direct deposit redirection scams targeting remote HR and accounting personnel.</li>
        <li>Implement dual-custody approval controls and out-of-band banking verification protocols for all financial distributions.</li>
      </ol>
    </section>

    <!-- Reading Material -->
    <section class="module-awareness-guide">
      <h2>Website Reading Material</h2>
      
      <article>
        <h3>1. Business Email Compromise (BEC) in Distributed Financial Workflows</h3>
        <p><strong>Business Email Compromise (BEC)</strong> is one of the most financially damaging forms of social engineering. In remote work environments, finance staff, bookkeepers, and operational managers process payments, approve invoices, and handle payroll adjustments using digital communication channels. Threat actors target these distributed workflows, using compromised email accounts or spoofed corporate domains to divert funds to attacker-controlled accounts (Lazarus, 2024).</p>
      </article>

      <article>
        <h3>2. Vendor Invoice Manipulation & Banking Detail Scams</h3>
        <p>A primary BEC attack vector targeting remote accounting staff is <strong>Invoice Manipulation</strong>:</p>
        <ul>
          <li><strong>The Intercepted Invoice Lure:</strong> Threat actors gain unauthorized access to a vendor's email system or register a lookalike domain (e.g., vendor-supplies.co instead of vendor-supplies.com).</li>
          <li><strong>The Banking Update Request:</strong> The attacker sends an authentic-looking PDF invoice for an active contract, accompanied by a message stating: "Please note our banking details have changed due to a recent financial audit. Please update your system and wire all pending payments to the new account provided on page 2."</li>
          <li><strong>The Exploit:</strong> Because the invoice formatting, project names, and contact details match historical records, the remote bookkeeper updates the bank details and processes the payment, transferring funds directly to the criminal network (Papathanasiou et al., 2023).</li>
        </ul>
      </article>

      <article>
        <h3>3. Employee Payroll Direct Deposit Redirection</h3>
        <p>Remote HR and payroll coordinators are targeted through <strong>Payroll Impersonation Scams</strong>:</p>
        <ul>
          <li>The attacker sends an email appearing to come from a remote employee: "Hi HR, I recently changed banks. Please update my payroll direct deposit details for this Friday's paycheck to my new account [routing/account number attached]. Thanks!"</li>
          <li>The email uses urgent language and arrives right before payroll processing deadlines. If the HR coordinator updates the records without secondary verification, the employee's paycheck is diverted to the attacker's account.</li>
        </ul>
      </article>

      <article>
        <h3>4. Dual-Custody Controls & Verification Workflows</h3>
        <p>To mitigate BEC and invoice manipulation, remote teams must enforce dual-custody verification controls:</p>
        <ul>
          <li><strong>Out-of-Band (OOB) Banking Verification:</strong> Never update banking details, routing numbers, or wire transfer instructions based solely on an email request. Always call a verified contact number from the original master contract to confirm changes.</li>
          <li><strong>Dual-Control Payment Authorization:</strong> Require two separate corporate approvals (e.g., Bookkeeper initiates, Finance Director approves) for any payment or wire transfer exceeding a specified threshold.</li>
          <li><strong>Email Header Inspection:</strong> Inspect the Return-Path: and full email headers to check for mismatches between the displayed sender address and the actual originating mail server.</li>
        </ul>
      </article>
    </section>

    <!-- Scenario Simulation -->
    <section class="scenario-section">
      <h2>Interactive Scenario Simulation Game</h2>
      <p><strong>Scenario Name:</strong> The Annual Vendor Maintenance Renewal</p>
      <p><strong>Context:</strong> You are a remote accounts payable specialist for a software firm. You receive an email from billing@cloud-hosting-services.co (your actual provider domain is cloud-hosting-services.com).</p>

      <div class="scenario-stage">
        <h3>Stage 1 (The Email Request)</h3>
        <p>The email states: "Attached is Invoice #8841 for your annual cloud hosting renewal ($14,500). Please note our bank details have changed. Send wire transfer to our new account at First Global Bank."</p>
        <div class="scenario-decision">
          <h4>Decision Point:</h4>
          <ul>
            <li><strong>Option A:</strong> Update the vendor's banking record in your accounting software and process the $14,500 wire transfer immediately to avoid server downtime.</li>
            <li><strong>Option B:</strong> Notice the domain mismatch (.co vs .com), pause payment, and initiate out-of-band verification. <em>(Correct Path)</em></li>
          </ul>
        </div>
      </div>

      <div class="scenario-stage">
        <h3>Stage 2 (The Out-of-Band Verification Call)</h3>
        <p>How do you verify the new banking details?</p>
        <div class="scenario-decision">
          <h4>Decision Point:</h4>
          <ul>
            <li><strong>Option A:</strong> Call the phone number listed at the bottom of the new invoice PDF.</li>
            <li><strong>Option B:</strong> Call the vendor's account manager using the phone number recorded in your original signed contract directory. <em>(Correct Path)</em></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Red Flag Checklist -->
    <section class="red-flag-checklist">
      <h3>Red Flag Indicators & Actionable Checklist</h3>
      <ul>
        <li>Urgent Banking Detail Changes: Requests to update vendor or employee bank account numbers right before payment/payroll deadlines.</li>
        <li>Domain Mismatches: Subtle variations in vendor email domains (e.g., supplier-inc.co vs. supplier-inc.com).</li>
        <li>Payment Method Shifts: Requests to switch standard payment methods to wire transfers, Zelle, or gift cards.</li>
        <li>Unverified Direct Deposit Updates: Employee requests to update payroll accounts originating from personal webmail addresses.</li>
      </ul>
    </section>

    <!-- Curated Resources -->
    <section class="curated-resources">
      <h3>Curated Resources & References</h3>
      <ul>
        <li>Lazarus, S. (2024). Cybercriminal Networks and Operational Dynamics of Business Email Compromise (BEC) Scammers. <em>Deviant Behavior</em>, 46, 456–480.</li>
        <li>Papathanasiou, A., et al. (2023). Business Email Compromise (BEC) Attacks: Threats, Vulnerabilities and Countermeasures. <em>Journal of Cybersecurity and Privacy</em>, 3(3), 610–637.</li>
        <li>Hijji, M., & Alam, G. (2022). Cybersecurity Awareness and Training Framework for Remote Working Employees. <em>Sensors</em>, 22(22), 8663.</li>
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

<script src="./InvoiceScams.js"></script>
