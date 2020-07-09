<template>
  <!--
    -- Nombre de la Regla: regla.name
    -- Sensor ID: regla.antecedents[0].id1 => hacer un find con el listado de dispositivos tipo sensor
    -- Actuador ID: regla.consequences[0].id2 => hacer un find con el listado de dispositivos tipo actuador
    -- Antecedente: v-for de regla.antecedents
        * si length = 1, quiere decir que solo tengo una condición, parseo esa condición
        * si length > 1, quiere decir que tengo al menos 2 condiciones, parseo esas condiciones
          ** Si
            <magnitud> [0].op + [0].vs + [0].unit +
            [1].conector +
            <magnitud> [1].op + [1].vs + [1].unit + ...
    -- "ENTONCES"
    -- Consecuente: es un array con un solo elemento, que es un object
        * if (action === "on") then "Encender"
        * else "Apagar"
  -->
  <div>
    <div
      v-for="(regla, index) in reglas"
      :key="index"
      class="text"
    >
      <div>
        Nombre: {{ regla.name }}
      </div>
      <div>
        Sensor ID: {{ regla.antecedents[0].id1 }}
      </div>
    </div>
  </div>
  <!-- <Listado
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
  </Listado> -->
</template>

<script>
import store from '@/store/store'
// import Listado from '@/router/views/layouts/Listado'
import { searchFilter } from '@/searchFilter.js'

export default {
  components: {
    // Listado
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
    // reglasConNombreDispositivo () {
    //   const props = this.reglas.map(regla => {
    //     const filtered = Object.keys(regla)
    //       .filter(key => ['dispositivoId'].includes(key))
    //       .reduce((obj, key) => {
    //         return {
    //           ...obj,
    //           [key]: regla[key]
    //         }
    //       }, {})

    //     return filtered
    //   })

    //   const ids = props.map(prop => prop.dispositivoId)

    //   const nombres = ids.map(id => {
    //     return this.dispositivos.find(dispositivo => dispositivo.id === id).nombre
    //   })

    //   const reglas = this.reglas.map((el, index) => {
    //     return { ...el, dispositivo: nombres[index] }
    //   })

    //   return reglas
    // },
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

<style lang="scss" scoped>
  .text {
    font-size: 2rem;

    &:not(:last-child) {
      margin-bottom: 3rem;
    }
  }
</style>
