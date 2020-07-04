<template>
  <Listado
    :headings="headings"
    :fields="fields"
    :content="filteredUsers"
    :search-prop="search"
    @searched="search = $event"
  >
    <template v-slot:heading>
      Usuarios
    </template>

    <template v-slot:buttons>
      <BaseButton
        type="button"
        @click="crear"
      >
        Crear usuario
      </BaseButton>

      <BaseButton
        :disabled="selectedItem === null"
        type="button"
        @click="editar(usuarios[selectedItem])"
      >
        Editar
      </BaseButton>
    </template>

    <template v-slot:radio-button="{ index }">
      <div class="radio">
        <input
          :id="index"
          v-model="selectedItem"
          name="radio"
          :value="index"
          type="radio"
          class="radio__input"
        >
        <label
          class="radio__label"
          :for="index"
        >
          <span class="radio__btn" />
        </label>
      </div>
    </template>

    <template v-slot:content="{ row, field, index }">
      <template v-if="Array.isArray(row[field])">
        <div
          v-for="(value, index) in row[field]"
          :key="index"
        >
          {{ value }}
        </div>
      </template>
      <template v-else-if="field === 'activated'">
        <span
          :class="[row[field] === 'Deshabilitado' ? 'disabled' : 'enabled']"
          @click="modificarEstado(usuarios[index])"
        >
          {{ row[field] }}
        </span>
      </template>
      <template v-else>
        {{ row[field] }}
      </template>
    </template>
  </Listado>
</template>

<script>
import Listado from '@/router/views/layouts/Listado'
import { translateAuthorities } from '@/translations.js'
import { searchFilter } from '@/searchFilter.js'

export default {
  components: {
    Listado
  },
  data () {
    return {
      headings: ['Nombre', 'E-mail', 'Estado', 'Tipo'],
      fields: ['login', 'email', 'activated', 'authorities'],
      search: '',
      selectedItem: null
    }
  },
  computed: {
    usuarios () {
      const usuarios = this.$store.getters['usuarios/getAllUsers']

      return usuarios.map(usuario => ({
        id: usuario.id,
        login: usuario.login,
        email: usuario.email,
        activated: usuario.activated,
        authorities: usuario.authorities
      }))
    },
    usersToSpanish () {
      const props = this.usuarios.map(user => {
        const filtered = Object.keys(user)
          .filter(key => ['activated', 'authorities'].includes(key))
          .reduce((obj, key) => {
            return {
              ...obj,
              [key]: user[key]
            }
          }, {})

        return filtered
      })

      // Traducir a español el estado de todos los usuarios
      const activated = props.map(prop => prop.activated ? 'Habilitado' : 'Deshabilitado')

      // Traducir a español los roles de todos los usuario
      const authorities = props.map(prop => {
        return prop.authorities.map(value => translateAuthorities(value))
      })

      const usuarios = this.usuarios.map((el, index) => {
        return { ...el, activated: activated[index], authorities: authorities[index] }
      })

      return usuarios
    },
    filteredUsers () {
      return searchFilter(this.search, this.usersToSpanish)
    }
  },
  created () {
    this.$store.dispatch('usuarios/getAllUsers')
  },
  methods: {
    crear () {
      this.$router.push({ name: 'crearUsuario' })
    },
    editar (usuario) {
      this.$store.commit('usuarios/setCurrentUser', usuario)
      this.$router.push({ name: 'editarUsuario', params: { identificador: usuario.id.toString() } })
    },
    async modificarEstado (usuario) {
      const usuarioModificado = { ...usuario, activated: !usuario.activated }

      try {
        await this.$store.dispatch(`usuarios/modificarEstado`, usuarioModificado)
      } catch (error) {
        // TODO
        console.log(error)
      }
    }
  }
}
</script>
