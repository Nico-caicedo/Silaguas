// ApiService.js
import axios from 'axios';

const ApiService = axios.create({
  baseURL: 'https://localhost:44346/api/Graficos',
  headers: {
    "Content-Type": 'application/json',
  }
});

export default {
  async obtenerDatosGraficos(data, id, Fecha) {
    console.log('api', data, id, Fecha)
    try {
      const response = await ApiService.get(`/obtenerDatosGraficos/${data}/${id}/${Fecha}`);
      // console.log(response);
      return response
    } catch (error) {
      console.error('Error al obtener los datos gráficos:', error);
      throw error;
    }
  },

  async obtenerSolucionPatron() {
    try {
      const response = await ApiService.get(`/ObtenerSolucionPatron`);
      //  console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtenerSolucionPatron', error);
      throw error;
    }
  },

  async obtenerMetodos() {
    try {
      const response = await ApiService.get('/ObtenerMetodos');
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtenerMetodos', error);
      throw error;
    }
  },

  async obtenerTipoMatriz() {
    try {
      const response = await ApiService.get('/ObtenerTipoMatriz');
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener Tipo Matriz', error);
      throw error;
    }
  },

  async obtenerAnalisisDatos(filtro) {
    //  console.log(filtro);
    try {
      const response = await ApiService.get('/ObtenerAnalisisDatos', { params: filtro });
      return response.data;
    } catch (error) {
      console.error('Error al Obtener Analisis Datos', error);
      throw error;
    }
  },

  async obtenerDatosGraficoLineal(filtro) {
    // console.log(filtro)
    try {
      const response = await ApiService.get('/ObtenerDatosGraficoLineal', { params: filtro });
      return response.data;
    } catch (error) {
      console.error('Error al obtener datos del gráfico:', error);
      throw error;
    }
  },

  async obtenerObservaciones(filtro) {
    try {
      const response = await ApiService.get('/ObtenerObservaciones', { params: filtro });
      // console.log(response);
      return response.data;
    } catch (error) {
      console.error('Error al obtener Observaciones', error);
      throw error;
    }
  },

  async obtenerAprobadosYverificados(filtro) {
    try {
      const response = await ApiService.get('/ObtenerAprobadosYVerificados', { params: filtro });
      return response.data;
    } catch (error) {
      console.error('Error al obtener Aprobados Y verficados', error);
      throw error;
    }
  },

  async obtenerContadorFilas() {
    try {
      const response = await ApiService.get('/ObtenerContadorFilas');
      //  console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al Obtener Contador Filas', error);
      throw error;
    }
  },
};

