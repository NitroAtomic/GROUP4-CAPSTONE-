// javascript/framework/vue/modules/premium/PremiumModule.js
//
// Isang balangkas para sa lahat ng apat na role-based module.
//
// Dati, isang .vue file kada module, at nakasulat sa loob nila ang buong
// aral. Naipapadala yun palabas bilang ordinaryong JavaScript
// (dist/assets/InvoiceScams-*.js), at nakalista ang pangalan ng file sa
// pangunahing bundle na kinukuha ng bawat bisita. Kaya mababasa ng kahit
// sino ang bayad na aral nang walang account.
//
// Ngayon, ito na lang ang nasa browser: pamagat, breadcrumb, button
// papuntang pagsusulit. Ang aral ay hinihingi sa server, at doon
// tinitingnan kung bayad ka nga ba.

import { useAuthStore } from '../../stores/auth.js'
import { apiFetch } from '../../lib/api.js'

/* Pamagat at panimula lang -- hindi ito lihim. Nasa /premium-list na ang
   mga pamagat para sa lahat, kaya nandito sila para may makita agad
   habang hinihintay ang aral, sa halip na blangkong pahina. */
const MODULES = {
  'invoice-scams': {
    title: 'Invoice and Payment Fraud',
    intro: 'How attackers redirect a real payment to their own account — by changing bank details on an invoice, or a payroll record — and the two checks that stop it.',
  },
  'client-data': {
    title: 'Secure Client Data Handling',
    intro: 'You hold the client files, the passwords and the access. The usual way all three get exposed is someone posing as your boss — here is how that works, and the one check that stops it whatever rank is on the message.',
  },
  'client-impersonation': {
    title: 'Fake Clients and Escrow Fraud',
    intro: 'How a fake client takes your login, your work, or your money — and the checks that keep a new project from costing you.',
  },
  'fake-recruiters': {
    title: 'Fake Job Offers',
    intro: 'How a fake recruiter collects your passport scan, your bank details and an upfront payment — and what a real employer never asks for.',
  },
}

export default {
  name: 'PremiumModule',

  data() {
    return {
      state: 'loading', // loading | ready | locked | error
      html: '',
      message: '',
    }
  },

  computed: {
    slug() {
      return this.$route.meta.moduleSlug
    },
    meta() {
      return MODULES[this.slug] || { title: 'Premium module', intro: '' }
    },
  },

  watch: {
    // Para gumana ang paglipat mula sa isang premium module papunta sa iba
    // nang hindi kailangang i-reload — pareho silang component ngayon, kaya
    // hindi na ito muling ginagawa ng Vue.
    '$route.meta.moduleSlug': {
      handler() { this.load() },
      immediate: true,
    },
  },

  methods: {
    async load() {
      this.state = 'loading'
      this.html = ''

      try {
        const data = await apiFetch(`/api/modules/${this.slug}/content`, {
          token: useAuthStore().token,
        })
        this.html = data.html || ''
        this.state = this.html ? 'ready' : 'error'
        if (!this.html) this.message = 'This module has no content yet.'
      } catch (error) {
        /* Hindi dapat mangyari ito: hindi pinapapasok ng router ang
           hindi Premium. Pero kung mag-expire ang subscription habang
           bukas ang tab, dito yun lalabas — at mas mabuting sabihin
           kaysa magpakita ng blangko. */
        if (/Premium subscription/i.test(error.message)) {
          this.state = 'locked'
          this.message = error.message
        } else {
          this.state = 'error'
          this.message = error.message
        }
      }
    },

    startQuiz() {
      this.$router.push({ name: 'QuizQuestion', params: { moduleId: this.slug } })
    },
  },
}
