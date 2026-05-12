<script setup>
import { useI18n } from "vue-i18n";
import LanguageSwitcher from "./language-switcher.vue";

const { t } = useI18n();
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="sidebar-header">
        <router-link to="/home" class="logo-brand">
          <img src="/terratech-logo.png" alt="TerraTech" class="logo" />
        </router-link>
        <h2 class="brand-name">TerraTech</h2>
      </div>

      <nav class="nav-menu">
        <router-link to="/home" class="nav-item">
          <span class="nav-icon">📊</span>
          <span class="nav-label">{{ t('nav.home') }}</span>
        </router-link>
        <router-link to="/monitoring" class="nav-item">
          <span class="nav-icon">🌾</span>
          <span class="nav-label">{{ t('nav.monitoring') }}</span>
        </router-link>
        <router-link to="/payment" class="nav-item">
          <span class="nav-icon">💳</span>
          <span class="nav-label">{{ t('nav.payment') }}</span>
        </router-link>
      </nav>

      <div class="nav-bottom">
        <router-link to="#" class="nav-item settings">
          <span class="nav-icon">⚙️</span>
          <span class="nav-label">{{ t('nav.settings') }}</span>
        </router-link>
      </div>
    </aside>

    <div class="main-wrapper">
      <header class="topbar">
        <div class="topbar-left">
          <h1 class="page-title">{{ t('app.panel-title') }}</h1>
        </div>
        <div class="topbar-right">
          <language-switcher />
        </div>
      </header>

      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
:root {
  --color-primary: #1A2B4C;
  --color-success: #00BB31;
  --color-white: #FFFFFF;
  --color-black: #000000;
  --color-light: #F5F7FA;
  --color-border: #E0E0E0;
}

.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--color-white);
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: 240px;
  background: var(--color-primary);
  color: var(--color-white);
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
}

.logo-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  text-decoration: none;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-success);
}

.brand-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-white);
  text-align: center;
}

/* ===== NAV MENU ===== */
.nav-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.75rem;
  border-radius: 6px;
  color: var(--color-white);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s;
  cursor: pointer;
}

.nav-item:hover {
  background: rgba(0, 187, 49, 0.15);
  color: var(--color-success);
}

.nav-item.router-link-active {
  background: var(--color-success);
  color: var(--color-primary);
  font-weight: 600;
}

.nav-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-label {
  flex: 1;
}

.nav-bottom {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.settings {
  justify-content: flex-start;
}

/* ===== MAIN WRAPPER ===== */
.main-wrapper {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  background: var(--color-white);
}

/* ===== TOPBAR ===== */
.topbar {
  background: var(--color-white);
  border-bottom: 2px solid var(--color-border);
  padding: 1.25rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.topbar-left {
  flex: 1;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-title {
  margin: 0;
  color: var(--color-primary);
  font-size: 1.4rem;
  font-weight: 600;
}

/* ===== CONTENT ===== */
.content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: var(--color-white);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
    padding: 1rem 0;
  }

  .sidebar-header {
    padding: 0 1rem 1.5rem;
  }

  .logo {
    width: 45px;
    height: 45px;
  }

  .brand-name {
    font-size: 1rem;
  }

  .main-wrapper {
    margin-left: 200px;
  }

  .topbar {
    padding: 1rem;
    height: auto;
  }

  .page-title {
    font-size: 1.2rem;
  }

  .content {
    padding: 1.5rem;
  }
}

@media (max-width: 600px) {
  .sidebar {
    width: 180px;
  }

  .nav-label {
    display: none;
  }

  .nav-item {
    justify-content: center;
  }


  .main-wrapper {
    margin-left: 180px;
  }

  .page-title {
    font-size: 1rem;
  }

  .topbar {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>