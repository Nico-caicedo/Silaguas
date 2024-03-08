<template >
    <div style="height: 100px; ">
        <q-scroll-area style="height: 600px;">


            <div class="row q-pt-md q-gutter-sm">


                <div padding style="width: 25% ;height: 300px; ">
                    <p class="row justify-center text-h6">Diseños existentes</p>

                    <q-scroll-area style="height: 300px;">
                        <q-list bordered separator>
                            <q-item v-for="(item, index) in itemList" :key="index" clickable v-ripple
                                @click="handleItemClick(item)">
                                <q-item-section>{{ item.text }}</q-item-section>
                            </q-item>
                        </q-list>
                    </q-scroll-area>
                </div>

                <div style="width: 65%; height: 400px;">
                    <p class="row justify-center text-h4">Añadir Formato</p>
                    <div>
                        <p class="text-h6 " style="border-bottom: 1px solid black;">Cabecera </p>
                        <div class="row q-gutter-xs">
                            <q-input outlined v-model="formato.titulo" label="Titulo" />
                            <q-input outlined v-model="formato.codigo" label="Código" />
                            <q-input outlined v-model="formato.version" label="Versión" />

                            <q-uploader label="Logo" color="#01B9FF" text-color="black" no-thumbnails
                                style="max-width: 300px" @uploaded="processImage" />
                                <q-input v-model="formato.fecha" filled type="date"  />
                                
                        </div>
                    </div>

                    <div>
                        <p class="text-h6 " style="border-bottom: 1px solid black;">Pie de pagina</p>
                        <div class="row justify-center q-gutter-sm" style="width: 100%;">


                            <q-select filled class="col" v-model="formato.elaboro" :options="options" label="Elaboró"
                                color="teal" clearable options-selected-class="text-deep-orange">
                                <template v-slot:option="scope">
                                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">

                                        <q-item-section>
                                            <q-item-label v-html="scope.opt.label" />
                                            <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>

                            <q-select filled class="col" v-model="formato.reviso" :options="options" label="Revisó"
                                color="teal" clearable options-selected-class="text-deep-orange">
                                <template v-slot:option="scope">
                                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">

                                        <q-item-section>
                                            <q-item-label v-html="scope.opt.label" />
                                            <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>

                            <q-select filled class="col" v-model="formato.aprobo" :options="options" label="Aprobó"
                                color="teal" clearable options-selected-class="text-deep-orange">
                                <template v-slot:option="scope">
                                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">

                                        <q-item-section>
                                            <q-item-label v-html="scope.opt.label" />
                                            <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                        </div>
                    </div>
                </div>

            </div>
            <div class="row justify-center q-mt-lg ">
                <q-btn label="Crear" class="bg-positive" style="width: 200px; height: 50px;" @click="mostrar" />
            </div>

        </q-scroll-area>
    </div>
</template>
<script>
import { api } from 'boot/axios'
import utilidades from '../../commons/utilidades.js'

export default {
    data() {
        return {
            
            text: '',
            date: '',
            aprobo: '',
            formato:{
                 titulo: '',
                version: '',
                codigo: '',
                elaboro: '',
                reviso: '',
                aprobo: '',
                fecha: ''
            }
            ,

            itemList: [
                { text: 'Carta Formato RPD V.4', value: 'Value for single line item' },
                { text: 'Item with caption', value: 'Value for item with caption' },
                { text: 'Item with overline', value: 'Value for item with overline' },
                { text: 'Item with overline', value: 'Value for item with overline' },
                { text: 'Item with overline', value: 'Value for item with overline' },
                { text: 'Item with overline', value: 'Value for item with overline' },
                { text: 'Item with overline', value: 'Value for item with overline' },
                { text: 'Item with overline', value: 'Value for item with overline' },
                { text: 'Item with overline', value: 'Value for item with overline' },
                { text: 'Item with overline', value: 'Value for item with overline' },
                { text: 'Item with overline', value: 'Value for item with overline' },
                { text: 'Item with overline', value: 'Value for item with overline' },


            ],
            data: [],
            options: [],


        };
    },
    methods: {
        handleItemClick(item) {

            this.data = {
                value: item.text,
                formato: item.value
            }
            // Aquí puedes realizar cualquier acción que necesites con el item seleccionado
        }
        ,
        mostrar() {
            console.log(this.formato)
        },
        Empleados() {
            const self = this;
            self.$q.loading.show();
            api.get('/usuario/ObtenerEmpleados')
                .then((response) => {
                    const datos = response.data;
                    console.log(datos);

                    // Si los datos son una lista de empleados, itera sobre ellos y crea opciones para cada empleado
                    this.options = datos.map((empleado) => ({
                        label: empleado.Cargo,
                        value: empleado.IdEmpleado,
                        description: empleado.Nombre1 + empleado.Nombre2 + empleado.Apellido1 + empleado.Apellido2,
                    }));

                    self.$q.loading.hide();
                })
                .catch((error) => {
                    utilidades.mensaje('Tipo Identificacion - Fallo la conexion ' + error);
                    self.$q.loading.hide();
                });
        },
        processImage(file) {
            // Genera un nombre único para la imagen (por ejemplo, utilizando el timestamp actual)
            const timestamp = new Date().getTime();
            const extension = file.name.split('.').pop(); // Obtiene la extensión de la imagen
            const nombreImagen = `imagen_${timestamp}.${extension}`;

            // Aquí puedes mover la imagen a una carpeta en tu servidor utilizando Node.js
            // Por ejemplo, si estás utilizando Node.js en el backend, puedes enviar la imagen al servidor y moverla a la carpeta deseada.

            // Guardar el nombre de la imagen en la variable 'nombreImagen'
            this.header.nombreImagen = nombreImagen;
            console.log(nombreImagen)
        }


    },
    created() {
        this.Empleados()
    }
}

</script>