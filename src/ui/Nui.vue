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
                <v-tab ripple>
                  Time-resolved
                </v-tab>
                <v-tab ripple>
                  Resources
                </v-tab>
                <v-tab ripple>
                  Slowest Queries
                </v-tab>
                <v-tab-item>
                  <v-flex xs12 pa-2 style="height: 480px;">
                    <m-chart
                      id="time-graph"
                      :labels="cdata.labels" 
                      :datasets="cdata.datasets"
                      height="540"
                    ></m-chart>
                  </v-flex>
                </v-tab-item>
                <v-tab-item>
                  <v-flex xs12 pa-2 style="height: 480px;">
                    <m-chart
                      id="resource-graph"
                      :labels="cdata.labels"
                      :datasets="cdata.datasets"
                      height="540"
                    ></m-chart>
                  </v-flex>
                </v-tab-item>
                <v-tab-item>
                  <v-flex xs12 pa-2 style="height: 480px;">
                    <v-data-table
                      align-end
                      :headers="headers"
                      :items="slowqueries"
                      :rows-per-page-items="[7]"
                    >
                      <template v-slot:items="props">
                        <td>{{ props.item.resource }}</td>
                        <td>{{ props.item.sql }}</td>
                        <td>{{ props.item.time }}</td>
                      </template>
                    </v-data-table>
                  </v-flex>
                </v-tab-item>
              </v-tabs>
              <v-footer dark color="black" height="28" style="min-height: 28px;">
              </v-footer>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import MChart from './components/MChart.vue';
import mydata from './components/chart-data.js'

export default {
  components: {
    MChart,
  },
  data() {
    return {
      showInterface: true,
      ratio: 496 / 1391,
      colorGraphLoad: {
        backgroundColor: [
          'rgba(54, 73, 93, 0.5)',
        ],
        borderColor: [
          '#36495d',
        ],
        borderWidth: 3,
      },
      colorGraphAvg: {
        backgroundColor: [
          'rgba(71, 183, 132, 0.5)',
        ],
        borderColor: [
          '#47b784',
        ],
        borderWidth: 3,
      },
      colorGraphCount: {
        backgroundColor: [
          'rgba(54,73,93,.5)',
        ],
        borderColor: [
          '#36495d',
        ],
        borderWidth: 3,
      },
      cdata: mydata.data,
      slowqueries: [
        {
          resource: 'es_extended',
          sql: 'SELECT * FROM items',
          time: 512,
        },
      ],
      headers: [
        {
          text: 'Resource',
          value: 'resource',
        },
        { 
          text: 'Query', 
          value: 'sql',
          sortable: false, 
        },
        { 
          text: 'Execution Time (ms)',
          value: 'time',
        },
      ],
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
