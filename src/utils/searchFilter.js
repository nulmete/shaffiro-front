export const searchFilter = (searchString, array) => {
  const lowerCaseString = searchString.toLowerCase().trim()

  return array.filter(element => {
    return Object.values(element).some(value => {
      return String(value).toLowerCase().includes(lowerCaseString)
    })
  })
}
