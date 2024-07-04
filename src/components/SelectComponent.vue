<template>
  <q-select  outlined :clearable="clearable"  v-model="model" :options="options" :label="label"
    label-color="primary" color="teal" emit-value options-selected-class="text-deep-primary" :dense="dense"
    :options-dense="denseOpts" class="ellipsis" @clear="onClear">
    <template v-slot:prepend>
      <q-icon name="filter_alt" color="primary" />
    </template>

    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
          <q-item-label caption>{{ scope.opt.description }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-if="!options.length" v-slot:no-option>
      <q-item>
        <q-item-section>
          <q-item-label>Sin datos en el Filtro</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import { ref, watch, onMounted } from 'vue';

export default {
  props: {
    options: {
      type: [Array, String],
      default: () => [],
    },
    label: String,
    Fecha: Object,
    clearable: Boolean,
  },
  setup(props, { emit }) {
    const model = ref(props.options[0]);
    const dense = ref(true);
    const denseOpts = ref(true);

    const emitSelection = () => {
      if (model.value && model.value.id) {
        emit('FiltroSeleccionado', model.value.id, props.Fecha);
      }
    };

    const emitFecha = () => {
      emit('FechaSeleccionada', props.Fecha);
    };

    const onClear = () => {
      emit('FiltroSeleccionado', null, props.Fecha);
    };

    onMounted(() => {
      emitFecha();
    });

    watch(model, () => {
      emitSelection();
    });


    return {
      model,
      dense,
      denseOpts,
      onClear, // Agregar el controlador para el evento de limpieza
    };
  },
};
</script>
