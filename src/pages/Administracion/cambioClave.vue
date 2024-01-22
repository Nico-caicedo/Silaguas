<template>
    <q-layout container style="height: 90vh">
        <q-header class="bg-green-8">
            <q-toolbar>
                <q-avatar>
                    <q-btn flat round dense icon="vpn_key" />
                </q-avatar>
                <q-toolbar-title>
                  Cambio de Clave
                </q-toolbar-title>
            </q-toolbar>
        </q-header>
        <q-page-container>
            <div class="q-pa-md">
              <div class="row justify-center q-pt-sm">
                  <q-input v-model="Usuario.Login" class="col-xs-12 col-sm-6 col-md-4"
                  readonly
                  label="Usuario" outlined lazy-rules :rules="[ val => val && val.length > 0 || 'Falta llenar campo']" />
              </div>
              <div class="row justify-center q-pt-sm">
                  <q-input label="Clave Actual" class="col-xs-12 col-sm-6 col-md-4" v-model="Usuario.Password" @keydown.enter.prevent="cambiarClaveUsuario" outlined :type="isPwd ? 'password' : 'text'" :rules="[val => val !== null && val !== '' || 'Falta llenar campo']">
                  <template v-slot:append>
                      <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                  </template>
                  </q-input>
              </div>
              <div class="row justify-center q-pt-sm">
                  <q-input label="Nueva Clave" class="col-xs-12 col-sm-6 col-md-4" v-model="Usuario.PasswordNuevo" @keydown.enter.prevent="cambiarClaveUsuario" outlined :type="isPwd ? 'password' : 'text'" :rules="[val => val !== null && val !== '' || 'Falta llenar campo']">
                  <template v-slot:append>
                      <q-icon :name="isPwdN ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwdN = !isPwdN" />
                  </template>
                  </q-input>
              </div>
              <div class="row justify-center q-pt-sm">
                  <q-input label="Confirmar Clave" class="col-xs-12 col-sm-6 col-md-4" v-model="Usuario.PasswordConfirma" @keydown.enter.prevent="cambiarClaveUsuario" outlined :type="isPwd ? 'password' : 'text'" :rules="[val => val !== null && val !== '' || 'Falta llenar campo']">
                  <template v-slot:append>
                      <q-icon :name="isPwdC ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwdC = !isPwdC" />
                  </template>
                  </q-input>
              </div>
              <div class="row justify-center q-pt-sm">
                  <q-btn label="Cambiar Clave" class="col-xs-12 col-sm-6 col-md-4" icon="vpn_key" outline align="center" unelevated @click="cambiarClaveUsuario()"/>
              </div>
              <div class="row justify-center q-pt-sm">
                  <q-btn label="Salir" class="col-xs-12 col-sm-6 col-md-4" icon="exit_to_app" outline align="center" unelevated @click="salir()"/>
              </div>
          </div>
      </q-page-container>
    </q-layout>
</template>

<script>
import { api } from 'boot/axios'
import utils from '../../commons/utilidades.js'
import usuarios_ from '../../commons/Datos/usuariosDAO_.js'
export default {
  name: 'CambioClave',
  data () {
    return {
      isPwd: true,
      isPwdN: true,
      isPwdC: true,
      Usuario: { Login: '', IdRol: '', IdTercero: 0, Password: '', PasswordNuevo: '', PasswordConfirma: '', LoginCrea: '', Observacion: '', FIngreso: '', ModPasspi: '', NoModPass: '', PassNoExpire: '', Activo: 0, ProximoCambio: '', PeriodoCambio: 0, Estado: 0, NombreTercero: '', ListaAccesos: [] },
    }
  },
  mounted () {
  },
  created () {
    const value = this.$q.localStorage.getItem('usuarioSilaguas')
    if (value) {
      this.Usuario = value
    }
    utils.verificarUsuario(this.Usuario.Login, this)
  },
  methods: {
    salir () {
      this.$router.push('/admin')
    },
    cambiarClaveUsuario () {
      const self = this
      if (this.Usuario.PasswordNuevo === this.Usuario.Password) {
        utils.mensaje('La contraseña nueva no debe ser igual a la anterior, verifique')
        return
      }
      if (this.Usuario.PasswordNuevo !== this.Usuario.PasswordConfirma) {
        utils.mensaje('La contraseña nueva no coincide con la confirmada, verifique')
        return
      }
      if (this.usuario.PasswordNuevo === '') {
        utils.mensaje('La contraseña no puede estar vacia, verifique')
        return
      }
      self.Usuario.Password = self.Usuario.PasswordNuevo
      self.Usuario = usuarios_.cambiarClave(self.Usuario, self)
    }
  }
}
</script>