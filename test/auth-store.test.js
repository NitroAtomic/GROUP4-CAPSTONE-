// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../javascript/framework/vue/stores/auth.js'

function mockFetchOnce(status, body) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body
  })
}

beforeEach(() => {
  setActivePinia(createPinia())
  sessionStorage.clear()
})

describe('auth store', () => {
  it('register() stores token + user, forces subscription_type Free', async () => {
    mockFetchOnce(201, {
      token: 'tok123',
      user: { user_id: 1, first_name: 'Juan', email: 'j@example.com', subscription_type: 'Free' }
    })
    const store = useAuthStore()
    const user = await store.register({ firstName: 'Juan', email: 'j@example.com', password: 'Abc12345!' })

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/auth/register',
      expect.objectContaining({ method: 'POST' })
    )
    const sentBody = JSON.parse(fetch.mock.calls[0][1].body)
    expect(sentBody.subscription_type).toBe('Free')
    expect(user.first_name).toBe('Juan')
    expect(store.isAuthenticated).toBe(true)
    expect(sessionStorage.getItem('se_auth_token')).toBe('tok123')
  })

  it('login() free account resolves directly with a session', async () => {
    mockFetchOnce(200, {
      token: 'tok456',
      user: { user_id: 2, first_name: 'Maria', subscription_type: 'Free' }
    })
    const store = useAuthStore()
    const result = await store.login({ email: 'm@example.com', password: 'pw' })

    expect(result.requiresOtp).toBe(false)
    expect(store.isAuthenticated).toBe(true)
    expect(store.firstName).toBe('Maria')
  })

  it('login() premium account returns requiresOtp without setting a session', async () => {
    mockFetchOnce(200, {
      requiresOtp: true,
      pendingToken: 'pending123',
      email: 'p@example.com',
      expiresInMinutes: 5
    })
    const store = useAuthStore()
    const result = await store.login({ email: 'p@example.com', password: 'pw' })

    expect(result.requiresOtp).toBe(true)
    expect(result.pendingToken).toBe('pending123')
    expect(store.isAuthenticated).toBe(false)
  })

  it('verifyOtp() then sets the session', async () => {
    mockFetchOnce(200, {
      token: 'tok789',
      user: { user_id: 3, first_name: 'Premium User', subscription_type: 'Premium', subscription_status: 'active' }
    })
    const store = useAuthStore()
    await store.verifyOtp({ pendingToken: 'pending123', code: '482913' })

    expect(store.isAuthenticated).toBe(true)
    expect(store.isPremium).toBe(true)
  })

  it('login() surfaces backend error message on wrong credentials', async () => {
    mockFetchOnce(401, { error: 'Incorrect email or password.' })
    const store = useAuthStore()
    await expect(store.login({ email: 'x@example.com', password: 'wrong' }))
      .rejects.toThrow('Incorrect email or password.')
    expect(store.isAuthenticated).toBe(false)
  })

  it('apiFetch surfaces a friendly message when the network call itself fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    const store = useAuthStore()
    await expect(store.login({ email: 'x@example.com', password: 'y' }))
      .rejects.toThrow('Could not reach the server')
  })

  it('resetPassword() posts email, code, and newPassword together', async () => {
    mockFetchOnce(200, { message: 'Password updated. You can now log in with your new password.' })
    const store = useAuthStore()
    await store.resetPassword({ email: 'j@example.com', code: '111222', newPassword: 'NewPass1!' })

    const sentBody = JSON.parse(fetch.mock.calls[0][1].body)
    expect(sentBody).toEqual({ email: 'j@example.com', code: '111222', newPassword: 'NewPass1!' })
  })

  it('logout() clears the session even if the network call fails', async () => {
    mockFetchOnce(200, {
      token: 'tokABC',
      user: { user_id: 4, first_name: 'Ana', subscription_type: 'Free' }
    })
    const store = useAuthStore()
    await store.login({ email: 'a@example.com', password: 'pw' })
    expect(store.isAuthenticated).toBe(true)

    global.fetch = vi.fn().mockRejectedValue(new TypeError('offline'))
    await store.logout()

    expect(store.isAuthenticated).toBe(false)
    expect(sessionStorage.getItem('se_auth_token')).toBe(null)
  })
})
