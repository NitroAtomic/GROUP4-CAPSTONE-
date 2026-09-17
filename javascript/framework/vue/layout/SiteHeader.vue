<template>
  <header class="site-header">
    <nav class="navbar">

      <div class="nav-left">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
        <router-link v-if="isAuthenticated" to="/dashboard" class="nav-link">Dashboard</router-link>
      </div>

      <div class="nav-right">
        <div v-if="!isMinimalNav" class="search-box">
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

        <template v-if="isAuthenticated">
          <div class="dashboard-user-area">
            <span class="dashboard-user-icon" aria-hidden="true">●</span>
            <span class="dashboard-user-name">{{ firstName }}</span>
          </div>
          <span v-if="isPremium" class="dashboard-premium-badge">
            <img class="inline-crown-icon" src="/images/icons/crown-badge.png" alt="" aria-hidden="true">
            Premium
          </span>
          <router-link v-if="!isPremium && !isMinimalNav" to="/premium-subscription" class="btn btn-premium">Go Premium</router-link>
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
