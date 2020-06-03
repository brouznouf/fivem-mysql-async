<template>
  <v-data-table
    :headers="headers"
    :items="mysql"
    item-key="name"
    hide-default-footer
  >
    <template v-slot:item.name="{ item }">
      <span class="font-weight-medium">{{ item.name }}</span>
    </template>

    <template v-slot:item.avg="{ item }">
      {{ item.avg }}ms &plusmn; {{ item.dev }}ms
    </template>

    <template v-slot:item.max="{ item }">
      [{{ item.min }}ms, {{ item.max }}ms]
    </template>

    <template v-slot:item.download="{ item }">
      <v-btn outlined color="primary" :href="item.download">Download</v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      mysql: [
        { name: 'MariaDB 10.4', avg: 13.94, dev: 5.2, min: 3, max: 151, download: 'https://downloads.mariadb.org/mariadb/10.4/' },
        { name: 'MariaDB 10.3', avg: 16.38, dev: 7.85, min: 2, max: 200, download: 'https://downloads.mariadb.org/mariadb/10.3/' },
        { name: 'MySQL 5.7', avg: 15.81, dev: 5.81, min: 2, max: 119, download: 'https://dev.mysql.com/downloads/mysql/5.7.html' },
        { name: 'MySQL 8.0', avg: 27.14, dev: 66.58, min: 3, max: 1323, download: 'https://dev.mysql.com/downloads/mysql/' },
      ],
      headers: [
        { text: 'Implementation', sortable: false, value: 'name' },
        { text: 'Average Speed', value: 'avg' },
        { text: '[min, max]', value: 'max' },
        { text: 'Download Link', sortable: false, value: 'download' },
      ],
    };
  },
}
</script>
