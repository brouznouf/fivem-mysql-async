<template>
  <Layout>
    <div
      v-for="section in $page.allWebPage.edges"
      :key="section.node.path"
    >
      <div v-html="section.node.content" />
    </div>
  </Layout>
</template>

<page-query>
query {
  allWebPage(sortBy: "id", order: ASC, filter: { id: { in: ["31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43"] } }) {
    edges {
      node {
        path
        content
      }
    }
  }
}
</page-query>
