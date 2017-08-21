<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <no-ssr>
        <Sidebar :navItems="nav"/>
      </no-ssr>
      <main class="main">
        <breadcrumb :list="list"/>
        <div class="container-fluid">
          <nuxt />
        </div>
      </main>
      <!-- <AppAside/> -->
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import { Header as AppHeader, Sidebar, Aside as AppAside, Footer as AppFooter, Breadcrumb } from '~/components/'

export default {
  name: 'full',
  components: {
    AppHeader,
    Sidebar,
    AppAside,
    AppFooter,
    Breadcrumb
  },
  data () {
    return {
      nav: [
        {
          name: 'Dashboard',
          to: { name: 'index' },
          icon: 'fa fa-dashboard'
        },
        {
          name: 'Hash',
          to: { name: 'hash' },
          icon: 'fa fa-key'
        }
      ]
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched
    }
  }
}
</script>
