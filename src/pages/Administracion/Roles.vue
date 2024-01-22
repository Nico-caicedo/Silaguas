<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-green-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="pages" />
        </q-avatar>
        <q-toolbar-title>Roles</q-toolbar-title>
        <q-btn flat icon="contacts" label="Usuarios" @click="abrirVentanaUsuarioRol" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div class="q-pa-md">
        <q-select class="col-xs-12 col-sm-6 col-md-4" stack-label label="Roles" v-model="idRol" emit-value map-options option-value="IdRol"
          option-label="Nombre" :options="roles" outlined  @input="val => { mostrarAccesosTrue(val, '-1') }">
          <template v-slot:prepend>
            <q-icon name="verified" />
          </template>
          <template v-slot:append>
            <q-btn icon="alarm_add" size="lg" color="blue" flat dense unelevated @click="isDialogComponenteRol=true" />
          </template>
        </q-select>
      </div>
      <div class="q-pa-md">
        <q-tree class="col-12 col-sm-12"
          :nodes="accesos" label-key="Descripcion"
          :expand-on-click="false"
          icon="settings"
          node-key="IdAcceso" children-key="Hijos"
          tick-strategy="leaf"
          :ticked.sync="accesosSeleccion"
          
        >
          <template v-slot="{ node }">
            <q-tree-node
              :key="node.IdAcceso"
              :label="node.Descripcion"
              :icon="node.Icono"
              @click.native="navigateToView(node.Aspx)"
              clickable
            />
          </template>
        </q-tree>
      </div>
      <div class="row justify-center q-pa-sm">
        <q-btn label="Actualizar Accesos" icon="update" outline align="center" unelevated @click="guardar" >
        </q-btn>
        <q-btn label="Plazo Suspension" icon="update" outline align="center" unelevated @click="guardarPlazo" >
        </q-btn>
      </div>
    </q-page-container>
    <q-dialog v-model="isDialogComponenteRol" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Agregar nuevo rol</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense v-model="rol.IdRol" autofocus label="IdRol" />
          <q-input dense v-model="rol.Nombre" @keyup.enter="isDialogComponenteRol = false" label="Nombre Rol" />
          <q-input dense v-model="rol.Observacion" label="Observacion" />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Agregar Rol" @click="guardarRol()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isDialogComponenteUsuarios" style="max-width: 500px" :maximized="true">
      <q-card>
        <q-bar>
          <div>Componente</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <component :is="componenteusuarios"></component>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<style lang="stylus">
</style>

<script>
import { openURL } from 'quasar'
import { api } from 'boot/axios'
import utilidades from '../../commons/utilidades.js'
export default {
  data () {
    return {
      roles: [],
      rol: { IdRol: '', Nombre: '', Observacion: '', Login: '', Fecha: '' },
      accesos: [],
      accesosSeleccion: [],
      accesosRol: [],
      nuevoAccesos: [],
      idRol: '',
      usuario: { Login: '', Password: '', IdPersona: -1, Nomodpass: null, Passnoexpire: null, Activo: null },
      usuarios: [],
      usuariosFiltro: [],
      usuarioRol: { IdUsuario: null, IdRol: null },
      componenteusuarios: null,
      isDialogComponenteUsuarios: false,
      isDialogComponenteRol: false
    }
  },
  created () {
    this.mostrarRoles(-1)
    this.mostrarAccesos('-1')
    this.usuario = this.$q.localStorage.getItem('usuarioSilaguas')
  },
  methods: {
    openURL,
    navigateToView(viewName) {
      this.$router.push({ name: viewName });
    },
    guardarRol () {
      const self = this
      self.rol.IdRol = self.rol.IdRol.toLocaleUpperCase()
      self.rol.Nombre = self.rol.Nombre.toLocaleUpperCase()
      self.rol.Login = self.usuario.Login
      self.$q.loading.show()
      api.post('/usuario/guardarRol/', self.rol)
        .then((response) => {
          // self.roles = response.data
          self.roles.push(self.rol)
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Roles - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    abrirVentanaUsuarioRol () {
      this.componenteusuarios = () => import('pages/Administracion/AdminUsuarios.vue')
      this.isDialogComponenteUsuarios = true
    },
    mostrarRoles (idRol) {
      const self = this
      self.$q.loading.show()
      api.get(`/usuario/roles/${idRol}`)
        .then((response) => {
          self.roles = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Roles - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    mostrarAccesos (IdModulo) {
      const self = this
      self.$q.loading.show()
      self.accesosSeleccion = []
      api.get(`/usuario/AccesosIdModulo/${IdModulo}`)
        .then((response) => {
          self.accesos = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Accesos - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    guardar () {
      const self = this
      this.nuevoAccesos = []

      if (self.accesosSeleccion.length > 0) {
        self.accesosSeleccion.forEach(function (acceso) {
          const ac = self.accesosRol.find(f => f.IdAcceso === acceso)
          if (ac) {
            ac.EstadoRolacceso = 1
          } else {
            self.nuevoAccesos.push({ IdAcceso: acceso, IdRol: self.idRol, Login: self.usuario.Login, Estado: 1 })
          }
        })
      }

      if (self.accesosRol.length > 0) {
        self.accesosRol.forEach(function (acceso) {
          const ac = self.accesosSeleccion.find(f => f === acceso.IdAcceso)
          if (ac) {
          } else {
            self.nuevoAccesos.push({ IdAcceso: acceso.IdAcceso, IdRol: self.idRol, Login: self.usuario.Login, Estado: 0 })
          }
        })
      }

      self.$q.loading.show()
      api.post('/usuario/guardarRolAccesos', self.nuevoAccesos)
        .then((response) => {
          utilidades.mensaje('Accesos Actualizados con exito')
          self.$q.loading.hide()
          // self.listarVistas(self.idRol)
        })
        .catch((error) => {
          utilidades.mensaje('Actualizar Accesos - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    guardarPlazo () {
      const self = this
      const SW_PlazoLiquidacion_ = { Usuario: 900166906, Clave: 'Credidatos2023@', IdPlazoLiquidacion: 0, IdLiquidacion: 0, IdUsuario: 0, FechaCreacion: '', FechaPlazo: '', Codigo: 1049 }

      self.$q.loading.show()
      api.post('/plazoLiquidacion/plazoSuspension', SW_PlazoLiquidacion_)
        .then((response) => {
          utilidades.mensaje('Fecha plazo: ' + response.data)
          self.$q.loading.hide()
          // self.listarVistas(self.idRol)
        })
        .catch((error) => {
          utilidades.mensaje('Plazo - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    mostrarAccesosTrue (idRol, idModulo) {
      const self = this
      self.accesosSeleccion = []
      self.$q.loading.show()
      api.get(`/usuario/accesos/${idRol}/${idModulo}`)
        .then((response) => {
          self.accesosRol = response.data
          self.accesosRol.forEach(function (acceso) {
            self.accesosSeleccion.push(acceso.IdAcceso)
          })
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    }
  }
}
</script>
