<!-- ObservacionComponent.vue -->

<template>
  <q-card class="column col bg-transparent" style="border-radius: 10px; border-top-right-radius: 10px; height:330px;">
    <!-- Header section -->
    <q-card-section horizontal class="row q-gutter-xs bg-transparent">
      <q-avatar style="border-top-left-radius: 10px; border-top-right-radius: 10px;">
        <img src="~assets/quimicamatraz.png" class="col inset-shadow q-pa-xs bg-orange-3">
      </q-avatar>
      <div class="col text-overline inset-shadow ellipsis q-pa-sm text-h6 text-bold text-blue-10 text-center bg-grey-5"
        style="border-top-right-radius: 10px; border-top-left-radius: 10px;">Observacion General</div>
      <q-avatar :icon="icon" class="col inset-shadow" :color="buttonColor" text-color="white"
        style="border-top-left-radius: 10px; border-top-right-radius: 10px;" />
    </q-card-section>
    <q-separator color="blue-9" size="2px" />
    <q-card class="column col">
      <template v-if="ObservacionProps.length > 0">
        <q-scroll-area class="col row ">
          <template :key="observacion.id" v-for="(observacion, index) in  ObservacionProps">
            <q-card-section class="bg-white column col">
              <q-card-section horizontal class="q-pa-none col">
                <q-card-section class="q-pa-none col">
                  <q-item class="justify-center items-center">
                    <div class="text-h6 text-bold text-orange">{{ observacion.Login }}</div>
                    <div class="col ellipsis-2-lines">{{ observacion.Fecha }}</div>
                    <q-btn @click="actualizarObservacion(observacion)" color="green-10"
                      :icon="observacion.editando ? 'save' : 'edit'" outline type="submit" class="ellipsis col-md-xs" />
                  </q-item>
                  <q-separator color="grey" inset />
                  <div class="text-caption text-grey-10 q-pt-sm q-pb-md">
                    <div v-if="!observacion.editando">{{ observacion.Observacion }}</div>
                    <q-input v-else v-model="observacionModificada" filled type="textarea" autogrow />
                  </div>
                </q-card-section>
              </q-card-section>
              <q-separator color="blue-9" />
            </q-card-section>

          </template>
        </q-scroll-area>
      </template>
      <template v-else>
        <q-card-section class="bg-white column col">
          <q-item class="col column text-center">
            <q-item-section v-if="!mostrarTextArea" class="text-grey-9 text-bold">
              <q-separator class="bg-primary" size="1px" />
              Sin Observacion General.
              <q-separator class="bg-primary" size="1px" />
            </q-item-section>
            <q-item-section v-else class="text-grey-9 text-bold q-gutter-xs q-pa-none">
              <div class="text-grey-9 text-capitalize ">Ingresar observacion general</div>
              <q-separator class="bg-primary" size="1px" />
              <q-input v-model="nuevaObservacion" filled type="textarea" @blur="mostrarTextArea = false"
                class="col row" />
              <div class="row q-gutter-sm">
                <q-btn color="primary" label="Guardar" outline class="text-bold col" @click="guardarNuevaObservacion" />
                <q-btn color="negative" label="Cancelar" outline class="text-bold col"
                  @click="mostrarTextArea = false" />
              </div>
            </q-item-section>
            <q-btn v-if="hayDatos && !mostrarTextArea && haySolucion" @click="validar" color="primary" outline
              label="Nueva Observación" class="text-bold" />
          </q-item>
        </q-card-section>
      </template>
    </q-card>

  </q-card>
</template>

<script>
import { ref, computed, watch } from 'vue';
import alertUtils from 'src/commons/alertUtils';
import Utils from 'src/commons/utils';
export default {
  props: {
    ObservacionProps: {
      type: Array,
      required: true,
    },
    hayDatos: {
      type: Boolean,
      required: true,
    },
    Filtro: {
      type: Object,
      required: true,
    },
    hayCarta: {
      type: String,
      required: true,
    },
    haySolucion: {
      type: Number,
      required: false,
    },
    hayMetodo: {
      type: Number,
      required: false,
    },
    hayMatriz: {
      type: String,
      required: false,
    }

  },

  setup(props, { emit }) {
    const Observacion = ref({});
    const nuevaObservacion = ref('');
    const mostrarTextArea = ref(false);
    const observacionModificada = ref('');

    watch(() => props.ObservacionProps, (newValue) => {
      Observacion.value = newValue;
    });

    const icon = computed(() => {
      return props.ObservacionProps.length > 0 ? 'check' : 'close';
    });

    const buttonColor = computed(() => {
      return props.ObservacionProps.length > 0 ? 'green' : 'red';
    });

    const validar = () => {
      if (props.hayCarta === 'CCV' && !props.haySolucion) {
        alertUtils.Notify('Por favor, seleccione una Solución antes de guardar la observación.', 'error');
        return;
      }
      if (props.hayCarta === 'CCRPD' && (!props.hayMetodo || !props.hayMatriz)) {
        alertUtils.Notify('Por favor, seleccione un Método y una Matriz antes de guardar la observación.', 'error');
        return;
      }
      mostrarTextArea.value = true;
    };

    const actualizarObservacion = async (observacion) => {
      observacion.editando = !observacion.editando;
      if (!observacion.editando) {
        const observacionTrimmed = observacionModificada.value.trim();
        if (observacionTrimmed === observacion.Observacion) {
          alertUtils.Notify('No se han realizado cambios en la observación.', 'info');
          return;
        }
        if (observacionTrimmed === '') {
          alertUtils.Notify('Por favor, ingrese una observación antes de guardar.', 'error');
          return;
        }
        const index = props.ObservacionProps.findIndex(obs => obs.id === observacion.id);
        if (index !== -1) {
          props.ObservacionProps[index].Observacion = observacionModificada.value;
        }
        // Emitir el evento para guardar la observación
        Utils.loadingNotify(true, 'Modificando observación...');
        try {
          await emit('ActualizarObservacion', observacion, props.Filtro);
          Utils.loadingNotify(false);
          alertUtils.Notify('Observación modificada guardada exitosamente.', 'exito');
          observacionModificada.value = '';
        } catch (error) {
          Utils.loadingNotify(false);
          alertUtils.Notify('Ha ocurrido un error al modificar la observación. Por favor, inténtelo de nuevo más tarde.', 'error');
        }
      }
    };

    const guardarNuevaObservacion = async () => {
      const observacionTrimmed = nuevaObservacion.value.trim();

      if (observacionTrimmed === '') {
        alertUtils.Notify('Por favor, ingrese una observación antes de guardar.', 'error');
        mostrarTextArea.value = true;
        return;
      }
      const observacionGuardada = nuevaObservacion.value;

      Utils.loadingNotify(true, 'Guardando observación...');
      try {
        await emit('guardarObservacion', nuevaObservacion.value, props.Filtro);
        Utils.loadingNotify(false);
        alertUtils.Notify('Observación guardada exitosamente.', 'exito');
        nuevaObservacion.value = '';
      } catch (error) {
        Utils.loadingNotify(false);
        alertUtils.Notify('Ha ocurrido un error al guardar la observación. Por favor, inténtelo de nuevo más tarde.', 'error');

        nuevaObservacion.value = observacionGuardada;
      }
    };

    return {
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#ffab40',
        width: '3px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        border: '9px',
        backgroundColor: '#ffab40',
        width: '9px',
        opacity: 0.2
      },
      observacionModificada,
      Observacion,
      icon,
      buttonColor,
      nuevaObservacion,
      mostrarTextArea,
      actualizarObservacion,
      validar,
      guardarNuevaObservacion,
    };
  },
};

</script>
