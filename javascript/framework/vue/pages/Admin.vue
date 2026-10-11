<template>
  <main class="admin-page">
    <section class="admin-container">
      <header class="admin-heading">
        <div>
          <h1>Admin Portal</h1>
          <p>Manage learning modules, quiz questions, and Free or Premium availability.</p>
        </div>
        <router-link to="/" class="admin-back-link">Back to site</router-link>
      </header>

      <p v-if="errorMessage" class="admin-message admin-error" role="alert">{{ errorMessage }}</p>
      <p v-if="successMessage" class="admin-message admin-success" role="status">{{ successMessage }}</p>

      <!-- Dalawang gawain, dalawang tab. Dati magkakasunod lahat sa isang
           mahabang pahina, kaya kailangan pang mag-scroll nang malayo bago
           makita ang talaan ng bayad. -->
      <nav class="admin-tabs" aria-label="Admin sections">
        <button
          type="button"
          class="admin-tab"
          :aria-selected="activeTab === 'modules'"
          @click="activeTab = 'modules'"
        >
          Modules
          <span class="admin-tab-count">{{ modules.length }}</span>
        </button>
        <button
          type="button"
          class="admin-tab"
          :aria-selected="activeTab === 'payments'"
          @click="activeTab = 'payments'"
        >
          Payments
          <span class="admin-tab-count">{{ payments.length }}</span>
        </button>
      </nav>

      <section v-if="activeTab === 'modules'" class="admin-card">
        <div class="admin-card-heading">
          <div>
            <h2>{{ formTitle }}</h2>
            <p>Module changes are saved through the protected admin API.</p>
          </div>
          <button
            v-if="editingModuleId !== null"
            type="button"
            class="admin-secondary-button"
            @click="resetForm"
          >
            Cancel edit
          </button>
        </div>

        <form class="admin-form" @submit.prevent="saveModule">
          <label>
            Module title
            <input v-model.trim="form.module_title" required maxlength="100">
          </label>
          <label>
            Slug
            <input v-model.trim="form.slug" required maxlength="100">
          </label>
          <label>
            Module type
            <select v-model="form.module_type" required>
              <option value="Free">Free</option>
              <option value="Premium">Premium</option>
            </select>
          </label>
          <label>
            Category
            <input v-model.trim="form.category" maxlength="50">
          </label>
          <label class="admin-form-wide">
            Description
            <textarea v-model.trim="form.description" rows="3"></textarea>
          </label>
          <label class="admin-form-wide">
            Video URL
            <input v-model.trim="form.video_url" type="url" maxlength="255">
          </label>
          <div class="admin-form-actions admin-form-wide">
            <button type="submit" class="admin-primary-button" :disabled="isSaving">
              {{ isSaving ? 'Saving…' : editingModuleId === null ? 'Create module' : 'Save changes' }}
            </button>
          </div>
        </form>
      </section>

      <section v-if="activeTab === 'modules'" class="admin-card">
        <div class="admin-card-heading">
          <div>
            <h2>Modules</h2>
            <p>Existing modules available through the backend.</p>
          </div>
          <button type="button" class="admin-secondary-button" :disabled="isLoading" @click="loadModules">
            Refresh
          </button>
        </div>

        <p v-if="isLoading" class="admin-empty-state" role="status">Loading modules…</p>
        <p v-else-if="modules.length === 0" class="admin-empty-state">No modules found.</p>
        <div v-else class="admin-module-list">
          <article v-for="module in modules" :key="module.module_id" class="admin-module-row">
            <div class="admin-module-details">
              <h3>{{ module.module_title }}</h3>
              <p><code>{{ module.slug }}</code> · {{ module.category || 'Uncategorized' }}</p>
              <p class="admin-module-description">{{ module.description || 'No description provided.' }}</p>
            </div>
            <div class="admin-module-actions">
              <span class="admin-type-badge" :class="module.module_type === 'Premium' ? 'is-premium' : 'is-free'">
                {{ module.module_type }}
              </span>
              <button type="button" class="admin-secondary-button" @click="editModule(module)">Edit</button>
              <!-- Nakapangalan dati rito ang isang module, para itago ang
                   pindutan sa module na walang pagsusulit. Pero dito mismo
                   dapat makadagdag ng unang tanong ang admin, kaya ang
                   pagtatago ay siyang humahadlang. May sariling sabi na ang
                   editor kapag wala pang laman. -->
              <button
                type="button"
                class="admin-secondary-button"
                @click="manageQuiz(module)"
              >
                {{ quizModuleId === module.module_id ? 'Close quiz' : 'Manage quiz' }}
              </button>
              <button
                type="button"
                class="admin-delete-button"
                :disabled="deletingModuleId !== null"
                @click="deleteModule(module)"
              >
                {{ deletingModuleId === module.module_id ? 'Deleting…' : 'Delete' }}
              </button>
            </div>
          </article>
        </div>
      </section>

      <!-- Talaan ng bayad.

           Ito ang sagot sa "paano niyo mapapatunayan na walang
           nakakakuha ng Premium nang libre". Hindi yung mga bayad na
           linya ang nagpapatunay niyan -- yung mga naiwang 'pending':
           umalis papuntang PayMongo, hindi bumalik, at Free pa rin. -->
      <section v-if="activeTab === 'payments'" class="admin-card">
        <div class="admin-card-heading">
          <div>
            <h2>Payments</h2>
            <!-- Dati "what the account is now" lang. Sa isang linyang may
                 "not paid" sa tabi ng "Premium", pinagdudugtong ito ng
                 mata: parang nakakuha siya ng Premium nang walang bayad.
                 Hiwalay ang dalawa, at kailangang sabihin. -->
            <p>
              Every checkout that was started. The last column is the account's
              status today, not the result of that one checkout.
            </p>
          </div>
          <button
            type="button"
            class="admin-secondary-button"
            :disabled="isLoadingPayments"
            @click="loadPayments"
          >
            Refresh
          </button>
        </div>

        <p v-if="paymentError" class="admin-message admin-error" role="alert">{{ paymentError }}</p>

        <!-- Hindi ito dapat mangyari habang test mode. Kung lumabas ito,
             totoong pera na ang dumadaan. -->
        <p
          v-if="paymentSummary && paymentSummary.live > 0"
          class="admin-message admin-error"
          role="alert"
        >
          {{ paymentSummary.live }} of these are live payments, not test. Real money moved.
          Check PAYMONGO_SECRET_KEY on Render — it should start with sk_test_.
        </p>

        <p v-if="isLoadingPayments" class="admin-empty-state" role="status">Loading payments…</p>

        <template v-else>
          <div v-if="paymentSummary" class="admin-payment-summary">
            <div>
              <span class="admin-payment-figure">{{ paymentSummary.total }}</span>
              <span class="admin-payment-label">Checkouts started</span>
            </div>
            <div>
              <span class="admin-payment-figure">{{ paymentSummary.paid }}</span>
              <span class="admin-payment-label">Paid</span>
            </div>
            <div>
              <span class="admin-payment-figure">{{ paymentSummary.pending }}</span>
              <span class="admin-payment-label">Never completed</span>
            </div>
            <div>
              <span class="admin-payment-figure">{{ paymentSummary.collected_display }}</span>
              <span class="admin-payment-label">Collected</span>
            </div>
          </div>

          <p v-if="payments.length === 0" class="admin-empty-state">
            No checkout has been started yet.
          </p>

          <div v-else class="admin-table-scroll">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Account</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Method</th>
                  <th>Mode</th>
                  <th>Started</th>
                  <th>Account is now</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="payment in payments" :key="payment.reference_number">
                  <td class="admin-table-ref">{{ payment.reference_number }}</td>
                  <td>
                    {{ payment.email }}
                    <span class="admin-table-sub">{{ payment.name }}</span>
                  </td>
                  <td>
                    {{ payment.amount_display }}
                    <span class="admin-table-sub">{{ payment.billing_period }}</span>
                  </td>
                  <td>
                    <span class="admin-status" :class="statusClass(payment.status)">
                      {{ payment.status }}
                    </span>
                  </td>
                  <td>{{ payment.payment_method || '—' }}</td>
                  <td>
                    <span :class="payment.livemode ? 'admin-status admin-status-failed' : ''">
                      {{ payment.livemode ? 'LIVE' : 'test' }}
                    </span>
                  </td>
                  <td>
                    {{ paymentWhen(payment.created_at) }}
                    <span class="admin-table-sub">
                      {{ payment.paid_at ? 'paid ' + paymentWhen(payment.paid_at) : 'not paid' }}
                    </span>
                  </td>
                  <td>
                    {{ payment.subscription_type }}
                    <span class="admin-table-sub">{{ payment.subscription_status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </section>

      <section v-if="activeTab === 'modules' && quizModuleId !== null" class="admin-card">
        <div class="admin-card-heading">
          <div>
            <h2>Quiz questions</h2>
            <p>Manage the question bank for the selected module.</p>
          </div>
          <button type="button" class="admin-secondary-button" @click="closeQuiz">Close</button>
        </div>

        <p v-if="isLoadingQuestions" class="admin-empty-state" role="status">Loading questions…</p>
        <template v-else-if="quizId !== null">
          <p v-if="questionError" class="admin-message admin-error" role="alert">{{ questionError }}</p>
          <p v-if="questions.length === 0" class="admin-empty-state">
            No questions in this bank yet. Add the first one below.
          </p>
          <div v-else class="admin-module-list">
            <article v-for="question in questions" :key="question.question_id" class="admin-module-row">
              <div class="admin-module-details">
                <h3>{{ question.order_index }}. {{ question.question_text }}</h3>
                <p>{{ questionOptions(question)[question.correct_option_index] }} (correct answer)</p>
              </div>
              <div class="admin-module-actions">
                <button type="button" class="admin-secondary-button" @click="editQuestion(question)">Edit</button>
                <button
                  type="button"
                  class="admin-delete-button"
                  :disabled="isSavingQuestion"
                  @click="deleteQuestion(question)"
                >
                  Delete
                </button>
              </div>
            </article>
          </div>

          <form class="admin-form admin-quiz-form" @submit.prevent="saveQuestion">
            <h3 class="admin-form-wide">{{ editingQuestionId === null ? 'Add a question' : 'Edit question' }}</h3>
            <label class="admin-form-wide">
              Question
              <input v-model.trim="questionForm.question_text" required>
            </label>
            <label v-for="(option, index) in questionForm.options" :key="index">
              Option {{ index + 1 }}
              <input v-model.trim="questionForm.options[index]" required>
            </label>
            <label>
              Correct option
              <select v-model.number="questionForm.correct_option_index">
                <option :value="0">Option 1</option>
                <option :value="1">Option 2</option>
                <option :value="2">Option 3</option>
                <option :value="3">Option 4</option>
              </select>
            </label>
            <label>
              Order
              <input v-model.number="questionForm.order_index" type="number" min="0">
            </label>
            <div class="admin-form-actions admin-form-wide">
              <button type="submit" class="admin-primary-button" :disabled="isSavingQuestion">
                {{ isSavingQuestion ? 'Saving…' : editingQuestionId === null ? 'Add question' : 'Save question' }}
              </button>
              <button
                v-if="editingQuestionId !== null"
                type="button"
                class="admin-secondary-button"
                @click="resetQuestionForm"
              >
                Cancel edit
              </button>
            </div>
          </form>
        </template>
      </section>
    </section>
  </main>
</template>

<script src="./Admin.js"></script>
