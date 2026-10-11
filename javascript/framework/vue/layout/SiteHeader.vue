<template>
  <header class="site-header">
    <nav class="navbar">

      <div class="nav-left">
        <!-- Sa loob ng admin, wala nang Home at About.

             Hindi ito para sa bumibisita: ito yung likod ng bahay. Yung
             "Back to site" na nasa pahina mismo ang labasan, kaya yung
             Home sa itaas ay pangalawang pinto papunta sa iisang lugar,
             at yung About ay walang kinalaman sa trabaho rito.

             Pangalan na lang ang naiiwan, para malinaw kung nasaan ka. -->
        <span v-if="isAdminPage" class="nav-admin-brand">SE-AWARE Admin</span>
        <template v-else>
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
          <!-- Nakatago dati ang tatlong ito sa admin, para hindi magulo
               ang itaas. Pero ang admin ay may sariling account din: may
               progreso, may resulta ng assessment, at wala siyang
               anumang link papunta roon. Nakakulong siya sa labas ng
               sariling dashboard.

               Hiwalay na ngayon ang dalawang bagay: sa loob ng admin,
               walang nav (nasa itaas, isAdminPage); sa labas nito,
               nakikita niya ang parehong link na nakikita ng iba, dahil
               naaabot naman talaga niya silang lahat. -->
          <router-link v-if="isAuthenticated" to="/dashboard" class="nav-link">Dashboard</router-link>
          <router-link v-if="isPremium" to="/modules/premium" class="nav-link">Role-based</router-link>
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
          <span v-else-if="isPremium" class="dashboard-premium-badge">
            <svg class="inline-crown-icon ui-icon" aria-hidden="true"><use href="#ui-icon-crown" /></svg>
            Premium
          </span>
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
