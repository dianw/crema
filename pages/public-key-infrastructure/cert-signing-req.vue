<template>
  <div>
    <h3>Certificate Signing Request</h3>
    <b-card>
      <div class="row">
        <div class="col-md-6">
          <b-form @submit.prevent="generate" :disabled="generating">
            <b-form-fieldset label="Key Size">
              <b-form-select :value="keySize" :options="keySizes" @input="$store.commit('rsagen/setKeySize', $event)" :disabled="generating"></b-form-select>
            </b-form-fieldset>
            <b-form-fieldset label="Common Name">
              <b-form-input v-model="dn.commonName" :disabled="generating"></b-form-input>
            </b-form-fieldset>
            <b-form-fieldset label="Organization">
              <b-form-input v-model="dn.organizationName" :disabled="generating"></b-form-input>
            </b-form-fieldset>
            <b-form-fieldset label="Department">
              <b-form-input v-model="dn.organizationalUnitName" :disabled="generating"></b-form-input>
            </b-form-fieldset>
            <b-form-fieldset label="City">
              <b-form-input id="city" v-model="dn.localityName" :disabled="generating"></b-form-input>
            </b-form-fieldset>
            <b-form-fieldset label="State / Province">
              <b-form-input v-model="dn.stateOrProvinceName" :disabled="generating"></b-form-input>
            </b-form-fieldset>
            <b-form-fieldset label="Country">
              <b-form-select v-model="dn.countryName" :options="countries" :disabled="generating"></b-form-select>
            </b-form-fieldset>
            <b-form-fieldset>
              <b-button type="submit" size="lg" variant="primary" :disabled="generating">Generate CSR</b-button>
            </b-form-fieldset>
          </b-form>
        </div>
        <div class="col-md-6 monospace">
          <b-form-fieldset>
            <b-form-textarea placeholder="CSR PEM Output" :rows="15" readonly :value="csrPem" />
          </b-form-fieldset>
          <b-form-fieldset>
            <key-pair-tab :key-pair="keyPair"></key-pair-tab>
          </b-form-fieldset>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import KeyPairTab from '~/components/KeyPairTab'

export default {
  components: {
    KeyPairTab
  },
  data: () => ({
    dn: {
      commonName: null,
      organizationName: null,
      organizationalUnitName: null,
      localityName: null,
      stateOrProvinceName: null,
      countryName: 'ID'
    },
    generating: false
  }),
  computed: {
    ...mapState({
      subject: state => state.csr.subject,
      subjectDn: state => state.csr.dn,
      csrPem: state => state.csr.pem,
      keySize: state => state.rsagen.keySize,
      keySizes: state => state.rsagen.keySizes,
      countries: state => state.country.countries,
      keyPair: state => state.rsagen.keyPair
    })
  },
  methods: {
    generate () {
      this.generating = true
      this.$store.dispatch('csr/generate', { dn: this.dn, keySize: this.keySize }).then(() => {
        this.generating = false
      })
    }
  },
  mounted () {
    if (this.subjectDn) {
      this.dn = this.subjectDn
    }
  }
}
</script>
