import { Dialog, Notify } from 'quasar';

const alertUtils = {
  mostrarAlerta(mensaje) {
    Dialog.create({
      title: 'Alerta',
      message: mensaje,
      ok: 'OK',
    });
  },
  Notify: async (mensaje, tipoAlerta) => {
    let tipo = 'info';
    let color = 'blue';
    let icon = 'info';

    switch (tipoAlerta) {
      case 'exito':
        tipo = 'positive';
        color = 'green';
        icon = 'check';
        break;
      case 'error':
        tipo = 'negative';
        color = 'red';
        icon = 'close';
        break;
      case 'advertencia':
        tipo = 'warning';
        color = 'orange';
        icon = 'warning';
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
  }
};

export default alertUtils;
