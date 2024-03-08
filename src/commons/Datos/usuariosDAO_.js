import { Dialog, LocalStorage, date } from 'quasar'
import { api } from 'boot/axios'
import utilidades from '../utilidades.js'

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
  verificarUsuario (login, self) {
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
  login (self, usuB) {
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
  cargarAccesos (rolUsuario, moduloUsuario, self) {
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
  cambiarClave (usuario, self) {
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
  filterBuscaTercero (val, update, abort, self) {
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
  filterFnUsuario (val, update, abort) {
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

  cargarListaUsuarios (Consulta, self) {
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