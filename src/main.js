import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import Vuelidate from 'vuelidate'
import router from '@/router/index'
import store from './store/store'
import '@/components/base/_globals'
import '@/styles/main.scss'

Vue.use(Vuelidate)
Vue.config.productionTip = false

// axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.baseURL = 'https://shaffiro.morlax.com.ar/backend'

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// window.app = app

// Exponer app al testear con Cypress
if (window.Cypress) {
  window.__app__ = app
}
