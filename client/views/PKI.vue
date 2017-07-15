<template>
  <div class="row">
    <div class="col-xs-12 col-md-4 col-lg-3">
      <sidenav :router-link="true" :tabs="menus"></sidenav>
    </div>
    <div class="col-xs-12 col-md-8 col-lg-9">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Sidenav from 'components/Sidenav';

export default {
  components: {
    Sidenav
  },
  computed: {
    menus() {
      return [
        {
          title: 'RSA Key-Pair',
          to: { name: 'key-pair-gen' }
        },
        {
          title: 'Certificate Signing Request',
          to: { name: 'csr' }
        }
      ]
    }
  },
  methods: {
    redirectToDefaultRoute() {
      if (this.$route.name === 'pki') {
        this.$router.push({ name: 'key-pair-gen' });
      }
    }
  },
  mounted() {
    this.redirectToDefaultRoute();
  },
  watch: {
    ['$route.name'](value) {
      this.redirectToDefaultRoute();
    }
  }
}
</script>
