import { useAuthStore } from '../../stores/auth.js'
import { apiFetch } from '../../lib/api.js'

const MODULES = {
  'invoice-scams': {
    title: 'Invoice and Payment Scams',
    intro: 'How attackers redirect a real payment to their own account — by changing bank details on an invoice, or a payroll record — and the two checks that stop it.',
  },
  'client-data': {
    title: 'Secure Client Data Handling',
    intro: 'You hold the client files, the passwords and the access. The usual way all three get exposed is someone posing as your boss — here is how that works, and the one check that stops it whatever rank is on the message.',
  },
  'client-impersonation': {
    title: 'Client Impersonation',
    intro: 'How a fake client takes your login, your work, or your money — and the checks that keep a new project from costing you.',
  },
  'fake-recruiters': {
    title: 'Fake Job and Recruiter Offers',
    intro: 'How a fake recruiter collects your passport scan, your bank details and an upfront payment — and what a real employer never asks for.',
  },
}

// BEGIN PREMIUM HELPERS
// These browser-only helpers are also embedded by the local preview script.
// No paid lesson text is bundled in frontend JavaScript.
function parsePremiumLesson(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const references = []
  doc.querySelectorAll('.curated-resources').forEach(node => {
    references.push(node.outerHTML)
    node.remove()
  })
  const steps = []
  const add = (label, content) => steps.push({ label, html: content })
  const title = node => node.querySelector('h2,h3,h4')?.textContent.trim() || 'Lesson'
  // Explicit step wrappers let curated lessons choose their own sequence.
  // Legacy lessons are split by their existing sections/articles without dropping nodes.
  let intro = ''
  const flushIntro = () => {
    if (intro.trim()) { add('Start here', intro); intro = '' }
  }
  Array.from(doc.body.childNodes).forEach(node => {
    if (node.nodeType === 3) {
      if (node.textContent.trim()) { flushIntro(); add('Reading', node.textContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')) }
      return
    }
    if (node.nodeType !== 1) return
    if (node.hasAttribute('data-lesson-step')) {
      flushIntro()
      add(node.dataset.stepLabel || title(node), node.outerHTML)
    } else if (node.matches('.module-key-details,.learning-objectives')) {
      intro += node.outerHTML
    } else if (node.matches('.module-awareness-guide') && node.querySelector(':scope > article')) {
      flushIntro()
      let reading = ''
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === 1 && child.matches('article')) {
          add(title(child), '<section class="module-awareness-guide">' + reading + child.outerHTML + '</section>')
          reading = ''
        } else if (child.nodeType === 1) reading += child.outerHTML
        else if (child.nodeType === 3 && child.textContent.trim()) reading += child.textContent.replace(/&/g, '&amp;').replace(/</g, '&lt;')
      })
      if (reading.trim()) add('More reading', '<section class="module-awareness-guide">' + reading + '</section>')
    } else {
      flushIntro()
      add(title(node), node.outerHTML)
    }
  })
  flushIntro()
  return { steps, references: references.join('\n') }
}

function renderPremiumStep(html, answers, tabs) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  // Enhance original curated A/B decisions as well as newly authored practice.
  doc.querySelectorAll('.scenario-decision').forEach((decision, index) => {
    const list = decision.querySelector(':scope > ul')
    if (!list) return
    const question = doc.createElement('div')
    question.className = 'premium-question'
    question.dataset.question = 'legacy-' + index
    Array.from(list.children).forEach((item, choiceIndex) => {
      const button = doc.createElement('button')
      button.type = 'button'
      button.className = 'premium-choice'
      button.dataset.choice = String(choiceIndex)
      button.dataset.correct = /\(Correct\)/i.test(item.textContent) ? 'true' : 'false'
      button.dataset.feedback = button.dataset.correct === 'true'
        ? 'Correct. ' + item.textContent.replace(/\(Correct\)/i, '').replace(/^\s*[A-Z]:\s*/, '').trim()
        : 'This choice follows the unverified request. Pause and verify independently. Review the safer response below.'
      button.innerHTML = item.innerHTML.replace(/<em>\s*\(Correct\)\s*<\/em>/gi, '').replace(/\(Correct\)/gi, '')
      question.appendChild(button)
    })
    list.replaceWith(question)
  })
  doc.querySelectorAll('[data-question]').forEach(question => {
    const id = question.dataset.question
    const choices = Array.from(question.querySelectorAll('button[data-choice]'))
    const selected = answers[id]
    choices.forEach(button => {
      const active = selected === button.dataset.choice
      button.setAttribute('aria-pressed', String(active))
      button.classList.toggle('is-selected', active)
      button.classList.toggle('is-correct', active && button.dataset.correct === 'true')
      button.classList.toggle('is-incorrect', active && button.dataset.correct !== 'true')
    })
    if (selected !== undefined) {
      const picked = choices.find(button => button.dataset.choice === selected)
      if (!picked) return
      const correct = picked.dataset.correct === 'true'
      const feedback = doc.createElement('div')
      feedback.className = 'premium-feedback ' + (correct ? 'is-correct' : 'is-incorrect')
      feedback.setAttribute('role', 'status')
      feedback.textContent = picked.dataset.feedback || (correct ? 'Correct.' : 'Try again and consider the warning signs.')
      if (!correct) {
        const safer = choices.find(button => button.dataset.correct === 'true')
        if (safer) feedback.textContent += ' Safer response: ' + safer.textContent.trim()
      }
      question.appendChild(feedback)
    }
  })
  doc.querySelectorAll('[data-tab-group]').forEach(group => {
    const buttons = Array.from(group.querySelectorAll('button[data-tab]'))
    const selected = tabs[group.dataset.tabGroup] || buttons[0]?.dataset.tab
    buttons.forEach(button => {
      const active = button.dataset.tab === selected
      button.classList.toggle('is-active', active)
      button.setAttribute('aria-pressed', String(active))
    })
    group.querySelectorAll('[data-panel]').forEach(panel => { panel.hidden = panel.dataset.panel !== selected })
  })
  return doc.body.innerHTML
}

function premiumInteraction(event, scope, answers, tabs) {
  if (!(event.target instanceof Element)) return false
  const choice = event.target.closest('button[data-choice]')
  if (choice && scope.contains(choice)) {
    const question = choice.closest('[data-question]')
    if (question) { answers[question.dataset.question] = choice.dataset.choice; return true }
  }
  const tab = event.target.closest('button[data-tab]')
  if (tab && scope.contains(tab)) {
    const group = tab.closest('[data-tab-group]')
    if (group) { tabs[group.dataset.tabGroup] = tab.dataset.tab; return true }
  }
  return false
}

function premiumEstimate(steps) {
  const doc = new DOMParser().parseFromString(steps.map(step => step.html).join(' '), 'text/html')
  const words = (doc.body.textContent || '').trim().split(/\s+/).filter(Boolean).length
  const practice = doc.querySelectorAll('[data-question],.scenario-decision').length
  const low = Math.max(1, Math.ceil(words / 200 + practice * 0.5))
  return low + '–' + (low + 4) + ' min total (includes interactive scenarios)'
}

function premiumReadProgress(storage, key, steps) {
  if (!key) return null
  try {
    const saved = JSON.parse(storage.getItem(key) || 'null')
    // Invalidate when section labels/order change, rather than restoring to the wrong topic.
    const signature = JSON.stringify(steps.map(step => step.label))
    if (!saved || saved.signature !== signature || !Number.isInteger(saved.activeStep)) return null
    return {
      activeStep: Math.max(0, Math.min(saved.activeStep, steps.length)),
      reviewed: [...new Set((Array.isArray(saved.reviewed) ? saved.reviewed : []).filter(i => Number.isInteger(i) && i >= 0 && i < steps.length))],
      answers: saved.answers && typeof saved.answers === 'object' && !Array.isArray(saved.answers) ? saved.answers : {},
      tabs: saved.tabs && typeof saved.tabs === 'object' && !Array.isArray(saved.tabs) ? saved.tabs : {},
    }
  } catch { return null }
}
function premiumWriteProgress(storage, key, steps, progress) {
  if (!key) return false
  try {
    storage.setItem(key, JSON.stringify({ signature: JSON.stringify(steps.map(step => step.label)), ...progress, updatedAt: Date.now() }))
    return true
  } catch { return false }
}
// END PREMIUM HELPERS

// Local progress never grants access or records assessment completion.
async function progressKey(auth, slug) {
  let owner = auth.user?.id ?? auth.user?._id ?? auth.user?.userId ?? auth.user?.user_id ?? auth.userId ?? auth.user?.email
  if (!owner && auth.token) {
    try {
      const part = auth.token.split('.')[1]
      const payload = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=')))
      owner = payload.sub ?? payload.userId ?? payload.id ?? payload.user_id ?? payload.email
    } catch { /* Opaque token: scope to this login instead of another user's progress. */ }
  }
  const scope = owner ? 'user:' + owner : auth.token ? 'login:' + auth.token : ''
  if (!scope || !window.crypto?.subtle) return ''
  const hash = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(scope))
  const fingerprint = Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, '0')).join('')
  return 'se-aware:premium-progress:v2:' + fingerprint + ':' + slug
}

export default {
  name: 'PremiumModule',
  data() {
    return {
      state: 'loading', html: '', message: '', steps: [], references: '',
      activeStep: 0, reviewed: [], answers: {}, tabs: {}, menuOpen: true, requestId: 0,
      storageKey: '', savedProgress: null, progressSaved: false,
      dialogKind: '', definition: { term: '', text: '' }, leaveDestination: '',
      focusBeforeDialog: null, focusReturnTerm: '', pendingRouteDecision: null, confirmedNavigation: false,
    }
  },
  computed: {
    slug() { return this.$route.meta.moduleSlug },
    meta() { return MODULES[this.slug] || { title: 'Premium module', intro: '' } },
    totalSteps() { return this.steps.length + 1 },
    isAssessment() { return this.activeStep === this.steps.length },
    lessonComplete() { return this.steps.length > 0 && this.steps.every((_, index) => this.reviewed.includes(index)) },
    progressPercent() { return this.steps.length ? Math.round(this.reviewed.length / this.steps.length * 100) : 0 },
    currentLabel() { return this.isAssessment ? 'Assessment' : this.steps[this.activeStep]?.label || '' },
    estimatedTime() { return this.slug === 'client-impersonation' ? '10–14 min total (includes interactive scenarios)' : premiumEstimate(this.steps) },
    renderedStep() { return renderPremiumStep(this.steps[this.activeStep]?.html || '', this.answers[this.activeStep] || {}, this.tabs[this.activeStep] || {}) },
  },
  watch: {
    '$route.meta.moduleSlug': { handler() { this.load() }, immediate: true },
  },
  beforeRouteLeave(to, from, next) {
    // Also catch Dashboard/Modules links in the shared app header or browser Back.
    // Auth redirects and assessment routes are not intercepted.
    if (this.state !== 'ready' || !['/dashboard', '/modules/premium', '/'].includes(to.path) || this.confirmedNavigation) {
      this.confirmedNavigation = false; next(); return
    }
    if (this.pendingRouteDecision) { next(false); return }
    this.leaveDestination = to.fullPath || to.path
    this.pendingRouteDecision = next
    this.saveProgress(); this.openDialog('leave')
  },
  mounted() { window.addEventListener('pagehide', this.saveProgress) },
  beforeUnmount() {
    this.saveProgress()
    this.requestId++
    window.removeEventListener('pagehide', this.saveProgress)
    this.$refs.progressDialog?.close()
  },
  methods: {
    async load() {
      this.saveProgress()
      this.closeDialog()
      const requestId = ++this.requestId
      const slug = this.slug
      this.state = 'loading'
      this.html = ''; this.message = ''; this.steps = []; this.references = ''
      this.activeStep = 0; this.reviewed = []; this.answers = {}; this.tabs = {}; this.menuOpen = true
      this.storageKey = ''; this.savedProgress = null; this.progressSaved = false
      try {
        const auth = useAuthStore()
        const data = await apiFetch(`/api/modules/${slug}/content`, { token: auth.token })
        if (requestId !== this.requestId) return
        this.html = data.html || ''
        if (!this.html) { this.state = 'error'; this.message = 'This module has no content yet.'; return }
        const lesson = parsePremiumLesson(this.html)
        this.steps = lesson.steps; this.references = lesson.references
        if (!this.steps.length) { this.state = 'error'; this.message = 'This module has no learning sections yet.'; return }
        // Restore only AFTER the protected content request succeeds.
        const key = await progressKey(auth, slug).catch(() => '')
        if (requestId !== this.requestId) return
        this.storageKey = key
        this.state = 'ready'
        try { this.savedProgress = premiumReadProgress(window.localStorage, key, this.steps) } catch { this.savedProgress = null }
        if (this.savedProgress && (this.savedProgress.activeStep > 0 || this.savedProgress.reviewed.length || Object.keys(this.savedProgress.answers).length)) {
          this.openDialog('resume')
        } else this.saveProgress()
      } catch (error) {
        if (requestId !== this.requestId) return
        this.message = error.message || 'Please try again.'
        this.state = /Premium subscription/i.test(this.message) ? 'locked' : 'error'
      }
    },
    saveProgress() {
      if (this.state !== 'ready' || !this.steps.length || this.dialogKind === 'resume') return this.progressSaved
      try {
        this.progressSaved = premiumWriteProgress(window.localStorage, this.storageKey, this.steps, { activeStep: this.activeStep, reviewed: this.reviewed, answers: this.answers, tabs: this.tabs })
      } catch { this.progressSaved = false }
      // Record real Premium lesson activity for the catalog's resume card.
      // No lesson HTML, tokens, or assessment answers are included in this marker.
      if (this.storageKey && MODULES[this.slug]) {
        try {
          const owner = this.storageKey.split(':')[3]
          window.localStorage.setItem('se-aware:last-opened-module:v1:' + owner, JSON.stringify({ slug: this.slug, visitedAt: Date.now() }))
        } catch { /* Resume metadata is optional. */ }
      }
      return this.progressSaved
    },
    async openDialog(kind, target = document.activeElement) {
      this.focusBeforeDialog = target
      this.focusReturnTerm = target?.dataset?.term || ''
      this.dialogKind = kind
      await this.$nextTick()
      const dialog = this.$refs.progressDialog
      if (dialog && !dialog.open) dialog.showModal()
    },
    closeDialog() {
      const kind = this.dialogKind
      if (this.pendingRouteDecision) { const cancel = this.pendingRouteDecision; this.pendingRouteDecision = null; cancel(false) }
      this.$refs?.progressDialog?.close()
      this.dialogKind = ''
      const previousFocus = this.focusBeforeDialog
      const term = this.focusReturnTerm
      this.$nextTick(() => {
        if (this.dialogKind) return
        if (previousFocus?.isConnected) previousFocus.focus?.({ preventScroll: true })
        else if (term) {
          const replacement = Array.from(this.$refs.lessonContent?.querySelectorAll('button[data-term]') || []).find(button => button.dataset.term === term)
          replacement?.focus({ preventScroll: true })
        }
      })
      this.focusBeforeDialog = null; this.focusReturnTerm = ''
      // Escape on Welcome back resumes the saved visit instead of overwriting it.
      if (kind === 'resume' && this.savedProgress) this.applySavedProgress()
    },
    applySavedProgress() {
      const saved = this.savedProgress
      if (!saved) return
      this.reviewed = saved.reviewed; this.answers = saved.answers; this.tabs = saved.tabs
      this.activeStep = saved.activeStep; this.savedProgress = null
      this.saveProgress()
    },
    continueProgress() { this.closeDialog(); this.$nextTick(() => this.focusStep()) },
    startOver() {
      this.savedProgress = null
      this.closeDialog()
      this.activeStep = 0; this.reviewed = []; this.answers = {}; this.tabs = {}
      this.saveProgress(); this.$nextTick(() => this.focusStep())
    },
    focusStep() {
      const heading = this.$refs.stepHeading
      if (!heading) return
      heading.focus({ preventScroll: true })
      heading.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    },
    async goToStep(index) {
      if (index < 0 || index >= this.totalSteps) return
      this.activeStep = index; this.saveProgress()
      await this.$nextTick(); this.focusStep()
    },
    nextStep() {
      if (!this.isAssessment && !this.reviewed.includes(this.activeStep)) this.reviewed.push(this.activeStep)
      this.goToStep(this.activeStep + 1)
    },
    requestLeave(destination) {
      if (this.state !== 'ready') { this.$router.push(destination); return }
      this.leaveDestination = destination
      this.saveProgress(); this.openDialog('leave')
    },
    confirmLeave() {
      const destination = this.leaveDestination
      const decision = this.pendingRouteDecision
      this.pendingRouteDecision = null
      this.saveProgress(); this.closeDialog()
      if (decision) decision()
      else { this.confirmedNavigation = true; this.$router.push(destination) }
    },
    onLessonClick(event) {
      if (!(event.target instanceof Element)) return
      const term = event.target.closest('button[data-term]')
      if (term) {
        this.definition = { term: term.dataset.term || term.textContent, text: term.dataset.definition || '' }
        this.openDialog('definition', term); return
      }
      const index = this.activeStep
      const answers = { ...(this.answers[index] || {}) }, tabs = { ...(this.tabs[index] || {}) }
      const clickedButton = event.target.closest('button'), focusKey = clickedButton?.dataset
      const questionId = clickedButton?.closest('[data-question]')?.dataset.question
      if (premiumInteraction(event, this.$refs.lessonContent, answers, tabs)) {
        this.answers = { ...this.answers, [index]: answers }; this.tabs = { ...this.tabs, [index]: tabs }
        this.saveProgress()
        this.$nextTick(() => {
          for (const button of this.$refs.lessonContent?.querySelectorAll('button') || []) {
            if ((focusKey?.choice !== undefined && button.dataset.choice === focusKey.choice && button.closest('[data-question]')?.dataset.question === questionId) || (focusKey?.tab && button.dataset.tab === focusKey.tab)) { button.focus({ preventScroll: true }); break }
          }
        })
      }
    },
    startQuiz() {
      if (this.dialogKind === 'resume') this.closeDialog()
      this.saveProgress()
      this.$router.push({ name: 'QuizQuestion', params: { moduleId: this.slug } })
    },
  },
}