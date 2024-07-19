<template>
  <div class="q-pa-md bg-white shadow-1 col col-xs-12 col-sm-12 col-md justify-center items-center" style="border-radius: 10px;">
    <div ref="chart" style="width: 100%; height: 300px; border-radius: 10px;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, defineProps, onBeforeUnmount, defineEmits } from 'vue';
import * as echarts from 'echarts';

const emit = defineEmits(['imagenCapturada']);
const props = defineProps({
  chartData: {
    type: Object,
    default: () => ({}),
  },
  captureEvent: {
    type: String,
    default: '', // Nombre del evento para activar la captura del gráfico desde el dashboard
  },
});

const chart = ref(null);
let myChart = null;



const renderChart = (chartDom, chartData) => {
  if (myChart) {
    myChart.dispose();
  }
  myChart = echarts.init(chartDom);

  const option = {
    title: {
      text: '',
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      triggerOn: 'mousemove|click',
    },
    legend: {
      data: chartData.datasets ? chartData.datasets.map(dataset => dataset.label) : [],
    },
    grid: {
      left: '0.1%',
      right: '0.1%',
      bottom: '1.5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: chartData.labels || [],
    },
    yAxis: {
      type: 'value',
      min: value => value.min - 0,
      max: value => value.max - 0,
      boundaryGap: [0, '100%'],
      axisLabel: {
        formatter: function (value) {
          return value != null ? value.toFixed(2) : '';
        },
      },
    },
    // series: chartData.datasets.map((dataset) => ({
    //   name: dataset.label,
    //   type: 'line',
    //   smooth: true,
    //   data: dataset.data.map(value => value != null ? Number(value).toFixed(2) : null),
    //   itemStyle: {
    //     color: dataset.backgroundColor,
    //     borderColor: dataset.borderColor,
    //   },
    // })),
    series: chartData.datasets.map((dataset) => {
      const isSpecialSample = ["Muestra", "Agua Cruda", "Agua Tratada"].includes(dataset.label);
      const specialColor = dataset.label === "Muestra"  ? 'black' : dataset.backgroundColor;
      const specialBorderColor = dataset.label === "Muestra" ? 'black' : dataset.borderColor;
      return {
        name: dataset.label,
        type: 'line',
        smooth: true,
        data: dataset.data.map((value, index) => ({
          value: value != null ? Number(value).toFixed(2) : null,
          symbolSize: isSpecialSample ? 5: 4,
        })),
        itemStyle: {
          color: specialColor,
          borderColor: specialBorderColor,
        },
      };
    }),
  };

  myChart.setOption(option);
  window.addEventListener('resize', myChart.resize);
};




const captureChartAsImage = () => {
  if (myChart) {
    const imageDataUrl = myChart.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#fff' });
    emit('imagenCapturada', imageDataUrl);
  }
};

onMounted(() => {
  nextTick(() => {
    if (chart.value && props.chartData.labels && props.chartData.labels.length > 0) {
      renderChart(chart.value, props.chartData);
    } else {
      showNoDataWatermark(chart.value);
    }
  });
});

const showNoDataWatermark = (chartDom) => {
  if (myChart) {
    myChart.dispose();
  }
  myChart = echarts.init(chartDom);
  const optionNoData = {
    graphic: [{
      type: 'group',
      rotation: Math.PI / 8.5,
      bounding: 'raw',
      right: 'center',
      bottom: 'center',
      z: 100,
      children: [{
        type: 'rect',
        left: 'center',
        top: 'center',
        z: 100,
        shape: {
          width: 1000,
          height: 50,
        },
        style: {
          fill: 'rgba(0,0,0,0.3)',
        },
      },
      {
        type: 'text',
        left: 'center',
        top: 'center',
        z: 100,
        style: {
          fill: '#fff',
          text: 'No hay Datos',
          font: 'bold 30px Roboto',
        },
      }],
    }],
    autoResize: true,
    maintainAspectRatio: true,
  };

  myChart.setOption(optionNoData);
  window.addEventListener('resize', myChart.resize);
};

watch(() => props.chartData, (newData) => {
  nextTick(() => {
    if (chart.value && newData.labels && newData.labels.length > 0) {
      renderChart(chart.value, newData);
    } else {
      showNoDataWatermark(chart.value);
    }
  });
});

onBeforeUnmount(() => {
  if (myChart) {
    myChart.dispose();
    window.removeEventListener('resize', myChart.resize);
  }
});

watch(() => props.captureEvent, (eventName) => {
  if (eventName === 'capturarImagen') {
    captureChartAsImage();
  }

});
</script>
