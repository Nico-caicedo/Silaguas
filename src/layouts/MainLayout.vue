<template>
  <q-layout view="HHh Lpr lFf">
    <q-header elevated class="bg-light-blue-9">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleMenu" />
        <q-toolbar-title> SERVAF S.A. E.S.P. </q-toolbar-title>
        <div>Silaguas v 2022.06.29</div>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="isMenuVisible" :mini="isMini" class="F-primary shadow-1" text-color-primary
      @click.capture="handleDrawerClick" :class="drawerClass">
      <q-scroll-area class="T-primary" style="height: calc(100% - 60px)">
        <q-list padding>
          <div v-for="item in menuElements" :key="item.IdAcceso">
            <q-expansion-item expand-separator default-close @click="closeMini" :icon="item.Icono"
              :label="item.Descripcion" v-if="item.Hijos && !item.Aspx" :content-inset-level="0.45">
              <q-item v-for="subItem in item.Hijos" :key="subItem.IdAcceso" clickable v-ripple
                @click="redirect(subItem.Aspx)">
                <q-item-section avatar>
                  <q-icon :name="subItem.Icono" size="md" color="grey-7" />
                </q-item-section>
                <q-item-section class="text-bold">
                  {{ subItem.Descripcion }}
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-separator size="" color="grey" />
          </div>
        </q-list>
      </q-scroll-area>

      <div class="q-pl-md bg-grey-7 absolute-bottom row items-center text-white justify-between q-gutter-xs"
        style="height: 60px; background-color: var(--primary-c)">
        <q-icon size="md" name="person" class="q-ma-none" color="blue-10" />
        <div v-if="!isMini" class="col q-ma-none row justify-evenly items-center">
          <div>
            <p style="font-size: 15px" class="q-ma-none text-blue-2 text-bold">
              {{ usuario.RazonSocial }}
            </p>
            <p style="font-size: 13px" class="q-ma-none">{{ usuario.IdRol }}</p>
          </div>
          <q-item class="justify-end items-center" clickable @click="redirect('/inicio')">
            <q-icon name="exit_to_app" size="md" />
          </q-item>
        </div>
      </div>

      <div class="q-mini-drawer-hide absolute" style="top: 60px; right: -17px">
        <q-btn dense round unelevated color="blue-8" icon="chevron_left" @click="toggleMini" />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";

import { useRouter } from "vue-router";
import utilidades from "src/commons/utilidades";
import { LocalStorage, Loading, useQuasar } from "quasar";
import ADUsuario from "src/commons/Datos/ADUsuarios.js";

const $q = useQuasar();
const isMenuVisible = ref(false);
const isMini = ref(true);
const menuElements = ref({ IdAcceso: 0, IdModulo: '', Padre: 0, Aspx: '', Descripcion: '', Orden: 0, Icono: '', Estado: 0, Hijos: [] });
const usuario = ref({});

const router = useRouter();

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
};

const toggleMini = () => {
  isMini.value = !isMini.value;
};

const closeMini = () => {
  isMini.value = false;
};

const handleDrawerClick = (e) => {
  if (isMini.value) {
    isMini.value = false;
    e.stopPropagation();
  }
};

const drawerClass = ref(() => {
  return $q.dark.isActive ? "bg-grey-9" : "bg-grey-3";
});

const redirect = (path) => {
  if (!path) return;
  if (path === "/inicio") {
    logout();
  } else {
    router.push(path);
  }
};

const logout = () => {
  LocalStorage.remove("usuarioSilaguas");
  router.push("/");
};

const MostrarAccesos = async (IdRol, modulo) => {
  Loading.value = true;
  try {
    const accesos = await ADUsuario.cargarAccesos(IdRol, modulo);
    menuElements.value = accesos;
  } catch (error) {
    utilidades.mensaje(`Error al obtener el accesos, ${error}`);
  } finally {
    Loading.value = false;
  }
}

onMounted(async () => {
  usuario.value = $q.localStorage.getItem("usuarioSilaguas");

  const IdRol = usuario.value.IdRol;
  const accesos =  await ADUsuario.traerAccesos();
  menuElements.value = accesos;
  // eventBus.on('accesosActualizados', (nuevosAccesos) => {
  //   if (nuevosAccesos) {
  //
  //   }
  // });
  MostrarAccesos(IdRol, -1);
});
</script>
