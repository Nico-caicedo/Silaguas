<template>
  <q-layout container style="height: 92vh">
    <q-header class="bg-green-8 shadow-1">
      <q-toolbar>
        <q-avatar>
          <q-icon size="md" name="person_search" />
        </q-avatar>
        <q-toolbar-title class="text-weight-light ">
          Usuarios del Sistema
        </q-toolbar-title>
        <q-btn label="" icon="replay" color="white" class="ellipsis inset-shadow " outline
          align="center" @click="regresar" v-close-popup />
      </q-toolbar>
    </q-header>
    <q-footer class="q-pa-sm bg-grey-4 shadow-up-3 ">
      <div class="row col q-gutter-xs ">
        <q-btn icon="person_add" label="" @click="abrirBusqueda()" color="purple" outline align="center"
          class="ellipsis col-xs  " />
        <q-btn icon="delete" label="" @click="limpiarTercero" color="red-10" outline align="center"
          class="ellipsis col-xs   " />
        <q-btn label="" color="grey-10" class="ellipsis inset-shadow col-xs "
          icon="vpn_key" outline align="center" @click="restablecerClave" />
      </div>
    </q-footer>


    <q-page-container>
      <q-scroll-area class="T-primary" style="height: calc(92vh - 102px)">
        <q-form ref="formCl" @submit="guardarUsu(usuarioAcceso)">
          <div class="q-pa-sm q-col-gutter-sm">
            <div class="col-grow">
               <div class="row q-col-gutter-sm">
                <q-select filled v-model="filtroBuscaUsuario" class="col-xs-12 col-sm col-md q-field--with-bottom" map-options emit-value
                  option-value="usuario" option-label="RazonSocial" :options="listaUsuarios" use-input
                  hide-dropdown-icon hide-selected fill-input input-debounce="0" label="Buscar Usuario"
                  @filter="filterFnUsuario" @input="val => { cargarUsuario(val) }">
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label caption> <b> {{ scope.opt.RazonSocial }} </b> </q-item-label>
                        <q-item-label caption>Login: {{ scope.opt.Login }} </q-item-label>
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

                <q-select filled model="filtroBusca" class="col-xs-12 col-sm col-md q-field--with-bottom" map-options emit-value
                  option-value="tercero" option-label="Identificacion" :options="listaTerceros" use-input
                  hide-dropdown-icon hide-selected fill-input input-debounce="0" label="Buscar Tercero"
                  @filter="filterFn" @input="val => { cargarTercero(val) }">
                  <template v-slot:prepend>
                    <q-icon name="person" size="lg" />
                  </template>
                  <template v-slot:append>
                    <q-btn icon="person_add" color="black" flat dense unelevated @click="agregarPersona" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label caption> <b> {{ scope.opt.RazonSocial }} </b> </q-item-label>
                        <q-item-label caption>Identification: {{ scope.opt.Identificacion }} </q-item-label>
                        <q-item-label caption>Id Persona: {{ scope.opt.IdTercero }} </q-item-label>
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
                <q-input class="col-xs-12 col-sm col-md q-field--with-bottom" outlined readonly v-model="tercero.RazonSocial"
                  label="Tercero" />
                <q-input class="col-xs-12 col-sm col-md q-field--with-bottom" outlined v-model="usuarioAcceso.Login" label="Usuario"
                  :rules="[regla]">
                  <template v-slot:prepend>
                    <q-icon name="account_circle" size="lg" />
                  </template>
                </q-input>
                <q-select class="col-xs-12 col-sm col-md q-field--with-bottom" filled v-model="usuarioAcceso.IdRol" :rules="[regla]"
                  map-options emit-value option-value="IdRol" option-label="Nombre" :options="listaRoles"
                  label="Rol Usuario">
                  <template v-slot:prepend>
                    <q-icon name="accessibility" size="lg" />
                  </template>
                </q-select>
                <q-input class="col-xs-12 col-sm col-md q-field--with-bottom" outlined readonly v-model="usuarioAcceso.IdTercero"
                  :rules="[regla]" label="Id Persona" />
              </div>



              <div class="row q-gutter-sm">
                <q-input class="col-xs-12 col-sm  col-md q-field--with-bottom" outlined readonly v-model="usuarioAcceso.LoginCrea"
                  label="Creado por">
                  <template v-slot:prepend>
                    <q-icon name="vpn_key" size="lg" />
                  </template>
                </q-input>

                <q-input class="col-xs-12 col-sm col-md q-field--with-bottom" outlined readonly type="date" v-model="usuarioAcceso.Fecha"
                  label="Fecha creado">
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm col-md q-field--with-bottom" outlined readonly v-model="usuarioAcceso.ProximoCambio"
                  label="Fecha proximo cambio">
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
               </div>

              <div class="row q-gutter-sm ">
                <q-input class="col-xs-12 col-sm col-md" outlined v-model="usuarioAcceso.Observacion" label="Cargo" />
                <q-select class="col-xs-12 col-sm col-md" filled v-model="usuarioAcceso.PeriodoCambio"
                  :rules="[regla]" map-options emit-value :options="periodoCambio" label="Cambio (meses)">
                  <template v-slot:prepend>
                    <q-icon name="today" size="lg" />
                  </template>
                </q-select>
              </div>
              <div class="row q-gutter-xs">
                <q-toggle class="ellipsis col-xs-12 col-sm col-md" v-model="usuarioAcceso.Passnoexpire" checked-icon="check"
                  :rules="[regla]" :true-value=true :false-value=false color="green" label="El password no expira"
                  unchecked-icon="clear" />
                <q-toggle class=" ellipsis  col-xs-12 col-sm col-md" v-model="usuarioAcceso.Activo" :true-value="1"
                  :false-value="0" color="green" label="Usuario activo en el sistema" checked-icon="check"
                  unchecked-icon="clear" />
                <q-toggle class="ellipsis  col-xs-12 col-sm col-md" v-model="usuarioAcceso.Nomodpass" checked-icon="check"
                  :true-value="true" :false-value="false" :rules="[regla]" color="green"
                  label="No puede cambiar password" unchecked-icon="clear" />
                <q-toggle class="ellipsis  col-xs-12 col-sm col-md" v-model="usuarioAcceso.Modpasspi" checked-icon="check"
                  :true-value=true :false-value=false :rules="[regla]" color="green"
                  label="Cambiar password en el proximo inicio" unchecked-icon="clear" />
                <q-btn label="Guardar" color="green-10" icon="save" outline type="submit"
                  class="ellipsis col-xs col-sm col-md" />
              </div>

            </div>

            <!-- cuadro para mostrar usuarios-->
            <div class="col-xs col-sm col-md col-xl col-lg">
              <q-separator color="primary"  size="2px" />
              <div :class="['bg-grey', listaUsuarios.length > 0 ? 'bg-blue' : 'bg-grey'], 'text-white'"
                class="inset-shadow">
                <q-toolbar rounded>
                  <q-btn flat round icon="people" />
                  <q-toolbar-title>Usuarios del Sistema</q-toolbar-title>
                </q-toolbar>
              </div>
              <q-separator color="primary" size="2px" />
              <q-list class="col-xs col-sm col-md">

                <template v-if="listaUsuarios.length > 0">
                  <q-scroll-area  style="height: calc(450px - 40px)">
                  <q-item v-for="usu in listaUsuarios" :key="usu.Login" @click.native="cargarUsuario(usu)"
                    clickable rounded-borders>
                    <q-separator color="red" size="3px"/>
                    <q-item-section avatar>
                      <q-icon name="person" color="black" />
                    </q-item-section>
                    <q-separator  vertical />
                    <q-item-section>
                      <q-separator color="grey" size="1px" />
                      <q-item-label class="col text-center text-italic q-pa-sm"> <b> {{ usu.RazonSocial }} </b>
                      </q-item-label>
                      <q-separator color="grey" size="1px" />
                      <q-item-label class="q-pa-md">
                        <div class="row q-gutter-y-xs">
                          <div class="col-xs-6 col-md-2"><b style="color: black;">I</b>d Persona: <b>{{ usu.IdTercero }}</b></div>
                          <div class="col-xs-6 col-md-2"><b style="color: black;">U</b>suario:<b>{{ usu.Login }}</b> </div>
                          <div class="col-xs-6 col-md-2"><b style="color: black;">C</b>reado por: <b>{{ usu.LoginCrea }}</b></div>
                          <div class="col-xs-6 col-md-2"><b style="color: black;">I</b>d Rol: <b>{{ usu.IdRol }}</b></div>
                          <div class="col-xs-6 col-md-2"><b style="color: black;">P</b>eriodo cambio Password: <b>{{ usu.PeriodoCambio }}</b></div>
                          <div class="col-xs-6 col-md-2"><b style="color: black;">P</b>róximo Cambio: <b>{{ usu.ProximoCambio }}</b></div>
                          <div class="col-xs-6 col-md-2"><b style="color: black;">F</b>echa creación: <b>{{ usu.Fecha.slice(0, 10) }}</b></div>
                          <div class="col-xs-6 col-md-2"><b style="color: black;">E</b>l Password nunca expira: <b>{{ usu.Passnoexpire }}</b></div>
                          <div class="col-xs-6 col-md-2"><b style="color: black;">A</b>ctivo en el Sistema: <b>{{ usu.Activo }}</b></div>
                          <div class="col-xs-6 col-md-2"><b style="color: black;">N</b>o puede cambiar el password: <b>{{ usu.NoModPass }}</b></div>
                          <div class="col-xs-6 col-md-2"><b style="color: black;">P</b>róximo cambio del password: <b>{{ usu.ModPasspi }}</b></div>
                          <div class="col-xs-6 col-md-2"><b style="color: black;">C</b>argo: <b>{{ usu.Observacion }}</b></div>
                        </div>
                      </q-item-label>
                      <q-separator color="grey" size="1px" />
                    </q-item-section>
                    <q-separator  vertical />
                  </q-item>
                </q-scroll-area>
                </template>

                <template v-else>
                  <q-item class="col row justify-center items-center bg-white ">
                    <q-item-section class="text-grey-10 justify-center items-center text-bold">
                      Aún no has consultado ningun usuario.
                    </q-item-section>
                  </q-item>
                </template>

              </q-list>
            </div>

          </div>

        </q-form>

        <!-- componente tercero -->
        <TerceroFiltro ref="busquedaTercero" :onSeleccionTercero="seleccionarTercero" />

        <!-- componenet dialog -->
        <q-dialog v-model="isDialogComponenteTerceros" style="max-width: 650px" :maximized="true">
          <q-card>
            <q-bar>
              <div>componentePersonas</div>
              <q-space />
              <q-btn dense flat icon="close" v-close-popup>
                <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
              </q-btn>
            </q-bar>
            <q-card-section>
              <component tercero=@tercero :is="componenteTerceros">
              </component>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-scroll-area>
    </q-page-container>
  </q-layout>
</template>

<script>
import TerceroFiltro from '../../components/CompTerceroFiltro.vue'
import { api } from 'boot/axios'
import utilidades from '../../commons/utilidades.js'
import UsuDao from '../../commons/Datos/usuariosDAO_.js';
import { date } from 'quasar'
export default {
  name: 'Usuarios',
  data() {
    return {
      usuarioAcceso: { Login: '', Password: '', IdTercero: -1, NombreTercero: '', Nomodpass: false, Modpasspi: false, Passnoexpire: false, Activo: false, Fecha: utilidades.fechaActual() },
      usuarioB: {},
      tercero: { IdTercero: -1, Nombre: '', CodigoMunicipio: '', IdDepartamento: '', IdTiid: '', Sexo: '', Dv: -1, Nacimiento: '19010101 00:00', OtrosNombres: '', Apellido1: '', Apellido2: '', Alias: '', Direccion: '', Telefono: '', Celular: '', Email: '', Web: '', Observaciones: '' },
      usuario: { Login: '', IdRol: '', IdTercero: -1, Password: '', LoginCrea: '', Observacion: '', FIngreso: '', ModPasspi: '', NoModPass: 0, PassNoExpire: 0, Activo: 0, ProximoCambio: '', PeriodoCambio: 0, Estado: 0, RazonSocial: '' },
      roles: [],
      periodoCambio: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      filtroBusca: '',
      filtroBuscaUsuario: '',
      listaTerceros: [],
      listaUsuarios: [],
      listaPersonas: [],
      listaRoles: [],
      componenteTerceros: null,
      isDialogComponenteTerceros: false,
      selected: []
    }
  },
  mounted() {
    this.accesos = this.$q.localStorage.getItem('accesosSilaguas')
    const value = this.$q.localStorage.getItem('usuarioSilaguas')
    if (value) {
      this.usuario = value
      // this.limpiarTercero()
    }
    // UsuDao.verificarUsuario(this.usuario.Login, this)
  },
  created() {
    this.tercero.Nacimiento = date
    this.tercero.Nacimiento = utilidades.fechaActual()
    this.mostrarRoles(-1)
  },
  components: {
    TerceroFiltro
  },
  methods: {
    abrirBusqueda() {
      this.$refs.busquedaTercero.show()
    },
    seleccionarTercero(tercero) {
      const self = this
      self.$refs.busquedaTercero.hide()
      self.cargarTercero(tercero)
    },
    limpiarTercero() {
      this.tercero = { Id: -1, Identificacion: '', Nombre: '', OtrosNombres: '', Apellido1: '', Apellido2: '', Alias: '', Direccion: '', Telefono: '', Celular: '', Email: '', Web: '', Observaciones: '', Login: this.usuario.LoginUsuario, Modifica: this.usuario.LoginUsuario }
      this.terceroB = this.tercero
      this.usuarioAcceso = { Login: '', Password: '', IdTercero: -1, Nomodpass: false, Modpasspi: false, Passnoexpire: false, Activo: false, Fecha: utilidades.fechaActual() },
        this.listaUsuarios = []
    },
    mostrarTercerosDialog() {
      this.componenteTerceros = () => this.isDialogComponenteTerceros
      this.isDialogComponenteTerceros = true
    },
    abortFilterFn() {
      // console.log('delayed filter aborted')
    },
    filterFn(val, update, abort) {
      if (val.length === 0) {
        abort()
        return
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        api.get(`/tercero/mostrarTerceroFiltroGral/${val}`)
          .then((response) => {
            update(() => {
              this.listaTerceros = response.data
              this.$q.loading.hide()
            })
          })
          .catch((error) => {
            utilidades.mensaje('Fallo la conexion ' + error)
            this.$q.loading.hide()
          })
      }, 500)
    },
    filterFnUsuario(val, update, abort) {
      if (val.length === 0) {
        abort()
        return
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        api.get(`/usuario/usuariosFiltro/${val}`)
          .then((response) => {
            update(() => {
              this.listaUsuarios = response.data
              this.$q.loading.hide()
            })
          })
          .catch((error) => {
            utilidades.mensaje('Fallo la conexion ' + error)
            this.$q.loading.hide()
          })
      }, 500)
    },
    agregarPersona() {
      this.componentePersonas = () => import('pages/Administracion/Tercero.vue')
      this.isDialogComponentePersonas = true
    },
    buscarPersonaFiltro() {
      const self = this
      self.listaPersonas = []
      self.$q.loading.show()
      api.post('/tercero/mostrarFiltro', this.tercero)
        .then((response) => {
          self.listaPersonas = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Mostrar Filtro - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    cargarTercero(ter) {
      this.tercero = ter
      this.mostrarusuarioPersona(ter)
      // this.mostrarListaZonas(usua)
    },
    cargarUsuario(usu) {
      this.usuarioAcceso = usu
      this.NombreTercero = usu.RazonSocial
      this.usuarioAcceso.Fecha = usu.Fecha.slice(0, 10)
      this.usuarioAcceso.Proximocambio = usu.ProximoCambio.slice(0, 10)
    },
    mostrarRoles(idRol) {
      const self = this
      self.$q.loading.show()
      api.get(`/usuario/roles/${idRol}`)
        .then((response) => {
          self.listaRoles = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Roles - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    verificarUsuairo(loginUsuario) {
      const self = this
      self.$q.loading.show()
      api.get(`/usuario/verificacion/${loginUsuario}`)
        .then((response) => {
          self.usuarioB = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Verificar Usuario - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    guardarUsu(usu) {
      // const login = this.usuarioAcceso.loginUsuario
      this.verificarUsuairo(this.usuarioAcceso.Login)
      this.usuarioAcceso.Modifica = this.usuario.Login
      this.usuarioAcceso.Logincrea = this.usuario.Login
      this.usuarioAcceso.EstadoUsuario = 1
      if (this.usuarioB.IdTercero > 0) {
        this.modificarusuario()
      } else {
        this.guardarusuario()
      }
    },
    guardarusuario() {
      console.log(this.usuarioAcceso)
      const data = this.usuarioAcceso
      const self = this
      var resultado = 0
      self.$q.loading.show()
      api.post('/usuario/guardarUsuario', data)
        .then((response) => {
          resultado = response.data
          if (resultado > 0) {
            this.cargarPersona(this.tercero)
            utilidades.mensaje('usuario guardado con éxito')
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Guardar Usuario - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    modificarusuario() {
      const self = this
      self.$q.loading.show()
      api.post('/usuario/modificaUsuario/', this.usuarioAcceso)
        .then((response) => {
          self.$q.loading.hide()
          utilidades.mensaje('usuario modificado con éxito')
        })
        .catch((error) => {
          utilidades.mensaje('Modificar Usuario - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    convertirFecha() {
      this.usuarioAcceso.FechaUsuario = utilidades.fechaActual()
    },
    regresar() {
      this.$router.push('/admin')
    },
    regla(val) {
      if (val !== null && val !== '' && val !== undefined) {
        return true
      }
      return false || 'Falta completar información'
    },
    mostrarusuarioPersona(persona) {
      const self = this
      self.limpiarTercero()
      self.tercero = persona
      self.usuarioAcceso.LogincreaUsuario = this.usuario.Login
      self.usuarioAcceso.FechaUsuario = utilidades.fechaActual()
      var IdTercero = -1
      if (self.tercero.IdTercero > 0) {
        IdTercero = self.tercero.IdTercero
        this.usuarioAcceso.IdTercero = self.tercero.IdTercero
      } else {
        IdTercero = -1
      }
      self.$q.loading.show()
      api.get(`/usuario/usuariosIdTercero/${IdTercero}`)
        .then((response) => {
          self.listaUsuarios = response.data
          if (self.listaUsuarios.length > 0) {
            this.cargarUsuario(self.listaUsuarios[0])
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    restablecerClave() {
      const self = this
      this.$q.dialog({
        title: 'Silaguas',
        dark: true,
        message: 'Está seguro de restaurar la contraseña del usuario ' + this.usuarioAcceso.Login + '?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        self.$q.loading.show()
        self.usuarioAcceso.Password = '1234'
        api.post('/usuario/modificaPassword', this.usuarioAcceso)
          .then((response) => {
            var datos = response.data
            if (datos > 0) {
              utilidades.mensaje('La contraseña ha sido restaurada con éxito')
            } else {
              utilidades.mensaje('La contraseña no fue restaurada, comuniquese con el administrador')
            }
            self.$q.loading.hide()
          })
          .catch((error) => {
            utilidades.mensaje('Fallo la conexion ' + error)
            self.$q.loading.hide()
          })
      }).onCancel(() => {
      })
    }
  }
}
</script>
<style>
.bg-blue {
  background-color: blue;
}
</style>
