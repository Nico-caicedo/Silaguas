<template>
  <q-layout container style="height: 83.7vh">
    <header class="justify-between items-center bg-grey-3 q-pa-none">
      <q-toolbar>
        <q-toolbar-title class="text-center text-bold text-subtitle1">{{ cartaControl.label }}</q-toolbar-title>
      </q-toolbar>
      <q-separator color="blue" size="1px" />
    </header>
    <q-page-container>
      <!-- Filtros -->
      <div class="q-pa-xs row col items-center justify-stretch q-gutter-xs col-xs-12 col-sm-5 col-md">
        <q-select outlined class="col-xs-12 col-sm col-md" v-model="cartaControl" :options="cartasControl"
          label="Carta Control" @update:model-value="llenarDatos" />
        <q-select outlined class="col-xs col-sm col-md" v-model="Metodo" :options="metodos" label="Método"
          @update:model-value="llenarDatos" />
        <q-select outlined class="col-xs col-sm col-md " v-if="cartaControl.value === 'CCV'" v-model="Solucion"
          :options="soluciones" label="Solución" @update:model-value="llenarDatos" />
        <q-select outlined class="col-md col-xs" v-if="cartaControl.value === 'CCRPD'" v-model="Matriz"
          :options="matrices" label="Matriz" @update:model-value="llenarDatos" />
      </div>
      <!-- datos selecionados -->
      <div class="q-pa-xs q-gutter-xs shadow-6">
        <!-- <q-card-section class="row items-center"> -->
        <div class="row justify-center col items-center q-gutter-xs">
          <q-item-label class="text-subtitle1 text-weight-medium">Método: {{ Metodo.label }} -</q-item-label>
          <q-item-label class="text-subtitle1 text-weight-medium">Fecha: {{ Fecha }}</q-item-label>
        </div>
        <div class="row col items-center q-gutter-xs">
          <q-btn flat class="bg-primary text-white col" icon="add_circle" @click="CrearObservacion"
            v-if="EstadoObservacion === false" :disabled="itemsCarta.length === 0">
            <div class="ellipsis">
              Crear Observación general
            </div>
          </q-btn>
          <q-btn class="bg-primary text-white col" icon="search" @click="CallObservacion"
            v-if="EstadoObservacion === true">
            <div class="ellipsis">
              Observación general
            </div>
          </q-btn>
          <q-btn class="bg-positive text-white col" :disabled="IdsAprobar.length === 0" icon="send" @click="Aprobar">
            <div class="ellipsis">
              Enviar
            </div>
          </q-btn>
        </div>
        <!-- </q-card-section> -->
      </div>


      <!-- ventana de ver la observacion -->
      <q-dialog v-model="ShowObservacion">
        <q-card class="rounded-borders ">
          <header class="justify between items-center  inset-shadow bg-grey">
            <q-toolbar>
              <q-toolbar-title class="text-subtitle1 ellipsis text-weight-medium text-white">OBSERVACIÓN
                GENERAL</q-toolbar-title>
              <q-btn glossy unelevated color="grey-1" class="inset-shadow">
                <div class="ellipsis text-black">
                  Ver anteriores
                </div>
              </q-btn>
            </q-toolbar>
          </header>
          <q-separator color="primary" size="1px" />
          <q-card-section class="q-pt-xs col">
            <div>{{ DatosObservacion.Observacion }}</div>
          </q-card-section>
          <q-card-section class="q-pb-none col q-pr-md">
            <div class="text-weight-bold text-caption row justify-end  ">Realizo: {{ DatosObservacion.Nombre }}
            </div>
          </q-card-section>
          <q-separator color="primary" size="1px" />
          <q-card-actions class="bg-white text-teal justify-between">
            <div class="text ">{{ DatosObservacion.Fecha }}</div>
            <div align="right">
              <q-btn flat label="Cerrar" color="negative" v-close-popup />
            </div>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-scroll-area style="height: calc(70vh - 105px)" class="q-gutter-xs">
        <div class="col row">

          <div class="col">
            <q-scroll-area style="height: 330px;">
              <q-list bordered separator v-if="itemList.length > 0">
                <q-item class="" v-for="(item, index) in itemList" :key="index" clickable v-ripple
                  @click="callResult(item)">
                  <q-item-section class="row col">
                    <div class="row col justify-between">
                      <div class="column q-gutter-xs">
                        <div class="text-weight-bold text-italic">{{ item.text }}</div>
                        <div class="text-weight-light">{{ item.text2 }}</div>
                        <div class="text-weight-light"> {{ item.text3 }}</div>
                      </div>
                      <div class="text-center text-weight-bold bg-grey-3 inset-shadow q-pa-xs rounded-borders q-mb-xl">
                        {{ item.mes }}</div>
                    </div>
                    <q-btn outline class="rounded-borders" icon="description" :color=item.Color />
                  </q-item-section>
                </q-item>
              </q-list>
              <div v-else>
                <q-item class="col justify-center items-center">
                  <q-separator class="bg-primary" inset size="1px" />
                  <q-item-section class="text-white bg-grey-6 q-pa-xs rounded-borders col row items-center text-bold">
                    No hay Datos Disponibles
                  </q-item-section>
                  <q-separator class="bg-primary" inset size="1px" />
                </q-item>
              </div>
            </q-scroll-area>
          </div>

          <div class="col q-gutter-xs">
            <q-scroll-area style="height: 330px;">
              <q-list bordered separator v-if="itemsCarta.length > 0">
                <q-item v-for="(item, index) in itemsCarta" :key="index">
                  <q-item-section class="row col justify-center">
                    <div class="row q-gutter-xs justify-between">
                      <div class="column q-gutter-xs">
                        <div class="text-weight-bold">Valor: {{ item.Valor }}</div>
                        <div class="text-caption">Realizo:</div>
                        <div class="text-bold text-subtitle2">{{ item.Nombre }}</div>
                      </div>
                      <div class="column items-center q-gutter-xs">
                        <q-checkbox v-if="item.Aprobado === false" v-model="IdsAprobar" :val="item.Idcarta" />
                        <q-icon v-if="item.Aprobado === true" color="green" name="check_circle" size="sm" />
                        <q-btn icon="plagiarism" v-if="item.Observacion !== ''" @click="Show(item.Observacion)" />
                        <div class="row justify-center items-center q-mb-none text-weight-bold"
                          v-if="item.Observacion === ''">Sin Observación
                        </div>
                      </div>
                      <div class="column">
                        <q-btn disable unelevated glossy
                          class="text-center items-center text-weight-bold bg-grey-4 inset-shadow q-pa-xs rounded-borders q-mb-xl">
                          {{ item.mes }}
                          <q-badge floating rounded :color="item.ColorStatus" />
                        </q-btn>
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
              <div v-else>
                <q-item class="col justify-center items-center">
                  <q-separator class="bg-primary" inset size="1px" />
                  <q-item-section class="text-white bg-grey-6 q-pa-xs rounded-borders col row items-center text-bold">
                    No hay Datos Disponibles
                  </q-item-section>
                  <q-separator class="bg-primary" inset size="1px" />
                </q-item>
              </div>
            </q-scroll-area>
          </div>

        </div>
      </q-scroll-area>
    </q-page-container>
  </q-layout>
</template>

<script>
import { api } from 'boot/axios'
import utilidades from '../../commons/utilidades.js'
import ApiService from 'src/commons/Datos/ADDashboard.js';
export default {
  data() {
    return {
      Ruta: 'http://192.168.1.103:3000/ImagenesActulizacion/2024Img0000030informe.jpg',
      val: false,
      color: 'green',
      usuario: '',
      cartaControl: { label: 'Carta Control  RPD', value: 'CCRPD' },
      Metodo: { label: '', value: '' ,id :''},
      Matriz: { label: '', value: '', id: ''},
      Solucion: { label: '', value: '' ,id :''},
      otraOpcion2: "",
      cartasControl: [
        { label: 'Carta control  Verificación', value: 'CCV' },
        { label: 'Carta control  RPD', value: 'CCRPD' },
      ],
      metodos: [{}],
      soluciones: [{}],
      matrices: [{}],
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
        Fecha: utilidades.darFormatofecha(),
        Nombre: '',
        Observacion: '',
      },

      ShowObservacion: false,
      ColorStatus: ''
    }
  },
  methods: {
    Descarga() {
      try {
        if (!this.Ruta) {
          this.$q.notify({
            type: 'negative',
            message: 'La ruta del archivo no está definida.',
            position: 'bottom-right'
          });
          return;
        }

        const a = document.createElement('a');
        a.href = 'file:///E:/pexels-liane-cumming-224181355-15045083.jpg';
        a.target = '_blank'
        const fileName = this.Ruta.split('/').pop();
        a.download = ''; // Nombre del archivo a descargar

        // Agregar el elemento <a> al DOM y simular clic para descargar
        document.body.appendChild(a);
        a.click();

        // Eliminar el elemento <a> del DOM después de la descarga
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error al descargar el archivo:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Error al descargar el archivo: ' + error.message,
          position: 'bottom-right'
        });
      }
    },
    toggleMarcado() {
      this.IdsAprobar = true
    },
    llenarDatos() {
      // console.log('hola mundo')
      this.datosCartas = {
        TipoCarta: this.cartaControl.value

      };

      if (this.Metodo.id) {
        this.datosCartas.IdMetodo = this.Metodo.id;
      }

      if (this.Matriz.id) {
        this.datosCartas.IdMatriz = this.Matriz.id;
        // this.datosCartas.Concentracion = ''
      }

      if (this.Solucion.id) {
        this.datosCartas.Idsolucion = this.Solucion.id
        // this.datosCartas.IdMatriz = ''
      }

      // if (this.datosCartas.TipoCarta === 'CartaControlRPD') {
      //   this.datosCartas.Concentracion = ''

      // }

      // if (this.datosCartas.TipoCarta === 'CartaControlVerificacion') {
      //   this.datosCartas.IdMatriz = ''
      // }

      this.CargarCartas()
    },
    CargarCartas() {
      if (this.datosCartas.TipoCarta === 'CCRPD') {
        const self = this;
        self.$q.loading.show();
        api.post('/cartas/CallCartas', this.datosCartas)
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
            utilidades.mensaje('cargar cartas CCRPD - Fallo la conexion ' + error);
            self.$q.loading.hide();
          });
      }
      if (this.datosCartas.TipoCarta === 'CCV') {

        const self = this;
        self.$q.loading.show();
        api.post('/cartas/CallCartas', this.datosCartas)
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
            utilidades.mensaje('cargar Cartas CCV - Fallo la conexion ' + error);
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
        // console.log('poo', item)
        const self = this;
        self.$q.loading.show();
        api.post('/cartas/CallValoresCarta', datos)
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
            utilidades.mensaje('llamar valores carta ccv - Fallo la conexion ' + error);
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
        api.post('/cartas/CallValoresCarta', datos)
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
            utilidades.mensaje('llamar valores carta rpd - Fallo la conexion ' + error);
            self.$q.loading.hide();
          });
      }
    },

    Aprobar() {
      const self = this;

      if (this.IdsAprobar.length === 0) {
        console.error('No hay Ids para aprobar.');
        return;
      }

      let apiUrl = '';
      let dataToSend = [];

      if (this.cartaControl.value === 'CCRPD') {
        apiUrl = '/cartas/AprobarRPD';
        dataToSend = this.IdsAprobar.map(id => ({ IdCartaControlRPD: id }));
      } else if (this.cartaControl.value === 'CCV') {
        apiUrl = '/cartas/AprobarV';
        dataToSend = this.IdsAprobar.map(id => ({ IdCartaControlVerificacion: id }));
      }

      api.post(apiUrl, dataToSend)
        .then((response) => {
          self.callResult(this.DatosRecarga);
          this.IdsAprobar = [];
        })
        .catch((error) => {
          console.error('Error al enviar la solicitud:', error);
        });
    },
    CallObservacion() {
      this.DatosRecarga.Login = this.usuario.Login;

      api.post('/cartas/CallObservacion', this.DatosRecarga)
        .then((response) => {
          if (response.data.IsExito === true) { // Asegúrate de usar === para comparar
            this.DatosObservacion = response.data.Dato[0]; // Accede a response.data.Dato
            this.ShowObservacion = true;

          } else {
            this.ShowObservacion = false; // Oculta la observación si no hay datos
            utilidades.mensaje(response.data.Mensaje);
          }
        })
        .catch((error) => {
          this.ShowObservacion = false; // Oculta la ventana de observaciones en caso de error
          console.error('llamar Observacion - Fallo la conexion ' + error);
          utilidades.mensaje("Error en la conexión");
        });
    },


    obtenerSolucionPatron() {
      this.$q.loading.show();
      api.get(`grafico/solucion-patron`)
        .then(response => {
          // Verificar si la respuesta tiene los datos esperados
          if (response.data) {
            // Asignar la solución patrón a la variable Solucion
            this.soluciones = response.data;
          } else {
            utilidades.mensaje('Respuesta de API inesperada');
          }
        })
        .catch(error => {
          utilidades.mensaje(`Error al obtener la solución patrón: ${error}`);
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },


    obtenerMetodos() {
      this.$q.loading.show();
      api.get('grafico/metodo')
        .then(response => {
          // Verificar si la respuesta tiene los datos esperados
          if (response.data) {
            // Asignar la lista de métodos a la variable Metodo
            this.metodos = response.data;
            // También puedes asignar el primer método como valor inicial
            if (this.Metodo.length > 0) {
              this.MetodoName = this.Metodo[0].Nombre;
            }
          } else {
            utilidades.mensaje('Respuesta de API inesperada');
          }
        })
        .catch(error => {
          utilidades.mensaje(`Error al obtener los métodos: ${error}`);
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },


    obtenerTipoMatriz() {
      this.$q.loading.show();
      api.get('grafico/tipo-matriz')
        .then(response => {
          // Verificar si la respuesta tiene los datos esperados
          if (response.data) {
            // Asignar el tipo de matriz a la variable Matriz
            this.matrices = response.data;
          } else {
            // utilidades.mensaje('Respuesta de API inesperada');
          }
        })
        .catch(error => {
          utilidades.mensaje(`Error al obtener el tipo de matriz: ${error}`);
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },


    EnviarObservacion() {

      this.DatosRecarga.Login = this.usuario.Login
      console.log(this.DatosRecarga)
      // this.ShowObservacion = true


      api.post('/cartas/InsertObservacion', this.DatosRecarga)
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
    },
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
    showNotif() {
      this.$q.notify({
        message: 'Observación general, guarda con éxito',
        color: 'green',
        icon: 'check'
      })
    }

  },
  mounted() {
    this.obtenerMetodos();
    this.obtenerSolucionPatron();
    this.obtenerTipoMatriz();
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
<!--
<style>
@media only screen and (max-width: 900px) {
  .LetraT {
    font-size: 3.5rem;
  }
}

/* esta clase hace referencia a letra tamaño de ahí el nombre LetraT */
@media only screen and (max-width: 700px) {
  .LetraT {
    font-size: 1rem;
  }
}
</style> -->
