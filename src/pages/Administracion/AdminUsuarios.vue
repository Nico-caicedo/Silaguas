<template>
  <q-layout container style="height: 92vh">
    <q-header class="bg-green-8 shadow-1">
      <q-toolbar>
        <q-avatar>
          <q-icon size="md" name="person_search" />
        </q-avatar>
        <q-toolbar-title class="text-weight-light">
          Usuarios del Sistema
        </q-toolbar-title>


        <div class="q-gutter-x-sm">
          <!-- <q-btn icon="person" label="" outline unelevated @click="abrirBusqueda()" class="inset-shadow"><q-tooltip
              transition-show="scale" transition-hide="scale" class="bg-amber text-white shadow-4" :offset="[10, 10]">
              Usuarios Inactivos
            </q-tooltip>
          </q-btn> -->
          <q-btn icon="delete" label="" @click="limpiarTercero()" color="white" outline align="center" class="ellipsis">
            <q-tooltip transition-show="scale" transition-hide="scale" class="bg-primary text-white shadow-4">
              limpiar Campos
            </q-tooltip>
          </q-btn>
          <q-btn label="" icon="replay" outline align="center" unelevated @click="regresar()" class="inset-shadow">
            <q-tooltip transition-show="scale" transition-hide="scale" class="bg-green text-white shadow-4"
              :offset="[10, 10]">
              Inicio
            </q-tooltip>
          </q-btn>
        </div>




      </q-toolbar>
    </q-header>
    <q-footer class="q-pa-sm bg-grey-4 shadow-up-3">

      <div class="row col q-gutter-sm">
        <!-- <q-btn icon="search" label="" @click="cargarTodos()" color="purple" outline align="center" class="ellipsis ">
          <q-tooltip transition-show="scale" transition-hide="scale" class="bg-purple text-white shadow-4"
            :offset="[10, 10]">
            Cargar Usuarios
          </q-tooltip>
        </q-btn> -->

        <q-btn label="" color="grey-10" class="ellipsis inset-shadow" outline icon="vpn_key" align="center"
          @click="restablecerClave()">
          <q-tooltip transition-show="scale" transition-hide="scale" class="bg-grey-1 text-black shadow-4"
            :offset="[10, 10]">
            Restablecer Contraseña
          </q-tooltip>
        </q-btn>
      </div>
    </q-footer>

    <q-page-container>
      <q-scroll-area class="T-primary" style="height: calc(92vh - 102px)">
        <q-form ref="formCl" @submit.prevent="guardarUsu()">
          <div class="q-pa-sm q-col-gutter-sm">
            <div class="col-grow">
              <div class="row q-col-gutter-sm">
                <q-select filled v-model="filtroBuscaUsuario" class="col-xs-12 col-sm col-md q-field--with-bottom"
                  map-options emit-value option-value="usuario" option-label="RazonSocial" :options="listaUsuarios"
                  use-input hide-dropdown-icon hide-selected fill-input input-debounce="0" label="Buscar Usuario"
                  :clearable="clearableUsuario" @clear="limpiarTercero" @filter="filterFnUsuario" :onUpdate:modelValue="(val) => {
            cargarUsuario(val);
          }">
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label caption>
                          <b> {{ scope.opt.RazonSocial }} </b>
                        </q-item-label>
                        <q-item-label caption>Login: {{ scope.opt.Login }}
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

                <q-select filled v-model="filtroBuscaTercero" class="col-xs-12 col-sm col-md q-field--with-bottom" map-options emit-value option-value="tercero" option-label="Identificacion" :options="listaTerceros"
                  use-input hide-dropdown-icon hide-selected fill-input input-debounce="0" label="Buscar Tercero"
                  :clearable="clearableTercero" @clear="limpiarTercero" @filter="filterFnTercero" :onUpdate:modelValue="(val) => {
            cargarTercero(val);
          }">
                  <template v-slot:prepend>
                    <q-icon name="person" size="lg" />
                  </template>
                  <template v-slot:append>
                    <q-btn icon="person_add" color="black" flat dense unelevated @click="mostrarPersonasDialog" />
                  </template>

                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label caption>
                          <b> {{ scope.opt.RazonSocial }} </b>
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
              </div>

              <div class="row q-gutter-sm">
                <q-input class="col-xs-12 col-sm col-md q-field--with-bottom" outlined readonly
                  v-model="usuarioAcceso.RazonSocial" label="Tercero" />
                <q-input class="col-xs-12 col-sm col-md q-field--with-bottom" outlined v-model="usuarioAcceso.Login"
                  label="Usuario" :rules="[regla]">
                  <template v-slot:prepend>
                    <q-icon name="account_circle" size="lg" />
                  </template>
                </q-input>
                <q-select class="col-xs-12 col-sm col-md q-field--with-bottom" filled v-model="usuarioAcceso.IdRol"
                  :rules="[regla]" map-options emit-value option-value="IdRol" option-label="Nombre"
                  :options="listaRoles" label="Rol Usuario">
                  <template v-slot:prepend>
                    <q-icon name="accessibility" size="lg" />
                  </template>
                </q-select>

                <q-input class="col-xs-12 col-sm col-md q-field--with-bottom" outlined readonly
                  v-model="usuarioAcceso.IdTercero" :rules="[regla]" label="Id Persona" />
              </div>

              <div class="row q-gutter-sm">
                <q-input class="col-xs-12 col-sm col-md q-field--with-bottom" outlined readonly
                  v-model="usuarioAcceso.LoginCrea" label="Creado por">
                  <template v-slot:prepend>
                    <q-icon name="vpn_key" size="lg" />
                  </template>
                </q-input>

                <q-input class="col-xs-12 col-sm col-md q-field--with-bottom" outlined readonly
                  v-model="usuarioAcceso.Fecha" label="Fecha Creado">
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm col-md q-field--with-bottom" outlined readonly
                  v-model="usuarioAcceso.ProximoCambio" label="Fecha proximo cambio">
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
              </div>

              <div class="row q-gutter-sm">
                <q-input class="col-xs-12 col-sm col-md" outlined v-model="usuarioAcceso.Observacion" label="Cargo" />
                <q-select class="col-xs-12 col-sm col-md" filled v-model="usuarioAcceso.PeriodoCambio" :rules="[regla]"
                  map-options emit-value :options="periodoCambio" label="Cambio (meses)">
                  <template v-slot:prepend>
                    <q-icon name="today" size="lg" />
                  </template>
                </q-select>
              </div>

              <!-- toggle -->
              <div class="row q-gutter-xs">
                <q-toggle class="ellipsis col-xs-12 col-sm col-md" v-model="usuarioAcceso.PassNoExpire"
                  checked-icon="check" :rules="[regla]" :true-value="1" :false-value="0" color="green"
                  label="El password no expira" unchecked-icon="clear" />

                <q-toggle class="ellipsis col-xs-12 col-sm col-md" v-model="usuarioAcceso.Activo" :true-value="1"
                  :false-value="0" color="green" label="Usuario Activo" checked-icon="check" unchecked-icon="clear" />

                <q-toggle class="ellipsis col-xs-12 col-sm col-md" v-model="usuarioAcceso.NoModPass"
                  checked-icon="check" :true-value="1" :false-value="0" :rules="[regla]" color="green"
                  label="No puede cambiar password" unchecked-icon="clear" />

                <q-toggle class="ellipsis col-xs-12 col-sm col-md" v-model="usuarioAcceso.ModPasspi"
                  checked-icon="check" :true-value="1" :false-value="0" :rules="[regla]" color="green"
                  label="Cambiar password en el proximo inicio" unchecked-icon="clear" />
                <div class="row q-gutter-sm">
                  <q-btn label="" round :icon="iconBoton" outline type="submit" class="shadow-1" align="center"
                    :color="colorBoton" unelevated @submit="guardarUsu">
                    <q-tooltip transition-show="scale" transition-hide="scale" :class="tooltipClass">
                      {{ accionBoton }}
                    </q-tooltip>
                  </q-btn>
                  <!-- <q-btn icon="delete" label="" outline round align="center" class="shadow-1" color="negative"
                    @click="confirmarEliminar(usuarioAcceso.IdTercero)"><q-tooltip transition-show="scale"
                      transition-hide="scale" class="bg-red text-white shadow-4">
                      Eliminar Usuario
                    </q-tooltip></q-btn> -->
                </div>
              </div>
            </div>

            <!-- cuadro para mostrar usuarios-->
            <div class="col-xs col-sm col-md col-xl col-lg">
              <q-separator color="primary" />
              <div :class="computedHeaderColor" class="inset-shadow">
                <q-toolbar rounded>
                  <q-btn flat round icon="people" />
                  <q-toolbar-title>Usuarios del Sistema</q-toolbar-title>
                </q-toolbar>
              </div>
              <q-separator color="primary" />
              <q-list class="col-xs col-sm col-md">
                <template v-if="listaUsuarios.length > 0">
                  <q-scroll-area style="height: calc(450px - 40px)">
                    <q-item v-for="usu in listaUsuarios" :key="usu.Login" @click.native="cargarUsuario(usu)" clickable
                      rounded-borders>
                      <q-separator color="red" size="3px" />
                      <q-item-section avatar>
                        <q-icon name="person" color="black" />
                      </q-item-section>
                      <q-separator vertical />
                      <q-item-section>
                        <q-separator color="grey" size="1px" />
                        <q-item-label class="col text-center text-italic q-pa-sm">
                          <b> {{ usu.RazonSocial }} </b>
                        </q-item-label>
                        <q-separator color="grey" size="1px" />
                        <q-item-label class="q-pa-md">
                          <div class="row q-gutter-y-xs">
                            <div class="col-xs-6 col-md-2">
                              <b style="color: black"> I</b>d Persona:
                              <b>{{ usu.IdTercero }}</b>
                            </div>
                            <div class="col-xs-6 col-md-2">
                              <b style="color: black"> U</b>suario:<b>{{
            usu.Login
          }}</b>
                            </div>
                            <div class="col-xs-6 col-md-2">
                              <b style="color: black"> C</b>reado por:
                              <b>{{ usu.LoginCrea }}</b>
                            </div>

                            <div class="col-xs-6 col-md-2">
                              <b style="color: black"> I</b>d Rol:
                              <b>{{ usu.IdRol }}</b>
                            </div>
                            <div class="col-xs-6 col-md-2">
                              <b style="color: black"> P</b>eriodo cambio
                              Password: <b>{{ usu.PeriodoCambio }}</b>
                            </div>
                            <div class="col-xs-6 col-md-2">
                              <b style="color: black"> P</b>róximo Cambio:
                              <b>{{
            utilidades.darFormatofecha(usu.ProximoCambio)
          }}</b>
                            </div>
                            <div class="col-xs-6 col-md-2">
                              <b style="color: black"> F</b>echa creación:
                              <b>{{ usu.Fecha.slice(0, 10) }}</b>
                            </div>
                            <div class="col-xs-6 col-md-2">
                              <b style="color: black"> E</b>l Password nunca
                              expira: <b>{{ usu.PassNoExpire }}</b>
                            </div>
                            <div class="col-xs-6 col-md-2">
                              <b style="color: black"> A</b>ctivo en el Sistema:
                              <b>{{ usu.Activo }}</b>
                            </div>
                            <div class="col-xs-6 col-md-2">
                              <b style="color: black"> N</b>o puede cambiar el
                              password: <b>{{ usu.NoModPass }}</b>
                            </div>
                            <div class="col-xs-6 col-md-2">
                              <b style="color: black"> P</b>róximo cambio del
                              password:<b>{{ usu.ModPasspi }}</b>
                            </div>
                            <div class="col-xs-6 col-md-2">
                              <b style="color: black"> C</b>argo:
                              <b>{{ usu.Observacion }}</b>
                            </div>
                          </div>
                        </q-item-label>
                        <q-separator color="grey" size="1px" />
                      </q-item-section>
                      <q-separator vertical />
                    </q-item>
                  </q-scroll-area>
                </template>

                <template v-else>
                  <q-item class="col row justify-center items-center bg-white">
                    <q-item-section class="text-grey-10 justify-center items-center text-bold">
                      Aún no has consultado ningun usuario.
                    </q-item-section>
                  </q-item>
                </template>
              </q-list>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-5"></div>
          </div>
        </q-form>
        <q-dialog v-model="prompt" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Your address</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-input dense v-model="address" autofocus @keyup.enter="prompt = false" />
            </q-card-section>
            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn flat label="Add address" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="isDialogComponenteTerceros" persistent>
          <q-card style="width: 700px; max-width: 80vw">
            <q-card-section class="row justify-between">
              <div class="text-h6">Usuarios Inactivos</div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-separator color="primary" />
            <q-card-section class="scroll q-pa-none">
              <q-list bordered>
                <div v-if="listaTerceros.length === 0" class="q-pa-md text-center text-grey">
                  No hay Usuarios Inactivos para mostrar.
                </div>

                <q-item v-else v-for="Usuario in listaTerceros" :key="Usuario.IdTercero">

                  <q-item-section>{{ Usuario.IdTercero }}</q-item-section>
                  <q-item-section>{{ Usuario.Login }}</q-item-section>
                  <q-item-section>{{ Usuario.IdRol }}</q-item-section>
                  <q-item-section class="row q-gutter-sm">

                    <q-btn icon="check" outline label="" align="center" color="green"
                      @click="activarUsuarios(Usuario.IdTercero)"><q-tooltip transition-show="scale"
                        transition-hide="scale" class="bg-green text-white shadow-4">
                        Activar Tercero
                      </q-tooltip></q-btn>
                    <q-btn icon="delete" outline label="" align="center" color="negative"
                      @click="eliminarUsuarioBD(Usuario.IdTercero)"><q-tooltip transition-show="scale"
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

        <q-dialog v-model="isDialogComponentePersonas" persistent>
          <q-card style="width: 700px; max-width: 80vw">
            <q-card-section class="row justify-between">
              <div class="text-h6">Agregar Tercero</div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-separator color="primary" />
            <q-card-section class="scroll q-pa-none">
              <Tercero ref="busquedaTercero" :onSeleccionTercero="seleccionarTercero" style="max-height: 70vh" />
            </q-card-section>
            <q-separator color="primary" />

            <q-card-actions align="right" class="">
              <q-btn flat icon="x" color="primary" v-close-popup />
              <q-btn flat label="" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-scroll-area>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import Tercero from "../Administracion/Tercero.vue";
import { api } from "boot/axios";
import utilidades from "../../commons/utilidades.js";
import { useQuasar } from "quasar";


const $q = useQuasar();
const prompt = ref(false);
let timeout = ref(null);
const router = useRouter();
const clearableTercero = ref(false);
const clearableUsuario = ref(false);

const usuario = ref({
  Login: "",
  IdRol: "",
  IdTercero: -1,
  Password: "",
  LoginCrea: "",
  Observacion: "",
  FIngreso: "",
  ModPasspi: 0,
  NoModPass: 0,
  PassNoExpire: 0,
  Activo: 0,
  ProximoCambio: "",
  PeriodoCambio: 0,
  Estado: 0,
  RazonSocial: "",
});

const usuarioAcceso = ref({
  IdTercero: -1,
  NoModPass: 0,
  ModPasspi: 0,
  PassNoExpire: 0,
  Activo: 0,
  Fecha: utilidades.fechaActual(),
  Login: usuario.value.LoginCrea,
});

const usuarioB = ref({});

let timer;

let tercero = ref({
  IdTercero: -1,
  Nombre: "",
  CodigoMunicipio: "",
  IdDepartamento: "",
  IdTiid: "",
  Sexo: "",
  Dv: -1,
  Nacimiento: "",
  OtrosNombres: "",
  Apellido1: "",
  Apellido2: "",
  Alias: "",
  Direccion: "",
  Telefono: "",
  Celular: "",
  Email: "",
  Web: "",
  Observaciones: "",
});

const roles = ref([]);
const periodoCambio = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
const filtroBuscaTercero = ref("");
const filtroBuscaUsuario = ref("");
const listaTerceros = ref([]);
const listaUsuarios = ref([]);
const listaPersonas = ref([]);
const listaRoles = ref();
let componenteTerceros = ref(null);
let componentePersonas = ref(null);
const selected = ref([]);
const isDialogComponenteTerceros = ref(false);
const isDialogComponentePersonas = ref(false);

const abrirBusqueda = async () => {
  isDialogComponenteTerceros.value = true;
};

const limpiarTercero = async () => {
  tercero.value = {
    Id: -1,
    Identificacion: "",
    Nombre: "",
    OtrosNombres: "",
    Apellido1: "",
    Apellido2: "",
    Alias: "",
    Direccion: "",
    Telefono: "",
    Celular: "",
    Email: "",
    Web: "",
    Observaciones: "",
    Login: "",
    Modifica: "",
  };

  usuarioAcceso.value = {
    Login: "",
    Password: "",
    IdTercero: -1,
    NoModPass: 0,
    ModPasspi: 0,
    PassNoExpire: 0,
    Activo: 0,
    Fecha: utilidades.fechaActual(),
  };

  listaUsuarios.value = [];
  listaTerceros.value = [];
  filtroBuscaTercero.value = "";
  filtroBuscaUsuario.value = "";
  clearableTercero.value = false;
  clearableUsuario.value = false;
};

const mostrarTerceroDialog = async () => {
  componenteTerceros = () => isDialogComponenteTerceros;
  isDialogComponenteTerceros.value = true;
};

const mostrarPersonasDialog = async () => {
  componentePersonas = () => isDialogComponentePersonas;
  isDialogComponentePersonas.value = true;
};

const filterFnTercero = async (val, update, abort) => {
  if (val.length === 0) {
    abort();
    return;
  }
  $q.loading.show();
  try {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      const response = await api.get(`/tercero/mostrar-tercero-filtro-gral/${val}`);
      update(() => {
        listaTerceros.value = response.data;
        clearableTercero.value = true;
      });
    }, 500);
  } catch (error) {
    utilidades.mensaje(`filtro tercero - Fallo la conexión  + {error}`);
  } finally {
    $q.loading.hide();
  }
};

const seleccionarTercero = async (tercero) => {
  busquedaTercero.hide();
  cargarTercero(tercero);
};
// seccion para cargar datos
const cargarTercero = async (usu) => {
  console.log('cargartercero', usu);
  usuarioAcceso.value = usu;
  // mostrarUsuarioPersona(ter);
};
// funcion para cargar los usuarios x id tercero
const mostrarUsuarioPersona = async (persona) => {
  limpiarTercero();
  tercero.value = persona;
  usuarioAcceso.value.LoginUsuario = usuario.value.Login;
  usuarioAcceso.value.FechaUsuario = utilidades.fechaActual();
  const IdTercero = tercero.IdTercero > 0 ? tercero.IdTercero : -1;
  usuarioAcceso.value.IdTercero = tercero.value.IdTercero;
  $q.loading.show();
  try {
    const response = await api.get(`/usuario/usuario-id-tercero/${IdTercero}`);
    listaUsuarios.value = response.data;

    if (listaUsuarios.length > 0) {
      cargarUsuario(listaUsuarios[0]);
    }
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Mostrar Usuario Persona - Fallo la conexion " + error);
    $q.loading.hide();
  }
};

const filterFnUsuario = async (val, update, abort) => {
  if (val.length === 0) {
    abort();
    return;
  }
  $q.loading.show();
  try {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      const response = await api.get(`/usuario/usuarios-filtro/${val}`);
      console.log(response);
      update(() => {
        listaUsuarios.value = response.data;
        clearableUsuario.value = true;
      });
    }, 500);
  } catch (error) {
    utilidades.mensaje(`filtro usuario - Fallo la conexión , + ${error}`);
  } finally {
    $q.loading.hide();
  }
};

const cargarUsuario = async (usu) => {
  if (usu && usu.RazonSocial) {
    usuarioAcceso.value = usu;
    usuarioAcceso.NombreTercero = usu.RazonSocial;
    usuarioAcceso.value.Fecha = utilidades.darFormatofecha(usu.Fecha);
    usuarioAcceso.value.ProximoCambio = utilidades.darFormatofecha(
      usu.ProximoCambio
    );
  }
};

const cargarTodos = async (ter) => {
  await buscarUsuariosTodos(ter);
};

const buscarUsuariosTodos = async () => {
  $q.loading.show();
  try {
    listaPersonas.value = [];
    const response = await api.get(`/usuario/listar-usuarios-todos`);
    listaUsuarios.value = response.data;
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Mostrar Filtro - Fallo la conexión " + error);
    $q.loading.hide();
  } finally {
    $q.loading.hide();
  }
};

const mostrarRoles = async () => {
  $q.loading.show();
  try {
    const response = await api.get(`/rol/cargar-rol`);
    listaRoles.value = response.data;
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje(`Roles - Fallo la conexión, ${error}`);
  } finally {
    $q.loading.value = false;
  }
};

// verifica si existe en la bd
const verificarUsuario = async (usuarioAcceso) => {
  $q.loading.show();
  try {
    const response = await api.get(`/usuario/verificacion/${usuarioAcceso}`);
    usuarioB.value = response.data;
    console.log(usuarioB.value);
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Verificar Usuario - Fallo la conexión " + error);
  } finally {
    $q.loading.value = false;
  }
};

// formulario
const guardarUsu = async () => {
  try {
    // Verificar la existencia del usuario
    await verificarUsuario(usuarioAcceso.value.IdTercero);
    usuarioAcceso.value.Modifica = usuario.value.Login;
    usuarioAcceso.value.Logincrea = usuario.value.Login;
    usuarioAcceso.value.EstadoUsuario = 1;

    // Si el usuario tiene un ID de tercero válido y fue filtrado por usuario
    if (usuarioAcceso.value.IdTercero > 0 && filtroBuscaUsuario.value) {
      $q.dialog({
        title: "Silaguas",
        message: "¿Está seguro de modificar los datos del Usuario?",
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
          await modificarContraseña();
        })
        .onCancel(() => { });
    }
    // Si el usuario tiene un ID de tercero válido y fue filtrado por tercero
    else if (usuarioAcceso.value.IdTercero > 0 && filtroBuscaTercero.value) {
      $q.dialog({
        title: "Silaguas",
        message: "¿Está seguro de crear el Usuario?",
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
          await nuevaContraseña();
        })
        .onCancel(() => { });
    } else {
      utilidades.mensaje("seleciona un Tercero o un Usuario :)");
    }
  } catch (error) {
    utilidades.mensaje("Guardar Usuario - Fallo la conexión " + error);
  } finally {
    $q.loading.value = false;
  }
};

const modificarContraseña = async () => {
  try {
    $q.dialog({
      title: "Modificar Contraseña",
      message: "¿Deseas cambiar la contraseña?",
      cancel: true,
      persistent: true,
    })
      .onOk(async () => {
        await cambiarContraseña();
      })
      .onCancel(async () => {
        await modificarUsuario();
      });
  } catch (error) {
    utilidades.mensaje("error en confirmacion de modificar contraseña" + error);
  }
};

const cambiarContraseña = async () => {
  try {
    const { value: password } = await $q
      .dialog({
        title: "Nueva Contraseña",
        message: "Ingrese la nueva contraseña para este Usuario:",
        prompt: {
          model: "",
          type: "password", // Cambiar el tipo de entrada a password para ocultar el texto ingresado
          value: usuarioAcceso.value.Password,
        },
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
      .onOk((data) => {
        if (data) {
          usuarioAcceso.value.Password = data;
          modificarUsuario();
        } else {
          utilidades.Notify("Por favor, ingresa la contraseña.", "error");
        }
      });
  } catch (error) {
    utilidades.mensaje("Error en el diálogo " + error);
  }
};

const nuevaContraseña = async () => {
  try {
    const { value: password } = await $q
      .dialog({
        title: "Nueva Contraseña",
        message: "Ingrese la nueva contraseña para este Usuario:",
        prompt: {
          model: "",
          type: "password", // Cambiar el tipo de entrada a password para ocultar el texto ingresado
        },
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
      .onOk((data) => {
        if (data) {
          usuarioAcceso.value.Password = data;
          guardarUsuario();
        } else {
          utilidades.Notify("Por favor, ingresa la contraseña.", "error");
        }
      });
  } catch (error) {
    utilidades.mensaje("Error en el diálogo " + error);
  }
};

// guardar cuando es un nuevo registro
const guardarUsuario = async () => {
  $q.loading.show();
  try {
    let resultado = 0;
    const response = await api.post("/usuario/guardar-usuario", usuarioAcceso.value);
    resultado = response.data;
    utilidades.mensaje(resultado.Mensaje);
    utilidades.leerMensaje(resultado.Mensaje);
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Grabado Fallido " + error);
    $q.loading.hide();
  }
};

// modificar cuando es estado 1 en la bd
const modificarUsuario = async () => {
  $q.loading.show();
  try {
    let resultado = 0;
    const response = await api.put("/usuario/modifica-usuario", usuarioAcceso.value);
    resultado = response.data;
    utilidades.mensaje(resultado.Mensaje);
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Modificacion Fallida " + error);
    $q.loading.hide();
  }
};

const confirmarEliminar = async (IdTercero) => {
  if (usuarioAcceso.value.IdTercero > 0) {
    $q.dialog({
      title: "Silaguas",
      message: "Está seguro de Eliminar el Usuario?",
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
    utilidades.mensaje("Busca un Usuario a Eliminar")
  }
};

const eliminarTercero = async (IdTercero) => {
  $q.loading.show();
  try {
    const response = await api.delete(`/usuario/eliminar-usuario/${IdTercero}`);
    const respuesta = response.data;
    utilidades.mensaje(respuesta.Mensaje);
    await mostraUsuariosDesactivados();
    await limpiarTercero();
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Eliminar Usuario - Fallo la conexion " + error);
    $q.loading.hide();
  }
};

const activarUsuarios = async (IdTercero) => {
  $q.loading.show();
  try {
    const response = await api.post(`/usuario/activar-usuario/${IdTercero}`);

    utilidades.mensaje(response.data.Mensaje);
    await mostraUsuariosDesactivados();
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Activar Usuario - Fallo en la conexion " + error);
    $q.loading.hide();
  }
};

const mostraUsuariosDesactivados = async () => {
  $q.loading.show();
  try {
    const response = await api.get("/usuario/listar-usuarios-desactivados");
    listaTerceros.value = response.data;
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Mostrar Usuario Desactivado - Fallo la conexion " + error);
    $q.loading.hide();
  }
};

const convertirFecha = async () => {
  usuarioAcceso.value.FechaUsuario = utilidades.fechaActual();
};

// volver a la pagina principal
const regresar = async () => {
  router.push("/admin");
};

// validaciones
const regla = async (val) => {
  if (val !== null && val !== "" && val !== undefined) {
    return true;
  }
  return false || "Falta completar información";
};

const restablecerClave = async () => {
  if (!usuarioAcceso || !usuarioAcceso.value.Login) {
    utilidades.mensaje(
      "Por favor, seleccione un usuario antes de cambiar la contraseña."
    );
    return;
  }
  try {
    const { value: newPassword } = await $q
      .dialog({
        title: "Cambiar Contraseña",
        message: "Ingrese la nueva contraseña:",
        prompt: {
          model: "",
          type: "password", // Cambiado a tipo password para ocultar la contraseña
          showPassword: true,
          color: "primary",
        },

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
      .onOk(async (data) => {
        if (!data) {
          utilidades.mensaje("Por favor, ingrese una contraseña.");
          return; // Salir si no se ingresó ninguna contraseña
        }
        try {
          const response = await api.put("/usuario/modifica-password", {
            Login: usuarioAcceso.value.Login,
            Password: data,
          });
          const resultado = response.data;
          $q.loading.hide();
          utilidades.mensaje(resultado.Mensaje);
        } catch (error) {
          utilidades.mensaje("Restablecer Contraseña" + error);
          $q.loading.hide();
        }
      });
  } catch (error) {
    utilidades.mensaje("Error en el diálogo " + error);
  }
};

const showLoading = () => {
  $q.loading.show({
    message:
      'Some important <b>process</b> is in progress.<br><span class="text-amber text-italic">Please wait...</span>',
    html: true,
  });

  // hiding in 3s
  timer = setTimeout(() => {
    $q.loading.hide();
    timer = void 0;
  }, 3000);
};

onMounted(() => {
  showLoading();
  const value = $q.localStorage.getItem("usuarioSilaguas");
  if (value) {
    usuario.value = value;
  }
  mostraUsuariosDesactivados();
  mostrarRoles();
  convertirFecha();
});

// funciones computadas
const iconBoton = computed(() => {
  return filtroBuscaUsuario.value ? 'edit' : 'save';
});

const accionBoton = computed(() => {
  return filtroBuscaUsuario.value ? 'Modificar Usuario' : 'Guardar Usuario';
});

const colorBoton = computed(() => {
  return filtroBuscaUsuario.value ? 'orange' : 'green';
});

const tooltipClass = computed(() => {
  return filtroBuscaUsuario.value ? 'tooltip-editar' : 'tooltip-guardar';
});

const computedHeaderColor = computed(() => {
  return listaUsuarios.value.length > 0
    ? "bg-primary text-white"
    : "bg-grey text-white";
});

</script>
<style>
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
