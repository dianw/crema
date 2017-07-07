<template>
  <b-navbar toggleable type="inverse" variant="primary" fixed="top">
    <div class="container">
      <b-nav-toggle target="nav_collapse"></b-nav-toggle>
      <b-link class="navbar-brand" :to="{ name: 'home' }">
        <span v-html="title"></span>
      </b-link>
      <b-collapse is-nav id="nav_collapse">
        <b-nav is-nav-bar>
          <b-nav-item v-for="menu in menus" :key="menu" :to="menu.to">{{ menu.text }}</b-nav-item>
        </b-nav>
      </b-collapse>
    </div>
  </b-navbar>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '&nbsp;'
    },
    menus: {
      type: Array,
      default() {
        return [];
      }
    }
  }
}
</script>

<style>
@media (max-width: 767px) {
  .navbar .container {
    width: 100%;
  }
}
</style>
