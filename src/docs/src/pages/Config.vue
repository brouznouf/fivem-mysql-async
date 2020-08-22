<template>
  <Layout>
    <div
      v-for="section in $page.allWebPage.edges"
      :key="section.node.path"
    >
      <div v-html="section.node.content" />

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

<page-query>
query {
  allWebPage(sortBy: "id", order: ASC, filter: { id: { in: ["21", "22", "23", "24", "25", "26", "27", "28", "29", "30"] } }) {
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
