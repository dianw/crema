<template>
  <no-ssr>
    <b-card header="Hash" header-tag="h3">
      <b-form-fieldset label="Algorithm">
        <b-form-select :options="algs" v-model="alg"></b-form-select>
      </b-form-fieldset>
      <b-tabs>
        <b-tab title="Text Input">
          <b-form-input placeholder="Insert text here" :rows="5" textarea></b-form-input>
        </b-tab>
        <b-tab title="File Input">
          <b-form-file choose-label="Choose file" placeholder="Choose file"></b-form-file>
        </b-tab>
      </b-tabs>
      <b-form-fieldset label="Computed Hash">
        <b-form-input placeholder="Hash Output" :rows="5" textarea readonly></b-form-input>
      </b-form-fieldset>
    </b-card>
  </no-ssr>
</template>

<script>
export default {
  data: () => ({
    alg: 'sha256',
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
  })
}
</script>
