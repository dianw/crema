<template>
  <b-card header="RSA Key-Pair Generator" header-tag="h3">
    <b-form-fieldset label="Key Size">
      <b-form-select :options="keySizes" v-model="keySize"></b-form-select>
    </b-form-fieldset>
    <b-form-fieldset>
      <b-btn variant="primary">Generate Key Pair</b-btn>
    </b-form-fieldset>
    <br />
    <b-tabs>
      <b-tab title="Private Key">
        <b-form-input placeholder="Private Key Output" :rows="rowSize" textarea readonly></b-form-input>
      </b-tab>
      <b-tab title="Public Key">
        <b-form-input placeholder="Public Key Output" :rows="rowSize" textarea readonly></b-form-input>
      </b-tab>
      <b-tab title="SSH Public Key">
        <b-form-input placeholder="SSH Public Key Output" :rows="rowSize" textarea readonly></b-form-input>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
export default {
  data: () => ({
    keySize: 2048,
    keySizes: [ 512, 1024, 2048, 4096 ],
    rowSize: 15
  })
}
</script>
