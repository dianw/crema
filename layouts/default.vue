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
          icon: 'fa fa-key',
          children: [
            {
              name: 'SHA-512',
              to: { name: 'hash-alg', params: { alg: 'sha512' } },
              icon: 'fa fa-chevron-right'
            },
            {
              name: 'SHA-256',
              to: { name: 'hash-alg', params: { alg: 'sha256' } },
              icon: 'fa fa-chevron-right'
            },
            {
              name: 'SHA-1',
              to: { name: 'hash-alg', params: { alg: 'sha1' } },
              icon: 'fa fa-chevron-right'
            },
            {
              name: 'MD5',
              to: { name: 'hash-alg', params: { alg: 'md5' } },
              icon: 'fa fa-chevron-right'
            }
          ]
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
