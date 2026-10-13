// javascript/framework/vue/pages/PremiumModules.js
import { useAuthStore } from '../stores/auth.js'
import { apiFetch } from '../lib/api.js'

// Public catalog metadata only. Lesson content and assessments remain protected.
const COURSES = [
  { slug: 'client-impersonation', title: 'Client Impersonation', summary: 'Fake clients, portfolio scams and escrow fraud aimed at freelancers.', icon: 'user-shield', premium: true },
  { slug: 'invoice-scams', title: 'Invoice and Payment Scams', summary: 'Business email compromise, invoice manipulation and vendor account changes.', icon: 'invoice-warning', premium: true },
  { slug: 'fake-recruiters', title: 'Fake Job and Recruiter Offers', summary: 'Recruitment and onboarding scams that harvest identity documents.', icon: 'recruiter', premium: true },
  { slug: 'client-data', title: 'Secure Client Data Handling', summary: 'Protecting client data, passwords and files from exposure.', icon: 'client-data', premium: true },
  { slug: 'quishing', title: 'Phishing', summary: 'Email phishing, fake login pages and QR code exploits.', icon: 'qr', path: '/modules/phishing' },
  { slug: 'spear-phishing', title: 'Spear Phishing', summary: 'Targeted attacks using real details about you or your work.', icon: 'target-mail' },
  { slug: 'vishing', title: 'Vishing', summary: 'Voice phishing and social engineering calls.', icon: 'phone' },
  { slug: 'smishing', title: 'Smishing', summary: 'Scam text messages and mobile messaging attacks.', icon: 'mobile-message' },
  { slug: 'pretexting', title: 'Pretexting', summary: 'Trust-building manipulation and invented identities.', icon: 'identity' },
  { slug: 'essential-safe-practices-remote-environments', title: 'Essential Safe Practices for Remote Environments', summary: 'Everyday security practices for remote and hybrid work.', icon: 'shield-check' },
].map(course => ({ ...course, path: course.path || `/modules/${course.premium ? 'premium/' : ''}${course.slug}` }))
const normalizeSlug = slug => slug === 'phishing' ? 'quishing' : slug
const trackers = new WeakMap()

async function accountFingerprint(auth) {
  let owner = auth.user?.id ?? auth.user?._id ?? auth.user?.userId ?? auth.user?.user_id ?? auth.userId ?? auth.user?.email
  if (!owner && auth.token) {
    try {
      const part = auth.token.split('.')[1]
      const payload = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=')))
      owner = payload.sub ?? payload.userId ?? payload.id ?? payload.user_id ?? payload.email
    } catch { /* Use an opaque-token fingerprint for this login only. */ }
  }
  const scope = owner ? 'user:' + owner : auth.token ? 'login:' + auth.token : ''
  if (!scope || !window.crypto?.subtle) return ''
  const hash = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(scope))
  return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, '0')).join('')
}
function readStored(key) {
  try { return JSON.parse(window.localStorage.getItem(key) || 'null') } catch { return null }
}
function recentKey(owner) { return `se-aware:last-opened-module:v1:${owner}` }
async function recordVisit(auth, course, quizPending = false) {
  const visitedAt = Date.now()
  try {
    const owner = await accountFingerprint(auth)
    if (!owner) return
    const previous = readStored(recentKey(owner))
    if (previous?.visitedAt > visitedAt) return
    window.localStorage.setItem(recentKey(owner), JSON.stringify({ slug: course.slug, visitedAt, quizPending }))
  } catch { /* Storage is optional and never controls access. */ }
}
export function installModuleVisitTracker(router, auth) {
  if (trackers.has(router)) return
  const remove = router.afterEach((to, from, failure) => {
    if (failure) return
    const quiz = /^\/quiz\/([^/]+)\/(question|results)\/?$/.exec(to.path)
    const course = COURSES.find(item => item.path === to.path || (item.slug === 'quishing' && to.path === '/modules/quishing') || item.slug === normalizeSlug(quiz?.[1]))
    if (course) void recordVisit(auth, course, quiz?.[2] === 'question')
  })
  // One application-wide hook after the catalog is first used, not one per visit.
  trackers.set(router, remove)
}

export default {
  name: 'PremiumModules',
  setup() { return { authStore: useAuthStore() } },
  data() { return { courses: COURSES, progress: [], quizHistory: [], localProgress: {}, lastOpened: null, progressState: 'loading', requestId: 0, resumeRequestId: 0 } },
  computed: {
    isPremium() { return this.authStore.isPremium },
    premiumCourses() { return this.courses.filter(course => course.premium) },
    freeCourses() { return this.courses.filter(course => !course.premium) },
    accessLabel() { return this.authStore.user?.role === 'admin' ? 'Available with administrator access' : this.isPremium ? 'Included in your Premium plan' : 'Premium access required' },
    resumeCourse() { return this.courses.find(course => course.slug === normalizeSlug(this.lastOpened?.slug) && (!course.premium || this.isPremium)) || null },
    resumeDetails() {
      const course = this.resumeCourse
      if (!course) return null
      const saved = this.localProgress[course.slug]
      const quizPending = this.lastOpened?.quizPending
      const quizTaken = this.quizHistory.some(row => normalizeSlug(row.slug) === course.slug)
      if (quizPending) return { title: 'Your quiz was opened', copy: 'Ready to try again? Starting the quiz begins a new attempt; unanswered responses are not restored here.', action: course.premium ? 'Take Assessment' : 'Take Quiz', destination: `/quiz/${course.slug}/question` }
      if (saved) {
        const atAssessment = saved.activeStep === saved.labels.length
        if (atAssessment) return { title: 'Assessment section reached', copy: quizTaken ? 'You have a recorded quiz attempt. Continue reviewing this course or take it again.' : 'You reached the assessment section. Take the module assessment when you’re ready.', action: quizTaken ? 'Continue course' : 'Take Assessment', destination: quizTaken ? course.path : `/quiz/${course.slug}/question` }
        return { title: `Step ${saved.activeStep + 1} of ${saved.labels.length + 1} · ${saved.labels[saved.activeStep]}`, copy: 'Your lesson position is saved in this browser. Continue, then choose Continue Progress in the lesson popup.', action: 'Continue learning', destination: course.path }
      }
      return { title: 'Last opened course', copy: quizTaken ? 'You have a recorded quiz attempt. Revisit the lesson to reinforce what you learned.' : 'Pick up your lesson, then take the module quiz when you’re ready.', action: 'Continue learning', destination: course.path }
    },
  },
  mounted() {
    installModuleVisitTracker(this.$router, this.authStore)
    window.addEventListener('focus', this.refreshResume)
    this.loadProgress()
  },
  beforeUnmount() { this.requestId++; this.resumeRequestId++; window.removeEventListener('focus', this.refreshResume) },
  watch: {
    'authStore.user.user_id'() { this.loadProgress() },
  },
  methods: {
    async loadProgress() {
      const requestId = ++this.requestId
      this.progress = []; this.quizHistory = []; this.localProgress = {}; this.lastOpened = null
      this.progressState = 'loading'
      await this.refreshResume()
      if (!this.authStore.isAuthenticated) { this.progressState = 'unavailable'; return }
      try {
        const data = await apiFetch('/api/dashboard', { token: this.authStore.token })
        if (requestId !== this.requestId) return
        this.progress = Array.isArray(data.progress) ? data.progress : []
        this.quizHistory = Array.isArray(data.quiz_history) ? data.quiz_history : []
        this.progressState = 'ready'
      } catch {
        if (requestId === this.requestId) this.progressState = 'unavailable'
      }
    },
    async refreshResume() {
      const requestId = ++this.resumeRequestId
      const token = this.authStore.token
      const owner = await accountFingerprint(this.authStore).catch(() => '')
      if (requestId !== this.resumeRequestId || token !== this.authStore.token) return
      this.localProgress = {}; this.lastOpened = null
      if (!owner) return
      const recent = readStored(recentKey(owner))
      const candidates = []
      for (const course of this.premiumCourses) {
        if (!this.isPremium) continue
        const saved = readStored(`se-aware:premium-progress:v2:${owner}:${course.slug}`)
        try {
          const labels = JSON.parse(saved?.signature || 'null')
          if (!Array.isArray(labels) || !labels.length || !labels.every(label => typeof label === 'string') || !Number.isInteger(saved.activeStep) || saved.activeStep < 0 || saved.activeStep > labels.length) continue
          this.localProgress[course.slug] = { ...saved, labels }
          if (Number.isFinite(saved.updatedAt)) candidates.push({ slug: course.slug, visitedAt: saved.updatedAt })
        } catch { /* Invalid saved lesson data is ignored. */ }
      }
      if (recent && Number.isFinite(recent.visitedAt) && this.courses.some(course => course.slug === normalizeSlug(recent.slug))) candidates.push(recent)
      candidates.sort((a, b) => b.visitedAt - a.visitedAt)
      this.lastOpened = candidates.find(item => this.courses.some(course => course.slug === normalizeSlug(item.slug) && (!course.premium || this.isPremium))) || null
    },
    destination(course) { return course.premium && !this.isPremium ? '/premium-subscription' : course.path },
    rememberCourse(course) { if (!course.premium || this.isPremium) void recordVisit(this.authStore, course) },
    status(course) {
      if (course.premium && !this.isPremium) return 'Premium required'
      const row = this.progress.find(item => normalizeSlug(item.slug) === course.slug)
      if (row?.completion_status === 'completed') return 'Completed'
      if (row?.completion_status === 'in_progress' || row?.completion_status === 'started') return 'In progress'
      if (this.localProgress[course.slug]) return 'Opened · saved locally'
      if (this.progressState === 'loading') return 'Loading progress…'
      if (this.progressState === 'unavailable') return 'Progress unavailable'
      return 'Not started'
    },
    courseIcon(path) { return this.courses.find(course => course.path === path)?.icon || 'shield-check' },
  },
}