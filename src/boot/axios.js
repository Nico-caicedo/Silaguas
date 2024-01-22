import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios

const api = axios.create({ baseURL: 'https://localhost:44346/api' })
// const api = axios.create({ baseURL: 'https://localhost:44359/api' })
// const api = axios.create({ baseURL: 'http://170.0.0.19/WebApiSilaguas/api/' })
Vue.prototype.$api = api
export { axios, api }
