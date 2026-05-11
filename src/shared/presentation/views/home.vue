<script setup>
import {useI18n} from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <section class="home-hero">
    <div class="overlay"></div>

    <div class="hero-content">
      <img src="/terratech-logo.png" alt="TerraTech Logo" class="hero-logo" />
      <h1>{{ t('about.title') }}</h1>
      <p>{{ t('about.content') }}</p>
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  position: relative;
  min-height: 540px;
  background-image: url('/fondo-home.png');
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(10, 34, 16, 0.3), rgba(5, 17, 8, 0.5));
}

.hero-content {
  position: absolute;
  top: 1.8rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: #f4fff4;
  z-index: 1;
}

.hero-logo {
  width: 86px;
  height: 86px;
  border-radius: 999px;
}

.hero-content h1 {
  margin: 0.3rem 0;
  color: #f4fff4;
  font-size: 2.1rem;
}

.hero-content p {
  color: #e6f9e8;
}

@media (max-width: 900px) {
  .home-hero {
    min-height: 460px;
  }

  .hero-content h1 {
    font-size: 1.6rem;
  }

}

</style>