<template>
  <Layout>
    <div
      v-for="section in $page.allWebPage.edges"
      :key="section.node.path"
    >
      <div v-html="section.node.content" />

      <figure class="figure" v-if="section.node.path === '/content/pages/gui-and-dev/'">
        <g-image src="~/assets/img/gui.webp" class="figure-img img-fluid rounded" alt="Ingame view of the GUI" />
        <figcaption class="figure-caption">View of the GUI ingame.</figcaption>
      </figure>

      <b-table
        v-if="section.node.path === '/content/pages/setup-database-options/'"
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

      <b-list-group v-if="section.node.path === '/content/pages/configuration-options/'">
        <b-list-group-item
          class="flex-column align-items-start"
          v-for="opt in $page.allConfigOption.edges"
          :key="opt.node.path"
        >
          <h5 class="mb-1">{{ opt.node.name }}</h5>
          <span class="description" v-html="opt.node.content"/>
        </b-list-group-item>
      </b-list-group>

      <b-list-group v-if="section.node.path === '/content/pages/configuration-additional/'">
        <b-list-group-item
          class="flex-column align-items-start"
          v-for="opt in $page.allServerVar.edges"
          :key="opt.node.path"
        >
          <h5 class="mb-1">{{ opt.node.name }}</h5>
          <span class="description" v-html="opt.node.content"/>
        </b-list-group-item>
      </b-list-group>
    </div>
  </Layout>
</template>

<script>
import { BButton, BTable, BListGroup, BListGroupItem } from 'bootstrap-vue';

export default {
  metaInfo: {
    title: 'Documentation'
  },
  components: {
    BListGroup,
    BListGroupItem,
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

<page-query>
query {
  allWebPage(sortBy: "id", order: ASC) {
    edges {
      node {
        path
        content
      }
    }
  }
  allConfigOption(sortBy: "id", order: ASC) {
    edges {
      node {
        path
        name
        content
      }
    }
  }
  allServerVar(sortBy: "id", order: ASC) {
    edges {
      node {
        path
        name
        content
      }
    }
  }
}
</page-query>

<style lang="scss">
.description p {
  margin-bottom: 2px;
}
</style>
