import Vue from 'vue';
import '../ui/plugins/vuetify';
import App from '../ui/views/MySQL.vue';

Vue.config.productionTip = false;

new Vue({
  render(h) { return h(App); },
}).$mount('#app');
