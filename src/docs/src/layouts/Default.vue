<template>
  <div class="layout">
    <b-navbar fixed="top" type="dark" variant="primary" toggleable="md">
      <b-navbar-brand>mysql-async</b-navbar-brand>
      <b-navbar-toggle target="navbarSupportedContent" />
    
      <b-collapse id="navbarSupportedContent" is-nav>
        <b-navbar-nav class="mr-auto">
          <b-nav-item href="#about">About</b-nav-item>
          <b-nav-item href="#setup">Setup</b-nav-item>
          <b-nav-item href="#configuration">Configuration</b-nav-item>
          <b-nav-item href="#queries">Queries</b-nav-item>
          <b-nav-item href="#transactions">Transactions</b-nav-item>
          <b-nav-item href="#gui--dev">GUI &amp; Dev</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <main class="container-md mt-2 bg-light" style="padding-top: 56px;">
      <slot/>
    </main>
  </div>
</template>

<script>
import { BNavbar, BNavbarBrand, BNavbarNav, BNavItem, BCollapse, BNavbarToggle } from 'bootstrap-vue';

export default {
  components: {
    BNavbar,
    BNavbarBrand,
    BNavbarToggle,
    BNavbarNav,
    BNavItem,
    BCollapse
  },
}
</script>
