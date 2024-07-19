<template>
  <q-page>
    <div class="row justify-end q-gutter-x-lg q-ma-sm">
      <q-btn label="Grafico" style="background-color: #01B9FF;" icon="bar_chart" to="/Administracion/Dashboard" />
      <q-btn label="Carta Control" v-if="rol === 'dirCalidad'" style="background-color: #01B9FF;" icon="dangerous"
        class="bg-alert" @click="section = 'cartaControl'" />
      <q-btn label="resultados" style="background-color: #BFFE00;" icon="receipt_long" class="bg-alert"
        @click="section = 'resultados'" />
    </div>

    <q-page style="min-height: unset;" v-if="section === 'cartaControl'">
      <q-scroll-area style="height: 600px;">
        <q-form style="height: 300px;">
          <div>
            <q-btn label="Consultar limites" style="background-color: #FF5D25;" icon="dangerous" class="bg-alert"
              @click="activar" :disabled="!VerLimites" />
          </div>

          <div class="column justify-around q-gutter-y-lg q-mt-xl">
            <q-dialog v-model="inception">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Limites de {{ MetodoRPD.label }} {{ Metodo.label }}</div>
                </q-card-section>
                <q-card-section v-html="Showlimite" class="q-pt-none"></q-card-section>
                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="Close" class="text-white bg-negative" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>

            <div class="row justify-center items-center q-gutter-x-xl q-mt-none" style="height:420px">
              <div class="q-gutter-y-xl col-xs-12 col-sm-12" style="width: 30%;">
                <div class="options row items-center justify-center text-h6"
                     :class="{ selected: shape === 'Verificacion' }" @click="selectOption('Verificacion')">
                  Carta Control Verificación
                </div>
                <div class="options row items-center justify-center text-h6"
                     :class="{ selected: shape === 'RPD' }" @click="selectOption('RPD')">
                  Carta Control RPD
                </div>
                <div class="row justify-center" style="height:100%">
                  <q-btn v-if="show" class="color-white q-ma-sm text-h6"
                         style="background: #00F370;width: 120px; height: 50px;"
                         label="Enviar" @click="ValidacionesCartVerificacion" :disabled="!opcionSeleccionada1" />
                  <q-btn v-else class="color-white q-ma-sm text-h6"
                         style="width: 120px; height: 50px; background: #00F370;"
                         @click="ValidacionesCartRPD" label="Enviar" :disabled="!opcionSeleccionada2" />
                </div>
              </div>

              <div v-if="show" class="q-gutter-y-lg col-12 col-sm-12" style="width: 40%; height: 100%;">
                <q-select filled v-model="Metodo" :options="MetodoSelect" label="Método"
                          @update:model-value="Concentraciones(); VericarOpt();" />
                <div class="shadow-1 q-pa-md" style="width: 100%; height: 325px; background-color: rgb(238, 238, 238);">
                  <q-scroll-area style="height: 300px;">
                    <q-option-group class="text-h5" :options="row" type="checkbox" v-model="groups"
                                    @update:model-value="VericarOpt" />
                  </q-scroll-area>
                </div>
              </div>

              <div v-else class="column items-center q-pt-xl q-gutter-y-lg" style="width: 40%; height: 90%;">
                <q-select style="width: 65%;" filled v-model="MetodoRPD" :options="MetodoSelect" label="Método"
                          @update:model-value="VericarOpt" />
                <q-select filled class="q-mt-xl" style="width: 65%;" v-model="matriz" :options="matrizSelect"
                          @update:model-value="VericarOpt(); Concentraciones();" label="Tipo Matriz" />
              </div>
            </div>

            <div class="q-px-lg" style="width: 100%; background-color: rgb(238, 238, 238);">
              <div class="row items-center justify-center relative-position q-pa-sm">
                <h3 class="row justify-center q-my-sm">Verificación Metrológica</h3>
              </div>
              <div class="q-pa-md">
                <q-scroll-area style="height: 190px;">
                  <div class="row justify-center q-gutter-sm">
                    <q-intersection v-if="show" v-for="(item, index) in groups" :key="item.id" class="example-item">
                      <q-card class="q-ma-sm">
                        <q-card-section>
                          <div class="text-h5">Concentración #{{ index + 1 }}</div>
                          <div class="text-h4">{{ `Valor: ${item.valor} ${item.unidad}` }}</div>
                          <q-input outlined v-model="valores[index]" step="any" type="number" label="Valor" lazy-rules
                                   :rules="[val => val !== null && val !== '' || 'Ingrese un valor']" />
                        </q-card-section>
                      </q-card>
                    </q-intersection>
                    <q-intersection v-else v-for="(item, index) in [1]" :key="index" class="example-item"
                                    style="width: 25%;">
                      <q-card class="q-ma-sm">
                        <q-card-section>
                          <div class="text-h5">Metodo: {{ MetodoRPD.label }}</div>
                          <div class="text-h5"> Tipo matriz: {{ matriz.label }}</div>
                          <q-input outlined v-model="LecturaRPD" step="any" type="number" label="Valor" lazy-rules />
                        </q-card-section>
                      </q-card>
                    </q-intersection>
                  </div>
                </q-scroll-area>
              </div>
            </div>
          </div>

          <q-dialog v-model="confirm" persistent>
            <q-card style="min-width: 350px">
              <q-card-section>
                <div class="text-h6">Observación</div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <q-input dense autogrow v-model="observacion" autofocus @keyup.enter="prompt = false" />
              </q-card-section>
              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn flat label="Add address" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-form>
      </q-scroll-area>
    </q-page>

    <q-page style="height: 300px; min-height: unset;" v-if="section === 'resultados'">
      <resultados />
    </q-page>
  </q-page>
</template>

<script setup>
import { api } from 'boot/axios';
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import utilidades from '../../commons/utilidades.js';
import resultados from '../Administracion/ResultadosCarta.vue';

const $q = useQuasar();
const $router = useRouter();

const rol = ref('dirCalidad');
const section = ref('resultados');
const groups = ref([]);
const LecturaRPD = ref('');
const cantidad = ref('');
const shape = ref('Verificacion');
const valores = ref([]);
const verificacion = ref(true);
const show = ref(true);
const MetodoSelect = ref([]);
const matrizSelect = ref([]);
const Metodo = ref('');
const matriz = ref([]);

const rows = ref([]);
const row = ref([]);
const usuario = ref([]);
const confirm = ref(false);
const errores = ref([]);
const observacion = ref(null);

const Limites = ref([]);
const valoresAnteriores = ref([]);
const opcionSeleccionada1 = ref(false);
const opcionSeleccionada2 = ref(false);
const valorRPD = ref('');
const mensajess = ref([]);
const valoresAnterioresO = ref([]);
const clavesObserva = ref([]);
const observacions = ref([]);
const inception = ref(false);
const Showlimite = ref([]);
const VerLimites = ref(false);
const MetodoRPD = ref('');
const Repetir = ref(0);

const components = { resultados };

const grafico = () => {
  $router.push('Dashboard.vue');
};

const activar = () => {
  let mensajesValor = '';
  console.log('Limites:', Limites.value);
  if (Metodo.value) {
    inception.value = true;
    for (const clave in Limites.value) {
      if (Limites.value.hasOwnProperty(clave)) {
        const valor = Limites.value[clave];
        console.log('row:', row.value[0].value.unidad);
        mensajesValor += `<strong>Solución ${clave} ${row.value[0].value.unidad}</strong><br>`;
        mensajesValor += `LCS: ${valor.LCSresultado} - LCI: ${valor.LCIresultado}<br>`;
        mensajesValor += `LAS: ${valor.LASresultado} - LAI: ${valor.LAIresultado}<br>`;
        mensajesValor += `+1s: ${valor.MasDes} / -1s: ${valor.MenosDes}<br>`;
        mensajesValor += `Media: ${valor.Media.toFixed(2)}<br><br>`;
      }
    }
  } else if (MetodoRPD.value) {
    inception.value = true;
    const limite = Limites.value;
    console.log('Limites:', Limites.value);
    mensajesValor += `<strong>Limites RPD</strong><br>`;
    mensajesValor += `LCS: ${limite.LCSresultado}<br>`;
    mensajesValor += `LAS: ${limite.LASresultado}<br>`;
    mensajesValor += `+1s: ${limite.MasDes}<br>`;
    mensajesValor += `Media: ${limite.Media.toFixed(2)}<br><br>`;
  } else {
    mensajesValor = 'Sin Limites aún';
  }
  Showlimite.value = mensajesValor;
};

const VericarOpt = () => {
  opcionSeleccionada1.value = groups.value.length > 0;
  VerLimites.value = !!Metodo.value || !!matriz.value;
  opcionSeleccionada2.value = !!MetodoRPD.value || !!matriz.value;
};

const limpiarJSON = () => {
  const elementosLimites = {};
  for (const clave in Limites.value) {
    if (Array.isArray(Limites.value[clave])) {
      elementosLimites[clave] = Limites.value[clave].map(elemento => elemento);
      elementosLimites[clave] = elementosLimites[clave][0];
    } else {
      elementosLimites[clave] = Limites.value[clave];
    }
  }

  const elementosValoresAnteriores = {};
  for (const clave in valoresAnteriores.value) {
    if (Array.isArray(valoresAnteriores.value[clave])) {
      const elementos = valoresAnteriores.value[clave].map(arrayInterno => arrayInterno['Valor']);
      elementosValoresAnteriores[clave] = elementos;
    } else {
      elementosValoresAnteriores[clave] = valoresAnteriores.value[clave];
    }
  }

  valoresAnterioresO.value = elementosValoresAnteriores;
  Limites.value = elementosLimites;
  valoresAnteriores.value = elementosValoresAnteriores;
};

const OnSubmit = () => {
  const valoresEmparejados = {};
  for (let i = 0; i < groups.value.length; i++) {
    if (valores.value[i] !== undefined) {
      const id = groups.value[i].value;
      let valorAnterior = valoresAnteriores.value[id];
      if (valorAnterior !== undefined) {
        if (Array.isArray(valorAnterior)) {
          valorAnterior.push(valores.value[i]);
        } else {
          valoresAnteriores.value[id] = [valorAnterior, valores.value[i]];
        }
      } else {
        valoresAnteriores.value[id] = [valores.value[i]];
      }
      valoresEmparejados[id] = true;
    }
  }
  for (const key in valoresAnteriores.value) {
    if (!valoresEmparejados[key]) {
      delete valoresAnteriores.value[key];
    }
  }
};

const selectOption = option => {
  shape.value = shape.value === option ? null : option;
  if (shape.value === 'RPD') {
    show.value = false;
    Metodo.value = '';
    row.value = [];
    opcionSeleccionada1.value = false;
    groups.value = [];
    VerLimites.value = false;
  } else if (shape.value === 'Verificacion') {
    show.value = true;
    matriz.value = '';
    opcionSeleccionada2.value = false;
    VerLimites.value = false;
    MetodoRPD.value = '';
  }
};

const mostrar = () => {
  if (shape.value === 'RPD') {
    RPD.value = true;
  } else if (shape.value === 'Verificacion') {
    verificacion.value = false;
  }
};

const ObtenerMetodos = () => {
  $q.loading.show();
  api.get('/Metodo/MostrarMetodo')
    .then(response => {
      const listMetodo = response.data.ListMetodo;
      MetodoSelect.value = listMetodo.map(item => ({
        label: item.Nombre,
        id: item.IdMetodo,
      }));
      $q.loading.hide();
    })
    .catch(error => {
      utilidades.mensaje('Tipo Identificacion1 - Fallo la conexion ' + error);
      $q.loading.hide();
    });
};

const matrices = () => {
  $q.loading.show();
  api.get('/Matriz/ListarMatrices')
    .then(response => {
      const Matrices = response.data.ListarMatrices;
      console.log(Matrices);
      matrizSelect.value = Matrices.map(item => ({
        label: item.Nombre,
        id: item.IdTipoMatriz,
      }));
      console.log('matriz:', matrizSelect);
      $q.loading.hide();
    })
    .catch(error => {
      utilidades.mensaje('Tipo Identificacion2 - Fallo la conexion ' + error);
      $q.loading.hide();
    });
};

const Concentraciones = () => {
  groups.value = [];
  VericarOpt();
  if (Metodo.value) {
    ObtenerTendencias();
    $q.loading.show();
    api.post(`/solucion/CallSolPatron/${Metodo.value.id}`)
      .then(response => {
        console.log('response:', response);
        cantidad.value = response.data.length;
        rows.value = response.data.map(item => ({
          descripcion: item.Descripcion,
          valor: item.Concentracion,
          unidad: item.IdUnidadMedida,
          IdSolucion: item.IdSolucion,
        }));

        row.value = response.data.map(item => ({
          label: `Concentración ${item.Concentracion} ${item.IdUnidadMedida}`,
          value: {
            value: item.Concentracion,
            id: item.IdSolucion,
            valor: item.Concentracion,
            unidad: item.IdUnidadMedida,
            descripcion: item.Descripcion,
          },
          IdSolucion: item.IdSolucion,
        }));
        console.log(row);
        $q.loading.hide();
      })
      .catch(error => {
        utilidades.mensaje('Tipo Identificacion3 - Fallo la conexion ' + error);
        $q.loading.hide();
      });
  }

  if (MetodoRPD.value) {
    ObtenerTendenciasRPD();
  }
};

const ValidacionesCartVerificacion = () => {
  if (valores.value.length === 0) {
    triggerNegative();
    return;
  } else if (valores.value.length !== groups.value.length) {
    AllCampos();
    return;
  }
  OnSubmit();
  console.log('valoresAnteriores:', valoresAnteriores.value);
  console.log('Limites:', Limites.value);

  const mensajesAlerta = {};
  for (const clave in valoresAnteriores.value) {
    if (valoresAnteriores.value.hasOwnProperty(clave)) {
      const valorArray = valoresAnteriores.value[clave];
      const limiteArray = Limites.value;
      clavesObserva.value.push(clave);
      if (typeof valorArray === 'object' && valorArray !== null) {
        const valor = valorArray[valorArray.length - 1];
        const valorpeniultimo = valorArray[valorArray.length - 2];
        console.log('Ultimo valor:', valor);
        console.log('Penultimo valor:', valorpeniultimo);

        const limiteLCS = parseFloat(limiteArray[clave].LCSresultado);
        const limiteLAS = parseFloat(limiteArray[clave].LASresultado);
        const limiteLAI = parseFloat(limiteArray[clave].LAIresultado);
        const limiteLCI = parseFloat(limiteArray[clave].LCIresultado);
        const MasDes = parseFloat(limiteArray[clave].MasDes);
        const MenosDes = parseFloat(limiteArray[clave].MenosDes);
        console.log('LCS:', limiteLCS);
        console.log('LAS:', limiteLAS);
        console.log('LAI:', limiteLAI);
        console.log('LCI:', limiteLCI);
        console.log('+1s:', MasDes);
        console.log('-1s:', MenosDes);
        const elemento = row.value.find(item => item.value.id === clave);
        console.log('Elemento', elemento);
        const unidad = elemento.value.unidad;

        if (valor > limiteLCS || valor < limiteLCI) {
          mensajesAlerta[clave] = `El valor de la solución ${clave} ${unidad} se encuentra fuera de los limites de control, por favor repita la medición.`;
        } else if (valor > limiteLAS && valor <= limiteLCS) {
          mensajesAlerta[clave] = `El valor de la solución ${clave} ${unidad} se encuentra fuera de la alerta 1s, por favor verifique el equipo.`;
        } else if (valor < limiteLAI && valor >= limiteLCI) {
          mensajesAlerta[clave] = `El valor de la solución ${clave} ${unidad} se encuentra fuera de la alerta -1s, por favor verifique el equipo.`;
        } else {
          console.log('El valor está dentro de los límites de control.');
        }

        if (valorpeniultimo > MasDes && valor > MasDes) {
          mensajesAlerta[clave] = `El valor de la solución ${clave} ${unidad} superó el valor de 1s en dos eventos consecutivos, verifique el equipo.`;
        } else if (valorpeniultimo < MenosDes && valor < MenosDes) {
          mensajesAlerta[clave] = `El valor de la solución ${clave} ${unidad} está por debajo de -1s en dos eventos consecutivos, verifique el equipo.`;
        }
      }
    }
  }

  console.log('Mensajes de alerta:', mensajesAlerta);
  mensajess.value = mensajesAlerta;
  clavesObserva.value = Object.keys(mensajesAlerta);
  observacions.value = Object.values(mensajesAlerta);
  confirm.value = clavesObserva.value.length === 0;

  limpiarJSON();
};

const triggerNegative = () => {
  $q.notify({
    type: 'negative',
    message: 'Por favor, ingrese valores de verificación.',
  });
};

const AllCampos = () => {
  $q.notify({
    type: 'negative',
    message: 'Por favor, complete todos los campos de verificación.',
  });
};

const ObtenerTendencias = () => {
  $q.loading.show();
  api.get('/grafico/obtenertendencias/' + Metodo.value.id)
    .then(response => {
      const listaLimites = response.data.limites;
      console.log(listaLimites);
      Limites.value = listaLimites.reduce((result, item) => {
        result[item.id] = {
          LCSresultado: item.LCSresultado,
          LCIresultado: item.LCIresultado,
          LASresultado: item.LASresultado,
          LAIresultado: item.LAIresultado,
          MasDes: item.MasDes,
          MenosDes: item.MenosDes,
          Media: item.Media,
        };
        return result;
      }, {});
      $q.loading.hide();
    })
    .catch(error => {
      utilidades.mensaje('Tipo Identificacion4 - Fallo la conexion ' + error);
      $q.loading.hide();
    });
};

const ObtenerTendenciasRPD = () => {
  $q.loading.show();
  api.get('/grafico/obtenertendenciasRPD/' + MetodoRPD.value.id)
    .then(response => {
      const limite = response.data.limites;
      console.log(limite);
      Limites.value = {
        LCSresultado: limite.LCSresultado,
        LCIresultado: limite.LCIresultado,
        LASresultado: limite.LASresultado,
        LAIresultado: limite.LAIresultado,
        MasDes: limite.MasDes,
        MenosDes: limite.MenosDes,
        Media: limite.Media,
      };
      $q.loading.hide();
    })
    .catch(error => {
      utilidades.mensaje('obtener Tendencias RPD  - Fallo la conexion ' + error);
      $q.loading.hide();
    });
};

onMounted(() => {
  ObtenerMetodos();
  matrices();
});
</script>

<style scoped>
.prueba {
  color: red;
  display: flex;
  justify-content: center;
}

.selected {
  background-color: #3498db;
  color: #fff;
  border: 1px black solid;
  border-radius: 3px;
}

.options {
  height: 50px;
  cursor: pointer;
  border: 1px solid black;
  border-radius: 3px;
}

.example-item {
  height: 290px;
  width: 290px;
}
</style>
