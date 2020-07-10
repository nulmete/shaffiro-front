import axios from 'axios'

const url = process.env.NODE_ENV === 'production'
  ? 'https://shaffiro.morlax.com.ar/engine/ruleEngine'
  : 'http://localhost:5000/ruleEngine'

const service = axios.create({
  baseURL: url
})

export default service
