<template>
  <q-page>

    <div class="row  justify-end q-gutter-x-lg q-ma-sm">
      <q-btn label="Grafico" style="background-color: #01B9FF;" icon="bar_chart" to="/Administracion/Dashboard" />

      <q-btn style="background-color: #BFFE00;width: 35px;" icon="picture_as_pdf" class="bg-alert ellipsis"
        @click="section = 'formato'">
        <div class="ellipsis">diseño</div>
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
                @update:model-value="Concentraciones(); VericarOpt();" />
                <div class="shadow-1 q-pa-md" style="width: 100%; height: 325px; background-color: rgb(238, 238, 238);">
                  <!-- <q-table style="height: 300px;" title="Solución Patrón" :data="rows" :columns="columns" row-key="name" /> -->

                  <q-scroll-area style="height: 300px;">

                    <q-option-group class="text-h5" :options="row" type="checkbox" v-model="groups"
                    @update:model-value="VericarOpt" />


                  </q-scroll-area>
                </div>


              </div>

              <div v-if="show == false" class="column items-center  q-pt-xl q-gutter-y-lg  "
                style="width: 40%; height: 90%; ">
                <q-select class="" style="width: 65%;" filled v-model="MetodoRPD" :options="MetodoSelect" label="Método"
                @update:model-value="VericarOpt" />
                <q-select filled class="q-mt-xl" style="width: 65%;" v-model="matriz" :options="matrizSelect"
                @update:model-value="VericarOpt(); Concentraciones();" label="Tipo Matriz" />
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
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae nam dignissimos explicabo eius voluptas veniam et est beatae numquam distinctio.
    </q-page>
  </q-page>
</template>

<script setup>
import { api } from 'boot/axios'
import { ref, onMounted, computed } from "vue";
import { date, useQuasar } from "quasar";
import { useRouter } from 'vue-router'
import utilidades from '../../commons/utilidades.js'
import formato from '../Administracion/DisenoPdf.vue'
import resultados from '../Administracion/ResultadosCarta.vue'


 const components = {
    formato, resultados
  }
  const $q = useQuasar();
  const $router = useRouter();
  const rol = ref("dirCalidad")
  const section =  ref("resultados")
  const OptionGroup = ref([])
  const groups = ref([])
  const LecturaRPD =  ref("")
   const cantidad = ref("")
   const  shape = ref("Verificacion")
   const   valores = ref([])
    const  verificacion = ref(true)
    const  show = ref(true)
    const  MetodoSelect = ref([])
    const  matrizSelect = ref([])
     const Metodo =  ref("")
    const matriz = ref([])
     const selectedOption = ref(null)
     const rows = ref([])
     const row = ref([])
    const columns =  ref([
        {
          name: 'descripcion', align: 'center', label: 'Descripcion', field: 'descripcion', sortable: true
        },
        {
          name: 'valor', align: 'center', label: 'Valor Concentración', field: 'valor', sortable: true
        },
        {
          name: 'unidad', align: 'center', label: 'Unidad Medida', field: 'unidad', sortable: true
        },
      ])
    const usuario = ref([])
     const confirm = ref(false)
     const errores = ref([])
     const observacion = ref(null)
     const Tendencias = ref([])
      const Limites = ref([])
      const valoresAnteriores = ref([])
      const opcionSeleccionada1 = ref(false)
      const opcionSeleccionada2 =  ref(false)
      const valorRPD = ref("")
      const mensajesAlert = ref([])
      const mensajess = ref([])
      const valoresAnterioresO =  ref([])
      const clavesObserva =  ref([])
      const observacions = ref([])
      const inception = ref(false)
      const Showlimite = ref([])
      const VerLimites = ref(false)
      const MetodoRPD = ref("")
      const Repetir = ref(0)

  const grafico = () =>{
    $router("Dashboard.vue")
  }

   const activar = () => {
      // permite desactivar el botón de consultar limites

      let mensajesValor = '';
      console.log('lo', Limites.value)
      if (Metodo.value) {
        inception.value = true;
        for (let clave in Limites.value) {
          if (Limites.value.hasOwnProperty(clave)) {
            const valor = Limites.value[clave];
            console.log('row',row.value[0].value.unidad)
            // Concatenar la información para cada clave
            mensajesValor += `<strong> Solución ${clave} ${row.value[0].value.unidad}</strong><br>`;
            mensajesValor += `LCS: ${valor.LCSresultado}` + " - " + `LCI: ${valor.LCIresultado}<br>`;
            mensajesValor += `LAS: ${valor.LASresultado}` + " - " + `LAI: ${valor.LAIresultado}<br>`;
            mensajesValor += `+1s: ${valor.MasDes}` + " / " + `-1s: ${valor.MenosDes}<br>`;
            mensajesValor += `Media: ${valor.Media.toFixed(2)} <br><br>`;


          }
        }
      } else if (MetodoRPD.value) {
        inception.value = true;
        const limite = Limites.value
        console.log('LIMI',Limites.value)
        // Concatenar la información para cada objeto en el array
        mensajesValor += `<strong>Limites RPD</strong><br>`;
        mensajesValor += `LCS: ${limite.LCSresultado} <br>`;
        mensajesValor += `LAS: ${limite.LASresultado}<br>`;
        mensajesValor += `+1s: ${limite.MasDes}<br>`;
        mensajesValor += `Media: ${limite.Media.toFixed(2)} <br><br>`;

      } else {
        mensajesValor = "Sin Limites aún"
      }

      Showlimite.value = mensajesValor; // Mostrar mensajesValor completo
    }

    
   const VericarOpt = () => {
      // permite desactivar el botón de envío
      if (groups.value.length > 0) {
        opcionSeleccionada1.value = true

      } else {
        opcionSeleccionada1.value = false
      }


      if (Metodo.value) {
        VerLimites.value = true
      } else if (matriz.value) {
        VerLimites.value = true
      } else {
        VerLimites.value = false
      }

      if (MetodoRPD.value) {
        opcionSeleccionada2.value = true
      } else {
        opcionSeleccionada2.value = false
      }


      if (matriz.value) {
        opcionSeleccionada2.value = true
      } else {
        opcionSeleccionada2.value = false
      }

    }
  const  limpiarJSON = () => {


      let elementosLimites = {};

      for (let clave in Limites.value) {
        // Verificamos si el valor es un array
        if (Array.isArray(Limites.value[clave])) {
          // Copiamos el array interno al nuevo objeto con la misma clave
          elementosLimites[clave] = Limites.value[clave].map(elemento => elemento);
          // Asignamos el primer elemento del array al objeto elementosLimites bajo la misma clave
          elementosLimites[clave] = elementosLimites[clave][0];
        } else {
          // Si no es un array, simplemente asignamos el valor al nuevo objeto con la misma clave
          elementosLimites[clave] = Limites.value[clave];
        }
      }

      // Mostramos el nuevo objeto con los elementos de this.Limites


      // Crear un nuevo objeto para almacenar los elementos de this.valoresAnteriores
      let elementosValoresAnteriores = {};

      // Recorrer y transformar los arrays internos en this.valoresAnteriores
      for (let clave in valoresAnteriores.value) {
        // Verificar si el valor es un array
        if (Array.isArray(valoresAnteriores.value[clave])) {
          // Crear un nuevo array para almacenar los elementos
          let elementos = [];
          // Iterar sobre cada elemento del array interno
          valoresAnteriores.value[clave].forEach((arrayInterno, indice) => {
            // Extraer el valor correspondiente a la clave "Valor"
            let valor = arrayInterno['Valor'];
            // Agregar el valor al nuevo array
            elementos.push(valor);
          });
          // Asignar el nuevo array al objeto con la nueva clave
          elementosValoresAnteriores[clave] = elementos;
        } else {
          // Si no es un array, simplemente asignar el valor al nuevo objeto con la misma clave
          elementosValoresAnteriores[clave] = valoresAnteriores.value[clave];
        }
      }

      valoresAnterioresO.value = elementosValoresAnteriores
      Limites.value = elementosLimites
      valoresAnteriores.value = elementosValoresAnteriores


      // Ahora puedes usar el array elementosAlmacenados como desees

    }
  const  OnSubmit = () => {


      let valoresEmparejados = {};

      // Iterar sobre los grupos seleccionados
      for (let i = 0; i < groups.value.length; i++) {
        // Comprobar si se ingresó un valor para el grupo actual
        if (valores.value[i] !== undefined) {
          // Buscar el valor correspondiente al id en this.valoresAnteriores
          let id = groups.value[i].value;
          let valorAnterior = valoresAnteriores.value[id];

          // Si se encuentra el valor anterior, agregar el nuevo valor
          if (valorAnterior !== undefined) {
            // Si el valor anterior es un array, agregamos el nuevo valor a ese array
            if (Array.isArray(valorAnterior)) {
              valorAnterior.push(valores.value[i]);
            } else {
              // Si el valor anterior no es un array, lo convertimos en uno y agregamos los valores
              valoresAnteriores.value[id] = [valorAnterior, valores.value[i]];
            }
          } else {
            // Si no se encuentra el valor anterior, creamos un nuevo array con el nuevo valor
            valoresAnteriores.value[id] = [valores.value[i]];
          }

          // Agregar el valor emparejado al objeto valoresEmparejados
          valoresEmparejados[id] = true;
        }
      }

      // Iterar sobre los valores anteriores para eliminar aquellos que no fueron emparejados
      for (let key in valoresAnteriores.value) {
        if (!valoresEmparejados[key]) {
          delete valoresAnteriores.value[key];
        }
      }

    }
    
  const selectOption = (option) => {
      shape.value = shape.value === option ? null : option;

      if (shape.value === "RPD") {
        console.log('hola mundo')
        show.value = false;
        Metodo.value = ''
        row.value = []
        opcionSeleccionada1.value = false;
        groups.value = []
        VerLimites.value = false

      } else if (shape.value === "Verificacion") {
        show.value = true;
        matriz.value = ''
        // valor.value = ''
        console.log('hola mundo dos')
        opcionSeleccionada2.value = false;
        VerLimites.value = false
        MetodoRPD.value = ''
      }
    }

    const mostrar = () => {
      if (shape.value === "RPD") {
        RPD.value = true;
      } else if (shape.value === "Verificacion") {
        verificacion.value = false;
      }
    }
   const ObtenerMetodos = () => {
    
      $q.loading.show()
      api.get('/Metodo/MostrarMetodo')
        .then((response) => {
          const listMetodo = response.data.ListMetodo;
          MetodoSelect.value = listMetodo.map(item => ({
            label: item.Nombre,
            id: item.IdMetodo,
          }));

          // $forceUpdate();
          $q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Tipo Identificacion1 - Fallo la conexion ' + error)
          $q.loading.hide()
        })
    }
  const  matrices = () => {
    
      $q.loading.show()
      api.get('/Matriz/ListarMatrices')
        .then((response) => {
          const Matrices = response.data.ListarMatrices;
console.log(Matrices)
          matrizSelect.value = Matrices.map(item => ({
            label: item.Nombre,
            id: item.IdTipoMatriz,
          }));
          console.log('matriz',matrizSelect)
          // $forceUpdate();
          $q.loading.hide()

        })
        .catch((error) => {
          utilidades.mensaje('Tipo Identificacion2 - Fallo la conexion ' + error)
          $q.loading.hide()
        })
    }
   const Concentraciones = () => {



      groups.value = []
      VericarOpt()
      // this.valores = []

      if (Metodo.value) {

        ObtenerTendencias()
       
        $q.loading.show()
        api.post(`/solucion/CallSolPatron/${Metodo.value.id}`)
          .then((response) => {
            console.log('response',response)
            cantidad.value = response.data.length;
            rows.value = response.data.map(item => ({
              descripcion: item.Descripcion,
              valor: item.Concentracion,
              unidad: item.IdUnidadMedida,
              IdSolucion: item.IdSolucion,
             
            }));

            row.value = response.data.map(item => ({
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
            console.log(row)
            $q.loading.hide()
          })
          .catch((error) => {
            utilidades.mensaje('Tipo Identificacion3 - Fallo la conexion ' + error)
            $q.loading.hide()
          })

      }

      if (MetodoRPD.value) {
        ObtenerTendenciasRPD()
      }





    }

   const ValidacionesCartVerificacion = () => {
      if (valores.value.length === 0) {
        triggerNegative();
        return;
      } else if (valores.value.length !== groups.value.length) {
        AllCampos();
        return;
      }
      this.OnSubmit();
      console.log('?', valoresAnteriores.value);
      console.log('?', Limites.value);

      mensajesAlerta.value = {};

      // Iterar sobre los arrays de valores y limites
      for (let clave in this.valoresAnteriores) {
        if (valoresAnteriores.value.hasOwnProperty(clave)) {
          let valorArray = valoresAnteriores.value[clave];
          let limiteArray = Limites.value;
          clavesObserva.value.push(clave)
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
            if (verificarOrdenAscendente(obtenerUltimosNValores(valorArray, 5))) {
              mensajesValor.push(' Los últimos 5 valores no están en orden ascendente. ');
            }
            if (verificarOrdenDescendente(obtenerUltimosNValores(valorArray, 5))) {
              mensajesValor.push(' Los últimos 5 valores no están en orden descendente. ');
            }

            // Validar si los últimos 5 valores superan la media
            const ultimos5Valores = obtenerUltimosNValores(valorArray, 5);
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
      if (Object.keys(mensajesAlerta.value).length > 0) {
        mostrarAlertaConObservacion(mensajesAlerta.value);
      } else {
        insertCartVerificacion()
      }
    }
    
  const ValidacionesCartRPD = () => {

      const fecha = obtenerFecha()



      if (LecturaRPD.value.length === 0) {
        triggerNegative();
        console.log('rpd')
        return;
      }


      const data =  {
        IdMetodo: MetodoRPD.value.id,
        IdTipoMatriz: matriz.value.id,
        Lectura: LecturaRPD.value,
        Login: usuario.value.Login
      }

      console.log(data)
     
      $q.loading.show();
      api.post('/usuario/InsertLecturaRPD', data)
        .then((response) => {

          var LCS = Limites.value[0].LCSresultado;
          LCS *= 0.90;

          $q.loading.hide();

          if (response.data >= 0) {
            SendCheck()
            // this.LimpiarDatosRPD()
            valorRPD.value = response.data
            insertarCartRPD()
          }
          if (response.data < 0) {
            SendCheck()
            LimpiarDatosRPD()
          }

          if (valorRPD.value > LCS) {
            Repetir.value = 1
            alertRPD();
          }


        })
        .catch((error) => {
          console.log('err', error)
          const errorMessage = `Ya has ingresado las Lecturas Diarias para el Método ${MetodoRPD.value.label} con Matriz ${this.matriz.label}.`;
          const options = {
            color: 'negative',
            message: errorMessage,
            position: 'top',
            timeout: 5000, // Tiempo en milisegundos para que el mensaje desaparezca automáticamente
            actions: [{ label: 'OK', color: 'white' }] // Botón de acción para cerrar el mensaje
          };
          $q.notify(options); // Muestra la notificación con el mensaje formateado
          $q.loading.hide();
          LimpiarDatosRPD()
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
    }
   const LimpiarDatosRPD = () => {
      MetodoRPD.value = ""
      matriz.value = ""
      LecturaRPD.value = ""
      Limites.value = ""
      VerLimites.value = false
      opcionSeleccionada2.value = false
    }
    
   const mostrarAlertaConObservacion = (mensajesPorValor) =>{
      let mensajes = '';
      for (const valor in mensajesPorValor) {
        if (mensajesPorValor.hasOwnProperty(valor)) {
          const mensajesValor = mensajesPorValor[valor];
          mensajes += `<strong>Valor: ${valor}</strong><br>`;
          mensajes += mensajesValor.join('<br>') + '<br><br>';
        }
      }

      $q.dialog({
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
        abrirVentanasObservacion();
      }).onCancel(() => {
        // console.log('>>>> Cancel')
        console.log('cancelo valor')
        valoresAnteriores.value = valoresAnterioresO.value
      });
    }


 const abrirVentanasObservacion = () => {
      let promesaObservaciones = Promise.resolve();
      let totalVentanas = Object.keys(mensajesAlerta.value).length; // Número total de ventanas esperadas
      let ventanasAbiertas = 0; // Contador de ventanas abiertas

      // Verificar si this.mensajesAlerta es un objeto y no está vacío
      if (typeof mensajesAlerta.value === 'object' && totalVentanas > 0) {
        // Iterar sobre los valores del objeto mensajesAlerta
        Object.values(mensajesAlerta.value).forEach(mensajes => {
          promesaObservaciones = promesaObservaciones.then(() => {
            return this.mostrarVentanaObservacion(mensajes).then(() => {
              ventanasAbiertas++; // Incrementar el contador de ventanas abiertas
              // Verificar si se han abierto todas las ventanas esperadas
              if (ventanasAbiertas === totalVentanas) {

                // Ejecutar otras acciones después de abrir todas las ventanas
                ordenarObservacion();
                insertCartVerificacion();
              }
            });
          });
        });
      } else {
        // No hay ventanas para abrir
        console.log('No hay ventanas de observación para abrir');
      }


    }

  const mostrarVentanaObservacion = (mensaje) =>{
      return new Promise((resolve, reject) => {
        $q.dialog({
          title: 'Observación',
          message: mensaje,
          prompt: {
            model: '',
            type: 'text' // optional
          },
          cancel: true,
          persistent: true
        }).onOk(data => {
          mensajess.value.push(data),

            resolve();
        }).onCancel(() => {
          // console.log('>>>> Cancel')
          reject();
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
      });



    }
   const verificarOrdenAscendente = (valores) =>{
      for (let i = 0; i < valores.length - 1; i++) {
        if (valores[i] > valores[i + 1]) {
          return false;
        }
      }
      return true;
    }

   const verificarOrdenDescendente = (valores) =>{
      for (let i = 0; i < valores.length - 1; i++) {
        if (valores[i] < valores[i + 1]) {
          return false;
        }
      }
      return true;
    }

   const obtenerUltimosNValores = (array, n) =>{
      return array.slice(Math.max(array.length - n, 0));
    }
  const ordenarObservacion = () => {

      let observacionesPorClave = {};
      for (let i = 0; i < clavesObserva.value.length; i++) {
        let clave = clavesObserva.value[i];
        if (mensajess.value[i]) {
          observacionesPorClave[clave] = mensajess.value[i];
        }
      }

      observacions.value = observacionesPorClave
      console.log(observacions.value)
      // Utilizar observacionesPorClave en lugar de mensajess si necesitas los mensajes asociados con las claves

    }

    const insertCartVerificacion = () => {
      // Iterar sobre cada fila de datos
      const data = groups.value.map((item, index) => {
        const IdSolucionPatron = item.id;
        const valor = valores.value[index];
        const clave = item.valor;


        // Obtener la observación asociada al valor específico
        let observacion = null;
        if (observacions.value.hasOwnProperty(clave)) {
          observacion = observacions.value[clave];
        }

        return {
          IdSolucionPatron: IdSolucionPatron,
          valor: valor,
          Observacion: observacion,
          Login: usuario.value.Login
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

      Metodo.value = "";
      row.value = []
      rows.value = [];
      valores.value = [];
      groups.value = []
      console.log(data);
      console.log(usuario.value);

    }
   const insertarCartRPD = (valor) => {


      const data = {
        IdMetodo: MetodoRPD.value.id,
        IdTipoMatriz: matriz.value.id,
        valor: valor,
        Observacion: observacion.value,
        Login: usuario.value.Login,
        Repetir: Repetir.value
      }
      console.log('RPD', data)
     
      $q.loading.show();
      api.post('/usuario/guardarCartRPD', data)
        .then((response) => {

          $q.loading.hide();
          LimpiarDatosRPD()
        })
        .catch((error) => {
          utilidades.mensaje('Tipo Identificacion4 - Fallo la conexion ' + error);
          $q.loading.hide();
          LimpiarDatosRPD()
        });
    }
    
 const obtenerFecha = () => {
      const fechaActual = new Date();
      const year = fechaActual.getFullYear();
      const month = String(fechaActual.getMonth() + 1).padStart(2, '0');
      const day = String(fechaActual.getDate()).padStart(2, '0');
      const fechaFormateada = `${year}-${month}-${day}`;
      return fechaFormateada;
    }

    
  const  triggerNegative = ()=> {
      $q.notify({
        type: 'negative',
        message: `Debe ingresar al menos un valor.`
      })
    }
    
 const  AllCampos = ()=> {
      $q.notify({
        type: 'negative',
        message: `Debe rellenar todos los campos seleccionados.`
      })
    }
    const Campos = () =>{
      $q.notify({
        type: 'positive',
        message: `campos llenos`
      })
    }
   const SendCheck  = () =>{
      $q.notify({
        type: 'positive',
        message: `Lectura guardada exitosamente`
      })
    }
    
  const  mostrarDialogoErrores = () => {
      $q.dialog({
        title: '<h5 class="prueba" >¡¡ALERTA!!</h5>',
        message: `

        <p>${errores.value.join('<br>')}</p><br>

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
        confirm.value = true;
        valores.value = [];
      });

    }

   const alertRPD = () => {
      let seconds = 5

      const dialog = $q.dialog({
        title: 'El valor final ha superado el LCS',
        message: `Acontinuación ingrese la observación`
      }).onOk(() => {
        ObservacionRPD()
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
          ObservacionRPD()
        }
      }, 3000)
    }
   const ObservacionRPD = () => {
      $q.dialog({
        title: 'OBSERVACIÓN',
        message: 'Escriba la observación para el valor ' + valorRPD.value + ' del Método '
          + MetodoRPD.value.label + ' con la matríz ' + matriz.value.label,
        prompt: {
          model: '',
          isValid: val => val.length >= 0, // << here is the magic
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        observacion.value = data;
        insertarCartRPD(valorRPD.value)
        LimpiarDatosRPD()
      })
    }
    
  const ObtenerTendencias = () => {

      const fechaFormateada = obtenerFecha();

      // Accediendo a this.Metodo.id, se supone que deberías usar el await ya que api.get() es asíncrono.
      // Además, es recomendable verificar que this.Metodo exista antes de intentar acceder a sus propiedades.
      if (Metodo.value && Metodo.value.id) {
        const data = {
          IdMetodo: Metodo.value.id,
          Fecha: "2024-02-10" // Usar la fecha actual formateada
        };
       
    
        $q.loading.show();
        api.post('/grafico/ObtenerTendencias', data)
          .then((response) => {

            const datos = response
            console.log('responsee',response)
            valoresAnteriores.value = datos.data.ValoresAnteriores
            console.log('valores prueba', valoresAnteriores.value)
            Limites.value = datos.data.EstadisticasMensuales
            console.log('lll',Limites.value)
            limpiarJSON()

            $q.loading.hide();
          })
          .catch((error) => {
            utilidades.mensaje('Tipo Identificacion5 - Fallo la conexion ' + error);
            $q.loading.hide();
          });
      } else {
        console.error('El objeto Metodo verificacion o su propiedad id es nulo o indefinido.');
      }
    }
  const  ObtenerTendenciasRPD = () => {
      const fechaActual = new Date();
      const year = fechaActual.getFullYear();
      const month = String(fechaActual.getMonth() + 1).padStart(2, '0');
      const day = String(fechaActual.getDate()).padStart(2, '0');
      const fechaFormateada = `${year}-${month}-${day}`;

      // Accediendo a this.Metodo.id, se supone que deberías usar el await ya que api.get() es asíncrono.
      // Además, es recomendable verificar que this.Metodo exista antes de intentar acceder a sus propiedades.
      if (MetodoRPD.value && MetodoRPD.value.id) {
        const data = {
          IdMetodo: MetodoRPD.value.id,
          Fecha: "2024-01-10" // Usar la fecha actual formateada
        };
        console.log(data)
     
        $q.loading.show();
        api.post('/grafico/ObtenerTendenciasRPD', data)
          .then((response) => {

            const datos = response
            console.log('rpd',response)
            valoresAnteriores.value = datos.data.ValoresAnteriores
            Limites.value = datos.data.EstadisticasMensuales[0]
            console.log('limitessss', Limites.value)
            limpiarJSON()

            $q.loading.hide();
          })
          .catch((error) => {
            utilidades.mensaje('Tipo Identificacion6 - Fallo la conexion ' + error);
            $q.loading.hide();
          });
      } else {
        console.error('El objeto Metodo o su propiedad id es nulo o indefinido.');
      }
    }


onMounted(()=>{


  const value = $q.localStorage.getItem('usuarioSilaguas')
    if (value) {
      usuario.value = value
      // this.limpiarTercero()
    }
    // utilidades.verificarUsuario(this.usuario.Login, this)
    ObtenerMetodos();
    matrices();

})




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
