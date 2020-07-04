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

export const transformarUnidad = (unidad) => {
  switch (unidad) {
    case 'CELSIUS':
      return 'la temperatura'
    case 'AMPERES':
      return 'la intensidad de corriente'
    case 'LUMENES':
      return 'la luminosidad'
  }
}
