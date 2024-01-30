<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-green-8">
        <q-toolbar>
            <q-avatar>
                <q-btn flat round dense icon="account_box" />
            </q-avatar>
            <q-avatar>
                <q-btn flat round dense icon="delete" @click="limpiarTercero"/>
            </q-avatar>
            <q-toolbar-title>
              Usuarios del Sistema
            </q-toolbar-title>
            <q-btn flat icon="person_add" label="Todos..." @click="abrirBusqueda()" />
        </q-toolbar>
    </q-header>
    <q-page-container>
        <q-form ref="formCl" @submit="guardarUsu(usuarioAcceso)">
          <div class="q-pa-md">
            <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-12 col-md-12 q-field--with-bottom">
              <q-select
                filled
                v-model="filtroBuscaUsuario"
                map-options emit-value option-value="usuario"
                option-label="RazonSocial"
                :options="listaUsuarios"
                use-input
                hide-dropdown-icon
                hide-selected
                fill-input
                input-debounce="0"
                label="Buscar Usuario"
                @filter="filterFnUsuario"
                @input="val => { cargarUsuario(val) }"
                >
                <template v-slot:prepend>
                <q-icon name="search" size="lg" />
                </template>
                <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section>
                        <q-item-label caption> <b> {{scope.opt.RazonSocial}} </b> </q-item-label>
                        <q-item-label caption>Login: {{scope.opt.Login}} </q-item-label>
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
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 q-field--with-bottom">
                <q-select
                filled
                v-model="filtroBusca"
                map-options emit-value option-value="tercero"
                option-label="Identificacion"
                :options="listaTerceros"
                use-input
                hide-dropdown-icon
                hide-selected
                fill-input
                input-debounce="0"
                label="Buscar Tercero"
                @filter="filterFn"
                @input="val => { cargarTercero(val) }"
                >
                <template v-slot:prepend>
                <q-icon name="person" size="lg" />
                </template>
                <template v-slot:append>
                  <q-btn icon="person_add" color="black" flat dense unelevated @click="agregarPersona" />
                </template>
                <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section>
                        <q-item-label caption> <b> {{scope.opt.RazonSocial}} </b> </q-item-label>
                        <q-item-label caption>Identification: {{scope.opt.Identificacion}} </q-item-label>
                        <q-item-label caption>Id Persona: {{scope.opt.IdTercero}} </q-item-label>
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
            </div>
            <q-input class="col-xs-12 col-md-8 q-field--with-bottom"
                outlined
                readonly
                v-model="tercero.RazonSocial"
                label="Tercero"
            />
            <q-input class="col-xs-12 col-md-4 q-field--with-bottom"
                  outlined
                  v-model="usuarioAcceso.Login"
                  label="Usuario"
                  :rules="[ regla ]"
                >
                <template v-slot:prepend>
                  <q-icon name="account_circle" size="lg" />
                </template>
            </q-input>
            <q-select class="col-xs-12 col-sm-5 col-md-6"
              filled
              v-model="usuarioAcceso.IdRol"
              :rules="[ regla ]"
              map-options emit-value option-value="IdRol"
              option-label="Nombre" :options="listaRoles"
              label="Rol Usuario"
            >
              <template v-slot:prepend>
                <q-icon name="accessibility" size="lg" />
              </template>
            </q-select>
            <q-input class="col-xs-12 col-md-2 q-field--with-bottom"
              outlined
              readonly
              v-model="usuarioAcceso.IdTercero"
              :rules="[ regla ]"
              label="Id Persona"
            />
            <q-input class="col-xs-12 col-md-4 q-field--with-bottom"
              outlined
              readonly
              v-model="usuarioAcceso.LoginCrea"
              label="Creado por"
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key" size="lg" />
              </template>
            </q-input>
            <q-input class="col-xs-12 col-md-4 q-field--with-bottom"
              outlined
              readonly
              type="date"
              v-model="usuarioAcceso.Fecha"
              label="Fecha creado"
            >
              <template v-slot:prepend>
                <q-icon name="date_range" size="lg" />
              </template>
            </q-input>
            <q-input class="col-xs-12 col-md-4 q-field--with-bottom"
              outlined
              readonly
              v-model="usuarioAcceso.ProximoCambio"
              label="Fecha proximo cambio"
            >
              <template v-slot:prepend>
                <q-icon name="date_range" size="lg" />
              </template>
            </q-input>
            <q-input class="col-xs-12 col-md-8 q-field--with-bottom"
              outlined
              v-model="usuarioAcceso.Observacion"
              label="Cargo"
            />
            <q-select class="col-xs-12 col-sm-6 col-md-4"
              filled
              v-model="usuarioAcceso.PeriodoCambio"
              :rules="[ regla ]"
              map-options emit-value
              :options="periodoCambio"
              label="Cambio (meses)"
            >
              <template v-slot:prepend>
                <q-icon name="today" size="lg" />
              </template>
            </q-select>
            <q-toggle class="col-xs-12 col-sm-6 col-md-4"
                v-model="usuarioAcceso.Passnoexpire"
                checked-icon="check"
                :rules="[ regla ]"
                :true-value=true
                :false-value=false
                color="green"
                label="El password no expira"
                unchecked-icon="clear"
            />
  <q-toggle
    class="col-xs-12 col-sm-6 col-md-4"
    v-model="usuarioAcceso.Activo"
    :true-value="1"
    :false-value="0"
    color="green"
    label="Usuario activo en el sistema"
    checked-icon="check"
    unchecked-icon="clear"
  />
            <q-toggle class="col-xs-12 col-sm-6 col-md-4"
                v-model="usuarioAcceso.Nomodpass"
                checked-icon="check"
                :true-value=true
                :false-value=false
                :rules="[ regla ]"
                color="green"
                label="No puede cambiar password"
                unchecked-icon="clear"
            />
            <q-toggle class="col-xs-12 col-sm-6 col-md-4"
                v-model="usuarioAcceso.Modpasspi"
                checked-icon="check"
                :true-value=true
                :false-value=false
                :rules="[ regla ]"
                color="green"
                label="Cambiar password en el proximo inicio"
                unchecked-icon="clear"
            />
            </div>
            <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-12 col-md-3">
                <div class="row justify-center q-pt-sm">
                <q-btn label="Guardar" class="col-xs-12 col-sm-12 col-md-12" icon="save" outline type="submit" align="center" unelevated >
                </q-btn>
                </div>
                <div class="row justify-center q-pa-sm">
                <q-btn label="Restaurar password " icon="vpn_key" outline align="center" unelevated @click="restablecerClave">
                </q-btn>
                </div>
                <div class="row justify-center q-pa-sm">
                <q-btn label="Regresar" icon="replay" class="col-xs-12 col-sm-12 col-md-12" outline align="center" @click="regresar" unelevated v-close-popup>
                </q-btn>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-8">
              <div class="bg-cyan text-white">
                <q-toolbar>
                  <q-btn flat round dense icon="person" />
                  <q-toolbar-title>Usuarios del Sistema</q-toolbar-title>
                </q-toolbar>
              </div>
              <q-list class="col-xs-12 col-sm-12 col-md-8">
                <q-item v-for="usu in listaUsuarios" :key="usu.Login" @click.native="cargarUsuario(usu)" class="q-my-sm" clickable>
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label> <b> {{ usu.RazonSocial }} </b> </q-item-label>
                      <q-item-label>
                          Id Persona: {{ usu.IdTercero }} <br/>
                            Usuario: <b> {{ usu.Login }} </b> <br/>
                            Creado por: {{ usu.LoginCrea }} <br/>
                            Id Rol: {{ usu.IdRol }} <br/>
                            Periodo cambio Password: {{ usu.PeriodoCambio }} <br/>
                            Proximo Cambio: {{ usu.ProximoCambio }} <br/>
                            Fecha creación: {{ usu.Fecha.slice(0, 10) }} <br/>
                            El Password nunca expira: {{ usu.Passnoexpire }} <br/>
                            Activo en el Sistema: {{ usu.Activo }} <br/>
                            No puede cambiar el password: {{ usu.NoModPass }} <br/>
                            Proximo cambio del password: {{ usu.ModPasspi }} <br/>
                            Cargo: {{ usu.Observacion }} <br/>
                      </q-item-label>
                      <q-separator />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-5">
            </div>
            </div>
          </div>
        </q-form>
        <TerceroFiltro ref="busquedaTercero" :onSeleccionTercero="seleccionarTercero" />
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
            <component tercero = @tercero 
              :is="componenteTerceros">
            </component>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script>
import TerceroFiltro from '../../components/CompTerceroFiltro.vue'
import { api } from 'boot/axios'
import utilidades from '../../commons/utilidades.js'
import { date } from 'quasar'
export default {
  name: 'Usuarios',
  data () {
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
  mounted () {
    this.accesos = this.$q.localStorage.getItem('accesosSilaguas')
    const value = this.$q.localStorage.getItem('usuarioSilaguas')
    if (value) {
      this.usuario = value
      // this.limpiarTercero()
    }
    // utilidades.verificarUsuario(this.usuario.Login, this)
  },
  created () {
    this.tercero.Nacimiento = date
    this.tercero.Nacimiento = utilidades.fechaActual()
    this.mostrarRoles(-1)
  },
  components: {
    TerceroFiltro
  },
  methods: {
    abrirBusqueda () {
      this.$refs.busquedaTercero.show()
    },
    seleccionarTercero (tercero) {
      const self = this
      self.$refs.busquedaTercero.hide()
      self.cargarTercero(tercero)
    },
    limpiarTercero () {
      this.tercero = { Id: -1, Identificacion: '', Nombre: '', OtrosNombres: '', Apellido1: '', Apellido2: '', Alias: '', Direccion: '', Telefono: '', Celular: '', Email: '', Web: '', Observaciones: '', Login: this.usuario.LoginUsuario, Modifica: this.usuario.LoginUsuario }
      this.terceroB = this.tercero
      this.usuarioAcceso = { Login: '', Password: '', IdTercero: -1, Nomodpass: false, Modpasspi: false, Passnoexpire: false, Activo: false, Fecha: utilidades.fechaActual() },
      this.listaUsuarios = []
    },
    mostrarTercerosDialog () {
      this.componenteTerceros = () => this.isDialogComponenteTerceros
      this.isDialogComponenteTerceros = true
    },
    abortFilterFn () {
      // console.log('delayed filter aborted')
    },
    filterFn (val, update, abort) {
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
    filterFnUsuario (val, update, abort) {
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
    agregarPersona () {
      this.componentePersonas = () => import('pages/Administracion/Tercero.vue')
      this.isDialogComponentePersonas = true
    },
    buscarPersonaFiltro () {
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
    cargarTercero (ter) {
      this.tercero = ter
      this.mostrarusuarioPersona(ter)
      // this.mostrarListaZonas(usua)
    },
    cargarUsuario (usu) {
      this.usuarioAcceso = usu
      this.NombreTercero = usu.RazonSocial
      this.usuarioAcceso.Fecha = usu.Fecha.slice(0, 10)
      this.usuarioAcceso.Proximocambio = usu.ProximoCambio.slice(0, 10)
    },
    mostrarRoles (idRol) {
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
    verificarUsuairo (loginUsuario) {
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
    guardarUsu (usu) {
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
    guardarusuario () {
      console.log(this.usuarioAcceso)
      const data =  this.usuarioAcceso
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
    modificarusuario () {
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
    convertirFecha () {
      this.usuarioAcceso.FechaUsuario = utilidades.fechaActual()
    },
    regresar () {
      this.$router.push('/admin')
    },
    regla (val) {
      if (val !== null && val !== '' && val !== undefined) {
        return true
      }
      return false || 'Falta completar información'
    },
    mostrarusuarioPersona (persona) {
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
    restablecerClave () {
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
