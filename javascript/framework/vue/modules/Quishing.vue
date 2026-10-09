<template>
  <main class="module-page">
    <header class="module-header page-band">
        <nav>
            <router-link to="/" class="home">
                <svg class="ui-icon home-breadcrumb-icon" aria-hidden="true"><use href="#ui-icon-home" /></svg>
                <span>Home</span>
            </router-link>
        </nav>

        <h1>Phishing and QR Code Scams</h1>
        <p>Module 1 of 6</p>
    </header>


    <!-- =========================
         Phishing Learning Guide
         ========================= -->

    <section
        id="quishing-awareness-guide"
        class="module-awareness-guide"
    >
        <p class="module-key-details">
            <strong>Who this is for:</strong> all remote workers, freelancers,
            virtual assistants, and distributed contractors.
        </p>

        <article>
            <h2>By the end of this module you can</h2>

            <ul>
                <li>
                    Spot the giveaways in a phishing email: a lookalike domain,
                    a faked sender, a deadline.
                </li>

                <li>
                    Explain how a link hidden in a QR code &mdash; quishing
                    &mdash; slips past a Security Email Gateway (SEG).
                </li>

                <li>
                    Run the same three checks before clicking a link, scanning
                    a QR code, or typing a password into a portal.
                </li>
            </ul>
        </article>

    </section>


    <section>
        <h2>What to know</h2>

        <article>
            <h3>Phishing when the office is in the cloud</h3>

            <p>
                In an office your computer sits behind a company firewall, an
                intrusion prevention system (IPS), and a monitored Security
                Email Gateway (SEG). Working remotely, you connect straight to
                Google Workspace, Microsoft 365 or Slack over home Wi-Fi, often
                on your own device (BYOD). None of that is in the way, so
                attacks arrive dressed as the tools you open daily.
            </p>

            <p>
                The fake sites lean on domain tricks. Typosquatting swaps one
                character: <code>micros0ft-verify.com</code> for
                <code>microsoft.com</code>. Combosquatting adds
                trusted-sounding words, as in
                <code>slack-login-security.net</code>. And because an SSL/TLS
                certificate is free, the counterfeit server shows the same
                HTTPS padlock as the real one &mdash; which is what convinces
                people the login page is safe.
            </p>
        </article>

        <figure>
            <img src="/images/Phishing-and-Quishing-Comparison.png" alt="Flowchart comparing traditional email phishing to quishing. Traditional: deceptive email link, clicked by user through the email gateway. Quishing: embedded QR code in a message or document, scanned by the user's phone camera, opened outside the company's firewall protection.">
            <figcaption>Traditional phishing sends a clickable link the gateway can scan. Quishing hides it in a QR code image the gateway cannot read, opened on an unmonitored personal phone.</figcaption>
        </figure>

        <article>
            <h3>Quishing: the link inside a QR code</h3>

            <p>
                Email filters read text &mdash; the written HTML and any
                plain-text URL. They rarely run OCR (optical character
                recognition) on an image, or decode a picture inside a PDF
                attachment. A Quick Response (QR) code is an image, so the link
                inside it is invisible to them. That is why quishing keeps
                growing against distributed staff.
            </p>

            <p>
                The email claims to be an &ldquo;MFA Security Update&rdquo; or
                an &ldquo;HR Employee Handbook Review,&rdquo; so the gateway
                lets it through. You scan it with your phone camera. The
                session moves off your monitored work computer onto an
                unmonitored personal device, landing on a credential-harvesting
                web form, or an OAuth page asking you to grant consent.
            </p>
        </article>

        <article>
            <h3>Red flags</h3>

            <ul>
                <li>
                    A display name reading &ldquo;IT Helpdesk&rdquo; over a
                    header address of
                    <code>support@mail-system-update24.net</code>.
                </li>

                <li>
                    Subject lines built on fear: &ldquo;Urgent: Account
                    Suspension in 2 Hours.&rdquo; &ldquo;Unusual Login Detected
                    - Verify Immediately.&rdquo;
                </li>

                <li>
                    An unsolicited QR code, to be scanned on your phone to
                    reach a desktop web service.
                </li>

                <li>
                    A greeting of &ldquo;Dear Customer,&rdquo; or link text
                    reading <code>portal.company.com</code> that points at an
                    unrelated IP address.
                </li>
            </ul>
        </article>

        <article>
            <h3>The three checks</h3>

            <ol>
                <li>
                    <strong>Read the real address.</strong> Hover over the
                    sender&rsquo;s name for the full address, and match the
                    domain to official company records.
                </li>

                <li>
                    <strong>Never scan a code you were sent.</strong> To log in
                    or reset a password, type the official portal address into
                    a browser yourself.
                </li>

                <li>
                    <strong>Report, then contain.</strong> Hit &ldquo;Report
                    Phishing&rdquo; in your mail client. If you entered your
                    details, tell your security team and change that password
                    across connected systems.
                </li>
            </ol>
        </article>

    </section>

    <article>
        <h2>References</h2>

        <ul>
            <li>
                <strong>Official Technical Guide:</strong>
                <a href="https://www.cisa.gov/resources-tools/resources/phishing-guidance-stopping-attack-cycle-phase-one" target="_blank" rel="noopener noreferrer">
                    CISA, NSA, FBI, & MS-ISAC — Phishing Guidance: Stopping the Attack Cycle at Phase One
                </a>
            </li>

            <li>
                <strong>Industry Overview:</strong>
                <a href="https://consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams" target="_blank" rel="noopener noreferrer">
                    FTC — Recognizing and Avoiding Phishing Scams
                </a>
            </li>

            <li>
                <strong>Academic Reference:</strong> Alkhalil, Z., Hewage, C.,
                Nawaf, L., & Khan, I. (2021). Phishing attacks: A recent
                comprehensive study and a new anatomy.
                <em>Frontiers in Computer Science</em>, 3, Article 563060.
            </li>
        </ul>
    </article>

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

        <router-link to="/quiz/module-1/question" class="take-quiz-button">
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

<script src="./Quishing.js"></script>
