// Backend and integration: IamAtomic
//
// Isang maliit na lock na hawak ng buong browser, hindi lang ng isang tab.
//
// Dalawang problema ang inaayos nito:
//   1. Kapag umalis ka sa gitna ng quiz o assessment, nawawala ang sagot mo
//      nang walang babala.
//   2. Kapag dalawa ang bukas na tab, puwedeng mag-quiz sa isa tapos tanungin
//      si CyberWise sa kabila. Ang pagtatago ng chat base sa route ay tumitingin
//      lang sa sariling tab, kaya hindi nito nahuhuli iyon.
//
// Nasa localStorage ang lock kaya nakikita ito ng lahat ng tab. May kasama
// itong oras at tumitibok kada labinlimang segundo: kung nag-crash o sapilitang
// isinara ang tab, luluwag ang lock mag-isa sa halip na maiwang naka-lock ang
// chat habambuhay.
const KEY = 'se_exam_active'
const HEARTBEAT_MS = 15000
const STALE_MS = 45000

let timer = null
const listeners = new Set()

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return 0
    const at = Number(JSON.parse(raw).at) || 0
    return Date.now() - at < STALE_MS ? at : 0
  } catch {
    return 0
  }
}

function notify() {
  for (const fn of listeners) fn(isActive())
}

function stamp() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ at: Date.now() }))
  } catch {
    // Puno o naka-block ang storage: hindi ito dahilan para hindi makapag-quiz.
  }
}

export function isActive() {
  return read() > 0
}

export function start() {
  stamp()
  if (!timer) timer = setInterval(stamp, HEARTBEAT_MS)
  notify()
}

export function stop() {
  if (timer) { clearInterval(timer); timer = null }
  try { localStorage.removeItem(KEY) } catch { /* ignore */ }
  notify()
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

if (typeof window !== 'undefined') {
  // Ibang tab ang nagsimula o natapos: kailangang sumunod ang tab na ito.
  window.addEventListener('storage', (event) => {
    if (event.key === KEY) notify()
  })
  // Babala rin kapag isasara o ire-refresh ang tab habang may quiz.
  window.addEventListener('beforeunload', (event) => {
    if (!timer) return
    event.preventDefault()
    event.returnValue = ''
  })

  // Huling linis kapag isinara ang tab habang may quiz.
  window.addEventListener('pagehide', () => {
    if (timer) stop()
  })
}

export default { isActive, start, stop, subscribe }
