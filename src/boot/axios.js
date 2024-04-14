import { createApp } from 'vue';
import axios from 'axios';

const app = createApp({});

app.config.globalProperties.$axios = axios;

//ip local
  const api = axios.create({ baseURL: 'https://localhost:44346/api' });

// ip servaf
// const api = axios.create({ baseURL: 'http://192.168.56.1/WebApiSilaguas/api' });

//ip casa
// const api = axios.create({baseURL: 'http://192.168.10.197/WebApiSilaguas/api'})

//  const api = axios.create({ baseURL: 'http://192.168.137.123/WebApiSilaguas/api' });

app.config.globalProperties.$api = api;

export { axios, api };
