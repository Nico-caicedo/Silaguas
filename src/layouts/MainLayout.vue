<template>
  <q-layout view="HHh Lpr lFf">

    <q-header elevated class="bg-light-blue-9">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="visibilidadMenu = !visibilidadMenu" />
        <q-toolbar-title>
          SERVAF S.A. E.S.P.
        </q-toolbar-title>
        <div>Silaguas v 2022.06.29</div>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="visibilidadMenu" :mini="ministate" class="F-primary shadow-1" text-color-primary @click.capture="drawerClick" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
      <q-scroll-area class="T-primary" style="height: calc(100% - 60px)">
        <q-list padding>
          <div v-for="mItem in menuElements" :key="mItem.IdAcceso">
            <q-expansion-item expand-separator default-close @click="ministate = false" :icon="mItem.Icono" :label="mItem.Descripcion"
              v-if="mItem.Hijos && !mItem.Aspx" :content-inset-level="0.45">
              <q-item v-for="subMenu in mItem.Hijos" :key="subMenu.IdAcceso" clickable v-ripple
                @click.native="redirect(subMenu.Aspx)">
                <q-item-section avatar>
                  <q-icon :name="subMenu.Icono" size="md" color="grey-7" />
                </q-item-section>
                <q-item-section class="text-bold">
                  {{ subMenu.Descripcion }}
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-separator size=""  color="grey" />
          </div>
        </q-list>
      </q-scroll-area>

      <div class="q-pl-md bg-grey-7 absolute-bottom row items-center text-white justify-between q-gutter-xs"
        style="height: 60px; background-color: var(--primary-c)">
        <q-icon size="md" name="person" class="q-ma-none" color="blue-10" />
        <div v-if="!ministate" class="col q-ma-none row justify-evenly items-center">
          <div class="">
            <p style="font-size: 15px" class="q-ma-none text-blue-2 text-bold">{{ Usuario.RazonSocial }}</p>
            <p style="font-size: 13px" class="q-ma-none">{{ Usuario.IdRol }}</p>
          </div>
          <q-item class="justify-end items-center" clickable @click.native="redirect('/inicio')">
            <q-icon name="exit_to_app" size="md" />
          </q-item>
        </div>
      </div>

      <div class="q-mini-drawer-hide absolute" style="top: 60px; right: -17px">
        <q-btn dense round unelevated color="blue-8" icon="chevron_left" @click="ministate = !ministate" />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import UsuDao from '../commons/Datos/usuariosDAO_.js'

export default {
  name: 'MainLayout',

  setup() {
    const visibilidadMenu = ref(false)
    const ministate = ref(false)
    const usuDao = new UsuDao()

    const menuElements = ref([])
    const Usuario = ref({
      Login: '',
      IdRol: '',
      IdTercero: 0,
      Password: '',
      LoginCrea: '',
      Observacion: '',
      FIngreso: '',
      ModPasspi: '',
      NoModPass: '',
      PassNoExpire: '',
      Activo: 0,
      ProximoCambio: '',
      PeriodoCambio: 0,
      Estado: 0,
      NombreTercero: '',
      ListaAccesos: []
    })

    const modulos = [
      { Id: 'AD', Nombre: 'ADMINISTRACION' },
      { Id: 'CO', Nombre: 'CORRESPONDENCIA' },
      { Id: 'TO', Nombre: 'TECNICA OPERATIVA' }
    ]

    const treeOptions = {
      Hijos: 'Hijos',
      Aspx: 'Aspx',
      Descripcion: 'Descripcion'
    }

    const router = useRouter()

    const traerUsuario = () => {
      const usuario = usuDao.traerUsuario()
      if (!usuario) {
        router.push('/')
        return
      } else {
        Usuario.value = usuario
        menuElements.value = usuario.ListaAccesos
      }
    }

    const redirect = (path) => {
      if (path === undefined || path === '') {
        return
      } else {
        if (path === '/inicio') {
          salir()
          return
        }
      }
      router.push(path)
    }

    const salir = () => {
      localStorage.removeItem('usuarioSilaguas')
      localStorage.removeItem('accesosSilaguas')
      router.push('/')
    }

    const drawerClick = (e) => {
      if (ministate.value) {
        ministate.value = false
        e.stopPropagation()
      }
    }

    return {
      visibilidadMenu,
      ministate,
      menuElements,
      Usuario,
      modulos,
      treeOptions,
      traerUsuario,
      redirect,
      salir,
      drawerClick
    }
  },
  created() {
    this.traerUsuario()
  }
}
</script>
