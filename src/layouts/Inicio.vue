<template>
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
              <img class="col-xs-10 col-sm-5 col-md-3" src="~assets/logo.png"/>
            </div>
            <div class="row justify-center q-pt-sm">
              <q-input v-model="Usuario.Login" class="col-xs-12 col-sm-6 col-md-4"
              label="Usuario" outlined lazy-rules :rules="[ val => val && val.length > 0 || 'Falta llenar campo']" />
            </div>
            <div class="row justify-center q-pt-sm">
              <q-input label="Password" class="col-xs-12 col-sm-6 col-md-4" v-model="Usuario.Password" @keydown.enter.prevent="login()" outlined :type="isPwd ? 'password' : 'text'" :rules="[val => val !== null && val !== '' || 'Falta llenar campo']">
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                </template>
              </q-input>
              </div>
            <div class="row justify-center q-pt-sm">
              <q-btn label="Login" class="col-xs-12 col-sm-6 col-md-4" icon="vpn_key" outline align="center" unelevated @click="login()"/>
            </div>
          </q-form>
        </div>
      </q-page-container>
    </q-layout>
  </template>

<style>
</style>

<script>
import { api } from 'boot/axios'
import utilidades from '../commons/utilidades.js'
import UsuDao from '../commons/Datos/usuariosDAO_.js'
export default {
  data () {
    return {
      usuDao: null,
      visible: false,
      isPwd: true,
      Usuario: { Login: '', IdRol: '', IdPersona: -1, Password: '', LoginCrea: '', Observacion: '', FIngreso: '', ModPasspi: '', NoModPass: 0, PassNoExpire: 0, Activo: 0, ProximoCambio: '', PeriodoCambio: 0, Estado: 0, NombreTercero: '' }
    }
  },
  created () {
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
      console.log(self, self.Usuario)

      // self.Usuario = usuarios_.login(self, self.Usuario)
    },
    limpiar(){
      console.Log(this.Usuario.Login )
      this.Usuario.Password = null
    }
  }
}
</script>