// javascript/framework/vue/stores/auth.js
//
// Pinia was already an installed dependency (package.json) but unused —
// this is the first thing to actually use it, per the roadmap in
// FRONTEND_IMPLEMENTATION_PROTOTYPE_DEFENSE_GUIDE.md.
//
// Talks to the real backend-node auth routes (backend-node/routes/auth.js).
// Session token is kept in sessionStorage — not localStorage — matching
// AUTHENTICATION.md's stated reasoning: "kept in sessionStorage so they
// clear when the tab closes, deliberate, since remote workers may use
// shared machines."

import { defineStore } from 'pinia'
import { apiFetch } from '../lib/api.js'

const TOKEN_KEY = 'se_auth_token'
const USER_KEY = 'se_auth_user'

function readStoredUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: sessionStorage.getItem(TOKEN_KEY) || null,
    user: readStoredUser()
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
    /* Pang-nav lang ito — kung aling link ang naka-lock at aling card ang
       may padlock. Ang server pa rin ang totoong tagapagpasya; kahit
       lokohin ng isang tao yung sessionStorage niya para maging
       "Premium", 403 pa rin ang sagot ng backend sa mismong nilalaman.

       Kasama na yung petsa ng pagtatapos para tumugma sa
       middleware/premium.js. Kung dito lang ito nakalimutan, makikita ng
       taong expired na yung mga naka-unlock na link, tapos mabibigo siya
       pagpindot — mas malala pa yun kaysa sa padlock. */
    isPremium: (state) => {
      const user = state.user
      if (!user) return false
      /* Dumadaan yung admin, kapareho ng middleware/premium.js sa backend.
         Kung dito lang mawawala yung tuntuning yun, hindi magkasundo yung
         dalawa: papayagan ng server yung admin sa bayad na nilalaman, pero
         ipapadala siya ng nav sa pricing page — aanyayahan yung sariling
         administrator ng site na bumili ng subscription. */
      if (user.role === 'admin') return true
      if (user.subscription_type !== 'Premium') return false
      if (user.subscription_status !== 'active') return false
      if (user.subscription_expires_at &&
          new Date(user.subscription_expires_at) <= new Date()) return false
      return true
    }
  },

  actions: {
    // Persists token + user together so the two can never get out of sync.
    _setSession(token, user) {
      this.token = token
      this.user = user
      sessionStorage.setItem(TOKEN_KEY, token)
      sessionStorage.setItem(USER_KEY, JSON.stringify(user))
    },

    _clearSession() {
      this.token = null
      this.user = null
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(USER_KEY)
    },

    // FR-09: Registration.
    // subscription_type is deliberately always 'Free' here: FR-10 keeps
    // plan upgrades a separate step (Payment, Phase 1.7 — not built yet),
    // and AUTHENTICATION.md describes payment.html as what "upgrades the
    // account to Premium" after the fact. Registering Premium up front,
    // before any (even simulated) payment step has run, would let someone
    // get Premium access just by picking it on this form.
    async register({ firstName, lastName, email, password }) {
      const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: {
          first_name: firstName,
          last_name: lastName || undefined,
          email,
          password,
          subscription_type: 'Free'
        }
      })
      this._setSession(data.token, data.user)
      return data.user
    },

    // FR-09 / FR-20. Free accounts resolve immediately with a session.
    // Premium accounts come back with requiresOtp: true instead of a
    // token — the caller (Login.vue) is expected to show the code-entry
    // step and call verifyOtp() next.
    async login({ email, password }) {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (data.requiresOtp) {
        return { requiresOtp: true, pendingToken: data.pendingToken, email: data.email }
      }

      this._setSession(data.token, data.user)
      return { requiresOtp: false, user: data.user }
    },

    async verifyOtp({ pendingToken, code }) {
      const data = await apiFetch('/api/auth/verify-otp', {
        method: 'POST',
        body: { pendingToken, code }
      })
      this._setSession(data.token, data.user)
      return data.user
    },

    async resendOtp({ pendingToken }) {
      return apiFetch('/api/auth/resend-otp', {
        method: 'POST',
        body: { pendingToken }
      })
    },

    async requestPasswordReset({ email }) {
      // Backend intentionally returns the same response whether or not
      // the email exists (see AUTHENTICATION.md) — nothing to branch on
      // here, just surface the message.
      return apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        body: { email }
      })
    },

    async resetPassword({ email, code, newPassword }) {
      return apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: { email, code, newPassword }
      })
    },

    // FR-10 / Payment (Phase 1.7). Records the plan change on the account —
    // per AUTHENTICATION.md, payment.html "upgrades the account to Premium
    // without processing any payment." No card data is sent here; Payment.js
    // validates the card client-side first and only calls this once that
    // (simulated) check passes.
    /* Dating may upgradeToPremium() dito na tumatawag ng
       PATCH /api/auth/me/subscription na may {subscription_type:'Premium'}.
       Tinanggal na: tumatanggi na ngayon ang server doon, dahil yun mismo
       ang paraan para makakuha ng Premium nang walang bayad.

       Ang kapalit ay refreshUser(): hindi tayo nagsasabi sa server kung
       anong plano natin -- tinatanong natin siya. */
    async refreshUser() {
      const me = await apiFetch('/api/auth/me', { token: this.token })
      this.user = {
        ...this.user,
        ...me
      }
      sessionStorage.setItem(USER_KEY, JSON.stringify(this.user))
      return this.user
    },

    // Pag-cancel. Pababa lang ang dinadaanan nito; ang pagtaas ay dumadaan
    // sa bayad.
    async cancelSubscription() {
      const data = await apiFetch('/api/auth/me/subscription', {
        method: 'PATCH',
        token: this.token,
        body: { subscription_type: 'Free' }
      })
      if (this.user) {
        this.user = {
          ...this.user,
          subscription_type: 'Free',
          subscription_status: 'inactive',
          subscription_expires_at: null
        }
        sessionStorage.setItem(USER_KEY, JSON.stringify(this.user))
      }
      return data
    },

    async logout() {
      // Logout clears the local session regardless of whether the network
      // call succeeds — a stateless JWT can't really be revoked
      // server-side anyway (see backend-node/routes/auth.js), and the
      // caller (SiteHeader.js) should always be able to redirect to
      // /login afterward, even if the backend is unreachable.
      try {
        if (this.token) {
          await apiFetch('/api/auth/logout', { method: 'POST', token: this.token })
        }
      } catch {
        // Network/server error — ignore. The local session still clears.
      } finally {
        this._clearSession()
      }
    }
  }
})
