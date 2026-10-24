<template>
  <header class="site-header">
    <nav class="navbar">
      <div class="nav-left">
        <span v-if="isAdminPage" class="nav-admin-brand">SE-AWARE Admin</span>
        <template v-else>
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/about" class="nav-link">About</router-link>

          <span
            v-if="isPremium"
            class="nav-premium-divider"
            aria-hidden="true"
          ></span>

          <router-link v-if="isAuthenticated" to="/dashboard" class="nav-link">Dashboard</router-link>
          <router-link v-if="isPremium" to="/modules/premium" class="nav-link">Modules</router-link>
          <router-link v-if="isPremium" to="/assessment/question" class="nav-link">Assessment</router-link>
          <router-link v-if="isAdmin" to="/admin" class="nav-link">Admin Portal</router-link>
        </template>
      </div>

      <div class="nav-right">
        <div v-if="!isMinimalNav && !isAdminPage" class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            aria-label="Search modules"
            @keyup.enter="goToFirstResult"
          >
          <div v-if="searchQuery.trim()" class="search-results">
            <router-link
              v-for="result in searchResults"
              :key="result.id"
              :to="result.link"
              class="search-result-item"
              @click="clearSearch"
            >
              {{ result.title }}
            </router-link>
            <p v-if="searchResults.length === 0" class="search-no-results">
              No matching modules
            </p>
          </div>
        </div>

        <button
          type="button"
          class="btn btn-theme-toggle"
          :aria-pressed="isDark() ? 'true' : 'false'"
          :title="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleTheme"
        >
          <svg class="ui-icon" aria-hidden="true">
            <use :href="isDark() ? '#ui-icon-sun' : '#ui-icon-moon'" />
          </svg>
          <span class="sr-only">{{ isDark() ? 'Switch to light mode' : 'Switch to dark mode' }}</span>
        </button>

        <template v-if="isAuthenticated">
          <div class="dashboard-user-area">
            <svg class="dashboard-user-icon ui-icon" aria-hidden="true"><use href="#ui-icon-user" /></svg>
            <span class="dashboard-user-name">Hi, {{ firstName }}</span>
          </div>
          <span v-if="isAdmin" class="dashboard-premium-badge">Administrator</span>
          <router-link v-else-if="isPremium" to="/modules/premium" class="dashboard-premium-badge dashboard-premium-link" title="Open your premium courses">
            <svg class="inline-crown-icon ui-icon" aria-hidden="true"><use href="#ui-icon-crown" /></svg>
            Premium
          </router-link>
          <router-link v-if="!isPremium && !isAdmin && !isMinimalNav" to="/premium-subscription" class="btn btn-premium">Go Premium</router-link>
          <button type="button" class="btn btn-logout" @click="logout">Log out</button>
        </template>
        <template v-else>
          <router-link to="/login" class="btn btn-login">Log in</router-link>
          <router-link v-if="!isMinimalNav" to="/premium-subscription" class="btn btn-premium">Go Premium</router-link>
        </template>
      </div>
    </nav>
  </header>
</template>

<script src="./SiteHeader.js"></script>

<style scoped>
.nav-premium-divider {
  display: inline-block;
  flex: 0 0 2px;
  align-self: center;
  width: 2px;
  height: 36px;
  margin: 0 8px;
  border-radius: 2px;
  background: rgba(245, 166, 35, 0.65);
}

@media (max-width: 620px) {
  .nav-premium-divider {
    display: none;
  }
}
</style>
