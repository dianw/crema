<template>
  <div>
    <h3>Generate RSA Key-Pair </h3>
    <b-card>
      <div class="row">
        <div class="col-md-6">
          <b-form-group label="Key Size">
            <b-form-select :options="keySizes" :value="keySize" @input="$store.commit('rsagen/setKeySize', $event)" :disabled="generating"></b-form-select>
          </b-form-group>
          <b-form-group>
            <b-btn variant="primary" :disabled="generating" size="lg" @click="generate">Generate Key Pair</b-btn>
          </b-form-group>
          <key-pair-tab :key-pair="keyPair" @save="saveKeyPair"></key-pair-tab>
        </div>
        <div class="col-md-6">
          <b-card header="Saved Key-Pairs" header-tag="strong" no-block class="mb-0">
            <b-alert variant="info" class="mb-0" show>
              <em>Work-in-progress</em>
            </b-alert>
            <b-list-group flush>
              <b-list-group-item v-for="kp in keyPairs" :key="kp.id">
                <b-button variant="danger" size="sm" class="pull-right" @click="rsagenDelete(kp.id)">
                  <i class="fa fa-trash"></i>
                </b-button>
                <b-link :download="`${kp.data.name}.pem`" :href="kp.data.storageDownloadUrl" class="btn btn-sm btn-primary pull-right mr-1">
                  <i class="fa fa-download"></i>
                </b-link>
                <h6 v-text="kp.data.name"></h6>
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </div>
      </div>
    </b-card>
  </div>
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
      keyPair: state => state.rsagen.keyPair,
      keyPairs: state => state.rsagen.keyPairs
    })
  },
  methods: {
    generate () {
      this.generating = true
      this.rsagenGenerate(this.keySize).then(() => {
        this.generating = false
      })
    },
    saveKeyPair (name, password, key) {
      this.rsagenSave({ name, password, key })
    },
    ...mapActions({
      isLoggedIn: 'auth/isLoggedIn',
      rsagenDelete: 'rsagen/delete',
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
