<template>
  <header>
    <b-navbar class="app-header">
      <b-button class="navbar-toggler mobile-sidebar-toggler d-lg-none" @click="mobileSidebarToggle">&#9776;</b-button>
      <b-navbar-brand :to="{ name: 'index' }">
        <h2>crema</h2>
      </b-navbar-brand>
      <b-button class="navbar-toggler sidebar-toggler d-md-down-none mr-auto" @click="sidebarMinimize">&#9776;</b-button>
      <b-navbar-nav class="ml-auto">
        <b-nav-item :to="{ name: 'login' }" v-if="!currentUser || !currentUser.displayName">
          Login
        </b-nav-item>
        <b-nav-item href="#" v-else>
          {{ currentUser.displayName }}
        </b-nav-item>
        <b-nav-item href="https://github.com/dianw/crema" target="_blank">
          <i class="fa fa-github"></i>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </header>
</template>
<script>
export default {
  name: 'header',
  props: {
    currentUser: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    sidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-hidden')
    },
    sidebarMinimize (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-minimized')
    },
    mobileSidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    },
    asideToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('aside-menu-hidden')
    }
  }
}
</script>
