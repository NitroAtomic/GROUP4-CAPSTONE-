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
        <span class="module-breadcrumb-current">Invoice and Payment Fraud</span>
      </nav>
      <h1>Invoice and Payment Fraud</h1>
      <p>How attackers redirect a real payment to their own account &mdash; by changing bank details on an invoice, or a payroll record &mdash; and the two checks that stop it.</p>
    </header>

    <p class="module-key-details">
      <strong>Who this is for:</strong> remote bookkeepers, finance coordinators, payroll assistants, account managers, and small-business operations staff.
    </p>

    <!-- Learning Objectives -->
    <section class="learning-objectives">
      <h3>By the end of this module you can</h3>
      <ol>
        <li>Explain how business email compromise works when finance runs over email.</li>
        <li>Spot a changed bank detail on a real invoice, and a lookalike sender domain.</li>
        <li>Recognise a payroll redirect request for what it is.</li>
        <li>Apply out-of-band verification and dual approval before money moves.</li>
      </ol>
    </section>

    <!-- Reading Material -->
    <section class="module-awareness-guide">
      <h2>What to know</h2>

      <article>
        <h3>Business email compromise</h3>
        <p>Business email compromise is the costliest form of social engineering. When finance runs over email, an attacker does not need to break anything &mdash; they only need one convincing message. Using a compromised mailbox or a spoofed domain, they redirect a payment you were always going to make (Lazarus, 2024).</p>
      </article>

      <article>
        <h3>Changed bank details on a real invoice</h3>
        <p>The usual route into a remote finance team. The invoice is genuine; only the account number is not.</p>
        <ul>
          <li><strong>The access.</strong> The attacker gets into a vendor's mailbox, or registers a near-identical domain &mdash; <code>vendor-supplies.co</code> for <code>vendor-supplies.com</code>.</li>
          <li><strong>The request.</strong> An invoice arrives for a contract you really do have, with a line saying the banking details have changed after an audit, and to pay the new account.</li>
          <li><strong>Why it works.</strong> The formatting, the project name and the contact history all match your records, so there is nothing obvious to doubt (Papathanasiou et al., 2023).</li>
        </ul>
      </article>

      <article>
        <h3>Payroll redirect</h3>
        <p>The same trick aimed at HR instead of accounts payable.</p>
        <ul>
          <li>A message that looks like it is from a colleague: they have changed banks, please update the direct deposit before Friday.</li>
          <li>It lands just before the payroll deadline, so there is no time to check. Updated without a second check, that person's pay goes to the attacker.</li>
        </ul>
      </article>

      <article>
        <h3>The two controls that stop it</h3>
        <ul>
          <li><strong>Verify out of band.</strong> Never change bank details from an email alone. Call the number on the signed contract &mdash; not the one on the new invoice.</li>
          <li><strong>Require two people.</strong> Above an agreed amount, one person raises the payment and a second approves it.</li>
          <li><strong>Read the headers.</strong> The displayed sender and the actual sending server often disagree. That gap is the tell.</li>
        </ul>
      </article>
    </section>

    <!-- Scenario Simulation -->
    <section class="scenario-section">
      <h2>Scenario: the annual renewal</h2>
      <p>You handle accounts payable for a software firm. An email arrives from <code>billing@cloud-hosting-services.co</code>. Your provider's real domain is <code>cloud-hosting-services.com</code>.</p>

      <div class="scenario-stage">
        <h3>Stage 1 &mdash; the request</h3>
        <p>&ldquo;Attached is Invoice #8841 for your annual cloud hosting renewal ($14,500). Our bank details have changed. Please wire to our new account at First Global Bank.&rdquo;</p>
        <div class="scenario-decision">
          <h4>What do you do?</h4>
          <ul>
            <li><strong>A:</strong> Update the vendor record and send the $14,500 now, to avoid the servers going down.</li>
            <li><strong>B:</strong> Notice <code>.co</code> is not <code>.com</code>, hold the payment, and verify. <em>(Correct)</em></li>
          </ul>
        </div>
      </div>

      <div class="scenario-stage">
        <h3>Stage 2 &mdash; verifying</h3>
        <p>You decide to confirm the new account by phone. Which number?</p>
        <div class="scenario-decision">
          <h4>What do you do?</h4>
          <ul>
            <li><strong>A:</strong> The number printed at the bottom of the new invoice.</li>
            <li><strong>B:</strong> The account manager's number from your signed contract. <em>(Correct)</em></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Red Flag Checklist -->
    <section class="red-flag-checklist">
      <h3>Red flags</h3>
      <ul>
        <li>A bank detail change requested just before a payment or payroll deadline.</li>
        <li>A sender domain that is one character off the real one.</li>
        <li>A push to switch payment method &mdash; to a wire, Zelle, or gift cards.</li>
        <li>A payroll change sent from someone's personal webmail.</li>
      </ul>
    </section>

    <!-- Curated Resources -->
    <section class="curated-resources">
      <h3>References</h3>
      <ul>
        <li>Lazarus, S. (2024). Cybercriminal Networks and Operational Dynamics of Business Email Compromise (BEC) Scammers. <em>Deviant Behavior</em>, 46, 456–480.</li>
        <li>Papathanasiou, A., et al. (2023). Business Email Compromise (BEC) Attacks: Threats, Vulnerabilities and Countermeasures. <em>Journal of Cybersecurity and Privacy</em>, 3(3), 610–637.</li>
        <li>Hijji, M., &amp; Alam, G. (2022). Cybersecurity Awareness and Training Framework for Remote Working Employees. <em>Sensors</em>, 22(22), 8663.</li>
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

<script src="./InvoiceScams.js"></script>
