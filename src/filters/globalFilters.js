import Vue from 'vue'

Vue.filter('authorityFilter', (value, key) => {
  switch (value) {
    case 'ROLE_ROOT':
      return 'Root'
    case 'ROLE_ADMIN':
      return 'Administrador'
    case 'ROLE_USER':
      return 'Usuario'
  }
})

Vue.filter('activatedFilter', (value, key) => {
  if (key !== 'activated') return value

  return (value) ? 'Habilitado' : 'Deshabilitado'
})
