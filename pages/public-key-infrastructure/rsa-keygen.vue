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
              <b-list-group-item v-for="kp in keyPairs" :key="kp.id">
                <b-button variant="danger" size="sm" class="pull-right">
                  <i class="fa fa-trash"></i>
                </b-button>
                <h6 v-text="kp.data.name"></h6>
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </div>
      </div>
    </b-card>
  </no-ssr>
</template>

<script>
import { mapActions, mapState } from 'vuex'
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
      keyPairs: state => state.rsagen.keyPairs,
      privateKeyPem: state => state.rsagen.privateKeyPem,
      publicKeyPem: state => state.rsagen.publicKeyPem,
      publicKeySSH: state => state.rsagen.publicKeySSH,
      publicKeyFingerprint: state => state.rsagen.publicKeyFingerprint
    })
  },
  methods: {
    generate () {
      this.generating = true
      this.rsagenGenerate(this.keySize).then(() => {
        this.generating = false
      })
    },
    saveKeyPair (name, key) {
      this.rsagenSave({ name, key })
    },
    ...mapActions({
      isLoggedIn: 'auth/isLoggedIn',
      rsagenFetch: 'rsagen/fetch',
      rsagenGenerate: 'rsagen/generate',
      rsagenSave: 'rsagen/save'
    })
  },
  mounted () {
    this.isLoggedIn().then(() => {
      this.rsagenFetch()
    })
  }
}
</script>
