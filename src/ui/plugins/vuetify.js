import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#ddd',
    secondary: '#36495d',
    accent: '#47b784',
  },
});
