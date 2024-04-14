<template>
  <div class="q-pa-md bg-white shadow-1 col-grow row justify-center items-center" style="border-radius: 10px;">
    <template v-if="dataPie && dataPie.labels && dataPie.labels.length > 0">
      <Pie :data="dataPie" :options="optionspie" />
    </template>
    <template v-else >
      <q-item >
        <q-item-section class="text-grey-10 text-bold">
          <q-separator  class="bg-primary"/>
          <q-space/>
          Sin datos disponibles.
          <q-space/>
          <q-separator  class="bg-primary"/>
        </q-item-section>
      </q-item>
    </template>
  </div>
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  name: 'PieComponent',
  components: {
    Pie
  },
  props: {
    optionspie: {
      type: Object,
      required: true
    },
    dataPie: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
