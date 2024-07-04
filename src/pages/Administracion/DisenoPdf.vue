<template>
    <q-page>
        <div style="height: 100px; ">
            <q-btn @click="Imprimir()" label="imprimir" />
            <p id="test">Hola mundo</p>
        </div>
    </q-page>
</template>
<script setup>

import { api } from 'boot/axios'
import utilidades from '../../commons/utilidades.js'

import html2canvas from 'html2canvas';


      const  Imprimir = () => {
            this.$q.loading.show()
      api.get('/usuario/imprimirOrdenEntradaPDF/', { responseType: 'arraybuffer' })
        .then(response => {
          const blob = new Blob([response.data], { type: 'application/pdf' })
          const blobURL = URL.createObjectURL(blob)
          window.open(blobURL)
          this.$q.loading.hide()
        }).catch(error => {
          console.log(error)
          this.$q.loading.hide()
        })
        }


        // <q-btn @click="capturar" label="i" />
        // ref="seccionCapturar"

//         const seccionCapturar = ref(null);

// const capturar = () => {
// const seccion = seccionCapturar.value;
// if (seccion) {
// html2canvas(seccion, {
//   scale: window.devicePixelRatio * 3, // Escalado para una mejor calidad
//   width: seccion.offsetWidth * 1 // Ajuste del ancho del lienzo para una mejor resolución
// }).then(canvas => {
//   canvas.toBlob(blob => {
//     const formData = new FormData();
//     formData.append('imagen', blob, 'captura.png');

//     // Envía la imagen al backend
//     api.post('/usuario/imprimirOrdenEntradaPDF/', formData, { responseType: 'arraybuffer' })
//       .then(response => {
//         // Recibe el PDF generado
//         const blob = new Blob([response.data], { type: 'application/pdf' });
//         const blobURL = URL.createObjectURL(blob);
//         window.open(blobURL);
//       })
//       .catch(error => {
//         console.error('Error al enviar la imagen al backend:', error);
//       });
//   }, 'image/png');
// });
// } else {
// console.error('El elemento con la referencia "seccionCapturar" no se encontró en el DOM.');
// }
// };




// seccionCapturar, capturar,




</script>