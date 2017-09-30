<template>
  <no-ssr>
    <b-card header="RSA Key-Pair Generator" header-tag="h3">
      <div class="row">
        <div class="col-md-6">
          <b-form-fieldset label="Key Size">
            <b-form-select :options="keySizes" :value="keySize" @input="$store.commit('rsagen/setKeySize', $event)" :disabled="generating"></b-form-select>
          </b-form-fieldset>
          <b-form-fieldset>
            <b-btn variant="primary" :disabled="generating" size="lg" @click="generate">Generate Key Pair</b-btn>
          </b-form-fieldset>
          <br />
          <key-pair-tab :privateKeyPem="privateKeyPem" :publicKeyPem="publicKeyPem" :publicKeySSH="publicKeySSH" :publicKeyFingerprint="publicKeyFingerprint" @save="saveKeyPair"></key-pair-tab>
        </div>
        <div class="col-md-6">
          <b-card header="Saved Key-Pairs" header-tag="strong" no-block class="mb-0">
            <b-alert variant="info" class="mb-0" show>
              <em>Work-in-progress</em>
            </b-alert>
            <b-list-group flush>
              <b-list-group-item v-for="(i, index) in new Array(5)" :key="i">
                <b-button variant="danger" size="sm" class="pull-right">
                  <i class="fa fa-trash"></i>
                </b-button>
                <h6>My Key {{ index + 1 }}</h6>
                <p class="text-muted">ff:7a:d0:3d:cf:78:3e:9c:49:09:c4:83:ae:aa:46:8{{ index }}</p>
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </div>
      </div>
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
      publicKeySSH: state => state.rsagen.publicKeySSH,
      publicKeyFingerprint: state => state.rsagen.publicKeyFingerprint
    })
  },
  methods: {
    generate () {
      this.generating = true
      this.$store.dispatch('rsagen/generate', this.keySize).then(() => {
        this.generating = false
      })
    },
    saveKeyPair (name) {
      console.log(name)
    }
  }
}
</script>
