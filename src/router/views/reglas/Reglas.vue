<template>
  <Listado
    :headings="headings"
    :fields="fields"
    :content="reglasFiltradas"
    :search-prop="search"
    @searched="search = $event"
    @selected="selectedItem = $event"
  >
    <template v-slot:heading>
      Reglas
    </template>

    <template v-slot:buttons>
      <BaseButton
        type="button"
        @click="crear"
      >
        Crear regla
      </BaseButton>

      <BaseButton
        :disabled="selectedItem === null"
        @click="editar(reglas[selectedItem])"
      >
        Editar
      </BaseButton>
    </template>

    <template v-slot:content="{ row, field }">
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
  </Listado>
</template>

<script>
import Listado from '@/router/views/layouts/Listado'
import { searchFilter } from '@/utils/searchFilter'
import { transformarOperador, obtenerMagnitud, parsearReglas } from '@/utils/reglas'

export default {
  components: {
    Listado
  },
  data () {
    return {
      headings: ['Nombre', 'Descripción', 'Sensor asociado', 'Actuador asociado'],
      fields: ['nombre', 'descripcion', 'sensorAsociado', 'actuadorAsociado'],
      search: '',
      selectedItem: null
    }
  },
  computed: {
    reglas () {
      return this.$store.getters['reglas/getAllReglas']
    },
    sensores () {
      return this.$store.getters['dispositivos/getSensores']
    },
    actuadores () {
      return this.$store.getters['dispositivos/getActuadores']
    },
    reglasParseadas () {
      return this.parsearReglas(this.reglas, this.sensores, this.actuadores)
    },
    reglasFiltradas () {
      return searchFilter(this.search, this.reglasParseadas)
    }
  },
  created () {
    this.$store.dispatch('dispositivos/getAllDispositivos')
    this.$store.dispatch('reglas/getAllReglas')
  },
  methods: {
    transformarOperador,
    obtenerMagnitud,
    parsearReglas,
    crear () {
      this.$router.push({ name: 'crearRegla' })
    },
    editar (regla) {
      this.$store.commit('reglas/setReglaActual', regla)
      this.$router.push({ name: 'editarRegla' })
    }
  }
}
</script>
