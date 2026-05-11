<script setup>
import {useI18n} from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <section class="about-wrapper">
    <h1>{{ t('about.page-title')}}</h1>
    <img src="/terratech-logo.png" alt="Terratech Logo" width="200" height="200"/>
    <p>{{ t('about.page-content') }}</p>
  </section>
</template>

<style scoped>
.about-wrapper {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  padding: 1rem;
}

</style>