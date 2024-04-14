<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-green-8 shadow-1">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="vpn_key" />
        </q-avatar>
        <q-toolbar-title class="text-weight-light ">
          Cambio de Clave
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container class="relative-position col">
      <q-scroll-area class="T-primary " style="height: calc(98vh - 100px)">
      <div class="q-pa-md q-gutter-xs rounded-borders">
        <div class="row justify-center ">
          <q-input v-model="Usuario.Login" class="col-xs-12 col-sm-6 col-md-4" readonly label="Usuario" outlined
            lazy-rules :rules="[val => val && val.length > 0 || 'Falta llenar campo']" />
        </div>
        <div class="row justify-center ">
          <q-input label="Clave Actual" class="col-xs-12 col-sm-6 col-md-4" v-model="Usuario.Password"
            @keydown.enter.prevent="cambiarClaveUsuario" outlined :type="isPwd ? 'password' : 'text'"
            :rules="[val => val !== null && val !== '' || 'Falta llenar campo']">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </div>
        <div class="row justify-center ">
          <q-input label="Nueva Clave" class="col-xs-12 col-sm-6 col-md-4" v-model="Usuario.PasswordNuevo"
            @keydown.enter.prevent="cambiarClaveUsuario" outlined :type="isPwdN ? 'password' : 'text'"
            :rules="[val => val !== null && val !== '' || 'Falta llenar campo']">
            <template v-slot:append>
              <q-icon :name="isPwdN ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="isPwdN = !isPwdN" />
            </template>
          </q-input>
        </div>
        <div class="row justify-center ">
          <q-input label="Confirmar Clave" class="col-xs-12 col-sm-6 col-md-4" v-model="Usuario.PasswordConfirma"
            @keydown.enter.prevent="cambiarClaveUsuario" outlined :type="isPwdC ? 'password' : 'text'"
            :rules="[val => val !== null && val !== '' || 'Falta llenar campo']">
            <template v-slot:append>
              <q-icon :name="isPwdC ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="isPwdC = !isPwdC" />
            </template>
          </q-input>
        </div>
        <div class="row justify-center ">
          <q-btn label="Cambiar Clave" class="col-xs-12 col-sm-6 col-md-4" icon="vpn_key" outline align="center"
            unelevated @click="cambiarClaveUsuario()" />
        </div>
        <div class="row justify-center ">
          <q-btn label="Salir" class="col-xs-12 col-sm-6 col-md-4" icon="exit_to_app" outline align="center" unelevated
            @click="salir()" />
        </div>
      </div>
      </q-scroll-area>
    </q-page-container>
  </q-layout>
</template>
<script>
import { ref, onMounted } from 'vue'
import utils from 'src/commons/utilidades'
import UsuariosDAO_ from 'src/commons/Datos/usuariosDAO_';
import { LocalStorage } from 'quasar';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default {
  name: 'CambioClave',
  setup() {
    const Usuario = ref({
      Login: '',
      Password: '',
      PasswordNuevo: '',
      PasswordConfirma: '',
    })

    const q = useQuasar()
    const isPwd = ref(true)
    const isPwdN = ref(true)
    const isPwdC = ref(true)
    const router = useRouter();
    const usuariosDAO = new UsuariosDAO_();

    const cambiarClaveUsuario = async () => {
      if (Usuario.value.PasswordNuevo === Usuario.value.Password) {
        utils.mensaje('La contraseña nueva no debe ser igual a la anterior, verifique')
        return
      }
      if (Usuario.value.PasswordNuevo !== Usuario.value.PasswordConfirma) {
        utils.mensaje('La contraseña nueva no coincide con la confirmada, verifique')
        return
      }
      if (Usuario.value.PasswordNuevo === '') {
        utils.mensaje('La contraseña no puede estar vacía, verifique')
        return
      }

      Usuario.value.Password = Usuario.value.PasswordNuevo;
      try {
        const success = await usuariosDAO.cambiarClave(Usuario.value);
        if (success) {
          // Actualizar la contraseña en el almacenamiento local
          const value = LocalStorage.getItem('usuarioSilaguas');
          value.Password = Usuario.value.Password;
          LocalStorage.set('usuarioSilaguas', value);
          utils.mensaje('Contraseña cambiada exitosamente');
          // router.push('/admin');
        } else {
          utils.mensaje('La contraseña no fue modificada, comuníquese con el administrador');
        }
      } catch (error) {
        // Callback en caso de error
        utils.mensaje(`Error al cambiar la contraseña: ${error}`);
      }
    }

    const salir = () => {
      router.push('/admin');
    }

    const verificarUsuario = () => {
      const value = LocalStorage.getItem('usuarioSilaguas')
      const { Login, Password } = value
      if (value) {
        Usuario.value.Login = Login
        Usuario.value.Password = Password
      }
    };

    onMounted(() => {
      verificarUsuario();
    });

    return {
      Usuario,
      isPwd,
      isPwdN,
      isPwdC,
      cambiarClaveUsuario,
      salir,
      verificarUsuario
    }
  },
}
</script>
