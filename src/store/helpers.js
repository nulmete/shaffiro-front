// Obtener estado guardado en localStorage
export function getSavedState (key) {
  return JSON.parse(window.localStorage.getItem(key))
}

// Guardar estado en localStorage
export function saveState (key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}
