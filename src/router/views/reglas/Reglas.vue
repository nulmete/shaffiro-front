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
import { searchFilter } from '@/utils/searchFilter'
import { transformarOperador, obtenerMagnitud } from '@/utils/reglas'

export default {
  components: {
    Listado
  },
  beforeRouteEnter (to, from, next) {
    store.dispatch('dispositivos/getAllDispositivos').then(res => next())
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
    dispositivos () {
      return this.$store.getters['dispositivos/getAllDispositivos']
    },
    sensores () {
      return this.dispositivos.filter(dispositivo => dispositivo.tipo === 'SENSOR')
    },
    actuadores () {
      return this.dispositivos.filter(dispositivo => dispositivo.tipo === 'ACTUADOR')
    },
    reglasParseadas () {
      return this.reglas.map(regla => {
        // Nombre de la regla
        const nombre = regla.name

        // Sensor asociado
        let nombreSensor
        const sensorId = regla.antecedents[0].id1
        const sensorAsociado = this.sensores.find(sensor => sensor.id === sensorId)
        if (sensorAsociado) nombreSensor = sensorAsociado.nombre
        else nombreSensor = ''

        // Actuador asociado
        let nombreActuador
        const actuadorId = regla.consequences[0].id2
        const actuadorAsociado = this.actuadores.find(actuador => actuador.id === actuadorId)
        if (actuadorAsociado) nombreActuador = actuadorAsociado.nombre
        else nombreActuador = ''

        // Descripción de la regla
        const descripcion = regla.antecedents.map((antecedente, j) => {
          let str
          if (j % 2 === 0) {
            const magnitud = this.obtenerMagnitud(antecedente.unit)
            str = `${magnitud} es ${this.transformarOperador(antecedente.op)} ${antecedente.vs} ${antecedente.unit}`
          } else {
            str = `${antecedente.conector === '&&' ? 'y' : 'o'}`
          }
          return str
        })
        descripcion.unshift('Si ')
        descripcion.push('ENTONCES')

        // Encontrar artefacto "vinculado" al actuador
        const artefacto = actuadorAsociado ? actuadorAsociado.configuracion : 'ARTEFACTO NO VINCULADO'
        const consecuente = regla.consequences[0].action === 'on'
          ? `Encender ${artefacto}`
          : `Apagar ${artefacto}`
        descripcion.push(consecuente)
        const descripcionJoined = descripcion.join(' ')

        return {
          nombre,
          descripcion: descripcionJoined,
          sensorAsociado: nombreSensor,
          actuadorAsociado: nombreActuador
        }
      })
    },
    reglasFiltradas () {
      return searchFilter(this.search, this.reglasParseadas)
    }
  },
  created () {
    this.$store.dispatch('reglas/getAllReglas')
  },
  methods: {
    transformarOperador,
    obtenerMagnitud,
    crear () {
      this.$router.push({ name: 'crearRegla' })
    },
    editar (regla) {
      this.$store.commit('reglas/setReglaActual', regla)
      this.$router.push({
        name: 'editarRegla',
        params: {
          identificador: regla._id.$oid,
          regla
        }
      })
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
