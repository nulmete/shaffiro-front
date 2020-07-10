<template>
  <div class="regla-form container">
    <h2 class="heading-secondary text-center margin-bottom-large">
      {{ pageTitle }} Regla
    </h2>

    <form
      class="form"
      @submit.prevent="crearRegla"
    >
      <div class="flex-wrapper margin-bottom-large">
        <div class="form__group">
          <label
            class="form__label"
            for="nombre"
          >Nombre de la Regla</label>
          <BaseInput
            id="nombre"
            v-model="nombre"
            :v="$v.nombre"
            class="form__input"
          />
          <span
            v-if="$v.nombre.$dirty && !$v.nombre.required"
            class="input-error"
          >Por favor, ingrese el nombre de la regla</span>
        </div>

        <div class="form__group">
          <label class="form__label">Sensor asociado</label>
          <BaseInputSelect
            v-model="sensorAsociado"
            :options="sensores"
            :options-labels="sensoresLabels"
          />
        </div>

        <div class="form__group">
          <label class="form__label">Actuador asociado</label>
          <BaseInputSelect
            v-model="actuadorAsociado"
            :options="actuadores"
            :options-labels="actuadoresLabels"
          />
        </div>
      </div>

      <h3 class="margin-bottom-small">
        Condiciones
      </h3>

      <Condicion
        class="margin-bottom-large"
        :sensor-asociado="sensorAsociado"
        @agregarCondicion="agregarCondicion"
      />

      <div
        v-if="condiciones.length"
        class="grid-wrapper margin-bottom-large"
      >
        <ul
          class="condiciones"
        >
          <li
            v-for="(condicion, index) in condiciones"
            :key="index"
            class="condicion"
          >
            <span class="condicion__detail">
              {{ index + 1 }}.
              Si {{ obtenerMagnitud(condicion.unit) }}
              es {{ transformarOperador(condicion.op) }}
              {{ condicion.vs }}
              {{ condicion.unit }}
            </span>
            <button
              class="btn btn--condicion"
              @click.prevent="eliminarCondicion(index)"
            >
              Eliminar
            </button>
          </li>
        </ul>

        <div
          v-if="condiciones.length > 1"
          class="conector"
        >
          <label class="form__label">Conector:</label>
          <BaseInputSelect
            v-model="conector"
            :extra-label="'conector'"
            :options="conectoresPosibles"
            :options-labels="conectoresPosiblesTexto"
          />
          <p class="conector__help">
            Nota: el conector se utiliza para combinar las condiciones entre sí.
          </p>
          <p class="conector__help">
            Conector "y": todas las condiciones deben cumplirse para que se accione el actuador.
          </p>
          <p class="conector__help">
            Conector "o": al menos una de las condiciones debe cumplirse para que se accione el actuador.
          </p>
        </div>
      </div>

      <h3 class="margin-bottom-small">
        Acción
      </h3>

      <div class="form__group">
        <BaseInputSelect
          v-model="accion"
          :options="accionesPosibles"
          :options-labels="accionesPosiblesLabels"
        />
      </div>

      <h3 class="margin-bottom-small">
        Descripción de la regla
      </h3>

      <p class="regla margin-bottom-large">
        Si
        <span
          v-if="!condiciones.length"
          class="regla__condiciones"
        >condiciones</span>
        <span class="regla__condiciones">{{ condicionesCombinadasString }}</span>
        entonces
        <span class="regla__acciones">{{ accion === 'on' ? 'encender' : 'apagar' }}</span>
        {{ actuadorAsociado.configuracion || 'artefacto no especificado' }}
      </p>

      <BaseButton
        :disabled="$v.$invalid"
        type="submit"
      >
        Crear Regla
      </BaseButton>
    </form>
  </div>
</template>

<script>
import Condicion from '@/components/Reglas/Condicion.vue'
import { transformarOperador, obtenerMagnitud } from '@/utils/reglas'
import { required } from 'vuelidate/lib/validators'
import ruleEngineApi from '@/utils/ruleEngineApi'
import store from '@/store/store'

export default {
  components: {
    Condicion
  },
  props: {
    regla: {
      type: Object,
      required: false,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      pageTitle: 'Crear',
      editMode: false,
      nombre: '',
      condiciones: [],
      conector: '&&',
      conectoresPosibles: ['&&', '||'],
      sensorAsociado: '',
      actuadorAsociado: '',
      accion: 'on',
      accionesPosibles: ['on', 'off']
    }
  },
  computed: {
    sensores () {
      return this.$store.getters['dispositivos/getSensores']
    },
    sensoresLabels () {
      return this.sensores.map(sensor => `Nombre: ${sensor.nombre}`)
    },
    actuadores () {
      return this.$store.getters['dispositivos/getActuadores']
    },
    actuadoresLabels () {
      return this.actuadores.map(actuador => `Nombre: ${actuador.nombre}`)
    },
    conectoresPosiblesTexto () {
      return this.conectoresPosibles.map(conector => this.transformarConector(conector))
    },
    accionesPosiblesLabels () {
      return this.accionesPosibles.map(accion => this.transformarAccion(accion))
    },
    condicionesCombinadasString () {
      const cantidadCondiciones = this.condiciones.length

      const condicionesTexto = this.condiciones.map(condicion => {
        const magnitud = obtenerMagnitud(condicion.unit)
        const operadorTexto = transformarOperador(condicion.op)

        return `${cantidadCondiciones > 1 ? '(' : ''}${magnitud} es ${operadorTexto} ${condicion.vs} ${condicion.unit}${cantidadCondiciones > 1 ? ')' : ''}`
      })

      const condicionesCombinadas = this.insertBetweenEachArrElement(condicionesTexto, this.transformarConector(this.conector)).join(' ')

      return condicionesCombinadas
    }
  },
  created () {
    if (this.$route.name === 'editarRegla') {
      this.editMode = true
      this.pageTitle = 'Editar'
      this.nombre = this.regla.name
      this.condiciones = this.regla.antecedents.filter((ant, i) => i % 2 === 0)
      if (this.regla.antecedents.length > 1) {
        this.conector = this.regla.antecedents.filter((ant, i) => i % 2 !== 0)[0].conector
      }
      const sensorId = this.regla.antecedents[0].id1
      this.sensorAsociado = this.sensores.find(sensor => sensor.id === sensorId)
      const actuadorId = this.regla.consequences[0].id2
      this.actuadorAsociado = this.actuadores.find(actuador => actuador.id === actuadorId)
      this.accion = this.regla.consequences[0].action
    }
  },
  beforeRouteEnter (to, from, next) {
    store.dispatch('dispositivos/getAllDispositivos').then(res => next())
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('dispositivos/setAllDispositivos', [])
    next()
  },
  methods: {
    agregarCondicion (condicion) {
      this.condiciones.push({ id1: this.sensorAsociado.id, ...condicion })
    },
    eliminarCondicion (condicionIndex) {
      this.condiciones.splice(condicionIndex, 1)
    },
    transformarConector (conector) {
      switch (conector) {
        case '&&':
          return 'y'
        case '||':
          return 'o'
      }
    },
    transformarAccion (accion) {
      switch (accion) {
        case 'on':
          return 'Encender'
        case 'off':
          return 'Apagar'
      }
    },
    obtenerMagnitud,
    transformarOperador,
    insertBetweenEachArrElement (arr, value) {
      return arr.reduce((result, element, index, array) => {
        result.push(element)
        if (index < array.length - 1) {
          result.push(value)
        }
        return result
      }, [])
    },
    async crearRegla () {
      const antecedents = this.insertBetweenEachArrElement(this.condiciones, { conector: `${this.conector}` })
      const consequences = [{
        id2: this.actuadorAsociado.id,
        action: this.accion
      }]

      let formData = {
        name: this.nombre,
        antecedents,
        consequences
      }

      let endpoint = '/create'
      let method = 'POST'

      if (this.editMode) {
        endpoint = `/update?id=${this.regla._id.$oid}`
        method = 'PUT'
      }

      try {
        console.log(formData)
        await ruleEngineApi({
          url: `${endpoint}`,
          method,
          data: formData
        })
        this.editMode = false
        this.$router.push({ name: 'reglas' })
      } catch (error) {
        // todo
        console.log(error)
      }
    }
  },
  validations: {
    nombre: {
      required
    }
  }
}
</script>

<style lang="scss" scoped>
  .regla-form {
    padding: 3rem 0;
    width: 90vw;
  }

  .regla {
    background-color: $color-primary-dark;
    padding: 1.2rem;
    color: $color-primary-light;
    border-radius: 5px;

    &__condiciones,
    &__acciones {
      color: $color-secondary-light;
    }
  }

  .grid-wrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5rem;
  }

  .condicion {
    display: flex;
    align-items: center;
    padding: 1rem;

    &__detail {
      margin-right: 5%;
    }
  }

  .conector {
    label {
      font-weight: 700;
      display: inline-block;
      margin-right: 1rem;
    }
    select {
      display: inline-block;
      width: auto;
    }
    &__help {
      font-size: 1.25rem;
      margin: 5px;

      &:first-of-type {
        margin-top: 1rem;
      }
    }
  }
</style>
