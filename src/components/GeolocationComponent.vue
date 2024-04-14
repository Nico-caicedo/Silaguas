<template>
  <div>
    <q-btn @click="getDeviceLocation">Obtener Ubicación</q-btn>
    <div>Tu ubicación es: <strong>{{ Ubicacion }}</strong></div>
  </div>
</template>

<script>
import { ref, onBeforeUnmount } from 'vue';

export default {
  setup() {
    const Ubicacion = ref('determinando...');

    const getDeviceLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            Ubicacion.value = `Latitud: ${latitude}, Longitud: ${longitude}`;
          },
          (error) => {
            console.error('Error al obtener la ubicación:', error);
            Ubicacion.value = 'Error al obtener la ubicación';
          },
          { enableHighAccuracy: true }
        );
      } else {
        console.error('Geolocalización no es soportada por este navegador.');
        Ubicacion.value = 'Geolocalización no está soportada';
      }
    };

    return {
      Ubicacion,
      getDeviceLocation
    };
  }
};
</script>
