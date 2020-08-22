<template>
  <Layout>
    <div v-html="$page.webPage.content" />
    <figure class="figure">
      <g-image src="~/assets/img/gui.webp" class="figure-img img-fluid rounded" alt="Ingame view of the GUI" />
      <figcaption class="figure-caption">View of the GUI ingame.</figcaption>
    </figure>
  </Layout>
</template>

<page-query>
query {
  webPage(path: "/content/pages/gui-and-dev/") {
    path
    content
  }
}
</page-query>
