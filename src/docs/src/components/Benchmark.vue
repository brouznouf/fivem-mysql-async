<template>
  <b-table
    :fields="fields"
    :items="items"
  >
    <template v-slot:cell(name)="data">
      <b>{{ data.item.name }}</b>
    </template>

    <template v-slot:cell(avgdev)="data">
      {{ data.item.avg }}ms &plusmn; {{ data.item.dev }}ms
    </template>

    <template v-slot:cell(minmax)="data">
      [{{ data.item.min }}ms, {{ data.item.max }}ms]
    </template>

    <template v-slot:cell(download)="data">
      <b-button variant="outline-primary" :href="data.item.download" target="_blank">Download</b-button>
    </template>
  </b-table>
</template>

<script>
import { BButton, BTable, } from 'bootstrap-vue';
export default {
  components: {
    BButton,
    BTable,
  },
  data() {
    return {
      // export this to markdown
      fields: [
        { key: 'name', label: 'Implementation' },
        { key: 'avgdev', label: 'Average Speed' },
        { key: 'minmax', label: '[Min, Max]' },
        { key: 'download', label: 'Download Link' },
      ],
      items: [
        { name: 'MariaDB 10.4', avg: 13.94, dev: 5.20, min: 3, max: 151, download: 'https://downloads.mariadb.org/mariadb/10.4/' },
        { name: 'MariaDB 10.3', avg: 16.38, dev: 7.85, min: 2, max: 200, download: 'https://downloads.mariadb.org/mariadb/10.3/' },
        { name: 'MySQL 5.7', avg: 15.81, dev: 5.81, min: 2, max: 119, download: 'https://dev.mysql.com/downloads/mysql/5.7.html' },
        { name: 'MySQL 8.0', avg: 27.14, dev: 66.58, min: 3, max: 1323, download: 'https://dev.mysql.com/downloads/mysql/' },
      ],
    };
  },
}
</script>
