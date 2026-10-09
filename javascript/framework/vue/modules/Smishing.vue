<template>
  <main class="module-page">
    <header class="module-header page-band">
        <nav>
            <router-link to="/" class="home">
                <svg class="ui-icon home-breadcrumb-icon" aria-hidden="true"><use href="#ui-icon-home" /></svg>
                <span>Home</span>
            </router-link>
        </nav>

        <h1>Smishing: Scam Texts and Messages</h1>
        <p>Module 3 of 6</p>
    </header>


    <!-- =========================
         Smishing Learning Guide
         ========================= -->

    <section
        id="smishing-awareness-guide"
        class="module-awareness-guide"
    >
        <p class="module-key-details">
            <strong>Who this is for:</strong> remote employees and freelancers
            using a personal phone (BYOD) for multi-factor authentication
            (MFA), client messaging, and team communication.
        </p>

        <article>
            <h3>By the end of this module you can</h3>

            <ul>
                <li>
                    Explain why a text feels more trustworthy than an email,
                    and why that is a problem.
                </li>

                <li>
                    Recognise the technical tricks: shortened URLs, a spoofed
                    sender ID, a fake portal.
                </li>

                <li>
                    Tell a real bank or courier alert apart from a smishing
                    lure.
                </li>

                <li>
                    Harden your phone, protect your OTP and MFA codes, and
                    report what arrives.
                </li>
            </ul>
        </article>

    </section>


    <section id="smishing-reading-material">
        <h2>What to know</h2>

        <article>
            <h3>Why the phone is the soft spot</h3>

            <p>
                Smishing is phishing by text &mdash; a malicious link or a
                prompt to call, sent over Short Message Service (SMS) or an app
                like WhatsApp, Signal or Telegram. As Multi-Factor
                Authentication (MFA) and team collaboration move onto phones,
                so do the attackers.
            </p>

            <p>A phone has three specific weaknesses:</p>

            <ul>
                <li>
                    <strong>You trust it more.</strong> Text feels personal, so
                    texts get opened and tapped far more than email.
                </li>

                <li>
                    <strong>You cannot see the link.</strong> A mobile browser
                    has no room for the full URL, hiding the real destination
                    domain.
                </li>

                <li>
                    <strong>Nothing is watching.</strong> A personal phone
                    usually lacks the company&rsquo;s endpoint detection and
                    response (EDR) agent or web filtering.
                </li>
            </ul>
        </article>

        <article>
            <h3>The lures that work</h3>

            <p>Each lure is built on an ordinary, everyday event:</p>

            <ul>
                <li>
                    <strong>The parcel.</strong> A FedEx, DHL or postal
                    delivery stuck until you confirm an address or pay a small
                    fee. The link harvests your card or password.
                </li>

                <li>
                    <strong>The bank alert.</strong> An urgent security hold or
                    unauthorised transaction on your account, and a link to
                    &ldquo;click here immediately to verify identity&rdquo;.
                </li>

                <li>
                    <strong>The OTP grab.</strong> The attacker logs into your
                    corporate account, which sends a real One-Time Password
                    (OTP) to your phone. Then a text arrives: &ldquo;IT Desk:
                    We detected suspicious activity. Reply with the 6-digit
                    code sent to your device to secure your account.&rdquo;
                    The code is real; the sender is not.
                </li>
            </ul>
        </article>

        <article>
            <h3>Hidden links, faked senders</h3>

            <p>
                The true destination hides behind a URL shortener &mdash;
                <code>bit.ly</code>, <code>tinyurl.com</code>,
                <code>t.co</code> &mdash; or a lookalike domain like
                <code>bank-secure-login.site</code>. Sender ID spoofing goes
                further: an SMS gateway tool sets the alpha-numeric sender name
                to your bank&rsquo;s, so the fake text drops into the exact
                same conversation thread as the real ones.
            </p>
        </article>

        <article>
            <h3>Scenario: the IT unlocking text</h3>

            <p>
                Sarah is a remote customer support agent. At 8:00 AM a text
                arrives: <em>&ldquo;OKTA ALERT: Your remote access account has
                been flagged for compliance review. Resolve within 30 minutes
                to maintain shift access:
                <code>https://okta-sso-verify.link/login</code>&rdquo;</em>
            </p>

            <p>
                Afraid of missing her shift and being disciplined, she taps the
                link. The page is an exact copy of her company&rsquo;s SSO
                login portal. She enters her username, password and push MFA
                token, handing her enterprise credentials to an attacker.
            </p>
        </article>

        <article>
            <h3>What to do</h3>

            <ol>
                <li>
                    <strong>Do not tap links in unsolicited texts.</strong>
                    Treat every clickable link as untrusted. If the alert
                    claims to be your bank or employer, open their official app
                    or site yourself.
                </li>

                <li>
                    <strong>Guard your OTPs and MFA codes.</strong> Never share
                    a One-Time Password or MFA token with anyone, by text or by
                    phone. Real IT never asks for one back.
                </li>

                <li>
                    <strong>Expand short links first.</strong> Use a URL
                    expansion tool, or your phone&rsquo;s link preview, before
                    tapping a shortened link.
                </li>

                <li>
                    <strong>Report it.</strong> Forward scam texts to SPAM
                    (<code>7726</code>) on networks that support it, or tell
                    your security team.
                </li>
            </ol>
        </article>

    </section>

    <section id="smishing-red-flags">
        <h2>Red flags</h2>

        <ul>
            <li>
                A text threatening account suspension, a missed delivery or
                legal action unless you tap now.
            </li>

            <li>
                A shortened or obscured link &mdash; <code>bit.ly</code>,
                <code>tiny.cc</code> &mdash; or an unusual top-level domain
                like <code>.xyz</code>, <code>.site</code>,
                <code>.info</code>.
            </li>

            <li>
                Anyone asking you to text back or read aloud a multi-factor
                authentication code.
            </li>

            <li>
                A bank or corporate alert from a standard 10-digit mobile
                number instead of a registered shortcode.
            </li>
        </ul>
    </section>

    <section id="smishing-curated-resources">
        <h2>References</h2>

        <ul>
            <li>
                <strong>Video Source:</strong>
                <a href="https://www.youtube.com/watch?v=2n-1ZInI_vE" target="_blank" rel="noopener noreferrer">
                    Federal Communications Commission (FCC) — "Avoid the Temptation of Smishing Scams"
                </a>
            </li>

            <li>
                <strong>Reference Guide:</strong>
                <a href="https://www.fcc.gov/avoid-temptation-smishing-scams" target="_blank" rel="noopener noreferrer">
                    FCC Consumer Guide — Avoid the Temptation of Smishing Scams
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

        <router-link to="/quiz/module-3/question" class="take-quiz-button">
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

<script src="./Smishing.js"></script>
