import { Dialog, Notify, LocalStorage, date, exportFile } from "quasar";
import { api } from "boot/axios";
// import localStorage from 'localStorage'

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== undefined ? formatFn(val) : val;

  formatted =
    formatted === undefined || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

export default {
  mensaje(texto) {
    Dialog.create({
      title: `<span class="text-bold text-blue-10 rounded-borders text-uppercase text-italic bg-grey flex flex-center inset-shadow" >Silaguas</span>`,
      message: `<hr style="color:1px dashed red;">
          <p class="q-pa-sm text-subtitle1 text-center">${texto}</p>
      `,
      ok: {
        label: "OK",
        color: "blue-10",
        textColor: "white",
        style: {
          margin: "auto",
          border: "1px dashed lightblue",
          background: "shadow-1",
        },
      },
      stackButtons: true,
      dark: false,
      html: true,
      style: {
        border: "1px dashed blue",
        background: "shadow-1",
      },
    });
  },
  darFormatofecha: (fechaSinFormato) => {
    return date.formatDate(fechaSinFormato, "YYYY-MM-DD");
  },
  darFormatofechaGUION: (fechaSinFormato) => {
    return date.formatDate(fechaSinFormato, "DD-MM-YYYY");
  },
  darFormatoSelect: (fechaSinFormato) => {
    return date.formatDate(fechaSinFormato, "YYYY/MM/DD");
  },
  darFormatofechaConHoras: (fechaSinFormato) => {
    return date.formatDate(fechaSinFormato, "DD/MM/YYYY HH:mm:ss");
  },
  fechaActualAñoMesDia() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const día = String(hoy.getDate()).padStart(2, "0");
    return `${año}-${mes}-${día}`;
  },

  Notify: async (mensaje, tipoAlerta) => {
    let tipo = "info";
    let color = "blue";
    let icon = "info";

    switch (tipoAlerta) {
      case "exito":
        tipo = "positive";
        color = "green";
        icon = "check";
        break;
      case "error":
        tipo = "negative";
        color = "red";
        icon = "close";
        break;
      case "advertencia":
        tipo = "warning";
        color = "orange";
        icon = "warning";
        break;
    }

    Notify.create({
      type: tipo,
      message: mensaje,
      color: color,
      icon: icon,
      position: "bottom-right",
      progress: true,
    });
  },

  mensajeConfirmacion(mensaje) {
    Dialog.create({
      title: `<span class="text-bold text-blue-10 rounded-borders text-uppercase text-italic bg-grey flex flex-center inset-shadow" >Silaguas</span>`,
      dark: true,
      message: `<hr style="color:1px dashed red;">
          <p class="q-pa-xs text-subtitle1 text-center">${mensaje}</p>
      `,
      ok: {
        label: "Si",
        color: "blue-10",
        textColor: "white",
        style: {
          margin: "",
          border: "1px dashed lightblue",
          background: "shadow-1",
        },
      },
      dark: false,
      html: true,
      style: {
        border: "1px dashed blue",
        background: "shadow-1",
      },
      cancel: {
        label: "No",
        color: "red-6",
        textColor: "white",
        style: {
          margin: "",
          border: "1px dashed red",
          background: "shadow-1",
        },
      },
      persistent: true,
    })
      .onOk(() => {
        return true;
      })
      .onCancel(() => {
        return false;
      });
  },

  fechaActual() {
    return date.formatDate(Date.now(), "DD/MM/YYYY");
  },

  fechaHora() {
    return date.formatDate(Date.now());
  },

  leerMensaje(mensaje) {
    if ("speechSynthesis" in window) {
      const message = new SpeechSynthesisUtterance(mensaje);
      window.speechSynthesis.speak(message);
    } else {
      console.log(
        "La API de síntesis de voz no está soportada en este navegador."
      );
    }
  },

  convertirFecha(fecha) {
    var dia = fecha.slice(0, 2);
    var mes = "";
    var ano = "";
    if (dia[1] === "/") {
      dia = "0" + dia.slice(0, 1);
      mes = fecha.slice(2, 4);
      if (mes[1] === "/") {
        mes = "0" + fecha.slice(1, 3);
        ano = fecha.slice(4, 8);
      } else {
        ano = fecha.slice(5, 9);
      }
    } else {
      mes = fecha.slice(3, 5);
      if (mes[1] === "/") {
        mes = "0" + mes.slice(0, 1);
        ano = fecha.slice(4, 8);
      } else {
        ano = fecha.slice(6, 10);
      }
    }

    const fechaResultado = ano + "-" + mes + "-" + dia;
    return fechaResultado;
  },

  formatoNumero(amount, decimals) {
    amount += "";
    amount = parseFloat(amount.replace(/[^0-9/.]/g, ""));
    decimals = decimals || 0;

    if (isNaN(amount) || amount === 0) {
      return parseFloat(0).toFixed(decimals);
    }
    amount = "" + amount.toFixed(decimals);

    var amountParts = amount.split(",");
    const regexp = /(\d+)(\d{3})/;

    while (regexp.test(amountParts[0])) {
      amountParts[0] = amountParts[0].replace(regexp, "$1" + "," + "$2");
    }

    return amountParts.join(",");
  },

  exportTable(nombreArchivo, tablaE, columnasE) {
    // naive encoding to csv format
    const content = [columnasE.map((col) => wrapCsvValue(col.label))]
      .concat(
        tablaE.map((row) =>
          columnasE
            .map((col) =>
              wrapCsvValue(
                typeof col.field === "function"
                  ? col.field(row)
                  : row[col.field === undefined ? col.name : col.field],
                col.format
              )
            )
            .join(",")
        )
      )
      .join("\r\n");

    if (nombreArchivo === undefined) {
      nombreArchivo = "Informacion_";
    }
    const status = exportFile(nombreArchivo + ".csv", content, "text/csv");

    if (status !== true) {
      this.$q.notify({
        message: "No existen datos para descargar",
        color: "negative",
        icon: "warning",
      });
    }
  },

  sumarDias(date, dias) {
    var res = new Date(date);
    res.setDate(res.getDate() + dias);
    // res.formatDate(Date.now(), 'YYYY-MM-DD')
    return res;
  },
};
