<template>
  <div v-show="!hidden" class="chatbot-widget">
    <section
      class="chatbot-panel"
      :class="{ 'chatbot-panel-open': isOpen }"
      aria-label="CyberWise learning assistant"
    >
      <header class="chatbot-header">
        <div class="chatbot-assistant-information">
          <div class="chatbot-assistant-icon" aria-hidden="true">
            <!-- Ang CyberWise badge mismo, hindi "CW" na titik lang. Nasa repo
                 na ang logo, hindi lang nagagamit. -->
            <img src="/images/icons/cyberwise-logo.png" alt="">
          </div>
          <div class="chatbot-assistant-details">
            <h2>CyberWise</h2>
            <p class="chatbot-status">Learning assistant</p>
          </div>
        </div>

        <button
          type="button"
          class="chatbot-close-button"
          aria-label="Close CyberWise"
          @click="isOpen = false"
        >
          ×
        </button>
      </header>

      <div
        ref="conversation"
        class="chatbot-conversation"
        aria-live="polite"
      >
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="chatbot-message"
          :class="[
            message.role === 'user' ? 'chatbot-user-message' : 'chatbot-assistant-message',
            { 'chatbot-error-message': message.kind === 'error' }
          ]"
        >
          <template v-for="(block, blockIndex) in formatMessage(message.text)" :key="blockIndex">
            <component
              :is="block.type === 'heading' ? 'h3' : 'div'"
              v-if="block.type === 'heading'"
              class="chatbot-message-heading"
            >
              <component
                :is="token.tag"
                v-for="(token, tokenIndex) in formatInline(block.text)"
                :key="tokenIndex"
              >{{ token.text }}</component>
            </component>
            <p v-else-if="block.type === 'paragraph'" class="chatbot-message-paragraph">
              <template v-for="(line, lineIndex) in block.lines" :key="lineIndex">
                <component
                  :is="token.tag"
                  v-for="(token, tokenIndex) in formatInline(line)"
                  :key="tokenIndex"
                >{{ token.text }}</component>
                <br v-if="lineIndex < block.lines.length - 1">
              </template>
            </p>
            <ul v-else-if="block.type === 'unordered-list'" class="chatbot-message-list">
              <li v-for="(item, itemIndex) in block.items" :key="itemIndex">
                <component
                  :is="token.tag"
                  v-for="(token, tokenIndex) in formatInline(item)"
                  :key="tokenIndex"
                >{{ token.text }}</component>
              </li>
            </ul>
            <ol v-else-if="block.type === 'ordered-list'" class="chatbot-message-list">
              <li v-for="(item, itemIndex) in block.items" :key="itemIndex">
                <component
                  :is="token.tag"
                  v-for="(token, tokenIndex) in formatInline(item)"
                  :key="tokenIndex"
                >{{ token.text }}</component>
              </li>
            </ol>
            <pre v-else-if="block.type === 'code'" class="chatbot-message-code"><code>{{ block.text }}</code></pre>
          </template>
          <button
            v-if="message.kind === 'error'"
            type="button"
            class="chatbot-retry-button"
            :disabled="isSending"
            @click="retryMessage(message)"
          >
            Retry
          </button>
        </div>

        <div v-if="!hasUserMessages" class="chatbot-starter-prompts" aria-label="Suggested questions">
          <p>Try asking</p>
          <button
            v-for="prompt in starterPrompts"
            :key="prompt"
            type="button"
            :disabled="isSending"
            @click="starterPrompt(prompt)"
          >
            {{ prompt }}
          </button>
        </div>

        <p v-if="isSending" class="chatbot-message chatbot-loading-message" role="status">
          CyberWise is thinking…
        </p>
      </div>

      <form class="chatbot-message-form" @submit.prevent="sendMessage">
        <label for="chatbot-message-input" class="chatbot-hidden-label">
          Ask CyberWise something
        </label>

        <div class="chatbot-input-container">
          <input
            id="chatbot-message-input"
            v-model="draft"
            type="text"
            name="message"
            placeholder="Ask CyberWise something..."
            autocomplete="off"
            :disabled="isSending"
          >
          <button
            type="submit"
            class="chatbot-send-button"
            aria-label="Send message to CyberWise"
            :disabled="isSending || !draft.trim()"
          >
            ➤
          </button>
        </div>
      </form>
    </section>

    <button
      type="button"
      class="chatbot-floating-button"
      aria-label="Open CyberWise learning assistant"
      @click="isOpen = !isOpen"
    >
      <span class="chatbot-floating-button-icon">
        <img src="/images/icons/cyberwise-logo.png" alt="">
      </span>
    </button>
  </div>
</template>

<script src="./ChatbotWidget.js"></script>
