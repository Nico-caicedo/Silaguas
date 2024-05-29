import { createApp } from 'vue';
import axios from 'axios';

const app = createApp({});

app.config.globalProperties.$axios = axios;

//ip local
  const api = axios.create({ baseURL: 'https://localhost:44346/api' });

// ip servaf
//  const api = axios.create({ baseURL: 'http://192.168.137.152/WebApiSilaguas/api' });
/* <preference name="scheme" value="https" /> */
//ip casa
//  const api = axios.create({baseURL: 'http://192.168.10.197/WebApiSilaguas/api'})
//
  // const api = axios.create({ baseURL: 'http://192.168.1.37/WebApiSilaguas/api' });

app.config.globalProperties.$api = api;

export { axios, api };
