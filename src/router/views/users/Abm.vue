<template>
  <Layout>
    <h2 class="heading heading--secondary">
      ABM
    </h2>

    <div :class="$style.wrap">
      <BaseFilter v-model="search" />

      <BaseButton
        :class="$style.button"
        @click="crearUsuario"
      >
        Crear usuario
      </BaseButton>
    </div>

    <Table>
      <template v-slot:header>
        <TableHeader
          v-for="(title, index) in titles"
          :key="index"
          :title="title | toSpanish | capitalize"
        />
      </template>
      <template v-slot:body>
        <User
          v-for="(user, index) in filteredData"
          :key="index"
          :user="user"
        />
      </template>
    </Table>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/main'
import Table from '@/components/users/Table'
import TableHeader from '@/components/users/TableHeader'
import User from '@/components/users/User'

export default {
  components: {
    Layout,
    Table,
    TableHeader,
    User
  },
  filters: {
    toSpanish (value) {
      switch (value) {
        case 'login':
          value = 'Usuario'
          break
        case 'email':
          value = 'E-mail'
          break
        case 'activated':
          value = 'Estado'
          break
        case 'authorities':
          value = 'Tipo de Usuario'
          break
        default:
          break
      }

      return value
    },
    capitalize (value) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  data () {
    return {
      fields: ['id', 'login', 'email', 'activated', 'authorities'],
      search: ''
    }
  },
  computed: {
    titles () {
      return [...this.fields, 'Acciones']
    },
    allUsers () {
      return this.$store.getters['users/getAllUsers'](this.fields)
    },

    filteredData () {
      const lowerCaseSearch = this.search.toLowerCase().trim()

      return this.allUsers.filter(user => {
        // { prop1: 'value1' } -> [prop1, value1]
        return Object.values(user).some(value => {
          return String(value).toLowerCase().includes(lowerCaseSearch)
        })
      })
    }
  },
  created () {
    this.$store.dispatch('users/getAllUsers')
  },
  methods: {
    crearUsuario () {
      this.$router.push({ name: 'create' })
    }
  }
}
</script>

<style lang="scss" module>
  .wrap {
    display: flex;
    width: 100%;
    margin-bottom: 2rem;
  }
</style>
