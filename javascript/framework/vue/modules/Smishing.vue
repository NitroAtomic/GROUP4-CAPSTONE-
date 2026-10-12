<template>
  <main class="guided-module-page">
    <header class="guided-module-header"><div class="guided-module-container">
      <nav aria-label="Breadcrumb"><button type="button" class="guided-home-link" @click="requestLeaveModule"><span aria-hidden="true">⌂</span> Home</button></nav>
      <h1>Smishing: Scam Texts and Messages</h1><div class="guided-module-metadata"><span>Module 3 of 6</span><span class="guided-module-badge">FREE MODULE</span><span>9–12 min read</span></div>
    </div></header>
    <div class="guided-module-progress" role="group" aria-label="Smishing module progress"><div class="guided-progress-container"><div class="guided-progress-heading"><span class="guided-progress-title">📖 Smishing Module Progress</span><span class="guided-progress-step" aria-live="polite">Step {{ currentStep }} of {{ lessonSteps.length }}</span></div><div class="guided-progress-track" role="progressbar" :aria-valuenow="currentStep" :aria-valuemin="1" :aria-valuemax="lessonSteps.length" :aria-valuetext="`Step ${currentStep} of ${lessonSteps.length}`" aria-label="Lesson progress"><div class="guided-progress-fill" :style="{ width: `${currentStep / lessonSteps.length * 100}%` }"></div></div></div></div>
    <div class="guided-module-layout" :class="{ 'guided-sidebar-hidden': !sidebarVisible }">
      <aside v-if="sidebarVisible" class="guided-module-sidebar" aria-label="Lesson navigation"><div class="guided-sidebar-heading"><strong>IN THIS MODULE</strong><span class="guided-module-badge">FREE</span></div><p class="guided-sidebar-description">9–12 min read · 7 short steps</p><nav aria-label="Module steps"><button v-for="(step, index) in lessonSteps" :key="step.id" type="button" class="guided-step-link" :class="{ 'guided-step-active': currentStep === index + 1 }" :aria-current="currentStep === index + 1 ? 'step' : undefined" @click="goToStep(index + 1)"><span>{{ String(index + 1).padStart(2, '0') }} · {{ step.name }}</span><span v-if="completedSteps.includes(index + 1)" class="guided-completed-mark" aria-label="Visited">✓</span></button></nav><div class="guided-sidebar-progress"><p>Step {{ currentStep }} of {{ lessonSteps.length }}</p><div class="guided-sidebar-progress-track"><div class="guided-sidebar-progress-fill" :style="{ width: `${currentStep / lessonSteps.length * 100}%` }"></div></div></div><button type="button" class="guided-hide-menu-button" @click="sidebarVisible = false">‹ Hide menu</button></aside>
      <div class="guided-module-content"><section :key="currentStep" ref="activeStepSection" class="guided-lesson-step" aria-labelledby="guided-current-step-heading"><p class="guided-step-eyebrow" aria-live="polite">STEP {{ currentStep }} OF {{ lessonSteps.length }} · {{ lessonSteps[currentStep - 1].name.toUpperCase() }}</p>
        <template v-if="currentStep === 1"><div class="guided-introduction-card"><p class="guided-audience"><strong>Who this is for:</strong> remote employees and freelancers using personal phones (BYOD) for MFA, client messages, and team communication.</p><h2 id="guided-current-step-heading">By the end of this module you can:</h2><ul class="guided-learning-outcomes"><li>Explain why <button type="button" class="guided-definition-term" @click="openDefinition('smishing')">smishing</button> messages can feel trustworthy even when they are scams.</li><li>Recognize <button type="button" class="guided-definition-term" @click="openDefinition('sender ID spoofing')">spoofed sender IDs</button>, shortened links, and fake portals.</li><li>Spot fake delivery, bank, and digital-wallet alerts, including scams involving familiar apps and services.</li><li>Protect your <button type="button" class="guided-definition-term" @click="openDefinition('OTP')">OTP</button> and <button type="button" class="guided-definition-term" @click="openDefinition('MFA')">MFA</button> codes, verify independently, and report suspicious messages.</li></ul><div class="guided-helpful-tip"><span class="guided-helpful-tip-icon" aria-hidden="true">💡</span><div class="guided-helpful-tip-content"><strong>Helpful tip</strong><p>Click any highlighted, dotted-underlined term for a quick definition. Try “smishing” above.</p></div></div><div class="guided-introduction-footer"><h3>You'll cover:</h3><div class="guided-topic-tags"><span>SMS &amp; chat scams</span><span>Fake delivery alerts</span><span>Digital-wallet OTPs</span><span>Safe reporting</span></div><button type="button" class="guided-primary-button" @click="goToStep(2)">Start the lesson →</button></div></div></template>
        <template v-else-if="currentStep === 2"><h2 id="guided-current-step-heading">Why your phone can be the soft spot</h2><p><button type="button" class="guided-definition-term" @click="openDefinition('smishing')">Smishing</button> is phishing delivered through SMS or messaging apps such as WhatsApp, Viber, Signal, or Telegram. Attackers use messages to lure you into opening a harmful link, calling a fake support number, or revealing private information.</p><div class="guided-comparison-grid"><div v-for="item in phoneRisks" :key="item.title" class="guided-information-card"><h3>{{ item.title }}</h3><p>{{ item.description }}</p></div></div><h3>SMS, email, and messaging apps</h3><p>The channel may change, but the trick is similar: impersonate someone you trust, create pressure, and ask you to act before checking. A phone's small screen may hide the full website address. Personal phones may also lack the same company security controls as managed laptops.</p><div class="guided-plain-language-intro"><strong>Example:</strong> A freelancer receives a message claiming a GCash account needs urgent verification. The brand is familiar, but familiarity does not authenticate the message.</div><div class="guided-takeaway"><strong>Key takeaway</strong><p>A familiar app, sender name, or conversation thread does not guarantee that a message is legitimate.</p></div></template>
        <template v-else-if="currentStep === 3"><h2 id="guided-current-step-heading">The everyday lures scammers use</h2><p>Scammers borrow situations you might encounter during a normal workday. Select each scenario to see the trap.</p><div class="guided-comparison-grid"><div v-for="lure in lures" :key="lure.id" class="guided-information-card guided-warning-card"><h3>{{ lure.title }}</h3><p>{{ lure.message }}</p><button type="button" class="guided-example-next" :aria-pressed="selectedLure === lure.id" @click="selectedLure = lure.id">Inspect this lure ⊕</button></div></div><div class="guided-clue-explanation" role="status" aria-live="polite"><template v-if="selectedLure"><span class="guided-clue-label">HOW THE SCAM WORKS</span><h4>{{ lures.find(item => item.id === selectedLure)?.title }}</h4><p>{{ lures.find(item => item.id === selectedLure)?.explanation }}</p></template><p v-else>Select a message to reveal the scammer's goal.</p></div><h3>Hidden links and faked senders</h3><p>Shorteners such as <code>bit.ly</code>, <code>tinyurl.com</code>, and <code>t.co</code> can obscure a destination. A lookalike domain such as <code>wallet-verify.example</code> may imitate a real login portal. <button type="button" class="guided-definition-term" @click="openDefinition('sender ID spoofing')">Sender ID spoofing</button> can make a text appear to come from a trusted organization—even in an existing message thread on some networks.</p><p><strong>Important:</strong> A strange domain is a warning sign, but a familiar-looking domain or sender name alone is not proof of safety.</p><div class="guided-takeaway"><strong>Key takeaway</strong><p>Open your bank, wallet, courier, or employer's official app or bookmarked website yourself rather than following an unexpected message link.</p></div></template>
        <template v-else-if="currentStep === 4"><h2 id="guided-current-step-heading">Four red flags to recognize</h2><p>Choose each warning sign to understand what it looks like in a real message.</p><div class="guided-comparison-grid"><div v-for="flag in redFlags" :key="flag.id" class="guided-information-card guided-warning-card"><h3>{{ flag.title }}</h3><p>{{ flag.example }}</p><button type="button" class="guided-example-next" :aria-pressed="selectedFlag === flag.id" @click="selectedFlag = flag.id">Explain this red flag ⊕</button></div></div><div class="guided-clue-explanation" role="status" aria-live="polite"><template v-if="selectedFlag"><span class="guided-clue-label">WARNING SIGN</span><h4>{{ redFlags.find(item => item.id === selectedFlag)?.title }}</h4><p>{{ redFlags.find(item => item.id === selectedFlag)?.explanation }}</p></template><p v-else>Choose a red flag above to see why it matters.</p></div><div class="guided-information-card"><h3>What about the sender's number?</h3><p>A message from an unexpected ordinary mobile number claiming to be your bank or employer deserves caution. However, legitimate organizations can use different sender types, and scammers can spoof recognizable sender names. Never rely on the number or label alone.</p></div><div class="guided-takeaway"><strong>Key takeaway</strong><p>Urgency, unusual links, requests for codes, and sender inconsistencies are reasons to pause and verify.</p></div></template>
        <template v-else-if="currentStep === 5"><h2 id="guided-current-step-heading">Investigate suspicious messages</h2><p>These are fictional training simulations featuring familiar apps and services. No example contains a live scam link.</p><div class="guided-example-tabs" role="tablist" aria-label="Smishing examples"><button v-for="example in exampleTabs" :key="example.id" :id="`guided-tab-${example.id}`" type="button" role="tab" :aria-selected="activeExampleTab === example.id" :aria-controls="`guided-panel-${example.id}`" :tabindex="activeExampleTab === example.id ? 0 : -1" :class="{ 'guided-tab-selected': activeExampleTab === example.id }" @click="selectExample(example.id)" @keydown="handleTabKeydown($event, example.id)">{{ example.label }}</button></div><div :id="`guided-panel-${activeExampleTab}`" role="tabpanel" :aria-labelledby="`guided-tab-${activeExampleTab}`" class="guided-example-panel" tabindex="0">
          <template v-if="activeExampleTab === 'delivery'"><div class="guided-example-heading"><h3>Example 1: Fake parcel delivery</h3><button type="button" class="guided-example-next" @click="nextExample">Next example →</button></div><p class="guided-example-instruction">Tap the highlighted details to inspect this fictional J&amp;T-style message.</p><div class="guided-phone-frame"><div class="guided-phone-top">Messages · Today 9:18 AM</div><div class="guided-phone-conversation"><strong>Delivery Updates <span class="guided-mock-badge">Training example</span></strong><p>Hi! Your package cannot be delivered.</p><button type="button" class="guided-inspection-target" :aria-pressed="selectedExampleClue === 'fee'" @click="selectedExampleClue = 'fee'">Pay ₱18.00 redelivery fee ⊕</button><p><button type="button" class="guided-inspection-target guided-inspection-url" :aria-pressed="selectedExampleClue === 'link'" @click="selectedExampleClue = 'link'">delivery-update.example/track ⊕</button></p><button type="button" class="guided-inspection-target" :aria-pressed="selectedExampleClue === 'pressure'" @click="selectedExampleClue = 'pressure'">Complete within 30 minutes or parcel returned ⊕</button></div></div><div class="guided-clue-explanation" role="status" aria-live="polite"><template v-if="selectedExampleClue"><span class="guided-clue-label">RED FLAG</span><h4>{{ deliveryClues[selectedExampleClue].title }}</h4><p>{{ deliveryClues[selectedExampleClue].explanation }}</p></template><p v-else>Tap the fee, website, or deadline to inspect the warning sign.</p></div></template>
          <template v-else-if="activeExampleTab === 'wallet'"><div class="guided-example-heading"><h3>Example 2: Fake digital-wallet support</h3><button type="button" class="guided-example-next" @click="nextExample">Next example →</button></div><div class="guided-phone-frame"><div class="guided-phone-top">Messages · Today 10:02 AM</div><div class="guided-phone-conversation"><strong>Wallet Support <span class="guided-mock-badge">Training example</span></strong><p>GCash/Maya-style account notice: A security review is pending. A verification code was sent to your phone. Reply with the six digits to prevent a lockout.</p></div></div><p><strong>What should you do?</strong></p><div class="guided-practice-actions"><button type="button" :class="{ 'guided-answer-selected': walletChoice === 'share' }" :aria-pressed="walletChoice === 'share'" @click="walletChoice = 'share'">Reply with the code</button><button type="button" :class="{ 'guided-answer-selected': walletChoice === 'verify' }" :aria-pressed="walletChoice === 'verify'" @click="walletChoice = 'verify'">Open the official app yourself</button></div><p v-if="walletChoice" class="guided-practice-feedback" :class="walletChoice === 'verify' ? 'guided-feedback-correct' : 'guided-feedback-incorrect'" role="status">{{ walletChoice === 'verify' ? '✓ Correct. ' : '✕ Risky choice. ' }}Never share OTPs or authentication codes with anyone. A genuine code can be triggered by a scammer attempting to sign in.</p></template>
          <template v-else-if="activeExampleTab === 'work'"><div class="guided-example-heading"><h3>Example 3: Before the remote shift</h3><button type="button" class="guided-example-next" @click="nextExample">Next example →</button></div><p>Sarah, a remote customer support agent, receives this fictional message at 8:00 AM:</p><div class="guided-phone-frame"><div class="guided-phone-top">SMS · Today 8:00 AM</div><div class="guided-phone-conversation"><strong>IT Access Team <span class="guided-mock-badge">Training example</span></strong><p>Remote access flagged for compliance review. Resolve within 30 minutes to maintain shift access. Sign in at <code>company-sso-verify.example/login</code>.</p></div></div><p>The page resembles her employer's single sign-on portal and asks for her password and MFA approval.</p><div class="guided-practice-actions"><button type="button" :class="{ 'guided-answer-selected': workChoice === 'sign-in' }" :aria-pressed="workChoice === 'sign-in'" @click="workChoice = 'sign-in'">Sign in immediately</button><button type="button" :class="{ 'guided-answer-selected': workChoice === 'contact' }" :aria-pressed="workChoice === 'contact'" @click="workChoice = 'contact'">Contact IT through the known work channel</button></div><p v-if="workChoice" class="guided-practice-feedback" :class="workChoice === 'contact' ? 'guided-feedback-correct' : 'guided-feedback-incorrect'" role="status">{{ workChoice === 'contact' ? '✓ Correct. ' : '✕ Risky choice. ' }}A realistic login page and threat of missing a shift do not prove the request is genuine. Verify through your normal IT support channel.</p></template>
          <template v-else><div class="guided-example-heading"><h3>Example 4: Safe or risky?</h3><button type="button" class="guided-example-next" @click="nextExample">Back to first example ↺</button></div><div v-for="(scenario, index) in practiceScenarios" :key="index" class="guided-practice-card"><p>{{ scenario.question }}</p><div class="guided-practice-actions"><button type="button" :class="{ 'guided-answer-selected': practiceAnswers[index] === 'safe' }" :aria-pressed="practiceAnswers[index] === 'safe'" @click="answerScenario(index, 'safe')">Safe</button><button type="button" :class="{ 'guided-answer-selected': practiceAnswers[index] === 'risky' }" :aria-pressed="practiceAnswers[index] === 'risky'" @click="answerScenario(index, 'risky')">Risky</button></div><p v-if="practiceAnswers[index]" class="guided-practice-feedback" :class="practiceAnswers[index] === scenario.answer ? 'guided-feedback-correct' : 'guided-feedback-incorrect'" role="status">{{ practiceAnswers[index] === scenario.answer ? '✓ Correct! ' : '✕ Not quite. ' }}{{ scenario.explanation }}</p></div></template>
        </div><div class="guided-takeaway"><strong>Key takeaway</strong><p>Whether a message mentions a courier, a digital wallet, or a work platform, verify unexpected requests independently.</p></div></template>
        <template v-else-if="currentStep === 6"><h2 id="guided-current-step-heading">Protect your phone and your accounts</h2><p>Tap each check as you go.</p><div class="guided-checklist"><button v-for="(check, index) in safetyChecks" :key="index" type="button" class="guided-checklist-item" :class="{ 'guided-checklist-complete': completedSafetyChecks.includes(index) }" role="checkbox" :aria-checked="completedSafetyChecks.includes(index)" @click="toggleSafetyCheck(index)"><span class="guided-check-number">{{ completedSafetyChecks.includes(index) ? '✓' : index + 1 }}</span><span><strong>{{ check.title }}</strong><span class="guided-check-description">{{ check.description }}</span></span></button></div><p class="guided-check-counter" aria-live="polite">{{ completedSafetyChecks.length }} of {{ safetyChecks.length }} checks done</p><h3>Do's and Don'ts</h3><div class="guided-safety-comparison"><div v-for="(situation, index) in safetySituations" :key="index" class="guided-safety-situation"><h4 class="guided-situation-heading"><span class="guided-situation-number">{{ index + 1 }}</span>{{ situation.context }}</h4><div class="guided-comparison-grid"><div class="guided-information-card guided-danger-card"><strong class="guided-choice-label">✕ Don't do this</strong><p>{{ situation.unsafe }}</p></div><div class="guided-information-card guided-safe-card"><strong class="guided-choice-label">✓ Do this instead</strong><p>{{ situation.safe }}</p></div></div></div></div><div class="guided-information-card"><h3>How to report a suspicious message</h3><p>Use your messaging app's report/block feature and notify your employer's IT or security team if work access is involved. Some mobile networks support forwarding scam texts to <code>7726</code> (SPAM); availability depends on your carrier and country. Follow your mobile provider's current scam-reporting guidance.</p><p>If you already entered a password, shared an OTP, or approved an unexpected MFA request, contact the affected provider and your security team immediately using official channels.</p></div><div class="guided-takeaway"><strong>Key takeaway</strong><p>Don't follow unsolicited links, never disclose verification codes, and report suspicious activity quickly.</p></div></template>
        <template v-else><div class="guided-quiz-card"><h2 id="guided-current-step-heading">Test Your Knowledge</h2><p>Ready to check what you've learned? Take a randomized 10-question quiz drawn from a pool of 20, so a retake is never the same test twice.</p><div class="guided-quiz-actions"><router-link to="/quiz/module-3/question" class="guided-primary-button">Take a Quiz</router-link><button type="button" class="guided-secondary-button" @click="requestLeaveModule">Back to Homepage</button></div></div></template>
      </section><nav class="guided-step-navigation" aria-label="Previous and next lesson steps"><button v-if="currentStep > 1" type="button" class="guided-secondary-button" @click="goToStep(currentStep - 1)">← {{ lessonSteps[currentStep - 2].name }}</button><span v-else></span><button v-if="currentStep < lessonSteps.length" type="button" class="guided-primary-button" @click="goToStep(currentStep + 1)">Next: {{ lessonSteps[currentStep].name }} →</button></nav></div>
    </div>
    <button v-if="!sidebarVisible" type="button" class="guided-floating-menu-button" @click="sidebarVisible = true" aria-label="Show module menu">☰ Menu</button>
    <footer class="guided-module-references"><div class="guided-references-inner"><h2>References used in this module</h2><ul><li><strong>Video Source:</strong> <a href="https://www.youtube.com/watch?v=2n-1ZInI_vE" target="_blank" rel="noopener noreferrer">Federal Communications Commission (FCC) — Avoid the Temptation of Smishing Scams</a></li><li><strong>Reference Guide:</strong> <a href="https://www.fcc.gov/avoid-temptation-smishing-scams" target="_blank" rel="noopener noreferrer">FCC Consumer Guide — Avoid the Temptation of Smishing Scams</a></li></ul></div></footer>
    <div v-if="activeDefinition" class="guided-dialog-backdrop" @click.self="closeDefinition"><div ref="definitionDialog" class="guided-dialog guided-definition-dialog" role="dialog" aria-modal="true" aria-labelledby="guided-definition-title" aria-describedby="guided-definition-description" @keydown.esc="closeDefinition"><div class="guided-modal-icon guided-modal-icon-info" aria-hidden="true">?</div><p class="guided-modal-eyebrow">QUICK DEFINITION</p><h2 id="guided-definition-title">{{ activeDefinition }}</h2><p id="guided-definition-description">{{ glossaryDefinitions[activeDefinition] }}</p><div class="guided-modal-divider"></div><button type="button" class="guided-primary-button guided-modal-main-action" @click="closeDefinition">Got it ✓</button></div></div>
    <div v-if="showLeaveConfirmation" class="guided-dialog-backdrop" @click.self="showLeaveConfirmation = false"><div ref="leaveDialog" class="guided-dialog" role="dialog" aria-modal="true" aria-labelledby="guided-leave-title" aria-describedby="guided-leave-description" @keydown.esc="showLeaveConfirmation = false"><div class="guided-modal-icon guided-modal-icon-exit" aria-hidden="true">↗</div><p class="guided-modal-eyebrow">LEARNING PROGRESS</p><h2 id="guided-leave-title">Leave this module?</h2><p id="guided-leave-description">You're on step {{ currentStep }} of {{ lessonSteps.length }}. Your progress is saved, so you can pick up where you left off when you return.</p><div class="guided-dialog-actions"><button type="button" class="guided-secondary-button" @click="showLeaveConfirmation = false">Stay here</button><button type="button" class="guided-primary-button" @click="leaveModule">Leave module</button></div></div></div>
    <div v-if="showResumeConfirmation" class="guided-dialog-backdrop"><div ref="resumeDialog" class="guided-dialog" role="dialog" aria-modal="true" aria-labelledby="guided-resume-title" aria-describedby="guided-resume-description"><div class="guided-modal-icon guided-modal-icon-info" aria-hidden="true">↻</div><p class="guided-modal-eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2 id="guided-resume-title">Welcome back!</h2><p id="guided-resume-description">You previously reached Step {{ savedStep }} of {{ lessonSteps.length }}. What would you like to do?</p><div class="guided-resume-actions"><button type="button" class="guided-primary-button" @click="resumeLesson">Continue Progress</button><button type="button" class="guided-secondary-button" @click="restartLesson">Start Over</button><router-link to="/quiz/module-3/question" class="guided-secondary-button">Take/Retake Quiz</router-link></div></div></div>
  </main>
</template>
<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const lessonSteps = [{ id: 'start-here', name: 'Start here' }, { id: 'smishing-basics', name: 'Smishing basics' }, { id: 'common-scams', name: 'Common scam tactics' }, { id: 'red-flags', name: 'Red flags' }, { id: 'examples-and-practice', name: 'Examples & practice' }, { id: 'safety-checks', name: 'Safety checks' }, { id: 'quiz', name: 'Quiz' }]
const storageKey = 'se-aware-smishing-lesson-progress'
const currentStep = ref(1), savedStep = ref(1), completedSteps = ref([]), sidebarVisible = ref(true), showLeaveConfirmation = ref(false), showResumeConfirmation = ref(false)
const activeStepSection = ref(null), definitionDialog = ref(null), leaveDialog = ref(null), resumeDialog = ref(null)
const glossaryDefinitions = {
  smishing: 'Phishing through SMS text messages or messaging apps, often using deceptive links, calls, or requests for private information.',
  'sender ID spoofing': 'Manipulating the displayed sender name or number so a text appears to come from a trusted organization or person.',
  OTP: 'One-Time Password: a short-lived verification code used to approve sign-ins or transactions. Never share it with someone asking for it.',
  MFA: 'Multi-Factor Authentication: an extra identity check, such as an app approval or one-time code, beyond a password.',
  BYOD: 'Bring Your Own Device: using a personally owned phone or computer for work.',
  'shortened URL': 'A compact web link that redirects to another address, making the final destination less obvious.'
}
const activeDefinition = ref(null)
let definitionTrigger = null
function openDefinition(term) { definitionTrigger = document.activeElement; activeDefinition.value = term; nextTick(() => definitionDialog.value?.querySelector('button')?.focus()) }
function closeDefinition() { activeDefinition.value = null; nextTick(() => definitionTrigger?.focus()) }
const phoneRisks = [
  { title: 'It feels personal', description: 'Texts arrive alongside messages from friends, coworkers, and family. Familiarity can encourage quick responses.' },
  { title: 'The full link is hard to see', description: 'Small screens, shortened URLs, and in-app browsers can make the actual destination harder to inspect.' },
  { title: 'Work protection may be limited', description: 'A personal phone may not have the same web filtering or endpoint protection as a company-managed laptop.' }
]
const lures = [
  { id: 'parcel', title: 'The parcel: J&T, LBC, or another courier', message: '“Delivery failed. Confirm your address and pay a small rebooking fee.”', explanation: 'A fake tracking page may collect card details, personal information, or account credentials. Check the delivery using the official courier app or website you open yourself.' },
  { id: 'bank', title: 'The bank: BDO, BPI, or another provider', message: '“Unauthorized transfer detected. Verify your account immediately to prevent suspension.”', explanation: 'A frightening bank alert can push you toward a fake login portal. Check your account in the official banking app or contact the bank through its published channels.' },
  { id: 'otp', title: 'The OTP grab: GCash, Maya, or work login', message: '“Support: Reply with the 6-digit code sent to your device to secure your account.”', explanation: 'An attacker may trigger a real OTP by attempting a login. The code is genuine, but the request to share it is fraudulent. Never disclose it.' },
  { id: 'work', title: 'The work shift: IT or SSO access', message: '“Your remote access expires in 30 minutes. Sign in to avoid missing your shift.”', explanation: 'The attacker uses workplace urgency to steal passwords or MFA approvals through a fake sign-in page. Verify using your established company IT channel.' }
]
const redFlags = [
  { id: 'urgency', title: 'Threats and deadlines', example: '“Act within 15 minutes or your account will be blocked.”', explanation: 'Pressure to act immediately reduces the time you have to verify the message. A deadline is not proof that a claim is real.' },
  { id: 'link', title: 'Shortened or unfamiliar links', example: '“Check your parcel: bit.ly/…” or “account-check.example”', explanation: 'Shorteners conceal the destination, and lookalike domains imitate legitimate sites. A suspicious suffix such as .site or .xyz can be a clue, but no suffix alone proves fraud.' },
  { id: 'code', title: 'Requests for OTP or MFA codes', example: '“Read the 6-digit code aloud to confirm your identity.”', explanation: 'Verification codes protect your account. Someone asking you to give them the code may be attempting to take over your account.' },
  { id: 'sender', title: 'Unexpected sender or contact method', example: '“Bank Security” texts you from an unfamiliar mobile number.', explanation: 'A strange number or new chat account deserves caution. Even a familiar sender name may be spoofed, so verify independently.' }
]
const selectedLure = ref(null), selectedFlag = ref(null), selectedExampleClue = ref(null), walletChoice = ref(null), workChoice = ref(null), activeExampleTab = ref('delivery')
const deliveryClues = { fee: { title: 'Unexpected payment request', explanation: 'A tiny fee can make a fraudulent payment page feel harmless. Confirm delivery issues using the official courier tracking channel.' }, link: { title: 'Unverified website', explanation: 'The .example domain is deliberately nonfunctional in this simulation. Real scams often use lookalike websites; do not assume a link is official because the message mentions a familiar courier.' }, pressure: { title: 'Artificial deadline', explanation: 'A short deadline tries to stop you from checking your order independently.' } }
const exampleTabs = [{ id: 'delivery', label: 'Parcel SMS' }, { id: 'wallet', label: 'Wallet OTP' }, { id: 'work', label: 'Work access' }, { id: 'practice', label: 'Practice' }]
function selectExample(id) { activeExampleTab.value = id; selectedExampleClue.value = null; walletChoice.value = null; workChoice.value = null }
function nextExample() { const index = exampleTabs.findIndex(item => item.id === activeExampleTab.value); selectExample(exampleTabs[(index + 1) % exampleTabs.length].id) }
function handleTabKeydown(event, id) { const index = exampleTabs.findIndex(item => item.id === id); let next = index; if (event.key === 'ArrowRight') next = (index + 1) % exampleTabs.length; else if (event.key === 'ArrowLeft') next = (index - 1 + exampleTabs.length) % exampleTabs.length; else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = exampleTabs.length - 1; else return; event.preventDefault(); selectExample(exampleTabs[next].id); nextTick(() => document.getElementById(`guided-tab-${activeExampleTab.value}`)?.focus()) }
const practiceScenarios = [
  { question: 'A fake GCash support chat asks you to share an OTP to prevent account suspension.', answer: 'risky', explanation: 'Never share an OTP. Open the official wallet app independently to check account status.' },
  { question: 'You open the courier app yourself to check whether a parcel delivery really failed.', answer: 'safe', explanation: 'Using an independently opened official app avoids relying on a message link.' },
  { question: 'A bank alert appears under the same sender name as older legitimate messages, so you trust its link.', answer: 'risky', explanation: 'Sender names can be spoofed, and messages may appear in existing threads.' },
  { question: 'You contact your employer using the IT helpdesk address already listed in your work portal to check an urgent SMS.', answer: 'safe', explanation: 'Independent verification through a known work channel is a good security habit.' }
]
const practiceAnswers = ref({}), completedSafetyChecks = ref([])
function answerScenario(index, answer) { practiceAnswers.value = { ...practiceAnswers.value, [index]: answer } }
function toggleSafetyCheck(index) { completedSafetyChecks.value = completedSafetyChecks.value.includes(index) ? completedSafetyChecks.value.filter(item => item !== index) : [...completedSafetyChecks.value, index] }
const safetyChecks = [
  { title: 'Open the official app or site yourself.', description: 'Do not follow unsolicited SMS links. Use an app, bookmark, or website address you already trust.' },
  { title: 'Keep OTPs and MFA approvals private.', description: 'Never share verification codes or approve a sign-in you did not initiate. No support agent needs your OTP.' },
  { title: 'Verify and report suspicious messages.', description: 'Check unusual claims through known contact methods. Block/report scam messages and alert your company security team if work is involved.' }
]
const safetySituations = [
  { context: 'A parcel SMS asks for a small redelivery fee.', unsafe: 'Tap the link and enter your card details immediately.', safe: 'Check tracking in the courier’s official app or site.' },
  { context: 'A GCash- or Maya-style message requests your OTP.', unsafe: 'Reply with the code to “unlock” the account.', safe: 'Never share the code; open the official app and report the message.' },
  { context: 'A bank message threatens account suspension.', unsafe: 'Sign in using the message’s link.', safe: 'Open your banking app independently or call an official support number.' },
  { context: 'An unexpected IT text asks you to approve an MFA prompt.', unsafe: 'Approve it to avoid delaying your shift.', safe: 'Deny the unexpected prompt and notify your IT team through a known channel.' },
  { context: 'You already entered your password on a suspicious page.', unsafe: 'Ignore it because the page looked genuine.', safe: 'Immediately contact the provider and your security team, and secure the account using official channels.' }
]
function readSavedProgress() { try { const stored = JSON.parse(localStorage.getItem(storageKey) || 'null'); if (stored && Number.isInteger(stored.currentStep)) { savedStep.value = Math.max(1, Math.min(lessonSteps.length, stored.currentStep)); completedSteps.value = Array.isArray(stored.completedSteps) ? stored.completedSteps.filter(n => Number.isInteger(n) && n >= 1 && n <= lessonSteps.length) : []; return true } } catch {} return false }
function saveProgress() { try { localStorage.setItem(storageKey, JSON.stringify({ currentStep: currentStep.value, completedSteps: completedSteps.value })) } catch {} }
function updateUrlHash(step) { const hash = `#${lessonSteps[step - 1].id}`; history.replaceState(history.state, '', `${location.pathname}${location.search}${hash}`) }
async function goToStep(step) { if (step < 1 || step > lessonSteps.length) return; if (!completedSteps.value.includes(currentStep.value)) completedSteps.value.push(currentStep.value); currentStep.value = step; saveProgress(); updateUrlHash(step); await nextTick(); activeStepSection.value?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }) }
function requestLeaveModule() { showLeaveConfirmation.value = true; nextTick(() => leaveDialog.value?.querySelector('button')?.focus()) }
function leaveModule() { saveProgress(); showLeaveConfirmation.value = false; router.push('/') }
function resumeLesson() { showResumeConfirmation.value = false; currentStep.value = savedStep.value; updateUrlHash(currentStep.value) }
function restartLesson() { completedSteps.value = []; completedSafetyChecks.value = []; practiceAnswers.value = {}; currentStep.value = 1; showResumeConfirmation.value = false; saveProgress(); updateUrlHash(1) }
onMounted(() => { sidebarVisible.value = window.innerWidth > 900; const hasSaved = readSavedProgress(); const hashIndex = lessonSteps.findIndex(step => `#${step.id}` === window.location.hash); if (hashIndex >= 0) currentStep.value = hashIndex + 1; else if (hasSaved && savedStep.value > 1) { showResumeConfirmation.value = true; nextTick(() => resumeDialog.value?.querySelector('button')?.focus()) } })
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



/* Module 3 mobile-message simulation: visual-only, no active links */
.guided-phone-frame { max-width: 460px; margin: 18px auto; padding: 12px; border: 7px solid #1d2b42; border-radius: 30px; background: #f6f8fc; color: #17233a; box-shadow: 0 12px 28px rgba(0,0,0,.14); }
.guided-phone-top { text-align: center; color: #526176; font-size: 12px; font-weight: 700; padding: 8px 0 14px; border-bottom: 1px solid #dce3ed; }
.guided-phone-conversation { padding: 18px 10px 8px; line-height: 1.65; }
.guided-phone-conversation > strong { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-bottom: 18px; }
.guided-phone-conversation > p { background: #e6ebf2; border-radius: 16px 16px 16px 4px; padding: 12px; margin: 10px 0; }
.guided-phone-conversation .guided-inspection-target { margin: 6px 0; }
.guided-phone-conversation code { color: #1756a5; background: #e8f0ff; }
.guided-quiz-card .guided-secondary-button { background: #fff; color: #0b2545; border: 1px solid #c8d3e3; }
.guided-quiz-card .guided-secondary-button:hover { background: #eaeff6; color: #0b2545; }
.guided-quiz-card .guided-secondary-button:focus-visible { outline: 3px solid #f5a623; outline-offset: 3px; }
.guided-lesson-step { scroll-margin-top: 105px; }
@media(max-width:620px) { .guided-phone-frame { border-width: 5px; border-radius: 23px; padding: 7px; } }

</style>
