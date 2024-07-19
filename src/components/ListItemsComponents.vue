<template>
  <q-card class="column col bg-transparent" style="border-radius: 10px; border-top-right-radius: 10px; height: 330px">
    <q-card-section horizontal class="row q-gutter-xs bg-transparent">
      <q-avatar style="border-top-left-radius: 10px; border-top-right-radius: 10px">
        <img src="~assets/quimicamatraz.png" class="col inset-shadow q-pa-xs bg-orange-3" />
      </q-avatar>
      <div
        class="col text-overline items-center inset-shadow ellipsis text-h6 text-bold text-blue-10 text-center bg-grey-5 observaciones-container"
        style="border-top-right-radius: 10px; border-top-left-radius: 10px">
        Observaciones
      </div>
      <q-avatar :icon="icon" class="shadow-1" :color="buttonColor" text-color="white"
        style="border-top-left-radius: 10px; border-top-right-radius: 10px" />
    </q-card-section>
    <q-separator color="orange-12" size="2px" />
    <div class="bg-grey-5 text-white inset-shadow items-center text-center">
      {{ nombreMes }} - {{ fecha.año }}
    </div>
    <q-separator color="orange-12" size="2px" />
    <q-card class="column col">
      <template v-if="List.length > 0">
        <q-scroll-area :bar-style="barStyle" :thumb-style="thumbStyle" class="col row">
          <q-list class="col justify-between">
            <q-expansion-item v-for="contact in List" :key="contact.Concentracion"
              @click="toggleExpand(contact.Concentracion)">
              <template v-slot:header>
                <q-item-section avatar>
                  <q-avatar :color="isExpanded(contact.Concentracion) ? 'green' : 'grey'" class="text-bold inset-shadow"
                    icon="visibility" :text-color="isExpanded(contact.Concentracion) ? 'white' : 'black'">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text"></q-item-label>
                  <q-item-label caption lines="1">{{ contact.Observacion.length > 10 ? contact.Observacion.slice(0, 10)
        + "..." : contact.Observacion }}</q-item-label>
                </q-item-section>
                <q-item-section side class="column">

                  <div  class="items-center text-caption text-green" v-if="tipoCarta === 'CCV'">
                    <div class="text-bold">Solucion</div>
                    {{ contact.Concentracion }}
                  </div>
                  <div class="items-center text-caption text-green" v-else-if="tipoCarta === 'CCRPD'">
                    <div class="wrap">
                      <div class="text-bold">Metodo </div>
                      {{ contact.NombreMetodo }}
                    </div>
                    <div class="text-bold">Matriz </div>
                    {{ contact.NombreMatriz }}
                  </div>
                </q-item-section>
              </template>
              <q-card>
                <q-separator color="black" size="0.5px" />
                <q-card-section class="bg-grey-3 q-pl-md q-pr-md q-pt-none q-pb-xs q-gutter-xs">
                  <div class="text-bold text-center text-uppercase">Observacion</div>
                  <q-separator color="grey" size="0.5px" />
                  <div class="col text-left text-caption bg-white inset-shadow rounded-borders q-pa-xs">{{
        contact.Observacion }}
                  </div>
                  <q-separator color="grey" size="0.5px" />
                  <div class="col row justify-between items-end">
                    <div class="text-bold text-caption">{{ contact.Name }}</div>
                    <div class="text-italic text-caption ">{{ contact.fecha }}</div>
                  </div>
                </q-card-section>
                <q-separator color="black" size="0.5px" />
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-scroll-area>
      </template>
      <template v-else>
        <q-item class="col row justify-center items-center">
          <q-separator class="bg-primary" inset size="1px" />
          <q-item-section class="text-white bg-grey-6 q-pa-xs rounded-borders col row items-center text-bold">
            Sin observaciones disponibles.
          </q-item-section>
          <q-separator class="bg-primary" inset size="1px" />
        </q-item>
      </template>
      <q-separator color="orange-12" inset size="1px" />
    </q-card>
  </q-card>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  List: {
    type: Array,
    required: true,
  },
  Fecha: {
    type: Object,
    required: true,
  },
  tipoCarta: {
    type: String,
    default: 'CCV',
  },

});

const fecha = ref(props.Fecha);
const mesEnLetras = (numeroMes) => {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return meses[numeroMes - 1];
};

const icon = computed(() => {
  return props.List.length > 0 ? "check" : "close";
});

const buttonColor = computed(() => {
  return props.List.length > 0 ? "green" : "red";
});

const nombreMes = mesEnLetras(fecha.value.mes);

const thumbStyle = {
  right: "4px",
  borderRadius: "5px",
  backgroundColor: "#ffab40",
  width: "3px",
  opacity: 0.75,
};

const barStyle = {
  right: "2px",
  border: "9px",
  backgroundColor: "#ffab40",
  width: "9px",
  opacity: 0.2,
};

// State to track which sections are expanded
const expandedItems = ref([]);

const toggleExpand = (Concentracion) => {
  if (expandedItems.value.includes(Concentracion)) {
    expandedItems.value = expandedItems.value.filter((item) => item !== Concentracion);
  } else {
    expandedItems.value.push(Concentracion);
  }
};

const isExpanded = computed(() => (Concentracion) => {
  return expandedItems.value.includes(Concentracion);
});
</script>

<style scoped>
.q-card-section {
  align-items: center;
}

.q-avatar {
  flex-shrink: 0;
}

.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(0deg);
  color: rgba(0, 0, 0, 0.1);
  font-size: 15px;
  font-weight: bold;
  pointer-events: none;
}

.observaciones-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  /* Asegura que el contenedor ocupe toda la altura */
}
</style>
