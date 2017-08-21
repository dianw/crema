<template>
  <b-card>
    <h1 class="display-1">crema</h1>
    <h1 class="display-4">Graphical Crypto Toolkit</h1>
    <br />
    <br />
    <b-btn variant="primary" size="lg" :to="{ name: 'hash' }">Hash Calculator</b-btn>
    &nbsp;
    <b-btn variant="primary" size="lg" :to="{ name: 'public-key-infrastructure-rsa-keygen' }">RSA Key-Pair Generator</b-btn>
  </b-card>
</template>

<script>
export default {
  components: {
  }
}
</script>
