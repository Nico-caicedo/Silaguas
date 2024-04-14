<template>
  <div class="q-pa-md bg-white shadow-1 col row justify-center items-center" style="border-radius: 10px;">
    <template v-if="chartData && chartData.labels && chartData.labels.length > 0">
      <Line :data="chartData" :options="chartOptions" />
    </template>
    <template v-else>
      <q-item class="justify-center items-center no-data-message">
        <q-item-section class="text-grey-10 text-bold">
          <q-separator class="bg-primary" />
          <q-space />
          Sin datos disponibles para la carta.
          <q-space />
          <q-separator class="bg-primary" />
        </q-item-section>
      </q-item>
    </template>
  </div>
</template>

<script>
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default {
  name: 'LineComponent',
  components: { Line },
  props: {
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
    chartData: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>

<style scoped>
.no-data-message {
  height: 200px; /* Establece la altura fija que desees */
}
</style>
