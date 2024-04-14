<template>
  <q-table :rows-per-page-options="[10, 25, 50, 100]" :rows-per-page-label="'Registros por página:'" class=""
    color="grey" :filter="filter" flat bordered separator="cell" :rows="propiedades.rows" :columns="propiedades.columns"
    row-key="name" binary-state-sort>
    <template v-slot:body="props">
      <q-tr style="cursor: pointer" :props="props" class="bg-grey-1">
        <q-td :key="column.name" v-for="column in propiedades.columns" :props="props"
          @click="edit(props.row.id, column.name)">
          <q-badge v-if="propiedades.columns.find(column => column.name === 'cantidad')" :color="{
            'orange':
              column.name === 'cantidad' &&
              props.row.cantidad <= 3 &&
              props.row.cantidad >= 1,
            'red':
              column.name === 'cantidad' && props.row.cantidad === 0,
            'green':
              column.name === 'cantidad' && props.row.cantidad > 3,
          }">
            {{ props.row[column.name] }}
          </q-badge>
          <template v-else>
            {{ props.row[column.name] }}
          </template>

          <template v-if="column.editable">
            <q-popup-edit v-model="props.row[column.name]" v-slot="scope" @save="guardarDato" auto-save>
              <q-input :max="props.row.max" :min="props.row.min" v-model="scope.value" :type="column.inputType" dense
                autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </template>

          <template v-if="column.name === 'eliminar'">
            <q-btn color="red" @click="eliminarDato(props.row)" icon="delete" size="sm" />
          </template>

          <template v-if="column.name === 'Información'">
            <q-btn color="orange" @click="mostrarInfo(props)" icon="info" size="sm" />
          </template>

          <template v-if="column.name === 'Editar'">
            <q-btn color="blue" @click="editarFila(props)" icon="edit" size="sm" />
          </template>
        </q-td>
      </q-tr>
    </template>
    <template v-slot:top-right v-if="propiedades.filtro">
      <q-input outlined borderless dense debounce="300" v-model="filter" placeholder="Buscar">
        <template v-slot:append>
          <q-icon name="search"></q-icon>
        </template>
      </q-input>
    </template>
    <template v-slot:top-left v-if="propiedades.filtro">
      <q-badge class="text-h6 text-white" style="background-color: #727171;">
        {{ propiedades.title }}
      </q-badge>
    </template>
  </q-table>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    propiedades: {
      type: Object,
      required: false,
    }
  },
  setup(props, { emit }) {
    const id = ref("");
    const column = ref("");

    const edit = (idValue, columnValue) => {
      id.value = idValue;
      column.value = columnValue;
    };

    const guardarDato = (d1, d2) => {
      const nombreColumna = column.value;
      const datos = { idProducto: id.value, [nombreColumna]: d1 };
      emit("actualizarDatos", datos);
    };

    const eliminarDato = (row) => {
      const idValue = row.id;
      emit("eliminarDatos", idValue);
    };

    const editarFila = (idFila) => {
      emit("clickEdit", idFila.row);
    };

    const mostrarInfo = (idFila) => {
      emit("clickInfo", idFila.row)
    }

    return {
      id,
      column,
      edit,
      guardarDato,
      editarFila,
      eliminarDato,
      mostrarInfo,
      filter: ref('')
    };
  },
};
</script>
<style >
.q-table>thead>tr,
.q-table__bottom {
  background-color: #727171;
  color: #f2f3f5;
  position: sticky;
  top: 0;
  z-index: 2;
  user-select: none;
}
</style>
