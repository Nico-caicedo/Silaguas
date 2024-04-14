<template>
  <q-form @submit.prevent="Registrar" ref="formularioCrearTercero" style="flex-wrap: none;"
    class="q-ma-md shadow-1 col q-pb-md bg-white ">
    <header class="F-primary row items-center   justify-center" style="height: 60px;">
      <p class="text-h5 q-ma-none text-white">Registro</p>
    </header>
    <section class="q-pa-md q-col-gutter-y-xs ">

      <div class="q-col-gutter-sm row">
        <q-select lazy-rules :rules="[utils.regla]" map-options emit-value class="col-xs-12 col-sm-4 col-md-4" filled
          dense v-model="Tercero.IdTipoIdentificacion"
          :options="DatosOpciones.tipoidentificacion.map(elemento => ({ label: elemento.Nombre, value: elemento.IdTipoIdentificacion }))"
          label="Tipo Identificación">
          <template v-slot:prepend>
            <q-icon name="date_range" />
          </template>
        </q-select>
        <input-traer-tercero lazy-rules dense filled @datosTercero="datosTercero" :rules="[utils.regla]"
          class="col-xs-12 col-sm-4 col-md-4" square type="number" v-model="Tercero.Identificacion"
          label="Identificación">
          <template v-slot:prepend>
            <q-icon name="account_box" />
          </template>
        </input-traer-tercero>
        <q-select lazy-rules dense :rules="[utils.regla]" map-options emit-value class="col-xs-12 col-sm-4 col-md-4"
          filled v-model="Tercero.IdRol"
          :options="DatosOpciones.rol.map(item => ({ label: item.Nombre, value: item.IdRol }))" label="Rol">
          <template v-slot:prepend>
            <q-icon name="work" />
          </template>
        </q-select>
      </div>

      <div class="q-col-gutter-sm row" v-if="!IsEmpresa">
        <q-input dense :rules="[val => utils.reglaBloqueada(val, IsEmpresa)]" class="col-xs-12 col-sm-12 col-md-4" filled
          type="text" lazy-rules v-model="Tercero.Nombres" label="Nombres">
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
        <q-input dense :rules="[val => utils.reglaBloqueada(val, IsEmpresa)]" class="col-xs-12 col-sm-6 col-md-4" filled
          type="text" lazy-rules v-model="Tercero.Apellido1" label="Apellido 1">
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
        <q-input dense :rules="[val => utils.reglaBloqueada(val, IsEmpresa)]" class="col-xs-12 col-sm-6 col-md-4" filled
          type="text" lazy-rules v-model="Tercero.Apellido2" label="Apellido 2">
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
      </div>

      <div class="q-col-gutter-sm row">
        <q-input dense lazy-rules :rules="[val => val.length === 10 || 'NÚmero no valido']" class="col-xs-12 col-md-4"
          filled type="number" v-model="Tercero.Telefono" label="Teléfono">
          <template v-slot:prepend>
            <q-icon name="phone" />
          </template>
        </q-input>
        <q-input dense lazy-rules :rules="[utils.regla]" class="col-xs-12 col-md-4" filled type="email"
          v-model="Tercero.Correo" label="Correo">
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>
        <q-input dense lazy-rules :rules="[utils.regla]" class="col-xs-12 col-md-4" filled type="text"
          v-model="Tercero.Direccion" label="Dirección">
          <template v-slot:prepend>
            <q-icon name="location_on" />
          </template>
        </q-input>
      </div>

      <div class="q-col-gutter-sm row">
        <q-input dense lazy-rules class="col-xs-12 col-md-12" :rules="[val => utils.reglaBloqueada(val, IsEmpresa)]"
          v-if="IsEmpresa" filled type="text" v-model="Tercero.RazonSocial" label="Razón Social">
          <template v-slot:prepend>
            <q-icon name="domain" />
          </template>
        </q-input>
        <q-select dense lazy-rules :rules="[utils.regla]" class="col-xs-12 col-sm-6 col-md-6" transition-show="jump-up"
          transition-hide="jump-up" square filled map-options emit-value v-model="Tercero.IdDepartamento"
          :options="DatosOpciones.departamento.map(item => ({ label: item.Nombre, value: item.IdDepartamento }))"
          label="Departamento">
          <template v-slot:prepend>
            <q-icon name="date_range" />
          </template>
        </q-select>
        <q-select dense lazy-rules :rules="[utils.regla]" class="col-xs-12 col-sm-6 col-md-6 " map-options emit-value
          :options="DatosOpciones.municipio.map(item => ({ label: item.Nombre, value: item.IdMunicipio }))" square filled
          v-model="Tercero.IdMunicipio" label="Municipio">
          <template v-slot:prepend>
            <q-icon name="date_range" />
          </template>
        </q-select>
      </div>

      <div class="q-col-gutter-sm row">

        <q-select dense lazy-rules :rules="[utils.regla]" class="col-xs-12 col-sm-6 col-md-6" square filled map-options
          emit-value v-model="Tercero.IdTipoPersona"
          :options="DatosOpciones.IdTipoPersona.map(item => ({ label: item.nombre, value: item.value }))"
          label="Tipo persona">
          <template v-slot:prepend>
            <q-icon name="date_range" />
          </template>
        </q-select>

        <q-select dense lazy-rules :rules="[utils.regla]" class="col-xs-12 col-sm-6 col-md-6 " map-options emit-value
          :options="DatosOpciones.regimen.map(item => ({ label: item.Nombre, value: item.IdRegimen }))" square filled
          v-model="Tercero.IdRegimen" label="Regimen">
          <template v-slot:prepend>
            <q-icon name="date_range" />
          </template>
        </q-select>

      </div>


      <div class="row selft-center items-center justify-center" style="column-gap: 5%">
        <template v-if="IsEditar">
          <div @click="cancelEdit"
            class="cursor-pointer bg-red-6 items-center text-white text-center q-pa-sm col-xs-4 col-md-4">
            Cancelar
          </div>
          <div type="text" @click="confirEdit"
            class="cursor-pointer bg-green-6 text-white text-center q-pa-sm col-xs-7 col-md-4">
            Guardar Cambios
          </div>
          <q-input type="hidden" v-if="IsEditar" v-model="Tercero.IdTercero" />
        </template>
        <q-btn v-if="!IsEditar" size="md" type="submit" class="q-pa-sm col-xs-11 col-md-4" color="blue-6"
          label="Registrar" />
      </div>

    </section>


  </q-form>
</template>
<script>
import utils from "src/utils/Utils.js"
import { ref, watch } from "vue";
import Api from "src/services/Api.vue"
import InputTraerTercero from "src/components/ElementosFormulario/InputTraerTercero.vue";
export default {
  components: {
    InputTraerTercero
  },
  props: {
    IsEditar: {
      type: Boolean,
      required: true
    },
    DatosParaEditar: {
      type: Object,
      required: false
    }
  },
  emit: ['clickCancel'],
  setup(props, { emit }) {

    const Tercero = ref({})
    const formularioCrearTercero = ref(null);
    const IsEmpresa = ref(false)
    const isPwd = ref(true)
    const IsUsuario = ref(true);
    const DatosOpciones = ref({
      tipoidentificacion: [],
      regimen: [],
      departamento: [],
      municipio: [],
      rol: [],
      IdTipoPersona: [
        {
          nombre: "Persona natural",
          value: 1
        },
        {
          nombre: "Persona Juridica",
          value: 2
        },
      ]
    });

    const TraerDatosSelect = async () => {
      const apis = ["tipoidentificacion", "regimen", "rol", "departamento"];
      for (let i = 0; i < apis.length; i++) {
        try {
          const response = await Api.get(${apis[i]}/);
          DatosOpciones.value[apis[i]] = response.data;
        } catch (error) {
          console.error(Error al obtener datos de ${apis[i]}:, error);
        }
      }
    };
    const datosTercero = (dato) => {
      if (dato.IsExito != false) {
        Object.assign(Tercero.value, { Nombres: dato.Nombres, Apellido1: dato.Apellido1, Apellido2: dato.Apellido2 })
        Tercero.value.Nombres
      }
    }
    const Registrar = async () => {
      if (!(await utils.confirmarAccion("¿Esta seguro de realizar el registro?"))) {
        return;
      }
      try {
        const response = await Api.post("tercero/", Tercero.value)
        if (response.data.IsExito !== false) {
          Tercero.value = {}
        }
        utils.respuesta(response.data)
      } catch (error) {
        console.error("Error al registrar el tercero:", error)
      }
    };
    const cancelEdit = async () => {
      if (!await utils.confirmarAccion("¿Desea cancelar la acción?")) {
        return;
      }
      Tercero.value = {}
      emit("clickCancel", true)
    }
    const confirEdit = async () => {
      if (!(await utils.confirmarAccion("¿Esta seguro de actualizar?"))) {
        return;
      }
      try {
        Tercero.value.FechaActualizacion = await utils.tiempoActual();
        const response = await Api.put("tercero/", Tercero.value)
        utils.respuesta(response.data)
        Tercero.value = {};
        emit("clickCancel", true);
      } catch (error) {
        console.error("Error al actualizar el tercero:", error)
      }
    }
    //Cambios para editar
    watch(() => props.DatosParaEditar, (terceroEdit) => {
      Tercero.value = terceroEdit
    }, { immediate: true });
    watch(() => props.IsEditar, (valor) => {
      Tercero.value = {}
    })
    watch(() => Tercero.value.IdTipoIdentificacion, (newValue) => {
      if (newValue === 2) {
        IsEmpresa.value = true;
        Object.assign(Tercero.value, { Nombres: "", Apellido1: "", Apellido2: "" });
      }
      else {
        IsEmpresa.value = false
      }
    }, { immediate: true });
    watch(() => Tercero.value.IdRol, (newValue) => {
      if (newValue === null) {
        Tercero.value.IdRol = 6;
      } else {
        newValue === 6 ? IsUsuario.value = false : IsUsuario.value = true

      }

    })
    watch(() => Tercero.value.IdDepartamento, async (newValue) => {

      if (newValue !== undefined) {
        const response = await Api.get(departamento/${newValue}/municipio)
        return DatosOpciones.value.municipio = response.data;
      }
    }, { immediate: true });

    TraerDatosSelect()

    return {
      Tercero,
      IsEmpresa,
      IsUsuario,
      TraerDatosSelect,
      DatosOpciones,
      Registrar,
      utils,
      isPwd,
      datosTercero,
      cancelEdit,
      confirEdit,
      formularioCrearTercero
    };
  },
};
</script>
