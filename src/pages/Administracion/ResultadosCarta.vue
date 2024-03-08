<template>
<div>
<h1>Cartas Control</h1>
<!-- Filtros -->
<div>

</div>
</div>
<div>

</div>
</template>

<script>
export default {
  data() {
    return {
      opciones: ['One', 'Two', 'Three', 'Four'],
      selectedOptions: [],
      marcar: true,
    };
  },
  methods: {
    marcarTodas() {
      if(this.marcar === true){
        this.marcar = false
        this.selectedOptions = this.selectedOptions.map(() => true);
      }else{
        this.marcar = true
        this.selectedOptions = this.selectedOptions.map(() => false);
      }
      // Iterar sobre todas las opciones y establecer su estado a true
      
    }
  },
  created() {
    // Inicializar selectedOptions con la misma cantidad de elementos que opciones, todos inicializados a false
    this.selectedOptions = Array(this.opciones.length).fill(false);
  }
};
</script>
