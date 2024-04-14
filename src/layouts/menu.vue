<template>
  <q-layout container style="height: 90vh">
      <q-header class="bg-light-blue-9">
        <q-toolbar>
          <q-avatar>
            <q-btn flat round dense icon="vpn_key" />
          </q-avatar>
          <q-toolbar-title>SILAMED</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <div>
          <q-form class="q-pa-md">
            <div class="row justify-center q-pt-sm">
              <img class="col-xs-9 col-sm-3 col-md-2" src="~assets/LOGO_SERVAF.png"/>
            </div>
            <div class="row justify-center q-pt-sm">
              <q-input v-model="usuario.LoginUsuario" class="col-xs-12 col-sm-6 col-md-4"
              label="User" outlined lazy-rules :rules="[ val => val && val.length > 0 || 'Falta llenar campo']" />
            </div>
            <div class="row justify-center q-pt-sm">
              <q-input label="Password" class="col-xs-12 col-sm-6 col-md-4" v-model="usuario.PasswordUsuario" @keydown.enter.prevent="login" outlined :type="isPwd ? 'password' : 'text'" :rules="[val => val !== null && val !== '' || 'Falta llenar campo']">
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
  import utils from '../commons/utils.js'
  export default {
    data () {
      return {
        visible: false,
        isPwd: true,
        usuario: { LoginUsuario: '', PasswordUsuario: '', IdPersona: -1 }
      }
    },
    created () {
      const value = this.$q.localStorage.getItem('usuarioSILAMED')
      if (value) {
        this.$router.push('/admin')
      }
    },
    methods: {
      login () {
        const self = this
        self.$q.loading.show()
        api.post('/usuario/autenticacion', this.usuario)
          .then((response) => {
            var datos = response.data
            if (datos.LoginUsuario === null) {
              self.$q.loading.hide()
              utils.mensaje('Verify username or password')
            } else {
              self.$q.localStorage.set('usuarioSILAMED', datos)
              utils.cargarAccesos(datos.IdRol, '-1', this)
              this.ingresar(datos)
            }
            self.$q.loading.hide()
          })
          .catch((error) => {
            utils.mensaje('Fail conexion - Autentication ' + error)
            self.$q.loading.hide()
          })
      },
      salir () {
        this.$q.localStorage.remove('usuarioSILAMED')
        this.$q.localStorage.remove('accesosSILAMED')
        this.$router.push('/')
      },
      ingresar (datos) {
        const self = this
        if (datos.ActivoUsuario === '0') {
          utils.mensaje('El usuario se encuentra inactivo, consulte con el administrador del software')
          self.salir()
        }
        const fechaActual = utils.fechaActual()
        if (fechaActual >= this.convertirFecha(datos.ProximocambioUsuario)) {
          self.$router.push('/Administracion/cambioClave')
          return
        }
        if (datos.ModpasspiUsuario === '1') {
          if (datos.NomodpassUsuario === '1') {
            self.$router.push('/admin')
          } else {
            self.$router.push('/Administracion/cambioClave')
          }
        } else {
          self.$router.push('/admin')
        }
      },
      convertirFecha (fecha) {
        var dia = fecha.slice(0, 2)
        var mes = ''
        var ano = ''
        if (dia[1] === '/') {
          dia = '0' + dia.slice(0, 1)
          mes = fecha.slice(2, 4)
          if (mes[1] === '/') {
            mes = '0' + fecha.slice(1, 3)
            ano = fecha.slice(4, 8)
          } else {
            ano = fecha.slice(5, 9)
          }
        } else {
          mes = fecha.slice(3, 5)
          if (mes[1] === '/') {
            mes = '0' + mes.slice(0, 1)
            ano = fecha.slice(4, 8)
          } else {
            ano = fecha.slice(6, 10)
          }
        }

        const fechaResultado = ano + '-' + mes + '-' + dia
        return fechaResultado
      }
    }
  }
  </script>
