<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
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
