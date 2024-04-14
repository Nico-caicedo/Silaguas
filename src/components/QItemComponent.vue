<template>
  <q-toolbar class="bg-primary text-white shadow-2">
    <q-toolbar-title>{{ Title }}</q-toolbar-title>
  </q-toolbar>

  <q-list bordered>
    <q-item v-for="contact in contacts" :key="contact.id" class="q-my-sm" clickable v-ripple>
      <!-- <q-item-section avatar>
        <q-avatar color="primary" text-color="white">
          {{ letter }}
        </q-avatar>
      </q-item-section> -->

      <q-item-section>
        <q-item-label>{{ name }}</q-item-label>
        <q-item-label caption lines="1">{{ data }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon name="chat_bubble" color="green" />
      </q-item-section>
    </q-item>

    <q-separator />

  </q-list>
</template>
<script>
export default {
  name: 'QItemComponent',
  props: {
    Title: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    data: {
      type: Int32Array,
      default: '',
    }
  },
}

</script>
