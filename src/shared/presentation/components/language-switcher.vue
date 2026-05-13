<script setup>
import {computed} from "vue";
import {useI18n} from "vue-i18n";
const { locale, availableLocales } = useI18n();

const locales = computed(() => availableLocales.map((item) => item.toUpperCase()));

const selectLocale = (nextLocale) => {
  locale.value = nextLocale.toLowerCase();
};
</script>

<template>
  <div class="language-switcher" role="group" :aria-label="'Language switcher'">
    <template v-for="(item, index) in locales" :key="item">
      <button
        class="language-switcher__button"
        :class="{ 'is-active': locale.toUpperCase() === item }"
        type="button"
        @click="selectLocale(item)"
      >
        {{ item }}
      </button>
      <span v-if="index < locales.length - 1" class="language-switcher__separator">|</span>
    </template>
  </div>
</template>

<style scoped>

.language-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #6b7280;
  text-transform: uppercase;
}

.language-switcher__button {
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.language-switcher__button.is-active {
  color: #1f2937;
}

.language-switcher__separator {
  color: #cbd5e1;
}

</style>