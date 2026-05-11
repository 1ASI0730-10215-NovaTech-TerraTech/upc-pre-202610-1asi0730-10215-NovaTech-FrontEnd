<script setup>
import { useI18n } from "vue-i18n";
import FooterContent from "./footer-content.vue";
import LanguageSwitcher from "./language-switcher.vue";

const { t } = useI18n();
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <router-link to="/home" class="brand" aria-label="TerraTech Home">
        <img src="/terratech-logo.png" alt="TerraTech" class="brand-logo" />
      </router-link>
      <nav class="nav-links">
        <router-link to="/home">{{ t('nav.home') }}</router-link>
        <router-link to="/about">{{ t('nav.about') }}</router-link>
        <router-link to="/monitoring">{{ t('nav.monitoring') }}</router-link>
        <a href="#">{{ t('nav.subscription') }}</a>
      </nav>
      <language-switcher />
    </header>

    <main class="content">
      <router-view />
    </main>

    <footer-content />
  </div>

</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 0.5rem 1.25rem;
  background: #35c759;
}

.brand {
  display: inline-flex;
  align-items: center;
}

.brand-logo {
  width: 58px;
  height: 58px;
  border-radius: 999px;
  object-fit: cover;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 0.9rem;
}

.nav-links a {
  color: #092c13;
  text-decoration: none;
}


.content {
  flex: 1;
  padding: 0;
}

.nav-links a.router-link-active {
  font-weight: 700;
  text-decoration: underline;
}

@media (max-width: 960px) {
  .topbar {
    flex-wrap: wrap;
  }

  .nav-links {
    order: 3;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    padding-bottom: 0.5rem;
  }
}
</style>