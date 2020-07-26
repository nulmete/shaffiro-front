import {
  transformarOperador,
  obtenerMagnitud,
  transformarConector,
  transformarAccion,
  parsearReglas
} from '@/utils/reglas'

test('`>` se transforma en mayor a', () => {
  expect(transformarOperador('>')).toEqual('mayor a')
})

test('`>=` se transforma en mayor o igual a', () => {
  expect(transformarOperador('>=')).toEqual('mayor o igual a')
})

test('`<` se transforma en menor a', () => {
  expect(transformarOperador('<')).toEqual('menor a')
})

test('`<=` se transforma en menor o igual a', () => {
  expect(transformarOperador('<=')).toEqual('menor o igual a')
})

test('`<>` se transforma en un string vacío', () => {
  expect(transformarOperador('<>')).toEqual('')
})

test('La magnitud de `horas` es `el Horario`', () => {
  expect(obtenerMagnitud('horas')).toEqual('el Horario')
})

test('La magnitud de `LUMENES` es `el Flujo Luminoso`', () => {
  expect(obtenerMagnitud('LUMENES')).toEqual('el Flujo Luminoso')
})

test('La magnitud de `CELSIUS` es un string vacío', () => {
  expect(obtenerMagnitud('CELSIUS')).toEqual('')
})

test('`&&` se transforma en `y`', () => {
  expect(transformarConector('&&')).toEqual('y')
})

test('`||` se transforma en `o`', () => {
  expect(transformarConector('||')).toEqual('o')
})

test('`&` se transforma en un string vacío', () => {
  expect(transformarConector('&')).toEqual('')
})

test('La acción `on` se transforma en `Encender`', () => {
  expect(transformarAccion('on')).toEqual('Encender')
})

test('La acción `off` se transforma en `Apagar`', () => {
  expect(transformarAccion('off')).toEqual('Apagar')
})

test('La acción `activate` se transforma en un string vacío', () => {
  expect(transformarAccion('activate')).toEqual('')
})

test('Las reglas se parsean correctamente', () => {
  const sensores = [
    {
      id: 1,
      nombre: 'Sensor_Lampara_LED',
      tipo: 'SENSOR',
      activo: true,
      configuracion: 'LUMENES',
      reglas: []
    },
    {
      id: 2,
      nombre: 'Sensor_Lampara_Fluorescente',
      tipo: 'SENSOR',
      activo: true,
      configuracion: 'LUMENES',
      reglas: []
    }
  ]

  const actuadores = [
    {
      id: 1,
      nombre: 'Actuador_Lampara_LED',
      tipo: 'ACTUADOR',
      activo: true,
      configuracion: 'Lámpara LED',
      reglas: []
    },
    {
      id: 2,
      nombre: 'Actuador_Lampara_Fluorescente',
      tipo: 'ACTUADOR',
      activo: true,
      configuracion: 'Lámpara Fluorescente',
      reglas: []
    }
  ]

  const reglas = [
    {
      _id: {
        $oid: '5f0f910b93529887b6b14505'
      },
      name: 'Prender la luz del living',
      antecedents: [
        {
          id1: 2,
          op: '<',
          vs: '22:00',
          unit: 'horas'
        },
        {
          conector: '&&'
        },
        {
          id1: 2,
          op: '>',
          vs: '08:00',
          unit: 'horas'
        },
        {
          conector: '&&'
        },
        {
          id1: 2,
          op: '<',
          vs: '500',
          unit: 'LUMENES'
        }
      ],
      consequences: [
        {
          id2: 2,
          action: 'on'
        }
      ]
    },
    {
      _id: {
        $oid: '5f0f91cd93529887b6b14506'
      },
      name: 'Apagar la luz del living',
      antecedents: [
        {
          id1: 2,
          op: '>',
          vs: '5000',
          unit: 'LUMENES'
        },
        {
          conector: '||'
        },
        {
          id: 2,
          op: '>',
          vs: '22:00',
          unit: 'horas'
        },
        {
          conector: '||'
        },
        {
          id1: 2,
          op: '<',
          vs: '08:00',
          unit: 'horas'
        }
      ],
      consequences: [
        {
          id2: 2,
          action: 'off'
        }
      ]
    },
    {
      _id: {
        $oid: '5f0f910b93529887b6b14509'
      },
      name: 'Prender la luz de la cocina',
      antecedents: [
        {
          id1: 3,
          op: '<',
          vs: '22:00',
          unit: 'horas'
        },
        {
          conector: '&&'
        },
        {
          id1: 3,
          op: '>',
          vs: '08:00',
          unit: 'horas'
        },
        {
          conector: '&&'
        },
        {
          id1: 3,
          op: '<',
          vs: '500',
          unit: 'LUMENES'
        }
      ],
      consequences: [
        {
          id2: 3,
          action: 'on'
        }
      ]
    }
  ]

  const result = parsearReglas(reglas, sensores, actuadores)

  expect(result).toEqual([
    {
      nombre: 'Prender la luz del living',
      descripcion: 'Si el Horario es menor a 22:00 horas y el Horario es mayor a 08:00 horas y el Flujo Luminoso es menor a 500 LUMENES ENTONCES Encender Lámpara Fluorescente',
      sensorAsociado: 'Sensor_Lampara_Fluorescente',
      actuadorAsociado: 'Actuador_Lampara_Fluorescente',
      sensorId: 2,
      actuadorId: 2
    },
    {
      nombre: 'Apagar la luz del living',
      descripcion: 'Si el Flujo Luminoso es mayor a 5000 LUMENES o el Horario es mayor a 22:00 horas o el Horario es menor a 08:00 horas ENTONCES Apagar Lámpara Fluorescente',
      sensorAsociado: 'Sensor_Lampara_Fluorescente',
      actuadorAsociado: 'Actuador_Lampara_Fluorescente',
      sensorId: 2,
      actuadorId: 2
    },
    {
      nombre: 'Prender la luz de la cocina',
      descripcion: 'Si el Horario es menor a 22:00 horas y el Horario es mayor a 08:00 horas y el Flujo Luminoso es menor a 500 LUMENES ENTONCES Encender Artefacto no vinculado',
      sensorAsociado: 'Sensor no encontrado',
      actuadorAsociado: 'Actuador no encontrado',
      sensorId: 3,
      actuadorId: 3
    }
  ])
})
