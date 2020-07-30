<template>
  <Listado
    :headings="headings"
    :fields="fields"
    :content="dispositivosFiltrados"
    :search-prop="search"
    @searched="search = $event"
    @selected="selectedItem = $event"
  >
    <template v-slot:heading>
      Dispositivos
    </template>

    <template v-slot:buttons>
      <base-button
        ref="detectar"
        @click="detectar"
      >
        Detectar dispositivos
      </base-button>

      <base-button
        ref="editar"
        :disabled="selectedItem === null"
        @click="editar(dispositivos[selectedItem])"
      >
        Editar
      </base-button>
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
      <template v-else-if="field === 'activo'">
        <span
          id="modificar"
          :class="[row[field] === 'Deshabilitado' ? 'disabled' : 'enabled']"
          @click="modificarEstado(dispositivos[index])"
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
import { obtenerMagnitud } from '@/utils/reglas'
import { searchFilter } from '@/utils/searchFilter'

export default {
  components: {
    Listado
  },
  data () {
    return {
      headings: ['Nombre', 'Tipo', 'Estado', 'Reglas'],
      fields: ['nombre', 'tipo', 'activo', 'reglas'],
      search: '',
      selectedItem: null,
      error: null
    }
  },
  computed: {
    dispositivos () {
      return this.$store.getters['dispositivos/getAllDispositivos']
    },
    reglas () {
      return this.$store.getters['reglas/getAllReglas']
    },
    dispositivosParseados () {
      const props = this.dispositivos.map(dispositivo => {
        const filtered = Object.keys(dispositivo)
          .filter(key => ['activo'].includes(key))
          .reduce((obj, key) => {
            return {
              ...obj,
              [key]: dispositivo[key]
            }
          }, {})

        return filtered
      })

      const activo = props.map(prop => prop.activo ? 'Habilitado' : 'Deshabilitado')

      const reglas = this.reglas.filter((regla, i) => {
        return regla.antecedents[0].id1 === this.dispositivos[i].id || regla.consequences[0].id2 === this.dispositivos[i].id
      })

      const reglasName = reglas.map(r => r.name)

      const dispositivos = this.dispositivos.map((el, index) => {
        // return { ...el, activo: activo[index], reglasParseadas: regla[index] }
        return { ...el, activo: activo[index], reglas: reglasName }
      })

      return dispositivos
    },
    dispositivosFiltrados () {
      return searchFilter(this.search, this.dispositivosParseados)
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    obtenerMagnitud,
    fetchData () {
      this.$store.dispatch('dispositivos/getAllDispositivos')
      this.$store.dispatch('reglas/getAllReglas')
    },
    detectar () {
      this.$router.push({ name: 'detectarDispositivos' })
    },
    editar (dispositivo) {
      this.$store.commit('dispositivos/setDispositivoActual', dispositivo)
      this.$router.push({ name: 'editarDispositivo' })
    },
    async modificarEstado (dispositivo) {
      const dispositivoModificado = { ...dispositivo, activo: !dispositivo.activo }

      try {
        await this.$store.dispatch(`dispositivos/modificarEstado`, dispositivoModificado)
      } catch (error) {
        // todo
        this.error = error.message
      }
    }
  }
}
</script>
