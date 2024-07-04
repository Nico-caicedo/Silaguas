<template>

      <q-input
        outlined
        v-model="fechaModel"
        label="Mes y Año"
        label-color="primary"
        class="col  bg-transparent"
        dense
        type="month"
        @update:model-value="emitFecha"
      />

</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  tipoCarta: {
    type: String,
    default: 'CCV',
  },
  solucion: Number,
  metodo: Number,
  matriz: {
    type: String,
    require: false,
  },
});

const emit = defineEmits(['filtroSeleccionado']);

const fechaActual = new Date();
const fechaModel = ref(fechaActual.toISOString().slice(0, 7)); // yyyy-MM
const dense = ref(true);
let ultimoFechaEmitida = null;

const emitFecha = () => {
  const [anio, mes] = fechaModel.value.split('-').map(Number);

  if (fechaModel.value !== ultimoFechaEmitida) {
    emit('filtroSeleccionado', props.tipoCarta, null, mes, anio, props.solucion, props.metodo, props.matriz);
    ultimoFechaEmitida = fechaModel.value;
  }
};

onMounted(() => {
  emitFecha(); // Emitimos el evento cuando se monta el componente
});

watch(fechaModel, emitFecha);
</script>
