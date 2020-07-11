import Vue from 'vue'
import App from './App.vue'
import Vuelidate from 'vuelidate'
// import router from '@/router/index'
// import store from '@/store/store'
import '@/components/base/_globals'
import '@/styles/main.scss'

Vue.use(Vuelidate)
Vue.config.productionTip = false

new Vue({
  // router,
  // store,
  render: h => h(App)
}).$mount('#app')
