
<template>
  <main class="guided-module-page">
    <header class="guided-module-header">
      <div class="guided-module-container">
        <nav aria-label="Breadcrumb">
          <button
            type="button"
            class="guided-home-link"
            @click="requestLeaveModule"
          >
            <span aria-hidden="true">⌂</span>
            <span>Home</span>
          </button>
        </nav>

        <h1>Phishing</h1>

        <div class="guided-module-metadata">
          <span>Module 1 of 6</span>
          <span class="guided-module-badge">FREE MODULE</span>
          <span>8–11 min total (includes video)</span>
        </div>
      </div>
    </header>


<!-- Sticky Module Progress Indicator -->
<div
  class="guided-module-progress"
  role="group"
  aria-label="Phishing module progress"
>
  <div class="guided-progress-container">
    <div class="guided-progress-heading">
      <span class="guided-progress-title">
        <span aria-hidden="true">📖</span>
        Phishing Module Progress
      </span>

      <span class="guided-progress-step" aria-live="polite">
        Step {{ currentStep }} of {{ lessonSteps.length }}
      </span>
    </div>

    <div
      class="guided-progress-track"
      role="progressbar"
      :aria-valuenow="currentStep"
      :aria-valuemin="1"
      :aria-valuemax="lessonSteps.length"
      :aria-valuetext="`Step ${currentStep} of ${lessonSteps.length}`"
      aria-label="Lesson progress"
    >
      <div
        class="guided-progress-fill"
        :style="{
          width: `${(currentStep / lessonSteps.length) * 100}%`
        }"
      ></div>
    </div>
  </div>
</div>


    <div
      class="guided-module-layout"
      :class="{ 'guided-sidebar-hidden': !sidebarVisible }"
    >
      <aside
        v-if="sidebarVisible"
        class="guided-module-sidebar"
        aria-label="Lesson navigation"
      >
        <div class="guided-sidebar-heading">
          <strong>IN THIS MODULE</strong>
          <span class="guided-module-badge">FREE</span>
        </div>

        <p class="guided-sidebar-description">
          8–11 min total · includes video · 7 short steps
        </p>

        <nav aria-label="Module steps">
          <button
            v-for="(step, index) in lessonSteps"
            :key="step.id"
            type="button"
            class="guided-step-link"
            :class="{ 'guided-step-active': currentStep === index + 1 }"
            :aria-current="currentStep === index + 1 ? 'step' : undefined"
            @click="goToStep(index + 1)"
          >
            <span>{{ String(index + 1).padStart(2, '0') }} · {{ step.name }}</span>
            <span v-if="completedSteps.includes(index + 1)" class="guided-completed-mark" aria-label="Visited">✓</span>
          </button>
        </nav>

        <div class="guided-sidebar-progress">
          <p>Step {{ currentStep }} of {{ lessonSteps.length }}</p>
          <div class="guided-sidebar-progress-track">
            <div
              class="guided-sidebar-progress-fill"
              :style="{ width: `${(currentStep / lessonSteps.length) * 100}%` }"
            ></div>
          </div>
        </div>

        <button
          type="button"
          class="guided-hide-menu-button"
          @click="sidebarVisible = false"
        >
          ‹ Hide menu
        </button>
      </aside>

      <div class="guided-module-content">
        <section
          :key="currentStep"
          ref="activeStepSection"
          class="guided-lesson-step"
          aria-labelledby="guided-current-step-heading"
        >
          <p class="guided-step-eyebrow" aria-live="polite">
            STEP {{ currentStep }} OF {{ lessonSteps.length }} ·
            {{ lessonSteps[currentStep - 1].name.toUpperCase() }}
          </p>

          <!-- STEP 1: START HERE -->
          <template v-if="currentStep === 1">
            <div class="guided-introduction-card">
              <p class="guided-audience">
                <strong>Who this is for:</strong> all remote workers, freelancers,
                virtual assistants, and distributed contractors.
              </p>

              <h2 id="guided-current-step-heading">
                By the end of this module you can:
              </h2>

              <ul class="guided-learning-outcomes">
                <li>
                  Spot the giveaways in a <button type="button" class="guided-definition-term" @click="openDefinition('phishing')">phishing</button> email: a lookalike domain,
                  a faked sender, a deadline.
                </li>
                <li>
                  Explain how a link hidden in a QR code — <button type="button" class="guided-definition-term" @click="openDefinition('quishing')">quishing</button>
                  — slips past a Security Email Gateway (<button type="button" class="guided-definition-term" @click="openDefinition('SEG')">SEG</button>).
                </li>
                <li>
                  Run the same three checks before clicking a link, scanning
                  a QR code, or typing a password into a portal.
                </li>
              </ul>

            <div class="guided-helpful-tip">
                <span class="guided-helpful-tip-icon" aria-hidden="true">💡</span>

                <div class="guided-helpful-tip-content">
                  <strong>Helpful tip</strong>
                  <p>
                    Select any highlighted, dotted-underlined word to see a
                    simple explanation. Try selecting "phishing" in the
                    learning outcomes above!
                  </p>
                </div>
             </div>

              <div class="guided-introduction-footer">
                <h3>You'll cover:</h3>
                <div class="guided-topic-tags">
                  <span>Fake emails</span>
                  <span>Fake login pages</span>
                  <span>Quishing (QR code phishing)</span>
                </div>

                <button
                  type="button"
                  class="guided-primary-button"
                  @click="goToStep(2)"
                >
                  Start the lesson →
                </button>
              </div>
            </div>
          </template>

          <!-- STEP 2: PHISHING BASICS -->
          <template v-else-if="currentStep === 2">
            <h2 id="guided-current-step-heading">
              Phishing when you work remotely
            </h2>

            <div class="guided-comparison-grid">
              <div class="guided-information-card">
                <h3>In an office</h3>
                <p>
                  In an office your computer sits behind a company firewall, an
                  intrusion prevention system (<button type="button" class="guided-definition-term" @click="openDefinition('IPS')">IPS</button>), and a monitored Security
                  Email Gateway (<button type="button" class="guided-definition-term" @click="openDefinition('SEG')">SEG</button>).
                </p>
              </div>

              <div class="guided-information-card">
                <h3>Working remotely</h3>
                <p>
                  Working remotely, you connect straight to
                  Google Workspace, Microsoft 365 or Slack over home Wi-Fi, often
                  on your own device (<button type="button" class="guided-definition-term" @click="openDefinition('BYOD')">BYOD</button>).
                </p>
              </div>
            </div>

            <p>
              None of that is in the way, so
              attacks arrive dressed as the tools you open daily.
            </p>

            <!-- Video lesson: introduces Domain tricks -->
            <section class="guided-video-lesson" aria-labelledby="phishing-video-heading">
              <div class="guided-video-heading-row">
                <h3 id="phishing-video-heading">What is Phishing? — Video</h3>
                <span class="guided-video-duration" aria-label="Video duration: 2 minutes and 10 seconds">◷ Watch time: 2 min 10 sec</span>
              </div>
              <p class="guided-video-prompt">
                Watch this video for a visual introduction to phishing. As you watch,
                think about how an attacker might imitate a trusted message or website.
              </p>
              <div class="guided-video-frame">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/WG8V1_Sj5g0"
                  title="What is Phishing? — Educational video"
                  loading="lazy"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
              </div>
              <div class="guided-video-summary">
                <strong>Quick Summary</strong>
                <p>
                  Phishing uses deceptive messages or websites to trick people into revealing sensitive information or
                  taking unsafe actions. Attackers often create a sense of urgency to pressure people into responding
                  without thinking. Always check the sender, verify website addresses, and use trusted channels before
                  responding to unexpected requests.
                </p>
              </div>
              <p class="guided-video-attribution">
                Video: <a href="https://www.youtube.com/watch?v=WG8V1_Sj5g0" target="_blank" rel="noopener noreferrer">What is Phishing? on YouTube</a>
              </p>
            </section>


            <h3 class="guided-domain-tricks-heading">Domain tricks</h3>

            <div class="guided-comparison-grid">
              <div class="guided-information-card guided-warning-card">
                <p>
                  The fake sites lean on domain tricks. <button type="button" class="guided-definition-term" @click="openDefinition('Typosquatting')">Typosquatting</button> swaps one
                  character: <code>micros0ft-verify.com</code> for
                  <code>microsoft.com</code>.
                </p>
              </div>

              <div class="guided-information-card guided-warning-card">
                <p>
                  <button type="button" class="guided-definition-term" @click="openDefinition('Combosquatting')">Combosquatting</button> adds
                  trusted-sounding words, as in
                  <code>slack-login-security.net</code>.
                </p>
              </div>
            </div>

            <div class="guided-information-card guided-warning-card">
              <p>
                When you open a website, you may see <strong>https://</strong> and a padlock symbol in the address bar. This means your connection to that site is encrypted, not that the site belongs to a trustworthy company. Websites use <button type="button" class="guided-definition-term" @click="openDefinition('SSL/TLS')">SSL/TLS</button> certificates to enable that encryption.
              </p>
              <p>
                And because an SSL/TLS certificate is free, the counterfeit server shows the same HTTPS padlock as the real one — which is what convinces people the login page is safe.
              </p>
              <div class="guided-address-comparison" aria-label="Example of a genuine and an impersonating website address">
                <div class="guided-address-example"><span class="guided-address-label">✓ Example of an official address</span><code>🔒 https://www.microsoft.com</code><small>Compare the domain with the company's known official website.</small></div>
                <div class="guided-address-example guided-address-fake"><span class="guided-address-label">⚠ Example of a fake address</span><code>🔒 https://micros0ft-verify.com</code><small>It also shows HTTPS, but the brand name contains a zero instead of the letter “o”.</small></div>
              </div>
              <p class="guided-address-note">The padlock protects the connection; it does not verify who owns the website.
              </p>
            </div>

            <div class="guided-takeaway">
              <strong>Key takeaway</strong>
              <p>
                Lookalike website addresses can be difficult to notice.
                An HTTPS padlock alone does not prove a website is legitimate.
              </p>
            </div>

          </template>

          <!-- STEP 3: QR CODE SCAMS -->
          <template v-else-if="currentStep === 3">
            <h2 id="guided-current-step-heading">
              Quishing: the link inside a QR code
            </h2>

            <p class="guided-plain-language-intro"><strong>Imagine this:</strong> You receive an email that looks like it came from your company's HR or IT team. Instead of giving you a link, it tells you to scan a QR code using your phone to keep your account active. The code looks harmless, but you cannot tell where it leads just by looking at it.</p>
            <div class="guided-qr-story" aria-label="How a QR code phishing attempt can work"><div><span>1</span><strong>Unexpected email</strong><small>“Scan to verify your account”</small></div><span aria-hidden="true">→</span><div><span>2</span><strong>Personal phone</strong><small>The QR code opens a hidden web link</small></div><span aria-hidden="true">→</span><div><span>3</span><strong>Fake sign-in</strong><small>A scammer tries to collect your password</small></div></div>
            <figure class="guided-module-figure">
              <img
                src="/images/Phishing-and-Quishing-Comparison.png"
                alt="Flowchart comparing traditional email phishing to quishing. Traditional: deceptive email link, clicked by user through the email gateway. Quishing: embedded QR code in a message or document, scanned by the user's phone camera, opened outside the company's firewall protection."
              />
              <figcaption>
                Traditional phishing sends a clickable link the gateway can scan.
                Quishing hides it in a QR code image the gateway cannot read,
                opened on an unmonitored personal phone.
              </figcaption>
            </figure>

            <p>
              Email filters read text — the written HTML and any
              plain-text URL. They rarely run <button type="button" class="guided-definition-term" @click="openDefinition('OCR')">OCR</button> (optical character
              recognition) on an image, or decode a picture inside a PDF
              attachment. A Quick Response (<button type="button" class="guided-definition-term" @click="openDefinition('QR code')">QR</button>) code is an image, so the link
              inside it is invisible to them. That is why quishing keeps
              growing against distributed staff.
            </p>

            <p>
              The email claims to be an “<button type="button" class="guided-definition-term" @click="openDefinition('MFA')">MFA</button> Security Update” or
              an “HR Employee Handbook Review,” so the gateway
              lets it through. You scan it with your phone camera. The
              session moves off your monitored work computer onto an
              unmonitored personal device, landing on a <button type="button" class="guided-definition-term" @click="openDefinition('credential harvesting')">credential-harvesting</button>
              web form, or an <button type="button" class="guided-definition-term" @click="openDefinition('OAuth')">OAuth</button> page asking you to grant consent.
            </p>

            <p class="guided-plain-language-intro"><strong>In simple terms:</strong> Quishing is phishing with a QR code. A company email filter might inspect ordinary links, but it may not recognize a website address hidden inside a QR image. Scanning with your personal phone can also move you away from the protections used on your work computer. The safest option is to open your company's official website yourself or confirm the request with your IT team.</p>
            <div class="guided-takeaway">
              <strong>Key takeaway</strong>
              <p>
                QR codes can conceal links to fake login pages.
                Verify requests through an official channel before scanning.
              </p>
            </div>
          </template>

          <!-- STEP 4: RED FLAGS -->
          <template v-else-if="currentStep === 4">
            <h2 id="guided-current-step-heading">Red flags</h2>

            <div class="guided-comparison-grid">
              <div class="guided-information-card guided-danger-card">
                <h3>Sender mismatch</h3>
                <p>
                  A display name reading “IT Helpdesk” over a
                  header address of
                  <code>support@mail-system-update24.net</code>.
                </p>
              </div>

              <div class="guided-information-card guided-danger-card">
                <h3>Fear-based subject lines</h3>
                <p>
                  Subject lines built on fear: “Urgent: Account
                  Suspension in 2 Hours.” “Unusual Login Detected
                  - Verify Immediately.”
                </p>
              </div>

              <div class="guided-information-card guided-danger-card">
                <h3>Unsolicited QR code</h3>
                <p>
                  An unsolicited QR code, to be scanned on your phone to
                  reach a desktop web service.
                </p>
              </div>

              <div class="guided-information-card guided-danger-card">
                <h3>Generic greeting or mismatched link</h3>
                <p>
                  A greeting of “Dear Customer,” or link text
                  reading <code>portal.company.com</code> that points at an
                  unrelated IP address.
                </p>
              </div>
            </div>

            <div class="guided-takeaway">
              <strong>Key takeaway</strong>
              <p>
                Watch for suspicious senders, urgent deadlines, unexpected QR
                codes, and links that do not match their stated destination.
              </p>
            </div>
          </template>

          <!-- STEP 5: EXAMPLES AND PRACTICE -->
          <template v-else-if="currentStep === 5">
            <h2 id="guided-current-step-heading">
              Realistic scam examples
            </h2>

            <p>
              Explore examples of suspicious messages and practice identifying
              warning signs.
            </p>

            <div class="guided-example-tabs" role="tablist" aria-label="Example types">
              <button
                v-for="example in exampleTabs"
                :key="example.id"
                :id="`guided-tab-${example.id}`"
                type="button"
                role="tab"
                :aria-selected="activeExampleTab === example.id"
                :aria-controls="`guided-panel-${example.id}`"
                :tabindex="activeExampleTab === example.id ? 0 : -1"
                :class="{ 'guided-tab-selected': activeExampleTab === example.id }"
                @click="selectExample(example.id)"
                @keydown="handleTabKeydown($event, example.id)"
              >
                {{ example.label }}
              </button>
            </div>

            <div
              :id="`guided-panel-${activeExampleTab}`"
              role="tabpanel"
              :aria-labelledby="`guided-tab-${activeExampleTab}`"
              class="guided-example-panel"
              tabindex="0"
            >
              <template v-if="activeExampleTab === 'email'">
                <div class="guided-example-heading"><h3>Example 1: Email phishing</h3><button type="button" class="guided-example-next" @click="nextExample">Next example <span aria-hidden="true">→</span></button></div>
                <p class="guided-example-instruction">Explore the email: hover over a highlighted part, then click or press Enter to learn why it is suspicious.</p>
                <div class="guided-fake-message guided-interactive-mockup">
                  <div class="guided-fake-message-header"><span>Inbox / Security alert</span><span class="guided-mock-badge">Training example</span></div>
                  <div class="guided-fake-message-body">
                    <div class="guided-email-field"><strong>From</strong><button type="button" class="guided-inspection-target" :aria-pressed="selectedExampleClue === 'sender'" @click="selectedExampleClue = 'sender'">IT Helpdesk &lt;support@mail-system-update24.net&gt; <span aria-hidden="true">⊕</span></button></div>
                    <div class="guided-email-field"><strong>Subject</strong><button type="button" class="guided-inspection-target" :aria-pressed="selectedExampleClue === 'subject'" @click="selectedExampleClue = 'subject'">Urgent: Account Suspension in 2 Hours <span aria-hidden="true">⊕</span></button></div>
                    <div class="guided-email-body"><button type="button" class="guided-inspection-target" :aria-pressed="selectedExampleClue === 'greeting'" @click="selectedExampleClue = 'greeting'">Dear Customer, <span aria-hidden="true">⊕</span></button><p>Your account will be suspended. Click the link below to verify:</p><button type="button" class="guided-inspection-target guided-inspection-url" :aria-pressed="selectedExampleClue === 'link'" @click="selectedExampleClue = 'link'">portal.company.com <span aria-hidden="true">⊕</span></button></div>
                  </div>
                </div>
                <div class="guided-clue-explanation" role="status" aria-live="polite">
                  <template v-if="selectedExampleClue"><span class="guided-clue-label">RED FLAG {{ emailClues[selectedExampleClue].number }}</span><h4>{{ emailClues[selectedExampleClue].title }}</h4><p>{{ emailClues[selectedExampleClue].explanation }}</p></template>
                  <template v-else><span class="guided-clue-label">INTERACTIVE EXAMPLE</span><p>Select the sender, subject, greeting, or link to reveal its warning signs here.</p></template>
                </div>
                <p class="guided-example-explanation"><strong>Why it's suspicious:</strong> The sender address does not match the claimed identity, the message creates urgency, and the greeting is generic. The displayed link may also conceal an unrelated destination. These clues together are a reason to stop and verify through your official IT channel instead of clicking.</p>
              </template>

              <template v-else-if="activeExampleTab === 'login'">
                <div class="guided-example-heading"><h3>Example 2: Fake login page</h3><button type="button" class="guided-example-next" @click="nextExample">Next example →</button></div>
                <p class="guided-example-instruction">These are training-only mock websites. Click the highlighted address bar or sign-in area to learn what is suspicious. Do not enter real passwords.</p>
                <div class="guided-login-grid">
                  <div class="guided-fake-login" v-for="site in fakeLoginSites" :key="site.id">
                    <button type="button" class="guided-fake-address" :aria-pressed="selectedLoginClue === site.id" @click="selectedLoginClue = site.id"><span aria-hidden="true">🔒</span><code>https://{{ site.address }}</code><span aria-hidden="true">⊕</span></button>
                    <div class="guided-fake-login-body"><h4>Sign in to {{ site.brand }}</h4><div class="guided-fake-input">Email</div><div class="guided-fake-input">Password</div><button type="button" class="guided-fake-signin" @click="selectedLoginClue = site.id">{{ site.buttonLabel }} · Inspect</button></div>
                  </div>
                </div>
                <div class="guided-clue-explanation" role="status" aria-live="polite"><template v-if="selectedLoginClue"><span class="guided-clue-label">SPOT THE FAKE</span><h4>{{ fakeLoginSites.find(site => site.id === selectedLoginClue)?.title }}</h4><p>{{ fakeLoginSites.find(site => site.id === selectedLoginClue)?.explanation }}</p></template><p v-else>Click either address bar to discover how a fake site can still display HTTPS and a padlock.</p></div>
                <p class="guided-example-explanation"><strong>Why it's fake:</strong> Both examples show <code>https://</code> and a padlock, but that only means the connection is encrypted. <strong>Typosquatting</strong> changes a character in a trusted name, such as using a zero in <code>micros0ft</code>. <strong>Combosquatting</strong> adds convincing words to a brand, such as <code>slack-login-security</code>. Neither address is the official company's domain.</p>
              </template>

              <template v-else-if="activeExampleTab === 'qr'">
                <div class="guided-example-heading"><h3>Example 3: QR code scam (quishing)</h3><button type="button" class="guided-example-next" @click="nextExample">Next example →</button></div>
                <p class="guided-example-instruction">Explore this mock email. Click the sender, subject, instruction, or QR-code illustration to reveal the warning sign. The illustrated code is intentionally not scannable.</p>
                <div class="guided-fake-message guided-interactive-mockup">
                  <div class="guided-fake-message-header"><span>Inbox / HR notice</span><span class="guided-mock-badge">Training example</span></div>
                  <div class="guided-fake-message-body">
                    <div class="guided-email-field"><strong>From</strong><button type="button" class="guided-inspection-target" :aria-pressed="selectedQrClue === 'sender'" @click="selectedQrClue = 'sender'">HR Team &lt;hr-notice@handbook-review24.net&gt; ⊕</button></div>
                    <div class="guided-email-field"><strong>Subject</strong><button type="button" class="guided-inspection-target" :aria-pressed="selectedQrClue === 'subject'" @click="selectedQrClue = 'subject'">MFA Security Update — Action Required ⊕</button></div>
                    <div class="guided-email-body"><button type="button" class="guided-inspection-target" :aria-pressed="selectedQrClue === 'instruction'" @click="selectedQrClue = 'instruction'">To keep your access, scan this code with your phone to sign in. ⊕</button><div><button type="button" class="guided-qr-inspect" :aria-pressed="selectedQrClue === 'code'" aria-label="Inspect the illustrated QR code" @click="selectedQrClue = 'code'"><span class="guided-qr-art" aria-hidden="true">▦</span><span>Inspect QR code ⊕</span></button></div></div>
                  </div>
                </div>
                <div class="guided-clue-explanation" role="status" aria-live="polite"><template v-if="selectedQrClue"><span class="guided-clue-label">QR SCAM RED FLAG</span><h4>{{ qrClues[selectedQrClue].title }}</h4><p>{{ qrClues[selectedQrClue].explanation }}</p></template><p v-else>Select a highlighted part of the mock email to see why it is suspicious.</p></div>
                <p class="guided-example-explanation"><strong>Why it's suspicious:</strong> The message pretends to be from HR, pressures you to act, and asks you to scan an unexpected code using your personal phone. The QR code can hide a link to a fake login page or consent screen. Verify the request through your organization's known official channel instead.</p>
              </template>

              <template v-else>
                <div class="guided-example-heading"><h3>Example 4: Try it — safe or risky?</h3><button type="button" class="guided-example-next" @click="nextExample">Back to first example ↺</button></div>

                <div
                  v-for="(scenario, index) in practiceScenarios"
                  :key="index"
                  class="guided-practice-card"
                >
                  <p>{{ scenario.question }}</p>

                  <div class="guided-practice-actions">
                    <button type="button" :class="{ 'guided-answer-selected': practiceAnswers[index] === 'safe' }" :aria-pressed="practiceAnswers[index] === 'safe'" @click="answerScenario(index, 'safe')">
                      Safe
                    </button>
                    <button type="button" :class="{ 'guided-answer-selected': practiceAnswers[index] === 'risky' }" :aria-pressed="practiceAnswers[index] === 'risky'" @click="answerScenario(index, 'risky')">
                      Risky
                    </button>
                  </div>

                  <p
                    v-if="practiceAnswers[index]"
                    class="guided-practice-feedback"
                    :class="practiceAnswers[index] === scenario.answer ? 'guided-feedback-correct' : 'guided-feedback-incorrect'"
                    role="status"
                  >
                    {{ practiceAnswers[index] === scenario.answer
                      ? '✓ Correct! Well done. '
                      : '✕ Not quite. Try again. ' }}
                    {{ scenario.explanation }}
                  </p>
                </div>
              </template>
            </div>

            <div class="guided-takeaway">
              <strong>Key takeaway</strong>
              <p>
                Scams often imitate familiar tools and create pressure to act.
                Examine the actual sender and destination before responding.
              </p>
            </div>
          </template>

          <!-- STEP 6: SAFETY CHECKS -->
          <template v-else-if="currentStep === 6">
            <h2 id="guided-current-step-heading">The three checks</h2>

            <p>Tap each check as you go.</p>

            <div class="guided-checklist">
              <button
                v-for="(check, index) in safetyChecks"
                :key="index"
                type="button"
                class="guided-checklist-item"
                :class="{ 'guided-checklist-complete': completedSafetyChecks.includes(index) }"
                role="checkbox"
                :aria-checked="completedSafetyChecks.includes(index)"
                @click="toggleSafetyCheck(index)"
              >
                <span class="guided-check-number">
                  {{ completedSafetyChecks.includes(index) ? '✓' : index + 1 }}
                </span>
                <span>
                  <strong>{{ check.title }}</strong>
                  <span class="guided-check-description">{{ check.description }}</span>
                </span>
              </button>
            </div>

            <p class="guided-check-counter" aria-live="polite">
              {{ completedSafetyChecks.length }} of 3 checks done
            </p>

            <h3>Do's and Don'ts</h3>

            <div class="guided-safety-comparison">
              <div
                v-for="(situation, index) in safetySituations"
                :key="index"
                class="guided-safety-situation"
              >
                <h4 class="guided-situation-heading"><span class="guided-situation-number">{{ index + 1 }}</span> {{ situation.context }}</h4>
                <div class="guided-comparison-grid">
                  <div class="guided-information-card guided-danger-card">
                    <strong class="guided-choice-label">✕ Don't do this</strong>
                    <p>{{ situation.unsafe }}</p>
                  </div>
                  <div class="guided-information-card guided-safe-card">
                    <strong class="guided-choice-label">✓ Do this instead</strong>
                    <p>{{ situation.safe }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="guided-takeaway">
              <strong>Key takeaway</strong>
              <p>
                Verify addresses, avoid unexpected QR codes, and report
                suspicious activity promptly.
              </p>
            </div>
          </template>

          <!-- STEP 7: QUIZ -->
          <template v-else>
            <div class="guided-quiz-card">
              <h2 id="guided-current-step-heading">
                Test Your Knowledge
              </h2>

              <p>
                Ready to check what you've learned? Take a randomized
                10-question quiz drawn from a pool of 20, so a retake is never the
                same test twice.
              </p>

              <div class="guided-quiz-actions">
                <router-link
                  to="/quiz/module-1/question"
                  class="guided-primary-button"
                >
                  Take a Quiz
                </router-link>

                <button
                  type="button"
                  class="guided-secondary-button"
                  @click="requestLeaveModule"
                >
                  Back to Homepage
                </button>
              </div>
            </div>
          </template>
        </section>

        <nav class="guided-step-navigation" aria-label="Previous and next lesson steps">
          <button
            v-if="currentStep > 1"
            type="button"
            class="guided-secondary-button"
            @click="goToStep(currentStep - 1)"
          >
            ← {{ lessonSteps[currentStep - 2].name }}
          </button>

          <span v-else></span>

          <button
            v-if="currentStep < lessonSteps.length"
            type="button"
            class="guided-primary-button"
            @click="goToStep(currentStep + 1)"
          >
            Next: {{ lessonSteps[currentStep].name }} →
          </button>
        </nav>
      </div>
    </div>

    <button
      v-if="!sidebarVisible"
      type="button"
      class="guided-floating-menu-button"
      @click="sidebarVisible = true"
      aria-label="Show module menu"
    >
      ☰ Menu
    </button>

    <footer class="guided-module-references">
      <div class="guided-references-inner">
        <h2>References used in this module</h2>
        <ul>
          <li>
            <strong>Official Technical Guide:</strong>
            <a href="https://www.cisa.gov/resources-tools/resources/phishing-guidance-stopping-attack-cycle-phase-one" target="_blank" rel="noopener noreferrer">
              CISA, NSA, FBI, &amp; MS-ISAC — Phishing Guidance: Stopping the Attack Cycle at Phase One
            </a>
          </li>
          <li>
            <strong>Video Source:</strong>
            <a
              href="https://www.youtube.com/watch?v=WG8V1_Sj5g0"
              target="_blank"
              rel="noopener noreferrer"
            >
              Topic Simple — "What is Phishing?" on YouTube
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
            Nawaf, L., &amp; Khan, I. (2021). Phishing attacks: A recent
            comprehensive study and a new anatomy.
            <em>Frontiers in Computer Science</em>, 3, Article 563060.
          </li>
        </ul>
      </div>
    </footer>

    <div v-if="activeDefinition" class="guided-dialog-backdrop" @click.self="closeDefinition">
      <div ref="definitionDialog" class="guided-dialog guided-definition-dialog" role="dialog" aria-modal="true" aria-labelledby="guided-definition-title" aria-describedby="guided-definition-description" @keydown.esc="closeDefinition">
        <div class="guided-modal-icon guided-modal-icon-info" aria-hidden="true">?</div>
        <p class="guided-modal-eyebrow">QUICK DEFINITION</p>
        <h2 id="guided-definition-title">{{ activeDefinition }}</h2>
        <p id="guided-definition-description">{{ glossaryDefinitions[activeDefinition] }}</p>
        <div class="guided-modal-divider"></div><button type="button" class="guided-primary-button guided-modal-main-action" @click="closeDefinition">Got it <span aria-hidden="true">✓</span></button>
      </div>
    </div>

    <div
      v-if="showLeaveConfirmation"
      class="guided-dialog-backdrop"
      @click.self="showLeaveConfirmation = false"
    >
      <div
        ref="leaveDialog"
        class="guided-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guided-leave-title"
        aria-describedby="guided-leave-description"
        @keydown.esc="showLeaveConfirmation = false"
      >
        <div class="guided-modal-icon guided-modal-icon-exit" aria-hidden="true">↗</div><p class="guided-modal-eyebrow">LEARNING PROGRESS</p><h2 id="guided-leave-title">Leave this module?</h2>
        <p id="guided-leave-description">
          You're on step {{ currentStep }} of {{ lessonSteps.length }}. Your progress is saved, so you can pick up where you left off when you return.
        </p>
        <div class="guided-dialog-actions">
          <button
            type="button"
            class="guided-secondary-button"
            @click="showLeaveConfirmation = false"
          >
            Stay here
          </button>
          <button
            type="button"
            class="guided-primary-button"
            @click="leaveModule"
          >
            Leave module
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showResumeConfirmation"
      class="guided-dialog-backdrop"
    >
      <div
        ref="resumeDialog"
        class="guided-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guided-resume-title"
        aria-describedby="guided-resume-description"
      >
        <div class="guided-modal-icon guided-modal-icon-info" aria-hidden="true">↻</div><p class="guided-modal-eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2 id="guided-resume-title">Welcome back!</h2>
        <p id="guided-resume-description">
          You previously reached Step {{ savedStep }} of {{ lessonSteps.length }}.
          What would you like to do?
        </p>
        <div class="guided-resume-actions">
          <button
            type="button"
            class="guided-primary-button"
            @click="resumeLesson"
          >
            Continue Progress
          </button>
          <button
            type="button"
            class="guided-secondary-button"
            @click="restartLesson"
          >
            Start Over
          </button>
          <router-link
            to="/quiz/module-1/question"
            class="guided-secondary-button"
          >
            Take/Retake Quiz
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

const router = useRouter()

const glossaryDefinitions = {"phishing": "A scam where someone pretends to be a trusted person or organization to steal information or get you to take an unsafe action.", "quishing": "Phishing that uses a QR code to hide a link to a potentially harmful website.", "QR code": "A square, scannable image that can open a website or share information.", "SEG": "Security Email Gateway: a system that filters suspicious email before it reaches an inbox.", "IPS": "Intrusion Prevention System: software or hardware that detects and blocks suspicious network activity.", "BYOD": "Bring Your Own Device: using a personal phone or computer for work.", "Typosquatting": "A fake web address that resembles a real one, often by changing one character.", "Combosquatting": "A fake web address that adds trusted-sounding words to a recognizable brand name.", "SSL/TLS": "Technology that encrypts data between your browser and a website; it does not prove the website is trustworthy.", "OCR": "Optical Character Recognition: technology that reads text inside images.", "MFA": "Multi-Factor Authentication: a login check that requires more than one type of proof, such as a password and a code.", "credential harvesting": "Tricking people into entering usernames, passwords, or other login details into a fake form.", "OAuth": "A way to grant an app access to an account without sharing the account password directly."}
const activeDefinition = ref(null)
const definitionDialog = ref(null)
let definitionTrigger = null

function openDefinition(term) {
  definitionTrigger = document.activeElement
  activeDefinition.value = term
  nextTick(() => definitionDialog.value?.querySelector('button')?.focus())
}
function closeDefinition() {
  activeDefinition.value = null
  nextTick(() => definitionTrigger?.focus())
}


const lessonSteps = [
  { id: 'start-here', name: 'Start here' },
  { id: 'phishing-basics', name: 'Phishing basics' },
  { id: 'qr-code-scams', name: 'QR code scams' },
  { id: 'red-flags', name: 'Red flags' },
  { id: 'examples-and-practice', name: 'Examples & practice' },
  { id: 'safety-checks', name: 'Safety checks' },
  { id: 'quiz', name: 'Quiz' }
]

const storageKey = 'se-aware-quishing-lesson-progress'

const currentStep = ref(1)
const savedStep = ref(1)
const completedSteps = ref([])
const sidebarVisible = ref(true)
const showLeaveConfirmation = ref(false)
const showResumeConfirmation = ref(false)
const activeStepSection = ref(null)
const leaveDialog = ref(null)
const resumeDialog = ref(null)

const activeExampleTab = ref('email')
const selectedExampleClue = ref(null)
const selectedLoginClue = ref(null)
const selectedQrClue = ref(null)
const fakeLoginSites = [
  { id: 'microsoft', brand: 'Microsoft 365', address: 'micros0ft-verify.com/login', buttonLabel: 'Sign in', title: 'Typosquatting: a zero replaces the letter O', explanation: 'Look closely at micros0ft. The character before “ft” is the number 0, not the letter o. The extra “-verify” also tries to sound official. Even with HTTPS and a padlock, this is not microsoft.com.' },
  { id: 'slack', brand: 'Slack', address: 'slack-login-security.net', buttonLabel: 'Continue', title: 'Combosquatting: extra trustworthy-sounding words', explanation: 'This address includes “slack”, “login”, and “security”, but those words do not make it an official Slack website. A familiar brand name inside a longer domain is not enough to establish trust.' }
]
const qrClues = {
  sender: { title: 'Unverified HR sender', explanation: 'The name HR Team can be copied by anyone. The actual domain handbook-review24.net is not established as an official company address.' },
  subject: { title: 'Urgent security pretext', explanation: 'The subject uses an MFA security update to make the request sound important. Confirm such requests through your normal company sign-in process.' },
  instruction: { title: 'Unexpected phone-based sign-in', explanation: 'The email wants you to switch from your work computer to your personal phone to sign in. That is a warning sign, especially for an unexpected QR code.' },
  code: { title: 'Hidden website destination', explanation: 'A QR code can conceal the actual destination until it is scanned. It could open a fake login page or a permission request. This illustration is not a working QR code.' }
}

const emailClues = {
  sender: { number: '01', title: 'Suspicious sender address', explanation: 'The display name says IT Helpdesk, but the actual address is support@mail-system-update24.net. A name can be faked; compare the real domain with your organization’s official IT contact.' },
  subject: { number: '02', title: 'Pressure and urgency', explanation: '“Account Suspension in 2 Hours” is designed to make you panic and click without checking. A short deadline is a warning sign, not proof that the request is legitimate.' },
  greeting: { number: '03', title: 'Generic greeting', explanation: '“Dear Customer” is impersonal for an internal work account notice. By itself this does not prove fraud, but combined with the unusual sender and urgent request it increases suspicion.' },
  link: { number: '04', title: 'Unverified link destination', explanation: 'The visible text says portal.company.com, but an email link can point somewhere completely different. Do not open it to check. Navigate to the official portal independently.' }
}
function selectExample(exampleId) { activeExampleTab.value = exampleId; selectedExampleClue.value = null; selectedLoginClue.value = null; selectedQrClue.value = null }
function nextExample() { const index = exampleTabs.findIndex(example => example.id === activeExampleTab.value); selectExample(exampleTabs[(index + 1) % exampleTabs.length].id) }

const completedSafetyChecks = ref([])
const practiceAnswers = ref({})

const exampleTabs = [
  { id: 'email', label: 'Email' },
  { id: 'login', label: 'Fake login page' },
  { id: 'qr', label: 'QR code' },
  { id: 'practice', label: 'Practice' }
]

const practiceScenarios = [
  {
    question: 'An email from “IT Helpdesk” arrives from support@mail-system-update24.net.',
    answer: 'risky',
    explanation: 'The claimed sender and actual domain do not match.'
  },
  {
    question: 'An unexpected email asks you to scan a QR code to reset your password.',
    answer: 'risky',
    explanation: 'Unexpected QR codes can conceal malicious destinations.'
  },
  {
    question: 'A website displays an HTTPS padlock, so you assume it must be genuine.',
    answer: 'risky',
    explanation: 'HTTPS encryption does not establish that a website is trustworthy.'
  },
  {
    question: 'You open your company’s official portal directly to reset your password.',
    answer: 'safe',
    explanation: 'Using a known official portal avoids following a suspicious link.'
  }
]

const safetyChecks = [
  {
    title: 'Read the real address.',
    description: 'Hover over the sender’s name for the full address, and match the domain to official company records.'
  },
  {
    title: 'Never scan a code you were sent.',
    description: 'To log in or reset a password, type the official portal address into a browser yourself.'
  },
  {
    title: 'Report, then contain.',
    description: 'Hit “Report Phishing” in your mail client. If you entered your details, tell your security team and change that password across connected systems.'
  }
]

const safetySituations = [
  {
    context: 'An email asks you to scan a QR code to log in.',
    unsafe: 'Scan the code you were sent.',
    safe: 'Open a browser and type the official portal address yourself.'
  },
  {
    context: 'You are not sure who really sent the email.',
    unsafe: 'Trust the display name alone.',
    safe: 'Check the full sender address and verify its domain.'
  },
  {
    context: 'The subject says “Urgent: Account Suspension in 2 Hours”.',
    unsafe: 'Click quickly before the deadline.',
    safe: 'Stop and verify the request through an official channel.'
  },
  {
    context: 'A login page shows a padlock.',
    unsafe: 'Assume the website must be genuine.',
    safe: 'Check the actual website address.'
  },
  {
    context: 'You already entered your password into a suspicious page.',
    unsafe: 'Say nothing and hope for the best.',
    safe: 'Report it to your security team and change the affected password.'
  }
]

function readSavedProgress() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || 'null')

    if (stored && Number.isInteger(stored.currentStep)) {
      savedStep.value = Math.max(1, Math.min(lessonSteps.length, stored.currentStep))
      completedSteps.value = Array.isArray(stored.completedSteps)
        ? stored.completedSteps.filter(step => Number.isInteger(step) && step >= 1 && step <= lessonSteps.length)
        : []
      return true
    }
  } catch {
    // Invalid stored progress should not prevent the lesson from opening.
  }

  return false
}

function saveProgress() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({
      currentStep: currentStep.value,
      completedSteps: completedSteps.value
    }))
  } catch {
    // The lesson remains usable if browser storage is unavailable.
  }
}

function updateUrlHash(stepNumber) {
  const hash = `#${lessonSteps[stepNumber - 1].id}`
  history.replaceState(history.state, '', `${location.pathname}${location.search}${hash}`)
}

async function goToStep(stepNumber) {
  if (stepNumber < 1 || stepNumber > lessonSteps.length) return

  if (!completedSteps.value.includes(currentStep.value)) {
    completedSteps.value.push(currentStep.value)
  }

  currentStep.value = stepNumber
  saveProgress()
  updateUrlHash(stepNumber)

  await nextTick()

  if (activeStepSection.value) {
    activeStepSection.value.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start'
    })
  }
}

function handleTabKeydown(event, tabId) {
  const currentIndex = exampleTabs.findIndex(tab => tab.id === tabId)
  let nextIndex = currentIndex

  if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % exampleTabs.length
  else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + exampleTabs.length) % exampleTabs.length
  else if (event.key === 'Home') nextIndex = 0
  else if (event.key === 'End') nextIndex = exampleTabs.length - 1
  else return

  event.preventDefault()
  selectExample(exampleTabs[nextIndex].id)

  nextTick(() => {
    document.getElementById(`guided-tab-${activeExampleTab.value}`)?.focus()
  })
}

function answerScenario(index, answer) {
  practiceAnswers.value = { ...practiceAnswers.value, [index]: answer }
}

function toggleSafetyCheck(index) {
  if (completedSafetyChecks.value.includes(index)) {
    completedSafetyChecks.value = completedSafetyChecks.value.filter(item => item !== index)
  } else {
    completedSafetyChecks.value.push(index)
  }
}

function requestLeaveModule() {
  showLeaveConfirmation.value = true
  nextTick(() => leaveDialog.value?.querySelector('button')?.focus())
}

function confirmLeavingModule(event) {
  event.preventDefault()
  requestLeaveModule()
}

function leaveModule() {
  saveProgress()
  showLeaveConfirmation.value = false
  router.push('/')
}

function resumeLesson() {
  showResumeConfirmation.value = false
  currentStep.value = savedStep.value
  updateUrlHash(currentStep.value)
}

function restartLesson() {
  completedSteps.value = []
  completedSafetyChecks.value = []
  practiceAnswers.value = {}
  currentStep.value = 1
  showResumeConfirmation.value = false
  saveProgress()
  updateUrlHash(1)
}

onMounted(() => {
  sidebarVisible.value = window.innerWidth > 900

  const hasSavedProgress = readSavedProgress()
  const hashStep = lessonSteps.findIndex(step => `#${step.id}` === window.location.hash)

  if (hashStep >= 0) {
    currentStep.value = hashStep + 1
  } else if (hasSavedProgress && savedStep.value > 1) {
    showResumeConfirmation.value = true
    nextTick(() => resumeDialog.value?.querySelector('button')?.focus())
  }

})

onBeforeRouteLeave((to) => {
  if (to.path.startsWith('/quiz/')) return true
  if (to.path === '/' && !showLeaveConfirmation.value) {
    // The breadcrumb and module exit buttons already display confirmation.
    return true
  }
  return true
})
</script>

<style scoped>
.guided-module-page {
  --guided-accent: var(--primary, #2bb3a6);
  --guided-surface: var(--card-bg, #111c30);
  --guided-border: var(--border, #223250);
  color: var(--text-primary, inherit);
  min-height: 100vh;
}

.guided-module-header {
  background: #0e2142;
  color: #fff;
  padding: 32px 20px;
}

.guided-module-container {
  max-width: 1240px;
  margin: auto;
}

.guided-home-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  text-decoration: none;
  margin-bottom: 18px;
  padding: 9px 16px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.12);
  font-weight: 700;
  transition: background 0.15s ease, border-color 0.15s ease;
  cursor: pointer;
  font: inherit;
}

.guided-module-header h1 {
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 700;
  margin: 0 0 12px;
}

.guided-module-metadata {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  color: #b9cce8;
  font-size: 14px;
}

.guided-module-badge {
  border: 1px solid var(--guided-accent);
  color: var(--accent-text);
  border-radius: 30px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 700;
}
/* Nasa madilim na header band ito kahit light mode. */
.guided-module-metadata .guided-module-badge {
  color: #5eead4;
}

.guided-progress-track {
  position: sticky;
  top: 0;
  z-index: 40;
  height: 5px;
  background: var(--border);
}

.guided-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2bb3a6, #f5a524);
  transition: width 0.25s ease;
}

.guided-module-layout {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 48px;
  max-width: 1240px;
  padding: 32px 20px 60px;
  margin: 0 auto;
  align-items: start;
}

.guided-module-layout.guided-sidebar-hidden {
  grid-template-columns: minmax(0, 980px);
  justify-content: center;
}

.guided-module-sidebar {
  position: sticky;
  top: 24px;
  padding: 16px;
  border: 1px solid var(--guided-border);
  border-radius: 12px;
  background: var(--guided-surface);
}

.guided-sidebar-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.guided-sidebar-heading strong {
  font-size: 13px;
}

.guided-sidebar-description {
  font-size: 12px;
  opacity: 0.75;
  margin: 10px 0 14px;
}

.guided-step-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  color: inherit;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.guided-step-link:hover,
.guided-step-active {
  background: rgba(43, 179, 166, 0.17);
}

.guided-step-active {
  font-weight: 700;
}

.guided-completed-mark {
  color: #2bb3a6;
}

.guided-sidebar-progress {
  border-top: 1px solid var(--guided-border);
  margin-top: 16px;
  padding-top: 14px;
  font-size: 12px;
}

.guided-sidebar-progress-track {
  height: 6px;
  border-radius: 8px;
  background: var(--guided-border);
  overflow: hidden;
}

.guided-sidebar-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2bb3a6, #f5a524);
}

.guided-hide-menu-button {
  width: 100%;
  margin-top: 10px;
  padding: 8px;
  border: 1px solid var(--guided-border);
  background: transparent;
  color: inherit;
  border-radius: 6px;
  cursor: pointer;
}

.guided-module-content {
  min-width: 0;
}

.guided-lesson-step {
  animation: guided-fade-in 0.25s ease;
}

.guided-step-eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent-text);
  letter-spacing: 0.05em;
  margin: 0 0 18px;
}

.guided-lesson-step h2 {
  font-size: clamp(22px, 2.2vw, 28px);
  font-weight: 700;
  margin: 0 0 20px;
}

.guided-lesson-step h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 24px 0 12px;
}

.guided-lesson-step p,
.guided-lesson-step li {
  line-height: 1.8;
  margin-bottom: 16px;
}

.guided-lesson-step code {
  overflow-wrap: anywhere;
  font-size: 0.9em;
}

.guided-introduction-card,
.guided-information-card,
.guided-example-panel {
  background: var(--guided-surface);
  border: 1px solid var(--guided-border);
  border-radius: 12px;
  padding: 24px;
}

.guided-audience {
  padding: 16px;
  border-radius: 8px;
  background: rgba(43, 179, 166, 0.1);
  border: 1px solid rgba(43, 179, 166, 0.35);
}

.guided-learning-outcomes {
  padding-left: 24px;
}

.guided-learning-outcomes li {
  margin-bottom: 16px;
}

.guided-introduction-footer {
  border-top: 1px solid var(--guided-border);
  padding-top: 18px;
}

.guided-topic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.guided-topic-tags span {
  border: 1px solid var(--guided-border);
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
}

.guided-comparison-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin: 20px 0;
}

.guided-information-card {
  padding: 18px;
}

.guided-information-card h3 {
  margin-top: 0;
}

.guided-information-card p:last-child {
  margin-bottom: 0;
}

.guided-warning-card {
  border-left: 4px solid #f5a524;
}

.guided-danger-card {
  border-left: 4px solid #ef476f;
}

.guided-safe-card {
  border-left: 4px solid #2bb3a6;
}

.guided-takeaway {
  border-left: 4px solid #2bb3a6;
  border-radius: 10px;
  padding: 18px 20px;
  margin-top: 28px;
  background: rgba(43, 179, 166, 0.1);
}

.guided-takeaway strong {
  color: #2bb3a6;
}

.guided-takeaway p {
  margin: 8px 0 0;
}

.guided-module-figure {
  margin: 20px 0;
}

.guided-module-figure img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.guided-module-figure figcaption {
  font-size: 13px;
  opacity: 0.75;
  margin-top: 10px;
  line-height: 1.6;
}

.guided-step-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid var(--guided-border);
  padding-top: 20px;
  margin-top: 40px;
}

.guided-primary-button,
.guided-secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
}

.guided-primary-button {
  border: 1px solid #2bb3a6;
  background: #2bb3a6;
  color: #071521;
}

.guided-secondary-button {
  border: 1px solid var(--guided-border);
  background: var(--guided-surface);
  /* `inherit` ang dati. Sa loob ng quiz card -- na laging madilim at
     puti ang teksto -- puti ang namamana nito, habang ang sarili nitong
     likod ay --card-bg: puti sa maliwanag na tema. Puti sa puti, kaya
     nawawala ang "Back to Homepage". */
  color: var(--text);
}

.guided-example-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 20px 0;
}

.guided-example-tabs button {
  padding: 10px 16px;
  border-radius: 24px;
  border: 1px solid var(--guided-border);
  background: var(--guided-surface);
  color: inherit;
  cursor: pointer;
}

.guided-example-tabs .guided-tab-selected {
  background: #2bb3a6;
  color: #071521;
  border-color: #2bb3a6;
}

.guided-fake-message {
  background: #fff;
  color: #17233a;
  border-radius: 8px;
  overflow: hidden;
}

.guided-fake-message-header {
  background: #e8edf4;
  padding: 12px 16px;
  font-weight: 700;
}

.guided-fake-message-body {
  padding: 16px;
}

.guided-example-explanation,
.guided-practice-feedback {
  padding: 14px;
  margin-top: 16px;
  border-radius: 8px;
  background: rgba(239, 71, 111, 0.1);
}

.guided-practice-card {
  border-bottom: 1px solid var(--guided-border);
  padding: 16px 0;
}

.guided-practice-actions {
  display: flex;
  gap: 10px;
}

.guided-practice-actions button {
  border: 1px solid var(--guided-border);
  border-radius: 6px;
  padding: 8px 20px;
  background: var(--guided-surface);
  color: inherit;
  cursor: pointer;
}

.guided-checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  padding: 14px 0;
  background: transparent;
  border: none;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.guided-check-number {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 38px;
  height: 38px;
  background: #2bb3a6;
  color: #071521;
  border-radius: 50%;
  font-weight: 700;
}

.guided-check-description {
  display: block;
  margin-top: 5px;
  line-height: 1.7;
}

.guided-check-counter {
  font-size: 13px;
  opacity: 0.8;
}

.guided-safety-situation {
  margin: 20px 0;
}

.guided-quiz-card {
  text-align: center;
  padding: 36px 24px;
  border: 1px solid var(--guided-border);
  border-radius: 14px;
  background: linear-gradient(120deg, #102b50, #0b3d48);
  color: #fff;
}

.guided-quiz-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.guided-module-references {
  border-top: 1px solid var(--guided-border);
  padding: 32px 20px;
}

.guided-references-inner {
  max-width: 1240px;
  margin: auto;
}

.guided-references-inner h2 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
}

.guided-references-inner ul {
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.8;
}

.guided-references-inner a {
  color: var(--link-text);
}

.guided-floating-menu-button {
  position: fixed;
  bottom: 24px;
  z-index: 30;
  border: 1px solid var(--guided-border);
  background: var(--guided-surface);
  color: inherit;
  border-radius: 30px;
  padding: 12px 16px;
  cursor: pointer;
}

.guided-floating-menu-button {
  left: 20px;
}


.guided-dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.guided-dialog {
  width: 100%;
  max-width: 440px;
  border-radius: 14px;
  border: 1px solid var(--guided-border);
  background: var(--guided-surface);
  padding: 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.guided-dialog h2 {
  font-size: 22px;
  margin-bottom: 12px;
}

.guided-dialog-actions,
.guided-resume-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.guided-module-page button:focus-visible,
.guided-module-page a:focus-visible {
  outline: 3px solid #f5a524;
  outline-offset: 3px;
}


.guided-home-link:hover {
  background: rgba(255, 255, 255, 0.24);
  border-color: #fff;
}

.guided-definition-term {
  display: inline;
  padding: 0 2px;
  border: 0;
  border-bottom: 2px dotted currentColor;
  border-radius: 2px;
  background: rgba(43, 179, 166, 0.14);
  color: var(--accent-text);
  font: inherit;
  font-weight: 700;
  cursor: help;
}
.guided-definition-term:hover {
  background: rgba(43, 179, 166, 0.28);
}
.guided-definition-hint {
  font-size: 0.9rem;
  opacity: 0.85;
}
.guided-lesson-step code,
.guided-fake-message code {
  font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace;
  font-weight: 700;
  letter-spacing: 0.015em;
  padding: 0.15em 0.4em;
  border-radius: 5px;
  background: rgba(47, 125, 246, 0.13);
  color: #5cc4e8;
  overflow-wrap: anywhere;
}
.guided-fake-message code {
  color: #1756a5;
  background: #e8f0ff;
}
.guided-definition-dialog p { line-height: 1.65; }

@keyframes guided-fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
  .guided-module-layout,
  .guided-module-layout.guided-sidebar-hidden {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }

  .guided-module-sidebar {
    position: static;
  }

  .guided-comparison-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .guided-module-layout {
    padding: 20px 16px 48px;
  }

  .guided-introduction-card,
  .guided-information-card,
  .guided-example-panel {
    padding: 16px;
  }

  .guided-step-navigation {
    flex-direction: column;
    align-items: stretch;
  }

  .guided-step-navigation > * {
    width: 100%;
  }

  .guided-quiz-actions,
  .guided-dialog-actions,
  .guided-resume-actions {
    flex-direction: column;
  }

  .guided-quiz-actions > *,
  .guided-dialog-actions > *,
  .guided-resume-actions > * {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .guided-lesson-step {
    animation: none;
  }

  .guided-progress-fill {
    transition: none;
  }
}

/* Refinements: more breathing room and stronger typography */
.guided-module-layout { grid-template-columns: 292px minmax(0, 1fr); gap: 42px; }
.guided-module-sidebar { padding: 22px 18px; }
.guided-sidebar-heading strong { font-size: 14px; letter-spacing: .025em; }
.guided-sidebar-description { font-size: 13px; line-height: 1.6; margin: 12px 0 20px; }
.guided-step-link { font-size: 15px; font-weight: 500; letter-spacing: normal; line-height: 1.5; padding: 13px 12px; gap: 12px; margin: 3px 0; }
.guided-step-link span:first-child { flex: 1; }
.guided-step-active { font-weight: 750; }
.guided-sidebar-progress { font-size: 14px; line-height: 1.6; }
.guided-example-heading { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 12px; }
.guided-example-heading h3 { margin: 0; }
.guided-example-next { border: 1px solid var(--guided-accent); border-radius: 9px; padding: 10px 14px; background: rgba(43,179,166,.11); color: var(--text, inherit); font-weight: 700; cursor: pointer; }
.guided-example-next:hover { background: rgba(43,179,166,.23); }
.guided-example-instruction { font-size: 14px; opacity: .9; }
.guided-mock-badge { background: #dbeafe; color: #1e3a8a; border-radius: 20px; padding: 4px 9px; font-size: 11px; }
.guided-fake-message-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.guided-email-field { display: grid; grid-template-columns: 72px minmax(0,1fr); align-items: start; gap: 10px; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
.guided-email-field strong { padding-top: 8px; font-size: 13px; color: #475569; }
.guided-email-body { padding-top: 22px; }
.guided-email-body p { margin: 12px 0 18px; }
.guided-inspection-target { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 8px; max-width: 100%; width: fit-content; border: 1px dashed #d97706; border-radius: 7px; padding: 7px 10px; background: #fff7ed; color: #7c2d12; font: inherit; font-weight: 650; line-height: 1.55; text-align: left; cursor: pointer; overflow-wrap: anywhere; }
.guided-inspection-target:hover, .guided-inspection-target:focus-visible, .guided-inspection-target[aria-pressed="true"] { background: #ffedd5; border-color: #c2410c; box-shadow: 0 0 0 2px rgba(234,88,12,.15); }
.guided-inspection-target span { font-weight: 900; }
.guided-inspection-url { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; letter-spacing: .02em; }
.guided-clue-explanation { margin-top: 16px; border: 1px solid rgba(43,179,166,.4); border-left: 4px solid var(--guided-accent); border-radius: 10px; padding: 18px 20px; background: rgba(43,179,166,.08); }
.guided-clue-explanation h4 { font-size: 17px; font-weight: 750; margin: 8px 0; }
.guided-clue-explanation p { margin: 0; line-height: 1.7; }
.guided-clue-label { font-size: 11px; font-weight: 800; letter-spacing: .1em; color: var(--accent-text, #1B7F79); }
.guided-example-explanation { line-height: 1.75; }
.guided-dialog-backdrop { background: rgba(4,12,25,.78); backdrop-filter: blur(7px); }
.guided-dialog { max-width: 490px; border-radius: 20px; padding: 34px; background: var(--card-bg, #121d2e); color: var(--text, #dce4f0); box-shadow: 0 28px 90px rgba(0,0,0,.35); }
.guided-dialog h2 { color: var(--heading, inherit); font-size: clamp(24px, 3vw, 29px); font-weight: 800; margin: 8px 0 12px; letter-spacing: -.025em; }
.guided-dialog p { line-height: 1.7; color: var(--muted, inherit); font-size: 15px; }
.guided-modal-icon { width: 50px; height: 50px; border-radius: 14px; display: grid; place-items: center; font-size: 25px; font-weight: 800; background: rgba(43,179,166,.14); color: var(--accent-text, #1B7F79); margin-bottom: 18px; }
.guided-modal-icon-exit { background: rgba(245,166,35,.14); color: #d48a11; }
.guided-dialog .guided-modal-eyebrow { color: var(--accent-text, #1B7F79); font-size: 11px; letter-spacing: .13em; font-weight: 800; margin: 0; }
.guided-modal-divider { height: 1px; background: var(--border, #28374f); margin: 22px 0 18px; }
.guided-dialog-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 28px; }
.guided-dialog-actions button, .guided-modal-main-action { min-height: 46px; }
.guided-modal-main-action { width: 100%; gap: 10px; }
.guided-resume-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.guided-resume-actions > :first-child { grid-column: 1 / -1; }
.guided-resume-actions > * { min-height: 46px; }
@media (max-width: 900px) { .guided-module-layout { grid-template-columns: minmax(0,1fr); gap: 20px; } }
@media (max-width: 620px) { .guided-dialog { padding: 24px; } .guided-dialog-actions, .guided-resume-actions { grid-template-columns: 1fr; } .guided-resume-actions > :first-child { grid-column: auto; } .guided-email-field { grid-template-columns: 1fr; gap: 2px; } .guided-example-next { width: 100%; } }


/* Learning experience refinements */
.guided-learning-outcomes { list-style: disc outside !important; padding-left: 32px !important; }
.guided-learning-outcomes li { display: list-item !important; padding-left: 4px; }
.guided-learning-outcomes li::marker { color: var(--accent-text, #1b7f79); font-size: 1.25em; }
.guided-definition-hint { display: flex; align-items: center; gap: 9px; border: 1px solid var(--border); border-left: 4px solid var(--orange, #f5a623); background: var(--surface-2); padding: 15px 18px; border-radius: 10px; font-size: 15px; line-height: 1.65; }
.guided-topic-tags { gap: 12px; margin: 16px 0 26px; }
.guided-topic-tags span { font-size: 15px; font-weight: 650; padding: 12px 18px; border-radius: 12px; background: var(--surface-2); }
.guided-address-comparison { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; margin: 18px 0; }
.guided-address-example { display: flex; flex-direction: column; gap: 9px; padding: 16px; background: var(--surface-2); border: 1px solid var(--accent-text); border-radius: 12px; }
.guided-address-fake { border-color: #e46b78; }
.guided-address-example code { font-family: ui-monospace, Consolas, monospace; font-weight: 750; overflow-wrap: anywhere; font-size: 14px; }
.guided-address-label { font-weight: 750; font-size: 14px; }
.guided-address-example small { color: var(--muted); line-height: 1.55; font-size: 13px; }
.guided-address-note { font-weight: 700; }
.guided-plain-language-intro { border-left: 4px solid var(--accent-text); padding: 14px 18px; background: var(--surface-2); border-radius: 8px; }
.guided-qr-story { display: flex; align-items: center; gap: 8px; margin: 22px 0; }
.guided-qr-story > div { flex: 1; display: flex; flex-direction: column; gap: 8px; padding: 16px; border: 1px solid var(--border); border-radius: 12px; background: var(--card-bg); min-width: 0; }
.guided-qr-story > div > span { display: grid; place-items: center; border-radius: 50%; background: var(--btn-bg); color: var(--card-bg); width: 30px; height: 30px; font-weight: 800; }
.guided-qr-story strong { font-size: 14px; }
.guided-qr-story small { font-size: 12px; color: var(--muted); line-height: 1.5; }
.guided-login-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 14px; }
.guided-fake-login { overflow: hidden; background: #fff; color: #152238; border-radius: 12px; border: 1px solid #d5dfea; }
.guided-fake-address { display: flex; align-items: center; gap: 8px; width: 100%; padding: 14px; border: 0; background: #edf2f8; color: #b42335; text-align: left; cursor: pointer; }
.guided-fake-address code { color: inherit; font: 700 13px/1.5 ui-monospace,Consolas,monospace; overflow-wrap: anywhere; }
.guided-fake-address:hover, .guided-fake-address[aria-pressed=true] { background: #ffe4e7; outline: 2px solid #d83c52; outline-offset: -2px; }
.guided-fake-login-body { display: flex; flex-direction: column; gap: 10px; padding: 22px; align-items: stretch; }
.guided-fake-login-body h4 { text-align: center; font-weight: 800; font-size: 19px; margin: 0 0 6px; }
.guided-fake-input { border: 1px solid #cbd5e1; border-radius: 7px; padding: 12px; color: #64748b; }
.guided-fake-signin { border: none; border-radius: 7px; background: #1167b1; color: #fff; padding: 12px; font-weight: 750; cursor: pointer; }
.guided-fake-signin:hover { background: #084d87; }
.guided-qr-inspect { display: inline-flex; flex-direction: column; align-items: center; gap: 7px; background: #fff1f2; color: #991b1b; border: 2px dashed #e11d48; border-radius: 10px; padding: 14px; cursor: pointer; font-weight: 700; }
.guided-qr-inspect:hover, .guided-qr-inspect[aria-pressed=true] { background: #ffe4e6; outline: 2px solid #e11d48; }
.guided-qr-art { display: grid; place-items: center; width: 95px; height: 95px; background: #fff; border: 3px solid #111; font-size: 75px; line-height: 1; color: #111; }
.guided-practice-feedback.guided-feedback-correct { border: 1px solid #10b981; border-left: 5px solid #10b981; background: rgba(16,185,129,.14); color: var(--text); font-weight: 650; }
.guided-practice-feedback.guided-feedback-incorrect { border: 1px solid #ef6b73; border-left: 5px solid #ef6b73; background: rgba(239,107,115,.12); color: var(--text); font-weight: 650; }
.guided-practice-actions .guided-answer-selected { border: 2px solid var(--accent-text); background: rgba(43,179,166,.18); font-weight: 800; }
.guided-checklist-item { border: 1px solid var(--border); border-radius: 12px; padding: 18px; margin-bottom: 12px; background: var(--card-bg); transition: background .2s, border-color .2s; }
.guided-checklist-complete { background: rgba(43,179,166,.13); border-color: var(--accent-text); box-shadow: inset 4px 0 0 var(--accent-text); }
.guided-checklist-complete .guided-check-number { background: var(--accent-text); color: var(--card-bg); }
.guided-safety-situation { border: 1px solid var(--border); background: var(--card-bg); padding: 18px; border-radius: 14px; margin: 16px 0; }
.guided-situation-heading { display: flex; align-items: center; gap: 12px; font-size: 17px; line-height: 1.5; font-weight: 750; margin: 0 0 16px; }
.guided-situation-number { flex: 0 0 32px; height: 32px; display: grid; place-items: center; border-radius: 9px; background: var(--surface-2); color: var(--accent-text); font-size: 14px; }
.guided-safety-situation .guided-comparison-grid { margin: 0; }
.guided-safety-situation .guided-information-card { border-radius: 10px; }
.guided-choice-label { font-size: 15px; }
@media(max-width:900px) { .guided-address-comparison,.guided-login-grid { grid-template-columns: 1fr; } }
@media(max-width:620px) { .guided-qr-story { flex-direction: column; align-items: stretch; } .guided-qr-story > span { text-align: center; transform: rotate(90deg); } }
@media(prefers-reduced-motion:reduce) { .guided-checklist-item { transition: none; } }


.guided-helpful-tip {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 14px;
  padding: 20px 24px;
  border: 1px solid var(--border);
  border-left: 4px solid var(--orange);
  border-radius: 12px;
  background: var(--surface-2);
}

.guided-helpful-tip-icon {
  flex-shrink: 0;
  font-size: 22px;
  line-height: 1.4;
}

.guided-helpful-tip-content {
  flex: 1;
  min-width: 0;
}

.guided-helpful-tip-content strong {
  display: block;
  margin-bottom: 6px;
  font-size: 16px;
  color: var(--heading);
}

.guided-helpful-tip-content p {
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: var(--text);
}


/* Sticky Module Progress Indicator */

.guided-module-progress {
  position: sticky;
  top: 0;
  z-index: 40;
  padding: 12px 20px;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
}

.guided-progress-container {
  max-width: 1240px;
  margin: 0 auto;
}

.guided-progress-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.guided-progress-title {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--heading);
  font-size: 14px;
  font-weight: 700;
}

.guided-progress-step {
  color: var(--accent-text);
  font-size: 14px;
  font-weight: 700;
}

.guided-module-progress .guided-progress-track {
  position: static;
  width: 100%;
  height: 7px;
  border-radius: 20px;
  overflow: hidden;
  background: var(--border);
}

.guided-module-progress .guided-progress-fill {
  height: 100%;
  border-radius: 20px;
  background: linear-gradient(
    90deg,
    var(--teal),
    var(--orange)
  );
  transition: width 0.25s ease;
}

@media (max-width: 620px) {
  .guided-module-progress {
    padding: 12px 16px;
  }

  .guided-progress-title,
  .guided-progress-step {
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .guided-module-progress .guided-progress-fill {
    transition: none;
  }
}



/* Phishing Basics embedded educational video */
.guided-video-lesson {
  margin: 32px 0 12px;
  padding: clamp(18px, 3vw, 26px);
  border: 1px solid var(--guided-border);
  border-radius: 16px;
  background: var(--guided-surface);
}
.guided-video-heading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px 18px;
  margin-bottom: 10px;
}
.guided-lesson-step .guided-video-heading-row h3 {
  margin: 0;
  color: var(--heading);
  font-size: clamp(18px, 2.1vw, 21px);
}
.guided-video-duration {
  display: inline-flex;
  align-items: center;
  padding: 6px 11px;
  border: 1px solid var(--guided-border);
  border-radius: 999px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 650;
}
.guided-lesson-step .guided-video-prompt {
  color: var(--muted);
  font-size: 14px;
  margin: 0 0 18px;
}
.guided-video-frame {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 12px;
  background: #0b2545;
}
.guided-video-frame iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
.guided-video-summary {
  margin-top: 18px;
  padding: 17px 19px;
  border-left: 4px solid var(--teal, #2bb3a6);
  border-radius: 10px;
  background: var(--surface-2);
}
.guided-video-summary strong { color: var(--heading); font-size: 15px; }
.guided-lesson-step .guided-video-summary p {
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.7;
}
.guided-lesson-step .guided-video-attribution {
  margin: 12px 0 0;
  font-size: 12px;
  color: var(--muted);
}
.guided-video-attribution a { color: var(--accent-text, #2bb3a6); text-decoration: underline; text-underline-offset: 3px; }
@media (max-width: 620px) { .guided-video-lesson { padding: 16px; } }


/* Distinct subtopic heading following the video */
.guided-lesson-step .guided-domain-tricks-heading {
  font-size: clamp(22px, 2.4vw, 26px);
  font-weight: 800;
  line-height: 1.3;
  color: var(--heading);
  margin: 34px 0 16px;
  letter-spacing: -0.015em;
}

</style>
