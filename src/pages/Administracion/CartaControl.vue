<template>
  <q-layout style="min-height: 859px;">

    <q-header class="bg-green-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="assignment_add" />
        </q-avatar>

        <q-toolbar-title>
          Carta Control
        </q-toolbar-title>
        <q-btn flat icon="refresh" label="Refrescar" @click="load" />
      </q-toolbar>
    </q-header>
    <q-page padding>
      <q-form>


        <div class="column justify-around q-gutter-y-lg q-mt-xl">

          <div class="row justify-center items-center q-gutter-x-xl " style="height:420px">
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
                <q-btn v-if="show" class="color-white q-ma-sm bg-positive text-h6" style="width: 120px; height: 50px;"
                  label="Enviar" @click="ValidacionesCartVerificacion" :disabled="!opcionSeleccionada" />
                <q-btn v-if="show == false" class="color-white q-ma-sm bg-positive text-h6"
                  style="width: 120px; height: 50px;" label="Enviar" @click="ValidacionesCartVerificacion"
                  :disabled="!opcionSeleccionada" />

              </div>
            </div>

            <div v-if="show" class="q-gutter-y-lg col-12 col-sm-12 " style="width: 40%; height: 100%;">
              <q-select filled v-model="Metodo" :options="MetodoSelect" label="Método" @input="Concentraciones" />
              <div class="shadow-1 q-pa-md" style="width: 100%; height: 325px; background-color: rgb(238, 238, 238);">
                <!-- <q-table style="height: 300px;" title="Solución Patrón" :data="rows" :columns="columns" row-key="name" /> -->



                <q-option-group :options="row" type="checkbox" v-model="groups" @input="VericarOpt" />

              </div>


            </div>

            <div v-if="show == false" class="column items-center  q-pt-xl q-gutter-y-lg  "
              style="width: 40%; height: 90%; ">
              <q-select class="" style="width: 65%;" filled v-model="Metodo" :options="MetodoSelect" label="Método" />
              <q-select filled class="q-mt-xl" style="width: 65%;" v-model="matriz" :options="matrizSelect" @input=""
                label="Tipo Matriz" />
            </div>
          </div>

          <div class="q-px-lg" style="width: 100%; background-color: rgb(238, 238, 238);">
            <div class=" row  items-center justify-center relative-position q-pa-sm">
              <h3 class="row justify-center   q-my-sm">Verificación Metrológica</h3>

            </div>
            <div class="q-pa-md">
              <q-scroll-area style="height: 200px;">
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
                        <div class="text-h5">Metodo: {{ Metodo.label }}</div>
                        <div class="text-h5"> Tipo matriz: {{ matriz.label }}</div>
                        <q-input outlined v-model="valor" step="any" type="number" label="Valor" lazy-rules :rules="[
                          val => val !== null && val !== '' || 'Ingrese un valor',

                        ]" />
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



    </q-page>
  </q-layout>
</template>

<script>
import { api } from 'boot/axios'
import utilidades from '../../commons/utilidades.js'
export default {
  data() {
    return {
      OptionGroup: [],
      groups: [],
      valor: "",
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
      observacion: "",
      Tendencias: [],
      Limites: [],
      valoresAnteriores: [],
      opcionSeleccionada: false,
      mensajesAlerta : [],
      mensajess: []
    };
  },
  methods: {
    VericarOpt() {
      if (this.groups.length > 0) {
        this.opcionSeleccionada = true
      } else {
        this.opcionSeleccionada = false
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
      this.selectedOption = null;
      if (this.shape === "RPD") {
        this.show = false;
      } else if (this.shape === "Verificacion") {
        this.show = true;
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
      this.ObtenerTendencias()
      this.groups = []
      this.VericarOpt()
      // this.valores = []
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
            label: ("concentración" + " " + item.Concentracion),
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

  let promesa = Promise.resolve();
 // Array para almacenar los mensajes de alerta

  // Iterar sobre los arrays de valores y limites
  for (let clave in this.valoresAnteriores) {
    if (this.valoresAnteriores.hasOwnProperty(clave)) {
      let valorArray = this.valoresAnteriores[clave];
      let limiteArray = this.Limites;

      // Verificar si valorArray es un objeto
      if (typeof valorArray === 'object' && valorArray !== null) {
        // Acceder al último valor del array
        let valor = valorArray[valorArray.length - 1];

        // Buscar el límite correspondiente en el objeto limiteArray
        let limite = limiteArray[clave];

        // Si se encuentra el límite correspondiente
        if (limite) {
          // Validar si el valor supera el límite superior o es menor que el límite inferior
          if (valor > limite.LCSresultado) {
            let valors = 'El valor es superior a LCS: ' + valor;
            this.mensajesAlerta.push(valors); // Agregar mensaje al array de alerta
          } else if (valor < limite.LCIresultado) {
            let valors = 'El valor es inferior a LCI: ' + valor;
            this.mensajesAlerta.push(valors); // Agregar mensaje al array de alerta
          } else {
            console.log('Valores correctos');
          }
        }
      }
    }
  }

  // Mostrar ventana de alerta con los mensajes de alerta y abrir las ventanas de observación
  if (this.mensajesAlerta.length > 0) {
    this.mostrarAlertaConObservacion(this.mensajesAlerta);
  }
},

mostrarAlertaConObservacion(mensajes) {
  this.$q.dialog({
    title: 'Alerta',
    message: mensajes,
    ok: true,
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(() => {
    // Llamada para abrir las ventanas de observación
    this.abrirVentanasObservacion();
  });
},

abrirVentanasObservacion() {
  let promesaObservaciones = Promise.resolve();
  // Abrir las ventanas de observación una por una
  for (let mensaje of this.mensajesAlerta) {
    promesaObservaciones = promesaObservaciones.then(() => this.mostrarVentanaObservacion(mensaje));
   
  }
  console.log(this.mensajess)
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
      this.mensajess.push( data ),
      console.log(this.mensajess)
      resolve();
    }).onCancel(() => {
      // console.log('>>>> Cancel')
      reject();
    }).onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
  });


  console.log(this.mensajess)
}

    ,
    insertCartVerificacion() {


      // Crear un array para almacenar los mensajes de error
      this.errores = [];

      //  Iterar sobre cada fila de datos
      // this.row.forEach((item, index) => {
      //   const valor = this.valores[index];
      //   console.log(item)
      //   console.log(valor)
      //   // Obtener los límites inferior y superior específicos para esta fila
      //   

      

      //   console.log(this.errores)
      // });

      // // // Verificar si hay errores
      // if (this.errores.length > 0) {
      //   // Mostrar mensajes de error o realizar la lógica necesaria
      //   this.mostrarDialogoErrores();

      // }
      // else {
      //   // No hay errores, proceder con el envío de datos al servidor
      //   const data = this.row.map((item, index) => ({
      //     IdSolucionPatron: item.IdSolucion,
      //     valor: this.valores[index],
      //     Login: this.usuario.Login
      //   }));

      // }
      //   const self = this;
      //   self.$q.loading.show();
      //   api.post('/usuario/InsertarCartaVerificacion', data)
      //     .then((response) => {
      //       console.log(response.data);
      //       self.$q.loading.hide();
      //     })
      //     .catch((error) => {
      //       utilidades.mensaje('Tipo Identificacion - Fallo la conexion ' + error);
      //       self.$q.loading.hide();
      //     });

      //   this.Metodo = "";
      //   this.rows = [];
      //   this.valores = [];
      //   console.log(data);
      //   console.log(this.usuario);
      // }
    },
    insertarCartRPD() {

      const data = {
        IdMetodo: this.Metodo.id,
        IdTipoMatriz: this.matriz.id,
        Valor: this.valor,
        Login: this.usuario.Login
      }

      // const self = this;
      // self.$q.loading.show();
      // api.post('/usuario/guardarCartRPD', data)
      //   .then((response) => {
      //     console.log(response.data);
      //     self.$q.loading.hide();
      //     this.Metodo = ""
      //     this.matriz = ""
      //     this.valor = ""
      //   })
      //   .catch((error) => {
      //     utilidades.mensaje('Tipo Identificacion - Fallo la conexion ' + error);
      //     self.$q.loading.hide();
      //   });
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
    ObtenerTendencias() {
      const fechaActual = new Date();
      const year = fechaActual.getFullYear();
      const month = String(fechaActual.getMonth() + 1).padStart(2, '0');
      const day = String(fechaActual.getDate()).padStart(2, '0');
      const fechaFormateada = `${year}-${month}-${day}`;

      // Accediendo a this.Metodo.id, se supone que deberías usar el await ya que api.get() es asíncrono.
      // Además, es recomendable verificar que this.Metodo exista antes de intentar acceder a sus propiedades.
      if (this.Metodo && this.Metodo.id) {
        const data = {
          IdMetodo: this.Metodo.id,
          Fecha: "2024-01-10" // Usar la fecha actual formateada
        };

        const self = this;
        self.$q.loading.show();
        api.post('/usuario/ObtenerTendencias', data)
          .then((response) => {

            const datos = response
            this.valoresAnteriores = datos.data.ValoresAnteriores
            this.Limites = datos.data.EstadisticasMensuales
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
