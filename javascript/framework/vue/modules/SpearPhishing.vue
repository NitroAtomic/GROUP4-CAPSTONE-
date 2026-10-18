
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

        <h1>Spear Phishing and Target Research</h1>

        <div class="guided-module-metadata">
          <span>Module 2 of 6</span>
          <span class="guided-module-badge">FREE MODULE</span>
          <span>9–12 min read</span>
        </div>
      </div>
    </header>


<!-- Sticky Module Progress Indicator -->
<div
  class="guided-module-progress"
  role="group"
  aria-label="Spear phishing module progress"
>
  <div class="guided-progress-container">
    <div class="guided-progress-heading">
      <span class="guided-progress-title">
        <span aria-hidden="true">📖</span>
        Spear Phishing Module Progress
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
          9–12 min read · 7 short steps
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
              <p class="guided-audience"><strong>Who this is for:</strong> remote staff with system access, administrative privileges, financial responsibilities, or a public social media profile.</p>
              <h2 id="guided-current-step-heading">By the end of this module you can:</h2>
              <ul class="guided-learning-outcomes">
                <li>Tell broad mass <button class="guided-definition-term" type="button" @click="openDefinition('phishing')">phishing</button> apart from <button class="guided-definition-term" type="button" @click="openDefinition('spear phishing')">spear phishing</button> written for one person or team.</li>
                <li>Recognize how <button class="guided-definition-term" type="button" @click="openDefinition('OSINT')">open-source intelligence (OSINT)</button> from LinkedIn, GitHub, and X can become a personalized lure.</li>
                <li>Spot the risk in a <button class="guided-definition-term" type="button" @click="openDefinition('macro')">macro-enabled</button> attachment, a double file extension, and a request to move to an <button class="guided-definition-term" type="button" @click="openDefinition('out-of-band')">out-of-band</button> messaging channel.</li>
              </ul>
              <div class="guided-helpful-tip"><span class="guided-helpful-tip-icon" aria-hidden="true">💡</span><div class="guided-helpful-tip-content"><strong>Helpful tip</strong><p>Click any highlighted, dotted-underlined term for a simple explanation. Try “spear phishing” above.</p></div></div>
              <div class="guided-introduction-footer"><h3>You'll cover:</h3><div class="guided-topic-tags"><span>Personalized messages</span><span>Public-profile research</span><span>Suspicious attachments</span><span>Safe verification</span></div><button type="button" class="guided-primary-button" @click="goToStep(2)">Start the lesson →</button></div>
            </div>
          </template>

          <!-- STEP 2: SPEAR PHISHING BASICS -->
          <template v-else-if="currentStep === 2">
            <h2 id="guided-current-step-heading">A message designed just for you</h2>
            <p>Mass phishing sends thousands of similar messages, hoping someone clicks. Spear phishing targets a particular person, team, or organization using details that make a message feel familiar.</p>
            <div class="guided-comparison-grid">
              <div class="guided-information-card"><h3>Mass phishing</h3><p>“Dear Customer, your account will close today. Verify now.”</p><p><strong>Approach:</strong> Generic wording sent broadly.</p></div>
              <div class="guided-information-card guided-warning-card"><h3>Spear phishing</h3><p>“Hi Alex, can you review the Acme Corp proposal before our client call?”</p><p><strong>Approach:</strong> Uses your name, real work, and plausible timing to earn trust.</p></div>
            </div>
            <h3>Why the familiar details matter</h3>
            <p>An attacker might mention your current client engagement, a coworker's name, the platforms you use, or a recent company event. These details can be true even when the sender is an impostor.</p>
            <div class="guided-plain-language-intro"><strong>Imagine this:</strong> You receive a message apparently from a teammate at a conference. It references a real client and asks you to open an attachment. You recognize the project—but have you verified who actually sent it?</div>
            <div class="guided-takeaway"><strong>Key takeaway</strong><p>Accurate personal details make a message believable; they do not prove it came from the claimed sender.</p></div>
          </template>

          <!-- STEP 3: TARGET RESEARCH -->
          <template v-else-if="currentStep === 3">
            <h2 id="guided-current-step-heading">How attackers research a target</h2>
            <p><button type="button" class="guided-definition-term" @click="openDefinition('OSINT')">OSINT</button> means collecting information from publicly available sources. An attacker can combine small details into a convincing work-related request.</p>
            <div class="guided-comparison-grid">
              <div v-for="source in osintSources" :key="source.id" class="guided-information-card"><h3>{{ source.name }}</h3><p>{{ source.details }}</p><button type="button" class="guided-example-next" :aria-pressed="selectedOsint === source.id" @click="selectedOsint = source.id">Inspect how it could be used ⊕</button></div>
            </div>
            <div class="guided-clue-explanation" role="status" aria-live="polite"><template v-if="selectedOsint"><span class="guided-clue-label">FROM PUBLIC DETAIL TO PERSONALIZED LURE</span><h4>{{ osintSources.find(item => item.id === selectedOsint)?.name }}</h4><p>{{ osintSources.find(item => item.id === selectedOsint)?.risk }}</p></template><p v-else>Select a public source above to see how an attacker might misuse it.</p></div>
            <figure class="guided-module-figure"><img src="/images/OSINT-for-Targeted-Spear-Phishing-Process-Flow.png" alt="Process diagram showing LinkedIn job details, GitHub project information, and social media activity combined into a customized spear phishing message." /><figcaption>Details from LinkedIn, GitHub and social media/X combine into one message aimed at a specific target.</figcaption></figure>
            <h3>Putting the details together</h3>
            <div class="guided-plain-language-intro"><strong>Example:</strong> “Hi Alex, I'm at the TechSummit conference right now. Could you check the attached update for the Acme Corp project proposal? Password to unzip is 1234.”</div>
            <p>Names, conference attendance, and project details may all be real. The unexpected file and password still need independent verification.</p>
            <div class="guided-takeaway"><strong>Key takeaway</strong><p>Information you post publicly can be combined into an impersonation attempt. Verify unusual requests using a trusted contact method.</p></div>
          </template>

          <!-- STEP 4: ATTACHMENTS -->
          <template v-else-if="currentStep === 4">
            <h2 id="guided-current-step-heading">Attachments that deserve a closer look</h2>
            <p>A targeted message may carry a malicious file rather than a suspicious link. Select each example to learn what makes it risky.</p>
            <div class="guided-comparison-grid">
              <div v-for="file in attachmentExamples" :key="file.id" class="guided-information-card guided-warning-card"><h3>{{ file.title }}</h3><p><code>{{ file.filename }}</code></p><p>{{ file.summary }}</p><button type="button" class="guided-example-next" :aria-pressed="selectedAttachment === file.id" @click="selectedAttachment = file.id">Inspect this attachment ⊕</button></div>
            </div>
            <div class="guided-clue-explanation" role="status" aria-live="polite"><template v-if="selectedAttachment"><span class="guided-clue-label">ATTACHMENT WARNING SIGN</span><h4>{{ attachmentExamples.find(item => item.id === selectedAttachment)?.title }}</h4><p>{{ attachmentExamples.find(item => item.id === selectedAttachment)?.explanation }}</p></template><p v-else>Choose a file example above to reveal its potential risk.</p></div>
            <div class="guided-information-card guided-warning-card"><h3>Why password-protected archives matter</h3><p>Encrypted <code>.zip</code>, <code>.rar</code>, and <code>.7z</code> files may prevent some security scanners from inspecting their contents. A password included in the same unexpected email is not evidence that the file is safe.</p></div>
            <div class="guided-takeaway"><strong>Key takeaway</strong><p>Don't enable unexpected macros, open disguised executable files, or extract unverified password-protected archives. Confirm the request before opening anything.</p></div>
          </template>

          <!-- STEP 5: EXAMPLES AND PRACTICE -->
          <template v-else-if="currentStep === 5">
            <h2 id="guided-current-step-heading">Investigate a targeted attack</h2><p>Explore the examples, then decide whether each situation is safe or risky.</p>
            <div class="guided-example-tabs" role="tablist" aria-label="Example types"><button v-for="example in exampleTabs" :key="example.id" :id="`guided-tab-${example.id}`" type="button" role="tab" :aria-selected="activeExampleTab === example.id" :aria-controls="`guided-panel-${example.id}`" :tabindex="activeExampleTab === example.id ? 0 : -1" :class="{ 'guided-tab-selected': activeExampleTab === example.id }" @click="selectExample(example.id)" @keydown="handleTabKeydown($event, example.id)">{{ example.label }}</button></div>
            <div :id="`guided-panel-${activeExampleTab}`" role="tabpanel" :aria-labelledby="`guided-tab-${activeExampleTab}`" class="guided-example-panel" tabindex="0">
              <template v-if="activeExampleTab === 'email'">
                <div class="guided-example-heading"><h3>Example 1: A personalized email</h3><button type="button" class="guided-example-next" @click="nextExample">Next example →</button></div>
                <p class="guided-example-instruction">Click the highlighted parts of this training-only email to investigate its clues.</p>
                <div class="guided-fake-message guided-interactive-mockup"><div class="guided-fake-message-header"><span>Inbox / Project update</span><span class="guided-mock-badge">Training example</span></div><div class="guided-fake-message-body"><div class="guided-email-field"><strong>From</strong><button type="button" class="guided-inspection-target" :aria-pressed="selectedExampleClue === 'sender'" @click="selectedExampleClue = 'sender'">Jordan Lee &lt;jordan@acme-project-updates.net&gt; ⊕</button></div><div class="guided-email-field"><strong>Subject</strong><button type="button" class="guided-inspection-target" :aria-pressed="selectedExampleClue === 'subject'" @click="selectedExampleClue = 'subject'">Acme Corp proposal — please review before 3 PM ⊕</button></div><div class="guided-email-body"><p>Hi Alex, I'm at TechSummit and need you to review the updated proposal.</p><button type="button" class="guided-inspection-target" :aria-pressed="selectedExampleClue === 'attachment'" @click="selectedExampleClue = 'attachment'">📎 Acme_Proposal_Update.zip (password: 1234) ⊕</button><p><button type="button" class="guided-inspection-target" :aria-pressed="selectedExampleClue === 'request'" @click="selectedExampleClue = 'request'">Please open it now and don't wait for the team call. ⊕</button></p></div></div></div>
                <div class="guided-clue-explanation" role="status" aria-live="polite"><template v-if="selectedExampleClue"><span class="guided-clue-label">RED FLAG {{ emailClues[selectedExampleClue].number }}</span><h4>{{ emailClues[selectedExampleClue].title }}</h4><p>{{ emailClues[selectedExampleClue].explanation }}</p></template><p v-else>Select a sender, subject, attachment, or request to reveal why it deserves scrutiny.</p></div>
              </template>
              <template v-else-if="activeExampleTab === 'attachment'">
                <div class="guided-example-heading"><h3>Example 2: Inspect the filename</h3><button type="button" class="guided-example-next" @click="nextExample">Next example →</button></div>
                <p>Which filename could be disguising an executable program?</p><div class="guided-comparison-grid"><div v-for="file in attachmentExamples" :key="file.id" class="guided-information-card"><code>{{ file.filename }}</code><p>{{ file.summary }}</p><button type="button" class="guided-example-next" @click="selectedAttachment = file.id">Reveal risk ⊕</button></div></div>
                <div class="guided-clue-explanation" role="status" aria-live="polite"><template v-if="selectedAttachment"><h4>{{ attachmentExamples.find(item => item.id === selectedAttachment)?.title }}</h4><p>{{ attachmentExamples.find(item => item.id === selectedAttachment)?.explanation }}</p></template><p v-else>Select a filename to see what it could conceal.</p></div>
              </template>
              <template v-else-if="activeExampleTab === 'channel'">
                <div class="guided-example-heading"><h3>Example 3: Switch to a private chat?</h3><button type="button" class="guided-example-next" @click="nextExample">Next example →</button></div>
                <p>A message claims to be from your manager:</p><div class="guided-fake-message"><div class="guided-fake-message-header">Direct message <span class="guided-mock-badge">Training example</span></div><div class="guided-fake-message-body"><p>“I'm in meetings. Message my new personal number on another app and send the client payment details there. Please keep this between us.”</p></div></div>
                <div class="guided-practice-actions"><button type="button" :class="{ 'guided-answer-selected': channelChoice === 'comply' }" @click="channelChoice = 'comply'">Move the conversation</button><button type="button" :class="{ 'guided-answer-selected': channelChoice === 'verify' }" @click="channelChoice = 'verify'">Verify through a known channel</button></div>
                <p v-if="channelChoice" class="guided-practice-feedback" :class="channelChoice === 'verify' ? 'guided-feedback-correct' : 'guided-feedback-incorrect'" role="status">{{ channelChoice === 'verify' ? '✓ Correct. ' : '✕ Risky choice. ' }}An unexpected request to switch channels and share sensitive information should be verified using a contact method you already trust.</p>
              </template>
              <template v-else>
                <div class="guided-example-heading"><h3>Example 4: Safe or risky?</h3><button type="button" class="guided-example-next" @click="nextExample">Back to first example ↺</button></div>
                <div v-for="(scenario, index) in practiceScenarios" :key="index" class="guided-practice-card"><p>{{ scenario.question }}</p><div class="guided-practice-actions"><button type="button" :class="{ 'guided-answer-selected': practiceAnswers[index] === 'safe' }" :aria-pressed="practiceAnswers[index] === 'safe'" @click="answerScenario(index, 'safe')">Safe</button><button type="button" :class="{ 'guided-answer-selected': practiceAnswers[index] === 'risky' }" :aria-pressed="practiceAnswers[index] === 'risky'" @click="answerScenario(index, 'risky')">Risky</button></div><p v-if="practiceAnswers[index]" class="guided-practice-feedback" :class="practiceAnswers[index] === scenario.answer ? 'guided-feedback-correct' : 'guided-feedback-incorrect'" role="status">{{ practiceAnswers[index] === scenario.answer ? '✓ Correct! ' : '✕ Not quite. ' }}{{ scenario.explanation }}</p></div>
              </template>
            </div>
            <div class="guided-takeaway"><strong>Key takeaway</strong><p>Even a message with accurate personal or project details needs verification when it asks you to open an unexpected file or share sensitive information.</p></div>
          </template>

          <!-- STEP 6: SAFETY CHECKS -->
          <template v-else-if="currentStep === 6">
            <h2 id="guided-current-step-heading">The three checks</h2><p>Tap each check as you go.</p>
            <div class="guided-checklist"><button v-for="(check, index) in safetyChecks" :key="index" type="button" class="guided-checklist-item" :class="{ 'guided-checklist-complete': completedSafetyChecks.includes(index) }" role="checkbox" :aria-checked="completedSafetyChecks.includes(index)" @click="toggleSafetyCheck(index)"><span class="guided-check-number">{{ completedSafetyChecks.includes(index) ? '✓' : index + 1 }}</span><span><strong>{{ check.title }}</strong><span class="guided-check-description">{{ check.description }}</span></span></button></div>
            <p class="guided-check-counter" aria-live="polite">{{ completedSafetyChecks.length }} of {{ safetyChecks.length }} checks done</p>
            <h3>Do's and Don'ts</h3><div class="guided-safety-comparison"><div v-for="(situation, index) in safetySituations" :key="index" class="guided-safety-situation"><h4 class="guided-situation-heading"><span class="guided-situation-number">{{ index + 1 }}</span>{{ situation.context }}</h4><div class="guided-comparison-grid"><div class="guided-information-card guided-danger-card"><strong class="guided-choice-label">✕ Don't do this</strong><p>{{ situation.unsafe }}</p></div><div class="guided-information-card guided-safe-card"><strong class="guided-choice-label">✓ Do this instead</strong><p>{{ situation.safe }}</p></div></div></div></div>
            <div class="guided-takeaway"><strong>Key takeaway</strong><p>Verify unexpected requests independently, treat attachments carefully, and report suspicious messages promptly.</p></div>
          </template>

          <!-- STEP 7: QUIZ -->
          <template v-else><div class="guided-quiz-card"><h2 id="guided-current-step-heading">Test Your Knowledge</h2><p>Ready to check what you've learned? Take a randomized 10-question quiz drawn from a pool of 20, so a retake is never the same test twice.</p><div class="guided-quiz-actions"><router-link to="/quiz/module-2/question" class="guided-primary-button">Take a Quiz</router-link><button type="button" class="guided-secondary-button" @click="requestLeaveModule">Back to Homepage</button></div></div></template>
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
          <li><strong>Technical Taxonomy:</strong> <a href="https://attack.mitre.org/techniques/T1566/001/" target="_blank" rel="noopener noreferrer">MITRE ATT&amp;CK — Phishing: Spearphishing Attachment (T1566.001)</a></li>
          <li><strong>Research Survey:</strong> Birthriya, S. K., Ahlawat, P., &amp; Jain, A. K. (2025). Detection and prevention of spear phishing attacks: A comprehensive survey. <em>Computers &amp; Security</em>, 151, 104317.</li>
          <li><strong>Security Advisory:</strong> <a href="https://www.cisa.gov/news-events/news/spear-phishing-threats-and-prevention" target="_blank" rel="noopener noreferrer">CISA — Spear Phishing Threats and Prevention</a></li>
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
            to="/quiz/module-2/question"
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

const glossaryDefinitions = {
  'phishing': 'A scam where someone impersonates a trusted source to steal information or persuade you to take an unsafe action.',
  'spear phishing': 'A phishing attempt tailored to a particular person, team, or organization using relevant details.',
  'OSINT': 'Open-source intelligence: information gathered from public sources such as professional profiles, websites, and social media.',
  'macro': 'A small automated program inside some Office documents; malicious macros can run harmful actions if enabled.',
  'out-of-band': 'A different communication channel, such as switching from work email to a personal messaging app.',
  'double extension': 'A filename ending in multiple extensions, such as report.pdf.exe, which can make an executable look like a document.',
  'encrypted archive': 'A password-protected compressed file that security tools may not be able to inspect without the password.'
}
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
  { id: 'spear-phishing-basics', name: 'Spear phishing basics' },
  { id: 'target-research', name: 'Target research' },
  { id: 'dangerous-attachments', name: 'Dangerous attachments' },
  { id: 'examples-and-practice', name: 'Examples & practice' },
  { id: 'safety-checks', name: 'Safety checks' },
  { id: 'quiz', name: 'Quiz' }
]
const storageKey = 'se-aware-spear-phishing-lesson-progress'

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
const selectedAttachment = ref(null)
const selectedOsint = ref(null)
const channelChoice = ref(null)
const osintSources = [
  { id: 'linkedin', name: 'LinkedIn', details: 'Job titles, reporting lines, connections, client and vendor relationships.', risk: 'An impostor can pretend to be a manager, colleague, or vendor and mention the real people you work with.' },
  { id: 'github', name: 'GitHub and technical blogs', details: 'Public projects, programming frameworks, repositories, and technologies.', risk: 'An attacker can reference a real project or technology to make a fake technical request appear relevant.' },
  { id: 'social', name: 'Social media and X', details: 'Conference attendance, holidays, posts, and activity patterns.', risk: 'A scammer can time a message around a real event, claiming a coworker is unavailable and needs urgent help.' }
]
const attachmentExamples = [
  { id: 'macro', title: 'Macro-enabled Office document', filename: 'Proposal_Updates.docm', summary: 'An Office document that can contain executable macros.', explanation: 'A .docm or .xlsm file can contain Visual Basic for Applications (VBA) macros. If malicious macros are enabled, they may download or run malware. Do not enable macros for an unexpected attachment.' },
  { id: 'double', title: 'Double file extension', filename: 'Quarterly_Report.pdf.exe', summary: 'Looks like a PDF, but ends with .exe.', explanation: 'The final extension is .exe, meaning this is an executable program, not a PDF. Some systems hide known extensions, making the file look less suspicious.' },
  { id: 'archive', title: 'Encrypted archive', filename: 'Acme_Proposal_Update.zip', summary: 'A password-protected archive with the password in the email.', explanation: 'Password protection may prevent automated scanners from examining the archive contents. A password in the same email does not make the contents trustworthy.' }
]
const emailClues = {
  sender: { number: '01', title: 'Lookalike project domain', explanation: 'The name Jordan Lee could be copied. The address acme-project-updates.net is not established as an official coworker or client domain.' },
  subject: { number: '02', title: 'Relevant details plus urgency', explanation: 'A real project name and a deadline can make a message persuasive, but neither confirms the sender.' },
  attachment: { number: '03', title: 'Unexpected protected archive', explanation: 'The password-protected ZIP may conceal files that security scanners cannot inspect. Verify before downloading or opening.' },
  request: { number: '04', title: 'Pressure to skip verification', explanation: 'An instruction to act immediately and avoid a team call is a reason to pause and contact the purported sender using a known channel.' }
}
function selectExample(exampleId) { activeExampleTab.value = exampleId; selectedExampleClue.value = null; selectedAttachment.value = null; channelChoice.value = null }
function nextExample() { const index = exampleTabs.findIndex(example => example.id === activeExampleTab.value); selectExample(exampleTabs[(index + 1) % exampleTabs.length].id) }

const completedSafetyChecks = ref([])
const practiceAnswers = ref({})

const exampleTabs = [
  { id: 'email', label: 'Targeted email' },
  { id: 'attachment', label: 'Attachments' },
  { id: 'channel', label: 'Private message' },
  { id: 'practice', label: 'Practice' }
]
const practiceScenarios = [
  { question: 'A message mentions your actual client project, so you assume the attached file must be legitimate.', answer: 'risky', explanation: 'Real details can come from public information; verify the sender and attachment.' },
  { question: 'You call your coworker using a number already saved in your company directory to confirm an unexpected file.', answer: 'safe', explanation: 'Independent verification through a known contact method is a good precaution.' },
  { question: 'A report named Quarterly_Report.pdf.exe arrives unexpectedly, and you open it because it says PDF.', answer: 'risky', explanation: 'The final .exe extension indicates an executable program.' },
  { question: 'Your manager unexpectedly asks you to send financial information through a new personal messaging account.', answer: 'risky', explanation: 'Unexpected channel changes involving sensitive data should be verified.' }
]
const safetyChecks = [
  { title: 'Verify the person, not just the details.', description: 'Confirm unusual requests using a phone number, work chat, or other contact method you already know is genuine.' },
  { title: 'Inspect the file and the request.', description: 'Check the full filename and extension. Avoid unexpected macros, executables, and protected archives.' },
  { title: 'Report suspicious messages promptly.', description: 'Use your organization’s reporting process. If you opened a suspicious file or shared data, contact your security team immediately.' }
]
const safetySituations = [
  { context: 'A coworker mentions a real client and sends an unexpected ZIP file.', unsafe: 'Trust the file because the project name is correct.', safe: 'Confirm the request directly through a known work channel.' },
  { context: 'A document asks you to enable macros.', unsafe: 'Enable macros so the document displays correctly.', safe: 'Do not enable macros for an unverified attachment; contact IT.' },
  { context: 'A filename ends in .pdf.exe.', unsafe: 'Assume it is a normal PDF because PDF appears in the name.', safe: 'Inspect the final extension and do not run unexpected executables.' },
  { context: 'Someone claiming to be your manager asks to switch to a private app.', unsafe: 'Move sensitive work details to the new account immediately.', safe: 'Verify the request through your established company channel.' },
  { context: 'You accidentally opened a suspicious attachment.', unsafe: 'Hide the incident and keep working.', safe: 'Stop interacting with it and report the incident promptly to your security team.' }
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
  color: #35d8ca;
  border-radius: 30px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 700;
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
  color: #2bb3a6;
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
  color: inherit;
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

.guided-quiz-card .guided-secondary-button {
  background: #ffffff;
  color: #0b2545;
  border: 1px solid #c8d3e3;
}

.guided-quiz-card .guided-secondary-button:hover {
  background: #eaeff6;
  color: #0b2545;
}

.guided-quiz-card .guided-secondary-button:focus-visible {
  outline: 3px solid #f5a623;
  outline-offset: 3px;
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
  color: #7eb8ed;
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
  color: var(--guided-accent);
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


.guided-practice-actions { flex-wrap: wrap; margin: 16px 0; }
.guided-practice-actions button { min-height: 42px; }
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


</style>
