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
        <b-form-input id="private-key-pem" v-model="keyPair.privateKeyPem" :class="[ 'monospace' ]" :rows="20" textarea readonly></b-form-input>
      </div>
      <div class="form-group" v-if="tab === 1">
        <b-form-input id="public-key-pem" v-model="keyPair.publicKeyPem" :class="[ 'monospace' ]" :rows="20" textarea readonly></b-form-input>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      keySize: 2048,
      tab: 0
    }
  },
  computed: {
    keyPair() {
      const keyPairs = this.$store.state.keyPairs;
      return keyPairs.length > 0 ? keyPairs[keyPairs.length - 1] : null;
    },
    ...mapState({
      keySizes: 'keySizes'
    })
  },
  methods: {
    generateKeyPair() {
      this.keyPair = null;
      this.$store.dispatch('generateKeyPair', this.keySize);
    }
  }
}
</script>
