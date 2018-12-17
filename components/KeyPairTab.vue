<template>
  <b-tabs class="monospace">
    <b-tab title="Private Key">
      <b-form-textarea :value="privateKeyPem" placeholder="Private Key Output" :rows="rowSize" readonly />
    </b-tab>
    <b-tab title="Public Key">
      <b-form-textarea :value="publicKeyPem" placeholder="Public Key Output" :rows="rowSize" readonly />
    </b-tab>
    <b-tab title="SSH Public Key">
      <b-form-input :value="publicKeyFingerprint" placeholder="Public Key Fingerprint" class="mb-1" readonly />
      <b-form-textarea :value="publicKeySSH" placeholder="SSH Public Key Output" :rows="rowSize" readonly />
    </b-tab>
    <b-tab title="Save" v-if="privateKeyPem && !saved">
      <b-form @submit.prevent="save">
        <b-form-group>
          <label for="name">Key-Pair Name</label>
          <b-form-input id="name" placeholder="Key-Pair Name" v-model="name" ref="name" required />
        </b-form-group>
        <b-form-group>
          <label for="password">Password</label>
          <b-form-input id="password" type="password" placeholder="Password" v-model="password" ref="password" required />
        </b-form-group>
        <b-form-group>
          <b-button type="submit" variant="primary" class="col-4">Save</b-button>
        </b-form-group>
      </b-form>
    </b-tab>
  </b-tabs>
</template>

<script>
import { pki, ssh } from 'node-forge'

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
    password: null,
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
      this.$emit('save', this.name, this.password, this.privateKeyPem, this.publicKeyPem)
      this.saved = true
    },
    loadKeyPair (kp) {
      if (!kp || !kp.privateKey) return
      this.privateKeyPem = pki.privateKeyToPem(kp.privateKey)
      this.publicKeyPem = pki.publicKeyToPem(kp.publicKey)
      this.publicKeySSH = ssh.publicKeyToOpenSSH(kp.publicKey)
      this.publicKeyFingerprint = ssh.getPublicKeyFingerprint(kp.publicKey, {encoding: 'hex', delimiter: ':'})
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
