<template>
  <div  class="row bg-blue-5 justify-center items-center  q-pl-xs col-xs-12 col-sm-12 col-md col-xl col-lg" style="border-radius: 10px;">
    <div class=" col-xs-9 col-sm-9 col-md-10 col-lg col-xl">
      <div class="column items-center">
        <div class="text-white q-pt-sm text-weight-bold">{{ saludoBienvenida }},Bienvenido {{ nombreUsuario }} {{ apellido1 }}</div>

        <div class="row text-bold  items-center">
          <p v-if="DatosCarta.data === 'CCV'">{{ DatosCarta.solucion ? 'Carta Control Verificación - Solución: ' + DatosCarta.solucion : 'Carta Control Verificación' }}</p>
          <p v-else-if="DatosCarta.data === 'CCRPD'">{{ DatosCarta.metodo && DatosCarta.matriz ? 'Carta Control RPD - Método: ' + DatosCarta.metodo + '- Matriz: ' + DatosCarta.matriz : 'Carta Control RPD' }}</p>
          <p>-{{ mesEnLetras(Fecha.mes) }}-{{ Fecha.año }}</p>
        </div>

        <div class="bg-white  q-pa-xs inset-shadow" style="border-top-left-radius: 10px; border-top-right-radius: 10px;">
          <span class="text-primary text-bold q-pa-x-md" style="font-size: 10px;">Agua Valiosa para la Vida ¡Cuídala!</span>
        </div>
      </div>
    </div>
    <div class="row col-xs col-sm col-md col-lg col-xl relative-position ">
      <div class="bg-white inset-shadow " style=" border-top-left-radius: 10px; border:1px solid blue ; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; border-top-right-radius: 10px;">
        <q-img src="src\assets\Logo_Sevaf_sin_fondo.png" width="50px" sizes="(max-width: 320px) 280px, (max-width: 480px) 440px, 800px"/>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'Welcome',
  props: {
    DatosCarta: {
      type: Object,
      required: true
    },
    Fecha: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      saludoBienvenida: '',
      nombreUsuario: '',
      apellido1: '',
    };
  },
  mounted() {
    this.obtenerSaludoBienvenida();
    this.obtenerUsuario();
  },
  methods: {
    mesEnLetras(numeroMes) {
      const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      return meses[numeroMes - 1];
    },
    obtenerSaludoBienvenida() {
      const now = new Date();
      const horas = now.getHours();

      if (horas >= 6 && horas < 12) {
        this.saludoBienvenida = 'Buenos Dias';
      } else if (horas >= 12 && horas < 18) {
        this.saludoBienvenida = 'Buenas Tardes';
      } else {
        this.saludoBienvenida = 'Buenas Noches';
      }
    },
    obtenerUsuario() {
      const usuario = this.$q.localStorage.getItem('usuarioSilaguas');
      if (usuario) {
        this.nombreUsuario = usuario.Tercero.Nombre;
        this.apellido1 = usuario.Tercero.Apellido1;
      }
    }
  }
};
</script>
