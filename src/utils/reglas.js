// Helper functions para reglas
export const transformarOperador = (operador) => {
  switch (operador) {
    case '>':
      return 'mayor a'
    case '<':
      return 'menor a'
    case '>=':
      return 'mayor o igual a'
    case '<=':
      return 'menor o igual a'
    default:
      return ''
  }
}

export const obtenerMagnitud = (unidad) => {
  switch (unidad) {
    case 'LUMENES':
      return 'el Flujo Luminoso'
    case 'horas':
      return 'el Horario'
    default:
      return ''
  }
}

export const transformarConector = (conector) => {
  switch (conector) {
    case '&&':
      return 'y'
    case '||':
      return 'o'
    default:
      return ''
  }
}

export const transformarAccion = (accion) => {
  switch (accion) {
    case 'on':
      return 'Encender'
    case 'off':
      return 'Apagar'
    default:
      return ''
  }
}

export const parsearReglas = (reglas, sensores, actuadores) => {
  return reglas.map(regla => {
    // Nombre de la regla
    const nombre = regla.name

    // Sensor asociado
    let nombreSensor
    const sensorId = regla.antecedents[0].id1
    const sensorAsociado = sensores.find(sensor => sensor.id === sensorId)
    if (sensorAsociado) nombreSensor = sensorAsociado.nombre
    else nombreSensor = 'Sensor no encontrado'

    // Actuador asociado
    let nombreActuador
    const actuadorId = regla.consequences[0].id2
    const actuadorAsociado = actuadores.find(actuador => actuador.id === actuadorId)
    if (actuadorAsociado) nombreActuador = actuadorAsociado.nombre
    else nombreActuador = 'Actuador no encontrado'

    // Descripción de la regla
    const descripcion = regla.antecedents.map((antecedente, j) => {
      let str
      if (j % 2 === 0) {
        const magnitud = obtenerMagnitud(antecedente.unit)
        str = `${magnitud} es ${transformarOperador(antecedente.op)} ${antecedente.vs} ${antecedente.unit}`
      } else {
        str = `${antecedente.conector === '&&' ? 'y' : 'o'}`
      }
      return str
    })
    descripcion.unshift('Si')
    descripcion.push('ENTONCES')

    // Encontrar artefacto "vinculado" al actuador
    const artefacto = actuadorAsociado ? actuadorAsociado.configuracion : 'Artefacto no vinculado'
    const consecuente = regla.consequences[0].action === 'on'
      ? `Encender ${artefacto}`
      : `Apagar ${artefacto}`
    descripcion.push(consecuente)
    const descripcionJoined = descripcion.join(' ')

    return {
      nombre,
      descripcion: descripcionJoined,
      sensorAsociado: nombreSensor,
      actuadorAsociado: nombreActuador,
      sensorId,
      actuadorId
    }
  })
}
