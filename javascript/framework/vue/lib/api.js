// javascript/framework/vue/lib/api.js
//
// One shared place to talk to backend-node (see AUTHENTICATION.md).
// Everything else (the auth store, pages) calls apiFetch() instead of
// calling fetch() directly, so the base URL, JSON handling, and the
// Authorization header only need to be right in one spot.

// Vite exposes anything prefixed VITE_ on import.meta.env. Falls back to
// the local backend's default port (see AUTHENTICATION.md "Running it")
// so the app works out of the box in development with zero .env setup.
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

/**
 * @param {string} path       e.g. '/api/auth/login'
 * @param {object} [options]
 * @param {string} [options.method]
 * @param {object} [options.body]   plain object, will be JSON.stringified
 * @param {string} [options.token]  bearer token, if the route requires auth
 */
export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    })
  } catch (networkError) {
    // The backend isn't running / unreachable — distinguish this from a
    // normal 4xx/5xx so the pages can show "can't reach the server"
    // instead of "incorrect email or password".
    throw new Error('Could not reach the server. Please check your connection and try again.')
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    // No JSON body (e.g. a 204) — fine, leave data as null.
  }

  if (!response.ok) {
    throw new Error((data && data.error) || `Request failed (${response.status}).`)
  }

  return data
}
