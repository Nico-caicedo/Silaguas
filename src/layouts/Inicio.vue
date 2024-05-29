<template>
  <q-layout container style="height: 100vh">
    <q-header class="bg-light-blue-9 fixed-top">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="vpn_key" />
        </q-avatar>
        <q-toolbar-title>Silaguas</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container class="row" style="height: 100vh">
      <q-card class="login-card col bg-grey-1 col-xs-10 col-sm-8 vertical-middle rounded-borders">
        <q-card-section align="center" class="q-gutter-sm justify-center q-pa-md">
          <q-separator color="primary" size="1px" />
          <div class="row col justify-center">
            <img class="col-xs-10 col-sm-5 col-md-5" src="~assets/Logo_Sevaf_sin_fondo.png" />
          </div>
          <q-separator color="primary" size="1px" />
          <div class="row col justify-center">
            <q-input v-model="usuario.Login" class="col-xs-12 col-sm col-md" label="Usuario" outlined lazy-rules :rules="[
              (val) => (val && val.length > 0) || 'Falta llenar campo',
            ]" />
          </div>
          <div class="row col justify-center">
            <q-input label="Password" class="col-xs-12 col-sm col-md" v-model="usuario.Password"
              @keydown.enter.prevent="login()" outlined :type="isPwd ? 'password' : 'text'" :rules="[
              (val) => (val !== null && val !== '') || 'Falta llenar campo',
            ]">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </div>
          <div class="row col justify-center q-pt-sm">
            <q-btn label="Login" text-color="white" class="col-xs-12 col-sm col-md bg-primary"
              style="border: 1px dashed white" icon="vpn_key" outline color="primary" align="center" unelevated
              @click="login()" />
          </div>
        </q-card-section>
      </q-card>
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import ADUsuario from "src/commons/Datos/ADUsuarios.js";
import utilidades from "src/commons/utilidades";
import utils from "src/commons/utils";

const $q = useQuasar();
const usuario = ref({ Login: "", Password: "" });
const isPwd = ref(true);

const $router = useRouter();

const login = async () => {
  if (!usuario.value.Login || !usuario.value.Password) {
    utils.Notify("Por favor, complete todos los campos", "error");
    return;
  }
  try {
    $q.loading.show();
    ADUsuario.login(usuario.value).then((response) => {
      var datos = response;
      if (datos.Login === null) {
        $q.loading.hide();
        utils.Notify("Nombre y Password incorrectos", "advertencia");
      } else {
        $q.localStorage.set("usuarioSilaguas", datos);
        ingresar(datos);
      }
      $q.loading.hide();
    });
  } catch (error) {
    utilidades.mensaje("Fail conexion - Autentication " + error);
    $q.loading.hide();
  }
};
const ingresar = (datos) => {
  if (datos.Activo === "0") {
    utilidades.mensaje(
      "El usuario se encuentra inactivo, consulte con el administrador del software"
    );
  }
  if (datos.ModpasspiUsuario === "1") {
    if (datos.NomodpassUsuario === "1") {
      $router.push("/admin");
    } else {
      $router.push("/Administracion/cambioClave");
    }
  } else {
    $router.push("/admin");
  }
};
</script>

<style scoped>
.login-card {
  max-width: 400px;
  margin: auto;
}
</style>
