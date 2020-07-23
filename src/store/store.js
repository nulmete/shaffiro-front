import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import dispositivos from './modules/dispositivos'
import dispositivosNoAsociados from './modules/dispositivosNoAsociados'
import reglas from './modules/reglas'
import usuarios from './modules/usuarios'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    dispositivos,
    dispositivosNoAsociados,
    reglas,
    usuarios
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store
