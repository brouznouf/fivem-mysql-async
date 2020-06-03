<template>
  <v-app>
    <m-header :nav="nav" />
    <v-content>
      <v-row no-gutters justify="center">
        <v-col :md="7" :cols="12">
          <m-setup />
          <m-configuration />
          <m-queries />
          <m-transactions />
          <m-gui />
        </v-col>
      </v-row>
    </v-content>
  </v-app>
</template>

<script>
import MHeader from './components/Header.vue';
import MSetup from './components/Installation.vue';
import MConfiguration from './components/Configuration.vue';
import MQueries from './components/Queries.vue';
import MTransactions from './components/Transactions.vue';
import MGui from './components/GUI.vue';

export default {
  components: {
    MHeader,
    MSetup,
    MConfiguration,
    MQueries,
    MTransactions,
    MGui,
  },
  data() {
    return {
      nav: [
        { name: 'Setup', nav: '#setup' },
        { name: 'Configuration', nav: '#config' },
        { name: 'Queries', nav: '#queries' },
        { name: 'Transactions', nav: '#transactions' },
        { name: 'GUI & Dev', nav: '#guidev' },
      ],
    };
  },
}
</script>
