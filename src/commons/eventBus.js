// eventBus.js
import { ref } from 'vue';

const eventBus = ref({});

const emit = (event, data) => {
  eventBus.value[event] = data;
};

const on = (event, callback) => {
  if (!eventBus.value[event]) {
    eventBus.value[event] = [];
  }
  eventBus.value[event].push(callback);
};

const off = (event, callback) => {
  if (!eventBus.value[event]) return;
  eventBus.value[event] = eventBus.value[event].filter(cb => cb !== callback);
};

export default {
  emit,
  on,
  off
};
