import axios from 'axios'

const url = process.env.NODE_ENV === 'production'
  ? process.env.VUE_APP_MAIN_API_PROD
  : process.env.VUE_APP_MAIN_API_DEV

const service = axios.create({
  baseURL: url
})

export default service
