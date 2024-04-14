BarComponent.vue
<template>

  <Bar :options="optionsBar" :data="dataBar" />

</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)



export default {
  name: 'BarComponent',
  components: { Bar },
  props: {
    dataBar: {
      type: Object,
      required: true,
    },
    optionsBar: {
      type: Object,
      default: () => {}
    },
  },

}
</script>
