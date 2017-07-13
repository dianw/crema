<template>
  <div class="row">
    <div class="col-xs-12 col-md-4 col-lg-3">
      <b-nav vertical pills>
        <b-nav-item :to="{ name: 'key-pair-gen' }">RSA Key-Pair</b-nav-item>
        <b-nav-item :to="{ name: 'csr' }">Certificate Signing Request</b-nav-item>
        <b-nav-item>X.509 Certificate</b-nav-item>
        <b-nav-item>PKCS#12</b-nav-item>
      </b-nav>
    </div>
    <div class="col-xs-12 col-md-8 col-lg-9">
      <router-view></router-view>
    </div>
  </div>
</template>
