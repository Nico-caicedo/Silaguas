<template>
  <div class="q-pa-md bg-white shadow-1 col row justify-center items-center" style="border-radius: 10px;">
    <div ref="chart" style="width: 100%; height: 100%; border-radius: 10px;"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, nextTick, defineProps, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  dataPie: {
    type: Object,
    default: () => ({}),
  },
  optionsPie: {
    type: Object,
    default: () => ({}),
  },
});

const chart = ref(null);
let myChart = null;

const renderChart = (chartDom, dataPie) => {
  if (myChart) {
    myChart.dispose();
  }
  myChart = echarts.init(chartDom);
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Pie Data',
        type: 'pie',
        radius: '60%',
        selectedMode: 'single',
        data: dataPie.labels.map((label, index) => ({
          value: dataPie.datasets[0].data[index].toFixed(2),
          name: label,
          itemStyle: { // Aquí se define el estilo del sector
            color: dataPie.datasets[0].backgroundColor[index] // Usa el color especificado en el dataset
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  myChart.setOption(option);
  window.addEventListener('resize', myChart.resize);
};

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

onMounted(() => {
  nextTick(() => {
    if (chart.value && props.dataPie.labels && props.dataPie.labels.length > 0) {
      renderChart(chart.value, props.dataPie);
    } else {
      showNoDataWatermark(chart.value);
    }
  });
});

watch(() => props.dataPie, (newData) => {
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
</script>
