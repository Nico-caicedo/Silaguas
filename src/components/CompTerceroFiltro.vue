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
import { api } from 'boot/axios'
import utilidades from '../commons/utilidades.js'
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
      api.get('/usuario/mostrarDepartamentosMunicipios')
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
