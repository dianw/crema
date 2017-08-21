<template>
  <no-ssr>
    <b-card header="RSA Key-Pair Generator" header-tag="h3">
      <b-form-fieldset label="Key Size">
        <b-form-select :options="keySizes" :value="keySize" @input="setKeySize"></b-form-select>
      </b-form-fieldset>
      <b-form-fieldset>
        <b-btn variant="primary" :disabled="generating" @click="generate">Generate Key Pair</b-btn>
      </b-form-fieldset>
      <br />
      <b-tabs class="monospace">
        <b-tab title="Private Key">
          <b-form-input :value="privateKeyPem" placeholder="Private Key Output" :rows="rowSize" textarea readonly></b-form-input>
        </b-tab>
        <b-tab title="Public Key">
          <b-form-input :value="publicKeyPem" placeholder="Public Key Output" :rows="rowSize" textarea readonly></b-form-input>
        </b-tab>
        <b-tab title="SSH Public Key">
          <b-form-input :value="publicKeySSH" placeholder="SSH Public Key Output" :rows="rowSize" textarea readonly></b-form-input>
        </b-tab>
      </b-tabs>
    </b-card>
  </no-ssr>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data: () => ({
    generating: false,
    keySizes: [ 512, 1024, 2048, 4096 ],
    rowSize: 15
  }),
  computed: {
    ...mapState({
      keySize: state => state.rsagen.keySize,
      privateKeyPem: state => state.rsagen.privateKeyPem,
      publicKeyPem: state => state.rsagen.publicKeyPem,
      publicKeySSH: state => state.rsagen.publicKeySSH
    })
  },
  methods: {
    generate () {
      this.generating = true
      this.$store.dispatch('rsagen/generate', this.keySize).then(() => {
        this.generating = false
      })
    },
    ...mapMutations({
      setKeySize: 'rsagen/setKeySize'
    })
  }
}
</script>

<style>
.monospace textarea {
  font-family: monospace;
}
</style>
