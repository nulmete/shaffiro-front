export function isUsernameValid (username) {
  return username.length >= 8 && username.length <= 15
}

export function isPasswordStrong (password) {
  return (
    // Verificar que tenga al menos un número
    /\d/.test(password) &&
    // Verificar que tenga letras
    /[a-zA-Z]/.test(password) &&
    // Verificar que tenga mayúsculas
    /.*[A-Z].*/.test(password) &&
    // Verificar que la longitud sea entre 8 y 20 caracteres
    password.length >= 8 &&
    password.length <= 20
  )
}
