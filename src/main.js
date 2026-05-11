import { createApp } from 'vue'
import './style.css'
import App from './app.vue'
import router from './router.js'
import i18n from './i18n.js'
import pinia from './pinia.js'

createApp(App)
  .use(router)
  .use(i18n)
  .use(pinia)
  .mount('#app')
