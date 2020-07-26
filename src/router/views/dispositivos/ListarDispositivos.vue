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
      fields: ['nombre', 'tipo', 'activo', 'reglasParseadas'],
      search: '',
      selectedItem: null
    }
  },
  computed: {
    dispositivos () {
      return this.$store.getters['dispositivos/getAllDispositivos']
    },
    // todo -> actualizar estructura de reglas segun nuevo motor de reglas
    dispositivosParseados () {
      const props = this.dispositivos.map(dispositivo => {
        const filtered = Object.keys(dispositivo)
          .filter(key => ['activo', 'reglas'].includes(key))
          .reduce((obj, key) => {
            return {
              ...obj,
              [key]: dispositivo[key]
            }
          }, {})

        return filtered
      })

      const activo = props.map(prop => prop.activo ? 'Habilitado' : 'Deshabilitado')

      const regla = props.map(prop => {
        return prop.reglas.map(innerProp => {
          return `
            Si
            ${this.obtenerMagnitud(innerProp.unidad)}
            ${innerProp.operador}
            ${innerProp.valor}
            ${innerProp.unidad}
            -> Encender Actuador_1
          `
        })
      })

      const dispositivos = this.dispositivos.map((el, index) => {
        return { ...el, activo: activo[index], reglasParseadas: regla[index] }
      })

      return dispositivos
    },
    dispositivosFiltrados () {
      return searchFilter(this.search, this.dispositivosParseados)
    }
  },
  created () {
    this.$store.dispatch('dispositivos/getAllDispositivos')
  },
  methods: {
    obtenerMagnitud,
    detectar () {
      this.$router.push({ name: 'detectarDispositivos' })
    },
    editar (dispositivo) {
      this.$store.commit('dispositivos/setDispositivoActual', dispositivo)
      this.$router.push({ name: 'editarDispositivo', params: { identificador: dispositivo.id.toString() } })
    },
    async modificarEstado (dispositivo) {
      const dispositivoModificado = { ...dispositivo, activo: !dispositivo.activo }

      try {
        await this.$store.dispatch(`dispositivos/modificarEstado`, dispositivoModificado)
      } catch (error) {
        // todo
        console.log(error)
      }
    }
  }
}
</script>
