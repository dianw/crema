<template>
  <div class="phone-viewport">
    <md-list>
      <md-list-item md-expand-multiple>
        <md-icon>vpn_key</md-icon>
        <span>Hash</span>
        <md-list-expand>
          <md-list>
            <md-list-item class="md-inset">
              <router-link :to="{ name: 'hash' }">MD5</router-link>
            </md-list-item>
            <md-list-item class="md-inset">SHA-1</md-list-item>
            <md-list-item class="md-inset">SHA-256</md-list-item>
            <md-list-item class="md-inset">SHA-512</md-list-item>
          </md-list>
        </md-list-expand>
      </md-list-item>

      <md-list-item md-expand-multiple>
        <md-icon>fingerprint</md-icon>
        <span>Public-Key Infra</span>
        <md-list-expand>
          <md-list>
            <md-list-item class="md-inset">RSA Key-Pair</md-list-item>
            <md-list-item class="md-inset">Certificate Signing Request</md-list-item>
          </md-list>
        </md-list-expand>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
export default {
}
</script>
