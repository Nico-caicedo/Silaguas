<template>
  <div ref="chart" style="width: 100%; height: 300px; border-radius: 10px;"></div>
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
  if (!chartDom || !chartData || !chartData.datasets) return;

  if (myChart) {
    myChart.dispose();
  }

  myChart = echarts.init(chartDom);

  const option = {
    title: {
      text: "Carta",
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      triggerOn: 'mousemove|click',
    },
    legend: {
      data: chartData.datasets.map(dataset => dataset.label),
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.labels,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: value => value.toFixed(2),
      },
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
    series: chartData.datasets.map(dataset => ({
      name: dataset.label,
      type: 'line',
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
