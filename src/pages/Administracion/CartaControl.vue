<template>

  
    <div class="column items-center q-pa-md">
        <h1 >Cartas Control</h1>
    <div class=" row wrap  items-center ">
      <q-radio class="col" v-model="shape" val="line" >
        <h5>Carta Control RPD</h5>
    </q-radio>
    <q-radio class="col" v-model="shape" val="s" >
        <h5>Carta Control Verificación</h5>
    </q-radio>
    </div>

    <q-btn  label="Iniciar" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      shape: 'line'
    }
  }
}
</script>