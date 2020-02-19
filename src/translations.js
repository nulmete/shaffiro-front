export function translateAuthorities (authority) {
  switch (authority) {
    case 'ROLE_USER':
      return 'Cliente'
    case 'ROLE_ADMIN':
      return 'Administrador'
    default:
      return authority
  }
}
