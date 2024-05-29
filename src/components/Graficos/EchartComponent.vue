<template>
  <div class="q-pa-md bg-white shadow-1 col row justify-center items-center" style="border-radius: 10px;">
    <div ref="chart" style="width: 100%; height: 300px; border-radius: 10px;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, defineProps, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  chartData: {
    type: Object,
    default: () => ({}),
  },
  chartOptions: {
    type: Object,
    default: () => ({}),
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
    autoResize: true,
    maintainAspectRatio: true,
    title: {
      text: "Carta",
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
      bottom: '0.1%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        restore: {},
        saveAsImage: {},
      },
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
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
      },
    ],
    itemStyle: {
      borderWidth: 4,
    },
    lineStyle: {
      width: 1,
    },
    symbolSize: 40,
    symbol: "emptyPin",
    smooth: false,
    series: chartData.datasets.map((dataset, index) => ({
      name: dataset.label,
      type: index === 0 || dataset.label === 'Agua Cruda' ? 'scatter' : 'line',
      smooth: true,
      data: dataset.data,
      itemStyle: {
        color: dataset.backgroundColor,
        borderColor: dataset.borderColor,
      },
    })),
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
          text: 'No hay datos',
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
    if (chart.value && props.chartData.labels && props.chartData.labels.length > 0) {
      renderChart(chart.value, props.chartData);
    } else {
      showNoDataWatermark(chart.value);
    }
  });
});

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
</script>
