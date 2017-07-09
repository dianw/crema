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
            name: 'hash'
          }
        },
        {
          text: 'Encrypt/Decrypt',
          to: {
            name: 'encrypt-decrypt'
          }
        },
        {
          text: 'Key-Pair Gen',
          to: {
            name: 'key-pair-gen'
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
