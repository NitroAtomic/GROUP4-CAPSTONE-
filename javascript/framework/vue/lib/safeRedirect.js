// javascript/framework/vue/lib/safeRedirect.js
//
// Saan pupunta pagkatapos mag-login o gumawa ng account.
//
// Sariling pahina lang ang tinatanggap: nagsisimula sa "/" pero hindi sa
// "//" o "/\\". Ang "//ibang-site.com" ay itinuturing ng browser na ibang
// website, kaya puwede itong gamitin para dalhin ang bagong login sa
// pekeng pahina. Dati, "/" lang ang tinitingnan sa Login.js.
export function safeRedirect(value, fallback = '/dashboard') {
  if (typeof value !== 'string') return fallback
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback
  return value
}
