<template>
  <div class="list-wrapper container">
    <h2 class="heading-secondary margin-bottom-medium">
      Listado de usuarios
    </h2>

    <div class="flex-container margin-bottom-medium">
      <BaseFilter v-model="search" />

      <BaseButton
        type="button"
        @click="crear"
      >
        Crear un nuevo usuario
      </BaseButton>
    </div>

    <List
      :headings="headings"
      :fields="fields"
      :content="filteredUsers"
    >
      <template v-slot:body="{ row, field }">
        <template v-if="Array.isArray(row[field])">
          <div
            v-for="(value, index) in row[field]"
            :key="index"
          >
            {{ value }}
          </div>
        </template>
        <template v-else>
          {{ row[field] }}
        </template>
      </template>

      <template v-slot:buttons="{ index }">
        <ListButtonEdit @click="editar(usuarios[index])">
          Editar
        </ListButtonEdit>
        <ListButtonToggle
          :active="usuarios[index].activated"
          @click="modificarEstado(usuarios[index])"
        >
          <template v-if="usuarios[index].activated">
            Deshabilitar
          </template>
          <template v-else>
            Habilitar
          </template>
        </ListButtonToggle>
      </template>
    </List>
  </div>
</template>

<script>
import List from '@/components/List'
import ListButtonEdit from '@/components/ListButtonEdit'
import ListButtonToggle from '@/components/ListButtonToggle'

import { translateAuthorities } from '@/translations.js'
import { searchFilter } from '@/searchFilter.js'

export default {
  components: {
    List,
    ListButtonEdit,
    ListButtonToggle
  },
  data () {
    return {
      headings: ['Nombre', 'E-mail', 'Estado', 'Tipo', 'Acciones'],
      fields: ['login', 'email', 'activated', 'authorities'],
      search: ''
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
        console.log(error)
      }
    }
  }
}
</script>
