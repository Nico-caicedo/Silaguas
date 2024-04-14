import { Dialog, LocalStorage, date, exportFile } from 'quasar'
import { api } from 'boot/axios'
// import localStorage from 'localStorage'

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== undefined
    ? formatFn(val)
    : val

  formatted = formatted === undefined || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

export default {
  mensaje(texto) {
    Dialog.create({
      title: `<span class="text-bold text-blue-10 rounded-borders text-uppercase text-italic bg-grey flex flex-center inset-shadow" >Silaguas</span>`,
      message: `<hr style="color:1px dashed red;">
          <p class="q-pa-sm text-subtitle1 text-center">${texto}</p>
      `,
      dark: true,
      html: true, // Establecer esta opción en true para que el contenido se interprete como HTML
      style: {
        'border': '1px dashed white',
        'background':'shadow-1',
      }
    });
  },


  mensajeConfirmacion(mensaje) {
    Dialog.create({
      title: 'Silaguas',
      dark: true,
      message: mensaje,
      cancel: true,
      persistent: true
    }).onOk(() => {
      return true
    }).onCancel(() => {
      return false
    })
  },
  fechaActual() {
    return date.formatDate(Date.now(), 'YYYY-MM-DD')
  },
  fechaHora() {
    return date.formatDate(Date.now())
  },
  convertirFecha(fecha) {
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
  },
  formatoNumero(amount, decimals) {
    amount += ''
    amount = parseFloat(amount.replace(/[^0-9/.]/g, ''))
    decimals = decimals || 0

    if (isNaN(amount) || amount === 0) {
      return parseFloat(0).toFixed(decimals)
    }
    amount = '' + amount.toFixed(decimals)

    var amountParts = amount.split(',')
    const regexp = /(\d+)(\d{3})/

    while (regexp.test(amountParts[0])) {
      amountParts[0] = amountParts[0].replace(regexp, '$1' + ',' + '$2')
    }

    return amountParts.join(',')
  },
  exportTable(nombreArchivo, tablaE, columnasE) {
    // naive encoding to csv format
    const content = [columnasE.map(col => wrapCsvValue(col.label))].concat(
      tablaE.map(row => columnasE.map(col => wrapCsvValue(
        typeof col.field === 'function'
          ? col.field(row)
          : row[col.field === undefined ? col.name : col.field],
        col.format
      )).join(','))
    ).join('\r\n')

    if (nombreArchivo === undefined) {
      nombreArchivo = 'Informacion_'
    }
    const status = exportFile(
      nombreArchivo + '.csv',
      content,
      'text/csv'
    )

    if (status !== true) {
      this.$q.notify({
        message: 'No existen datos para descargar',
        color: 'negative',
        icon: 'warning'
      })
    }
  },
  sumarDias(date, dias) {
    var res = new Date(date)
    res.setDate(res.getDate() + dias);
    // res.formatDate(Date.now(), 'YYYY-MM-DD')
    return res
  }
}
