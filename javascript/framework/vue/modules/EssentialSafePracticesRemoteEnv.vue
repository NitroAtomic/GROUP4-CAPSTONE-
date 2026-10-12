<template>
<main class="guided-module-page">
<header class="guided-module-header"><div class="guided-module-container"><nav aria-label="Breadcrumb"><button type="button" class="guided-home-link" @click="requestLeaveModule">⌂ Home</button></nav><h1>Safe Practices for Remote Work</h1><div class="guided-module-metadata"><span>Module 6 of 6</span><span class="guided-module-badge">FREE MODULE</span><span>17–21 min total (includes video)</span></div></div></header>
<div class="guided-module-progress" role="group" aria-label="Safe practices module progress"><div class="guided-progress-container"><div class="guided-progress-heading"><span class="guided-progress-title">📖 Safe Practices Module Progress</span><span class="guided-progress-step" aria-live="polite">Step {{ currentStep }} of {{ lessonSteps.length }}</span></div><div class="guided-progress-track" role="progressbar" :aria-valuenow="currentStep" :aria-valuemin="1" :aria-valuemax="lessonSteps.length" :aria-valuetext="`Step ${currentStep} of ${lessonSteps.length}`"><div class="guided-progress-fill" :style="{width: `${currentStep / lessonSteps.length * 100}%`}"></div></div></div></div>
<div class="guided-module-layout" :class="{'guided-sidebar-hidden': !sidebarVisible}"><aside v-if="sidebarVisible" class="guided-module-sidebar" aria-label="Lesson navigation"><div class="guided-sidebar-heading"><strong>IN THIS MODULE</strong><span class="guided-module-badge">FREE</span></div><p class="guided-sidebar-description">17–21 min total (includes video) · 8 short steps</p><nav aria-label="Module steps"><button v-for="(step,index) in lessonSteps" :key="step.id" type="button" class="guided-step-link" :class="{'guided-step-active': currentStep === index + 1}" :aria-current="currentStep === index + 1 ? 'step' : undefined" @click="goToStep(index+1)"><span>{{ String(index+1).padStart(2,'0') }} · {{ step.name }}</span><span v-if="completedSteps.includes(index+1)" class="guided-completed-mark" aria-label="Visited">✓</span></button></nav><div class="guided-sidebar-progress"><p>Step {{ currentStep }} of {{ lessonSteps.length }}</p><div class="guided-sidebar-progress-track"><div class="guided-sidebar-progress-fill" :style="{width: `${currentStep / lessonSteps.length * 100}%`}"></div></div></div><button type="button" class="guided-hide-menu-button" @click="sidebarVisible=false">‹ Hide menu</button></aside>
<div class="guided-module-content"><section :key="currentStep" ref="activeStepSection" class="guided-lesson-step" aria-labelledby="guided-current-step-heading"><p class="guided-step-eyebrow">STEP {{ currentStep }} OF {{ lessonSteps.length }} · {{ lessonSteps[currentStep-1].name.toUpperCase() }}</p>
<template v-if="currentStep === 1"><div class="guided-introduction-card"><p class="guided-audience"><strong>Who this is for:</strong> everyone working remotely — distributed employees, freelancers, and hybrid staff.</p><h2 id="guided-current-step-heading">By the end of this module you can:</h2><ul class="guided-learning-outcomes"><li>Choose stronger <button type="button" class="guided-definition-term" @click="openDefinition('MFA')">multi-factor authentication (MFA)</button>, including authenticator apps and phishing-resistant security keys.</li><li>Protect your home Wi-Fi, router, and <button type="button" class="guided-definition-term" @click="openDefinition('BYOD')">BYOD</button> devices.</li><li>Verify unexpected requests through a separate, trusted channel.</li><li>Practice updating, password management, and prompt incident reporting.</li></ul><div class="guided-helpful-tip"><span class="guided-helpful-tip-icon">💡</span><div class="guided-helpful-tip-content"><strong>Helpful tip</strong><p>Click dotted-underlined terms to see simple explanations. This final module is a practical reference, not a quiz.</p></div></div><div class="guided-introduction-footer"><h3>You'll cover:</h3><div class="guided-topic-tags"><span>Account security</span><span>Home Wi-Fi</span><span>Trusted verification</span><span>Incident response</span></div><button type="button" class="guided-primary-button" @click="goToStep(2)">Start the lesson →</button></div></div></template>
<template v-else-if="currentStep === 2">
<h2 id="guided-current-step-heading">Cybersecurity for remote work — Video</h2>
<p>Watch this short overview of the essential habits that help keep remote workers, their accounts, and company information secure.</p>
<div class="guided-video-lesson">
  <div class="guided-video-heading-row">
    <h3>Cybersecurity for Remote Work: 10 Best Practices to Stay Safe Online</h3>
    <span class="guided-video-duration">Watch time: 6 min 58 sec</span>
  </div>

  <p class="guided-video-prompt">
    Watch the video, then review the main practices below before moving on.
  </p>

  <div class="guided-video-frame">
    <iframe
      src="https://www.youtube-nocookie.com/embed/7Ps6GTQoFdQ"
      title="Cybersecurity for Remote Work: 10 Best Practices to Stay Safe Online"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
  </div>

  <div class="guided-video-summary">
    <strong>Quick Summary</strong>
    <p>
      Remote work introduces cybersecurity risks that require extra
      precautions to protect sensitive information. Using strong
      authentication and multi-factor authentication (MFA), connecting
      through a VPN when required, and keeping software updated help
      strengthen security. Remote workers should also secure their home
      networks, use company-approved devices, stay alert to phishing
      attacks, and share files only through trusted platforms.
      Maintaining ongoing cybersecurity awareness helps reduce threats
      and creates a safer remote working environment.
    </p>
  </div>

  <p class="guided-video-attribution">
    Video:
    <a
      href="https://www.youtube.com/watch?v=7Ps6GTQoFdQ"
      target="_blank"
      rel="noopener noreferrer"
    >
      Cybersecurity for Remote Work: 10 Best Practices to Stay Safe Online on YouTube
    </a>
  </p>
</div>

<div class="guided-takeaway">
  <strong>Key takeaway</strong>
  <p>
    Remote security depends on layers of protection: secure accounts
    and devices, cautious communication, approved work tools,
    and consistent awareness.
  </p>
</div>
</template>
<template v-else-if="currentStep === 3"><h2 id="guided-current-step-heading">Protect your accounts with stronger MFA</h2><p>Remote work relies on accounts accessible from many locations. Passwords alone are not enough, but not all MFA methods provide the same protection.</p><div class="guided-comparison-grid"><div v-for="method in mfaMethods" :key="method.id" class="guided-information-card" :class="method.id==='sms' ? 'guided-warning-card' : 'guided-safe-card'"><h3>{{ method.name }}</h3><p>{{ method.summary }}</p><button type="button" class="guided-example-next" :aria-pressed="selectedMfa===method.id" @click="selectedMfa=method.id">Why it matters ⊕</button></div></div><div class="guided-clue-explanation" role="status" aria-live="polite"><template v-if="selectedMfa"><h4>{{ mfaMethods.find(item=>item.id===selectedMfa)?.name }}</h4><p>{{ mfaMethods.find(item=>item.id===selectedMfa)?.detail }}</p></template><p v-else>Select an MFA method to learn more.</p></div><div class="guided-takeaway"><strong>Key takeaway</strong><p>Prefer phishing-resistant passkeys or FIDO2 security keys when available. Authenticator codes are usually safer than SMS against SIM-swapping, but can still be phished. Never approve an unexpected login prompt.</p></div></template>
<template v-else-if="currentStep === 4"><h2 id="guided-current-step-heading">Secure your home network and devices</h2><p>Home Wi-Fi and personal devices need their own safeguards. Select each area to see what to check.</p><div class="guided-comparison-grid"><div v-for="item in networkAreas" :key="item.id" class="guided-information-card"><h3>{{ item.title }}</h3><p>{{ item.summary }}</p><button type="button" class="guided-example-next" :aria-pressed="selectedNetwork===item.id" @click="selectedNetwork=item.id">Inspect this safeguard ⊕</button></div></div><div class="guided-clue-explanation" role="status" aria-live="polite"><template v-if="selectedNetwork"><h4>{{ networkAreas.find(item=>item.id===selectedNetwork)?.title }}</h4><p>{{ networkAreas.find(item=>item.id===selectedNetwork)?.detail }}</p></template><p v-else>Select a safeguard above.</p></div><div class="guided-information-card guided-warning-card"><h3>Important Wi-Fi distinction</h3><p>For most home routers, use <button type="button" class="guided-definition-term" @click="openDefinition('WPA3')">WPA3-Personal</button> or WPA2-AES if WPA3 is unavailable. WPA2-Enterprise is generally for managed business networks, not ordinary home routers. Put untrusted smart-home devices on a separate guest or IoT network where isolation is supported; keep work devices on the trusted network.</p></div><div class="guided-takeaway"><strong>Key takeaway</strong><p>Change default router administrator credentials, install updates, use strong Wi-Fi encryption, and separate less-trusted devices.</p></div></template>
<template v-else-if="currentStep === 5"><h2 id="guided-current-step-heading">Verify unexpected requests independently</h2><p>Any surprise request involving money, passwords, account access, or sensitive files deserves a second check using contact information you already trust.</p><div class="guided-plain-language-intro"><strong>Example:</strong> A client emails revised payment details for your next invoice. The message looks familiar, but the bank account is new. Call the client using the number in your existing contract or saved directory — not the number supplied in that message.</div><div class="guided-comparison-grid"><div class="guided-information-card guided-danger-card"><h3>✕ Trust the message</h3><p>Reply to the same email, call the number printed on the new invoice, or rush because the deadline is today.</p></div><div class="guided-information-card guided-safe-card"><h3>✓ Verify out of band</h3><p>Use an established phone number, official app, or authenticated work channel to confirm the request.</p></div></div><h3>Warning signs worth checking</h3><div class="guided-comparison-grid"><div v-for="flag in warningSigns" :key="flag.id" class="guided-information-card guided-warning-card"><h3>{{ flag.title }}</h3><p>{{ flag.summary }}</p><button type="button" class="guided-example-next" @click="selectedFlag=flag.id">Why is this risky? ⊕</button></div></div><div class="guided-clue-explanation" role="status" aria-live="polite"><template v-if="selectedFlag"><h4>{{ warningSigns.find(item=>item.id===selectedFlag)?.title }}</h4><p>{{ warningSigns.find(item=>item.id===selectedFlag)?.detail }}</p></template><p v-else>Select a warning sign to reveal the risk.</p></div></template>
<template v-else-if="currentStep === 6"><h2 id="guided-current-step-heading">Practice making safer choices</h2><p>These fictional situations use everyday services and workplace tools. Choose the safer response and see why.</p><div class="guided-example-tabs" role="tablist" aria-label="Practice topics"><button v-for="tab in exampleTabs" :key="tab.id" :id="`guided-tab-${tab.id}`" type="button" role="tab" :aria-selected="activeExampleTab===tab.id" :aria-controls="`guided-panel-${tab.id}`" :tabindex="activeExampleTab===tab.id?0:-1" :class="{'guided-tab-selected':activeExampleTab===tab.id}" @click="activeExampleTab=tab.id" @keydown="handleTabKeydown($event,tab.id)">{{ tab.label }}</button></div><div :id="`guided-panel-${activeExampleTab}`" :aria-labelledby="`guided-tab-${activeExampleTab}`" role="tabpanel" tabindex="0" class="guided-example-panel"><template v-if="activeExampleTab==='payment'"><div class="guided-example-heading"><h3>Example 1: New payment details</h3><button type="button" class="guided-example-next" @click="nextExample">Next example →</button></div><div class="guided-fake-message"><div class="guided-fake-message-header">Client email <span class="guided-mock-badge">Fictional training example</span></div><div class="guided-fake-message-body"><p>“Hi, please update our invoice payment account before 3 PM. We changed banks. Call the number in this email if you need to confirm.”</p></div></div><div class="guided-practice-actions"><button type="button" :class="{'guided-answer-selected':scenarioChoices.payment==='reply'}" @click="scenarioChoices.payment='reply'">Reply or call the new number</button><button type="button" :class="{'guided-answer-selected':scenarioChoices.payment==='verify'}" @click="scenarioChoices.payment='verify'">Call the existing verified number</button></div><p v-if="scenarioChoices.payment" class="guided-practice-feedback" :class="scenarioChoices.payment==='verify'?'guided-feedback-correct':'guided-feedback-incorrect'" role="status">{{ scenarioChoices.payment==='verify'?'✓ Correct. ':'✕ Risky choice. ' }}Verify changed bank details using contact information from before the request.</p></template><template v-else-if="activeExampleTab==='mfa'"><div class="guided-example-heading"><h3>Example 2: An unexpected MFA prompt</h3><button type="button" class="guided-example-next" @click="nextExample">Next example →</button></div><div class="guided-fake-message"><div class="guided-fake-message-header">Login notification <span class="guided-mock-badge">Fictional training example</span></div><div class="guided-fake-message-body"><p>“Microsoft 365 sign-in approval requested.” You are not signing in. Someone claiming to be IT messages: “Approve this to fix a sync error.”</p></div></div><div class="guided-practice-actions"><button type="button" :class="{'guided-answer-selected':scenarioChoices.mfa==='approve'}" @click="scenarioChoices.mfa='approve'">Approve the request</button><button type="button" :class="{'guided-answer-selected':scenarioChoices.mfa==='deny'}" @click="scenarioChoices.mfa='deny'">Deny and report</button></div><p v-if="scenarioChoices.mfa" class="guided-practice-feedback" :class="scenarioChoices.mfa==='deny'?'guided-feedback-correct':'guided-feedback-incorrect'" role="status">{{ scenarioChoices.mfa==='deny'?'✓ Correct. ':'✕ Risky choice. ' }}An unexpected MFA prompt may mean someone has your password. Deny it and contact your security team.</p></template><template v-else><div class="guided-example-heading"><h3>Example 3: Safe or risky?</h3><button type="button" class="guided-example-next" @click="nextExample">Back to first example ↺</button></div><div v-for="(scenario,index) in practiceScenarios" :key="index" class="guided-practice-card"><p>{{ scenario.question }}</p><div class="guided-practice-actions"><button type="button" :aria-pressed="practiceAnswers[index]==='safe'" :class="{'guided-answer-selected':practiceAnswers[index]==='safe'}" @click="answerScenario(index,'safe')">Safe</button><button type="button" :aria-pressed="practiceAnswers[index]==='risky'" :class="{'guided-answer-selected':practiceAnswers[index]==='risky'}" @click="answerScenario(index,'risky')">Risky</button></div><p v-if="practiceAnswers[index]" class="guided-practice-feedback" :class="practiceAnswers[index]===scenario.answer?'guided-feedback-correct':'guided-feedback-incorrect'" role="status">{{ practiceAnswers[index]===scenario.answer?'✓ Correct! ':'✕ Not quite. ' }}{{ scenario.explanation }}</p></div></template></div><div class="guided-takeaway"><strong>Key takeaway</strong><p>Do not let urgency or familiarity replace independent verification.</p></div></template>
<template v-else-if="currentStep === 7"><h2 id="guided-current-step-heading">Your everyday safety checklist</h2><p>Mark the practices you already follow, or use this list to plan what to improve.</p><div class="guided-checklist"><button v-for="(check,index) in safetyChecks" :key="index" type="button" class="guided-checklist-item" :class="{'guided-checklist-complete':completedSafetyChecks.includes(index)}" role="checkbox" :aria-checked="completedSafetyChecks.includes(index)" @click="toggleSafetyCheck(index)"><span class="guided-check-number">{{completedSafetyChecks.includes(index)?'✓':index+1}}</span><span><strong>{{check.title}}</strong><span class="guided-check-description">{{check.description}}</span></span></button></div><p class="guided-check-counter" aria-live="polite">{{completedSafetyChecks.length}} of {{safetyChecks.length}} checks marked</p><h3>If something already happened</h3><div class="guided-information-card guided-warning-card"><p>If you entered credentials on a suspicious site, approved an unexpected MFA request, or opened an untrusted file, <strong>report it immediately</strong> using your organization's security process.</p><p>Follow your IT team's incident instructions. If you suspect active malware or remote control, they may direct you to disconnect the affected device from the network. From a separate trusted device, change compromised passwords and revoke sessions as instructed. Preserve relevant messages and evidence.</p></div><div class="guided-takeaway"><strong>Key takeaway</strong><p>Early reporting helps your security team contain an incident. Do not wait until you are certain an attack succeeded.</p></div></template>
<template v-else><div class="guided-quiz-card"><h2 id="guided-current-step-heading">You've finished the modules!</h2><p>This is the last of the six learning modules. There is <strong>no quiz for Module 6</strong> — keep it as a reference whenever you need a safety refresher.</p><div class="guided-quiz-actions"><router-link to="/dashboard" class="guided-primary-button">See your progress</router-link><button type="button" class="guided-secondary-button" @click="requestLeaveModule">Back to Homepage</button></div></div></template>
</section><nav class="guided-step-navigation" aria-label="Previous and next lesson steps"><button v-if="currentStep>1" type="button" class="guided-secondary-button" @click="goToStep(currentStep-1)">← {{lessonSteps[currentStep-2].name}}</button><span v-else></span><button v-if="currentStep<lessonSteps.length" type="button" class="guided-primary-button" @click="goToStep(currentStep+1)">Next: {{lessonSteps[currentStep].name}} →</button></nav></div></div><button v-if="!sidebarVisible" type="button" class="guided-floating-menu-button" @click="sidebarVisible=true" aria-label="Show module menu">☰ Menu</button>
<footer class="guided-module-references"><div class="guided-references-inner"><h2>References used in this module</h2><ul><li><strong>Video Source:</strong> <a href="https://www.youtube.com/watch?v=7Ps6GTQoFdQ" target="_blank" rel="noopener noreferrer">Cyber Security Essentials — “Cybersecurity for Remote Work: 10 Best Practices to Stay Safe Online” on YouTube</a></li><li><strong>Reference Guide:</strong> <a href="https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-46r2.pdf" target="_blank" rel="noopener noreferrer">NIST SP 800-46 Rev. 2 — Guide to Enterprise Telework, Remote Access, and BYOD Security</a></li></ul></div></footer>
<div v-if="activeDefinition" class="guided-dialog-backdrop" @click.self="closeDefinition"><div ref="definitionDialog" class="guided-dialog guided-definition-dialog" role="dialog" aria-modal="true" aria-labelledby="guided-definition-title" @keydown.esc="closeDefinition"><div class="guided-modal-icon">?</div><p class="guided-modal-eyebrow">QUICK DEFINITION</p><h2 id="guided-definition-title">{{activeDefinition}}</h2><p>{{glossaryDefinitions[activeDefinition]}}</p><div class="guided-modal-divider"></div><button type="button" class="guided-primary-button guided-modal-main-action" @click="closeDefinition">Got it ✓</button></div></div>
<div v-if="showLeaveConfirmation" class="guided-dialog-backdrop" @click.self="showLeaveConfirmation=false"><div ref="leaveDialog" class="guided-dialog" role="dialog" aria-modal="true" aria-labelledby="guided-leave-title" @keydown.esc="showLeaveConfirmation=false"><div class="guided-modal-icon guided-modal-icon-exit">↗</div><p class="guided-modal-eyebrow">LEARNING PROGRESS</p><h2 id="guided-leave-title">Leave this module?</h2><p>You're on step {{currentStep}} of {{lessonSteps.length}}. Your progress is saved, so you can pick up where you left off.</p><div class="guided-dialog-actions"><button type="button" class="guided-secondary-button" @click="showLeaveConfirmation=false">Stay here</button><button type="button" class="guided-primary-button" @click="leaveModule">Leave module</button></div></div></div>
<div v-if="showResumeConfirmation" class="guided-dialog-backdrop"><div ref="resumeDialog" class="guided-dialog" role="dialog" aria-modal="true" aria-labelledby="guided-resume-title"><div class="guided-modal-icon">↻</div><p class="guided-modal-eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2 id="guided-resume-title">Welcome back!</h2><p>You previously reached Step {{savedStep}} of {{lessonSteps.length}}. What would you like to do?</p><div class="guided-resume-actions"><button type="button" class="guided-primary-button" @click="resumeLesson">Continue Progress</button><button type="button" class="guided-secondary-button" @click="restartLesson">Start Over</button><router-link to="/dashboard" class="guided-secondary-button">See your progress</router-link></div></div></div>
</main>
</template>
<script setup>
import {nextTick,onMounted,ref} from 'vue'
import {useRouter} from 'vue-router'
const router=useRouter()
const lessonSteps=[{id:'start-here',name:'Start here'},{id:'remote-cybersecurity-video',name:'Cybersecurity video'},{id:'stronger-mfa',name:'Stronger MFA'},{id:'home-and-device-security',name:'Home & device security'},{id:'independent-verification',name:'Verify requests'},{id:'examples-and-practice',name:'Examples & practice'},{id:'safety-checks',name:'Safety checks'},{id:'complete',name:'Finish module'}]
const storageKey='se-aware-safe-practices-lesson-progress'
const currentStep=ref(1),savedStep=ref(1),completedSteps=ref([]),sidebarVisible=ref(true),showLeaveConfirmation=ref(false),showResumeConfirmation=ref(false),activeStepSection=ref(null),leaveDialog=ref(null),resumeDialog=ref(null),definitionDialog=ref(null),activeDefinition=ref(null)
let definitionTrigger=null
const glossaryDefinitions={MFA:'Multi-factor authentication: requiring another proof of identity in addition to a password.',BYOD:'Bring Your Own Device: using a personally owned phone, tablet, or computer for work.',WPA3:'A modern Wi-Fi security standard that protects wireless traffic when configured with a strong network password.',TOTP:'Time-based One-Time Password: a temporary login code generated by an authenticator app.',FIDO2:'An authentication standard supporting phishing-resistant security keys and passkeys.'}
function openDefinition(term){definitionTrigger=document.activeElement;activeDefinition.value=term;nextTick(()=>definitionDialog.value?.querySelector('button')?.focus())}
function closeDefinition(){activeDefinition.value=null;nextTick(()=>definitionTrigger?.focus())}
const mfaMethods=[{id:'sms',name:'SMS codes',summary:'Better than a password alone, but vulnerable to SIM-swapping and message-based scams.',detail:'Attackers may intercept a phone number through SIM-swapping or trick you into giving up a real code. Use SMS when it is the only available option, but upgrade when you can.'},{id:'totp',name:'Authenticator apps (TOTP)',summary:'Apps such as Google Authenticator, Microsoft Authenticator, and 1Password generate codes without SMS.',detail:'App-generated codes avoid phone-network interception but can still be stolen through fake login pages. Check the website before entering a code.'},{id:'fido',name:'FIDO2 keys and passkeys',summary:'Phishing-resistant sign-in using a hardware key or supported passkey.',detail:'FIDO2 credentials are bound to the legitimate site, helping block lookalike phishing pages. Use these wherever supported, with safe recovery methods.'}]
const networkAreas=[{id:'router',title:'Router administrator login',summary:'Replace default credentials and update router firmware.',detail:'Set a unique administrator password, disable remote administration unless required, and check for firmware updates.'},{id:'wifi',title:'Wi-Fi encryption',summary:'Use WPA3-Personal or WPA2-AES with a strong Wi-Fi password.',detail:'Avoid obsolete WEP and older WPA modes. WPA2-Enterprise is intended for managed deployments and usually is not needed at home.'},{id:'iot',title:'Guest and IoT isolation',summary:'Separate smart TVs, cameras, and other less-trusted devices.',detail:'If your router supports guest-network isolation, place IoT devices there and keep work devices on the trusted network. A guest network without isolation may not offer meaningful separation.'},{id:'updates',title:'Devices and software',summary:'Enable updates for operating systems, browsers, and security tools.',detail:'Use screen locks, full-disk encryption where supported, approved security software, and regular updates. Follow employer rules for personal devices.'}]
const warningSigns=[{id:'mfa',title:'Unexpected MFA approval',summary:'A login prompt appears when you are not signing in.',detail:'Someone may know your password or be trying to trick you into authorizing access. Deny the request and report it.'},{id:'router',title:'Default router credentials',summary:'The router still uses a factory administrator password.',detail:'Common default passwords are widely known. Change the admin password and keep router firmware current.'},{id:'network',title:'Unsegmented smart-home devices',summary:'Unpatched cameras and work devices share the same unrestricted network.',detail:'Separate less-trusted devices using an isolated guest/IoT network when supported.'},{id:'updates',title:'Delayed security patches',summary:'Important operating system and browser updates remain pending.',detail:'Known vulnerabilities can be exploited after fixes become available. Install security updates promptly.'}]
const exampleTabs=[{id:'payment',label:'Payment request'},{id:'mfa',label:'MFA prompt'},{id:'practice',label:'Practice'}]
const activeExampleTab=ref('payment'),scenarioChoices=ref({}),practiceAnswers=ref({}),selectedMfa=ref(null),selectedNetwork=ref(null),selectedFlag=ref(null),completedSafetyChecks=ref([])
const practiceScenarios=[{question:'You receive a new invoice with changed bank details and confirm them by calling a number from an older signed contract.',answer:'safe',explanation:'A previously verified contact method reduces the chance of following an impostor’s instructions.'},{question:'You approve an MFA prompt because a caller claiming to be IT says it will stop repeated notifications.',answer:'risky',explanation:'Unexpected login prompts should be denied and reported, not approved.'},{question:'You enable automatic security updates for your work-approved laptop and browser.',answer:'safe',explanation:'Prompt updates reduce exposure to known vulnerabilities.'},{question:'You keep your router’s default admin password because your Wi-Fi password is strong.',answer:'risky',explanation:'The router administrator account needs its own unique password.'},{question:'A stranger claiming to be support asks you to install AnyDesk; you verify through your official helpdesk first.',answer:'safe',explanation:'Independent verification and company-approved support processes protect against remote-access scams.'}]
const safetyChecks=[{title:'Use the strongest MFA available.',description:'Prefer passkeys or FIDO2 keys; use an authenticator app when phishing-resistant options are unavailable.'},{title:'Use unique passwords and a password manager.',description:'Avoid password reuse, and secure the password manager with strong authentication.'},{title:'Secure your home router and Wi-Fi.',description:'Change default administrator credentials and use WPA3-Personal or WPA2-AES.'},{title:'Separate untrusted smart-home devices.',description:'Use an isolated guest or IoT network where your router supports it.'},{title:'Keep software and devices updated.',description:'Install operating system, browser, app, and router security updates.'},{title:'Verify sensitive requests independently.',description:'Confirm changes to payments, credentials, and access using a previously trusted channel.'},{title:'Know how to report incidents.',description:'Save your security team’s contact information and report suspected compromise promptly.'}]
function handleTabKeydown(event,id){const i=exampleTabs.findIndex(x=>x.id===id);let n=i;if(event.key==='ArrowRight')n=(i+1)%exampleTabs.length;else if(event.key==='ArrowLeft')n=(i-1+exampleTabs.length)%exampleTabs.length;else if(event.key==='Home')n=0;else if(event.key==='End')n=exampleTabs.length-1;else return;event.preventDefault();activeExampleTab.value=exampleTabs[n].id;nextTick(()=>document.getElementById(`guided-tab-${activeExampleTab.value}`)?.focus())}
function nextExample(){const i=exampleTabs.findIndex(x=>x.id===activeExampleTab.value);activeExampleTab.value=exampleTabs[(i+1)%exampleTabs.length].id}
function answerScenario(i,answer){practiceAnswers.value={...practiceAnswers.value,[i]:answer}}
function toggleSafetyCheck(i){completedSafetyChecks.value=completedSafetyChecks.value.includes(i)?completedSafetyChecks.value.filter(x=>x!==i):[...completedSafetyChecks.value,i]}
function saveProgress(){try{localStorage.setItem(storageKey,JSON.stringify({currentStep:currentStep.value,completedSteps:completedSteps.value,stepCount:lessonSteps.length}))}catch{}}
function readSavedProgress(){try{const x=JSON.parse(localStorage.getItem(storageKey)||'null');if(x&&Number.isInteger(x.currentStep)){const migrate=n=>x.stepCount===8?n:(n>=2?n+1:n);savedStep.value=Math.max(1,Math.min(lessonSteps.length,migrate(x.currentStep)));completedSteps.value=Array.isArray(x.completedSteps)?x.completedSteps.map(migrate).filter(i=>Number.isInteger(i)&&i>=1&&i<=lessonSteps.length):[];if(x.stepCount!==8)localStorage.setItem(storageKey,JSON.stringify({currentStep:savedStep.value,completedSteps:completedSteps.value,stepCount:8}));return true}}catch{}return false}
function updateUrlHash(n){history.replaceState(history.state,'',`${location.pathname}${location.search}#${lessonSteps[n-1].id}`)}
async function goToStep(n){if(n<1||n>lessonSteps.length)return;if(!completedSteps.value.includes(currentStep.value))completedSteps.value.push(currentStep.value);currentStep.value=n;saveProgress();updateUrlHash(n);await nextTick();activeStepSection.value?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}
function requestLeaveModule(){showLeaveConfirmation.value=true;nextTick(()=>leaveDialog.value?.querySelector('button')?.focus())}
function leaveModule(){saveProgress();showLeaveConfirmation.value=false;router.push('/')}
function resumeLesson(){showResumeConfirmation.value=false;currentStep.value=savedStep.value;updateUrlHash(currentStep.value)}
function restartLesson(){completedSteps.value=[];completedSafetyChecks.value=[];practiceAnswers.value={};scenarioChoices.value={};currentStep.value=1;showResumeConfirmation.value=false;saveProgress();updateUrlHash(1)}
onMounted(()=>{sidebarVisible.value=window.innerWidth>900;const saved=readSavedProgress();const hash=lessonSteps.findIndex(s=>`#${s.id}`===window.location.hash);if(hash>=0)currentStep.value=hash+1;else if(saved&&savedStep.value>1){showResumeConfirmation.value=true;nextTick(()=>resumeDialog.value?.querySelector('button')?.focus())}})
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



/* Video lesson: consistent with the other awareness modules */
.guided-video-lesson { margin: 28px 0 12px; padding: clamp(18px, 3vw, 26px); border: 1px solid var(--guided-border); border-radius: 16px; background: var(--guided-surface); }
.guided-video-heading-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px 18px; margin-bottom: 10px; }
.guided-lesson-step .guided-video-heading-row h3 { margin: 0; color: var(--heading); font-size: clamp(18px, 2.1vw, 21px); font-weight: 750; }
.guided-video-duration { display: inline-flex; align-items: center; padding: 6px 11px; border: 1px solid var(--guided-border); border-radius: 999px; color: var(--muted); font-size: 12px; font-weight: 650; white-space: nowrap; }
.guided-lesson-step .guided-video-prompt { color: var(--muted); font-size: 14px; margin: 0 0 18px; }
.guided-video-frame { width: 100%; aspect-ratio: 16 / 9; overflow: hidden; border-radius: 12px; background: #0b2545; }
.guided-video-frame iframe { display: block; width: 100%; height: 100%; border: 0; }
.guided-video-summary { margin-top: 18px; padding: 17px 19px; border-left: 4px solid var(--teal, #2bb3a6); border-radius: 10px; background: var(--surface-2); }
.guided-video-summary strong { color: var(--heading); font-size: 15px; }
.guided-video-summary ul { margin: 10px 0 0; padding-left: 22px; }
.guided-lesson-step .guided-video-summary li { font-size: 14px; line-height: 1.7; margin-bottom: 5px; }
.guided-lesson-step .guided-video-attribution { margin: 12px 0 0; font-size: 12px; color: var(--muted); }
.guided-video-attribution a { color: var(--accent-text, #2bb3a6); text-decoration: underline; text-underline-offset: 3px; }
@media (max-width: 620px) { .guided-video-lesson { padding: 16px; } }
</style>
