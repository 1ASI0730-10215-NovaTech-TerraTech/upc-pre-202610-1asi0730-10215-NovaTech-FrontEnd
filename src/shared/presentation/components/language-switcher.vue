<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, availableLocales } = useI18n()

const selectedLocale = computed({
  get: () => locale.value,
  set: (value) => {
    locale.value = value
  }
})
</script>

<template>
  <div class="switcher" role="group" aria-label="Language switcher">
    <button
      v-for="lang in availableLocales"
      :key="lang"
      type="button"
      class="lang-btn"
      :class="{ active: selectedLocale === lang }"
      @click="selectedLocale = lang"
    >
      {{ lang.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>
.switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.82rem;
  color: #0e2a15;
}

.lang-btn {
  border: none;
  background: transparent;
  color: #0e2a15;
  padding: 0;
  cursor: pointer;
}

.lang-btn + .lang-btn::before {
  content: '|';
  margin-right: 0.2rem;
  color: #0e2a15;
}

.lang-btn.active {
  font-weight: 700;
}
</style>