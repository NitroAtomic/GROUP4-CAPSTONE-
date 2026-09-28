<template>
  <main class="admin-page">
    <section class="admin-container">
      <header class="admin-heading">
        <div>
          <p class="admin-eyebrow">Administration</p>
          <h1>Admin Portal</h1>
          <p>Manage learning modules, quiz questions, and Free or Premium availability.</p>
        </div>
        <router-link to="/" class="admin-back-link">Back to site</router-link>
      </header>

      <p v-if="errorMessage" class="admin-message admin-error" role="alert">{{ errorMessage }}</p>
      <p v-if="successMessage" class="admin-message admin-success" role="status">{{ successMessage }}</p>

      <section class="admin-card">
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

      <section class="admin-card">
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
              <button
                v-if="module.slug !== 'essential-safe-practices-remote-environments'"
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

      <section v-if="quizModuleId !== null" class="admin-card">
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
          <p v-if="questions.length === 0" class="admin-empty-state">No questions found.</p>
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
