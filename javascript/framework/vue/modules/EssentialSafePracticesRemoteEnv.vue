<template>
  <main class="module-page">
    <header class="module-header page-band">
        <nav>
            <router-link to="/" class="home">
                <svg class="ui-icon home-breadcrumb-icon" aria-hidden="true"><use href="#ui-icon-home" /></svg>
                <span>Home</span>
            </router-link>
        </nav>

        <h1>Safe Practices for Remote Work</h1>
        <p>Module 6 of 6</p>
    </header>


    <!-- =========================
         Essential Safe Practices Learning Guide
         ========================= -->

    <section
        id="essential-safe-practices-awareness-guide"
        class="module-awareness-guide"
    >
        <p class="module-key-details">
            <strong>Who this is for:</strong> everyone working remotely
            &mdash; distributed employees, freelancers, and hybrid staff.
        </p>

        <article>
            <h3>By the end of this module you can</h3>

            <ul>
                <li>
                    Tell strong multi-factor authentication (MFA) from weak,
                    and move off SMS to an authenticator app (TOTP) or a
                    hardware key.
                </li>

                <li>
                    Harden your home network: the router admin login, WPA3
                    encryption, and an isolated guest network.
                </li>

                <li>
                    Verify out of band before acting on anything about
                    money, passwords or access.
                </li>

                <li>
                    Keep up the daily habits &mdash; BYOD patching, password
                    management, and reporting an incident fast.
                </li>
            </ul>
        </article>

    </section>


    <section id="essential-safe-practices-reading-material">
        <h2>What to know</h2>

        <article>
            <h3>There is no perimeter now</h3>

            <p>
                An office has a wall around it: corporate firewalls,
                intrusion detection, locked doors. Remote work removes it.
                Work travels over home Wi-Fi, personal routers and
                commercial mobile networks.
            </p>

            <p>
                So every device is its own perimeter, which takes technical
                hardening and steady personal habits.
            </p>
        </article>

        <article>
            <h3>MFA, weakest to strongest</h3>

            <p>
                MFA helps beyond a password, but the methods are not equal.
            </p>

            <ul>
                <li>
                    <strong>SMS codes &mdash; vulnerable.</strong> A texted
                    code can be intercepted by SIM-swapping, mobile malware,
                    or a smishing lure.
                </li>

                <li>
                    <strong>Authenticator apps (TOTP) &mdash;
                    recommended.</strong> Time-based One-Time Password apps
                    &mdash; Google Authenticator, Microsoft Authenticator,
                    1Password &mdash; generate the code on your device, with
                    no cellular SMS involved.
                </li>

                <li>
                    <strong>FIDO2 hardware keys &mdash; the gold
                    standard.</strong> A physical USB or NFC key such as a
                    YubiKey is phishing-resistant: it binds the login
                    cryptographically to the verified site domain.
                </li>
            </ul>
        </article>

        <article>
            <h3>Home network and your own devices (BYOD)</h3>

            <p>
                Home Wi-Fi is an easy side door into work systems.
            </p>

            <ul>
                <li>
                    <strong>Change the router&rsquo;s default
                    login.</strong> Factory passwords like
                    <code>admin/admin</code> are public knowledge, and
                    botnets scan for them constantly.
                </li>

                <li>
                    <strong>Use WPA3, or WPA2 Enterprise.</strong> Strong
                    encryption only &mdash; turn off outdated WEP and plain
                    WPA.
                </li>

                <li>
                    <strong>Put IoT devices on the guest network.</strong>
                    Smart TVs, appliances and cameras often go unpatched.
                    Keep the work laptop on an isolated guest network so a
                    compromised gadget cannot intercept work traffic.
                </li>

                <li>
                    <strong>Let updates install themselves.</strong>
                    Operating system, browser, security software. Unpatched
                    software is how a drive-by download reaches you from a
                    page you only visited.
                </li>
            </ul>
        </article>

        <article>
            <h3>Verify out of band</h3>

            <p>
                Make it a personal rule: anything unexpected about money, a
                password reset, an access grant, or a transfer of sensitive
                data gets confirmed on a second channel.
            </p>

            <p>
                <strong>Example:</strong> a client emails new bank details
                for your invoices. Call them &mdash; on the number from the
                earlier paper contract, never the one on the new invoice.
            </p>
        </article>

        <article>
            <h3>If it already happened, speed wins</h3>

            <p>
                Clicked a suspicious link, typed credentials into a
                questionable site, downloaded an untrusted file? Time is
                critical.
            </p>

            <ol>
                <li>
                    Disconnect the device from Wi-Fi or Ethernet at once, to
                    stop malware moving sideways or commands running
                    remotely.
                </li>

                <li>
                    Report it to your IT security team or client contact.
                    Early reporting lets them revoke compromised tokens
                    before the attacker pivots deeper in.
                </li>
            </ol>
        </article>

    </section>

    <section id="essential-safe-practices-red-flags">
        <h2>Red flags</h2>

        <ul>
            <li>
                <strong>SMS-only MFA.</strong> Text passcodes instead of an
                authenticator app or a hardware key.
            </li>

            <li>
                <strong>A default router password.</strong> Home Wi-Fi still
                on the factory admin login.
            </li>

            <li>
                <strong>One network for work and the smart home.</strong>
                The work laptop on the same Wi-Fi subnet as unpatched IoT
                devices.
            </li>

            <li>
                <strong>Updates put off for weeks.</strong> Pending
                operating system and browser security patches.
            </li>
        </ul>
    </section>

    <section id="essential-safe-practices-curated-resources">
        <h2>References</h2>

        <ul>
            <li>
                <strong>Video Source:</strong>
                <a href="https://www.youtube.com/watch?v=2eEwUe_uI6k" target="_blank" rel="noopener noreferrer">
                    Cybersecurity and Infrastructure Security Agency (CISA) — "Cybersecurity for Remote Work: Best Practices to Stay Safe Online"
                </a>
            </li>

            <li>
                <strong>Reference Guide:</strong>
                <a href="https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-46r2.pdf" target="_blank" rel="noopener noreferrer">
                    NIST (National Institute of Standards and Technology) — Guide to Enterprise Telework, Remote Access, and Bring Your Own Device (BYOD) Security (NIST SP 800-46 Rev. 2)
                </a>
            </li>
        </ul>
    </section>

        <!-- =========================
         AI Chatbot
         ========================= -->




  </main>
</template>

<script src="./EssentialSafePracticesRemoteEnv.js"></script>
