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

axios.defaults.baseURL = 'http://localhost:8080'
// axios.defaults.baseURL = 'http://192.168.22.6:8080'

Vue.filter('headingsFilter', (value) => {
  switch (value) {
    case 'id':
      return 'ID'
    case 'login':
      return 'Usuario'
    case 'email':
      return 'E-mail'
    case 'activated':
      return 'Estado'
    case 'authorities':
      return 'Tipo de usuario'

    case 'nombre':
      return 'Nombre'
    case 'tipo':
      return 'Tipo'
    case 'activo':
      return 'Estado'
    case 'configuracion':
      return 'Configuracion'
    case 'reglaId':
      return 'Regla'

    default:
      return value
  }
})

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

window.app = app

// Exponer app al testear con Cypress
// if (window.Cypress) {
//   window.__app__ = app
// }
