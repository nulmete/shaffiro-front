import Vue from 'vue'
import App from './App.vue'
import Vuelidate from 'vuelidate'
import router from '@/router/index'
import store from '@/store/store'
import axios from 'axios'
import '@/components/base/_globals'
import '@/styles/main.scss'

Vue.use(Vuelidate)
Vue.config.productionTip = false

axios.defaults.baseURL = process.env.NODE_ENV === 'production'
  ? process.env.VUE_APP_MAIN_API_PROD
  : process.env.VUE_APP_MAIN_API_DEV

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
