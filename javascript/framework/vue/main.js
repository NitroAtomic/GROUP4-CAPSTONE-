import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router.js'
import '../../../css/framework/tailwind/main.css'

createApp(App).use(createPinia()).use(router).mount('#app')