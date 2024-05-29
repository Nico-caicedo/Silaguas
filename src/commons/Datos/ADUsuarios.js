import { ref } from "vue";
import { Dialog, LocalStorage, Loading } from "quasar";
import { api } from 'boot/axios';
import { useRouter } from "vue-router";
import utilidades from "src/commons/utilidades";


export default {
  async traerUsuario() {
    const value = LocalStorage.getItem("usuarioSilaguas");
    console.log(value);
    return value;
  },

  async traerAccesos() {
    const value = LocalStorage.getItem("usuarioSilaguas");
    console.log(value.ListaAccesos);
    return value.ListaAccesos;
  },

  async verificarUsuario(login) {
    const router = useRouter();
    Loading.show();
    api
      .get(`/usuario/verificacion/${login}`)
      .then((response) => {
        var usuario = response.data;
        if (!usuario.Login) {
          LocalStorage.remove("usuarioSilaguas");
          LocalStorage.remove("accesosSilaguas");
          router.push("/");
        } else {
          if (usuario.Activo === 1) {
            LocalStorage.set("usuarioSilaguas", usuario);
          } else {
            LocalStorage.remove("usuarioSilaguas");
            localStorage.remove("accesosSilaguas");
            router.push("/Admin");
          }
        }
        Loading.hide();
      })
      .catch((error) => {
        Loading.hide();
      });
  },

  async login(usuario) {
    try {
      const  response = await api.post("usuario/autenticacion", usuario);
      return response.data;
    } catch (error) {
      utilidades.mensaje(`login - Fallo la conexión, ${error}`);
    }
  },

  async cargarAccesos(IdRol, modulo) {
    try {
      const response = await api.get(`acceso/cargar-accesos/${IdRol}/${modulo}`);
      return response.data;
    } catch (error) {
      utilidades.mensaje("Fallo la conexion - Cargar Accesos " + error);
      throw error;
    }
  },

  async cambiarClave(usuario) {
    try {
      const  response = await api.put("usuario/modifica-password", usuario);
      return response.data;
    } catch (error) {
      utilidades.mensaje("Cambio Clave - Fallo la conexión " + error);
      throw error;
    }
  },

  async filterBuscaTercero(val, self) {
    const Loading = ref(false);
    Loading.value = true;
    var listaTerceros = [];
    if (val.length === 0) {
      Loading.value = false;
      return listaTerceros;
    }
    clearTimeout(self.timeout);
    self.timeout = setTimeout(() => {
      api
        .get(`tercero/mostrar-tercero-filtro-gral/${val}`)
        .then((response) => {
          listaTerceros = response.data;
          Loading.value = false;
        })
        .catch((error) => {
          utilidades.mensaje("Fallo la conexion " + error);
          Loading.value = false;
        });
    }, 500);
    return Loading;
  },

  async filterFnUsuario(val) {
    const Loading = ref(false);
    Loading.value = true;
    var listaUsuarios = [];
    if (val.length === 0) {
      Loading.value = false;
      return listaUsuarios;
    }
    if (this.listaUsuariosBD) {
      const arreglo = val.split(" ");
      this.listaUsuarios = [];
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        for (var i = 0; i < this.listaUsuariosBD.length; i++) {
          for (var texto of arreglo) {
            if (isNaN(val) === false) {
              if (val.length < 7) {
                if (
                  this.listaUsuariosBD[i].Tercero.IdTercero.toString() ===
                  val &&
                  val.length < 7
                ) {
                  listaUsuarios.push(this.listaUsuariosBD[i]);
                }
              } else if (
                this.listaUsuariosBD[
                  i
                ].Tercero.Identificacion.toString().includes(val)
              ) {
                listaUsuarios.push(this.listaUsuariosBD[i]);
              } else if (
                this.listaUsuariosBD[i].Tercero.Celular.includes(
                  val.toUpperCase()
                )
              ) {
                listaUsuarios.push(this.listaUsuariosBD[i]);
              } else if (
                this.listaUsuariosBD[i].Tercero.Telefono.includes(
                  val.toUpperCase()
                )
              ) {
                listaUsuarios.push(this.listaUsuariosBD[i]);
              }
            } else {
              if (
                this.listaUsuariosBD[i].RazonSocial.includes(
                  texto.toUpperCase()
                ) ||
                this.listaUsuariosBD[i].Login.includes(texto.toUpperCase()) ||
                this.listaUsuariosBD[i].Tercero.Alias.includes(
                  texto.toUpperCase()
                )
              ) {
                listaUsuarios.push(this.listaUsuariosBD[i]);
              }
              if (listaUsuarios.length) {
                let indice = 0;
                for (const nTD of listaUsuarios) {
                  if (
                    !(
                      nTD.RazonSocial.includes(texto.toUpperCase()) ||
                      nTD.Login.includes(texto.toUpperCase()) ||
                      nTD.Tercero.Alias.includes(texto.toUpperCase())
                    )
                  ) {
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
  },

  async cargarListaUsuarios(Consulta) {
    const Loading = ref(false);
    Loading.value = true;
    var listaUsuariosBD = [];
    api
      .get(`/usuario/usuarios-filtro/${Consulta}`)
      .then((response) => {
        this.listaUsuariosBD = response.data;
        listaUsuariosBD = response.data;
        Loading.value = false;
      })
      .catch((error) => {
        utilidades.mensaje("Fallo la conexion " + error);
        Loading.value = false;
      });
    return Loading;
  }



}
