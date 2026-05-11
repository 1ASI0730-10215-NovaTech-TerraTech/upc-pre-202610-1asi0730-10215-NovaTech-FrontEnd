<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <footer class="footer">
    <p>{{ t('footer.description') }}</p>
    <p>{{ t('footer.copyright') }}</p>
    <p class="footer-links">
      <router-link to="/about">{{ t('footer.about-link') }}</router-link>
      <span>|</span>
      <router-link to="/monitoring">{{ t('footer.monitoring-link') }}</router-link>
    </p>
  </footer>
</template>

<style scoped>
.footer {
  background: #0e2a15;
  color: #d9f4de;
  text-align: center;
  padding: 1rem;
  border-top: 2px solid #2f8a46;
}

.footer p {
  margin: 0.2rem 0;
}

.footer-links {
  display: inline-flex;
  gap: 0.5rem;
}

.footer a {
  color: #b5efc2;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

</style>