<script setup>
import LanguageSwitcher from "./language-switcher.vue";
import {ref} from "vue";
import {useI18n} from "vue-i18n";


const { t } = useI18n();

const drawer = ref(false);
const toggleDrawer = () => {
  /**
   * Toggles the state of the drawer between open and closed.
   */
  drawer.value = !drawer.value;
}

const items = [
  { label: "nav.home", to: "/home", icon: "📊" },
  { label: "nav.inventory", to: "/inventory", icon: "📦" },
  { label: "nav.monitoring", to: "/monitoring", icon: "🌾" },
  { label: "nav.monitoring", to: "/monitoring/devices", icon: "🌾" },
  { label: "commercial.catalog-title", to: "/commercial/catalog", icon: "🛍️" },
  { label: "nav.payment", to: "/payment", icon: "💳" },
  { label: "nav.analytics", to: "/analytics/dashboard", icon: "📈" }
];
</script>

<template>
  <div class="layout">

    <!-- =====================================================
         SIDEBAR
    ====================================================== -->
    <header class="header">
      <aside class="sidebar">

        <!-- LOGO / BRAND -->
        <div class="sidebar-header">
          <router-link to="/home" class="logo-brand">
            <img
                src="/terratech-logo.png"
                alt="TerraTech"
                class="logo"
            />
          </router-link>

          <h2 class="brand-name">TerraTech</h2>
        </div>

        <!-- NAVIGATION -->
        <nav class="nav-menu">
          <router-link
              v-for="item in items"
              :key="item.label"
              :to="item.to"
              class="nav-item"
          >
            <span class="nav-icon">
              {{ item.icon }}
            </span>

            <span class="nav-label">
              {{ t(item.label) }}
            </span>
          </router-link>
        </nav>

        <!-- BOTTOM SECTION -->
        <div class="nav-bottom">
          <router-link to="/settings" class="nav-item">
            <span class="nav-icon">⚙️</span>

            <span class="nav-label">
              {{ t('nav.settings') }}
            </span>
          </router-link>
        </div>

      </aside>
    </header>

    <!-- =====================================================
         MAIN CONTENT
    ====================================================== -->
    <main class="main-content">

      <!-- TOPBAR -->
      <section class="topbar">

        <div class="topbar-left">
          <h1 class="page-title">
            {{ t('app.panel-title') }}
          </h1>
        </div>

        <div class="topbar-right">
          <language-switcher />
        </div>

      </section>

      <!-- DYNAMIC ROUTE CONTENT -->
      <section class="content">
        <router-view />
      </section>

    </main>

  </div>
  <pv-confirm-dialog></pv-confirm-dialog>
</template>

<style scoped>
:root {
  --color-primary: #1A2B4C;
  --color-success: #00BB31;
  --color-white: #FFFFFF;
  --color-border: #E0E0E0;
  --color-light: #F5F7FA;
}

/* =========================================================
   GLOBAL LAYOUT
========================================================= */
.layout {
  min-height: 100vh;
  background: var(--color-light);
}

/* =========================================================
   SIDEBAR
========================================================= */
.header {
  width: 240px;
  flex-shrink: 0;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;

  width: 240px;
  height: 100vh;

  display: flex;
  flex-direction: column;

  background: var(--color-white);
  color: var(--color-primary);

  padding: 1.5rem 1rem;

  border-right: 1px solid var(--color-border);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
}

/* =========================================================
   SIDEBAR HEADER
========================================================= */
.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: center;

  padding-bottom: 2rem;
  margin-bottom: 2rem;
}

.logo-brand {
  text-decoration: none;
  margin-bottom: 0.75rem;
}

.logo {
  width: 55px;
  height: 55px;
  object-fit: cover;
}

.brand-name {
  margin: 0;

  font-size: 1.15rem;
  font-weight: 600;

  color: var(--color-primary);
}

/* =========================================================
   NAVIGATION MENU
========================================================= */
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  padding: 0.8rem 1rem;

  border-radius: 8px;

  color: var(--color-primary);
  text-decoration: none;

  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(0, 187, 49, 0.08);
}

.nav-item.router-link-active {
  background: rgba(0, 187, 49, 0.12);
  font-weight: 600;
}

.nav-icon {
  width: 22px;
  text-align: center;
}

.nav-label {
  flex: 1;
}

/* =========================================================
   SIDEBAR BOTTOM SECTION
========================================================= */
.nav-bottom {
  padding-top: 1rem;
}

/* =========================================================
   MAIN CONTENT AREA
========================================================= */
.main-content {
  flex: 1;

  margin-left: 240px;

  display: flex;
  flex-direction: column;

  min-height: 100vh;
}

/* =========================================================
   TOPBAR
========================================================= */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;

  padding: 1.25rem 2rem;

  background: var(--color-white);

  border-bottom: 1px solid var(--color-border);

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.topbar-left,
.topbar-right {
  display: flex;
  align-items: center;
}

.page-title {
  margin: 0;

  color: var(--color-primary);

  font-size: 1.4rem;
  font-weight: 600;
}

/* =========================================================
   ROUTER VIEW CONTENT
========================================================= */
.content {
  flex: 1;
  padding: 2.5rem 3rem;
}

/* =========================================================
   RESPONSIVE - TABLET
========================================================= */
@media (max-width: 768px) {

  .header,
  .sidebar {
    width: 200px;
  }

  .main-content {
    margin-left: 200px;
  }

  .content {
    padding: 2rem;
  }

  .topbar {
    padding: 1rem 1.5rem;
  }
}

/* =========================================================
   RESPONSIVE - MOBILE
========================================================= */
@media (max-width: 600px) {

  .header,
  .sidebar {
    width: 90px;
  }

  .main-content {
    margin-left: 90px;
  }

  .brand-name,
  .nav-label {
    display: none;
  }

  .nav-item {
    justify-content: center;
  }

  .sidebar-header {
    padding-bottom: 1.5rem;
  }

  .content {
    padding: 1.25rem;
  }

  .page-title {
    font-size: 1.1rem;
  }
}
</style>