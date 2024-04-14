<template>
  <div class="row q-col-gutter-xs" style="background-color: transparent;">
    <div class="row col ">
      <q-input rounded outlined v-model="diaModel" :dense="dense" label="Día" label-color="primary" type="number"
        class="col shadow-1" style="border-radius: 20px;" :min="primerDiaDelMes" :max="ultimoDiaDelMes"
        @update:model-value="emitDia" />
    </div>

    <div class="row col ">
      <q-input rounded outlined v-model="mesModel" :dense="dense" label="Mes" label-color="primary" type="number"
        :min="1" :max="12" class="col shadow-1" style="border-radius: 20px;" @update:model-value="limitarMes"
        @change="emitMesAnio" />
      <q-input rounded outlined v-model="anioModel" :dense="dense" label="Año" label-color="primary" type="number"
        class="col shadow-1" style="border-radius: 20px;" @update:model-value="limitarAnio" @change="emitMesAnio" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import alertUtils from 'src/commons/alertUtils';
export default {
  name: 'SelectCalendar',
  emits: ['filtroSeleccionado'],
  props: {
    tipoCarta: {
      type: String,
      default: 'CCV'
    },
    solucion: Number,
    metodo: Number,
    matriz: {
      type: String,
      require: false
    },
  },

  setup(props, { emit }) {
    const fechaActual = new Date();
    const diaActual = 0;
    const mesActual = ref(fechaActual.getMonth() + 1);
    const anioActual = ref(fechaActual.getFullYear());
    const diaModel = ref(diaActual);
    const mesModel = ref(mesActual);
    const anioModel = ref(anioActual);
    const dense = ref(true);
    const ultimoDiaDelMes = ref(new Date(anioModel.value, mesModel.value, 0).getDate());
    const primerDiaDelMes = ref(0);
    let ultimoDiaEmitido = null;
    const emitDia = () => {
      const dia = diaModel.value === 0 ? null : diaModel.value;
      emit('filtroSeleccionado', props.tipoCarta, dia, mesModel.value, anioModel.value, props.solucion, props.metodo, props.matriz);
      ultimoDiaEmitido = diaModel.value;
    };

    const emitMesAnio = () => {
      if (diaModel.value !== null && diaModel.value !== undefined && ultimoDiaEmitido !== diaModel.value) {
        emitDia();
      } else {
        emit('filtroSeleccionado', props.tipoCarta, null, mesModel.value, anioModel.value, props.solucion, props.metodo, props.matriz);
      }
    };


    onMounted(() => {
      // console.log('hola', props.tipoCarta);
      emitMesAnio();
    });

    watch([diaModel, mesModel, anioModel], () => {
      const ultimoDia = new Date(anioModel.value, mesModel.value, 0).getDate();
      diaModel.value = Math.min(diaModel.value, ultimoDia);
      emitDia();
    });

    const limitarMes = (newValue) => {
      if (newValue < 1) {
        mesModel.value = 12;
        anioModel.value -= 1;
      } else if (newValue > 12) {
        mesModel.value = 1;
        anioModel.value += 1;
      } else {
        mesModel.value = newValue;
      }
      ultimoDiaDelMes.value = new Date(anioModel.value, mesModel.value, 0).getDate();
      primerDiaDelMes.value = 0; // Reiniciar al primer día del mes
    };

    const limitarAnio = (newValue) => {
      if (newValue < 1) {
        anioModel.value -= 1;
      }
    };

    return {
      diaModel,
      mesModel,
      anioModel,
      dense,
      ultimoDiaDelMes,
      primerDiaDelMes,
      tipoCarta: props.tipoCarta,
      emitDia,
      emitMesAnio,
      limitarMes,
      limitarAnio,
    };
  }
};

</script>
