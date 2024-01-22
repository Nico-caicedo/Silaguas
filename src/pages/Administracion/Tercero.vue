<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-green-8">
        <q-toolbar>
            <q-avatar>
                <q-btn flat round dense icon="account_box" @click="abrirBusqueda()"/>
            </q-avatar>
            <q-avatar>
                <q-btn flat round dense icon="delete" @click="limpiarTercero"/>
            </q-avatar>
            <q-toolbar-title>
              Información Terceros
            </q-toolbar-title>
            <q-btn flat icon="person_add" label="Terceros" />
        </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="guardarCambios">
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm">
            <q-input class="col-xs-12 col-md-2 q-field--with-bottom"
              filled
              v-model="tercero.IdTercero"
              type="number"
              label="IdTercero"
              readonly
            />
            <q-input class="col-xs-12 col-md-4 q-field--with-bottom"
              filled
              v-model="tercero.Identificacion" @blur="cargarDatosIdentificacion"
              type="number"
              label="Identificacion"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'You must enter an identification']"
            />
            <q-select class="col-xs-12 col-md-4 q-field--with-bottom"
              outlined
              map-options emit-value option-value="IdTipoIdentificacion"
              option-label="Nombre"
              :rules="[ regla ]"
              v-model="tercero.IdTipoIdentificacion" :options="tipoId"
              label="Tipo Identificación" />
            <q-input class="col-xs-12 col-md-2 q-field--with-bottom"
              outlined
              readonly
              v-model="tercero.DV"
              label="DV" />
            <q-input class="col-xs-12 col-md-12 q-field--with-bottom"
              outlined
              v-model="tercero.RazonSocial"
              label="Razon Social"
              lazy-rules
              v-if="tercero.IdTipoIdentificacion == 'NIT'"
              :rules="[ val => val && val.length > 0 || 'Tipo Identificacion']"
            />
            <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
              outlined
              v-model="tercero.Nombre"
              label="Nombre"
              lazy-rules
              v-if="tercero.IdTipoIdentificacion != 'NIT'"
              :rules="[ val => val && val.length > 0 || 'Tipo Identificacion']"
            />
            <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
              outlined
              v-model="tercero.OtrosNombres"
              label="Otros nombres"
              v-if="tercero.IdTipoIdentificacion != 'NIT'"
            />
            <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
              outlined
              v-model="tercero.Apellido1"
              label="Primer Apellido"
              lazy-rules
              v-if="tercero.IdTipoIdentificacion != 'NIT'" :rules="[ val => val && val.length > 0 || 'Debe ingresar Apellido 1']"
            />
            <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
              outlined
              v-model="tercero.Apellido2"
              label="Segundo Apellido"
              v-if="tercero.IdTipoIdentificacion != 'NIT'"
            />
            <q-select class="col-xs-12 col-md-4 q-field--with-bottom"
            outlined
            filled
            :rules="[ regla ]"
            v-model="tercero.Sexo"
            map-options emit-value option-value="id"
            option-label="nombre" :options="sexo"
            label="Sexo">
              <template v-slot:prepend>
                <q-icon name="wc" size="lg" />
              </template>
            </q-select>
            <q-input class="col-xs-12 col-md-4 q-field--with-bottom"
              outlined
              stack-label
              :rules="[ regla ]"
              v-model="tercero.Nacimiento"
              type="date"
              label="Fecha de Nacimiento"
            >
              <template v-slot:prepend>
                <q-icon name="date_range" size="lg" />
              </template>
            </q-input>
            <q-input class="col-xs-12 col-md-4 q-field--with-bottom"
              outlined
              v-model="tercero.Alias"
              label="Alias"
            />
            <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
              outlined
              v-model="tercero.CodigoDepartamento"
              map-options emit-value option-value="CodigoDepartamento"
              option-label="Nombre"
              :options="listaDepartamentos"
              :rules=" [regla] "
              @input="val => { seleccionarDepartamento(val) }"
              label="Departamento"
            >
            <template v-slot:prepend>
            <q-icon name="list_alt" size="lg" />
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label caption><b> {{ scope.opt.Nombre }} </b></q-item-label>
                  <q-item-label caption>Código Departamento: {{ scope.opt.CodigoDepartamento }}</q-item-label>
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
            <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
            outlined
            v-model="tercero.CodigoMunicipio"
            map-options emit-value option-value="CodigoMunicipio"
            option-label="Nombre"
            :options="listaMunicipios"
            :rules=" [regla] "
            label="Municipio"
            >
            <template v-slot:prepend>
              <q-icon name="location_city" size="lg" />
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label caption><b> {{ scope.opt.Nombre }} </b></q-item-label>
                  <q-item-label caption>Código Municipio: {{ scope.opt.CodigoMunicipio }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            </q-select>
            <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
              outlined
              v-model="tercero.Direccion"
              label="Direccion"
            />
            <q-input class="col-xs-12 col-md-3 q-field--with-bottom"
              outlined
              type="number"
              v-model="tercero.Telefono"
              label="Telefono"
            />
            <q-input class="col-xs-12 col-md-3 q-field--with-bottom"
              outlined
              type="number"
              v-model="tercero.Celular"
              label="Mobile"
            />
            <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
              outlined
              v-model="tercero.Email"
              label="Email"
            />
            <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
              outlined
              v-model="tercero.Web"
              label="Pagina Web"
            />
            <q-input class="col-xs-12 col-md-12 q-field--with-bottom"
              outlined
              type="textarea"
              v-model="tercero.Observacion"
              label="Observaciones"
            />
            <div class="row justify-center q-pa-sm">
              <q-btn label="Guardar" icon="save" type="submit" outline align="center" unelevated @submit="guardarCambios" >
              </q-btn>
            </div>
            <div class="row justify-center q-pa-sm">
              <q-btn label="Regresar" icon="arrow_back" outline align="center" unelevated @click="regresar" >
              </q-btn>
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
  name: 'Tercero',
  data () {
    return {
      tercero: { IdPersona: -1, IdEmpresa: 1, Nombre: '', CodigoMunicipio: '', CodigoDepartamento: '', IdTipoIdentificacion: '', Sexo: '', DV: -1, Nacimiento: utilidades.fechaActual(), OtrosNombres: '', Apellido1: '', Apellido2: '', Alias: '', Direccion: '', Telefono: '', Celular: '', Email: '', Web: '', Observacion: '', Login: '' },
      cliente: { IdCliente: -1, Id: 0, IdEmpresa: 0, IdTipoContribuyente: '', Codigo: '', RazonSocial: ' ', Sigla: '', Observacion: '', Login: '', EnvioCorreo: 0, Credito: 0, Fe: 0, Estado: 1 },
      listaPrecioArticulos: [],
      grupoListaPrecios: [],
      listaPrecios: [],
      ColumListaPrecios: [
        // { name: 'Seleccionar_listaprecio', label: 'Acceso', required: true, field: 'Seleccionar_listaprecio', sortable: true },
        {
          name: 'Id_listaprecio',
          required: true,
          label: 'Id',
          field: 'Id_listaprecio',
          sortable: true
        },
        { name: 'Nombre_listaprecio', align: 'left', label: 'Nombre', field: 'Nombre_listaprecio', sortable: true }
      ],
      terceroB: { IdTercero: -1, Nombre: '', CodigoMunicipio: '', CodigoDepartamento: '', IdTipoIdentificacion: '', Sexo: '', DV: -1, Nacimiento: utilidades.fechaActual(), Otrosnombres: '', Apellido1: '', Apellido2: '', Alias: '', Direccion: '', Telefono: '', Celular: '', Email: '', Web: '', Observacion: '' },
      envioCoreo: [
        { id: 1, nombre: 'SI' },
        { id: 0, nombre: 'NO' }
      ],
      creditoCliente: [
        { id: 1, nombre: 'SI' },
        { id: 0, nombre: 'NO' }
      ],
      facturaElectronica: [
        { id: 1, nombre: 'SI' },
        { id: 0, nombre: 'NO' }
      ],
      usuario: { Login: '', Password: '', IdTercero: -1, NombreTercero: '', Nomodpass: '0', Modpasspi: '0', Passnoexpire: '0', Activo: '0', Fecha: utilidades.fechaActual() },
      sexo: [
        { id: 'M', nombre: 'Masculino' },
        { id: 'F', nombre: 'Femenino' },
        { id: 'I', nombre: 'Prefiero no decirlo' }
      ],
      tipoContribuyente: [
        { id: 'PN', nombre: 'Persona Natural' },
        { id: 'PJ', nombre: 'Persona Jurídica' }
      ],
      filtroBusca: '',
      listaTercero: [],
      listaClientes: [],
      listaPersonas: [],
      lisTipocontribuyente: [],
      listaDepartamentos: [],
      listaMunicipios: [],
      tipoId: [],
      componentePersonas: null,
      isDialogComponentePersonas: false,
      isDialogComponenteTerceros: false,
      componenteTerceros: null,
      selected: []
    }
  },
  mounted () {
    this.tercero = this.$props
    const value = this.$q.localStorage.getItem('usuarioSilaguas')
    if (value) {
      this.usuario = value
      this.limpiarTercero()
      this.cliente.Login = this.usuario.Login
      this.cliente.IdEmpresa = 1
    }
  },
  created () {
    this.mostrarListaDepartamentos()
    this.mostrarTipoIdentificacion('-1', '-1')
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
      self.seleccionarPersona(tercero) // .cargarTercero(tercero)
    },
    cargarTercero (ter) {
      this.tercero = ter
      // this.nombrePersona = ter.Nombre + ' ' + ter.OtrosNombres + ' ' + ter.Apellido1 + ' ' + ter.Apellido2
      // this.mostrarusuarioPersona(ter)
      // this.mostrarListaZonas(usua)
    },
    limpiarTercero () {
      this.tercero = { IdPersona: -1, IdEmpresa: 1, Nombre: '', CodigoMunicipio: '', CodigoDepartamento: '', IdTipoIdentificacion: '', Sexo: '', DV: -1, Nacimiento: '', OtrosNombres: '', Apellido1: '', Apellido2: '', Alias: '', RazonSocial: '', Direccion: '', Telefono: '', Celular: '', Email: '', Web: '', Observacion: '', Login: '' }
      this.terceroB = this.tercero
      this.listaPersonas = []
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
        api.get(`/tercero/cliente/${val}`)
          .then((response) => {
            update(() => {
              this.listaClientes = response.data
              this.$q.loading.hide()
            })
          })
          .catch((error) => {
            utilidades.mensaje('Fallo la conexion ' + error)
            this.$q.loading.hide()
          })
      }, 500)
    },
    seleccionarPersona (persona) {
      this.tercero = persona
      this.$emit('tercero', persona)
      for (var i = 0; i < this.listaDepartamentos.length; i++) {
        for (var m = 0; m < this.listaDepartamentos[i].ListaMunicipios.length; m++) {
          if (this.listaDepartamentos[i].ListaMunicipios[m].CodigoMunicipio === this.tercero.CodigoMunicipio) {
            this.tercero.CodigoDepartamento = this.listaDepartamentos[i].CodigoDepartamento
            this.seleccionarDepartamento(this.tercero.CodigoDepartamento)
            this.tercero.CodigoMunicipio = this.listaDepartamentos[i].ListaMunicipios[m].CodigoMunicipio
            this.calcularDV()
            this.convertirFecha()
            // this.mostrarClientes()
            return
          }
        }
      }
    },
    cargarDatosIdentificacion () {
      const self = this
      if (self.tercero.Identificacion === '' || self.tercero.Identificacion === undefined) {
        return
      }
      const identificacion = self.tercero.Identificacion
      self.terceroB = {}
      self.$q.loading.show()
      api.get(`/tercero/mostrarIdentificacion/${identificacion}`)
        .then((response) => {
          self.terceroB = response.data
          self.$q.loading.hide()
          if (self.terceroB.IdTercero > 0) {
            self.seleccionarPersona(self.terceroB)
          } else {
            self.limpiarTercero()
            self.tercero.Identificacion = identificacion
            self.calcularDV()
            self.$q.loading.hide()
          }
        })
        .catch((error) => {
          utilidades.mensaje('Buscar Identificacion - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    guardar () {
      const self = this
      self.$q.loading.show()
      self.tercero.Login = self.usuario.Login
      api.post('/tercero/guardar/', this.tercero)
        .then((response) => {
          self.terceroB = response.data
          if (self.terceroB.IdTercero > 0) {
            utilidades.mensaje('Tercero guardado con éxito')
            this.tercero = this.terceroB
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    modificar () {
      const self = this
      self.tercero.Login = self.usuario.Login
      self.$q.loading.show()
      api.post('/tercero/modificar/', this.tercero)
        .then((response) => {
          if (response.data > 0) {
            utilidades.mensaje('Persona modificada con éxito')
            self.limpiarTercero()
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    guardarCambios () {
      const self = this
      let resultado = true
      if (self.tercero.IdTercero > 0) {
      
        self.$q.dialog({
          title: 'Silaguas',
          dark: true,
          message: 'Está seguro de modificar los datos del tercero?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          self.modificar()
        }).onCancel(() => {
        })
      } else {
        self.$q.dialog({
          title: 'Silaguas',
          dark: true,
          message: 'Está seguro de crear el tercero?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          self.guardar()
        }).onCancel(() => {
        })
      }
    },
    guardarCl () {
      this.cliente.Login_cliente = this.usuario.Login
      this.cliente.Id_empresa = 2
      if (this.cliente.Id_cliente > 0) {
        this.modificarCliente()
      } else {
        this.cliente.Id = this.tercero.Id
        this.guardarCliente()
      }
    },
    guardarCliente () {
      const self = this
      self.$q.loading.show()
      api.post('/tercero/guardarCliente/', this.cliente)
        .then((response) => {
          this.cliente = response.data
          if (this.cliente.Id_cliente > 0) {
            this.listaClientes.push(this.cliente)
            // this.cliente = {}
            // this.selected = []
            utilidades.mensaje('Cliente guardado con éxito')
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    modificarCliente () {
      const self = this
      this.cliente.ListaPrecioAccesos = this.selected
      self.$q.loading.show()
      api.post('/tercero/modificarCliente/', this.cliente)
        .then((response) => {
          this.cliente = {}
          this.selected = []
          self.$q.loading.hide()
          utilidades.mensaje('Cliente modificado con éxito')
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    convertirFecha () {
      if (this.tercero.Nacimiento !== '') {
        var fecha = this.tercero.Nacimiento // Fecha actual
        this.tercero.Nacimiento = fecha.slice(0, 10)
      }
    },
    regresar () {
      this.$router.push('/admin')
    },
    calcularDigitoVerificacion (myNit) {
      var vpri
      var x
      var y
      var z
      // Se limpia el Nit
      myNit = myNit.replace(/\s/g, '') // Espacios
      myNit = myNit.replace(/,/g, '') // Comas
      myNit = myNit.replace(/\./g, '') // Puntos
      myNit = myNit.replace(/-/g, '') // Guiones

      // Se valida el nit
      if (isNaN(myNit)) {
        utilidades.mensaje('El nit/cédula ' + myNit + ' no es válido(a).')
        return
      }

      // Procedimiento
      vpri = new Array(16)
      z = myNit.length

      vpri[1] = 3
      vpri[2] = 7
      vpri[3] = 13
      vpri[4] = 17
      vpri[5] = 19
      vpri[6] = 23
      vpri[7] = 29
      vpri[8] = 37
      vpri[9] = 41
      vpri[10] = 43
      vpri[11] = 47
      vpri[12] = 53
      vpri[13] = 59
      vpri[14] = 67
      vpri[15] = 71

      x = 0
      y = 0
      for (var i = 0; i < z; i++) {
        y = (myNit.substr(i, 1))
        // console.log ( y + "x" + vpri[z-i] + ":" ) ;

        x += (y * vpri[z - i])
        // console.log ( x ) ;
      }

      y = x % 11
      // console.log ( y ) ;

      return (y > 1) ? 11 - y : y
    },

    // Calcular
    calcularDV () {
      // Verificar que haya un numero
      const self = this
      const nit = self.tercero.Identificacion
      const isNitValid = nit.length

      // Si es un número se calcula el Dígito de Verificación
      if (isNitValid > 0) {
        self.tercero.DV = self.calcularDigitoVerificacion(nit)
      }
    },
    mostrarListaDepartamentos () {
      const self = this
      self.$q.loading.show()
      api.get('/usuario/mostrarDepartamentosMunicipios')
        .then((response) => {
          self.listaDepartamentos = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Departamentos - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    seleccionarDepartamento (CodDepartamento) {
      this.tercero.CodigoMunicipio = ''
      for (var m = 0; m < this.listaDepartamentos.length; m++) {
        if (this.listaDepartamentos[m].CodigoDepartamento === CodDepartamento) {
          this.listaMunicipios = this.listaDepartamentos[m].ListaMunicipios
          return
        }
      }
    },
    mostrarTipoIdentificacion (idTi, nombreTi) {
      const self = this
      self.$q.loading.show()
      api.get(`/tercero/tipoIdFiltro/${idTi}/${nombreTi}`)
        .then((response) => {
          self.tipoId = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Tipo Identificacion - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    regla (val) {
      if (val !== null && val !== '' && val !== undefined) {
        return true
      }
      return false || 'Missing complete information'
    }
  }
}
</script>
