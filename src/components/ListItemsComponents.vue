<template>
  <div class="bg-white shadow-1 col column" style="border-radius: 10px;">
    <q-toolbar class="bg-primary text-white shadow-1" style="border-radius: 10px 10px 0 0;">
      <q-toolbar-title class="text-bold">Observaciones</q-toolbar-title>
      <q-item class="items-center text-center">{{ nombreMes }} - {{ fecha.año }}</q-item>
      <q-icon name="view_list" size="25px" />
    </q-toolbar>
    <q-separator color="orange-12" size="2px" />

    <template v-if="List.length > 0">
      <q-scroll-area :bar-style="barStyle" :thumb-style="thumbStyle" class="col column  justify-center items-center">
        <q-list class="">
          <q-expansion-item v-for="contact in List" :key="contact.Dia" expand-separator>
            <template v-slot:header>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  {{ contact.Dia }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ contact.Name }}</q-item-label>
                <q-item-label caption lines="1">{{ contact.Observacion }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row items-center">
                  {{ contact.Tiempo }}
                </div>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section>
                {{ contact.Observacion }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
    </template>
    <template v-else>
      <q-item class="col row justify-center items-center">
        <q-item-section class="text-grey-9 justify-center items-center text-bold">
          <q-separator class="bg-primary"/>
          <q-space/>
          Sin observaciones disponibles.
          <q-space/>
          <q-separator class="bg-primary"/>
        </q-item-section>
      </q-item>
    </template>
    <q-separator color="orange-12" inset size="1px" />
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    List: {
      type: Array,
      required: true
    },
    Fecha: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    // const list = ref(props.Fecha);
    const fecha = ref(props.Fecha);
    //  console.log('Contenido de List:', props);

    const mesEnLetras = (numeroMes) => {
      const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      return meses[numeroMes - 1];
    };

    const nombreMes = mesEnLetras(fecha.value.mes);

    return {
      mesEnLetras,
      nombreMes,
       fecha,
      // list,
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
      }
    };
  }
};
</script>
