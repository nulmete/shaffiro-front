<template>
  <Layout>
    <h1 class="heading">
      Crear Regla
    </h1>

    <!-- <div class="wrapper"> -->
    <div class="condiciones">
      <BaseButton
        v-if="!condicionesConfirmadas"
        @click="agregarCondicion"
      >
        Agregar condición
      </BaseButton>

      <ul v-if="!condicionesConfirmadas">
        <Condicion
          v-for="(condicion, index) in condiciones"
          :key="index"
          :val="condicion"
          :padre-index="index"
          :sensores="sensores"
          :disabled="condicionesConfirmadas"
          @remover="removerCondicion(index)"
          @agregar="agregarCondicion"
        />
      </ul>

      <BaseButton
        v-if="!condicionesConfirmadas"
        @click="joinearCondiciones"
      >
        Confirmar condiciones
      </BaseButton>

      <div
        v-if="condicionesConfirmadas"
        class="antecedente"
        :class="{ disabled: joineados }"
      >
        <h4 class="heading">
          Antecedente
        </h4>
        <div class="join">
          <template v-for="(item, index) in condicionesJoineadas">
            <div
              :key="'condicion' + index"
              class="condicion"
            >
              <div class="titulo">
                Condición {{ index + 1 }}
              </div>
              <div class="descripcion">
                {{ item }}
              </div>
            </div>

            <div
              v-if="index < opLog.length"
              :key="'operador' + index"
              class="operador"
            >
              <div class="titulo">
                Operador
              </div>
              <input
                v-model="opLog[index]"
                type="text"
              >
            </div>
          </template>
        </div>
      </div>

      <BaseButton
        v-if="condicionesConfirmadas && !joineados"
        @click="joinCondicionYOperador"
      >
        Confirmar antecedente
      </BaseButton>
    </div>

    <!-- accion -->
    <template v-if="joineados">
      <div
        v-if="!accionConfirmada"
        class="accion"
      >
        <h3 class="heading">
          Acción
        </h3>
        <div class="form-group">
          <label class="label">Actuador</label>
          <select
            v-model="actuadorElegido"
            class="input"
          >
            <option
              disabled
              selected
              value
            >
              Seleccionar
            </option>
            <option
              v-for="(opcion, index) in nombreActuadores"
              :key="index"
            >
              {{ opcion }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="label">Operador</label>
          <input
            v-model="operadorActuador"
            class="input"
          >
        </div>

        <div class="form-group">
          <label class="label">Valor</label>
          <select
            v-model="valorActuador"
            class="input"
          >
            <option
              disabled
              selected
              value
            >
              Seleccionar
            </option>
            <option
              v-for="(opcion, index) in valoresActuador"
              :key="index"
            >
              {{ opcion }}
            </option>
          </select>
        </div>
      </div>

      <BaseButton
        v-if="!accionConfirmada"
        @click="confirmarConsecuente"
      >
        Confirmar consecuente
      </BaseButton>

      <div
        v-if="accionConfirmada"
        class="consecuente"
        :class="{ disabled: accionConfirmada }"
      >
        <h4 class="heading">
          Consecuente
        </h4>
        <div class="accion">
          <div class="titulo">
            Acción
          </div>
          <div class="descripcion">
            <template v-if="valorActuador">
              Activar
            </template>
            <template v-else>
              Desactivar
            </template>
            el actuador {{ actuadorElegido }}
          </div>
        </div>
      </div>
    </template>

    <div class="regla">
      <BaseInput
        v-if="accionConfirmada"
        v-model="regla"
        label="Nombre de la regla"
      />

      <BaseButton
        v-if="accionConfirmada"
        @click="crearRegla"
      >
        Crear regla
      </BaseButton>
    </div>
    <!-- </div> -->
  </Layout>
</template>

<script>
import axios from 'axios'
import Layout from '@/router/layouts/main'
import Condicion from './Condicion'

export default {
  components: { Condicion, Layout },
  data () {
    return {
      condiciones: [
        { dispositivo: '', operador: '', valor: '' }
      ],
      condicionesJoineadas: [],
      condicionesConfirmadas: false,
      opLog: [],
      condicionesYOperadores: [],
      joineados: false,
      antecedente: '',

      actuadorElegido: '',
      operadorActuador: '=',
      valoresActuador: ['0', '1'],
      valorActuador: '',
      consecuente: '',
      accionConfirmada: false,

      regla: ''
    }
  },
  computed: {
    dispositivos () {
      return this.$store.getters['dispositivos/getAllDispositivos']
    },
    reglas () {
      return this.$store.getters['reglas/getAllReglas']
    },
    sensores () {
      return this.dispositivos.filter(dispositivo => dispositivo.tipo === 'SENSOR')
    },
    nombreSensores () {
      return this.sensores.map(sensor => sensor.nombre)
    },
    actuadores () {
      return this.dispositivos.filter(dispositivo => dispositivo.tipo === 'ACTUADOR')
    },
    nombreActuadores () {
      return this.actuadores.map(actuador => actuador.nombre)
    }
  },
  created () {
    this.$store.dispatch('dispositivos/getAllDispositivos')
  },
  methods: {
    agregarCondicion () {
      this.condiciones.push({ dispositivo: '', operador: '', valor: '' })
      this.opLog.push('')
      console.log(this.opLog.length)
    },
    joinearCondiciones () {
      this.condicionesConfirmadas = true
      this.condicionesJoineadas = this.condiciones.map(condicion => Object.values(condicion).join(''))
    },
    removerCondicion (index) {
      if ((index === this.condiciones.length - 1 || index === 0) && this.opLog.length === 1) {
        // Tengo 2 condiciones, 1 solo operador y quiero remover la ultima condicion
        this.opLog.splice(0, 1)
      } else if (index !== this.condiciones.length - 1 && this.opLog.length !== 1) {
        // Tengo n condiciones y quiero remover una condición intermedia
        this.opLog.splice(index, 1)
      } else {
        // Tengo n condiciones y quiero remover la última
        this.opLog.splice(this.condiciones.length - 2, 1)
      }

      this.condiciones.splice(index, 1)
    },
    joinCondicionYOperador () {
      this.joineados = true

      const length = Math.max(this.condicionesJoineadas.length, this.opLog.length)
      const result = []
      for (let i = 0; i < length; i++) {
        if (this.condicionesJoineadas[i] !== undefined) {
          result.push(this.condicionesJoineadas[i])
        }
        if (this.opLog[i] !== undefined) {
          result.push(this.opLog[i])
        }
      }

      this.antecedente = result.join('')
      console.log(this.antecedente)
    },
    confirmarConsecuente () {
      this.accionConfirmada = true
      this.consecuente = [this.actuadorElegido, this.operadorActuador, this.valorActuador].join('')
      console.log(this.consecuente)
    },
    crearRegla () {
      const logica = `${this.antecedente}=>${this.consecuente}`
      const nombre = this.regla

      axios
        .post('/api/reglas', { logica, nombre })
        .then(response => {
          console.log(response)
          this.$router.push({ name: 'reglas' })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>

  .wrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr)
  }

  .condiciones {
    & > *:not(:last-child) { margin-bottom: 2rem; }
  }

  .condiciones,
  .consecuente {
    margin-bottom: 2.5rem;
  }

  .join {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-gap: 1.6rem;
    font-size: 1.3rem;
  }

  .titulo {
    font-weight: 700;
    font-size: 1.35rem;
  }

  .descripcion {
    font-size: 1.3rem;
  }

  .condicion,
  .operador {
    background: #f4f4f4;
    border-radius: 5px;
    box-shadow:
      0 3px 6px rgba($color-primary-dark, 0.16),
      0 3px 6px rgba($color-primary-dark, 0.23);
    padding: 1rem;
  }

  .antecedente,
  .consecuente {
    font-size: 1.5rem;
    padding: 2rem;
    background-image: linear-gradient(to bottom, $color-secondary, $color-secondary-light);
    border-radius: 5px;

    .heading { color: #f4f4f4; }
  }

  .form-group {
    margin-bottom: 1rem;
    display: flex;

    .label {
      font-size: 1.35rem;
      margin-right: .75rem;
    }

    .input { flex: 1; }
  }

  .accion {
    background: #f4f4f4;
    border-radius: 5px;
    box-shadow:
      0 3px 6px rgba($color-primary-dark, 0.16),
      0 3px 6px rgba($color-primary-dark, 0.23);
    padding: 1.2rem;

    &:not(:last-child) { margin-bottom: 1.5rem; }
  }

  .disabled {
    opacity: 0.75;
    pointer-events: none;
  }

  .regla button{
    margin-top: 1.5rem;
  }
</style>
