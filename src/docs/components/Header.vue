<template>
  <v-app-bar app>
    <v-toolbar-title>mysql-async Documentation</v-toolbar-title>
    <v-toolbar-items>
      <v-btn v-for="navElement in nav" :key="navElement.nav" :href="navElement.nav" text>
        {{ navElement.name }}
      </v-btn>
    </v-toolbar-items>
    <v-spacer />
    <v-toolbar-items>
      <v-btn @click="nightMode = !nightMode" icon>
        <v-icon>mdi-brightness-6</v-icon>
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
export default {
  props: {
    nav: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      nightMode: false,
    };
  },
  watch: {
    nightMode() {
      this.$vuetify.theme.dark = this.nightMode;
      localStorage.setItem('nightMode', JSON.stringify(this.nightMode));
    }
  },
  created() {
    const storedNightModeSetting = localStorage.getItem('nightMode');
    if (storedNightModeSetting !== null) this.nightMode = JSON.parse(storedNightModeSetting);
  },
}
</script>
