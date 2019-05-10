<template>
  <v-app v-if="showInterface">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs9>
            <v-card class="elevation-12">
              <v-system-bar window dark>
                mysql-async Explorer
                <v-spacer></v-spacer>
                <v-icon>close</v-icon>
              </v-system-bar>
              <v-tabs
                v-model="active"
                color="primary"
                slider-color="secondary"
              >
              <v-tab key="1" ripple>
                Time-resolved
              </v-tab>
              <v-tab key="2" ripple>
                Resources
              </v-tab>
              <v-tab key="3" ripple>
                Slow Queries
              </v-tab>
              </v-tabs>
              <m-chart></m-chart>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import MChart from './components/MChart.vue';

export default {
  components: {
    MChart,
  },
  data() {
    return {
      showInterface: true,
    };
  },
  name: 'app',
}
</script>

<style>
#app {
  font-family: 'Fira Sans', sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  width: 0;
  display: inline !important;
}

.app-background, .theme--light.application {
  background: rgb(0, 0, 0, 0.5) !important;
}

/* fira-sans-regular - latin */
@font-face {
  font-family: 'Fira Sans';
  font-style: normal;
  font-weight: 400;
  src: local('Fira Sans Regular'), local('FiraSans-Regular'),
       url('./assets/fonts/fira-sans-v9-latin-regular.woff2') format('woff2'),
       url('./assets/fonts/fira-sans-v9-latin-regular.woff') format('woff');
}

/* fira-sans-italic - latin */
@font-face {
  font-family: 'Fira Sans';
  font-style: italic;
  font-weight: 400;
  src: local('Fira Sans Italic'), local('FiraSans-Italic'),
       url('./assets/fonts/fira-sans-v9-latin-italic.woff2') format('woff2'),
       url('./assets/fonts/fira-sans-v9-latin-italic.woff') format('woff');
}

/* fira-sans-700 - latin */
@font-face {
  font-family: 'Fira Sans';
  font-style: normal;
  font-weight: 700;
  src: local('Fira Sans Bold'), local('FiraSans-Bold'),
       url('./assets/fonts/fira-sans-v9-latin-700.woff2') format('woff2'),
       url('./assets/fonts/fira-sans-v9-latin-700.woff') format('woff');
}

* {
  font-family: 'Fira Sans', 'sans-serif';
}

.display-1, .display-2, .headline, .title, .subheading {
  font-family: 'Alegreya Sans', 'sans-serif'!important;
}
</style>
