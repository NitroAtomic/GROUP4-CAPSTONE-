import { useAuthStore } from '../stores/auth.js'
import { apiFetch } from '../lib/api.js'

export default {
  name: 'ChatbotWidget',

  data() {
    return {
      isOpen: false,
      isSending: false,
      draft: '',
      sessionId: '',
      messages: [
        {
          role: 'assistant',
          text: "Hello! I'm your AI Assistant. What can I help you with regarding social engineering?"
        }
      ]
    }
  },

  created() {
    this.sessionId = sessionStorage.getItem('chat-session-id') || this.createSessionId()
  },

  methods: {
    createSessionId() {
      const id =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`

      sessionStorage.setItem('chat-session-id', id)
      return id
    },

    scrollConversation() {
      this.$nextTick(() => {
        const panel = this.$refs.conversation
        if (panel) panel.scrollTop = panel.scrollHeight
      })
    },

    async sendMessage() {
      const text = this.draft.trim()
      if (!text || this.isSending) return

      const history = this.messages.map(({ role, text: messageText }) => ({
        role,
        text: messageText
      }))

      this.messages.push({ role: 'user', text })
      this.draft = ''
      this.isSending = true
      this.scrollConversation()

      try {
        const authStore = useAuthStore()
        const data = await apiFetch('/api/chat', {
          method: 'POST',
          token: authStore.token,
          body: {
            message: text,
            history,
            sessionId: this.sessionId
          }
        })

        if (data.redacted && data.redactedMessage) {
          const lastUserMessage = [...this.messages]
            .reverse()
            .find((message) => message.role === 'user')

          if (lastUserMessage) {
            lastUserMessage.text = data.redactedMessage
          }
        }

        this.messages.push({
          role: 'assistant',
          text: data.reply || 'I could not generate a response right now.'
        })
      } catch (error) {
        this.messages.push({
          role: 'assistant',
          text: error.message
        })
      } finally {
        this.isSending = false
        this.scrollConversation()
      }
    }
  }
}
