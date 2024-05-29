
import { api } from 'boot/axios';


export default {
  async obtenerDatosGraficos(data, id, Fecha) {
    console.log('api', data, id, Fecha)
    try {
      const response = await api.get(`obtenerDatosGraficos/${data}/${id}/${Fecha}`);
      return response
    } catch (error) {
      console.error('Error al obtener los datos gráficos:', error);
      throw error;
    }
  },

  async obtenerSolucionPatron() {
    try {
      const response = await api.get(`grafico/solucion-patron`);
      return response.data;
    } catch (error) {
      console.error('Error al obtenerSolucionPatron', error);
      throw error;
    }
  },

  async obtenerMetodos() {
    try {
      const response = await api.get('grafico/metodo');
      return response.data;
    } catch (error) {
      console.error('Error al obtenerMetodos', error);
      throw error;
    }
  },

  async obtenerTipoMatriz() {
    try {
      const response = await api.get('grafico/tipo-matriz');
      return response.data;
    } catch (error) {
      console.error('Error al obtener Tipo Matriz', error);
      throw error;
    }
  },

  async obtenerAnalisisDatos(filtro) {
    try {
      const response = await api.get('grafico/analisis-datos', { params: filtro });
      return response.data;
    } catch (error) {
      console.error('Error al Obtener Analisis Datos', error);
      throw error;
    }
  },

  async obtenerDatosGraficoLineal(filtro) {
    try {
      const response = await api.get('grafico/datos-grafico-lineal', { params: filtro });
      return response.data;
    } catch (error) {
      console.error('Error al obtener datos del gráfico:', error);
      throw error;
    }
  },

  async obtenerObservaciones(filtro) {
    try {
      const response = await api.get('grafico/observaciones', { params: filtro });
      return response.data;
    } catch (error) {
      console.error('Error al obtener Observaciones', error);
      throw error;
    }
  },

  async obtenerObservacionGeneral(filtro) {
    try {
      const response = await api.get('grafico/observacion-general', { params: filtro });
      return response.data;
    } catch (error) {
      console.error('Error al obtener Observaciones general', error);
      throw error;
    }
  },

  async obtenerAprobadosYverificados(filtro) {
    try {
      const response = await api.get('grafico/aprobado-verificado', { params: filtro });
      return response.data;
    } catch (error) {
      console.error('Error al obtener Aprobados Y verficados', error);
      throw error;
    }
  },

  async obtenerContadorFilas() {
    try {
      const response = await api.get('grafico/contar-fila');
      return response.data;
    } catch (error) {
      console.error('Error al Obtener Contador Filas', error);
      throw error;
    }
  },

  async InsertarObservacionGeneral(Observacion) {
    try {
      await api.post('grafico/insertar-observacion-general',  Observacion );
    } catch (error) {
      console.error('Error al registrar Observacion general', error);
      throw error;
    }
  },

  async ActualizarObservacionGeneral(Observacion) {
    try {
      await api.post('grafico/actualizar-observacion-general',  Observacion );
    } catch (error) {
      console.error('Error al registrar Observacion general', error);
      throw error;
    }
  }


};

