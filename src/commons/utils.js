import { Dialog, Notify, Loading, QSpinnerFacebook } from 'quasar'
const Utils = {
  confirmarAccion: async (mensaje) => {
    return new Promise((resolve) => {
      Dialog.create({
        title: 'Confirmación',
        message: mensaje,
        cancel: true,
        persistent: true
      }).onOk(() => {
        resolve(true)
      }).onCancel(() => {
        resolve(false)
      })
    })
  },

  regla: (val) => {
    if (!val || val.lenght === 0) {
      return 'Este campo es obligatorio. *';
    } else {
      return true;
    }
  },

  reglaBloqueada: (val, estado) => {
    if (!estado && (!val || val.length === 0)) {
      return 'Este campo es obligatorio.';
    } else {
      return true;
    }
  },

  respuesta: async (res) => {
    const tipo = await res.IsExito ? 'positive' : 'negative'
    Notify.create({
      type: tipo,
      progress: true,
      position: "bottom-left",
      message: res.Mensaje
    })
  },

  // dialog: async (dato) => {
  //   const { title, message, position, type } = dato;
  //   let formattedMessage = '';
  //   try {
  //     const jsonData = JSON.parse(message);
  //     formattedMessage = <table border="1px solid #ddd"  style="width: 100%;border-collapse: collapse;">;
  //     Object.entries(jsonData).forEach(([key, value]) => {
  //       formattedMessage += <tr><td><strong>${key}</strong></td><td>${value}</td></tr>;
  //     });
  //     formattedMessage += </table>;
  //   } catch (error) {
  //     formattedMessage = message;
  //   }
  //   Dialog.create({
  //     title: title,
  //     type: type,
  //     message: formattedMessage,
  //     position: position,
  //     html: true
  //   });
  // },

  tiempoActual: async () => {
    var today = new Date();

    // Formatear la fecha como "año-mes-día hora:minuto:segundo"
    var formattedDate = today.getFullYear() + "-" +
      ("0" + (today.getMonth() + 1)).slice(-2) + "-" +
      ("0" + today.getDate()).slice(-2) + " " +
      ("0" + today.getHours()).slice(-2) + ":" +
      ("0" + today.getMinutes()).slice(-2) + ":" +
      ("0" + today.getSeconds()).slice(-2);
    return formattedDate;

  },

  tiempoDate: async () => {
    var fechaActual = new Date();
    fechaActual.setUTCHours(fechaActual.getUTCHours() - 5);
    var fechaColombia = fechaActual.toISOString().slice(0, 10);
    return fechaColombia;

  },

  datoUsuario: async () => {
    try {
      const authVerification = await localStorage.getItem("authVerification");
      const cleanString = authVerification.replace('__q_strn|', '');
      const usuario = JSON.parse(cleanString);
      return usuario;
    } catch (error) {
      console.error("Error al obtener el ID de usuario:", error);
      return null;
    }
  },

  loadingNotify: async (estado, mensaje) => {

    if (estado) {

      Loading.show({
        backgroundColor: 'black',
        message: mensaje,
        messageColor: 'white'
      })
    } else {
      Loading.hide()
    }
  }

}


export default Utils
