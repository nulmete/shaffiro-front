<template>
  <div class="regla-form container">
    <h2 class="heading-secondary text-center margin-bottom-large">
      {{ pageTitle }} Regla
    </h2>

    <form
      class="form"
      @submit.prevent="crearRegla"
    >
      <div class="flex-wrapper group margin-bottom-large">
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
            @change="sensorElegido"
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

      <!-- Mostrar reglas ya asociadas al actuador seleccionado -->
      <div
        v-if="actuadorAsociado"
        class="group margin-bottom-large"
      >
        <h3 class="margin-bottom-small">
          Reglas preexistentes para el actuador seleccionado
        </h3>
        <ul>
          <li
            v-for="(reglaActuador, index) in reglasParseadasActuadorAsociado"
            :key="reglaActuador.descripcion + index"
          >
            <template v-if="editMode">
              <p
                v-if="regla._id.$oid !== reglaActuador.id"
                class="margin-bottom-small"
              >
                <strong>{{ reglaActuador.nombre }}</strong> - {{ reglaActuador.descripcion }}
              </p>
            </template>
            <template v-else>
              <p class="margin-bottom-small">
                <strong>{{ reglaActuador.nombre }}</strong> - {{ reglaActuador.descripcion }}
              </p>
            </template>
          </li>
        </ul>
      </div>

      <div class="group margin-bottom-large">
        <h3 class="margin-bottom-medium">
          Condiciones
        </h3>

        <div :class="['flex-wrapper', { 'margin-bottom-medium': condiciones.length }]">
          <span>Si</span>

          <div class="form__group">
            <BaseInputSelect
              v-model="magnitud"
              :extra-label="'magnitud'"
              :options="magnitudesPosibles"
            />
          </div>

          <span>es</span>

          <div class="form__group">
            <BaseInputSelect
              v-model="operador"
              :extra-label="'operador'"
              :options="operadoresPosibles"
              :options-labels="operadoresPosiblesTexto"
            />
          </div>

          <div class="form__group">
            <template v-if="magnitud === 'el Horario'">
              <VueTimepicker
                v-model="valor"
                class="timepicker"
              />
            </template>
            <template v-else>
              <BaseInput
                id="valor"
                v-model="valor"
                type="number"
                class="form__input"
                placeholder="Ingresar valor"
              />
            </template>
          </div>

          <div class="form__group">
            <BaseInput
              id="unidad"
              v-model="unidad"
              placeholder="Unidad"
              disabled
              class="form__input"
            />
          </div>
          <button
            class="btn btn--condicion"
            @click.prevent="agregarCondicion"
          >
            Agregar
          </button>
        </div>

        <div
          v-if="condiciones.length"
          class="grid-wrapper"
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
              El conector se utiliza para combinar las condiciones entre sí.
            </p>
            <p class="conector__help">
              <strong>y</strong>: todas las condiciones deben cumplirse para que se accione el actuador.
            </p>
            <p class="conector__help">
              <strong>o</strong>: al menos una de las condiciones debe cumplirse para que se accione el actuador.
            </p>
          </div>
        </div>
      </div>

      <div class="group margin-bottom-large">
        <h3 class="margin-bottom-medium">
          Acción
        </h3>

        <div class="form__group">
          <BaseInputSelect
            v-model="accion"
            :options="accionesPosibles"
            :options-labels="accionesPosiblesLabels"
          />
        </div>
      </div>

      <div class="group margin-bottom-large">
        <h3 class="margin-bottom-small">
          Descripción de la regla
        </h3>

        <p class="regla">
          Si <strong>{{ condiciones.length ? condicionesCombinadasString : 'condiciones' }}</strong>
          entonces <strong>{{ accion === 'on' ? 'encender' : 'apagar' }}
            {{ actuadorAsociado ? actuadorAsociado.configuracion : 'artefacto no especificado' }}</strong>
        </p>
      </div>

      <BaseButton
        type="submit"
        :disabled="!nombre || !sensorAsociado || !actuadorAsociado || !condiciones.length"
      >
        {{ pageTitle === 'Crear' ? 'Crear' : 'Guardar' }} Regla
      </BaseButton>
    </form>
  </div>
</template>

<script>
import { transformarOperador, obtenerMagnitud, transformarConector, transformarAccion, parsearReglas } from '@/utils/reglas'
import { required } from 'vuelidate/lib/validators'
import ruleEngineApi from '@/utils/ruleEngineApi'
import store from '@/store/store'
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue'

export default {
  components: {
    VueTimepicker
  },
  data () {
    return {
      pageTitle: 'Crear',
      editMode: false,
      regla: null,
      nombre: '',
      operador: '',
      magnitud: '',
      magnitudesPosibles: [],
      valor: '',
      operadoresPosibles: ['>', '<', '>=', '<='],
      condiciones: [],
      conector: '&&',
      conectoresPosibles: ['&&', '||'],
      sensorAsociado: null,
      actuadorAsociado: null,
      accion: 'on',
      accionesPosibles: ['on', 'off']
    }
  },
  computed: {
    sensores () {
      return this.$store.getters['dispositivos/getSensores']
    },
    sensoresLabels () {
      return this.$store.getters['dispositivos/getSensoresLabels']
    },
    actuadores () {
      return this.$store.getters['dispositivos/getActuadores']
    },
    actuadoresLabels () {
      return this.$store.getters['dispositivos/getActuadoresLabels']
    },
    reglas () {
      return this.$store.getters['reglas/getAllReglas']
    },
    reglasParseadas () {
      return this.parsearReglas(this.reglas, this.sensores, this.actuadores)
    },
    reglasParseadasActuadorAsociado () {
      return this.reglasParseadas.filter(regla => regla.actuadorId === this.actuadorAsociado.id)
    },
    operadoresPosiblesTexto () {
      return this.operadoresPosibles.map(operador => transformarOperador(operador))
    },
    unidad () {
      if (!this.sensorAsociado) {
        return ''
      }

      if (this.magnitud === obtenerMagnitud(this.sensorAsociado.configuracion)) {
        return this.sensorAsociado.configuracion
      } else if (this.magnitud === 'el Horario') {
        return 'horas'
      } else {
        return ''
      }
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
  async beforeRouteEnter (to, from, next) {
    await store.dispatch('dispositivos/getAllDispositivos')
    await store.dispatch('reglas/getAllReglas')
    if (to.name !== 'editarRegla') return next()
    next(vm => {
      const regla = vm.$store.getters['reglas/getReglaActual']
      vm.regla = regla
      vm.editMode = true
      vm.pageTitle = 'Editar'
      vm.nombre = regla.name
      vm.condiciones = regla.antecedents.filter((ant, i) => i % 2 === 0)
      if (regla.antecedents.length > 1) {
        vm.conector = regla.antecedents.filter((ant, i) => i % 2 !== 0)[0].conector
      }
      const sensorId = regla.antecedents[0].id1
      const sensores = vm.$store.getters['dispositivos/getSensores']
      vm.sensorAsociado = sensores.find(sensor => sensor.id === sensorId)
      const magnitudSensor = obtenerMagnitud(vm.sensorAsociado.configuracion)
      vm.magnitudesPosibles.push(magnitudSensor, 'el Horario')
      const actuadorId = regla.consequences[0].id2
      const actuadores = vm.$store.getters['dispositivos/getActuadores']
      vm.actuadorAsociado = actuadores.find(actuador => actuador.id === actuadorId)
      vm.accion = regla.consequences[0].action
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('dispositivos/setAllDispositivos', [])
    this.$store.commit('reglas/setReglaActual', null)
    next()
  },
  methods: {
    sensorElegido (sensor) {
      this.magnitudesPosibles.splice(0, this.magnitudesPosibles.length)
      const magnitudSensor = obtenerMagnitud(sensor.configuracion)
      this.magnitudesPosibles.push(magnitudSensor, 'el Horario')
    },
    agregarCondicion () {
      this.condiciones.push({
        id1: this.sensorAsociado.id,
        op: this.operador,
        vs: this.valor,
        unit: this.unidad
      })
      this.magnitud = ''
      this.operador = ''
      this.valor = ''
    },
    eliminarCondicion (condicionIndex) {
      this.condiciones.splice(condicionIndex, 1)
    },
    obtenerMagnitud,
    transformarOperador,
    transformarConector,
    transformarAccion,
    parsearReglas,
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
    },
    valor: {
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

  .group {
    padding: 3rem;
    border: 1px solid $color-secondary;
    border-radius: $default-border-radius;
  }

  .grid-wrapper {
    display: grid;
    grid-template-columns: 2fr 1fr;
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
