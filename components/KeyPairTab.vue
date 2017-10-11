<template>
  <b-tabs class="monospace">
    <b-tab title="Private Key">
      <b-form-input :value="privateKeyPem" placeholder="Private Key Output" :rows="rowSize" textarea readonly></b-form-input>
    </b-tab>
    <b-tab title="Public Key">
      <b-form-input :value="publicKeyPem" placeholder="Public Key Output" :rows="rowSize" textarea readonly></b-form-input>
    </b-tab>
    <b-tab title="SSH Public Key">
      <b-form-input :value="publicKeyFingerprint" placeholder="Public Key Fingerprint" class="mb-1" readonly></b-form-input>
      <b-form-input :value="publicKeySSH" placeholder="SSH Public Key Output" :rows="rowSize" textarea readonly></b-form-input>
    </b-tab>
    <b-tab title="Save" v-if="privateKeyPem && !saved">
      <b-form @submit.prevent="save">
        <b-form-fieldset>
          <b-form-input placeholder="Key-Pair Name..." v-model="name" ref="name"></b-form-input>
        </b-form-fieldset>
        <b-form-fieldset>
          <b-button type="submit" variant="primary" class="col-4">Save</b-button>
        </b-form-fieldset>
      </b-form>
    </b-tab>
  </b-tabs>
</template>

<script>
import forge from 'node-forge'

export default {
  props: {
    rowSize: {
      type: Number,
      default: 15
    },
    keyPair: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    name: null,
    saved: false,
    privateKeyPem: null,
    publicKeyPem: null,
    publicKeySSH: null,
    publicKeyFingerprint: null
  }),
  methods: {
    save () {
      if ((this.name || '').trim() === '') {
        this.$refs.name.focus()
        return
      }
      this.$emit('save', this.name, this.privateKeyPem, this.publicKeyPem)
      this.saved = true
    },
    loadKeyPair (kp) {
      if (!kp.privateKey) return
      this.privateKeyPem = forge.pki.privateKeyToPem(kp.privateKey)
      this.publicKeyPem = forge.pki.publicKeyToPem(kp.publicKey)
      this.publicKeySSH = forge.ssh.publicKeyToOpenSSH(kp.publicKey)
      this.publicKeyFingerprint = forge.ssh.getPublicKeyFingerprint(kp.publicKey, {encoding: 'hex', delimiter: ':'})
    }
  },
  mounted () {
    this.loadKeyPair(this.keyPair)
  },
  watch: {
    keyPair (kp) {
      this.saved = false
      this.loadKeyPair(kp)
    }
  }
}
</script>
