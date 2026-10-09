<template>
  <main class="module-page">
    <header class="module-header page-band">
        <nav>
            <router-link to="/" class="home">
                <svg class="ui-icon home-breadcrumb-icon" aria-hidden="true"><use href="#ui-icon-home" /></svg>
                <span>Home</span>
            </router-link>
        </nav>

        <h1>Spear Phishing and Target Research</h1>
        <p>Module 2 of 6</p>
    </header>


    <!-- =========================
         Spear Phishing Learning Guide
         ========================= -->

    <section
        id="spear-phishing-awareness-guide"
        class="module-awareness-guide"
    >
        <p class="module-key-details">
            <strong>Who this is for:</strong> remote staff with system access,
            administrative privileges, financial responsibilities, or a public
            social media profile.
        </p>

        <article>
            <h2>By the end of this module you can</h2>

            <ul>
                <li>
                    Tell broad mass phishing apart from a message written for
                    you alone.
                </li>

                <li>
                    Recognise how Open Source Intelligence (OSINT) from
                    LinkedIn, GitHub and X becomes a personal lure.
                </li>

                <li>
                    Spot the risk in a macro-enabled attachment, a double file
                    extension, and a move to an out-of-band messaging channel.
                </li>
            </ul>
        </article>

    </section>


    <section>
        <h2>What to know</h2>

        <article>
            <h3>How it differs from mass phishing</h3>

            <p>
                Mass phishing sends thousands of identical, generic messages
                broadly, hoping a small percentage click. Spear phishing is the
                opposite: one message, aimed at one person, team or
                organisation.
            </p>

            <p>
                It names real people, your current client engagement, the
                internal platforms you use, a recent company event. That
                familiarity drops your guard.
            </p>
        </article>

        <figure>
            <img src="/images/OSINT-for-Targeted-Spear-Phishing-Process-Flow.png" alt="Diagram showing three Open Source Intelligence sources feeding into a customized spear phishing message: a LinkedIn profile revealing job role, work experience, and connections; a GitHub repository revealing projects, code and technologies, and commit history; and Social Media/X revealing posts, activity patterns, and tools or technologies mentioned. All three funnel into a single result labeled Customized Spear Phishing Targeted Communication.">
            <figcaption>Details from LinkedIn, GitHub and social media/X combine into one message aimed at a single target.</figcaption>
        </figure>

        <article>
            <h3>Open source intelligence (OSINT)</h3>

            <p>
                Before sending anything, the attacker researches you, using
                only public pages:
            </p>

            <ul>
                <li>
                    <strong>LinkedIn.</strong> Reporting lines, job titles,
                    active projects, vendor relationships.
                </li>

                <li>
                    <strong>GitHub and technical blogs.</strong> Programming
                    frameworks, internal repository names, outdated
                    dependencies your engineering team uses.
                </li>

                <li>
                    <strong>Social media and X.</strong> Holiday schedules,
                    conference attendance, where people work from.
                </li>
            </ul>

            <p>
                That is enough for an email from a co-worker who really is at a
                conference, about a real client project:
            </p>

            <p>
                <em>&ldquo;Hi Alex, I&rsquo;m at the TechSummit conference
                right now. Could you check the attached update for the Acme
                Corp project proposal? Password to unzip is 1234.&rdquo;</em>
            </p>
        </article>

        <article>
            <h3>The attachment</h3>

            <p>
                The payload arrives as a file, weaponised in one of three ways:
            </p>

            <ul>
                <li>
                    <strong>Macro-enabled Office documents</strong>
                    (<code>.docm</code>, <code>.xlsm</code>). Enable macros and
                    an embedded Visual Basic for Applications (VBA) script
                    downloads secondary malware &mdash; a trojan or
                    infostealer.
                </li>

                <li>
                    <strong>Double extensions</strong> (<code>.pdf.exe</code>,
                    <code>.docx.iso</code>). Operating systems hide known
                    extensions by default, so
                    <code>Quarterly_Report.pdf.exe</code> shows on screen as
                    <code>Quarterly_Report.pdf</code>.
                </li>

                <li>
                    <strong>Encrypted archives</strong> (<code>.zip</code>,
                    <code>.rar</code>, <code>.7z</code>). The archive is
                    locked, the password is in the email body, and the gateway
                    cannot look inside &mdash; so the attachment walks past the
                    automated perimeter scanners.
                </li>
            </ul>
        </article>

    </section>

    <article>
        <h2>References</h2>

        <ul>
            <li>
                <strong>Technical Taxonomy:</strong>
                <a href="https://attack.mitre.org/techniques/T1566/001/" target="_blank" rel="noopener noreferrer">
                    MITRE ATT&CK Framework — Phishing: Spearphishing Attachment (Technique T1566.001)
                </a>
            </li>

            <li>
                <strong>Research Survey:</strong> Birthriya, S. K., Ahlawat,
                P., & Jain, A. K. (2025). Detection and prevention of spear
                phishing attacks: A comprehensive survey.
                <em>Computers & Security</em>, 151, 104317.
            </li>

            <li>
                <strong>Security Advisory:</strong>
                <a href="https://www.cisa.gov/news-events/news/spear-phishing-threats-and-prevention" target="_blank" rel="noopener noreferrer">
                    CISA — Protecting Against Spear Phishing & OSINT Exploitation
                </a>
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

        <router-link to="/quiz/module-2/question" class="take-quiz-button">
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

<script src="./SpearPhishing.js"></script>
