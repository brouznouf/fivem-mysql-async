// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue';
import '~/styles/index.scss';

export default function (Vue , { head }) {
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout);

  head.link.push({
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap',
  });
}
