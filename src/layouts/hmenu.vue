import { ref } from 'vue';
import { Dialog, LocalStorage, Loading } from 'quasar';
import { api } from 'boot/axios';
import utilidades from '../utilidades.js';

listaUsuarios: []
listaUsuariosBD: []

export default class UsuariosDAO_ {
  traerUsuario () {
    const value = LocalStorage.getItem('usuarioSilaguas')
    return value
  }
  traerAccesos () {
    const value = LocalStorage.getItem('usuarioSilaguas')
    const accesos = value.ListaAccesos
    return accesos
  }

  async verificarUsuario(login) {
    Loading.show();
    api.get(`/usuario/verificacion/${login}`)
      .then((response) => {
        var usuario = response.data;
        if (!usuario.Login) {
          LocalStorage.remove('usuarioSilaguas');
          LocalStorage.remove('accesosSilaguas');
          $router.push('/');
        } else {
          if (usuario.Activo === 1) {
            LocalStorage.set('usuarioSilaguas', usuario);
          } else {
            LocalStorage.remove('usuarioSilaguas');
            localStorage.remove('accesosSilaguas');
            $router.push('/');
          }
        }
        Loading.hide();
      })
      .catch((error) => {
        Loading.hide();
      });
  }

  async login (self, usuB) {
    self.$q.loading.show()
    api.post('/usuario/autenticacion', usuB)
      .then((response) => {
        var usuario = response.data
        if (usuario.Login === null) {
          self.$q.loading.hide()
          utilidades.mensaje('Verifique usuario o passwordS')
        } else {
          self.$q.localStorage.set('usuarioSilaguas', usuario)
          // cargarAccesos(usuario.IdRol, '-1', self)
          clearTimeout(this.timeout)
          self.timeout = setTimeout(() => {
            // const accesos = usuario.ListaAccesos
            self.menuElements = usuario.ListaAccesos
            self.$router.push('/Admin')
          }, 500)
        }
        self.$q.loading.hide()
      })
      .catch((error) => {
        utilidades.mensaje('Fail conexion - Autentication ' + error)
        self.$q.loading.hide()
      })
  }

  // login (self, usuB) {
  //   self.$q.loading.show()
  //   api.post('/usuario/autenticacion', usuB)
  //     .then((response) => {
  //       var usuario = response.data
  //       if (usuario.Login === null) {
  //         self.$q.loading.hide()
  //         utilidades.mensaje('Verifique usuario o passwordS')
  //       } else {
  //         self.$q.localStorage.set('usuarioSilaguas', usuario)
  //         // cargarAccesos(usuario.IdRol, '-1', self)
  //         clearTimeout(this.timeout)
  //         self.timeout = setTimeout(() => {
  //           // const accesos = usuario.ListaAccesos
  //           self.menuElements = usuario.ListaAccesos
  //           self.$router.push('/Admin')
  //         }, 500)
  //       }
  //       self.$q.loading.hide()
  //     })
  //     .catch((error) => {
  //       utilidades.mensaje('Fail conexion - Autentication ' + error)
  //       self.$q.loading.hide()
  //     })
  // }

  //  async login(usuB) {
  //   try {
  //      const response = await api.post('/usuario/autenticacion', usuB);
  //      return response.data;
  //    } catch (error) {
  //      console.error('Error al obtener datos Login', error);
  //      throw error;
  //    }
  //  }

  // login(usuB) {
  //   Loading.show();
  //   api.post('/usuario/autenticacion', usuB)
  //     .then((response) => {
  //       var usuario = response.data;
  //       if (usuario.Login === null) {
  //         Loading.hide();
  //         utilidades.mensaje('Verifique Usuario o password');
  //       } else {
  //         LocalStorage.set('usuarioSilaguas', usuario);
  //         clearTimeout(this.timeout);
  //         timeout = setTimeout(() => {
  //           // menuElements = usuario.ListaAccesos;
  //           $router.push('/Admin');
  //         }, 500);
  //       }
  //       Loading.hide();
  //     })
  //     .catch((error) => {
  //       utilidades.mensaje('Fail conexion - Autentication ' + error);
  //       Loading.hide();
  //     });
  // }


  async cargarAccesos(rolUsuario, moduloUsuario) {
    try {
      const response = await api.get(`/usuario/cargarAccesos/${rolUsuario}/${moduloUsuario}`);
      const accesos = response.data;
      LocalStorage.set('accesosSilaguas', accesos);
      return accesos;
    } catch (error) {
      utilidades.mensaje('Fallo la conexion ' + error);
      throw error;
    }
  }




  cambiarClave(usuario) {
    const Loading = ref(false);
    Loading.value = true;
    api.post('/usuario/modificaPassword', usuario)
      .then((response) => {
        var datos = response.data;
        if (datos > 0) {
          utilidades.mensaje('La contraseña ha sido modificada con éxito');
          // this.$router.push('/admin');
        } else {
          utilidades.mensaje('La contraseña no fue modificada, comuniquese con el administrador');
        }
        Loading.value = false;
      })
      .catch((error) => {
        utilidades.mensaje('Cambio Clave - Fallo la conexion ' + error);
        Loading.value = false;
      });
    return Loading;
  }

  filterBuscaTercero(val, self) {
    const Loading = ref(false);
    Loading.value = true;
    var listaTerceros = [];
    if (val.length === 0) {
      Loading.value = false;
      return listaTerceros;
    }
    clearTimeout(self.timeout);
    self.timeout = setTimeout(() => {
      api.get(`/tercero/mostrarTerceroFiltroGral/${val}`)
        .then((response) => {
          listaTerceros = response.data;
          Loading.value = false;
        })
        .catch((error) => {
          utilidades.mensaje('Fallo la conexion ' + error);
          Loading.value = false;
        });
    }, 500);
    return Loading;
  }

  filterFnUsuario(val) {
    const Loading = ref(false);
    Loading.value = true;
    var listaUsuarios = [];
    if (val.length === 0) {
      Loading.value = false;
      return listaUsuarios;
    }
    if (this.listaUsuariosBD) {
      const arreglo = val.split(' ');
      this.listaUsuarios = [];
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        for (var i = 0; i < this.listaUsuariosBD.length; i++) {
          for (var texto of arreglo) {
            if (isNaN(val) === false) {
              if (val.length < 7) {
                if (this.listaUsuariosBD[i].Tercero.IdTercero.toString() === val && val.length < 7) {
                  listaUsuarios.push(this.listaUsuariosBD[i]);
                }
              } else if (this.listaUsuariosBD[i].Tercero.Identificacion.toString().includes(val)) {
                listaUsuarios.push(this.listaUsuariosBD[i]);
              } else if (this.listaUsuariosBD[i].Tercero.Celular.includes(val.toUpperCase())) {
                listaUsuarios.push(this.listaUsuariosBD[i]);
              } else if (this.listaUsuariosBD[i].Tercero.Telefono.includes(val.toUpperCase())) {
                listaUsuarios.push(this.listaUsuariosBD[i]);
              }
            } else {
              if (this.listaUsuariosBD[i].RazonSocial.includes(texto.toUpperCase()) || this.listaUsuariosBD[i].Login.includes(texto.toUpperCase()) || this.listaUsuariosBD[i].Tercero.Alias.includes(texto.toUpperCase())) {
                listaUsuarios.push(this.listaUsuariosBD[i]);
              }
              if (listaUsuarios.length) {
                let indice = 0;
                for (const nTD of listaUsuarios) {
                  if (!(nTD.RazonSocial.includes(texto.toUpperCase()) || nTD.Login.includes(texto.toUpperCase()) || nTD.Tercero.Alias.includes(texto.toUpperCase()))) {
                    listaUsuarios.splice(indice, 1);
                  }
                  indice++;
                }
              }
            }
          }
        }
        Loading.value = false;
      }, 250);
    }
    return Loading;
  }

  cargarListaUsuarios(Consulta) {
    const Loading = ref(false);
    Loading.value = true;
    var listaUsuariosBD = [];
    api.get(`/usuario/usuariosFiltro/${Consulta}`)
      .then((response) => {
        this.listaUsuariosBD = response.data;
        listaUsuariosBD = response.data;
        Loading.value = false;
      })
      .catch((error) => {
        utilidades.mensaje('Fallo la conexion ' + error);
        Loading.value = false;
      });
    return Loading;
  }
}



















































import { Dialog, LocalStorage, date } from 'quasar'
import { api } from 'boot/axios'
import utilidades from '../utilidades.js'

listaUsuarios: []
listaUsuariosBD: []

export default class UsuariosDAO_ {
  traerUsuario() {
    const value = LocalStorage.getItem('usuarioSilaguas')
    return value
  }
  traerAccesos() {
    const value = LocalStorage.getItem('usuarioSilaguas')
    const accesos = value.ListaAccesos
    return accesos
  }
  verificarUsuario(login, self) {
    self.$q.loading.show()
    api.get(`/usuario/verificacion/${login}`)
      .then((response) => {
        var usuario = response.data
        if (!usuario.Login) {
          self.$q.localStorage.remove('usuarioSilaguas')
          self.$q.localStorage.remove('accesosSilaguas')
          self.$router.push('/')
        } else {
          if (usuario.Activo === 1) {
            self.$q.localStorage.set('usuarioSilaguas', usuario)
          } else {
            self.$q.localStorage.remove('usuarioSilaguas')
            self.$q.localStorage.remove('accesosSilaguas')
            self.$router.push('/')
          }
        }
        self.$q.loading.hide()
      })
      .catch((error) => {
        self.$q.loading.hide()
      })

  }
  login(self, usuB) {
    self.$q.loading.show()
    api.post('/usuario/autenticacion', usuB)
      .then((response) => {
        var usuario = response.data
        if (usuario.Login === null) {
          self.$q.loading.hide()
          utilidades.mensaje('Verifique usuario o password')
        } else {
          self.$q.localStorage.set('usuarioSilaguas', usuario)
          // cargarAccesos(usuario.IdRol, '-1', self)
          clearTimeout(this.timeout)
          self.timeout = setTimeout(() => {
            // const accesos = usuario.ListaAccesos
            self.menuElements = usuario.ListaAccesos
            self.$router.push('/Admin')
          }, 500)
        }
        self.$q.loading.hide()
      })
      .catch((error) => {
        utilidades.mensaje('Fail conexion - Autentication ' + error)
        self.$q.loading.hide()
      })
  }
  cargarAccesos(rolUsuario, moduloUsuario, self) {
    self.$q.loading.show()
    api.get(`/usuario/cargarAccesos/${rolUsuario}/${moduloUsuario}`)
      .then((response) => {
        // self.menuElements = response.data
        self.$q.localStorage.set('accesosSilaguas', response.data)
        self.$q.loading.hide()
      })
      .catch((error) => {
        mensaje('Fallo la conexion ' + error)
        self.$q.loading.hide()
      })
  }
  cambiarClave(usuario, self) {
    self.$q.loading.show()
    api.post('/usuario/modificaPassword', usuario)
      .then((response) => {
        var datos = response.data
        if (datos > 0) {
          utilidades.mensaje('La contraseña ha sido modificada con éxito')
          // self.$router.push('/admin')
        } else {
          utilidades.mensaje('La contraseña no fue modificada, comuniquese con el administrador')
        }
        self.$q.loading.hide()
      })
      .catch((error) => {
        utilidades.mensaje('Cambio Clave - Fallo la conexion ' + error)
        self.$q.loading.hide()
      })
  }
  filterBuscaTercero(val, update, abort, self) {
    var listaTerceros = []
    if (val.length === 0) {
      abort()
      return
    }
    clearTimeout(self.timeout)
    self.timeout = setTimeout(() => {
      api.get(`/tercero/mostrarTerceroFiltroGral/${val}`)
        .then((response) => {
          update(() => {
            listaTerceros = response.data
            self.$q.loading.hide()
          })
        })
        .catch((error) => {
          utilidades.mensaje('Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    }, 500)
    return listaTerceros
  }
  filterFnUsuario(val, update, abort) {
    if (val.length === 0) {
      abort()
      return
    }
    if (this.listaUsuariosBD) {
      const arreglo = val.split(' ')
      this.listaUsuarios = []
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        for (var i = 0; i < this.listaUsuariosBD.length; i++) {
          for (var texto of arreglo) {
            if (isNaN(val) === false) {
              if (val.length < 7) {
                if (this.listaUsuariosBD[i].Tercero.IdTercero.toString() === val && val.length < 7) {
                  update(() => {
                    const tercero = this.listaUsuariosBD[i]
                    this.listaUsuarios.push(tercero)
                  })
                }
              } else if (this.listaUsuariosBD[i].Tercero.Identificacion.toString().includes(val)) {
                update(() => {
                  const tercero = this.listaUsuariosBD[i]
                  this.listaUsuarios.push(tercero)
                })
              } else if (this.listaUsuariosBD[i].Tercero.Celular.includes(val.toUpperCase())) {
                update(() => {
                  const tercero = this.listaUsuariosBD[i]
                  this.listaUsuarios.push(tercero)
                })
              } else if (this.listaUsuariosBD[i].Tercero.Telefono.includes(val.toUpperCase())) {
                update(() => {
                  const tercero = this.listaUsuariosBD[i]
                  this.listaUsuarios.push(tercero)
                })
              }
            } else {
              if (this.listaUsuariosBD[i].RazonSocial.includes(texto.toUpperCase()) || this.listaUsuariosBD[i].Login.includes(texto.toUpperCase()) || this.listaUsuariosBD[i].Tercero.Alias.includes(texto.toUpperCase())) {
                update(() => {
                  const usuario = this.listaUsuariosBD[i]
                  // const filtroCN = this.listaUsuarios.filter(c => c.Login === usuario.Login)
                  // if (filtroCN.length < 1) {
                  //  this.listaUsuarios.push(usuario)
                  // }
                  this.listaUsuarios.push(usuario)
                })
              }
              if (this.listaUsuarios.length) {
                let indice = 0
                for (const nTD of this.listaUsuarios) {
                  if (nTD.RazonSocial.includes(texto.toUpperCase()) || nTD.Login.includes(texto.toUpperCase()) || nTD.Tercero.Alias.includes(texto.toUpperCase())) {
                    indice++
                  } else {
                    update(() => {
                      this.listaUsuarios.splice(indice)
                    })
                  }
                }
              }
            }
          }
        }
      }, 250)
    }
  }

  cargarListaUsuarios(Consulta, self) {
    api.get(`/usuario/usuariosFiltro/${Consulta}`)
      .then((response) => {
        this.listaUsuariosBD = response.data
        this.listaUsuarios = response.data
        self.$q.loading.hide()
      })
      .catch((error) => {
        utilidades.mensaje('Fallo la conexion ' + error)
        self.$q.loading.hide()
      })
  }
}






























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
