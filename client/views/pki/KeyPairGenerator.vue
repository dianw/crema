<template>
  <div>
    <b-form @submit.prevent="generateKeyPair">
      <div class="form-group">
        <label for="key-size">Key Size</label>
        <b-form-select id="key-size" v-model="keySize" :options="keySizes"></b-form-select>
      </div>
      <div class="form-group">
        <b-button type="submit" size="lg" variant="primary">Generate Key Pair</b-button>
      </div>
    </b-form>
    <br />
    <div v-if="keyPair">
      <b-nav tabs>
        <b-nav-item :active="tab === 0" @click="tab = 0">Private Key</b-nav-item>
        <b-nav-item :active="tab === 1" @click="tab = 1">Public Key</b-nav-item>
      </b-nav>
      <div class="form-group" v-if="tab === 0">
        <b-form-input id="private-key-pem" v-model="privateKeyPem" :class="[ 'monospace' ]" :rows="20" textarea readonly></b-form-input>
      </div>
      <div class="form-group" v-if="tab === 1">
        <b-form-input id="public-key-pem" v-model="publicKeyPem" :class="[ 'monospace' ]" :rows="20" textarea readonly></b-form-input>
      </div>
    </div>
  </div>
</template>

<script>
import forge from 'node-forge';

export default {
  data() {
    return {
      keySize: 2048,
      keyPair: null,
      privateKeyPem: null,
      publicKeyPem: null,
      tab: 0
    }
  },
  computed: {
    keySizes() {
      return [ 512, 1024, 2048, 4096 ]
    }
  },
  methods: {
    generateKeyPair() {
      this.keyPair = null;
      this.$store.dispatch('generateKeyPair', this.keySize).then(keyPair => {
        this.keyPair = keyPair.keyPair;
        this.privateKeyPem = keyPair.privateKeyPem;
        this.publicKeyPem = keyPair.publicKeyPem;
      });
    }
  }
}
</script>

<style>
.monospace {
  font-family: monospace;
}
</style>
