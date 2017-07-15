<template>
  <div>
    <b-form @submit.prevent="generateCSR">
      <div class="form-group">
        <label for="key-size">Key Size</label>
        <b-form-select id="key-size" v-model="keySize" :options="keySizes"></b-form-select>
      </div>
      <div class="form-group">
        <label for="common-name">Common Name</label>
        <b-form-input id="common-name" v-model="dn.commonName"></b-form-input>
      </div>
      <div class="form-group">
        <label for="organization">Organization</label>
        <b-form-input id="organization" v-model="dn.organizationName"></b-form-input>
      </div>
      <div class="form-group">
        <label for="department">Department</label>
        <b-form-input id="department" v-model="dn.organizationalUnitName"></b-form-input>
      </div>
      <div class="form-group">
        <label for="city">City</label>
        <b-form-input id="city" v-model="dn.localityName"></b-form-input>
      </div>
      <div class="form-group">
        <label for="state">State / Province</label>
        <b-form-input id="state" v-model="dn.stateOrProvinceName"></b-form-input>
      </div>
      <div class="form-group">
        <label for="country">Country</label>
        <b-form-select id="country" v-model="dn.countryName" :options="countries"></b-form-select>
      </div>
      <div class="form-group">
        <b-button type="submit" size="lg" variant="primary">Generate CSR</b-button>
      </div>
    </b-form>
    <div class="form-group" v-if="csr">
      <label for="csr">Certificate Signing Request</label>
      <b-form-input id="csr" v-model="csr.pem" class="monospace" :rows="20" textarea readonly></b-form-input>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      keySize: 2048,
      dn: {
        commonName: '',
        countryName: 'US',
        organizationName: '',
        organizationalUnitName: '',
        localityName: '',
        stateOrProvinceName: ''
      },
      timer: null
    }
  },
  computed: {
    ...mapState({
      countries: 'countries',
      csr: 'csr',
      csrSubject: 'csrSubject',
      keySizes: state => state.keyPair.keySizes
    })
  },
  methods: {
    generateCSR() {
      this.$store.commit('setCSRSubject', this.dn);
      this.$store.dispatch('generateCSR', { keyPairBits: this.keySize });
    }
  },
  mounted() {
    const dn = this.dn;
    for (let s in this.csrSubject) {
      s = this.csrSubject[s];
      dn[s.name] = s.value;
    }
  },
  created() {
    this.timer = setInterval(() => {
      this.$store.commit('setCSRSubject', this.dn);
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
}
</script>
