<template>
  <section class="row col-4 self-center shadow-1" style="border-radius: 10px;" :style="{ backgroundColor: backgroundcolor }">
    <div class="col row flex-center justify-evenly">
      <div class="col text-center justify-center items-center" >
        <q-icon :name="icon" size="25px" class="animate-float" />
      </div>
      <q-separator vertical color="white" />
      <div class="col-9 text-center">
        <div class="col justify-center items-center text-weight-bolder">{{ Nombre }}</div>
        <q-separator color="white" />
        <div class="col justify-center items-stretch content-stretch">{{ valor }}</div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    Nombre: String,
    valor: Number,
    icon: String,
    backgroundcolor: String,
  },
  // mounted() {
  //   console.log(this.Nombre); // Muestra el nombre en la consola
  //   console.log(this.valor); // Muestra el valor en la consola
  //   console.log(this.icon); // Muestra el icono en la consola
  //   console.log(this.backgroundcolor); // Muestra el color de fondo en la consola
  // }
};
</script>

<style scoped>

</style>
