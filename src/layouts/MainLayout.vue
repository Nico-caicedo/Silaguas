<template>
  <q-layout view="HHh Lpr lFf">
    <q-header elevated class="bg-light-blue-9">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>
          SERVAF S.A. E.S.P.
        </q-toolbar-title>

        <div>Silaguas v 2022.06.29</div>
      </q-toolbar>
    </q-header>

    <!-- <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          <q-chip>
          <q-avatar>
            <img src="~assets/LORENA SANCHEZ ARTUNDUAGA.jpg">
          </q-avatar>
            Lorena Sánchez Artunduaga
        </q-chip>
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-scroll-area style="height: calc(95% - 30px); margin-top: 50px; border-right: 6px solid #ddd">
        <q-list padding>
          <div v-for="mItem in menuElements" :key="mItem.IdAcceso">
            <q-expansion-item
              expand-separator
              :icon="mItem.Icono"
              :label="mItem.Descripcion"
              v-if="mItem.Hijos && !mItem.Aspx"
              :content-inset-level="0.45"
            >
              <q-item v-for="subMenu in mItem.Hijos" :key="subMenu.IdAcceso" clickable v-ripple @click.native="redirect(subMenu.Aspx)">
                <q-item-section avatar>
                  <q-icon :name="subMenu.Icono" />
                </q-item-section>
                <q-item-section >
                  {{subMenu.Descripcion}}
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-item clickable v-ripple v-else @click.native="redirect('/inicio')">
              <q-item-section avatar>
                <q-icon name="exit_to_app" />
              </q-item-section>
              <q-item-section >
                {{mItem.Descripcion}}
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-scroll-area>
      <div class="absolute-top bg-white" style="height: 40px; border-right: 6px solid #0000">
        <div class="text-weight-bold" style="padding:5px">Usuario: {{ Usuario.RazonSocial }}</div>
      </div>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { api } from 'boot/axios'
import utiliades from '../commons/utilidades.js'
import UsuDao from '../commons/Datos/usuariosDAO_.js'



export default {
  name: 'MainLayout',

  data () {
    return {
      usuDao: null,
      leftDrawerOpen: false,
     
      menuElements: [ {IdAcceso: 0, IdModulo: '', Padre: 0, Aspx:'', Descripcion: '', Orden: 0, Icono: '', Estado: 0, Hijos: []} ],
      Usuario: { Login: '', IdRol: '', IdTercero: 0, Password: '', LoginCrea: '', Observacion: '', FIngreso: '', ModPasspi: '', NoModPass: '', PassNoExpire: '', Activo: 0, ProximoCambio: '', PeriodoCambio: 0, Estado: 0, NombreTercero: '', ListaAccesos: [] },
      modulo: { Id: '', Nombre: '' },
      modulos: [
        { Id: 'AD', Nombre: 'ADMINISTRACION' },
        { Id: 'CO', Nombre: 'CORRESPONDENCIA' },
        { Id: 'TO', Nombre: 'TECNICA OPERATIVA' }
      ],
      treeOptions: {
        Hijos: 'Hijos',
        Aspx: 'Aspx',
        Descripcion: 'Descripcion'
      }
    }
  },
  created () {
    this.usuDao = new UsuDao()
    this.Usuario = this.usuDao.traerUsuario()
    if (!this.Usuario) {
      this.$router.push('/')
      return
    } else {
      this.menuElements = this.Usuario.ListaAccesos
    }
    // usuarios.verificarUsuario(this.Usuario.Login, this)
  },
  methods: {
    openURL,
    redirect (path) {
      if (path === undefined || path === '') {
        return
      } else {
        if (path === '/inicio') {
          this.salir()
          return
        }
      }

      this.$router.push(path)
    },
    salir () {
      this.$q.localStorage.remove('usuarioSilaguas')
      this.$q.localStorage.remove('accesosSilaguas')
      this.$router.push('/')
    },
    seleccionarModulo (idModulo) {
      const accesos = UsuDao.traerAccesos()
      this.menuElements = []
      for (const a of accesos) {
        if (a.IdModulo === idModulo) {
          this.menuElements.push(a)
        }
      }
    },
    inicio () {
      const self = this
      const usuario = UsuDao.traerUsuario()
      if (!usuario) {
        this.$router.push('/')
        return
      }
      self.Usuario = usuario
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        const accesos = UsuDao.traerAccesos()
        self.menuElements = accesos
      }, 500)
    }
  }
}
</script>