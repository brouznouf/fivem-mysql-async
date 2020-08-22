<template>
  <div class="layout">
    <b-navbar fixed="top" type="dark" variant="primary" toggleable="md">
      <b-navbar-brand>mysql-async</b-navbar-brand>
      <b-navbar-toggle target="navbarSupportedContent" />
    
      <b-collapse id="navbarSupportedContent" is-nav>
        <b-navbar-nav class="mr-auto">
          <g-link to="/" class="nav-link">Quick Setup</g-link>
          <g-link to="/config/" class="nav-link">Config</g-link>
          <g-link to="/queries/" class="nav-link">Querying</g-link>
          <g-link to="/gui/" class="nav-link">GUI &amp; Dev</g-link>
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
