<!-- dashboard -->

<template>
  <main class="q-pa-md  content q-gutter-xs">
    <div class="row items-center justify-center  text-center q-col-gutter-xs">
      <div class="col row items-center text-center">
        <welcome :DatosCarta="DatosCarta" class="text-wrap" />
      </div>
      <div class="col row wrap justify-between items-center justify-stretch q-gutter-xs">
        <CardData v-if="loaded" v-for="(item, index) in cardData" :key="index.keyToRerender" :Nombre="index" :valor="item"
          :icon="GetIconByNombre(index)" :backgroundcolor="getColorByNombre(index)" class="shadow-1 col-grow ellipsis" />
      </div>
      <div class="col row wrap justify-between items-center justify-stretch q-gutter-xs">
        <div class="col q-gutter-xs">
          <Select :disable="disable" :options="optionsselect" :label="labelselect"
            @FiltroSeleccionado="FiltroSeleccionado" class="ellipsis-3-lines col shadow-1"
            style="border-radius: 100px;" />
          <SelectCalendar @FiltroSeleccionado="FiltroSeleccionado" class="ellipsis col shadow-1"
            style="border-radius: 100px;" />
        </div>
        <div class="col q-gutter-xs">
          <Select :options="optionsSolucion" :label="labelSolucion" :disable="disableSolucion"
            @FiltroSeleccionado="FiltroSeleccionado" class="col " style="border-radius: 100px;" />
          <Select :options="optionsMetodo" :label="labelMetodo" class="ellipsis-3-lines col shadow-1"
            :disable="disableMetodo" style="border-radius: 100px;" /> <!-- Agregamos :disable="disableMetodo" -->
        </div>
        <div class="col q-gutter-xs">
          <Select class="ellipsis-3-lines col" style="border-radius: 100px;" />
          <Select :options="optionsMatriz" :label="labelMatriz" class="ellipsis-3-lines col" :disable="disableMatriz"
            style="border-radius: 100px;" /> <!-- Agregamos :disable="disableMatriz" -->
        </div>
      </div>

    </div>

    <div class="row wrap justify-between items-stretch content-stretch q-gutter-sm">
      <div class="col justify-center items-center container">
        <Line v-if="loaded" :key="keyToRerender" :chartData="lineChartData" :options="chartOptions"
          style="max-height: 300px" />
      </div>
      <div class="wrap items-center listitemns" style="width: 350px;">
        <ListItems v-if="loaded" :key="keyToRerender" :List="List" :Fecha="Fecha" />
      </div>
    </div>

    <div class="row wrap justify-between items-stretch content-stretch q-gutter-sm">
      <div class="column col-1" style="gap:5px;">
        <Knob v-for="(valor, index) in ContadorFilas" v-if="loaded" :Nombre="index" :key="index" :valor="valor"
          class="" />
      </div>
      <div class="row justify-center items-center container">
        <div class="col">
          <Pie v-if="loaded" :key="keyToRerender" :dataPie="dataPie" :optionspie="optionspie"
            style="max-height: 500px ;max-width:300px;" />
        </div>

      </div>
      <div class="row justify-center items-center container">
        <div class="col">
          <Pie v-if="loaded" :key="keyToRerender" :dataPie="dataPiedos" :optionspie="optionspie"
            style="max-height: 500px ;max-width:300px;" /> 
        </div>
      </div>
      <div class="col justify-center items-center container">
        <Bar v-if="loaded" :dataBar="dataBar" :options="optionsBar" style="max-height: 350px;" />
      </div>

    </div>
  </main>
</template>


<script>
import { ref, onMounted } from 'vue';
import Bar from 'src/components/Graficos/BarComponent.vue';
import Line from 'src/components/Graficos/LineComponent.vue';
import Pie from 'src/components/Graficos/PieComponent.vue';
import Knob from 'src/components/KnobComponent.vue';
import Welcome from "src/components/Welcome.vue";
import CardData from "src/components/CardDataComponent.vue";
import Select from 'src/components/SelectComponent.vue';
import SelectCalendar from 'src/components/SelectCalendarComponent.vue';
import ListItems from 'src/components/ListItemsComponents.vue';
import CardObservacion from 'src/components/CardObservacionComponent.vue'
import ApiService from 'src/services/ApiService';

export default {
  components: {
    Bar,
    Line,
    Pie,
    Welcome,
    CardData,
    Select,
    SelectCalendar,
    CardObservacion,
    Knob,
    ListItems
  },
  setup() {
    const keyToRerender = ref(true);
    const loaded = ref(false);
    const disable = ref(false);
    const disableSolucion = ref(false)
    const disableMetodo = ref(false);
    const disableMatriz = ref(false);
    const defaultValue = ref({
      label: 'CCV',
      value: 'CCV',
      description: 'Carta Control Verificacion',
    },);

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
    const optionsMatriz = ref([
    ]);

    const labelMetodo = 'Metodo';
    const optionsMetodo = ref([]
    );
    const labelSolucion = 'Solucion';
    const optionsSolucion = ref([]);
    const List = ref([]);
    const Fecha = ref([]);
    const DatosCarta = ref([]);
    const ContadorFilas = ref({ UnidadMedida: 0, Metodo: 0, TipoMatriz: 0 });
    const cardData = ref([]);

    const dataPie = ref({
      labels: [],
      datasets: []
    });
    const dataPiedos = ref({
      labels: [],
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

    const chartData = ref(null);
    const lineChartData = ref([]);

    const chartOptions = {
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
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        },
      },
    };


    const obtenerSolucionPatron = async () => {
      try {
        const solucionpatron = await ApiService.obtenerSolucionPatron();
        const optionsSolucion = solucionpatron.data.map((datos) => ({
          label: datos.Concentracion,
          id: datos.IdSolucionPatron,
          description: datos.Descripcion
        }));
        return optionsSolucion;
      } catch (error) {
        console.log('error solucionpatron dashboard', error)
      }
    }

    const obtenerMetodos = async () => {
      try {
        const solucionpatron = await ApiService.obtenerMetodos();
        // console.log(solucionpatron)
        const optionsMetodo = solucionpatron.data.map((datos) => ({
          label: datos.Nombre,
          id: datos.IdMetodo,
          description: datos.Nombre
        }));
        return optionsMetodo;
      } catch (error) {
        console.log('error solucionpatron dashboard', error)
      }
    }

    const obtenerTipoMatriz = async () => {
      try {
        const obtenerTipoMatriz = await ApiService.obtenerTipoMatriz();
        // console.log(solucionpatron)
        const optionsTipoMatriz = obtenerTipoMatriz.data.map((datos) => ({
          // label: datos.Nombre,
          // id: datos.IdMetodo,
          // description: datos.Nombre
        }));
        return optionsTipoMatriz;
      } catch (error) {
        console.log('error solucionpatron dashboard', error)
      }
    }


    const FiltroSeleccionado = async (data) => {
      console.table('DATA', data)
      keyToRerender.value += 1;
      var dato = "CCV";
      disableMetodo.value = true;
      disableMatriz.value = true;
      disableSolucion.value = false;
      if (data !== undefined) {
        if (data === "CCRPD") {
          loaded.value = true;
          disableMetodo.value = false;
          disableMatriz.value = false;
          disableSolucion.value = true;
          dato = data;
        } else if (data === "CCV") {
          dato = data;
          disableMetodo.value = true;
          disableMatriz.value = true;
        }
      }
      try {
        const rangodata = await ApiService.obtenerDatosGraficos(dato, data);
        cardData.value =
        {
          LimiteInferior: rangodata.data.Cardata.LimiteInferior || 0.0,
          LimiteSuperior: rangodata.data.Cardata.LimiteSuperior || 0.0,
          Minimo: rangodata.data.Cardata.Minimo || 0.0,
          Media: rangodata.data.Cardata.Media || 0.0,
          DesviacionEstandar: rangodata.data.Cardata.DesviacionEstandar || 0.0,
          Maximo: rangodata.data.Cardata.Maximo || 0.0,
        };

        // console.table(CardData.value)
        // nombre de la carta
        let nombreCarta = '';
        if (dato == 'CCV') {
          nombreCarta = 'Carta Control Verificacion';
          DatosCarta.value.nombreCarta = nombreCarta
        } else if (dato == 'CCRPD') {
          nombreCarta = 'Carta Control RPD';
          DatosCarta.value.nombreCarta = nombreCarta
        }

        const currentDate = new Date();
        const currentMonthIndex = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const currentMonth = months[currentMonthIndex];
        chartOptions.plugins.title.text = `${nombreCarta} - ${currentMonth} - ${currentYear}`;

        Fecha.value.fecha = `${currentMonth}-${currentYear}`;
        DatosCarta.value.Fecha = `${currentMonth}-${currentYear}`;



        const datos = rangodata.data.EstadisticasProceso.map((datos) => ({
          LCI: datos.LCI,
          LAI: datos.LAI,
          Menos1s: datos.Menos1s,
          Media: datos.Media,
          Mas1s: datos.Mas1s,
          LAS: datos.LAS,
          LCS: datos.LCS,
        }));
        const valoresDiarias = rangodata.data.ValoresDiarias.map((datos) => ({
          Dia: datos.Dia,
          Valor: datos.Valor,
        }));



        const diasDelMes = Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }, (_, i) => i + 1);
        const valoresDiariasCompletos = diasDelMes.map(dia => {
          const diaExistente = valoresDiarias.find(valores => new Date(valores.Dia).getDate() === dia);
          return diaExistente || { Dia: new Date(new Date().getFullYear(), new Date().getMonth(), dia), Valor: null };
        });

        lineChartData.value.labels = valoresDiariasCompletos.map((datos) => {
          const fecha = new Date(datos.Dia);
          return fecha.toLocaleDateString('es-ES', { day: 'numeric' });
        });

        if (dato === 'CCV') {
          lineChartData.value.datasets = [
            {
              label: 'Valor',
              backgroundColor: 'black',
              borderColor: 'transparent',
              data: valoresDiarias.map((datos) => datos.Valor)
            },
            {
              label: 'LCI',
              backgroundColor: '#d50000',
              borderColor: '#d50000',
              data: datos.map((dato) => dato.LCI),
            },
            {
              label: 'LAI',
              backgroundColor: '#ff8900',
              borderColor: '#ff8900',
              data: datos.map((dato) => dato.LAI),
            },
            {
              label: '-1s',
              backgroundColor: '#ffeb3b',
              borderColor: '#ffeb3b',
              data: datos.map((dato) => dato.Menos1s),
            },
            {
              label: 'Media',
              backgroundColor: '#0d47a1',
              borderColor: '#0d47a1',
              data: datos.map((dato) => dato.Media),
            },
            {
              label: '+1s',
              backgroundColor: '#ffeb3b',
              borderColor: '#ffeb3b',
              data: datos.map((dato) => dato.Mas1s),
            },
            {
              label: 'LAS',
              backgroundColor: '#ff8900',
              borderColor: '#ff8900',
              data: datos.map((dato) => dato.LAS),
            },
            {
              label: 'LCS',
              backgroundColor: '#d50000',
              borderColor: '#d50000',
              data: datos.map((dato) => dato.LCS),
            }
          ];
        } else if (dato === 'CCRPD') {
          lineChartData.value.datasets = [
            {
              label: 'Valor',
              backgroundColor: 'black',
              borderColor: 'transparent',
              data: valoresDiarias.map((datos) => datos.Valor)
            },
            {
              label: 'Media',
              backgroundColor: '#0d47a1',
              borderColor: '#0d47a1',
              data: datos.map((dato) => dato.Media),
            },
            {
              label: '+1s',
              backgroundColor: '#ffeb3b',
              borderColor: '#ffeb3b',
              data: datos.map((dato) => dato.Mas1s),
            },
            {
              label: 'LAS',
              backgroundColor: '#ff8900',
              borderColor: '#ff8900',
              data: datos.map((dato) => dato.LAS),
            },
            {
              label: 'LCS',
              backgroundColor: '#d50000',
              borderColor: '#d50000',
              data: datos.map((dato) => dato.LCS),
            }
          ];
        }

        // observaciones de la carta selcionada
        const Observaciones = rangodata.data.Observaciones.map((datos) => ({
          Observacion: datos.Observacion,
          Fecha: datos.Fecha,
          Name: datos.Login,
        }));

        List.value = Observaciones.map((obs) => {
          const fecha = new Date(obs.Fecha);
          return {
            Observacion: obs.Observacion,
            Name: obs.Name,
            Dia: fecha.getDate(),

            Tiempo: fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
          };
        });

        // contadores de las tablas
        ContadorFilas.value.UnidadMedida = rangodata.data.ContadorFilas.UnidadMedida;
        ContadorFilas.value.Metodo = rangodata.data.ContadorFilas.Metodo;
        ContadorFilas.value.TipoMatriz = rangodata.data.ContadorFilas.TipoMatriz;


        // aprobados y verificados graficos pie
        const AprobadosYVerificados = rangodata.data.AprobadosYVerificados.map((datos) => ({
          Verificados: datos.IsVerificado == true,
          NoVerificado: datos.IsVerificado == false,
          Aprobado: datos.IsAprobado == true,
          NoAprobado: datos.IsAprobado == false,
        }));
        const aprobados = AprobadosYVerificados.filter(item => item.Aprobado);
        const verificados = AprobadosYVerificados.filter(item => item.Verificados);
        const sinAprobar = AprobadosYVerificados.filter(item => !item.Aprobado);
        const sinVerificar = AprobadosYVerificados.filter(item => !item.Verificados);
        const total = AprobadosYVerificados.length;
        const labels = ['Aprobados', 'Sin Aprobar'];
        const datasetspie = [
          {
            backgroundColor: ['#1976d2', '#DD1B16', '#'],
            data: [(aprobados.length / total) * 100,
            (sinAprobar.length / total) * 100,
            ]
          },
        ];
        const labelspiedos = ['Verificados', 'Sin Verificar'];
        const datasetspiedos = [
          {
            backgroundColor: ['#41B883', '#efa94a'],
            data: [
              (verificados.length / total) * 100,
              (sinVerificar.length / total) * 100
            ]
          },
        ];
        dataPiedos.value.labels = labelspiedos;
        dataPiedos.value.datasets = datasetspiedos;
        dataPie.value.labels = labels;
        dataPie.value.datasets = datasetspie;


        return { lineChartData: lineChartData.value, dataPie, dataPiedos, DatosCarta, Fecha, List };

      } catch (error) {
        console.error('Error al obtener datos para el grafico dash', error);
        throw error;
      }
    };

    const crearGrafica = async () => {
      loaded.value = false;
      try {
        optionsMetodo.value = await obtenerMetodos();
        optionsSolucion.value = await obtenerSolucionPatron();
        await FiltroSeleccionado(); // Llamar a FiltroSeleccionado después de AnalisisDatos
        loaded.value = true;
      } catch (error) {
        console.error('Error al cargar datos en el gráfico:', error);
      }
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
    };
    const GetIconByNombre = (icon) => {
      const iconMap = {
        LimiteInferior: "arrow_downward",
        Minimo: "trending_down",
        Media: "horizontal_rule",
        DesviacionEstandar: "stacked_line_chart",
        Maximo: "trending_up",
        LimiteSuperior: "arrow_upward",
      };
      return iconMap[icon] || "";
    };
    onMounted(() => {
      crearGrafica();
    });
    return {
      keyToRerender,
      disable,
      disableSolucion,
      disableMetodo,
      disableMatriz,
      defaultValue,
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
      loaded,
      dataPie,
      dataPiedos,
      optionspie,
      dataBar,
      optionsBar,
      chartData,
      lineChartData,
      chartOptions,
      DatosCarta,
      crearGrafica,
      // AnalisisDatos,
      getColorByNombre,
      GetIconByNombre,
      obtenerSolucionPatron,
      obtenerMetodos,
      obtenerTipoMatriz,
      FiltroSeleccionado,
      obtenerSolucionPatron
    };
  },
};
</script>

<style>
.container {
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
}

.listitemns {
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  background-color: white;
  border-radius: 10px;

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

.content {
  background-color: rgb(230, 231, 230) !important;
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: calc(100vh - 46px)
}
</style>

src/commons/Datos/ApiService
