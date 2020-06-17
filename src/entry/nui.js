import Vue from 'vue';
import vuetify from '../vendor/ghmattimysql/packages/ghmattimysql-ui/src/plugins/vuetify';
import App from '../ui/Nui.vue';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
