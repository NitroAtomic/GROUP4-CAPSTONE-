<template>
  <main class="module-page">
    <header class="module-header page-band">
        <nav>
            <router-link to="/" class="home">
                <svg class="ui-icon home-breadcrumb-icon" aria-hidden="true"><use href="#ui-icon-home" /></svg>
                <span>Home</span>
            </router-link>
        </nav>

        <h1>Pretexting: the Fake Persona</h1>
        <p>Module 5 of 6</p>
    </header>


    <!-- =========================
         Pretexting Learning Guide
         ========================= -->

    <section
        id="pretexting-awareness-guide"
        class="module-awareness-guide"
    >
        <p class="module-key-details">
            <strong>Who this is for:</strong> remote workers handling
            administrative data, HR workflows, customer records, vendor
            management, or client onboarding.
        </p>

        <article>
            <h3>By the end of this module you can</h3>

            <ul>
                <li>
                    Explain the slow-burn structure of pretexting, where
                    phishing goes straight for panic.
                </li>

                <li>
                    Recognise the usual personas: a fake external auditor, a
                    new vendor, an HR representative, a distressed
                    contractor.
                </li>

                <li>
                    Notice the quiet moves that steer you around identity
                    checks and the ticketing system.
                </li>

                <li>
                    Hold a verification step for any unannounced request for
                    administrative or directory data.
                </li>
            </ul>
        </article>

    </section>


    <section id="pretexting-reading-material">
        <h2>What to know</h2>

        <article>
            <h3>What pretexting is</h3>

            <p>
                Pretexting is social engineering with a script. The attacker
                invents a situation &mdash; the pretext &mdash; and a person
                to go with it, then uses that character to talk you out of
                confidential information or unauthorised access.
            </p>

            <p>
                A phishing email wants instant panic. Pretexting is
                patient &mdash; a <strong>slow-burn</strong> approach:
                casual exchanges first, over days or weeks, rapport and
                credibility built, the request last.
            </p>
        </article>

        <article>
            <h3>The personas</h3>

            <p>
                Attackers research real roles so the character fits.
            </p>

            <ul>
                <li>
                    <strong>The external auditor or compliance
                    officer.</strong> An urgent &ldquo;data privacy
                    audit&rdquo; or &ldquo;software licensing check&rdquo;
                    that needs your directory charts, system architecture
                    documents, or employee listings.
                </li>

                <li>
                    <strong>The new vendor or subcontractor.</strong> A
                    newly hired third-party provider who needs
                    &ldquo;sample data files&rdquo; or access to your
                    internal staging servers before an upcoming project.
                </li>

                <li>
                    <strong>The distressed remote colleague.</strong> A
                    fellow remote employee locked out while travelling,
                    appealing to your sympathy so you share internal files
                    or forward login details.
                </li>
            </ul>
        </article>

        <article>
            <h3>Getting around the process</h3>

            <p>
                Pretexters lean on ordinary decency &mdash; politeness,
                wanting to help, deference to authority &mdash; to talk you
                past your procedures.
            </p>

            <ul>
                <li>
                    <strong>Away from the ticket.</strong> They discourage a
                    formal IT ticket or an administrative review:
                    &ldquo;Opening a ticket takes 3 days, and the VP needs
                    this file in 10 minutes.&rdquo;
                </li>

                <li>
                    <strong>Flattery and sympathy.</strong> You are made to
                    feel like the one helpful person who can rescue this.
                </li>
            </ul>
        </article>

        <article>
            <h3>Scenario: the fake HR benefits survey</h3>

            <p>
                David, a remote administrative assistant, gets a LinkedIn
                connection request and message from &ldquo;Elena, Senior HR
                Director at Global HR Solutions&rdquo;: <em>&ldquo;Hi
                David, your company has contracted us to review remote
                employee benefit satisfaction. We are conducting brief
                5-minute interviews.&rdquo;</em>
            </p>

            <p>
                Over three days of polite messaging, Elena builds rapport.
                On day four she sends an &ldquo;Employee Verification
                Portal&rdquo; link and asks David to confirm his corporate
                ID, home address, and his manager&rsquo;s email. It felt
                natural, so he submits the data without checking with his
                own HR department.
            </p>
        </article>

        <article>
            <h3>What to do instead</h3>

            <ol>
                <li>
                    <strong>Keep it in the ticket system.</strong>
                    Administrative, data and access requests go through the
                    official, authenticated queue &mdash; no exceptions for
                    urgency.
                </li>

                <li>
                    <strong>Check third parties yourself.</strong> If an
                    external auditor or vendor contacts you, confirm their
                    contract status with your manager or procurement lead
                    before sharing files.
                </li>

                <li>
                    <strong>Distrust the elaborate story.</strong> Real
                    company business rarely needs a complicated explanation
                    for skipping a standard security check.
                </li>
            </ol>
        </article>

    </section>

    <section id="pretexting-red-flags">
        <h2>Red flags</h2>

        <ul>
            <li>
                <strong>Unsolicited contact over several days.</strong>
                Casual rapport first, a request for data or files later.
            </li>

            <li>
                <strong>Pressure to avoid official channels.</strong> No
                ticket, no official distribution list, no manager involved.
            </li>

            <li>
                <strong>Questions about how you work.</strong> Casual
                interest in your organisational hierarchy, software
                versions, or internal tools.
            </li>

            <li>
                <strong>Appeals to empathy or authority.</strong> Extreme
                distress, impending disciplinary action, or an executive
                deadline, used to force compliance.
            </li>
        </ul>
    </section>

    <section id="pretexting-curated-resources">
        <h2>References</h2>

        <ul>
            <li>
                <strong>Video Source:</strong>
                <a href="https://www.youtube.com/watch?v=cbL_IBAi6tA" target="_blank" rel="noopener noreferrer">
                    SANS Institute — "What Is a Pretexting Attack?"
                </a>
            </li>

            <li>
                <strong>Reference Guide:</strong>
                <a href="https://securityboulevard.com/2026/06/pretexting-examples-real-world-scams-explained/" target="_blank" rel="noopener noreferrer">
                    Security Boulevard — Pretexting Examples: Real-World Scams Explained
                </a>
            </li>
        </ul>
    </section>

    <!-- =========================
         Module Quiz Section
         ========================= -->

    <section class="module-quiz-section">

        <h2>Test Your Knowledge</h2>

        <p>
            Ready to check what you've learned? Take a randomized
            10-question quiz drawn from a pool of 20, so a retake is never the
            same test twice.
        </p>

        <router-link to="/quiz/module-5/question" class="take-quiz-button">
            Take a Quiz
        </router-link>

        <router-link to="/" class="module-home-button">
            Back to Homepage
        </router-link>

    </section>

        <!-- =========================
         AI Chatbot
         ========================= -->
  </main>
</template>

<script src="./Pretexting.js"></script>
