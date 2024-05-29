<!-- dashboard -->

<template>
  <main class="q-pa-sm column q-col-gutter-xs bg-grey-3">
    <div class="row items-center justify-center  text-center q-col-gutter-xs">
      <!-- seccion componente welcome -->
      <div class="row  items-center text-center col-xs-12 col-sm col-md col-xl col-lg-4">
        <welcome :DatosCarta="DatosCarta" :Fecha="Fecha" class="" />
      </div>
      <!-- seccion componenete card -->
      <div
        class="row justify-between items-center justify-stretch q-gutter-xs col-xs-12 col-sm-5 col-md col-xl col-lg-4">
        <CardData v-for="(item, index) in cardData" :key="index" :Nombre="index" :valor="item"
          :icon="getIconByNombre(index)" :backgroundcolor="getColorByNombre(index)"
          class="shadow-1 col-grow ellipsis" />

      </div>
      <!-- seccion componenete filtros -->
      <div
        class="row justify-between items-center justify-stretch q-gutter-xs col-xs-12 col-sm-12 col-md col-xl col-lg-4">
        <div class="col q-gutter-xs">
          <Select @FiltroSeleccionado="obtenerCarta" :Fecha="Fecha" :disable="disable" :clearable="clearable"
            :options="optionsselect" :label="labelselect" class="ellipsis-3-lines col shadow-1"
            style="border-radius: 100px;" />
          <Select @FiltroSeleccionado="obtenerTipoMatriz" :Fecha="Fecha" :disable="disableMatriz"
            :clearable="clearableMatriz" :options="optionsMatriz" :label="labelMatriz" class="ellipsis-3-lines col"
            style="border-radius: 100px;" />
        </div>
        <div class="col q-gutter-xs">
          <Select @FiltroSeleccionado="obtenerSolucionPatron" :Fecha="Fecha" :disable="disableSolucion"
            :clearable="clearableSolucion" :options="optionsSolucion" :label="labelSolucion" class="col "
            style="border-radius: 100px;" />
          <Select @FiltroSeleccionado="obtenerMetodos" :Fecha="Fecha" :disable="disableMetodo"
            :clearable="clearableMetodo" :options="optionsMetodo" :label="labelMetodo"
            class="ellipsis-3-lines col shadow-1" style="border-radius: 100px;" />
        </div>
        <div class="col q-gutter-xs">
          <SelectCalendar @FiltroSeleccionado="obtenerFecha" :tipoCarta="tipoCarta" :solucion="solucionCarta"
            :metodo="metodoCarta" :matriz="matrizCarta" class="column" style="border-radius: 100px;" />
        </div>
      </div>
    </div>
    <!-- <div class="row  justify-center  text-center q-col-gutter-xs">
      <div class="col  col-xs-12 col-sm-12 col-md col-xl col-lg">
        <Echart  v-if="loaded" :key="keyToRerender" :chartData="lineChartData" :chartOptions="chartOptions" />
      </div>
        <div class="col  col-xs-12 col-sm-12 col-md col-xl col-lg">
           <Line v-if="loaded" :key="keyToRerender" :chartData="lineChartData" :chartOptions="chartOptions" />
      </div>
    </div> -->
    <!-- seccion componenete grafico lineal -->
    <div class="row  justify-center  text-center q-col-gutter-xs">
      <div class="col  col-xs-12 col-sm-12 col-md col-xl col-lg">
        <Echart v-if="loaded" :key="keyToRerender" :chartData="lineChartData" />
      </div>
      <!-- seccion componenete observaciones -->
      <div class="col row col-xs-12 col-sm col-md-3 col-xl-3 col-lg-4">
        <ListItems v-if="loaded" :key="keyToRerender" :List="List" :Fecha="Fecha" />
      </div>
    </div>
    <!-- seccion componenete observacion general -->
    <div class="row justify-center  text-center q-col-gutter-xs">
      <div class="row col-xs-12 col-sm col-md col-xl col-lg">
        <CardObservacion v-if="loaded" :key="keyToRerender" :ObservacionProps="Observacion" :hayDatos="hayDatos"
          :hayCarta="tipoCarta" :Filtro="Filtro" :haySolucion="solucionCarta" :hayMetodo="metodoCarta"
          :hayMatriz="matrizCarta" @guardarObservacion="registrarObservacionGeneral"
          @ActualizarObservacion="actualizarObservacionGeneral" />
      </div>
       <!-- seccion componenete contadores -->
      <div class="row q-gutter-y-xs col-xs-12 col-sm-12 col-md col-xl col-lg">
        <Knob v-for="(valor, nombre) in ContadorFilas" :Nombre="nombre" :valor="valor" :key="nombre" />
      </div>
       <!-- seccion componenete graficos torta -->
      <div class="row col-xs-12 col-sm col-md col-xl col-lg-4">
        <Pie v-if="loaded" :key="keyToRerender" :dataPie="dataPie" :optionspie="optionspie" class="col-grow" />
      </div>
      <div class="row col-xs-12 col-sm col-md col-xl col-lg-4">
        <Pie v-if="loaded" :key="keyToRerender" :dataPie="dataPiedos" :optionspie="optionspie" />
      </div>
    </div>

  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuasar, LocalStorage } from 'quasar';
// utilidades
import utilidades from 'src/commons/utilidades';
//componentes
import Echart from 'src/components/Graficos/EchartComponent.vue';
import Line from 'src/components/Graficos/LineComponent.vue';
import Pie from 'src/components/Graficos/PieComponent.vue';
import Knob from 'src/components/KnobComponent.vue';
import Welcome from "src/components/Welcome.vue";
import CardData from "src/components/CardDataComponent.vue";
import Select from 'src/components/SelectComponent.vue';
import SelectCalendar from 'src/components/SelectCalendarComponent.vue';
import ListItems from 'src/components/ListItemsComponents.vue';
import CardObservacion from 'src/components/CardObservacionComponent.vue'
// servicio api graficos
import ApiService from 'src/commons/Datos/ADDashboard.js';

const $q = useQuasar();
const keyToRerender = ref(true);
const tipoCarta = ref();
const Filtro = ref([]);
const solucionCarta = ref();
const metodoCarta = ref();
const matrizCarta = ref();
const loaded = ref(false);
const disable = ref(false);
const disableSolucion = ref(false);
const clearable = ref(false);
const clearableSolucion = ref();
const clearableMatriz = ref(false);
const clearableMetodo = ref(false);
const disableMetodo = ref(false);
const disableMatriz = ref(false);
const labelselect = 'Carta';
const optionsselect = ref([
  {
    label: 'VERIFICACION',
    id: 'CCV',
    description: 'Carta Control Verificacion',
  },
  {
    label: 'RPD',
    id: 'CCRPD',
    description: 'Carta Control RPD',
  },
]);
const labelMatriz = 'Matriz';
const optionsMatriz = ref([]);
const labelMetodo = 'Metodo';
const optionsMetodo = ref([]);
const labelSolucion = 'Solucion';
const optionsSolucion = ref([]);
const List = ref([]);
const Observacion = ref([]);
const Fecha = ref({ dia: null, mes: null, año: null });
const DatosCarta = ref([]);
const ContadorFilas = ref({ UnidadMedida: 0, Metodo: 0, TipoMatriz: 0 });
const cardData = ref({ Minimo: 0, Media: 0, Desviacion_Estandar: 0, Maximo: 0 });
const lineChartData = ref({ labels: [], datasets: [] });
const dataPie = ref({ labels: [], datasets: [] });
const dataPiedos = ref({ labels: [], datasets: [] });
const optionspie = {
  responsive: true,
  maintainAspectRatio: true,
};

// Funciones de utilidad
const getColorByNombre = (backgroundcolor) => {
  const colorMap = {
    LimiteInferior: "#bcaaa4",
    Minimo: "#ff6961",
    Media: "#84b6f4",
    DesviacionEstandar: "#efa94a",
    Maximo: "#ba9df4",
    LimiteSuperior: "#77dd77",
  };
  return colorMap[backgroundcolor] || "gray";
}

const getIconByNombre = (icon) => {
  const iconMap = {
    LimiteInferior: "arrow_downward",
    Minimo: "trending_down",
    Media: "horizontal_rule",
    DesviacionEstandar: "stacked_line_chart",
    Maximo: "trending_up",
    LimiteSuperior: "arrow_upward",
  };
  return iconMap[icon] || "";
}

// Funciones para obtener y manejar datos
const obtenerCarta = async (carta, fecha) => {
  $q.loading.value = true;
  if (!fecha) {
    return;
  }
  //  console.log('fecha',carta, fecha)
  disableMetodo.value = true;
  disableMatriz.value = true;
  disableSolucion.value = false;
  clearableSolucion.value = true;
  tipoCarta.value = carta;
  if (carta === 'CCV') {
    clearableMetodo.value = false;
    clearableMatriz.value = false;
    clearableSolucion.value = true;
    disableMetodo.value = true;
    disableMatriz.value = true;
    tipoCarta.value = carta;
  }
  else if (carta === 'CCRPD') {
    clearableMetodo.value = true;
    clearableMatriz.value = true;
    clearableSolucion.value = false;
    disableMetodo.value = false;
    disableMatriz.value = false;
    disableSolucion.value = true;
    tipoCarta.value = carta;
  }
  try {
    const { dia = undefined, mes, año } = fecha;
    await obtenerFecha(carta, dia, mes, año);
  } catch (error) {
    console.log('Error al obtener la carta', error);
  } finally {
    $q.loading.value = false;
  }
};

const obtenerSolucionPatron = async (solucion, fecha) => {
  $q.loading.value = true;
  try {
    const solucionpatron = await ApiService.obtenerSolucionPatron();
    optionsSolucion.value = solucionpatron;
    if (solucion === null) {
      const { dia, mes, año } = fecha;
      solucionCarta.value = solucion;
      await obtenerFecha('CCV', dia, mes, año, null, null, null);
    }
    if (solucion) {
      const { dia, mes, año } = fecha;
      solucionCarta.value = solucion;
      await obtenerFecha('CCV', dia, mes, año, solucion, null, null);
      // await registrarObservacionGeneral(null, 'CCV', solucion);
    }
  } catch (error) {
    utilidades.mensaje(`Error al obtener la solución patrón, ${error}`);
  } finally {
    $q.loading.value = false;
  }
};

const obtenerMetodos = async (metodo, fecha) => {
  $q.loading.value = true;
  try {
    const Metodos = await ApiService.obtenerMetodos();
    optionsMetodo.value = Metodos;
    metodoCarta.value = metodo;
    if (metodo === null) {
      const { dia, mes, año } = fecha;
      metodoCarta.value = metodo;
      await obtenerFecha('CCRPD', dia, mes, año, null, null, null);
    }
    if (metodo) {
      const { dia, mes, año } = fecha;
      metodoCarta.value = metodo;
      await obtenerFecha('CCRPD', dia, mes, año, null, metodo, null);
      // await registrarObservacionGeneral(null, 'CCRPD', null, metodo);
    }
  } catch (error) {
    utilidades.mensaje(`Error al obtener los métodos, ${error}`);
  } finally {
    $q.loading.value = false;
  }
}

const obtenerTipoMatriz = async (matriz, fecha) => {
  $q.loading.value = true;
  try {
    const TipoMatriz = await ApiService.obtenerTipoMatriz();
    optionsMatriz.value = TipoMatriz;
    matrizCarta.value = matriz;
    if (matriz === null) {
      const { dia, mes, año } = fecha;
      matrizCarta.value = matriz;
      await obtenerFecha('CCRPD', dia, mes, año, null, null, null);
    }
    if (matriz) {
      const { dia, mes, año } = fecha;
      matrizCarta.value = matriz;
      await obtenerFecha('CCRPD', dia, mes, año, null, null, matriz);
      // await registrarObservacionGeneral(null, 'CCRPD', null, null, matriz);
    }
  } catch (error) {
    utilidades.mensaje(`Error al obtener el tipo de matriz, ${error}`);
  } finally {
    $q.loading.value = false;
  }
}

const obtenerFecha = async (data, dia, mes, año, solucion, metodo, matriz) => {
  $q.loading.value = true;
  keyToRerender.value += 1;
  disableMetodo.value = true;
  disableMatriz.value = true;
  disableSolucion.value = false;
  var dato = data;

  if (data === 'CCV') {
    tipoCarta.value = data;
    disableMetodo.value = true;
    disableMatriz.value = true;
    clearableMetodo.value = false;
    clearableMatriz.value = false;
    clearableSolucion.value = true;
    DatosCarta.value = { data };
    dato = data;
  }
  else if (data === 'CCRPD') {
    tipoCarta.value = data;
    clearableMetodo.value = true;
    clearableMatriz.value = true;
    clearableSolucion.value = false;
    metodoCarta.value = metodo;
    matrizCarta.value = matriz;
    DatosCarta.value = { data };
    disableMetodo.value = false;
    disableMatriz.value = false;
    disableSolucion.value = true;
    dato = data;
  }
  try {
    var filtro = {
      TipoCarta: dato,
      Dia: dia,
      Mes: mes,
      Anio: año,
      SolucionPatron: solucion,
      Metodo: metodo,
      Matriz: matriz
    };

    Fecha.value = { mes, año };
    await obtenerAnalisisDatos(filtro);
    await obtenerDatosGrafico(filtro);
    await obtenerObservacione(filtro);
    await obteneObservacionGeneral(filtro);
    await obtenerAprobadosYverficados(filtro);
    // await actualizarObservacionGeneral(filtro);
    Filtro.value = filtro;
  } catch (error) {
    utilidades.mensaje(`Error al obtener la fecha, ${error}`);
  } finally {
    $q.loading.value = false;
  }
}

const obtenerAnalisisDatos = async (filtro) => {
  $q.loading.value = true;
  try {
    const AnalisisDatos = await ApiService.obtenerAnalisisDatos(filtro);
    cardData.value = AnalisisDatos;
  } catch (error) {
    utilidades.mensaje(`Error al obtener el análisis de datos, ${error}`);
  } finally {
    $q.loading.value = false;
  }
}

const obtenerDatosGrafico = async (filtro) => {
  $q.loading.value = true;
  try {
    const graficolineal = await ApiService.obtenerDatosGraficoLineal(filtro);
    // utilidades.mensaje(`Error , ${graficolineal.data}`);
    lineChartData.value = graficolineal.Result;
  } catch (error) {
    utilidades.mensaje(`Error al obtener los datos del gráfico, ${error}`);
  } finally {
    $q.loading.value = false;
  }
}

const obtenerObservacione = async (filtro) => {
  $q.loading.value = true;
  try {
    const Observacione = await ApiService.obtenerObservaciones(filtro);
    List.value = Observacione;
  } catch (error) {
    utilidades.mensaje(`Error al obtener las observaciones, ${error}`);
  } finally {
    $q.loading.value = false;
  }

}

const obteneObservacionGeneral = async (filtro) => {
  $q.loading.value = true;
  try {
    const ObservaGeneral = await ApiService.obtenerObservacionGeneral(filtro);
    Observacion.value = ObservaGeneral;
  } catch (error) {
    utilidades.mensaje(`Error al obtener la observación general, ${error}`);
  } finally {
    $q.loading.value = false;
  }
}

const obtenerAprobadosYverficados = async (filtro) => {
  $q.loading.value = true;
  try {
    const AprobadosYverficados = await ApiService.obtenerAprobadosYverificados(filtro);
    dataPie.value = AprobadosYverficados[0].dataPie;
    dataPiedos.value = AprobadosYverficados[0].dataPiedos;
  } catch (error) {
    utilidades.mensaje(`Error al obtener los aprobados y verificados, ${error}`);
  } finally {
    $q.loading.value = false;
  }
}

const obtenerContadorFilas = async () => {
  $q.loading.value = true;
  try {
    const contador = await ApiService.obtenerContadorFilas();
    ContadorFilas.value = contador;
  } catch (error) {
    utilidades.mensaje(`Error al obtener el contador de filas, ${error}`);
  } finally {
    $q.loading.value = false;
  }
}

const crearGrafica = async () => {
  $q.loading.value = true;
  loaded.value = false;
  try {
    await obtenerCarta();
    loaded.value = true;
  } catch (error) {
    utilidades.mensaje(`Error al cargar datos en el gráfico, ${error}`);
  } finally {
    $q.loading.value = false;
  }
};

const registrarObservacionGeneral = async (observacion, filtro) => {
  $q.loading.value = true;
  try {
    const login = LocalStorage.getItem('usuarioSilaguas');
    const ObservacionG = {
      Carta: filtro.TipoCarta,
      IdSolucion: filtro.SolucionPatron,
      IdMetodo: filtro.Metodo,
      IdMatriz: filtro.Matriz,
      Observacion: observacion,
      Mes: filtro.Mes,
      Anio: filtro.Anio,
      Login: login.Login,
    };
    await ApiService.InsertarObservacionGeneral(ObservacionG);
    await obteneObservacionGeneral(filtro);

  } catch (error) {
    utilidades.mensaje(`Error al registrar la observación general, ${error}`);
  } finally {
    $q.loading.value = false;
  }
};

const actualizarObservacionGeneral = async (observacionA, filtro) => {
  $q.loading.value = true;
  try {
    const AObservacionG = {
      Carta: filtro.TipoCarta,
      Observacion: observacionA.Observacion,
      IdObservacionV: observacionA.id
    };
    // console.log('hola', AObservacionG)
    await ApiService.ActualizarObservacionGeneral(AObservacionG);
    await obteneObservacionGeneral(filtro);
  } catch (error) {
    utilidades.mensaje(`Error al actualizar la observación general, ${error}`);
  } finally {
    $q.loading.value = false;
  }
}

// Montadas en el DOM
onMounted(() => {
  crearGrafica();
  obtenerMetodos();
  obtenerTipoMatriz();
  obtenerSolucionPatron();
  obtenerContadorFilas();
});

// Funciones computadas
const hayDatos = computed(() => {
  return Object.keys(List.value).length > 0;
});
</script>
src/commons/Datos/ApiService
