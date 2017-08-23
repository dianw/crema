<template>
  <b-card>
    <h1 class="display-1">crema</h1>
    <h1 class="display-4">Graphical Crypto Toolkit</h1>
    <br />
    <br />
    <div class="d-flex flex-wrap">
      <div class="p-2">
        <b-btn variant="primary" size="lg" :to="{ name: 'hash' }">Hash Calculator</b-btn>
      </div>
      <div class="p-2">
        <b-btn variant="primary" size="lg" :to="{ name: 'public-key-infrastructure-rsa-keygen' }">RSA Key-Pair Generator</b-btn>
      </div>
      <div class="p-2">
        <b-btn variant="primary" size="lg" :to="{ name: 'public-key-infrastructure-cert-signing-req' }">Certificate Signing Request</b-btn>
      </div>
    </div>
    &nbsp;
    &nbsp;
  </b-card>
</template>

<script>
export default {
  components: {
  }
}
</script>
