import axios from 'axios'

const url = process.env.NODE_ENV === 'production'
  ? 'https://shaffiro.morlax.com.ar/backend'
  : 'http://localhost:8080'

const service = axios.create({
  baseURL: url
})

export default service
