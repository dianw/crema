<template>
  <div>
    <b-form>
      <b-form-fieldset label="Algorithm">
        <b-form-select :options="algs" v-model="alg"></b-form-select>
      </b-form-fieldset>
    </b-form>
  </div>
</template>

<script>
export default {
  data: () => ({
    alg: 'sha256',
    algs: [
      {
        text: 'SHA-512',
        value: 'sha512'
      },
      {
        text: 'SHA-256',
        value: 'sha256'
      },
      {
        text: 'SHA-1',
        value: 'sha1'
      },
      {
        text: 'MD5',
        value: 'md5'
      }
    ]
  })
}
</script>
