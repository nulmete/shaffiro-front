<template>
  <div class="regla-form container">
    <h2 class="heading-secondary text-center margin-bottom-large">
      {{ pageTitle }} Regla
    </h2>

    <form
      class="form"
      @submit.prevent="crearRegla"
    >
      <div class="flex-wrapper test margin-bottom-large">
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
        class="test margin-bottom-large"
      >
        <h3 class="margin-bottom-small">
          Reglas existentes para el actuador seleccionado
        </h3>
        <ul>
          <li
            v-for="(reglaActuador, index) in reglasParseadasActuadorAsociado"
            :key="reglaActuador.descripcion + index"
          >
            <p
              v-if="$route.params.identificador !== reglaActuador.id"
              class="margin-bottom-small"
            >
              <strong>{{ reglaActuador.nombre }}</strong> - {{ reglaActuador.descripcion }}
            </p>
          </li>
        </ul>
      </div>

      <div class="test margin-bottom-large">
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

      <div class="test margin-bottom-large">
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

      <div class="test margin-bottom-large">
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
import { transformarOperador, obtenerMagnitud } from '@/utils/reglas'
import { required } from 'vuelidate/lib/validators'
import ruleEngineApi from '@/utils/ruleEngineApi'
import store from '@/store/store'
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue'

export default {
  components: {
    VueTimepicker
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
      // reglasConflictivas: []
    }
  },
  computed: {
    reglas () {
      return this.$store.getters['reglas/getAllReglas']
    },
    reglasParseadas () {
      return this.reglas.map(regla => {
        // Id
        const id = regla._id.$oid

        // Nombre de la regla
        const nombre = regla.name

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
          id,
          nombre,
          descripcion: descripcionJoined,
          actuadorAsociado: nombreActuador,
          actuadorId
        }
      })
    },
    reglasParseadasActuadorAsociado () {
      return this.reglasParseadas.filter(regla => regla.actuadorId === this.actuadorAsociado.id)
    },
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
      const magnitudSensor = obtenerMagnitud(this.sensorAsociado.configuracion)
      this.magnitudesPosibles.push(magnitudSensor, 'el Horario')
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
    // reglasExistentesConAccionOpuesta (unidad) {
    //   const reglasActuadorAsociado = this.reglas.filter(regla => regla.consequences[0].id2 === this.actuadorAsociado.id)
    //   const reglasConAccionOpuesta = reglasActuadorAsociado.filter(regla => regla.consequences[0].action !== this.accion)
    //   const reglasConAccionOpuestaUnidad = reglasConAccionOpuesta
    //     .map(regla => {
    //       let conector = ''
    //       if (regla.antecedents.length > 1) {
    //         conector = regla.antecedents[1].conector
    //       }
    //       return { antecedents: regla.antecedents, reglaId: regla._id.$oid, conector }
    //     })
    //     .map(regla => {
    //       return regla.antecedents
    //         .filter(e => {
    //           return e.unit === unidad
    //         })
    //         .map(obj => ({ ...obj, reglaId: regla.reglaId, conector: regla.conector }))
    //     })
    //   if (unidad === 'LUMENES') {
    //     return reglasConAccionOpuestaUnidad.flat()
    //   } else {
    //     return reglasConAccionOpuesta
    //   }
    // },
    // hayConflictoMagnitud (opx, opy) {
    //   if ((opx === '>' || opx === '>=') && (opy === '>' || opy === '>=')) {
    //     return true
    //   } else if ((opx === '<' || opx === '<=') && (opy === '<' || opy === '<=')) {
    //     return true
    //   } else {
    //     return false
    //   }
    // },
    // hayConflictoHorario (x, opx, y, opy, conector, a, opa, b, opb) {
    //   console.log('.......')
    //   let xTime, yTime, aTime, bTime
    //   let currentDay = new Date().getDate()
    //   const currentMonth = new Date().getMonth()
    //   const currentYear = new Date().getFullYear()
    //   const xSplit = x.split(':')
    //   const ySplit = y.split(':')
    //   const aSplit = a.split(':')
    //   const bSplit = b.split(':')

    //   // Analizar operador de la regla existente
    //   if ((opx === '>=' || opx === '>') && (opy === '<=' || opy === '<') && conector === '||') {
    //     // No tiene sentido, contempla todo el día
    //     // Cualquier regla que cree puede generar conflicto
    //     return true
    //   }
    //   if ((opx === '>=' || opx === '>') && (opy === '<=' || opy === '<') && conector === '&&') {
    //     // Analizar regla en creación
    //     // El conector no me interesa
    //     xTime = new Date(currentYear, currentMonth, currentDay, xSplit[0], xSplit[1]).getTime()
    //     yTime = new Date(currentYear, currentMonth, currentDay, ySplit[0], ySplit[1]).getTime()
    //     bTime = new Date(currentYear, currentMonth, currentDay, bSplit[0], bSplit[1]).getTime()
    //     if ((opa === '>=' || opa === '>') && (opb === '<=' || opb === '<')) {
    //       // considerar que el horario más pequeño es del día actual
    //       aTime = new Date(currentYear, currentMonth, currentDay, aSplit[0], aSplit[1]).getTime()
    //     }
    //     if ((opa === '<=' || opa === '<') && (opb === '>=' || opb === '>')) {
    //       // considerar que el horario más pequeño es del próximo día
    //       aTime = new Date(currentYear, currentMonth, currentDay + 1, aSplit[0], aSplit[1]).getTime()
    //     }
    //   }
    //   if ((opx === '<=' || opx === '<') && (opy === '>=' || opy === '>') && conector === '&&') {
    //     // No tiene sentido, ya que es imposible, por ejemplo,
    //     // que el horario sea menor a 08:00 y mayor a 22:00.
    //     // Por lo tanto, podría crearse cualquier regla
    //     // ya que la existente no se cumpliría nunca.
    //     return false
    //   }
    //   if ((opx === '<=' || opx === '<') && (opy === '>=' || opy === '>') && conector === '||') {
    //     // Analizar la regla en creación
    //     // El conector no me interesa?
    //     xTime = new Date(currentYear, currentMonth, currentDay + 1, xSplit[0], xSplit[1]).getTime()
    //     yTime = new Date(currentYear, currentMonth, currentDay, ySplit[0], ySplit[1]).getTime()
    //     bTime = new Date(currentYear, currentMonth, currentDay, bSplit[0], bSplit[1]).getTime()
    //     if ((opa === '>=' || opa === '>') && (opb === '<=' || opb === '<')) {
    //       // considerar que el horario más pequeño es del día actual
    //       aTime = new Date(currentYear, currentMonth, currentDay, aSplit[0], aSplit[1]).getTime()
    //     }
    //     if ((opa === '<=' || opa === '<') && (opb === '>=' || opb === '>')) {
    //       // considerar que el horario más pequeño es del próximo día
    //       aTime = new Date(currentYear, currentMonth, currentDay + 1, aSplit[0], aSplit[1]).getTime()
    //     }
    //   }

    //   if (Math.min(xTime, yTime) <= Math.max(aTime, bTime) && Math.max(xTime, yTime) >= Math.min(aTime, bTime)) {
    //     return true
    //   } else {
    //     return false
    //   }
    async crearRegla () {
      // const condicionesLumenes = this.condiciones.filter(cond => cond.unit === 'LUMENES')
      // const condicionesHorario = this.condiciones.filter(cond => cond.unit === 'horas')

      // // vaciar array de reglas conflictivas
      // this.reglasConflictivas.splice(0, this.reglasConflictivas.length)

      // // verificar si hay conflicto con alguna otra regla existente
      // this.reglasExistentesConAccionOpuesta('LUMENES').forEach((reglaExistente, i) => {
      //   // supongo que hay una sola condición asociada a lúmenes
      //   if (this.hayConflictoMagnitud(reglaExistente.op, condicionesLumenes[0].op)) {
      //     // extraer reglaId de la que genera conflicto
      //     this.reglasConflictivas.push(reglaExistente.reglaId)
      //   }
      // })
      // this.reglasExistentesConAccionOpuesta('horas').forEach((reglaExistente, i) => {
      //   // tiene que haber un array de 2 elementos (horario inicio + horario fin)
      //   if (reglaExistente.length < 2) return
      //   // extraer horarios y operadores
      //   const horario0 = reglaExistente[0].vs
      //   const op0 = reglaExistente[0].op
      //   const horario1 = reglaExistente[1].vs
      //   const op1 = reglaExistente[1].op
      //   let x, opx, y, opy
      //   if (horario0 < horario1) {
      //     x = horario0
      //     opx = op0
      //     y = horario1
      //     opy = op1
      //   } else {
      //     x = horario1
      //     opx = op1
      //     y = horario0
      //     opy = op0
      //   }
      //   const conector = reglaExistente[0].conector
      //   let a, b, opa, opb
      //   if (condicionesHorario[0].vs < condicionesHorario[1].vs) {
      //     a = condicionesHorario[0].vs
      //     opa = condicionesHorario[0].op
      //     b = condicionesHorario[1].vs
      //     opb = condicionesHorario[1].op
      //   } else {
      //     a = condicionesHorario[1].vs
      //     opa = condicionesHorario[1].op
      //     b = condicionesHorario[0].vs
      //     opb = condicionesHorario[0].op
      //   }

      //   console.log(x, opx, y, opy, conector, a, opa, b, opb)

      //   if (this.hayConflictoHorario(x, opx, y, opy, conector, a, opa, b, opb)) {
      //     this.reglasConflictivas.push(reglaExistente[0].reglaId)
      //   }
      // })

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

  .test {
    padding: 3rem;
    border: 1px solid $color-secondary;
    border-radius: $default-border-radius;
  }

  .conflictiva {
    color: red;
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
