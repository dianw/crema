<template>
  <div id="app">
    <navbar title="Crema" :menus="menus"></navbar>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from 'components/Navbar';

export default {
  components: {
    Navbar
  },
  computed: {
    menus() {
      return [
        {
          text: 'Home',
          to: {
            name: 'home'
          }
        },
        {
          text: 'Hash',
          to: {
            name: 'home'
          }
        },
        {
          text: 'Encrypt/Decrypt',
          to: {
            name: 'home'
          }
        },
        {
          text: 'Key-Pair Gen',
          to: {
            name: 'home'
          }
        }
      ];
    }
  }
}
</script>

<style>
body {
  padding-top: 4.5rem;
  padding-bottom: 4.5rem;
}
</style>
