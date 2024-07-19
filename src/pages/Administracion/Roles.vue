<template>
  <q-layout container style="height: 92vh">
    <q-header class="bg-green-8 shadow-1">
      <q-toolbar>
        <q-avatar>
          <q-icon name="pages" />
        </q-avatar>
        <q-toolbar-title class="text-weight-light">
          Roles
        </q-toolbar-title>
        <div class="q-gutter-x-sm">

          <q-btn icon="delete" label="" @click="limpiarTercero()" color="white" outline align="center" class="ellipsis">
            <q-tooltip transition-show="scale" transition-hide="scale" class="bg-primary text-white shadow-4">
              limpiar Campos
            </q-tooltip>
          </q-btn>
          <!-- <q-btn icon="contacts" label="" @click="abrirVentanaUsuarioRol" color="white" outline align="center"
          class="ellipsis">
          <q-tooltip transition-show="scale" transition-hide="scale" class="bg-amber text-white shadow-4">
            Usuarios
          </q-tooltip>
        </q-btn> -->
        </div>
      </q-toolbar>
    </q-header>
    <q-footer class="q-pa-sm bg-grey-4 shadow-up-3">
      <div class="col q-gutter-x-sm">
        <!-- <q-btn label="" round icon="update" class="shadow-1" align="center" color="indigo-8" unelevated
          @click="guardarAccesos">
          <q-tooltip transition-show="scale" transition-hide="scale" class="bg-indigo">
            Actualizar accesos
          </q-tooltip>
        </q-btn> -->
        <q-btn label="" round :icon="iconBoton" class="shadow-4" align="center" :color="colorBoton" unelevated
          @click="guardarAccesos">
          <q-tooltip transition-show="scale" transition-hide="scale" :class="tooltipClass">
            {{ accionBoton }}
          </q-tooltip>
        </q-btn>

        <!-- <q-btn icon="delete" label="" round align="center" class="shadow-1" color="negative"
            @click="confirmarEliminar(accesosRol.IdAcceso)"><q-tooltip transition-show="scale" transition-hide="scale"
              class="bg-red text-white shadow-4">
              Desactivar Rol
            </q-tooltip></q-btn> -->
        <!-- <q-btn icon="calendar_month" label="" round align="center" class="shadow-1" color="purple" unelevated
            @click="guardarPlazo"><q-tooltip transition-show="scale" transition-hide="scale"
              class="bg-purple text-white shadow-4">
              Suspension
            </q-tooltip></q-btn> -->
      </div>
    </q-footer>
    <q-page-container>
      <q-scroll-area class="T-primary" style="height: calc(92vh - 108px)">
        <div class="q-pa-md q-mt-none">
          <q-select filled class="col-xs-12 col-sm-6 col-md-4" label="Roles" v-model="idRol" emit-value map-options
            option-value="IdRol" option-label="Nombre" :options="roles" outlined :clearable="clearable"
            :onUpdate:modelValue="(val) => {
            mostrarAccesosTrue(val, '-1');
          }
            ">
            <template v-slot:prepend>
              <q-icon name="verified" />
            </template>
            <template v-slot:append>
              <q-btn icon="assignment_ind" size="lg" color="green-7" flat dense unelevated
                @click.stop="mostrarRolesDialog">
                <q-tooltip transition-show="scale" transition-hide="scale" class="bg-green text-white shadow-4">
                  Nuevo Rol
                </q-tooltip>
              </q-btn>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label caption>
                    <b> Id Rol: {{ scope.opt.IdRol }} </b>
                  </q-item-label>
                  <q-item-label caption>Nombre: {{ scope.opt.Nombre }}
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
        <q-separator color="primary" />

        <div class="q-pa-md">
          <q-scroll-area class="" style="height: calc(71vh - 100px)">
            <q-tree class="col-12 col-sm-12" :nodes="accesos" label-key="Descripcion" :expand-on-click="false"
              icon="settings" color="blue-10" node-key="IdAcceso" children-key="Hijos" tick-strategy="leaf"
              v-model:ticked.sync="accesosSeleccion">
              <template v-slot:default="{ node, ticked, expanded, clickable, icon }">
                <q-item :key="node.IdAcceso" clickable @click="navigateToView(node.Aspx)">
                  <q-item-section avatar>
                    <q-icon :name="node.Icono" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ node.Descripcion }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-tree>
            <q-separator color="primary" inset />
          </q-scroll-area>
        </div>
        <q-separator color="primary" />
      </q-scroll-area>
    </q-page-container>

    <q-dialog v-model="isDialogComponenteRol" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center text-bold">Agregar Nuevo Rol</div>
        </q-card-section>
        <q-separator color="blue" />
        <q-card-section class="q-pa-md q-gutter-sm">
          <div class="q-pa-none q-ma-none row q-gutter-sm">
            <q-input outlined dense v-model="rol.IdRol" autofocus label="Id Rol" class="col" />
            <q-input outlined filled dense v-model="rol.Nombre" label="Nombre Rol" class="col" />
          </div>
          <q-input type="textarea" filled dense v-model="rol.Observacion" label="Observacion" />
        </q-card-section>
        <q-separator color="blue" />
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" color="white" v-close-popup class="bg-red-9" />
          <q-btn flat label="Añadir Rol" color="white" @click="guardarRol()" v-close-popup class="bg-blue-9" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>

import { api } from "boot/axios";
import eventBus from 'src/commons/eventBus';
import utilidades from "src/commons/utilidades";
import ADUsuarios from "src/commons/Datos/ADUsuarios";
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const roles = ref([]);
const rol = ref({
  IdRol: "",
  Nombre: "",
  Observacion: "",
  Login: "",
  Fecha: "",
});
const accesos = ref([]);
const accesosSeleccion = ref([]);
const accesosRol = ref([]);
const nuevoAccesos = ref({
  IdAcceso: "",
  IdRol: "",
  Login: "",
  Fecha: "",
});
const idRol = ref("");
const usuario = ref({
  Login: "",
  Password: "",
  IdPersona: -1,
  Nomodpass: null,
  Passnoexpire: null,
  Activo: null,
});
const usuarios = ref([]);
const usuariosFiltro = ref([]);
const usuarioRol = ref({ IdUsuario: null, IdRol: null });
const componenteusuarios = ref(null);
const isDialogComponenteUsuarios = ref(false);
const isDialogComponenteRol = ref(false);
const clearable = computed(() => {
  return idRol.value !== "";
});

const limpiarTercero = async () => {
  idRol.value = "";
  accesosSeleccion.value = [];
};


const mostrarRolesDialog = async () => {
  isDialogComponenteRol.value = true;
};

const mostrarRoles = async (idRol) => {
  $q.loading.show();
  try {
    const response = await api.get(`/rol/cargar-rol`);
    roles.value = response.data;
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Roles - Fallo la conexion " + error);
  } finally {
    $q.loading.hide();
  }
};

const mostrarAccesos = async (idModulo) => {
  $q.loading.show();
  try {
    const response = await api.get(`/acceso/accesos-id-modulo/${idModulo}`);
    accesos.value = response.data;
  } catch (error) {
    utilidades.mensaje("Accesos - Fallo la conexion " + error);
  } finally {
    $q.loading.hide();
  }
};

const mostrarAccesosTrue = async (idRol) => {
  $q.loading.show();
  try {
    accesosSeleccion.value = [];
    const response = await api.get(`/acceso/accesos/${idRol}`);
    accesosRol.value = response.data;
    // console.log('accesos rol', accesosRol.value);
    // accesosSeleccion.value = response.data.map(acceso => acceso.IdAcceso);
    accesosRol.value.forEach(function (acceso) {
      accesosSeleccion.value.push(acceso.IdAcceso);
    });
    // console.log('accesos selecion', accesosSeleccion.value);
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Fallo la conexión: " + error);
  } finally {
    $q.loading.hide();
  }
};

const guardarAccesos = () => {
  if (!idRol.value) {
    utilidades.mensaje("Por favor seleccione un Rol");
    return;
  }

  if (accesosSeleccion.value.length === 0) {
    utilidades.mensaje("Por favor seleccione al menos un Acceso");
    return;
  }
  const mensaje =
    accesosRol.value.length === 0
      ? "¿Está seguro de guardar los Accesos seleccionados?"
      : "Está seguro de modificar los Accesos seleccionados";

  if (accesosSeleccion.value.length === 0) {
    utilidades.mensaje(mensaje);
    return;
  }

  $q.dialog({
    title: "Silaguas",
    message: mensaje,
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
      if (accesosRol.value.length === 0) {
        await actualizarVistas();
      } else {
        await actualizarVistas();
      }
    })
    .onCancel(() => { });
};

const guardarRol = async () => {
  $q.loading.show();
  try {
    rol.value.IdRol = rol.value.IdRol.toLocaleUpperCase();
    rol.value.Nombre = rol.value.Nombre.toLocaleUpperCase();
    rol.value.Login = usuario.value.Login;
    const response = await api.post("/rol/insertar-rol/", rol.value);
    roles.value.push(rol.value);
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Roles - Fallo la conexion " + error);
  } finally {
    $q.loading.hide();
  }
};

const actualizarVistas = async () => {
  try {
    if (accesosSeleccion.value.length === 0) {
      utilidades.mensaje("Por favor seleccione al menos un Acceso");
      return;
    }

    const idRolValor = idRol._value || idRol; // Obtener el valor primitivo de idRol

    const payload = {
      IdRol: idRolValor,
      Vistas: accesosSeleccion.value.map(acceso => ({
        IdAcceso: acceso
      })),
      Login:usuario.value.Login
    };

    const response = await api.post("/acceso/actualizar-vistas", payload);
    utilidades.mensaje(response.data.Mensaje);
  } catch (error) {
    console.error("Error al actualizar las vistas:", error);
    utilidades.mensaje("Ocurrió un error al actualizar las vistas. Por favor, intenta de nuevo.");
  }
};




const guardarRolAccesos = async () => {
  if (accesosSeleccion.value.length === 0) {
    utilidades.mensaje("Por favor seleccione al menos un Acceso");
    return;
  }
  $q.loading.show();
  try {
    nuevoAccesos.value = [];
    accesosSeleccion.value.forEach(acceso => {
      nuevoAccesos.value.push({
        IdAcceso: acceso,
        IdRol: idRol,
        Login: usuario.value.Login,
        Estado: 1
      });
    });

    const response = await api.post("/acceso/guardar-rol-accesos", nuevoAccesos.value);

    utilidades.mensaje(response.data.Mensaje);
    await limpiarTercero();
  } catch (error) {
    utilidades.mensaje("Guardar Rol Accesos - Fallo la conexión " + error);
  } finally {
    $q.loading.hide();
  }
};

const modificarRolAccesos = async () => {
  $q.loading.show();
  try {
    nuevoAccesos.value = [];
    if (accesosSeleccion.value.length > 0) {
      accesosSeleccion.value.forEach(function (acceso) {
        const ac = accesosRol.value.find(f => f.IdAcceso === acceso)
        if (ac) {
          ac.Estado = 1
        } else {
          nuevoAccesos.value.push({ IdAcceso: acceso, IdRol: idRol, Login: usuario.Login, Estado: 1 })
        }
      })
    }

    if (accesosRol.value.length > 0) {
      accesosRol.value.forEach(function (acceso) {
        const ac = accesosSeleccion.value.find(f => f === acceso.IdAcceso)
        if (ac) {
        } else {
          nuevoAccesos.value.push({ IdAcceso: acceso.IdAcceso, IdRol: idRol, Login: usuario.Login, Estado: 0 })
        }
      })
    }
    const response = await api.post(
      "/acceso/modificar-rol-accesos",
      nuevoAccesos.value
    );
    const respuesta = response.data;
    utilidades.mensaje(respuesta.Mensaje);
    await limpiarTercero();
    eventBus.emit('accesosActualizados', nuevoAccesos.value);
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Modificar Rol Accesos - Fallo la conexion " + error);
    $q.loading.hide();
  }
};

const confirmarEliminar = async (IdAcceso) => {
  if (accesos.value.IdAcceso > 0) {
    $q.dialog({
      title: "Silaguas",
      message: "Está seguro de Eliminar el Rol?",
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
        await eliminarRol(IdAcceso);
      })
      .onCancel(() => { });
  } else {
    utilidades.mensaje("Busca un rol a Eliminar");
  }
};

const eliminarRol = async (idRol) => {
  $q.loading.show();
  try {
    const response = await api.delete(`/rol/eliminar-rol/${idRol}`);
    const respuesta = response.data;
    utilidades.mensaje(respuesta.Mensaje);
    // await mostraTercerosDesactivados();
    await limpiarTercero();
    $q.loading.hide();
  } catch (error) {
    utilidades.mensaje("Eliminar Rol - Fallo la conexion " + error);
    $q.loading.hide();
  }
};

const eliminarTerceroBD = async (IdTercero) => {
  $q.loading.show();
  try {
    const response = await api.delete(
      `/tercero/eliminar-tercero-bd/${IdTercero}`
    );
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

const guardarPlazo = async () => {
  try {
    const SW_PlazoLiquidacion_ = {
      Usuario: 900166906,
      Clave: "Credidatos2023@",
      IdPlazoLiquidacion: 0,
      IdLiquidacion: 0,
      IdUsuario: 0,
      FechaCreacion: "",
      FechaPlazo: "",
      Codigo: 1049,
    };
    $q.loading.show();
    const response = await api.post(
      "/plazoLiquidacion/plazoSuspension",
      SW_PlazoLiquidacion_
    );
    utilidades.mensaje("Fecha plazo: " + response.data);
  } catch (error) {
    utilidades.mensaje("Plazo - Fallo la conexion " + error);
  } finally {
    $q.loading.hide();
  }
};

onMounted(() => {
  mostrarRoles();
  mostrarAccesos();
  usuario.value = $q.localStorage.getItem("usuarioSilaguas");
});

const iconBoton = computed(() => {
  return accesosRol.value.length > 0 ? "edit" : "save";
});

const accionBoton = computed(() => {
  return accesosRol.value.length > 0
    ? "Modificar Acceso"
    : "Guardar Acceso";
});

const colorBoton = computed(() => {
  return accesosRol.value.length > 0 ? "orange" : "green";
});

const tooltipClass = computed(() => {
  return accesosRol.value.length > 0
    ? "tooltip-editar"
    : "tooltip-guardar";
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
