<template>
  <q-dialog v-model="isDialog" class="q-pa-md" style="max-width: 650px">
    <q-card>
          <q-bar>
            <div>Buscar terceros por filtro</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <div class="q-pa-md">
              <div class="row q-col-gutter-sm">
                <q-input class="col-xs-12 col-md-4 q-field--with-bottom"
                  filled
                  v-model="tercero.Identificacion"
                  type="number"
                  label="Identificacion"
                  lazy-rules
                />
                <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  map-options emit-value option-value="IdTipoIdentificacion"
                  option-label="Nombre"
                  v-model="tercero.IdTipoIdentificacion" :options="tipoId"
                  label="Tipo" />
                <q-input class="col-xs-12 col-md-2 q-field--with-bottom"
                  outlined
                  v-model="tercero.DV"
                  label="DV" />
                <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  v-model="tercero.Nombre"
                  label="Nombre"
                  lazy-rules
                />
                <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  v-model="tercero.OtrosNombres"
                  label="Otros nombres "
                />
                <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  v-model="tercero.Apellido1"
                  label="Primer Apellido"
                  lazy-rules
                />
                <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  v-model="tercero.Apellido2"
                  label="Segundo Apellido"
                />
                <q-input class="col-xs-12 col-md-12 q-field--with-bottom"
                  outlined
                  v-model="tercero.RazonSocial"
                  label="Razon Social"
                />
                <q-select class="col-xs-12 col-md-4 q-field--with-bottom"
                outlined
                filled
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
                  v-model="tercero.Nacimiento"
                  type="date"
                  label="Fecha Nacimiento"
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
                  @input="val => { seleccionarDepartamento(val) }"
                  label="Departamento"
                >
                <template v-slot:prepend>
                <q-icon name="list_alt" size="lg" />
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section>
                      <q-item-label caption><b> {{ scope.opt.Nombre }}</b></q-item-label>
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
                label="Municipio"
                >
                <template v-slot:prepend>
                  <q-icon name="location_city" size="lg" />
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section>
                      <q-item-label caption><b> {{  scope.opt.Nombre }}</b></q-item-label>
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
                  label="Teléfono"
                />
                <q-input class="col-xs-12 col-md-3 q-field--with-bottom"
                  outlined
                  type="number"
                  v-model="tercero.Celular"
                  label="Celular"
                />
                <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  v-model="tercero.Email"
                  label="Correo Electrónico"
                />
                <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  v-model="tercero.Web"
                  label="Página Web"
                />
                <q-input class="col-xs-12 col-md-12 q-field--with-bottom"
                  outlined
                  type="textarea"
                  v-model="tercero.Observacion"
                  label="Observaciones"
                />
                <div class="row justify-center q-pa-sm">
                  <q-btn label="Consultar" icon="search" outline align="center" unelevated @click.native="buscarTerceroFiltro" >
                  </q-btn>
                </div>
                <div class="row justify-center q-pa-sm">
                  <q-btn label="Limpiar" icon="restore_from_trash" outline align="center" unelevated @click="limpiarTercero" >
                  </q-btn>
                </div>
                <div class="row justify-center q-pa-sm">
                  <q-btn label="Regresar" icon="arrow_back" outline align="center" unelevated v-close-popup >
                  </q-btn>
                </div>
                <q-table class="col-xs-12 col-sm-12 col-md-12" dense flat bordered
                  title="Terceros x Filtro"
                  :data="listaPersonas"
                  :columns="columnsTercero"
                  row-key="name"
                  :visible-columns="vcTercero"
                >
                  <template v-slot:body-cell-Seleccionar="props">
                    <q-td key="Seleccionar" :props="props" auto-width>
                      <q-btn icon="verified" color="black" align="center" outline label="" @click="seleccionarTercero(props.row)" v-close-popup/>
                    </q-td>
                  </template>
                  <template v-slot:top="props">
                    <q-btn
                      flat round dense
                      :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                      @click="props.toggleFullscreen"
                      class="q-ml-md"
                    />
                    <q-space />
                    <q-btn
                      color="primary"
                      icon-right="archive"
                      label=""
                      no-caps
                      @click="exportarCSV(listaTercero, columnsTercero)"
                    />
                    <q-space />
                    <q-select
                      v-model="vcTercero"
                      multiple
                      outlined
                      dense
                      options-dense
                      :display-value="$q.lang.table.columns"
                      emit-value
                      map-options
                      :options="columnsTercero"
                      option-value="name"
                      options-cover
                      style="min-width: 150px"
                    />
                  </template>
                </q-table>
              </div>
            </div>
          </q-card-section>
        </q-card>
  </q-dialog>
</template>
<style>
</style>

<script>
import { api } from 'src/boot/axios'
import utilidades from 'src/commons/utilidades'
export default {
  props: {
    onSeleccionTercero: Function
  },
  data () {
    return {
      isDialog: false,
      isReadOnly: true,
      tercero: { IdTercero: -1, IdEmpresa: 1, Identificacion: '', Nombre: '', CodigoMunicipio: '', NombreMunicipio: '', CodigoDepartamento: '', NombreDepartamento: '', IdTipoIdentificacion: '', Sexo: '', DV: -1, Nacimiento: '', OtrosNombres: '', Apellido1: '', Apellido2: '', RazonSocial: '', Alias: '', Direccion: '', Telefono: '', Celular: '', Email: '', Web: '', Observacion: '', Login: '' },
      sexo: [
        { id: 'M', nombre: 'Masculino' },
        { id: 'F', nombre: 'Femenino' },
        { id: 'I', nombre: 'Prefiero no decirlo' }
      ],
      tipoId: [],
      listaDepartamentos: [],
      listaMunicipios: [],
      filtroBusca: '',
      listaTercero: [],
      listaPersonas: [],
      vcTercero: ['IdTercero', 'Identificacion', 'IdTipoIdentificacion', 'RazonSocial'],
      columnsTercero: [
        { name: 'Seleccionar', label: 'Seleccionar', required: true, field: 'Seleccionar', sortable: true },
        {
          name: 'IdTercero',
          required: true,
          label: 'Id',
          field: 'IdTercero',
          sortable: true
        },
        { name: 'Identificacion', label: 'Identificacion', field: 'Identificacion', sortable: true },
        { name: 'IdTipoIdentificacion', align: 'left', label: 'IdTI', field: 'IdTipoIdentificacion', sortable: true },
        { name: 'Nombre', align: 'left', label: 'Nombre', field: 'Nombre', sortable: true },
        { name: 'OtrosNombres', align: 'left', label: 'Otros Nombres', field: 'OtrosNombres', sortable: true },
        { name: 'Apellido1', align: 'left', label: 'Apellido 1', field: 'Apellido1', sortable: true },
        { name: 'Apellido2', align: 'left', label: 'Apellido 2', field: 'Apellido2', sortable: true },
        { name: 'RazonSocial', align: 'left', label: 'Razon Social', field: 'RazonSocial', sortable: true },
        { name: 'Alias', align: 'left', label: 'Alias', field: 'Alias', sortable: true },
        { name: 'Direccion', align: 'left', label: 'Direccion', field: 'Direccion', sortable: true },
        { name: 'Nacimiento', align: 'left', label: 'FNacimeinto', field: 'Nacimiento', sortable: true },
        { name: 'Celular', align: 'left', label: 'Celular', field: 'Celular', sortable: true },
        { name: 'Telefono', align: 'left', label: 'Telefono', field: 'Telefono', sortable: true }
      ]
    }
  },
  mounted () {
  },
  created () {
    this.mostrarListaDepartamentos()
    this.mostrarTipoIdentificacion('-1', '-1')
  },
  methods: {
    show () {
      this.isDialog = true
    },
    hide () {
      this.isDialog = false
    },
    exportarCSV (datos, columnas) {
      utilidades.exportTable('Terceros_', datos, columnas)
    },
    seleccionarTercero (tercero) {
      this.onSeleccionTercero(tercero)
      this.tercero = tercero
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
    convertirFecha () {
      if (this.tercero.Nacimiento !== '') {
        var fecha = this.tercero.Nacimiento // Fecha actual
        this.tercero.Nacimiento = fecha.slice(0, 10)
      }
    },
    seleccionarDepartamento (CodDepartamento) {
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
      api.get(`/tercero/tipo-id-filtro/${idTi}/${nombreTi}`)
        .then((response) => {
          self.tipoId = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Tipo Identificacion - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    limpiarTercero () {
      this.tercero = { IdTercero: -1, IdEmpresa: 1, Identificacion: '', Nombre: '', CodigoMunicipio: '', CodigoDepartamento: '', IdTipoIdentificacion: '', Sexo: '', DV: -1, Nacimiento: '', OtrosNombres: '', Apellido1: '', Apellido2: '', Alias: '', RazonSocial: '', Direccion: '', Telefono: '', Celular: '', Email: '', Web: '', Observacion: '', Login: '' }
      this.terceroB = this.tercero
      this.listaPersonas = []
    },
    buscarTerceroFiltro () {
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
      api.get('/usuario/mostrar-departamentos-municipios')
        .then((response) => {
          self.listaDepartamentos = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utilidades.mensaje('Departamentos - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    }
  }
}
</script>


<!-- <template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
        <q-toolbar>
            <q-avatar>
                <q-btn flat round dense icon="account_box" @click="mostrarPersonasDialog"/>
            </q-avatar>
            <q-avatar>
                <q-btn flat round dense icon="delete" @click="limpiarTercero"/>
            </q-avatar>
            <q-toolbar-title>
              Información Personas
            </q-toolbar-title>
            <q-btn flat icon="person_add" label="Clientes" @click="mostrarClientesDialog" />
        </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="guardarCambios">
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm">
            <q-input class="col-xs-12 col-md-4 q-field--with-bottom"
              filled
              v-model="tercero.Identificacion_persona" @blur="cargarDatosIdentificacion"
              type="number"
              label="Identificacion"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'You must enter an identification']"
            />
            <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
              outlined
              map-options emit-value option-value="IdTiid"
              option-label="NombreTiid"
              :rules="[ regla ]"
              v-model="tercero.Id_tiid" :options="tipoId"
              label="Tipo" />
            <q-input class="col-xs-12 col-md-2 q-field--with-bottom"
              outlined
              readonly
              v-model="tercero.Dv_persona"
              label="DV" />
            <q-input class="col-xs-12 col-md-12 q-field--with-bottom"
              outlined
              v-model="tercero.Nombre_persona"
              label="Nombre Persona"
              lazy-rules
              v-if="tercero.Id_tiid == 'NIT'"
              :rules="[ val => val && val.length > 0 || 'Tipo Identificacion']"
            />
            <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
              outlined
              v-model="tercero.Nombre_persona"
              label="Nombre"
              lazy-rules
              v-if="tercero.Id_tiid != 'NIT'"
              :rules="[ val => val && val.length > 0 || 'Tipo Identificacion']"
            />
            <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
              outlined
              v-model="tercero.Otrosnombres_persona"
              label="Otros nombres"
              v-if="tercero.Id_tiid != 'NIT'"
            />
            <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
              outlined
              v-model="tercero.Apellido1_persona"
              label="Primer Apellido"
              lazy-rules
              v-if="tercero.Id_tiid != 'NIT'" :rules="[ val => val && val.length > 0 || 'Debe ingresar Apellido 1']"
            />
            <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
              outlined
              v-model="tercero.Apellido2_persona"
              label="Segundo Apellido"
              v-if="tercero.Id_tiid != 'NIT'"
            />
            <q-select class="col-xs-12 col-md-4 q-field--with-bottom"
            outlined
            filled
            :rules="[ regla ]"
            v-model="tercero.Sexo_persona"
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
              v-model="tercero.Nacimiento_persona"
              type="date"
              label="Fecha de Nacimiento"
            >
              <template v-slot:prepend>
                <q-icon name="date_range" size="lg" />
              </template>
            </q-input>
            <q-input class="col-xs-12 col-md-4 q-field--with-bottom"
              outlined
              v-model="tercero.Alias_persona"
              label="Alias"
            />
            <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
            outlined
            v-model="tercero.Codigo_departamento"
            map-options emit-value option-value="Codigo_departamento"
            option-label="Nombre_departamento"
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
                  <q-item-label v-html="scope.opt.Nombre_departamento" />
                  <q-item-label caption>Código Departamento: {{ scope.opt.Codigo_departamento }}</q-item-label>
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
            v-model="tercero.Codigo_municipio"
            map-options emit-value option-value="Codigo_municipio"
            option-label="Nombre_municipio"
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
                  <q-item-label v-html="scope.opt.Nombre_municipio" />
                  <q-item-label caption>Código Municipio: {{ scope.opt.Codigo_municipio }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            </q-select>
            <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
              outlined
              v-model="tercero.Direccion_persona"
              label="Direccion"
            />
            <q-input class="col-xs-12 col-md-3 q-field--with-bottom"
              outlined
              type="number"
              v-model="tercero.Telefono_persona"
              label="Telefono"
            />
            <q-input class="col-xs-12 col-md-3 q-field--with-bottom"
              outlined
              type="number"
              v-model="tercero.Celular_persona"
              label="Mobile"
            />
            <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
              outlined
              v-model="tercero.Email_persona"
              label="Email"
            />
            <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
              outlined
              v-model="tercero.Web_persona"
              label="Pagina Web"
            />
            <q-input class="col-xs-12 col-md-12 q-field--with-bottom"
              outlined
              type="textarea"
              v-model="tercero.Observaciones_persona"
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
      <q-dialog v-model="isDialogComponentePersonas" style="max-width: 650px" maximized>
        <q-card>
          <q-bar>
            <div>Buscar personas por filtro</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <div class="q-pa-md">
              <div class="row q-col-gutter-sm">
                <q-input class="col-xs-12 col-md-4 q-field--with-bottom"
                  filled
                  v-model="tercero.Identificacion_persona"
                  type="number"
                  label="Identificacion"
                  lazy-rules
                />
                <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  map-options emit-value option-value="IdTiid"
                  option-label="NombreTiid"
                  v-model="tercero.Id_tiid" :options="tipoId"
                  label="Tipo" />
                <q-input class="col-xs-12 col-md-2 q-field--with-bottom"
                  outlined
                  v-model="tercero.Dv_persona"
                  label="DV" />
                <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  v-model="tercero.Nombre_persona"
                  label="Nombre"
                  lazy-rules
                />
                <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  v-model="tercero.Otrosnombres_persona"
                  label="Otros nombres "
                />
                <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  v-model="tercero.Apellido1_persona"
                  label="Primer Apellido"
                  lazy-rules
                />
                <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  v-model="tercero.Apellido2_persona"
                  label="Segundo Apellido"
                />
                <q-select class="col-xs-12 col-md-4 q-field--with-bottom"
                outlined
                filled
                v-model="tercero.Sexo_persona"
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
                  v-model="tercero.Nacimiento_persona"
                  type="date"
                  label="Fecha Nacimiento"
                >
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-md-4 q-field--with-bottom"
                  outlined
                  v-model="tercero.Alias_persona"
                  label="Alias "
                />
                <q-select class="col-xs-12 col-md-6 q-field--with-bottom"
                outlined
                v-model="tercero.Codigo_departamento"
                map-options emit-value option-value="Codigo_departamento"
                option-label="Nombre_departamento"
                :options="listaDepartamentos"
                @input="val => { seleccionarDepartamento(val) }"
                label="Departamento"
                >
                <template v-slot:prepend>
                <q-icon name="list_alt" size="lg" />
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section>
                      <q-item-label v-html="scope.opt.Nombre_departamento" />
                      <q-item-label caption>Código Departamento: {{ scope.opt.Codigo_departamento }}</q-item-label>
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
                v-model="tercero.Codigo_municipio"
                map-options emit-value option-value="Codigo_municipio"
                option-label="Nombre_municipio"
                :options="listaMunicipios"
                label="Municipio"
                >
                <template v-slot:prepend>
                  <q-icon name="location_city" size="lg" />
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section>
                      <q-item-label v-html="scope.opt.Nombre_municipio" />
                      <q-item-label caption>Código Municipio: {{ scope.opt.Codigo_municipio }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                </q-select>
                <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  v-model="tercero.Direccion_persona"
                  label="Direccion"
                />
                <q-input class="col-xs-12 col-md-3 q-field--with-bottom"
                  outlined
                  type="number"
                  v-model="tercero.Telefono_persona"
                  label="Teléfono"
                />
                <q-input class="col-xs-12 col-md-3 q-field--with-bottom"
                  outlined
                  type="number"
                  v-model="tercero.Celular_persona"
                  label="Celular"
                />
                <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  v-model="tercero.Email_persona"
                  label="Correo Electrónico"
                />
                <q-input class="col-xs-12 col-md-6 q-field--with-bottom"
                  outlined
                  v-model="tercero.Web_persona"
                  label="Página Web"
                />
                <q-input class="col-xs-12 col-md-12 q-field--with-bottom"
                  outlined
                  type="textarea"
                  v-model="tercero.Observaciones_persona"
                  label="Observaciones"
                />
                <div class="row justify-center q-pa-sm">
                  <q-btn label="Consultar" icon="search" outline align="center" unelevated @click.native="buscarPersonaFiltro" >
                  </q-btn>
                </div>
                <div class="row justify-center q-pa-sm">
                  <q-btn label="Limpiar" icon="restore_from_trash" outline align="center" unelevated @click="limpiarTercero" >
                  </q-btn>
                </div>
                <div class="row justify-center q-pa-sm">
                  <q-btn label="Regresar" icon="arrow_back" outline align="center" unelevated v-close-popup >
                  </q-btn>
                </div>
                <q-table class="col-xs-12 col-sm-12 col-md-12" dense flat bordered
                  title="Personas x Filtro"
                  :data="listaPersonas"
                  :columns="columnsPersonas"
                  row-key="name"
                  :visible-columns="vcPersonas"
                >
                  <template v-slot:body-cell-Seleccionar_persona="props">
                    <q-td key="Id_persona" :props="props" auto-width>
                      <q-btn icon="verified" color="black" align="center" outline label="" @click="seleccionarPersona(props.row)" v-close-popup/>
                    </q-td>
                  </template>
                  <template v-slot:top="props">
                    <q-btn
                      flat round dense
                      :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                      @click="props.toggleFullscreen"
                      class="q-ml-md"
                    />
                    <q-space />
                    <q-select
                      v-model="vcPersonas"
                      multiple
                      outlined
                      dense
                      options-dense
                      :display-value="$q.lang.table.columns"
                      emit-value
                      map-options
                      :options="columnsPersonas"
                      option-value="name"
                      options-cover
                      style="min-width: 150px"
                    />
                  </template>
                </q-table>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="isDialogComponenteClientes" style="max-width: 650px" maximized>
        <q-card>
          <q-bar>
            <div>Información Clientes</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <q-form ref="formCl" @submit="guardarCl">
              <div class="row q-col-gutter-sm">
                <div class="col-xs-12 col-sm-12 col-md-12 q-field--with-bottom">
                  <q-select
                    filled
                    v-model="filtroBusca"
                    map-options emit-value option-value="cliente"
                    option-label="Razonsocial_cliente"
                    :options="listaClientes"
                    clearable
                    use-input
                    hide-dropdown-icon
                    hide-selected
                    fill-input
                    input-debounce="0"
                    label="Cliente"
                    @filter="filterFn"
                    @input="val => { cargarClienteId(val) }"
                  >
                    <template v-slot:prepend>
                    <q-icon name="person" size="lg" />
                    </template>
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                        <q-item-section>
                          <q-item-label v-html="scope.opt.Razonsocial_cliente" />
                          <q-item-label caption>Identificación: {{scope.opt.Codigo_cliente}} - Id Cliente: {{scope.opt.Id_cliente}} - Id TipoCliente: {{scope.opt.Id_zona}}</q-item-label>
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
                <q-input class="col-xs-12 col-md-2 q-field--with-bottom"
                  outlined
                  type="number"
                  v-model="cliente.Id_cliente"
                  label="Id Cliente"
                />
                <q-input class="col-xs-12 col-md-3 q-field--with-bottom"
                  outlined
                  type="number"
                  v-model="cliente.Codigo_cliente"
                  :rules="[ regla ]"
                  label="Código Cliente"
                />
                <q-input class="col-xs-12 col-md-4 q-field--with-bottom"
                  outlined
                  v-model="cliente.Sigla_cliente"
                  :rules="[ regla ]"
                  label="Sigla Cliente"
                />
                <q-select class="col-xs-12 col-sm-6 col-md-3"
                  filled
                  v-model="cliente.Id_tipocontribuyente"
                  map-options emit-value option-value="id"
                  option-label="nombre"
                  :options="tipoContribuyente"
                  :rules="[ regla ]"
                  label="Tipo Contribuyente"
                />
                <q-select class="col-xs-12 col-sm-6 col-md-5"
                  filled
                  v-model="cliente.Id_zona"
                  :rules="[ regla ]"
                  map-options emit-value option-value="Id_zona"
                  option-label="Nombre_zona" :options="lisZonas"
                  label="Tipo de Cliente"
                />
                <q-input class="col-xs-12 col-sm-12 col-md-7 q-field--with-bottom"
                  outlined
                  v-model="cliente.Razonsocial_cliente"
                  :rules="[ regla ]"
                  label="Razón Social Cliente"
                />
                <q-input class="col-xs-12 col-md-12 q-field--with-bottom"
                  outlined
                  v-model="cliente.Observaciones_cliente"
                  label="Observaciones"
                />
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-xs-12 col-sm-12 col-md-2">
                  <q-select class="col-xs-12 col-sm-12 col-md-12"
                    filled
                    v-model="cliente.Enviocorreo_cliente"
                    :rules="[ regla ]"
                    map-options emit-value option-value="id"
                    option-label="nombre" :options="envioCoreo"
                    label="Envio Correo"
                  />
                  <q-select class="col-xs-12 col-sm-12 col-md-12"
                    filled
                    v-model="cliente.Credito_cliente"
                    :rules="[ regla ]"
                    map-options emit-value option-value="id"
                    option-label="nombre" :options="creditoCliente"
                    label="Crédito Cliente"
                  />
                  <q-select class="col-xs-12 col-sm-12 col-md-12"
                    filled
                    v-model="cliente.Fe_cliente"
                    :rules="[ regla ]"
                    map-options emit-value option-value="id"
                    option-label="nombre"
                    :options="facturaElectronica"
                    label="Factura Electronica"
                  />
                  <q-input class="col-xs-12 col-sm-12 col-md-12 q-field--with-bottom"
                    outlined
                    readonly
                    v-model="cliente.Id_persona"
                    label="Id Persona"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-2">
                  <div class="row justify-center q-pt-sm">
                    <q-btn label="Guardar" class="col-xs-12 col-sm-12 col-md-12" icon="save" outline type="submit" align="center" unelevated >
                    </q-btn>
                  </div>
                  <div class="row justify-center q-pa-sm">
                    <q-btn label="Nuevo" class="col-xs-12 col-sm-12 col-md-12" icon="person_add" outline align="center" unelevated @click="nuevoCliente">
                    </q-btn>
                  </div>
                  <div class="row justify-center q-pa-sm">
                    <q-btn label="Regresar" icon="replay" class="col-xs-12 col-sm-12 col-md-12" outline align="center" unelevated v-close-popup>
                    </q-btn>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-4">
                  <q-list class="col-xs-12 col-sm-12 col-md-4">
                    <q-item v-for="clie in listaClientes" :key="clie.Id_cliente" @click.native="cargarClienteId(clie)" class="q-my-sm" clickable>
                      <q-item-section avatar>
                        <q-icon name="person" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label> <b> {{ clie.Razonsocial_cliente }} </b> </q-item-label>
                        <q-item-label>
                          Id Cliente: {{ clie.Id_cliente }} <br/>
                          Id Persona: {{ clie.Id_persona }} <br/>
                          Sigla Cliente: {{ clie.Sigla_cliente }} <br/>
                          Codigo Cliente: {{ clie.Codigo_cliente }} <br/>
                          Crédito Cliente: {{ clie.Credito_cliente }} <br/>
                          Envío correo: {{ clie.Enviocorreo_cliente }} <br/>
                          Factura Electrónica: {{ clie.Fe_cliente }} <br/>
                          Tipo Cliente: {{ clie.Id_zona }} <br/>
                        </q-item-label>
                        <q-separator />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script>
import { api } from 'boot/axios'
import utils from 'src/commons/utilidades'
import { date } from 'quasar'
export default {
  name: 'Tercero',
  data () {
    return {
      tercero: { Id_persona: -1, Nombre_persona: '', Codigo_municipio: '', Id_departamento: '', Id_tiid: '', Sexo_persona: '', Dv_persona: -1, Nacimiento_persona: '19010101 00:00', Otrosnombres_persona: '', Apellido1_persona: '', Apellido2_persona: '', Alias_persona: '', Direccion_persona: '', Telefono_persona: '', Celular_persona: '', Email_persona: '', Web_persona: '', Observaciones_persona: '' },
      cliente: { Id_cliente: -1, Id_persona: 0, Id_empresa: 0, Id_zona: 0, Id_tipocontribuyente: '', Codigo_cliente: '', Razonsocial_cliente: ' ', Sigla_cliente: '', Observaciones_cliente: '', Login_cliente: '', Enviocorreo_cliente: 0, Credito_cliente: 0, Fe_cliente: 0, Estado_cliente: 1 },
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
      terceroB: { Id_persona: -1, Nombre_persona: '', Codigo_municipio: '', Id_departamento: '', Id_tiid: '', Sexo_persona: '', Dv_persona: -1, Nacimiento_persona: '19010101 00:00', Otrosnombres_persona: '', Apellido1_persona: '', Apellido2_persona: '', Alias_persona: '', Direccion_persona: '', Telefono_persona: '', Celular_persona: '', Email_persona: '', Web_persona: '', Observaciones_persona: '' },
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
      usuario: { LoginUsuario: '', PasswordUsuario: '', IdPersona: -1 },
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
      lisZonas: [],
      lisTipocontribuyente: [],
      listaDepartamentos: [],
      listaMunicipios: [],
      tipoId: [],
      vcPersonas: ['Id_persona', 'Identificacion_persona', 'Nombre_persona', 'Apellido1_persona'],
      columnsPersonas: [
        { name: 'Seleccionar_persona', label: 'Seleccionar', required: true, field: 'Seleccionar_persona', sortable: true },
        {
          name: 'Id_persona',
          required: true,
          label: 'Id',
          field: 'Id_persona',
          sortable: true
        },
        { name: 'Identificacion_persona', label: 'Identificacion', field: 'Identificacion_persona', sortable: true },
        { name: 'Nombre_persona', align: 'left', label: 'Nombre', field: 'Nombre_persona', sortable: true },
        { name: 'Otrosnombres_persona', align: 'left', label: 'Otros Nombres', field: 'Otrosnombres_persona', sortable: true },
        { name: 'Apellido1_persona', align: 'left', label: 'Apellido 1', field: 'Apellido1_persona', sortable: true },
        { name: 'Apellido2_persona', align: 'left', label: 'Apellido 2', field: 'Apellido2_persona', sortable: true },
        { name: 'Id_tiid', label: 'TI', field: 'Id_tiid', sortable: true },
        { name: 'Direccion_persona', align: 'left', label: 'Direccion', field: 'Direccion_persona', sortable: true },
        { name: 'Celular_persona', align: 'left', label: 'Celular', field: 'Celular_persona', sortable: true },
        { name: 'Telefono_persona', align: 'left', label: 'Telefono', field: 'Telefono_persona', sortable: true }
      ],
      componenteClientes: null,
      isDialogComponenteClientes: false,
      componentePersonas: null,
      isDialogComponentePersonas: false,
      selected: []
    }
  },
  mounted () {
    const value = this.$q.localStorage.getItem('usuarioSilaguas')
    if (value) {
      this.usuario = value
      this.limpiarTercero()
      this.cliente.Login_cliente = this.usuario.LoginUsuario
      this.cliente.Id_empresa = 1
    }
    // utils.verificarUsuario(this.usuario.LoginUsuario, this)
  },
  created () {
    this.tercero.Nacimiento_persona = date
    this.tercero.Nacimiento_persona = utils.fechaActual()
    this.mostrarListaDepartamentos()
    this.mostrarTipoIdentificacion('-1', '-1')
    // this.mostrarZonas(-1, '')
  },
  methods: {
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.listaPrecios.length}`
    },
    limpiarTercero () {
      this.tercero = { Id_persona: -1, Nombre_persona: '', Otrosnombres_persona: '', Apellido1_persona: '', Apellido2_persona: '', Alias_persona: '', Direccion_persona: '', Telefono_persona: '', Celular_persona: '', Email_persona: '', Web_persona: '', Observaciones_persona: '', Login_persona: this.usuario.LoginUsuario, Modifica_persona: this.usuario.LoginUsuario }
      this.terceroB = this.tercero
      this.nuevoCliente()
      this.listaPersonas = []
    },
    mostrarPersonasDialog () {
      this.componentePersonas = () => this.isDialogComponentePersonas
      this.isDialogComponentePersonas = true
    },
    seleccionarCliente (clie) {
      if (clie != null) {
        this.cliente = clie
      }
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
            utils.mensaje('Fallo la conexion ' + error)
            this.$q.loading.hide()
          })
      }, 500)
    },
    seleccionarPersona (persona) {
      this.tercero = persona
      for (var i = 0; i < this.listaDepartamentos.length; i++) {
        for (var m = 0; m < this.listaDepartamentos[i].LisMunicipios.length; m++) {
          if (this.listaDepartamentos[i].LisMunicipios[m].Codigo_municipio === this.tercero.Codigo_municipio) {
            this.tercero.Codigo_departamento = this.listaDepartamentos[i].Codigo_departamento
            this.seleccionarDepartamento(this.tercero.Codigo_departamento)
            this.tercero.Codigo_municipio = this.listaDepartamentos[i].LisMunicipios[m].Codigo_municipio
            this.calcularDV()
            this.convertirFecha()
            this.mostrarClientes()
            return
          }
        }
      }
    },
    cargarDatosIdentificacion () {
      const self = this
      if (self.tercero.Identificacion_persona === '' || self.tercero.Identificacion_persona === undefined) {
        return
      }
      const identificacion = self.tercero.Identificacion_persona
      self.terceroB = {}
      self.$q.loading.show()
      api.get(`/tercero/mostrar-identificacion/${identificacion}`)
        .then((response) => {
          this.terceroB = response.data
          self.$q.loading.hide()
          if (self.terceroB.Id_persona > 0) {
            self.tercero = self.terceroB
            self.mostrarClientes()
            for (var i = 0; i < this.listaDepartamentos.length; i++) {
              for (var m = 0; m < this.listaDepartamentos[i].LisMunicipios.length; m++) {
                if (self.listaDepartamentos[i].LisMunicipios[m].Codigo_municipio === self.terceroB.Codigo_municipio) {
                  this.tercero.Codigo_departamento = this.listaDepartamentos[i].Codigo_departamento
                  this.seleccionarDepartamento(this.tercero.Codigo_departamento)
                  this.tercero.Codigo_municipio = this.listaDepartamentos[i].LisMunicipios[m].Codigo_municipio
                  self.calcularDV()
                  this.convertirFecha()
                  return
                }
              }
            }
          } else {
            // self.limpiarTercero()
            self.tercero.Identificacion_persona = identificacion
            self.calcularDV()
            self.$q.loading.hide()
          }
        })
        .catch((error) => {
          utils.mensaje('Buscar Identificacion - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    buscarPersonaFiltro () {
      const self = this
      self.listaPersonas = []
      self.$q.loading.show()
      api.post('/tercero/mostrar-filtro', this.tercero)
        .then((response) => {
          self.listaPersonas = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Mostrar Filtro - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    // mostrarZonas (idZona, nombreZona) {
    //   const self = this
    //   self.$q.loading.show()
    //   if (nombreZona === '') {
    //     nombreZona = '-1'
    //   }
    //   api.get(`/tercero/mostrarZonas/${idZona}/${nombreZona}`)
    //     .then((response) => {
    //       if (response.data != null) {
    //         self.lisZonas = response.data
    //       }
    //     })
    //     .catch((error) => {
    //       utils.mensaje('Zonas - Fallo la conexion ' + error)
    //       self.$q.loading.hide()
    //     })
    // },
    mostrarClientesDialog () {
      this.cliente = { Id_cliente: -1, Id_persona: -1, Razonsocial_cliente: '' }
      this.componenteClientes = () => this.isDialogComponenteClientes
      this.isDialogComponenteClientes = true
    },
    mostrarClientes () {
      const self = this
      if (self.tercero.Identificacion_persona.length > 0) {
        self.$q.loading.show()
        api.get(`/tercero/mostrar-identificacion/${self.tercero.Identificacion_persona}`)
          .then((response) => {
            // self.listaClientes = response.data
            self.cliente = response.data
            self.$q.loading.hide()
          })
          .catch((error) => {
            utils.mensaje('Busqueda Identificacion - Fallo la conexion ' + error)
            self.$q.loading.hide()
          })
      }
    },
    nuevoCliente () {
      this.cliente = {
        Id_cliente: -1,
        Id_persona: this.tercero.Id_persona,
        Id_empresa: 1,
        Id_zona: 0,
        Id_tipocontribuyente: '',
        Codigo_cliente: this.tercero.Identificacion_persona,
        Razonsocial_cliente: this.tercero.Nombre_persona + ' ' + this.tercero.Otrosnombres_persona + ' ' + this.tercero.Apellido1_persona + ' ' + this.tercero.Apellido2_persona,
        Sigla_cliente: this.tercero.Nombre_persona,
        Observaciones_cliente: '',
        Login_cliente: '',
        Enviocorreo_cliente: 0,
        Credito_cliente: 0,
        Fe_cliente: 0,
        Estado_cliente: 1
      }
    },
    cargarClienteId (Clie) {
      if (Clie) {
        this.cliente = Clie
      } else {
        this.filtroBusca = ''
      }
    },
    guardar () {
      const self = this
      self.$q.loading.show()
      api.post('/tercero/guardar/', this.tercero)
        .then((response) => {
          self.terceroB = response.data
          if (self.terceroB.Id_persona > 0) {
            utils.mensaje('Persona guardada con éxito')
            this.tercero = this.terceroB
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    modificar () {
      const self = this
      self.tercero.Modifica_persona = self.usuario.LoginUsuario
      self.$q.loading.show()
      api.post('/tercero/modificar/', this.tercero)
        .then((response) => {
          if (response.data > 0) {
            utils.mensaje('Persona modificada con éxito')
            self.limpiarTercero()
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    guardarCambios () {
      const self = this
      if (self.tercero.Id_persona > 0) {
        this.modificar()
      } else {
        this.guardar()
      }
    },
    guardarCl () {
      this.cliente.Login_cliente = this.usuario.LoginUsuario
      this.cliente.Id_empresa = 2
      if (this.cliente.Id_cliente > 0) {
        this.modificarCliente()
      } else {
        this.cliente.Id_persona = this.tercero.Id_persona
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
            utils.mensaje('Cliente guardado con éxito')
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion ' + error)
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
          utils.mensaje('Cliente modificado con éxito')
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    convertirFecha () {
      var fecha = this.tercero.Nacimiento_persona // Fecha actual
      this.tercero.Nacimiento_persona = fecha.slice(0, 10)
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
        utils.mensaje('El nit/cédula ' + myNit + ' no es válido(a).')
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
      const nit = self.tercero.Identificacion_persona
      const isNitValid = nit.length

      // Si es un número se calcula el Dígito de Verificación
      if (isNitValid > 0) {
        self.tercero.Dv_persona = self.calcularDigitoVerificacion(nit)
      }
    },
    mostrarListaDepartamentos () {
      const self = this
      self.$q.loading.show()
      api.get('/usuario/mostrar-departamentos-municipios')
        .then((response) => {
          self.listaDepartamentos = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Departamentos - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    seleccionarDepartamento (CodDepartamento) {
      for (var m = 0; m < this.listaDepartamentos.length; m++) {
        if (this.listaDepartamentos[m].Codigo_departamento === CodDepartamento) {
          this.listaMunicipios = this.listaDepartamentos[m].LisMunicipios
          return
        }
      }
    },
    mostrarTipoIdentificacion (idTi, nombreTi) {
      const self = this
      self.$q.loading.show()
      api.get(`/tercero/tipo-id-filtro/${idTi}/${nombreTi}`)
        .then((response) => {
          self.tipoId = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Tipo Identificacion - Fallo la conexion ' + error)
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
</script> -->
