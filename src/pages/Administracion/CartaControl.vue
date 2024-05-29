<template>
  <q-page>

    <div class="row  justify-end q-gutter-x-lg q-ma-sm">
      <q-btn label="Grafico" style="background-color: #01B9FF;" icon="bar_chart" />

      <q-btn label="Diseño" style="background-color: #BFFE00;" icon="picture_as_pdf" class="bg-alert ellipsis"
        @click="section = 'formato'">
      </q-btn>
      <q-btn label="Carta Control" v-if="rol === 'dirCalidad'" style="background-color: #01B9FF;" icon="dangerous"
        class="bg-alert" @click="section = 'cartaControl'" />
      <q-btn label="resultados" style="background-color: #BFFE00;" icon="receipt_long" class="bg-alert"
        @click="section = 'resultados'" />
    </div>
    <q-page style="min-height: unset;" padding v-if="section === 'cartaControl'">
      <q-scroll-area style="height: 600px;">
        <q-form style="height: 300px;">
          <div>
            <q-btn label="Consultar limites" style="background-color: #FF5D25;" icon="dangerous" class="bg-alert"
              @click="activar" :disabled="!VerLimites" />
          </div>

          <div class="column justify-around q-gutter-y-lg q-mt-xl">

            <q-dialog v-model="inception">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Limites de {{ MetodoRPD.label }} {{ Metodo.label }}</div>
                </q-card-section>

                <q-card-section v-html="Showlimite" class="q-pt-none ">

                </q-card-section>

                <q-card-actions align="right" class="text-primary">

                  <q-btn flat label="Close" class="text-white bg-negative" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>


            <div class="row justify-center items-center q-gutter-x-xl q-mt-none" style="height:420px">
              <div class="q-gutter-y-xl col-xs-12 col-sm-12" style="width: 30%;">
                <div class="options row items-center justify-center  text-h6  "
                  :class="{ selected: shape === 'Verificacion' }" @click="selectOption('Verificacion')">
                  Carta Control Verificación
                </div>
                <div class="options row items-center justify-center text-h6" :class="{ selected: shape === 'RPD' }"
                  @click="selectOption('RPD')">
                  Carta Control RPD
                </div>
                <div class="row justify-center " style="height:100%">
                  <q-btn v-if="show" class="color-white q-ma-sm  text-h6"
                    style="background: #00F370;width: 120px; height: 50px;" label="Enviar"
                    @click="ValidacionesCartVerificacion" :disabled="!opcionSeleccionada1" />
                  <q-btn v-if="show == false" class="color-white q-ma-sm  text-h6"
                    style="width: 120px; height: 50px; background: #00F370;" @click="ValidacionesCartRPD" label="Enviar"
                    :disabled="!opcionSeleccionada2" />

                </div>
              </div>

              <div v-if="show" class="q-gutter-y-lg col-12 col-sm-12 " style="width: 40%; height: 100%;">
                <q-select filled v-model="Metodo" :options="MetodoSelect" label="Método"
                  @input="Concentraciones(); VericarOpt();" />
                <div class="shadow-1 q-pa-md" style="width: 100%; height: 325px; background-color: rgb(238, 238, 238);">
                  <!-- <q-table style="height: 300px;" title="Solución Patrón" :data="rows" :columns="columns" row-key="name" /> -->

                  <q-scroll-area style="height: 300px;">

                    <q-option-group class="text-h5" :options="row" type="checkbox" v-model="groups"
                      @input="VericarOpt" />


                  </q-scroll-area>
                </div>


              </div>

              <div v-if="show == false" class="column items-center  q-pt-xl q-gutter-y-lg  "
                style="width: 40%; height: 90%; ">
                <q-select class="" style="width: 65%;" filled v-model="MetodoRPD" :options="MetodoSelect" label="Método"
                  @input="VericarOpt" />
                <q-select filled class="q-mt-xl" style="width: 65%;" v-model="matriz" :options="matrizSelect"
                  @input="VericarOpt(); Concentraciones();" label="Tipo Matriz" />
              </div>
            </div>

            <div class="q-px-lg" style="width: 100%; background-color: rgb(238, 238, 238);">
              <div class=" row  items-center justify-center relative-position q-pa-sm">
                <h3 class="row justify-center   q-my-sm">Verificación Metrológica</h3>

              </div>
              <div class="q-pa-md">
                <q-scroll-area style="height: 190px;">
                  <div class="row justify-center q-gutter-sm">
                    <q-intersection v-if="show" v-for="(item, index) in groups" :key="item.id" class="example-item">
                      <q-card class="q-ma-sm">
                        <q-card-section>
                          <div class="text-h5">Concentración #{{ index + 1 }}</div>
                          <div class="text-h4">{{ `Valor: ${item.valor} ${item.unidad}` }}</div>
                          <q-input outlined v-model="valores[index]" step="any" type="number" label="Valor" lazy-rules
                            :rules="[
          val => val !== null && val !== '' || 'Ingrese un valor',

        ]" />
                        </q-card-section>
                      </q-card>
                    </q-intersection>
                    <q-intersection v-if="show == false" v-for="(item, index) in [1]" :key="index" class="example-item"
                      style="width: 25%;">
                      <q-card class="q-ma-sm">
                        <q-card-section>
                          <div class="text-h5">Metodo: {{ MetodoRPD.label }}</div>
                          <div class="text-h5"> Tipo matriz: {{ matriz.label }}</div>
                          <q-input outlined v-model="LecturaRPD" step="any" type="number" label="Valor" lazy-rules />
                        </q-card-section>
                      </q-card>
                    </q-intersection>
                  </div>
                </q-scroll-area>
              </div>
            </div>
          </div>


          <q-dialog v-model="confirm" persistent>
            <q-card style="min-width: 350px">
              <q-card-section>
                <div class="text-h6">Observación</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <q-input dense autogrow v-model="observacion" autofocus @keyup.enter="prompt = false" />
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn flat label="Add address" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-form>

      </q-scroll-area>


    </q-page>



    <q-page style="height: 100px; min-height: unset;" v-if="section === 'formato'">
      <formato />
    </q-page>
    <q-page style="height: 300px; min-height: unset;" v-if="section === 'resultados'">
      <resultados />
    </q-page>
  </q-page>
</template>

<script>
import { api } from 'boot/axios'
import utilidades from '../../commons/utilidades.js'
import formato from '../Administracion/DisenoPdf.vue'
import resultados from '../Administracion/ResultadosCarta.vue'
export default {
  components: { formato, resultados },
  data() {
    return {
      rol: "dirCalidad",
      section: "resultados",
      OptionGroup: [],
      groups: [],
      LecturaRPD: "",
      cantidad: "",
      shape: "Verificacion",
      valores: [],
      verificacion: true,
      show: true,
      MetodoSelect: [],
      matrizSelect: [],
      Metodo: "",
      matriz: [],
      selectedOption: null,
      rows: [],
      row: [],
      columns: [
        {
          name: 'descripcion', align: 'center', label: 'Descripcion', field: 'descripcion', sortable: true
        },
        {
          name: 'valor', align: 'center', label: 'Valor Concentración', field: 'valor', sortable: true
        },
        {
          name: 'unidad', align: 'center', label: 'Unidad Medida', field: 'unidad', sortable: true
        },
      ],
      usuario: [],
      confirm: false,
      errores: [],
      observacion: null,
      Tendencias: [],
      Limites: [],
      valoresAnteriores: [],
      opcionSeleccionada1: false,
      opcionSeleccionada2: false,
      valorRPD: "",
      mensajesAlerta: [],
      mensajess: [],
      valoresAnterioresO: [],
      clavesObserva: [],
      observacions: [],
      inception: false,
      Showlimite: [],
      VerLimites: false,
      MetodoRPD: "",
      Repetir: 0
    };
  },
  methods: {
    activar() {
      // permite desactivar el botón de consultar limites

      let mensajesValor = '';
      console.log('lo', this.Limites)
      if (this.Metodo) {
        this.inception = true;
        for (let clave in this.Limites) {
          if (this.Limites.hasOwnProperty(clave)) {
            const valor = this.Limites[clave];

            // Concatenar la información para cada clave
            mensajesValor += `<strong> Solución ${clave} ${this.row[0].value.unidad}</strong><br>`;
            mensajesValor += `LCS: ${valor.LCSresultado}` + " - " + `LCI: ${valor.LCIresultado}<br>`;
            mensajesValor += `LAS: ${valor.LASresultado}` + " - " + `LAI: ${valor.LAIresultado}<br>`;
            mensajesValor += `+1s: ${valor.MasDes}` + " / " + `-1s: ${valor.MenosDes}<br>`;
            mensajesValor += `Media: ${valor.Media.toFixed(2)} <br><br>`;


          }
        }
      } else if (this.MetodoRPD) {
        this.inception = true;
        const limite = this.Limites[0]
        console.log(limite)
        // Concatenar la información para cada objeto en el array
        mensajesValor += `<strong>Limites RPD</strong><br>`;
        mensajesValor += `LCS: ${limite.LCSresultado} <br>`;
        mensajesValor += `LAS: ${limite.LASresultado}<br>`;
        mensajesValor += `+1s: ${limite.MasDes}<br>`;
        mensajesValor += `Media: ${limite.Media.toFixed(2)} <br><br>`;

      } else {
        mensajesValor = "Sin Limites aún"
      }

      this.Showlimite = mensajesValor; // Mostrar mensajesValor completo
    }

    ,
    VericarOpt() {
      // permite desactivar el botón de envío
      if (this.groups.length > 0) {
        this.opcionSeleccionada1 = true

      } else {
        this.opcionSeleccionada1 = false
      }


      if (this.Metodo) {
        this.VerLimites = true
      } else if (this.matriz) {
        this.VerLimites = true
      } else {
        this.VerLimites = false
      }

      if (this.MetodoRPD) {
        this.opcionSeleccionada2 = true
      } else {
        this.opcionSeleccionada2 = false
      }


      if (this.matriz) {
        this.opcionSeleccionada2 = true
      } else {
        this.opcionSeleccionada2 = false
      }

    },
    limpiarJSON() {


      let elementosLimites = {};

      for (let clave in this.Limites) {
        // Verificamos si el valor es un array
        if (Array.isArray(this.Limites[clave])) {
          // Copiamos el array interno al nuevo objeto con la misma clave
          elementosLimites[clave] = this.Limites[clave].map(elemento => elemento);
          // Asignamos el primer elemento del array al objeto elementosLimites bajo la misma clave
          elementosLimites[clave] = elementosLimites[clave][0];
        } else {
          // Si no es un array, simplemente asignamos el valor al nuevo objeto con la misma clave
          elementosLimites[clave] = this.Limites[clave];
        }
      }

      // Mostramos el nuevo objeto con los elementos de this.Limites


      // Crear un nuevo objeto para almacenar los elementos de this.valoresAnteriores
      let elementosValoresAnteriores = {};

      // Recorrer y transformar los arrays internos en this.valoresAnteriores
      for (let clave in this.valoresAnteriores) {
        // Verificar si el valor es un array
        if (Array.isArray(this.valoresAnteriores[clave])) {
          // Crear un nuevo array para almacenar los elementos
          let elementos = [];
          // Iterar sobre cada elemento del array interno
          this.valoresAnteriores[clave].forEach((arrayInterno, indice) => {
            // Extraer el valor correspondiente a la clave "Valor"
            let valor = arrayInterno['Valor'];
            // Agregar el valor al nuevo array
            elementos.push(valor);
          });
          // Asignar el nuevo array al objeto con la nueva clave
          elementosValoresAnteriores[clave] = elementos;
        } else {
          // Si no es un array, simplemente asignar el valor al nuevo objeto con la misma clave
          elementosValoresAnteriores[clave] = this.valoresAnteriores[clave];
        }
      }

      this.valoresAnterioresO = elementosValoresAnteriores
      this.Limites = elementosLimites
      this.valoresAnteriores = elementosValoresAnteriores


      // Ahora puedes usar el array elementosAlmacenados como desees

    },
    OnSubmit() {


      let valoresEmparejados = {};

      // Iterar sobre los grupos seleccionados
      for (let i = 0; i < this.groups.length; i++) {
        // Comprobar si se ingresó un valor para el grupo actual
        if (this.valores[i] !== undefined) {
          // Buscar el valor correspondiente al id en this.valoresAnteriores
          let id = this.groups[i].value;
          let valorAnterior = this.valoresAnteriores[id];

          // Si se encuentra el valor anterior, agregar el nuevo valor
          if (valorAnterior !== undefined) {
            // Si el valor anterior es un array, agregamos el nuevo valor a ese array
            if (Array.isArray(valorAnterior)) {
              valorAnterior.push(this.valores[i]);
            } else {
              // Si el valor anterior no es un array, lo convertimos en uno y agregamos los valores
              this.valoresAnteriores[id] = [valorAnterior, this.valores[i]];
            }
          } else {
            // Si no se encuentra el valor anterior, creamos un nuevo array con el nuevo valor
            this.valoresAnteriores[id] = [this.valores[i]];
          }

          // Agregar el valor emparejado al objeto valoresEmparejados
          valoresEmparejados[id] = true;
        }
      }

      // Iterar sobre los valores anteriores para eliminar aquellos que no fueron emparejados
      for (let key in this.valoresAnteriores) {
        if (!valoresEmparejados[key]) {
          delete this.valoresAnteriores[key];
        }
      }

    }
    ,
    selectOption(option) {
      this.shape = this.shape === option ? null : option;

      if (this.shape === "RPD") {
        console.log('hola mundo')
        this.show = false;
        this.Metodo = ''
        this.row = []
        this.opcionSeleccionada1 = false;
        this.groups = []
        this.VerLimites = false

      } else if (this.shape === "Verificacion") {
        this.show = true;
        this.matriz = ''
        this.valor = ''
        console.log('hola mundo dos')
        this.opcionSeleccionada2 = false;
        this.VerLimites = false
        this.MetodoRPD = ''
      }
    },

    mostrar() {
      if (this.shape === "RPD") {
        this.RPD = true;
      } else if (this.shape === "Verificacion") {
        this.verificacion = false;
      }
    },
    ObtenerMetodos() {
      const self = this
      self.$q.loading.show()
      api.get('/usuario/MostrarMetodo')
        .then((response) => {
          const listMetodo = response.data.ListMetodo;
          self.MetodoSelect = listMetodo.map(item => ({
            label: item.Nombre,
            id: item.IdMetodo,
          }));

          self.$forceUpdate();
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Tipo Identificacion - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    matrices() {
      const self = this
      self.$q.loading.show()
      api.get('/usuario/ListarMatrices')
        .then((response) => {
          const Matrices = response.data.Matrices;

          self.matrizSelect = Matrices.map(item => ({
            label: item.Nombre,
            id: item.IdTipoMatriz,
          }));
          self.$forceUpdate();
          self.$q.loading.hide()

        })
        .catch((error) => {
          utilidades.mensaje('Tipo Identificacion - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    Concentraciones() {



      this.groups = []
      this.VericarOpt()
      // this.valores = []

      if (this.Metodo) {

        this.ObtenerTendencias()
        const self = this
        self.$q.loading.show()
        api.post(`/usuario/CallSolPatron/${self.Metodo.id}`)
          .then((response) => {

            self.cantidad = response.data.response.length;
            self.rows = response.data.response.map(item => ({
              descripcion: item.Descripcion,
              valor: item.Concentracion,
              unidad: item.IdUnidadMedida,
              IdSolucion: item.IdSolucion,
              LimiteInferior: item.LimiteInferior,
              LimiteSuperior: item.LimiteSuperior,
            }));

            self.row = response.data.response.map(item => ({
              label: ("Concentración" + " " + item.Concentracion + " " + item.IdUnidadMedida),
              value: {
                value: item.Concentracion,
                id: item.IdSolucion,
                valor: item.Concentracion,
                unidad: item.IdUnidadMedida,
                descripcion: item.Descripcion,
              },
              IdSolucion: item.IdSolucion,
            }));
            self.$q.loading.hide()
          })
          .catch((error) => {
            utilidades.mensaje('Tipo Identificacion - Fallo la conexion ' + error)
            self.$q.loading.hide()
          })

      }
      if (this.MetodoRPD) {
        this.ObtenerTendenciasRPD()
      }





    },
    load() {
      this.ObtenerMetodos();
    },
    ValidacionesCartVerificacion() {
      if (this.valores.length === 0) {
        this.triggerNegative();
        return;
      } else if (this.valores.length !== this.groups.length) {
        this.AllCampos();
        return;
      }
      this.OnSubmit();
      console.log('?', this.valoresAnteriores);
      console.log('?', this.Limites);

      this.mensajesAlerta = {};

      // Iterar sobre los arrays de valores y limites
      for (let clave in this.valoresAnteriores) {
        if (this.valoresAnteriores.hasOwnProperty(clave)) {
          let valorArray = this.valoresAnteriores[clave];
          let limiteArray = this.Limites;
          this.clavesObserva.push(clave)
          // Verificar si valorArray es un objeto
          if (typeof valorArray === 'object' && valorArray !== null) {
            // Acceder al valor que escribio el usuario
            let valor = valorArray[valorArray.length - 1];
            let valorpeniultimo = valorArray[valorArray.length - 2];
            console.log(valorpeniultimo, valor)
            // Buscar el límite correspondiente en el objeto limiteArray
            let limite = limiteArray[clave];
            let mensajesValor = [];

            // Si se encuentra el límite correspondiente
            if (limite) {
              // Validar si un  valor supera el límite control superior o es menor que el límite control inferior
              if (valor > limite.LCSresultado) {
                mensajesValor.push(' Es superior a LCS ');
              } else if (valor < limite.LCIresultado) {
                mensajesValor.push(' Es inferior a LCI ');
              }
            }


            // validación para  2 valor más allá del Limite de alerta superior o limite de alerta inferior
            if ((valorpeniultimo > limite.LASresultado && valor > limite.LASresultado) && (valorpeniultimo < limite.LCSresultado && valor < limite.LCSresultado)) {
              mensajesValor.push(' el valor supera LAS ');
            } else if ((valorpeniultimo < limite.LAIresultado && valor < limite.LAIresultado) && (valorpeniultimo > limite.LCIresultado && valor > limite.LCIresultado)) {
              mensajesValor.push('el valor es Inferior a LAI ');
            }

            // Validar el orden de los últimos 5 valores
            if (this.verificarOrdenAscendente(this.obtenerUltimosNValores(valorArray, 5))) {
              mensajesValor.push(' Los últimos 5 valores no están en orden ascendente. ');
            }
            if (this.verificarOrdenDescendente(this.obtenerUltimosNValores(valorArray, 5))) {
              mensajesValor.push(' Los últimos 5 valores no están en orden descendente. ');
            }

            // Validar si los últimos 5 valores superan la media
            const ultimos5Valores = this.obtenerUltimosNValores(valorArray, 5);
            const cantidadValoresSuperan = ultimos5Valores.filter(valor => valor > limite.MasDes && valor < limite.LASresultado).length;
            const cantidadValoresMenores = ultimos5Valores.filter(valor => valor < limite.MenDes && valor > limite.LASresultado).length;

            if (cantidadValoresSuperan >= 4) {
              mensajesValor.push(' Al menos 4 de los últimos 5 valores superan el límite superior. ');
            } else if (cantidadValoresMenores >= 4) {
              mensajesValor.push(' Al menos 4 de los últimos 5 valores son menores que el límite inferior. ');
            }

            // Guardar los mensajes de alerta asociados a este valor
            if (mensajesValor.length > 0) {
              this.mensajesAlerta[valor] = mensajesValor;
            }

          }
        }
      }

      // Mostrar ventana de alerta con los mensajes de alerta y abrir las ventanas de observación
      if (Object.keys(this.mensajesAlerta).length > 0) {
        this.mostrarAlertaConObservacion(this.mensajesAlerta);
      } else {
        this.insertCartVerificacion()
      }
    }
    ,

    ValidacionesCartRPD() {

      const fecha = this.obtenerFecha()



      if (this.LecturaRPD.length === 0) {
        this.triggerNegative();
        console.log('rpd')
        return;
      }


      const data = {
        IdMetodo: this.MetodoRPD.id,
        IdTipoMatriz: this.matriz.id,
        Lectura: this.LecturaRPD,
        Login: this.usuario.Login
      }

      console.log(data)
      const self = this;
      self.$q.loading.show();
      api.post('/usuario/InsertLecturaRPD', data)
        .then((response) => {

          var LCS = this.Limites[0].LCSresultado;
          LCS *= 0.90;

          self.$q.loading.hide();

          if (response.data >= 0) {
            this.SendCheck()
            // this.LimpiarDatosRPD()
            this.valorRPD = response.data
            this.insertarCartRPD()
          }
          if (response.data < 0) {
            this.SendCheck()
            this.LimpiarDatosRPD()
          }

          if (this.valorRPD > LCS) {
            this.Repetir = 1
            this.alertRPD();
          }


        })
        .catch((error) => {
          console.log('err', error)
          const errorMessage = `Ya has ingresado las Lecturas Diarias para el Método ${this.MetodoRPD.label} con Matriz ${this.matriz.label}.`;
          const options = {
            color: 'negative',
            message: errorMessage,
            position: 'top',
            timeout: 5000, // Tiempo en milisegundos para que el mensaje desaparezca automáticamente
            actions: [{ label: 'OK', color: 'white' }] // Botón de acción para cerrar el mensaje
          };
          this.$q.notify(options); // Muestra la notificación con el mensaje formateado
          self.$q.loading.hide();
          this.LimpiarDatosRPD()
        });




      // this.OnSubmit();
      // console.log('?', this.valoresAnteriores);
      // console.log('?', this.Limites);

      // this.mensajesAlerta = {};

      // // Iterar sobre los arrays de valores y limites
      // for (let clave in this.valoresAnteriores) {
      //   if (this.valoresAnteriores.hasOwnProperty(clave)) {
      //     let valorArray = this.valoresAnteriores[clave];
      //     let limiteArray = this.Limites;
      //     this.clavesObserva.push(clave)
      //     // Verificar si valorArray es un objeto
      //     if (typeof valorArray === 'object' && valorArray !== null) {
      //       // Acceder al valor que escribio el usuario
      //       let valor = valorArray[valorArray.length - 1];
      //       let valorpeniultimo = valorArray[valorArray.length - 2];
      //       console.log(valorpeniultimo,valor)
      //       // Buscar el límite correspondiente en el objeto limiteArray
      //       let limite = limiteArray[clave];
      //       let mensajesValor = [];

      //       // Si se encuentra el límite correspondiente
      //       if (limite) {
      //         // Validar si un  valor supera el límite control superior o es menor que el límite control inferior
      //         if (valor > limite.LCSresultado) {
      //           mensajesValor.push(' Es superior a LCS ');
      //         }
      //       }


      //     // validación para  2 valor más allá del Limite de alerta superior o limite de alerta inferior
      //       if ((valorpeniultimo > limite.LASresultado && valor > limite.LASresultado) && (valorpeniultimo < limite.LCSresultado && valor < limite.LCSresultado) ) {
      //         mensajesValor.push(' el valor supera LAS ');
      //       }

      //       // Validar el orden de los últimos 5 valores
      //       if (this.verificarOrdenAscendente(this.obtenerUltimosNValores(valorArray, 5))) {
      //         mensajesValor.push(' Los últimos 5 valores no están en orden ascendente. ');
      //       }
      //       if (this.verificarOrdenDescendente(this.obtenerUltimosNValores(valorArray, 5))) {
      //         mensajesValor.push(' Los últimos 5 valores no están en orden descendente. ');
      //       }

      //       // Validar si los últimos 5 valores superan la media
      //       const ultimos5Valores = this.obtenerUltimosNValores(valorArray, 5);
      //       const cantidadValoresSuperan = ultimos5Valores.filter(valor => valor > limite.MasDes && valor < limite.LASresultado).length;


      //       if (cantidadValoresSuperan >= 4) {
      //         mensajesValor.push(' Al menos 4 de los últimos 5 valores superan el límite superior. ');
      //       }

      //       // Guardar los mensajes de alerta asociados a este valor
      //       if (mensajesValor.length > 0) {
      //         this.mensajesAlerta[valor] = mensajesValor;
      //       }

      //    }
      //   }
      // }

      // Mostrar ventana de alerta con los mensajes de alerta y abrir las ventanas de observación
      // if (Object.keys(this.mensajesAlerta).length > 0) {
      //   this.mostrarAlertaConObservacion(this.mensajesAlerta);
      // } else {
      //   this.insertCartVerificacion()
      // }
    },
    LimpiarDatosRPD() {
      this.MetodoRPD = ""
      this.matriz = ""
      this.LecturaRPD = ""
      this.Limites = ""
      this.VerLimites = false
      this.opcionSeleccionada2 = false
    }
    ,
    mostrarAlertaConObservacion(mensajesPorValor) {
      let mensajes = '';
      for (const valor in mensajesPorValor) {
        if (mensajesPorValor.hasOwnProperty(valor)) {
          const mensajesValor = mensajesPorValor[valor];
          mensajes += `<strong>Valor: ${valor}</strong><br>`;
          mensajes += mensajesValor.join('<br>') + '<br><br>';
        }
      }

      this.$q.dialog({
        title: 'Alerta',
        message: mensajes,
        html: true, // Indicar a Vue que interprete el mensaje como HTML
        ok: {
          push: true,
          color: 'positive'

        },
        cancel: {
          push: true,
          color: 'negative'
        },
        persistent: true
      }).onOk(() => {
        // Llamada para abrir las ventanas de observación
        this.abrirVentanasObservacion();
      }).onCancel(() => {
        // console.log('>>>> Cancel')
        console.log('cancelo valor')
        this.valoresAnteriores = this.valoresAnterioresO
      });
    },


    abrirVentanasObservacion() {
      let promesaObservaciones = Promise.resolve();
      let totalVentanas = Object.keys(this.mensajesAlerta).length; // Número total de ventanas esperadas
      let ventanasAbiertas = 0; // Contador de ventanas abiertas

      // Verificar si this.mensajesAlerta es un objeto y no está vacío
      if (typeof this.mensajesAlerta === 'object' && totalVentanas > 0) {
        // Iterar sobre los valores del objeto mensajesAlerta
        Object.values(this.mensajesAlerta).forEach(mensajes => {
          promesaObservaciones = promesaObservaciones.then(() => {
            return this.mostrarVentanaObservacion(mensajes).then(() => {
              ventanasAbiertas++; // Incrementar el contador de ventanas abiertas
              // Verificar si se han abierto todas las ventanas esperadas
              if (ventanasAbiertas === totalVentanas) {

                // Ejecutar otras acciones después de abrir todas las ventanas
                this.ordenarObservacion();
                this.insertCartVerificacion();
              }
            });
          });
        });
      } else {
        // No hay ventanas para abrir
        console.log('No hay ventanas de observación para abrir');
      }


    },

    mostrarVentanaObservacion(mensaje) {
      return new Promise((resolve, reject) => {
        this.$q.dialog({
          title: 'Observación',
          message: mensaje,
          prompt: {
            model: '',
            type: 'text' // optional
          },
          cancel: true,
          persistent: true
        }).onOk(data => {
          this.mensajess.push(data),

            resolve();
        }).onCancel(() => {
          // console.log('>>>> Cancel')
          reject();
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
      });



    },
    verificarOrdenAscendente(valores) {
      for (let i = 0; i < valores.length - 1; i++) {
        if (valores[i] > valores[i + 1]) {
          return false;
        }
      }
      return true;
    },

    verificarOrdenDescendente(valores) {
      for (let i = 0; i < valores.length - 1; i++) {
        if (valores[i] < valores[i + 1]) {
          return false;
        }
      }
      return true;
    },

    obtenerUltimosNValores(array, n) {
      return array.slice(Math.max(array.length - n, 0));
    },
    ordenarObservacion() {

      let observacionesPorClave = {};
      for (let i = 0; i < this.clavesObserva.length; i++) {
        let clave = this.clavesObserva[i];
        if (this.mensajess[i]) {
          observacionesPorClave[clave] = this.mensajess[i];
        }
      }

      this.observacions = observacionesPorClave
      console.log(this.observacions)
      // Utilizar observacionesPorClave en lugar de mensajess si necesitas los mensajes asociados con las claves

    },

    insertCartVerificacion() {
      // Iterar sobre cada fila de datos
      const data = this.groups.map((item, index) => {
        const IdSolucionPatron = item.id;
        const valor = this.valores[index];
        const clave = item.valor;


        // Obtener la observación asociada al valor específico
        let observacion = null;
        if (this.observacions.hasOwnProperty(clave)) {
          observacion = this.observacions[clave];
        }

        return {
          IdSolucionPatron: IdSolucionPatron,
          valor: valor,
          Observacion: observacion,
          Login: this.usuario.Login
        };
      });



      // // // Verificar si hay errores
      // if (this.errores.length > 0) {
      //   // Mostrar mensajes de error o realizar la lógica necesaria
      //   this.mostrarDialogoErrores();

      // }
      // else {
      //   // No hay errores, proceder con el envío de datos al servidor
      // const data = this.row.map((item, index) => ({
      //   IdSolucionPatron: item.IdSolucion,
      //   valor: this.valores[index],
      //   Login: this.usuario.Login
      // }));

      // }
      // const self = this;
      // self.$q.loading.show();
      // api.post('/usuario/InsertarCartaVerificacion', data)
      //   .then((response) => {
      //     console.log(response.data);
      //     self.$q.loading.hide();
      //   })
      //   .catch((error) => {
      //     utilidades.mensaje('Tipo Identificacion - Fallo la conexion ' + error);
      //     self.$q.loading.hide();
      //   });

      this.Metodo = "";
      this.row = []
      this.rows = [];
      this.valores = [];
      this.groups = []
      console.log(data);
      console.log(this.usuario);

    },
    insertarCartRPD(valor) {


      const data = {
        IdMetodo: this.MetodoRPD.id,
        IdTipoMatriz: this.matriz.id,
        valor: valor,
        Observacion: this.observacion,
        Login: this.usuario.Login,
        Repetir: this.Repetir
      }
      console.log('RPD', data)
      const self = this;
      self.$q.loading.show();
      api.post('/usuario/guardarCartRPD', data)
        .then((response) => {

          self.$q.loading.hide();
          this.LimpiarDatosRPD()
        })
        .catch((error) => {
          utilidades.mensaje('Tipo Identificacion - Fallo la conexion ' + error);
          self.$q.loading.hide();
          this.LimpiarDatosRPD()
        });
    }
    ,
    obtenerFecha() {
      const fechaActual = new Date();
      const year = fechaActual.getFullYear();
      const month = String(fechaActual.getMonth() + 1).padStart(2, '0');
      const day = String(fechaActual.getDate()).padStart(2, '0');
      const fechaFormateada = `${year}-${month}-${day}`;
      return fechaFormateada;
    }

    ,
    triggerNegative() {
      this.$q.notify({
        type: 'negative',
        message: `Debe ingresar al menos un valor.`
      })
    }
    ,
    AllCampos() {
      this.$q.notify({
        type: 'negative',
        message: `Debe rellenar todos los campos seleccionados.`
      })
    },
    Campos() {
      this.$q.notify({
        type: 'positive',
        message: `campos llenos`
      })
    },
    SendCheck() {
      this.$q.notify({
        type: 'positive',
        message: `Lectura guardada exitosamente`
      })
    }
    ,
    mostrarDialogoErrores() {
      this.$q.dialog({
        title: '<h5 class="prueba" >¡¡ALERTA!!</h5>',
        message: `

        <p>${this.errores.join('<br>')}</p><br>

      `,
        class: "prueba",
        html: true,
        style: {
          'width': '500px', // Ajusta el ancho máximo del diálogo según tus necesidades
        },
        ok: {
          push: true,
          color: 'positive',
          label: 'Continuar'
        },
        cancel: {
          push: true,
          color: 'negative',
          label: 'Cancelar'
        },
        persistent: true,
      }).onOk(() => {
        this.confirm = true;
        this.valores = [];
      });

    },

    alertRPD() {
      let seconds = 5

      const dialog = this.$q.dialog({
        title: 'El valor final ha superado el LCS',
        message: `Acontinuación ingrese la observación`
      }).onOk(() => {
        this.ObservacionRPD()
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        clearTimeout(timer)
        // console.log('I am triggered on both OK and Cancel')
      })

      const timer = setInterval(() => {
        seconds--

        if (seconds > 0) {
          clearInterval(timer)
          dialog.hide()
          this.ObservacionRPD()
        }
      }, 3000)
    },
    ObservacionRPD() {
      this.$q.dialog({
        title: 'OBSERVACIÓN',
        message: 'Escriba la observación para el valor ' + this.valorRPD + ' del Método '
          + this.MetodoRPD.label + ' con la matríz ' + this.matriz.label,
        prompt: {
          model: '',
          isValid: val => val.length >= 0, // << here is the magic
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        this.observacion = data;
        this.insertarCartRPD(this.valorRPD)
        this.LimpiarDatosRPD()
      })
    }
    ,
    ObtenerTendencias() {

      const fechaFormateada = this.obtenerFecha();

      // Accediendo a this.Metodo.id, se supone que deberías usar el await ya que api.get() es asíncrono.
      // Además, es recomendable verificar que this.Metodo exista antes de intentar acceder a sus propiedades.
      if (this.Metodo && this.Metodo.id) {
        const data = {
          IdMetodo: this.Metodo.id,
          Fecha: "2024-02-10" // Usar la fecha actual formateada
        };
        console.log(data)
        const self = this;
        self.$q.loading.show();
        api.post('/usuario/ObtenerTendencias', data)
          .then((response) => {

            const datos = response
            this.valoresAnteriores = datos.data.ValoresAnteriores
            console.log('valores prueba', this.valoresAnteriores)
            this.Limites = datos.data.EstadisticasMensuales
            console.log(this.Limites)
            this.limpiarJSON()

            self.$q.loading.hide();
          })
          .catch((error) => {
            utilidades.mensaje('Tipo Identificacion - Fallo la conexion ' + error);
            self.$q.loading.hide();
          });
      } else {
        console.error('El objeto Metodo verificacion o su propiedad id es nulo o indefinido.');
      }
    },
    ObtenerTendenciasRPD() {
      const fechaActual = new Date();
      const year = fechaActual.getFullYear();
      const month = String(fechaActual.getMonth() + 1).padStart(2, '0');
      const day = String(fechaActual.getDate()).padStart(2, '0');
      const fechaFormateada = `${year}-${month}-${day}`;

      // Accediendo a this.Metodo.id, se supone que deberías usar el await ya que api.get() es asíncrono.
      // Además, es recomendable verificar que this.Metodo exista antes de intentar acceder a sus propiedades.
      if (this.MetodoRPD && this.MetodoRPD.id) {
        const data = {
          IdMetodo: this.MetodoRPD.id,
          Fecha: "2024-01-10" // Usar la fecha actual formateada
        };
        console.log(data)
        const self = this;
        self.$q.loading.show();
        api.post('/usuario/ObtenerTendenciasRPD', data)
          .then((response) => {

            const datos = response
            this.valoresAnteriores = datos.data.ValoresAnteriores
            this.Limites = datos.data.EstadisticasMensuales
            console.log('limites', this.Limites)
            this.limpiarJSON()

            self.$q.loading.hide();
          })
          .catch((error) => {
            utilidades.mensaje('Tipo Identificacion - Fallo la conexion ' + error);
            self.$q.loading.hide();
          });
      } else {
        console.error('El objeto Metodo o su propiedad id es nulo o indefinido.');
      }
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
    this.ObtenerMetodos();
    this.matrices();
    // this.ObtenerTendencias();
  },
};
</script>

<style scoped>
.prueba {
  color: red;
  display: flex;
  justify-content: center;
}

.selected {
  background-color: #3498db;
  color: #fff;
  border: 1px black solid;
  border-radius: 3px;
}

.options {
  height: 50px;
  cursor: pointer;
  border: 1px solid black;
  border-radius: 3px;
}

.example-item {
  height: 290px;
  width: 290px;
}
</style>
