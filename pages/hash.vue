<template>
  <div>
    <h3>Hash Calculator</h3>
    <b-card>
      <b-form-group label="Algorithm">
        <b-form-select :options="algs" :value="alg" @input="e => { setHashAlg(e); calculateHash({ input, alg, isText: true }) }"></b-form-select>
      </b-form-group>
      <b-tabs class="my-2">
        <b-tab title="Text Input">
          <b-form-textarea :value="input" @input="input => calculateHash({ input, alg, isText: true })" placeholder="Insert text here" :rows="5" />
        </b-tab>
        <b-tab title="File Input">
          <b-form-file choose-label="Choose file" placeholder="Choose file" @input="input => calculateHash({ input, alg, isText: false })"></b-form-file>
        </b-tab>
      </b-tabs>
      <b-form-group label="Computed Hash">
        <b-form-textarea :value="outputHex" placeholder="Hash Output" :rows="5" readonly />
      </b-form-group>
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  data: () => ({
    algs: [
      {
        text: 'MD5',
        value: 'md5'
      },
      {
        text: 'SHA-1',
        value: 'sha1'
      },
      {
        text: 'SHA-256',
        value: 'sha256'
      },
      {
        text: 'SHA-512',
        value: 'sha512'
      }
    ]
  }),
  computed: {
    ...mapState({
      alg: state => state.hash.alg,
      input: state => state.hash.input.name || state.hash.input,
      outputHex: state => state.hash.outputHex
    })
  },
  methods: {
    ...mapMutations({
      setHashAlg: 'hash/setAlg'
    }),
    ...mapActions({
      calculateHash: 'hash/calculate'
    })
  }
}
</script>
