<template>
  <no-ssr>
    <b-card header="Certificate Signing Request" header-tag="h3">
      <div>
        <b-alert variant="warning" show>
          <em>
            <strong>This feature is still work in progress</strong>
          </em>
        </b-alert>
      </div>
      <div class="row">
        <div class="col-md-6">
          <b-form @submit.prevent>
            <b-form-fieldset label="Key Size">
              <b-form-select v-model="keySize" :options="keySizes"></b-form-select>
            </b-form-fieldset>
            <b-form-fieldset label="Common Name">
              <b-form-input v-model="dn.commonName"></b-form-input>
            </b-form-fieldset>
            <b-form-fieldset label="Organization">
              <b-form-input v-model="dn.organizationName"></b-form-input>
            </b-form-fieldset>
            <b-form-fieldset label="Department">
              <b-form-input v-model="dn.organizationalUnitName"></b-form-input>
            </b-form-fieldset>
            <b-form-fieldset label="City">
              <b-form-input id="city" v-model="dn.localityName"></b-form-input>
            </b-form-fieldset>
            <b-form-fieldset label="State / Province">
              <b-form-input v-model="dn.stateOrProvinceName"></b-form-input>
            </b-form-fieldset>
            <b-form-fieldset label="Country">
              <b-form-select id="country" v-model="dn.countryName" :options="countries"></b-form-select>
            </b-form-fieldset>
            <b-form-fieldset label="Key Size">
              <b-button type="submit" size="lg" variant="primary">Generate CSR</b-button>
            </b-form-fieldset>
          </b-form>
        </div>
        <div class="col-md-6">
          <b-form-fieldset label="PEM Output">
            <b-form-input placeholder="CSR PEM Output" :rows="15" readonly textarea></b-form-input>
          </b-form-fieldset>
        </div>
      </div>
    </b-card>
  </no-ssr>
</template>

<script>
export default {
  data: () => ({
    dn: {
      commonName: null,
      organizationName: null,
      organizationalUnitName: null,
      localityName: null,
      stateOrProvinceName: null,
      countryName: null
    }
  })
}
</script>
