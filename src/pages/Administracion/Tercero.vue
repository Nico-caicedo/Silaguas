<template>
  <q-layout container style="height: 92vh">
    <q-header class="bg-green-8 shadow-1">
      <q-toolbar>
        <q-avatar>
          <q-icon flat round dense name="account_box" size="sm" />
        </q-avatar>
        <q-toolbar-title class="text-weight-light">
          Información Terceros
        </q-toolbar-title>
        <div class="q-gutter-x-sm">
          <!-- <q-btn icon="person" label="" outline unelevated @click="abrirBusqueda()" class="inset-shadow"><q-tooltip
              transition-show="scale" transition-hide="scale" class="bg-amber text-black shadow-4" :offset="[10, 10]">
              Terceros Inactivos
            </q-tooltip>
          </q-btn> -->
          <q-btn icon="delete" label="" @click="limpiarTercero()" color="white" outline align="center" class="ellipsis">
            <q-tooltip transition-show="scale" transition-hide="scale" class="bg-primary text-white shadow-4">
              limpiar Campos
            </q-tooltip>
          </q-btn>
          <q-btn label="" icon="replay" outline align="center" unelevated @click="regresar()" class="inset-shadow">
            <q-tooltip transition-show="scale" transition-hide="scale" class="bg-amber text-black shadow-4"
              :offset="[10, 10]">
              Inicio
            </q-tooltip>
          </q-btn>
        </div>

      </q-toolbar>
    </q-header>


    <q-page-container>
      <q-scroll-area class="T-primary" style="height: calc(99vh - 99px)">
        <q-form @submit.prevent="guardarCambios()">
          <div class="q-pa-md">
            <div class="row q-col-gutter-sm">

              <q-input class="col-xs-12 col-md-2 q-field-with-bottom" filled v-if="tercero && tercero.IdTercero != null"
                v-model="tercero.IdTercero" type="number" label="IdTercero" readonly />

              <q-select filled v-model="tercero.Identificacion" class="col-xs-12 col-sm col-md q-field--with-bottom"
                map-options emit-value option-value="Identificacion" option-label="Nombre" :options="terceroOptions"
                use-input hide-dropdown-icon hide-selected fill-input input-debounce="0" type="number"
                label="Identificacion" :clearable="clearableTercero" @clear="limpiarTercero" @filter="filterTercero"
                :onUpdate:modelValue="(val) => {
            cargarDatosIdentificacion(val);
          }
            ">
                <template v-slot:prepend>
                  <q-icon name="person" size="lg" />
                </template>

                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label caption>
                        <b> {{ scope.opt.Nombre }} </b>
                      </q-item-label>
                      <q-item-label caption>Identification: {{ scope.opt.Identificacion }}
                      </q-item-label>
                      <q-item-label caption>Id Persona: {{ scope.opt.IdTercero }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey-10">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-select class="col-xs-12 col-md-4 q-field--with-bottom" outlined map-options emit-value
                option-value="IdTipoIdentificacion" option-label="Nombre" v-model="tercero.IdTipoIdentificacion"
                :options="tipoId" label="Tipo Identificación" lazy-rules :rules="[
            (val) =>
              (val && val.length > 0) || 'Seleciona Tipo Identificacion',]" />
              <q-input class="col-xs-12 col-md-2 q-field--with-bottom" outlined readonly v-model="tercero.DV"
                label="DV" />

              <q-input class="col-xs-12 col-md-12 q-field--with-bottom" outlined v-model="tercero.RazonSocial"
                label="Razon Social" lazy-rules v-if="tercero.IdTipoIdentificacion == 'NIT'" :rules="[
            (val) => (val && val.length > 0) || 'Ingresa la Razón Social',
          ]" />

              <q-input class="col-xs-12 col-md-6 q-field--with-bottom" outlined v-model="tercero.Nombre" label="Nombre"
                lazy-rules v-if="tercero.IdTipoIdentificacion != 'NIT'"
                :rules="[(val) => (val && val.length > 0) || 'Ingrese Nombre']" />

              <q-input class="col-xs-12 col-md-6 q-field--with-bottom" outlined v-model="tercero.OtrosNombres"
                label="Otros nombres" v-if="tercero.IdTipoIdentificacion != 'NIT'" />

              <q-input class="col-xs-12 col-md-6 q-field--with-bottom" outlined v-model="tercero.Apellido1"
                label="Primer Apellido" lazy-rules v-if="tercero.IdTipoIdentificacion != 'NIT'" :rules="[
            (val) =>
              (val && val.length > 0) || 'Ingrese el primer Apellido ',
          ]" />

              <q-input class="col-xs-12 col-md-6 q-field--with-bottom" outlined v-model="tercero.Apellido2"
                label="Segundo Apellido" v-if="tercero.IdTipoIdentificacion != 'NIT'" />
              <!-- select sexo -->
              <q-select class="col-xs-12 col-md-4 q-field--with-bottom" outlined filled v-model="tercero.Sexo"
                map-options emit-value option-value="id" option-label="nombre" :options="sexo" label="Sexo" lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Seleciona Orientacion Sexual',]">
                <template v-slot:prepend>
                  <q-icon name="wc" size="lg" />
                </template>
              </q-select>

              <q-input class="col-xs-12 col-md-4 q-field--with-bottom" outlined stack-label v-model="tercero.Nacimiento"
                type="date" label="Fecha de Nacimiento" lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Pon tu Fecha de Nacimiento']">
                <template v-slot:prepend>
                  <q-icon name="date_range" size="lg" />
                </template>
              </q-input>

              <q-input class="col-xs-12 col-md-4 q-field--with-bottom" outlined v-model="tercero.Alias" label="Alias" />

              <!-- select  departarmentos -->
              <q-select class="col-xs-12 col-md-6 q-field--with-bottom" outlined v-model="tercero.CodigoDepartamento"
                map-options emit-value option-value="CodigoDepartamento" option-label="Nombre"
                :options="listaDepartamentos" lazy-rules :rules="[
            (val) => (val && val.length > 0) || 'Seleciona Departamento',
          ]" :onUpdate:modelValue="(val) => {
            seleccionarDepartamento(val);
          }
            " label="Departamento">
                <template v-slot:prepend>
                  <q-icon name="list_alt" size="lg" />
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label caption>
                        <b> {{ scope.opt.Nombre }} </b>
                      </q-item-label>
                      <q-item-label caption>
                        Código Departamento: {{ scope.opt.CodigoDepartamento }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <!-- select  municipios -->
              <q-select class="col-xs-12 col-md-6 q-field--with-bottom" outlined v-model="tercero.CodigoMunicipio"
                map-options emit-value option-value="CodigoMunicipio" option-label="Nombre" :options="listaMunicipios"
                lazy-rules :rules="[
            (val) => (val && val.length > 0) || 'Selecciona Municipio',
          ]" label="Municipio">
                <template v-slot:prepend>
                  <q-icon name="location_city" size="lg" />
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label caption><b>{{ scope.opt.Nombre }}</b></q-item-label>
                      <q-item-label caption>Código Municipio:
                        {{ scope.opt.CodigoMunicipio }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-input class="col-xs-12 col-md-6 q-field--with-bottom" outlined v-model="tercero.Direccion"
                label="Direccion" />
              <q-input class="col-xs-12 col-md-3 q-field--with-bottom" outlined type="number" v-model="tercero.Telefono"
                label="Telefono" />
              <q-input class="col-xs-12 col-md-3 q-field--with-bottom" outlined type="number" v-model="tercero.Celular"
                label="Celular" />
              <q-input class="col-xs-12 col-md-6 q-field--with-bottom" outlined v-model="tercero.Email" label="Email" />
              <q-input class="col-xs-12 col-md-6 q-field--with-bottom" outlined v-model="tercero.Web"
                label="Pagina Web" />
              <q-input class="col-xs-12 col-md-12 q-field--with-bottom" outlined type="textarea"
                v-model="tercero.Observacion" label="Observaciones" />
              <q-page-sticky position="bottom-right" :offset="[17, 10]">
                <div class="col q-gutter-x-sm">
                  <q-btn label="" round :icon="iconBoton" type="submit" class="shadow-1" align="center"
                    :color="colorBoton" unelevated @submit="guardarCambios">
                    <q-tooltip transition-show="scale" transition-hide="scale" :class="tooltipClass">
                      {{ accionBoton }}
                    </q-tooltip>
                  </q-btn>
                  <!-- <q-btn icon="delete" label="" round align="center" class="shadow-1" color="negative"
                    @click="confirmarEliminar(tercero.IdTercero)"><q-tooltip transition-show="scale"
                      transition-hide="scale" class="bg-red text-white shadow-4">
                      Eliminar tercero
                    </q-tooltip></q-btn> -->
                </div>
              </q-page-sticky>
            </div>
          </div>
        </q-form>
        <!-- <TerceroFiltro ref="busquedaTercero" :onSeleccionTercero="seleccionarTercero" /> -->

        <q-dialog v-model="isDialogComponenteTerceros" persistent>
          <q-card style="width: 700px; max-width: 80vw">
            <q-card-section class="row justify-between">
              <div class="text-h6">Terceros Inactivos</div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-separator color="primary" />
            <q-card-section class="scroll q-pa-none">
              <q-list bordered>
                <div v-if="listaTerceros.length === 0" class="q-pa-md text-center text-grey">
                  No hay Terceros Inactivos para mostrar.
                </div>

                <q-item v-else v-for="tercero in listaTerceros" :key="tercero.IdTercero" clickable>

                  <q-item-section>{{ tercero.Nombre }}</q-item-section>
                  <q-item-section>{{ tercero.Identificacion }}</q-item-section>
                  <q-item-section>{{ tercero.Cargo }}</q-item-section>
                  <q-item-section class="row q-gutter-sm">

                    <q-btn icon="check" outline label="" align="center" color="green"
                      @click="activarTercero(tercero.IdTercero)"><q-tooltip transition-show="scale"
                        transition-hide="scale" class="bg-red text-white shadow-4">
                        Activar Tercero
                      </q-tooltip></q-btn>
                    <q-btn icon="delete" outline label="" align="center" color="negative"
                      @click="eliminarTerceroBD(tercero.IdTercero)"><q-tooltip transition-show="scale"
                        transition-hide="scale" class="bg-red text-white shadow-4">
                        Eliminar tercero de la bd
                      </q-tooltip></q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-separator color="primary" />
            <q-card-actions align="right">
              <q-btn flat label="Close" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-scroll-area>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import utilidades from "../../commons/utilidades.js";
import { date, useQuasar } from "quasar";
import { ref, onMounted, computed } from "vue";

const listaTerceros = ref([]);
const isDialogComponenteTerceros = ref(false);
const $q = useQuasar();
const router = useRouter();
let timeout = ref(null);
const clearableTercero = ref(false);
const terceroOptions = ref([]);


const tercero = ref({
  IdTercero: -1,
  Identificacion: '',
  Nombre: '',
  CodigoMunicipio: '',
  CodigoDepartamento: '',
  IdTipoIdentificacion: '',
  Sexo: '',
  DV: "",
  Nacimiento: '',
  OtrosNombres: '',
  Apellido1: '',
  Apellido2: '',
  Alias: '',
  Direccion: '',
  Telefono: '',
  Celular: '',
  Email: '',
  Web: '',
  Observacion: '',
  LoginCrea: '',
});


const usuario = ref({
  Login: "",
  Password: "",
  IdTercero: -1,
  NombreTercero: "",
  Nomodpass: "0",
  Modpasspi: "0",
  Passnoexpire: "0",
  Activo: "0",
  Fecha: "",
});

const terceroB = ref([
  {
    IdTercero: -1,
    Nombre: "",
    CodigoMunicipio: "",
    CodigoDepartamento: "",
    IdTipoIdentificacion: "",
    Sexo: "",
    DV: "",
    Nacimiento: utilidades.fechaActual(),
    Otrosnombres: "",
    Apellido1: "",
    Apellido2: "",
    Alias: "",
    Direccion: "",
    Telefono: "",
    Celular: "",
    Email: "",
    Web: "",
    Observacion: "",
    LoginCrea: "",
  },
]);

const tipoId = ref([]);

const sexo = ref([
  { id: "M", nombre: "Masculino" },
  { id: "F", nombre: "Femenino" },
  { id: "I", nombre: "Prefiero no decirlo" },
]);

const listaDepartamentos = ref([]);

const listaMunicipios = ref([]);

const abrirBusqueda = async () => {
  isDialogComponenteTerceros.value = true;
};

const seleccionarTercero = async (tercero) => {
  busquedaTercero.hide();
  seleccionarPersona(tercero);
};

const cargarTercero = async (ter) => {
  tercero.value = ter;
};

const limpiarTercero = async () => {
  tercero.value = {
    IdTercero: -1,
    Identificacion: '',
    Nombre: '',
    CodigoMunicipio: '',
    CodigoDepartamento: '',
    IdTipoIdentificacion: '',
    Sexo: '',
    DV: '',
    Nacimiento: utilidades.darFormatofecha(),
    OtrosNombres: '',
    Apellido1: '',
    Apellido2: '',
    Alias: '',
    RazonSocial: '',
    Direccion: '',
    Telefono: '',
    Celular: '',
    Email: '',
    Web: '',
    Observacion: '',
    LoginCrea: '',
  };
};

const filterTercero = async (val, update, abort) => {
  if (val.length === 0) {
    abort();
    return;
  }
  $q.loading.show();
  try {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      const response = await api.get(`/tercero/mostrar-identificacion/${val}`);
      if (response.data && response.data.IdTercero) {
        tercero.value = response.data;
        tercero.value.Nacimiento = utilidades.darFormatofecha(response.data.Nacimiento);
        clearableTercero.value = true;
      } else {
        limpiarTercero();
        tercero.value.Nacimiento = utilidades.fechaActual();
        tercero.value.Identificacion = val;
        clearableTercero.value = false;
      }
      $q.loading.hide();
    }, 500);
  } catch (error) {
    utilidades.mensaje(`filtro tercero - Fallo la conexión  + ${error}`);
  } finally {
    $q.loading.hide();
  }
};



const seleccionarPersona = async (persona) => {
  if (!persona) {
    return;
  }
  tercero.value = persona;
  $emit("tercero", persona);
  for (let i = 0; i < listaDepartamentos.value.length; i++) {
    for (let m = 0; m < listaDepartamentos.value[i].ListaMunicipios.length; m++) {
      if (listaDepartamentos.value[i].ListaMunicipios[m].CodigoMunicipio === tercero.value.CodigoMunicipio) {
        tercero.value.CodigoDepartamento = listaDepartamentos.value[i].CodigoDepartamento;
        await seleccionarDepartamento(tercero.value.CodigoDepartamento);
        tercero.value.CodigoMunicipio = listaDepartamentos.value[i].ListaMunicipios[m].CodigoMunicipio;
        await calcularDV();
        await convertirFecha();
        return;
      }
    }
  }
};

const cargarDatosIdentificacion = async () => {
  if (tercero.value.Identificacion == "" ||
    tercero.Identificacion === undefined) {
    return;
  }
  $q.loading.show();
  try {
    const identificacion = tercero.value.Identificacion;
    terceroB.value = {};
    const response = await api.get(`/tercero/mostrar-identificacion/${identificacion}`);
    terceroB.value = response.data;
    $q.loading.hide();
    if (terceroB.value.IdTercero > 0) {
      await seleccionarPersona(terceroB.value);
    } else {
      await limpiarTercero();
      tercero.value.Identificacion = identificacion;
      await calcularDV(identificacion);
      $q.loading.hide();
    }
  } catch (error) {
    utilidades.mensaje(`Buscar Identificacion - Fallo la conexion , ${error}`);
    $q.loading.hide();
  }
};



const activarTercero = async (IdTercero) => {
  $q.loading.show();
  try {
    const response = await api.post(`/tercero/activar-tercero/${IdTercero}`);
    await mostraTercerosDesactivados()
    utilidades.mensaje(response.data.Mensaje);
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Activar Tercero - Fallo en la conexion " + error);
    $q.loading.hide();
  }
};

const mostraTercerosDesactivados = async () => {
  $q.loading.show();
  try {
    const response = await api.get("/tercero/listar-terceros-desactivados");
    listaTerceros.value = response.data;
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Modificar Tercero - Fallo la conexion " + error);
    $q.loading.hide();
  }
};


const guardarCambios = async () => {
  if (tercero.value.IdTercero > 0) {
    $q.dialog({
      title: "Silaguas",
      message: "¿Está seguro de modificar los datos del tercero?",
      ok: {
        push: true,
        color: "blue",
        flat: false,
        label: "Aceptar",
      },
      cancel: {
        push: true,
        color: "red",
        flat: false,
        label: "Cancelar",
      },
      persistent: true,
    })
      .onOk(async () => {
        await modificarTercero();
      })
      .onCancel(() => { });
  } else {
    $q.dialog({
      title: "Silaguas",
      message: "¿Está seguro de crear el tercero?",
      ok: {
        push: true,
        color: "blue",
        flat: false,
        label: "Aceptar",
      },
      cancel: {
        push: true,
        color: "red",
        flat: false,
        label: "Cancelar",
      },
      persistent: true,
    })
      .onOk(async () => {
        await guardarTercero();
      })
      .onCancel(() => { });
  }
};

const guardarTercero = async () => {
  $q.loading.show();
  try {
    tercero.value.LoginCrea = usuario.value.Login;
    const response = await api.post("/tercero/guardar-tercero", tercero.value);
    const respuesta = response.data;
    terceroB.value = respuesta.tercero;
    if (terceroB.value.IdTercero > 0) {
      tercero.value = terceroB.value;
    }
    await limpiarTercero();
    utilidades.mensaje(respuesta.Mensaje);
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Guardar tercero - Fallo la conexión: " + error);
    $q.loading.hide();
  }
};

const modificarTercero = async () => {
  $q.loading.show();
  try {
    tercero.value.Login = usuario.value.Login;
    const response = await api.post("/tercero/modificar-tercero", tercero.value);
    const respuesta = response.data;
    utilidades.mensaje(respuesta.Mensaje);
    await limpiarTercero();

    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Modificar Tercero - Fallo la conexion " + error);
    $q.loading.hide();
  }
};

const confirmarEliminar = async (IdTercero) => {
  if (tercero.value.IdTercero > 0) {
    $q.dialog({
      title: "Silaguas",
      message: "Está seguro de Eliminar el tercero?",
      ok: {
        push: true,
        color: "blue",
        flat: false,
        label: "Aceptar",
      },
      cancel: {
        push: true,
        color: "red",
        flat: false,
        label: "Cancelar",
      },
      persistent: true,
    })
      .onOk(async () => {
        await eliminarTercero(IdTercero);
      })
      .onCancel(() => { });
  } else {
    utilidades.mensaje("Busca un Tercero a Eliminar")
  }
};

const eliminarTercero = async (IdTercero) => {
  $q.loading.show();
  try {
    const response = await api.delete(`/tercero/eliminar-tercero/${IdTercero}`);
    const respuesta = response.data;
    utilidades.mensaje(respuesta.Mensaje);
    await mostraTercerosDesactivados();
    await limpiarTercero();
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Eliminar Tercero - Fallo la conexion " + error);
    $q.loading.hide();
  }
};

const eliminarTerceroBD = async (IdTercero) => {
  $q.loading.show();
  try {
    const response = await api.delete(`/tercero/eliminar-tercero-bd/${IdTercero}`);
    const respuesta = response.data;
    utilidades.mensaje(respuesta.Mensaje);
    await mostraTercerosDesactivados();
    await limpiarTercero();
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Eliminar Tercero - Fallo la conexion " + error);
    $q.loading.hide();
  }
};


const mostrarListaDepartamentos = async () => {
  $q.loading.show();
  try {
    const response = await api.get("/usuario/mostrar-departamentos-municipios");
    listaDepartamentos.value = response.data;
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Departamentos - Fallo la conexion " + error);
    $q.loading.hide();
  }
};

const seleccionarDepartamento = async (CodigoDepartamento) => {
  tercero.value.CodigoMunicipio = ""; // Limpiar el municipio seleccionado al cambiar de departamento
  for (var i = 0; i < listaDepartamentos.value.length; i++) {
    if (listaDepartamentos.value[i].CodigoDepartamento === CodigoDepartamento) {
      listaMunicipios.value = listaDepartamentos.value[i].ListaMunicipios;
      return;
    }
  }
};

const mostrarTipoIdentificacion = async () => {
  $q.loading.show();
  try {
    const response = await api.get(`/tercero/listar-identificaciones`);
    tipoId.value = response.data; // Suponiendo que tipoId es un ref
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Tipo Identificacion - Fallo la conexion " + error);
    $q.loading.hide();
  }
};

const convertirFecha = async () => {
  try {
    if (tercero.value.Nacimiento !== "") {
      let fecha = tercero.value.Nacimiento;
      tercero.value.Nacimiento = utilidades.darFormatofecha(fecha);
    }
  } catch (error) {
    utilidades.mensaje("Error al convertir la fecha:", error);
  }
};


const calcularDV = async (identificacion) => {

  const nit = tercero.value.Identificacion;
  console.log(identificacion);
  const isNitValid = nit.length;
  if (isNitValid > 0) {
    tercero.value.DV = calcularDigitoVerificacion(nit);
  }
};


const  calcularDigitoVerificacion = async (myNit) => {
  var vpri;
  var x;
  var y;
  var z;
  // Se limpia el Nit
  myNit = myNit.replace(/\s/g, ""); // Espacios
  myNit = myNit.replace(/,/g, ""); // Comas
  myNit = myNit.replace(/\./g, ""); // Puntos
  myNit = myNit.replace(/-/g, ""); // Guiones

  // Se valida el nit
  if (isNaN(myNit)) {
    utilidades.mensaje("El nit/cédula " + myNit + " no es válido(a).");
    return;
  }

  // Procedimiento
  vpri = new Array(16);
  z = myNit.length;

  vpri[1] = 3;
  vpri[2] = 7;
  vpri[3] = 13;
  vpri[4] = 17;
  vpri[5] = 19;
  vpri[6] = 23;
  vpri[7] = 29;
  vpri[8] = 37;
  vpri[9] = 41;
  vpri[10] = 43;
  vpri[11] = 47;
  vpri[12] = 53;
  vpri[13] = 59;
  vpri[14] = 67;
  vpri[15] = 71;

  x = 0;
  y = 0;
  for (var i = 0; i < z; i++) {
    y = myNit.substr(i, 1);
    // console.log ( y + "x" + vpri[z-i] + ":" ) ;

    x += y * vpri[z - i];
    // console.log ( x ) ;
  }

  y = x % 11;
  // console.log ( y ) ;

  return y > 1 ? 11 - y : y;
};






const regresar = async () => {
  router.push("/admin");
};

onMounted(() => {
  const value = $q.localStorage.getItem("usuarioSilaguas");
  if (value) {
    usuario.value = value;
    limpiarTercero();
  }
  tercero.value.Nacimiento = utilidades.fechaActualAñoMesDia();
  mostrarListaDepartamentos();
  mostrarTipoIdentificacion();
  mostraTercerosDesactivados();

});



const iconBoton = computed(() => {
  return tercero.value.IdTercero > 0 ? 'edit' : 'save';
});

const accionBoton = computed(() => {
  return tercero.value.IdTercero > 0 ? 'Modificar Tercero' : 'Guardar Tercero';
});

const colorBoton = computed(() => {
  return tercero.value.IdTercero > 0 ? 'orange' : 'green';
});

const tooltipClass = computed(() => {
  return tercero.value.IdTercero > 0 ? 'tooltip-editar' : 'tooltip-guardar';
});

</script>

<style>
.q-field--with-bottom {
  margin-bottom: 20px;
}

.tooltip-editar {
  background-color: #ff9800;
  /* Cambia esto al color que desees para editar */
  color: white;
}

.tooltip-guardar {
  background-color: #4caf50;
  /* Cambia esto al color que desees para guardar */
  color: white;
}
</style>
