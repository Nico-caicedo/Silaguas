<!-- <template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-light-blue-9">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="vpn_key" />
        </q-avatar>
        <q-toolbar-title>Silaguas</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div>
        <q-form class="q-pa-md">
          <div class="row justify-center q-pt-sm">
            <img class="col-xs-10 col-sm-5 col-md-3" src="~assets/logo.png" />
          </div>
          <div class="row justify-center q-pt-sm">
            <q-input v-model="Usuario.Login" class="col-xs-12 col-sm-6 col-md-4" label="Usuario" outlined lazy-rules
              :rules="[val => val && val.length > 0 || 'Falta llenar campo']" />
          </div>
          <div class="row justify-center q-pt-sm">
            <q-input label="Password" class="col-xs-12 col-sm-6 col-md-4" v-model="Usuario.Password"
              @keydown.enter.prevent="login()" outlined :type="isPwd ? 'password' : 'text'"
              :rules="[val => val !== null && val !== '' || 'Falta llenar campo']">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </div>
          <div class="row justify-center q-pt-sm">
            <q-btn label="Login" class="col-xs-12 col-sm-6 col-md-4" icon="vpn_key" outline align="center" unelevated
              @click="login()" />
          </div>
        </q-form>
      </div>

      <geolocation />
    </q-page-container>
  </q-layout>
</template>

<style></style>

<script>
import { api } from 'boot/axios'
import utilidades from '../commons/utilidades.js'
import UsuDao from '../commons/Datos/usuariosDAO_.js'
import geolocation from '../components/GeolocationComponent.vue'
export default {
  components: {
    geolocation
  },
  data() {
    return {
      geolocation,
      usuDao: null,
      visible: false,
      isPwd: true,
      Usuario: { Login: '', IdRol: '', IdPersona: -1, Password: '', LoginCrea: '', Observacion: '', FIngreso: '', ModPasspi: '', NoModPass: 0, PassNoExpire: 0, Activo: 0, ProximoCambio: '', PeriodoCambio: 0, Estado: 0, NombreTercero: '' }
    }
  },
  created() {
    this.usuDao = new UsuDao()
    const value = this.$q.localStorage.getItem('usuarioSilaguas')
    if (value) {
      this.$router.push('/admin')
    }
    /* this.Usuario = this.usuDao.traerUsuario()
    if (!this.Usuario) {
      this.$router.push('/')
      return
    } else {
      this.menuElements = this.Usuario.ListaAccesos
    } */
  },
  methods: {

    login() {
      const self = this
      // self.verificarUsuario('ADMIN')
      this.usuDao = new UsuDao()

      this.Usuario = this.usuDao.login(self, self.Usuario)


      // self.Usuario = usuarios_.login(self, self.Usuario)
    },
    limpiar() {
      console.Log(this.Usuario.Login)
      this.Usuario.Password = null
    }
  }
}
</script> -->

<template>
  <q-layout container style="height: 100vh ">
    <q-header class="bg-light-blue-9 fixed-top">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="vpn_key" />
        </q-avatar>
        <q-toolbar-title>Silaguas</q-toolbar-title>
      </q-toolbar>
    </q-header>




    <q-page-container class="relative-position col" style="height:100vh; width:100%;">
      <q-card class="login-card row col absolute-center rounded-borders ">
        <q-card-section align="center" class="q-gutter-sm justify-center q-pa-md">
          <q-separator color="primary" size="1px" />
          <div class="row col justify-center">
            <img class="col-xs-10 col-sm-5 col-md-5" src="~assets/logoonacsinfondo.png" />
          </div>
          <q-separator color="primary" size="1px" />
          <div class="row col justify-center">
            <q-input v-model="usuario.Login" class="col-xs-12 col-sm col-md" label="Usuario" outlined lazy-rules
              :rules="[val => val && val.length > 0 || 'Falta llenar campo']" />
          </div>
          <div class="row col justify-center">
            <q-input label="Password" class="col-xs-12 col-sm col-md" v-model="usuario.Password"
              @keydown.enter.prevent="login()" outlined :type="isPwd ? 'password' : 'text'"
              :rules="[val => val !== null && val !== '' || 'Falta llenar campo']">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </div>
          <div class="row col justify-center q-pt-sm">
            <q-btn label="Login" class="col-xs-12 col-sm col-md" icon="vpn_key" outline color="primary" align="center"
              unelevated @click="login()" />
          </div>
        </q-card-section>
      </q-card>
    </q-page-container>
  </q-layout>
</template>
<script>
import { ref } from 'vue';
import { useQuasar, Loading } from 'quasar';
import { useRouter } from 'vue-router';
import UsuDao from '../commons/Datos/usuariosDAO_.js';
import utilidades from '../commons/utilidades';
import utils from '../commons/alertUtils'

export default {
  setup() {
    const $q = useQuasar();
    const usuario = ref({ Login: '', Password: '' });
    const isPwd = ref(true);
    const usuDao = new UsuDao();
    const $router = useRouter();





    const login = () => {
      if (!usuario.value.Login || !usuario.value.Password) {
        utils.Notify('Por favor, complete todos los campos', 'error');
        return;
      }
      $q.loading.show();
      usuDao.login(usuario.value)
        .then((response) => {
          var datos = response;
          if (datos.Login === null) {
            $q.loading.hide();
            utils.Notify('Nombre y Password incorrectos', 'advertencia');
          } else {
            $q.localStorage.set('usuarioSilaguas', datos);
            //  usuDao.verificarUsuario(datos.Login);
            //  usuDao.cargarAccesos(datos.IdRol, '-1');
            ingresar(datos);
          }
          $q.loading.hide();
        })
        .catch((error) => {
          utilidades.mensaje('Fail conexion - Autentication ' + error);
          $q.loading.hide();
        });
    }
    const ingresar = (datos) => {
      if (datos.Activo === '0') {
        utilidades.mensaje('El usuario se encuentra inactivo, consulte con el administrador del software');
        // salir();
      }
      if (datos.ModpasspiUsuario === '1') {
        if (datos.NomodpassUsuario === '1') {
          $router.push('/admin');
        } else {
          $router.push('/Administracion/cambioClave');
        }
      } else {
        $router.push('/admin');
      }
    }
    // const salir = () => {
    //   $q.localStorage.remove('usuarioSilaguas');
    //   $q.localStorage.remove('accesosSilaguas');
    //   $router.push('/');
    // };

    const limpiar = () => {
      usuario.value.Login = '';
      usuario.value.Password = '';
    };

    return {
      usuario,
      isPwd,
      login,
      limpiar
    };
  }
}
</script>


<style scoped>
.login-card {
  max-width: 400px;
  margin: auto;
}
</style>
