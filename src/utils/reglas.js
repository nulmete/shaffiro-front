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
