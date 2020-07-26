// Nombre de usuario
export const isUsernameValid = (username) => {
  return username.length >= 8 && username.length <= 15
}

// Contraseña
export const isPasswordStrong = (password) => {
  // La contraseña debe ser alfanumérica, con al menos 1 número, 1 mayúscula
  // y con una longitud de entre 8 y 20 caracteres
  const passwordRegexp = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,20}$')
  return passwordRegexp.test(password)
}
