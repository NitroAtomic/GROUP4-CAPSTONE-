import { useAuthStore } from '../stores/auth.js'
import examLock from '../lib/examLock.js'
import { apiFetch } from '../lib/api.js'

const HISTORY_STORAGE_KEY = 'chat-messages-v1'
// Kanino ang nakaimbak na usapan. Iisa lang kasi ang susi ng history, kaya
// kapag nag-log out ang isa at nag-log in ang iba sa parehong tab, nakikita
// ng bagong user ang usapan ng nauna. Sariling usapan dapat ang makikita ng
// bawat account.
const HISTORY_OWNER_KEY = 'chat-owner-v1'

function currentOwnerId() {
  const user = useAuthStore().user
  return user && user.user_id ? String(user.user_id) : 'guest'
}
const MAX_VISIBLE_MESSAGES = 24
const API_HISTORY_LIMIT = 6
const WELCOME_MESSAGE = {
  role: 'assistant',
  text: "Hi, I'm CyberWise, your learning assistant. Ask me about social engineering and staying safe online."
}
const STARTER_PROMPTS = [
  'How can I spot a phishing message?',
  'What should I do after clicking a suspicious link?',
  'How can I protect my accounts with MFA?'
]
const PASSWORD_PATTERN = /\b(pass(?:word)?|pwd)\b(\s*[:=]|\s+is)\s*["']?(\S{3,}?)["']?(?=[.,!?]*(?:\s|$))/gi

function redactSecrets(text) {
  return text.replace(PASSWORD_PATTERN, (match, label, connector) => `${label}${connector} [REDACTED]`)
}

function newConversation() {
  return [{ ...WELCOME_MESSAGE }]
}

export default {
  name: 'ChatbotWidget',

  data() {
    return {
      // Nakatago si CyberWise habang may quiz o assessment, kahit sa ibang tab.
      examActive: examLock.isActive(),
      isOpen: false,
      isSending: false,
      draft: '',
      sessionId: '',
      messages: newConversation(),
      starterPrompts: STARTER_PROMPTS
    }
  },

  computed: {
    hidden() {
      const path = this.$route ? this.$route.path : ''
      return this.examActive
        || /^\/quiz\/[^/]+\/question/.test(path)
        || path.startsWith('/assessment/question')
    },

    hasUserMessages() {
      return this.messages.some((message) => message.role === 'user')
    }
  },

  mounted() {
    this.unsubscribeExam = examLock.subscribe((active) => {
      this.examActive = active
      if (active) this.isOpen = false
    })
  },

  beforeUnmount() {
    if (this.unsubscribeExam) this.unsubscribeExam()
  },

  created() {
    this.resetIfDifferentUser()
    this.sessionId = sessionStorage.getItem('chat-session-id') || this.createSessionId()
    this.loadConversation()
  },

  watch: {
    // Nagpalit ng account sa parehong tab: bagong usapan, bagong session.
    '$route'() {
      if (sessionStorage.getItem(HISTORY_OWNER_KEY) !== currentOwnerId()) {
        this.resetIfDifferentUser()
        this.messages = [{ ...WELCOME_MESSAGE }]
        this.sessionId = this.createSessionId()
      }
    }
  },

  methods: {
    // Binubura ang usapan kapag ibang account na ang naka-login, para hindi
    // mabasa ng susunod na user ang tinanong ng nauna.
    resetIfDifferentUser() {
      const owner = currentOwnerId()
      if (sessionStorage.getItem(HISTORY_OWNER_KEY) !== owner) {
        sessionStorage.removeItem(HISTORY_STORAGE_KEY)
        sessionStorage.removeItem('chat-session-id')
        sessionStorage.setItem(HISTORY_OWNER_KEY, owner)
      }
    },

    createSessionId() {
      const id =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`

      sessionStorage.setItem('chat-session-id', id)
      return id
    },

    loadConversation() {
      try {
        const stored = JSON.parse(sessionStorage.getItem(HISTORY_STORAGE_KEY) || 'null')
        if (!Array.isArray(stored)) return

        const messages = stored
          .filter((message) =>
            message &&
            (message.role === 'user' || message.role === 'assistant') &&
            typeof message.text === 'string'
          )
          .map((message) => ({
            role: message.role,
            text: redactSecrets(message.text).slice(0, 1000)
          }))
          .slice(-(MAX_VISIBLE_MESSAGES - 1))

        this.messages = [...newConversation(), ...messages]
      } catch (error) {
        console.warn('Could not restore chatbot conversation:', error)
      }
    },

    saveConversation() {
      const messages = this.messages
        .filter((message) =>
          (message.role === 'user' || message.role === 'assistant') &&
          message.kind !== 'error' &&
          typeof message.text === 'string'
        )
        .map((message) => ({
          role: message.role,
          text: redactSecrets(message.text).slice(0, 1000)
        }))
        .slice(-MAX_VISIBLE_MESSAGES)

      try {
        sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(messages))
      } catch (error) {
        console.warn('Could not save chatbot conversation:', error)
      }
    },

    trimConversation() {
      const welcome = this.messages[0]
      const recent = this.messages.slice(1).slice(-(MAX_VISIBLE_MESSAGES - 1))
      this.messages = [welcome, ...recent]
      this.saveConversation()
    },

    scrollConversation() {
      this.$nextTick(() => {
        const panel = this.$refs.conversation
        if (panel) panel.scrollTop = panel.scrollHeight
      })
    },

    starterPrompt(prompt) {
      this.draft = prompt
      return this.sendMessage()
    },

    formatMessage(text) {
      const lines = String(text).split(/\r?\n/)
      const blocks = []
      let paragraph = []
      let list = null
      let codeLines = null

      const flushParagraph = () => {
        if (paragraph.length) blocks.push({ type: 'paragraph', lines: paragraph })
        paragraph = []
      }
      const flushList = () => {
        if (list) blocks.push(list)
        list = null
      }

      for (const line of lines) {
        if (line.trim().startsWith('```')) {
          flushParagraph()
          flushList()
          if (codeLines) {
            blocks.push({ type: 'code', text: codeLines.join('\n') })
            codeLines = null
          } else {
            codeLines = []
          }
          continue
        }
        if (codeLines) {
          codeLines.push(line)
          continue
        }
        if (!line.trim()) {
          flushParagraph()
          flushList()
          continue
        }

        const heading = line.match(/^#{1,3}\s+(.+)$/)
        const bullet = line.match(/^\s*[-*]\s+(.+)$/)
        const numbered = line.match(/^\s*\d+[.)]\s+(.+)$/)
        if (heading) {
          flushParagraph()
          flushList()
          blocks.push({ type: 'heading', text: heading[1] })
        } else if (bullet || numbered) {
          flushParagraph()
          const type = bullet ? 'unordered-list' : 'ordered-list'
          if (!list || list.type !== type) {
            flushList()
            list = { type, items: [] }
          }
          list.items.push((bullet || numbered)[1])
        } else {
          flushList()
          paragraph.push(line)
        }
      }

      flushParagraph()
      flushList()
      if (codeLines) blocks.push({ type: 'code', text: codeLines.join('\n') })
      return blocks
    },

    formatInline(text) {
      const tokens = []
      const pattern = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*\n]+\*|_[^_\n]+_)/g
      let lastIndex = 0
      let match

      while ((match = pattern.exec(text))) {
        if (match.index > lastIndex) {
          tokens.push({ text: text.slice(lastIndex, match.index), tag: 'span' })
        }
        const value = match[0]
        const strong = value.startsWith('**') || value.startsWith('__')
        const code = value.startsWith('`')
        tokens.push({
          text: value.slice(strong ? 2 : 1, -(strong ? 2 : 1)),
          tag: code ? 'code' : strong ? 'strong' : 'em'
        })
        lastIndex = pattern.lastIndex
      }

      if (lastIndex < text.length || !tokens.length) {
        tokens.push({ text: text.slice(lastIndex), tag: 'span' })
      }
      return tokens
    },

    async requestReply(text, history) {
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

      return data
    },

    async sendMessage() {
      const originalText = this.draft.trim()
      if (!originalText || this.isSending) return

      const text = redactSecrets(originalText)
      const wasRedacted = text !== originalText
      const history = this.messages
        .filter((message) =>
          (message.role === 'user' || message.role === 'assistant') &&
          message.kind !== 'error'
        )
        .slice(-API_HISTORY_LIMIT)
        .map(({ role, text: messageText }) => ({ role, text: redactSecrets(messageText) }))

      const userMessage = { role: 'user', text }
      this.messages.push(userMessage)
      if (wasRedacted) {
        this.messages.push({
          role: 'assistant',
          text: 'For your safety, password-like text was removed before your message was sent. Never share passwords or verification codes in chat.'
        })
      }
      this.draft = ''
      this.isSending = true
      this.trimConversation()
      this.scrollConversation()

      try {
        const data = await this.requestReply(text, history)
        if (data.redacted && data.redactedMessage) {
          userMessage.text = redactSecrets(data.redactedMessage)
        }
        this.messages.push({
          role: 'assistant',
          text: data.reply || 'I could not generate a response right now.',
          // Sinasabi ng backend kung saang module galing ang sagot. Kapag
          // hindi ito itinabi dito, nawawala ang daan pabalik sa aral mismo.
          learnMore: data.learnMore || null
        })
      } catch (error) {
        console.error('Chat request failed:', error)
        this.messages.push({
          role: 'assistant',
          kind: 'error',
          text: 'I could not send that message. Please check your connection and try again.',
          retryText: text
        })
      } finally {
        this.isSending = false
        this.trimConversation()
        this.scrollConversation()
      }
    },

    async retryMessage(errorMessage) {
      if (this.isSending || !errorMessage.retryText) return
      this.isSending = true
      const errorIndex = this.messages.indexOf(errorMessage)
      const userIndex = this.messages
        .slice(0, errorIndex)
        .map((message) => message.role)
        .lastIndexOf('user')
      const history = this.messages
        .slice(0, userIndex)
        .filter((message) =>
          (message.role === 'user' || message.role === 'assistant') &&
          message.kind !== 'error'
        )
        .slice(-API_HISTORY_LIMIT)
        .map(({ role, text }) => ({ role, text: redactSecrets(text) }))

      try {
        const data = await this.requestReply(errorMessage.retryText, history)
        this.messages.splice(errorIndex, 1, {
          role: 'assistant',
          text: data.reply || 'I could not generate a response right now.',
          // Sinasabi ng backend kung saang module galing ang sagot. Kapag
          // hindi ito itinabi dito, nawawala ang daan pabalik sa aral mismo.
          learnMore: data.learnMore || null
        })
      } catch (error) {
        console.error('Chat retry failed:', error)
        errorMessage.text = 'I still could not send that message. Please try again.'
      } finally {
        this.isSending = false
        this.trimConversation()
        this.scrollConversation()
      }
    }
  }
}
