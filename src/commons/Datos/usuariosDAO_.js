import { ref } from 'vue';
import { Dialog, LocalStorage, Loading } from 'quasar';
import { api } from 'boot/axios';
import { useRouter } from 'vue-router';
import utilidades from '../utilidades.js';

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

  verificarUsuario(login) {
    const router = useRouter();
    Loading.show();
    api.get(`/usuario/verificacion/${login}`)
      .then((response) => {
        var usuario = response.data;
        if (!usuario.Login) {
          LocalStorage.remove('usuarioSilaguas');
          LocalStorage.remove('accesosSilaguas');
          router.push('/');
        } else {
          if (usuario.Activo === 1) {
            LocalStorage.set('usuarioSilaguas', usuario);
          } else {
            LocalStorage.remove('usuarioSilaguas');
            localStorage.remove('accesosSilaguas');
            router.push('/Admin');
          }
        }
        Loading.hide();
      })
      .catch((error) => {
        Loading.hide();
      });
  }


  async login(usuB) {
    try {
      const response = await api.post('/usuario/autenticacion', usuB);
      return response.data;
    } catch (error) {
      console.error('Error al obtener datos Login', error);
      throw error;
    }
  }


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


  async cambiarClave(usuario) {
    try {
      const response = await api.post('/usuario/modificaPassword', usuario);
      const datos = response.data;
      if (datos > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      utilidades.mensaje('Cambio Clave - Fallo la conexión ' + error);
      throw error;
    }
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

