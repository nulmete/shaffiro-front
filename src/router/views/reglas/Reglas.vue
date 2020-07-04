<template>
  <Listado
    :headings="headings"
    :fields="fields"
    :content="reglasFiltradas"
    :search-prop="search"
    @searched="search = $event"
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
        type="button"
        @click="editar(reglas[selectedItem])"
      >
        Editar
      </BaseButton>

      <BaseButton
        :disabled="selectedItem === null"
        type="button"
        @click="eliminar(reglas[selectedItem])"
      >
        Dar de baja
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
import store from '@/store/store'
import Listado from '@/router/views/layouts/Listado'
import { searchFilter } from '@/searchFilter.js'

export default {
  components: {
    Listado
  },
  beforeRouteEnter (to, from, next) {
    store.dispatch('dispositivos/getAllDispositivos').then(res => next())
  },
  data () {
    return {
      headings: ['Nombre', 'Unidad', 'Operador', 'Valor', 'Sensor Asociado', 'Actuador Asociado', 'Acción'],
      fields: ['nombre', 'unidad', 'operador', 'valor', 'dispositivo'],
      search: '',
      selectedItem: null
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

      const nombres = ids.map(id => {
        return this.dispositivos.find(dispositivo => dispositivo.id === id).nombre
      })

      const reglas = this.reglas.map((el, index) => {
        return { ...el, dispositivo: nombres[index] }
      })

      return reglas
    },
    reglasFiltradas () {
      return searchFilter(this.search, this.reglasConNombreDispositivo)
      // return searchFilter(this.search, this.reglas)
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
      this.$store.dispatch('reglas/eliminarRegla', regla)
    }
  }
}
</script>
