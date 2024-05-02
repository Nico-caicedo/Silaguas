<!-- dashboard -->

<template>
  <main class="q-pa-sm column q-col-gutter-xs bg-grey-3">
    <div class="row items-center justify-center  text-center q-col-gutter-xs">
      <div class="row  items-center text-center col-xs-12 col-sm-12 col-md col-xl col-lg-4">
        <welcome :DatosCarta="DatosCarta" :Fecha="Fecha" class="col-xs-12 col-sm-12 col-md col-xl col-lg" />
      </div>
      <div
        class="row justify-between items-center justify-stretch q-gutter-xs col-xs-12 col-sm-6 col-md col-xl col-lg-4">
        <CardData v-for="(item, index) in cardData" :key="index" :Nombre="index" :valor="item"
          :icon="getIconByNombre(index)" :backgroundcolor="getColorByNombre(index)"
          class="shadow-1 col-grow ellipsis" />
      </div>
      <div class="row justify-between items-center justify-stretch q-gutter-xs col-xs-12 col-sm col-md col-xl col-lg-4">
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
    <div class="row justify-between items-stretch content-stretch q-gutter-sm">
      <div class="col  col-xs-12 col-sm-12 col-md col-xl col-lg">
        <Line v-if="loaded" :key="keyToRerender" :chartData="lineChartData" :chartOptions="chartOptions" />
      </div>
      <div class="col row col-xs-12 col-sm col-md-3 col-xl-4 col-lg-2">
        <List v-if="loaded" :key="keyToRerender" :List="List" :Fecha="Fecha" />
      </div>
    </div>
    <div class="row items-stretch content-stretch q-gutter-sm">
      <div class="row q-gutter-y-xs col-xs-12 col-sm-12 col-md col-xl col-lg">
        <Knob v-for="(valor, nombre) in ContadorFilas" :Nombre="nombre" :valor="valor" :key="nombre" />
      </div>
      <div class="row col-xs-12 col-sm col-md col-xl col-lg-4">
        <Pie v-if="loaded" :key="keyToRerender" :dataPie="dataPie" :optionspie="optionspie" class="col-grow" />
      </div>
      <div class="row col-xs-12 col-sm col-md col-xl col-lg-4">
        <Pie v-if="loaded" :key="keyToRerender" :dataPie="dataPiedos" :optionspie="optionspie" />
      </div>
    </div>
  </main>
</template>

<script>
import { ref, onMounted } from 'vue';
import alertUtils from 'src/commons/alertUtils';
import Bar from 'src/components/Graficos/BarComponent.vue';
import Line from 'src/components/Graficos/LineComponent.vue';
import Pie from 'src/components/Graficos/PieComponent.vue';
import Knob from 'src/components/KnobComponent.vue';
import Welcome from "src/components/Welcome.vue";
import CardData from "src/components/CardDataComponent.vue";
import Select from 'src/components/SelectComponent.vue';
import SelectCalendar from 'src/components/SelectCalendarComponent.vue';
import List from 'src/components/ListItemsComponents.vue';
import CardObservacion from 'src/components/CardObservacionComponent.vue'
import ApiService from 'src/services/ApiService';


export default {
  components: {
    Bar,
    Line,
    List,
    Pie,
    Welcome,
    CardData,
    Select,
    SelectCalendar,
    CardObservacion,
    Knob,
  },

  setup() {
    const keyToRerender = ref(false);
    const tipoCarta = ref();
    const solucionCarta = ref();
    const metodoCarta = ref();
    const matrizCarta = ref()
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
    const Fecha = ref({ dia: null, mes: null, año: null });
    const DatosCarta = ref([]);
    const ContadorFilas = ref({ UnidadMedida: 0, Metodo: 0, TipoMatriz: 0 });
    const cardData = ref({});
    const lineChartData = ref({
      labels: [],
      datasets: []
    });

    const chartOptions = ref({
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Carta Control'
        },
        legend: {
          display: true,
          text: ''
        },
      },
      layout: {
        padding: {
          top: 5,
          bottom: 5,
          left: 5,
          right: 5,
        },
      },
    });

    const dataPie = ref({
      labels: [], // Initialize labels with an empty array
      datasets: []
    });

    const dataPiedos = ref({
      labels: [], // Initialize labels with an empty array
      datasets: []
    });

    const optionspie = {
      responsive: true,
      maintainAspectRatio: true,
    };

    const dataBar = ref({
      labels: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
      ],
      datasets: [
        {
          label: 'Carta Verificacion  2023',
          backgroundColor: '#bcaaa4',
          data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
        },
        {
          label: 'Carta RPD 2023',
          backgroundColor: '#1976d2',
          data: [80, 50, 12, 39, 10, 40, 39, 10, 70, 20, 12, 11]
        },
        {
          label: 'Carta Verificacion 2024',
          backgroundColor: '#efa94a',
          data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
        },
        {
          label: 'Carta RPD 2024',
          backgroundColor: '#ba9df4',
          data: [80, 50, 12, 39, 10, 40, 39, 10, 70, 20, 12, 11]
        }
      ]
    });

    const optionsBar = {
      responsive: true,
      maintainAspectRatio: false
    };

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

    const obtenerCarta = async (carta, fecha) => {
      if (!fecha) {
        return;
      }
      // console.log('fecha',carta, fecha)
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
      }
    };

    const obtenerSolucionPatron = async (solucion, fecha) => {
      // console.log(solucion, fecha)
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
        }
      } catch (error) {
        console.log('Error al obtener la solución patrón', error);
      }
    };

    const obtenerMetodos = async (metodo, fecha) => {
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
        }
      } catch (error) {
        console.log('Error al obtener la obtener Metodos', error);
      }
    }

    const obtenerTipoMatriz = async (matriz, fecha) => {
      // console.log(matriz,fecha)
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
        }
      } catch (error) {
        console.log('error Tipo matriz dashboard', error);
      }
    }

    const obtenerFecha = async (data, dia, mes, año, solucion, metodo, matriz) => {
      // keyToRerender.value += 1;
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
        await obtenerAnalisisDatos(filtro);
        await cargarDatosGrafico(filtro, mes, año);
        await obtenerObservacione(filtro);
        await obtenerAprobadosYverficados(filtro);
      } catch (error) {
        console.log('Error al obtener la fecha', error);
      }
    }

    const obtenerAnalisisDatos = async (filtro) => {
      try {
        const AnalisisDatos = await ApiService.obtenerAnalisisDatos(filtro);
        cardData.value = AnalisisDatos;
      } catch (error) {
        console.log('error datos carta dashboard', error);
      }
    }

    const cargarDatosGrafico = async (filtro, mes, año) => {
      try {
        Fecha.value = { mes, año };
        const graficolineal = await ApiService.obtenerDatosGraficoLineal(filtro);
        lineChartData.value = {
          labels: graficolineal.labels,
          datasets: graficolineal.datasets
        };
      } catch (error) {
        if (error.response && error.response.data && error.response.data.Message) {
          alertUtils.Notify(error.response.data.Message, 'advertencia');
        }
      }
    };

    const obtenerObservacione = async (filtro) => {
      try {
        const Observacione = await ApiService.obtenerObservaciones(filtro);
        List.value = Observacione; // Asigna el array completo de observaciones
      } catch (error) {
        console.log('error en las observaciones', error);
      }
    }


    const obtenerAprobadosYverficados = async (filtro) => {
      try {
        const AprobadosYverficados = await ApiService.obtenerAprobadosYverificados(filtro);
        dataPie.value = AprobadosYverficados[0].dataPie;
        dataPiedos.value = AprobadosYverficados[0].dataPiedos;
      } catch (error) {
        console.log('error al obtener aprobados y verificados', error);
      }
    }

    const obtenerContadorFilas = async () => {
      try {
        const contador = await ApiService.obtenerContadorFilas();
        ContadorFilas.value = contador;
      } catch (error) {
        console.log('error en el contador', error);
      }
    }

    // cargar los filtros
    const crearGrafica = async () => {
      loaded.value = false;
      try {
        await obtenerCarta();
        loaded.value = true;
      } catch (error) {
        console.error('Error al cargar datos en el gráfico:', error);
      }
    };

    onMounted(() => {
      crearGrafica();
      obtenerMetodos();
      obtenerTipoMatriz();
      obtenerSolucionPatron();
      obtenerContadorFilas();
    });

    return {
      loaded,
      keyToRerender,
      tipoCarta,
      solucionCarta,
      metodoCarta,
      matrizCarta,
      clearable,
      clearableSolucion,
      clearableMatriz,
      clearableMetodo,
      disable,
      disableSolucion,
      disableMetodo,
      disableMatriz,
      labelselect,
      labelSolucion,
      labelMetodo,
      labelMatriz,
      optionsselect,
      optionsSolucion,
      optionsMetodo,
      optionsMatriz,
      List,
      Fecha,
      ContadorFilas,
      cardData,
      dataPie,
      dataPiedos,
      optionspie,
      dataBar,
      optionsBar,
      lineChartData,
      chartOptions,
      DatosCarta,
      getColorByNombre,
      getIconByNombre,
      obtenerMetodos,
      obtenerTipoMatriz,
      obtenerCarta,
      obtenerSolucionPatron,
      obtenerFecha,
    }
  }
}
</script>

<style>
.container {
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
}

.article_info>div>p {
  margin: 0 !important;
  color: #f2f3f5;
}

.br_grey {
  border-radius: 0.3em;
  border: 1px solid #eeeded !important;
}

.article_info {
  background-color: white;
  align-items: center;
  justify-content: space-around;
  display: flex !important;
}

.article_info:hover {
  transition: all 0.3s ease;
  transform: scale(1.01);
}

.article_info>div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
