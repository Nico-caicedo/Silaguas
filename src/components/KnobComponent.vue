<template>
  <div class="row relative-position q-pa-md bg-white shadow-1 col-grow items-center"
    style="border-top-left-radius: 10px; border-bottom-left-radius: 10px; border-top-right-radius: 10px; border-bottom-right-radius: 10px;">
    <q-knob readonly v-model="value" show-value size="75px" :value="valor" :thickness="0.28" color="primary"
      track-color="grey-5" class="text-orange col bg-white" />
    <div class="col bg-primary q-pa-md inset-shadow text-center text-bold" style="border-radius: 10px;">
      <q-separator  class="bg-white" />
      <q-space/>
      {{ Nombre }}
      <q-space/>
      <q-separator  class="bg-white" />
    </div>
  </div>

</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    Nombre: String,
    valor: Number
  },

  setup(props) {
    const value = ref(props.valor || 0)
    return {
      value
    }
  }
}
</script>
