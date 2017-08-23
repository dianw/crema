<template>
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
</template>

<script>
export default {
  props: {
    rowSize: {
      type: Number,
      default: 15
    },
    privateKeyPem: {
      type: String,
      default: ''
    },
    publicKeyPem: {
      type: String,
      default: ''
    },
    publicKeySSH: {
      type: String,
      default: ''
    }
  }
}
</script>
