<template>
  <div>
    <b-form @submit.prevent="genKeyPair">
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
        <b-form-input id="private-key-pem" v-model="pem.privateKey" :class="[ 'monospace' ]" :rows="20" textarea readonly></b-form-input>
      </div>
      <div class="form-group" v-if="tab === 1">
        <b-form-input id="public-key-pem" v-model="pem.publicKey" :class="[ 'monospace' ]" :rows="20" textarea readonly></b-form-input>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      keyPair: null,
      keySize: 2048,
      pem: {},
      tab: 0
    }
  },
  computed: {
    ...mapState({
      keySizes: state => state.keyPair.keySizes
    })
  },
  methods: {
    genKeyPair() {
      this.generateKeyPair(this.keySize).then(keyPair => {
        this.keyPair = keyPair;
        return this.keyPairToPem(keyPair);
      }).then(pem => {
        this.pem = pem;
      });
    },
    ...mapActions([
      'generateKeyPair',
      'keyPairToPem'
    ])
  }
}
</script>
