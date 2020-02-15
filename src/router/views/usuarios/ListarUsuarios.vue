<template>
  <div class="list-wrapper container">
    <h2 class="heading-secondary margin-bottom-medium">ABM de usuarios</h2>

    <div class="flex-container margin-bottom-medium">
      <BaseFilter v-model="search" />

      <BaseButton type="button" @click="crear">
        Crear un nuevo usuario
      </BaseButton>
    </div>

    <List :fields="fields" :content="filteredUsers">
      <template v-slot:body="{ row, field }">
        <ListItem :row="row" :field="field" />
      </template>
      <template v-slot:botones="{ index }">
        <ListButtonEdit @click="editar(usuarios[index])">Editar</ListButtonEdit>
        <ListButtonToggle @click="modificarEstado(usuarios[index])" :active="usuarios[index].activated">
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
import ListItem from '@/components/ListItem'
import ListButtonEdit from '@/components/ListButtonEdit'
import ListButtonToggle from '@/components/ListButtonToggle'

export default {
  components: {
    List,
    ListItem,
    ListButtonEdit,
    ListButtonToggle
  },
  data () {
    return {
      fields: ['id', 'login', 'email', 'activated', 'authorities'],
      search: ''
    }
  },
  computed: {
    usuarios () {
      return this.$store.getters['usuarios/getAllUsers'](this.fields)
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

      const activated = props.map(prop => prop.activated ? 'Habilitado' : 'Deshabilitado')

      const authorities = props.map(prop => {
        return prop.authorities.map(value => {
          switch (value) {
            case 'ROLE_USER':
              return 'Cliente'
            case 'ROLE_ADMIN':
              return 'Administrador'
            default:
              return value
          }
        })
      })

      const usuarios = this.usuarios.map((el, index) => {
        return { ...el, activated: activated[index], authorities: authorities[index] }
      })

      return usuarios
    },
    filteredUsers () {
      const lowerCaseSearch = this.search.toLowerCase().trim()

      return this.usersToSpanish.filter(element => {
        return Object.values(element).some(value => {
          return String(value).toLowerCase().includes(lowerCaseSearch)
        })
      })
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
