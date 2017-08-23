<template>
  <header class="app-header navbar">
    <div class="container-fluid">
      <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">&#9776;</button>
      <b-link :to="{ name: 'index' }" class="navbar-brand">
        <h2>crema</h2>
      </b-link>
      <button class="navbar-toggler sidebar-toggler d-md-down-none mr-auto" type="button" @click="sidebarMinimize">&#9776;</button>
      <ul class="nav navbar-nav">
        <li class="nav-item">
          <a class="btn btn-lg" href="https://github.com/dianw/crema" target="_blank">
            <i class="fa fa-github fa-2"></i>
          </a>
        </li>
      </ul>
      <!-- <button class="navbar-toggler aside-menu-toggler d-md-down-none" type="button" @click="asideToggle">&#9776;</button> -->
    </div>
  </header>
</template>
<script>
export default {
  name: 'header',
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
