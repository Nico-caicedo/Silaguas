<template>
  <q-layout>
    <div  class=" col-md-12 col row " >
      <h3 class="col-xs  col-sm-12 col-md-3 col-3  row justify-center LetraT " >Cartas Control</h3>
      <!-- Filtros -->
      <div class="col-xs col-sm-12  col-md-9 col-9 row justify-center items-center q-gutter-sm q-gutter-y-sm">
        <q-select  class="col-sm-3 col-md-3 col-12 " v-model="cartaControl" :options="cartasControl" label="Carta Control"
          @input="llenarDatos" />
        <q-select class="col-sm-3 col-md-3 col-12" v-model="Metodo" :options="metodos" label="Método" @input="llenarDatos" />
        <q-select class="col-sm-3 col-md-3 col-12" v-if="cartaControl.value === 'CCV'" v-model="Solucion" :options="soluciones"
          label="Solución" @input="llenarDatos" />
        <q-select class="col-sm-3 col-md-3 col-12" v-if="cartaControl.value === 'CCRPD'" v-model="Matriz" :options="matrices"
          label="Matriz" @input="llenarDatos" />
      </div>
    </div>
    <div class="column justify-center  items-center q-gutter-sm " style="height: 400px;">


<div  class="column" style="width: 40%;">
  <div class="row items-center q-gutter-md">
    <div>
      <p class="text-weight-bolder">{{ cartaControl.label }}</p>
    </div>

    <div class="row items-center">
      <p class="text-h">Metodo:</p>
      <p class="">{{ Metodo.label }}</p>

    </div>
    <div class="row items-center">
      <p class="text-h6">Fecha:</p>
      <p class="">{{ Fecha }}</p>
    </div>

  </div>
  <div class="row justify-around q-mb-sm q-mr-xs" style="width: 100%;  width: 100%;">
    <!-- hacer funcion para marcar todos los resultados -->
    <!-- <q-btn label="Marcar" @click="toggleMarcado" /> -->
    <q-btn class="bg-primary text-white" icon="add_circle" @click="CrearObservacion" v-if="EstadoObservacion === false" label="Crear Observación general"
      style="width: auto;" />
      <q-btn class="bg-primary text-white" icon="search" @click="CallObservacion" v-if="EstadoObservacion === true"
      label="Observación general" style="width: auto;" />

      <q-btn class="bg-positive text-white" :disabled="IdsAprobar.length === 0" icon="send" label="Enviar" @click="Aprobar" />
  </div>
  <q-dialog v-model="ShowObservacion">
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">OBSERVACIÓN GENERAL</div>
      </q-card-section>
      <q-card-section class="q-pt-none row justify-end ">
        <q-btn label="Ver anteriores" color="positive" />
      </q-card-section>
      <q-card-section class="q-pt-none">
       <p>{{ DatosObservacion.Observacion }}</p>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <p class="text-weight-bold row justify-end ">{{  DatosObservacion.Nombre + ', ' + DatosObservacion.Fecha }}</p>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="Cerrar" color="negative" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>



  <q-scroll-area style="height: 250px;">
    <q-list bordered separator>

      <q-item v-for="(item, index) in itemsCarta" :key="index">
        <q-item-section class="row  justify-center" style="height: 60px; width: 100%;">
          <q-item-section class="row items-center" style="width: 50px; ">
            <q-checkbox v-if="item.Aprobado === false" v-model="IdsAprobar " :val="item.Idcarta" />
            <q-icon class="" v-if="item.Aprobado === true" color="green" name="check_circle" size="1.5rem" />
          </q-item-section>
          <div class="row q-gutter-sm justify-between">
            <div class="column justify-center">
              <p class="q-mb-xs text-weight-bold">Valor: {{ item.Valor }}</p>
              <p class="q-mb-none">Realizo:</p>
              <p class="q-mb-none">{{ item.Nombre }}</p>
            </div>
            <p class="row justify-center items-center q-mb-xs text-weight-bold">{{ item.mes }}</p>

          </div>
          <q-item-section style="width: 150px;" class="row items-center justify-center q-ml-md">
            <!-- <q-btn label="Observación"/> -->

            <q-btn icon="plagiarism" v-if="item.Observacion !== null" @click="Show(item.Observacion)" />
            <p class=" row justify-center items-center q-mb-none text-weight-bold"
              v-if="item.Observacion === null">Sin Observación</p>
          </q-item-section>
          <q-item-section class="q-pa-md row  items-center" style="width: 10px;">
            <q-badge rounded :color=item.ColorStatus />
          </q-item-section>

        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
  <!-- 
  <img src="~assets/Select.svg" alt=""/>
   -->
</div>
<div class="" style="width: 40%;">
  <!-- <p class="text-center text-h4">{{ cartaControl.label }}</p> -->


  <div style="height: 200px;">
    <q-scroll-area style="height: 300px;">
      <q-list bordered separator>
        <q-item class="" v-for="(item, index) in itemList" :key="index" clickable v-ripple
          @click="callResult(item)">
          <q-item-section class="row " style="height: 60px; width: 100%;">
            <div class="column ">
              <p class="q-mb-xs text-weight-bold">{{ item.text }}</p>
              <p class="q-mb-xs text-weight-bold">{{ item.text2 }}</p>
              <p class="q-mb-xs text-weight-bold"> {{ item.text3 }}</p>
            </div>
            <div class="text-center text-weight-bold">{{ item.mes }}</div>


          </q-item-section>

          <q-btn class="q-ml-sm" style="width: 50px;" icon="description" :color=item.Color />

        </q-item>
      </q-list>
    </q-scroll-area>
  </div>

</div>
</div>
  </q-layout>
</template>

<script>
import { api } from 'boot/axios'
import utilidades from '../../commons/utilidades.js'
export default {
  data() {
    return {
      val: false,
      color: 'green',
      usuario: '',
      cartaControl: {label: 'Carta control  RPD', value: 'CCRPD'},
      Metodo: { label: '', value: '' },
      Matriz: { label: '', value: '' },
      Solucion: { label: '', value: '' },
      otraOpcion2: "",
      cartasControl: [
        { label: 'Carta control  RPD', value: 'CCRPD' },
        { label: 'Carta control  Verificación', value: 'CCV' },
      ],
      metodos: [
        { label: 'Color Aparente', value: 2 },
        { label: 'Color Verdadero', value: 3 }
      ],
      soluciones: [
        { label: '10 UC', value: '10' },
        { label: '15 UC', value: '15' },
        { label: '50 UC', value: '50' },// Ejemplo de opciones para matriz
      ],
      matrices: [
        { label: 'Agua Cruda', value: 'AC' },
        { label: 'Agua Tratada', value: 'AT' }
      ],
      itemList: [
        { text: 'Carta control  RPD', value: '1', metodo: 'Color aparente', solucion: 'Solución patron: Solucion 15 UC', mes: 'Enero' }
      ],
      itemsCarta: [

      ],
      datosCartas: '',
      MetodoName: '',
      Fecha: '',
      IdsAprobar: [],
      DatosRecarga: '',
      EstadoObservacion: false,
      DatosObservacion: {
  Fecha: '',
  Nombre: '',
  Observacion: ``,
},

      ShowObservacion: false,
      ColorStatus: ''
    }
  },
  methods: {
    toggleMarcado() {
      // Si hay algún checkbox marcado, desmárcalo; de lo contrario, marca todos los checkboxes
      this.IdsAprobar = true
    },
    llenarDatos() {
      this.datosCartas = {
        TipoCarta: this.cartaControl.value

      };

      if (this.Metodo.value) {
        this.datosCartas.IdMetodo = this.Metodo.value;
      }

      if (this.Matriz.value) {
        this.datosCartas.IdMatriz = this.Matriz.value;
        // this.datosCartas.Concentracion = ''
      }

      if (this.Solucion.value) {
        this.datosCartas.Concentracion = this.Solucion.value
        // this.datosCartas.IdMatriz = ''
      }


      // if (this.datosCartas.TipoCarta === 'CartaControlRPD') {
      //   this.datosCartas.Concentracion = ''

      // } 
      
      // if (this.datosCartas.TipoCarta === 'CartaControlVerificacion') {
      //   this.datosCartas.IdMatriz = ''
      // }

      this.CargarCartas()
    }
    ,

    CargarCartas() {

      if (this.datosCartas.TipoCarta === 'CCRPD') {
        const self = this;
        self.$q.loading.show();
        api.post('/usuario/CallCartas', this.datosCartas)
          .then((response) => {



            self.itemList = response.data.map(item => {
              const fecha = item.Fecha
              const date = new Date(item.Fecha);
              const month = date.toLocaleDateString('es-ES', { month: 'long' });
              const year = date.getFullYear();
              const formattedDate = `${month}/${year}`;
              const Aprobado = item.IsObservacion === 1 ? true : false;
              return {
                mes: formattedDate,
                text: this.cartaControl.label,
                text2: item.NombreMetodo,
                IdMetodo: item.IdMetodo,
                IdMatriz: item.IdTipoMatriz,
                text3: item.NombreMatriz,
                Color: item.Color,
                Fecha: fecha,
                IsObservacion: Aprobado,
                TipoCarta: 'CCRPD'
              };
            });


            self.$q.loading.hide();
          })
          .catch((error) => {
            utilidades.mensaje('Tipo Identificacion - Fallo la conexion ' + error);
            self.$q.loading.hide();
          });
      }
      if (this.datosCartas.TipoCarta === 'CCV') {

        const self = this;
        self.$q.loading.show();
        api.post('/usuario/CallCartas', this.datosCartas)
          .then((response) => {



            self.itemList = response.data.map(item => {
              const fecha = item.Fecha
              const date = new Date(item.Fecha);
              const month = date.toLocaleDateString('es-ES', { month: 'long' });
              const year = date.getFullYear();
              const formattedDate = `${month}/${year}`;
              const Aprobado = item.IsObservacion === 1 ? true : false;

              return {
                mes: formattedDate,
                text: this.cartaControl.label,
                text2: item.NombreMetodo,
                IdMetodo: item.IdMetodo,
                IdSolucion: item.IdSolucionPatron,
                text3: item.Concentracion + ' ' + item.IdUnidadMedida,
                Color: item.Color,
                Fecha: fecha,
                IsObservacion: Aprobado,
                TipoCarta: 'CCV'
              };
            });


            self.$q.loading.hide();
          })
          .catch((error) => {
            utilidades.mensaje('Tipo Identificacion - Fallo la conexion ' + error);
            self.$q.loading.hide();
          });
      }

    },
    callResult(item) {
      this.IdsAprobar = []
      this.DatosRecarga = item
      console.log('item', item)
      this.MetodoName = this.cartaControl.metodo
      var datos = {};
      if (this.cartaControl.value === 'CCV') {
       
        datos = {
          IdMetodo: item.IdMetodo,
          IdSolucion: item.IdSolucion,
          TipoCarta: this.cartaControl.value,
          Fecha: item.Fecha
        }

        // this.EstadoObservacion = item.IsObservacion;
        console.log('poo', item)
        const self = this;
        self.$q.loading.show();
        api.post('/usuario/CallValoresCarta', datos)
          .then((response) => {



            self.itemsCarta = response.data.map(item => {
              const date = new Date(item.Fecha);
              const day = String(date.getDate()).padStart(2, '0'); // Obtener el día y asegurarse de que tenga dos dígitos
              const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtener el mes (se suma 1 porque los meses van de 0 a 11)
              const formattedDate = `${day}/${month}`;
              const Aprobado = item.IsAprobado === 1 ? true : false;

              return {
                mes: formattedDate,
                Nombre: item.Nombre + ' ' + item.Apellido1 + ' ' + item.Apellido2,
                Valor: item.Valor,
                Observacion: item.Observacion,
                IdTipoMatriz: item.IdTipoMatriz,
                solucion: item.NombreMatriz,
                Color: item.Color,
                Idcarta: item.IdCartaControlVerificacion,
                Aprobado: Aprobado,
                ColorStatus: item.ColorStatus
              };
            });
            this.Fecha = item.mes
            console.log('ccv', self.itemList)
           
            self.$q.loading.hide();
          })
          .catch((error) => {
            utilidades.mensaje('Tipo Identificacion - Fallo la conexion ' + error);
            self.$q.loading.hide();
          });
      }




      if (this.cartaControl.value === 'CCRPD') {
       
        this.s = this.cartaControl.mes
        datos = {
          IdMetodo: item.IdMetodo,
          IdMatriz: item.IdMatriz,
          TipoCarta: this.cartaControl.value,
          Fecha: item.Fecha
        }

        this.EstadoObservacion = item.IsObservacion;

        const self = this;
        self.$q.loading.show();
        api.post('/usuario/CallValoresCarta', datos)
          .then((response) => {


            self.itemsCarta = response.data.map(item => {
              const date = new Date(item.Fecha);
              const day = String(date.getDate()).padStart(2, '0'); // Obtener el día y asegurarse de que tenga dos dígitos
              const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtener el mes (se suma 1 porque los meses van de 0 a 11)
              const formattedDate = `${day}/${month}`;
              const Aprobado = item.IsAprobado === 1 ? true : false;

              return {
                mes: formattedDate,
                Nombre: item.Nombre + ' ' + item.Apellido1 + ' ' + item.Apellido2,
                Valor: item.Valor,
                Observacion: item.Observacion,
                IdTipoMatriz: item.IdTipoMatriz,
                solucion: item.NombreMatriz,
                Color: item.Color,
                Idcarta: item.IdCartaControlRPD,
                Aprobado: Aprobado,
                ColorStatus: item.ColorStatus
              };
            });
            this.Fecha = item.mes
            console.log('ccrpd', self.itemList)
            self.$q.loading.hide();
          })
          .catch((error) => {
            utilidades.mensaje('Tipo Identificacion - Fallo la conexion ' + error);
            self.$q.loading.hide();
          });
      }
    },
    Aprobar() {

      const self = this;
      if (this.cartaControl.value === 'CCRPD') {
        const dataToSend = this.IdsAprobar.map(id => {
          return {
            IdsAprobar: id,
          };
        });

        api.post('/usuario/AprobarRPD', dataToSend)
          .then((response) => {
            self.callResult(this.DatosRecarga);
            this.IdsAprobar = []
          })
          .catch((error) => {
            console.error('Tipo Identificacion - Fallo la conexion ' + error);
          });
      }


      if (this.cartaControl.value === 'CCV') {
        const dataToSend = this.IdsAprobar.map(id => {
          return {
            IdsAprobar: id,
          };
        });

        api.post('/usuario/AprobarV', dataToSend)
          .then((response) => {
            self.callResult(this.DatosRecarga);
            this.IdsAprobar = []
          })
          .catch((error) => {
            console.error('Tipo Identificacion - Fallo la conexion ' + error);
          });
      }
      // Construir el array en el formato requerido

    },
    CallObservacion() {
      console.log('paquete',this.DatosRecarga)
      this.DatosRecarga.Login = this.usuario.Login
      // this.ShowObservacion = true

      
      api.post('/usuario/CallObservacion',this.DatosRecarga)
          .then((response) => {

            this.DatosObservacion = response.data[0];
            this.ShowObservacion = true

            this.DatosObservacion.Fecha =  this.DatosObservacion.Fecha.replace('T', ' ');
           console.log('Observacion',response.data)
          })
          .catch((error) => {
            console.error('Tipo Identificacion - Fallo la conexion ' + error);
          });
    },
    EnviarObservacion() {
      
      this.DatosRecarga.Login = this.usuario.Login
      console.log(this.DatosRecarga)
      // this.ShowObservacion = true

      
      api.post('/usuario/InsertObservacion',this.DatosRecarga)
          .then((response) => {
            this.showNotif()
            this.CargarCartas()
            this.EstadoObservacion = true
         
       
          })
          .catch((error) => {
            console.error('Tipo Identificacion - Fallo la conexion ' + error);
          });
      console.log(this.DatosObservacion)
    },
    Show(Observacion) {
      this.$q.dialog({
        title: 'Observación',
        message: Observacion,
      }).onOk(() => {
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
    ,
    CrearObservacion() {
      this.$q.dialog({
        title: 'Observacion General',
        message: 'Escriba la observación',
        prompt: {
          model: '',
          type: 'textarea', // Cambia el tipo a 'textarea' para permitir múltiples líneas
          attributes: { style: 'white-space: pre-wrap;' },
          isValid: val => val.length > 2,
        },
        ok: 'ENVIAR',
        cancel: true,
        persistent: true,
        
      }).onOk(data => {
        this.DatosRecarga.Observacion = data
        this.EnviarObservacion()
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    showNotif () {
      this.$q.notify({
        message: 'Observación general, guarda con éxito',
        color: 'green',
        icon: 'check'
      })
    }

  },
  mounted() {

    const value = this.$q.localStorage.getItem('usuarioSilaguas')
    if (value) {
      this.usuario = value
      // this.limpiarTercero()
    }
    // utilidades.verificarUsuario(this.usuario.Login, this)
  },
  created() {

     this.llenarDatos();
  },
}
</script>
<style>

/* esta clase hace referencia a letra tamaño de ahí el nombre LetraT */
@media only screen and (max-width: 600px) {
  .LetraT{
  font-size: 1rem;
}
}

</style>
