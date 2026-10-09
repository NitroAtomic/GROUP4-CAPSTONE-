<template>
  <main class="module-page">
    <header class="module-header page-band">
        <nav>
            <router-link to="/" class="home">
                <svg class="ui-icon home-breadcrumb-icon" aria-hidden="true"><use href="#ui-icon-home" /></svg>
                <span>Home</span>
            </router-link>
        </nav>

        <h1>Vishing: Phishing by Phone</h1>
        <p>Module 4 of 6</p>
    </header>


    <!-- =========================
         Vishing Learning Guide
         ========================= -->

    <section
        id="vishing-awareness-guide"
        class="module-awareness-guide"
    >
        <p class="module-key-details">
            <strong>Who this is for:</strong> remote workers in client
            support, phone-based operations, sales, executive support, or
            administrative roles.
        </p>

        <article>
            <h3>By the end of this module you can</h3>

            <ul>
                <li>
                    Explain how caller ID spoofing and VoIP let a stranger
                    look internal.
                </li>

                <li>
                    Describe how a live call overloads you into complying.
                </li>

                <li>
                    Recognise the usual stories: a fake IT helpdesk, an
                    emergency hold on your money, an urgent
                    remote-management install.
                </li>

                <li>
                    Call back on a number you looked up yourself, before
                    sharing credentials or approving access.
                </li>
            </ul>
        </article>

    </section>


    <section id="vishing-reading-material">
        <h2>What to know</h2>

        <article>
            <h3>What vishing is</h3>

            <p>
                Vishing is phishing over a phone call or a Voice over IP
                (VoIP) line. The caller wants sensitive data, financial
                details, or access to a system. An email you can reread; a
                live call you answer in real time. That pressure is the
                point.
            </p>
        </article>

        <article>
            <h3>Faking the number</h3>

            <p>
                Phone protocols let a caller choose what your screen shows.
            </p>

            <ul>
                <li>
                    <strong>Caller ID spoofing.</strong> Web-based VoIP
                    services let an attacker set the outbound caller ID to
                    anything: an internal extension like &ldquo;Corporate IT
                    Helpdesk&rdquo; or &ldquo;HQ Executive Office&rdquo;, or
                    your bank&rsquo;s customer service line.
                </li>

                <li>
                    <strong>Interactive Voice Response (IVR)
                    robocalls.</strong> An automated menu (&ldquo;Press 1 to
                    speak to our fraud department&rdquo;) imitates a real
                    bank call centre, then routes you to a live scammer.
                </li>
            </ul>
        </article>

        <article>
            <h3>Why a live call works</h3>

            <p>
                The caller hears your tone and your hesitation, and adapts.
            </p>

            <ul>
                <li>
                    <strong>Manufactured urgency.</strong> A cyberattack or
                    a fraudulent transaction is happening right now, so you
                    must act now.
                </li>

                <li>
                    <strong>Borrowed authority.</strong> The caller plays a
                    senior systems administrator, a financial auditor, an
                    executive assistant &mdash; someone you do not argue
                    with.
                </li>

                <li>
                    <strong>No thinking room.</strong> A fast pace stops you
                    stepping back to judge whether any of this is true.
                </li>
            </ul>
        </article>

        <article>
            <h3>The calls remote workers actually get</h3>

            <ul>
                <li>
                    <strong>The password reset.</strong> Your remote access
                    account has suspicious logins, says the caller. Read out
                    the code in your SMS, or approve the push notification.
                </li>

                <li>
                    <strong>The urgent patch.</strong> Your laptop needs a
                    fix now: download and run remote administration software
                    &mdash; AnyDesk, TeamViewer, Quick Assist. Once
                    installed, the caller controls your workstation.
                </li>
            </ul>
        </article>

        <article>
            <h3>Scenario: the fake IT helpdesk</h3>

            <p><strong>Push bombing a tired engineer.</strong></p>

            <p>
                Mark, a remote systems engineer, gets 15 MFA push
                notifications at 10 PM. His phone rings. The caller ID says
                &ldquo;Internal IT Operations.&rdquo;
            </p>

            <p>
                <em>&ldquo;Hi Mark, Dave from IT SecOps. Those push alerts
                are a gateway glitch. I am pushing one final prompt &mdash;
                tap Approve to clear the queue so your account isn&rsquo;t
                locked overnight.&rdquo;</em>
            </p>

            <p>
                Tired, Mark taps Approve. Dave was an attacker who already
                had his password; the call plus push fatigue got him past
                MFA.
            </p>
        </article>

        <article>
            <h3>What to do instead</h3>

            <ol>
                <li>
                    <strong>Never read out a credential or a code.</strong>
                    Real IT will not ring and ask for your password, PIN, or
                    MFA code.
                </li>

                <li>
                    <strong>Hang up and call back.</strong> If the caller
                    claims to be an internal department or your bank, end
                    the call. Look up the official number in the company
                    directory or on the back of your card, and dial it
                    yourself.
                </li>

                <li>
                    <strong>Refuse remote-access installs.</strong> Never
                    install AnyDesk or TeamViewer because an inbound call
                    told you to.
                </li>
            </ol>
        </article>

    </section>

    <section id="vishing-red-flags">
        <h2>Red flags</h2>

        <ul>
            <li>
                <strong>An unsolicited technical support call.</strong>
                Someone claiming to be internal IT, wanting system access or
                your password.
            </li>

            <li>
                <strong>A push to install remote access tools.</strong>
                AnyDesk, TeamViewer or LogMeIn, during an unexpected call.
            </li>

            <li>
                <strong>A request to confirm MFA.</strong> Approve this push
                notification, or read me your one-time password.
            </li>

            <li>
                <strong>Pressure and intimidation.</strong> Aggressive
                language, or threats of dismissal or legal action if you
                refuse.
            </li>
        </ul>
    </section>

    <section id="vishing-curated-resources">
        <h2>References</h2>

        <ul>
            <li>
                <strong>Video Source:</strong>
                <a href="https://www.youtube.com/watch?v=zE60tK9M1x8" target="_blank" rel="noopener noreferrer">
                    Global Cyber Alliance — "What is Vishing? Understanding This High-Tech Phone Scam"
                </a>
            </li>

            <li>
                <strong>Reference Guide:</strong>
                <a href="https://www.cisco.com/site/us/en/learn/topics/security/what-is-vishing.html" target="_blank" rel="noopener noreferrer">
                    Cisco Security Topics — What is Vishing?
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

        <router-link to="/quiz/module-4/question" class="take-quiz-button">
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

<script src="./Vishing.js"></script>
