<template>
  <no-ssr>
    <b-card header="RSA Key-Pair Generator" header-tag="h3">
      <b-form-fieldset label="Key Size">
        <b-form-select :options="keySizes" :value="keySize" @input="$store.commit('rsagen/setKeySize', $event)" :disabled="generating"></b-form-select>
      </b-form-fieldset>
      <b-form-fieldset>
        <b-btn variant="primary" :disabled="generating" size="lg" @click="generate">Generate Key Pair</b-btn>
      </b-form-fieldset>
      <br />
      <key-pair-tab :privateKeyPem="privateKeyPem" :publicKeyPem="publicKeyPem" :publicKeySSH="publicKeySSH"></key-pair-tab>
    </b-card>
  </no-ssr>
</template>

<script>
import { mapState } from 'vuex'
import KeyPairTab from '~/components/KeyPairTab'

export default {
  components: {
    KeyPairTab
  },
  data: () => ({
    generating: false
  }),
  computed: {
    ...mapState({
      keySize: state => state.rsagen.keySize,
      keySizes: state => state.rsagen.keySizes,
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
    }
  }
}
</script>
