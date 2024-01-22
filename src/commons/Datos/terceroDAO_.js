import { Dialog, LocalStorage, date } from 'quasar'
import { api } from 'boot/axios'
import utilidades from '../utilidades.js'

listaTercerosBD: []
listaTerceros: []

export default class TerceroDAO_ { 
  ConsultaTerceroTodos (self) {
    api.get('/tercero/mostrarTerceroFiltroGral/-1')
      .then((response) => {
      this.listaTercerosBD = response.data
      this.listaTerceros = response.data
      self.$q.loading.hide()
      })
      .catch((error) => {
      utilidades.mensaje('Fallo la conexion ' + error)
      self.$q.loading.hide()
      })
  }
  async filterTercero (val, update, abort, self) {
    if (val.length === 0) {
      abort()
      return
    }
    clearTimeout(self.timeout)
    self.timeout = setTimeout(() => {
      self.listaTerceros = []
      var NuevaListaTerceros = []
      for (const tercero of this.listaTercerosBD) {
        const arreglo = val.split(' ')  
        if (isNaN(val) === false) {
          if (val.length < 7) {
            if (tercero.IdTercero.toString() === val && val.length < 7) {
              update(() => {
                self.listaTerceros.push(tercero)
                return
              })
            }
          } else if (tercero.Identificacion.toString().includes(val)) {
            update(() => {
              self.listaTerceros.push(tercero)
              return
            })
          } else if (tercero.Celular.includes(val)) {
            update(() => {
              self.listaTerceros.push(tercero)
              return
            })
          } else if (tercero.Telefono.includes(val)) {
            update(() => {
              self.listaTerceros.push(tercero)
              return
            })
          }
        } else {
          for (var texto of arreglo) {
            const textoMinuscula = texto.toLowerCase()
            if (tercero.Email.toLowerCase().includes(textoMinuscula) || tercero.Nombre.toLowerCase().includes(textoMinuscula) || tercero.OtrosNombres.toLowerCase().includes(textoMinuscula) || tercero.Apellido1.toLowerCase().includes(textoMinuscula) || tercero.Apellido2.toLowerCase().includes(textoMinuscula) || tercero.RazonSocial.toLowerCase().includes(textoMinuscula) || tercero.Alias.toLowerCase().includes(textoMinuscula) || tercero.Observacion.toLowerCase().includes(textoMinuscula) || tercero.Web.toLowerCase().includes(textoMinuscula) || tercero.Direccion.toLowerCase().includes(textoMinuscula)) {
              update(() => {
                const filtroCN = NuevaListaTerceros.filter(c => c.IdTercero === tercero.IdTercero)
                if (filtroCN.length < 1) {
                  NuevaListaTerceros.push(tercero)
                }
              })
            }
            if (NuevaListaTerceros.length) {
              let indice = 0
              for (const nCliente of NuevaListaTerceros) {
                if (nCliente.Email.toLowerCase().includes(textoMinuscula) || nCliente.Nombre.toLowerCase().includes(textoMinuscula) || nCliente.OtrosNombres.toLowerCase().includes(textoMinuscula) || nCliente.Apellido1.toLowerCase().includes(textoMinuscula) || nCliente.Apellido2.toLowerCase().includes(textoMinuscula) || nCliente.RazonSocial.toLowerCase().includes(textoMinuscula) || nCliente.Alias.toLowerCase().includes(textoMinuscula) || nCliente.Observacion.toLowerCase().includes(textoMinuscula) || nCliente.Web.toLowerCase().includes(textoMinuscula) || nCliente.Direccion.toLowerCase().includes(textoMinuscula)) {
                  indice++
                } else {
                  update(() => {
                    NuevaListaTerceros.splice(indice)
                  })
                }
              }
            }
          }
          self.listaTerceros = NuevaListaTerceros
        }
      }
    }, 650)
  }
}