<template>
  <div class="list-wrapper container">
    <h2 class="heading-secondary margin-bottom-medium">
      Listado de condiciones
    </h2>

    <div class="flex-container margin-bottom-medium">
      <BaseFilter v-model="search" />

      <BaseButton
        type="button"
        @click="crear"
      >
        Crear una nueva condicion
      </BaseButton>
    </div>

    <List
      :headings="headings"
      :fields="fields"
      :content="reglasFiltradas"
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
        <ListButtonEdit @click="editar(reglas[index])">
          Editar
        </ListButtonEdit>
      </template>
    </List>
  </div>
</template>

<script>
import store from '@/store/store'
import List from '@/components/List'
import ListButtonEdit from '@/components/ListButtonEdit'

import { searchFilter } from '@/searchFilter.js'

export default {
  components: {
    List,
    ListButtonEdit
  },
  beforeRouteEnter (to, from, next) {
    store.dispatch('dispositivos/getAllDispositivos').then(res => next())
  },
  data () {
    return {
      headings: ['Nombre', 'Unidad', 'Operador', 'Valor', 'Dispositivo asociado', 'Acciones'],
      fields: ['nombre', 'unidad', 'operador', 'valor', 'dispositivo'],
      search: ''
    }
  },
  computed: {
    reglas () {
      return this.$store.getters['reglas/getAllReglas']
    },
    dispositivos () {
      return this.$store.getters['dispositivos/getAllDispositivos']
    },
    reglasConNombreDispositivo () {
      const props = this.reglas.map(regla => {
        const filtered = Object.keys(regla)
          .filter(key => ['dispositivoId'].includes(key))
          .reduce((obj, key) => {
            return {
              ...obj,
              [key]: regla[key]
            }
          }, {})

        return filtered
      })

      const ids = props.map(prop => prop.dispositivoId)

      console.log(ids)

      const nombres = ids.map(id => {
        console.log(id)
        return this.dispositivos.find(dispositivo => dispositivo.id === id).nombre
      })

      const reglas = this.reglas.map((el, index) => {
        return { ...el, dispositivo: nombres[index] }
      })

      return reglas
    },
    reglasFiltradas () {
      return searchFilter(this.search, this.reglasConNombreDispositivo)
    }
  },
  created () {
    this.$store.dispatch('reglas/getAllReglas')
  },
  methods: {
    crear () {
      this.$router.push({ name: 'crearRegla' })
    },
    editar (regla) {
      this.$store.commit('reglas/setReglaActual', regla)
      this.$router.push({ name: 'editarRegla', params: { identificador: regla.id.toString() } })
    },
    eliminar (regla) {
      this.$store.dispatch('reglas/darDeBaja', regla)
    }
  }
}
</script>
