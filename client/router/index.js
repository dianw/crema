import Vue from 'vue';
import Router from 'vue-router';
import Home from 'views/Home';
import Hash from 'views/Hash';
import PKI from 'views/PKI';
import PKICSR from 'views/pki/CertificateSigningRequest';
import PKIKeyPairGen from 'views/pki/KeyPairGenerator';

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home
    },
    {
      name: 'hash',
      path: '/hash/:alg',
      component: Hash
    },
    {
      name: 'pki',
      path: '/public-key-infrastructure',
      component: PKI,
      children: [
        {
          name: 'key-pair-gen',
          path: 'key-pair-generator',
          component: PKIKeyPairGen
        },
        {
          name: 'csr',
          path: 'certificate-signing-request',
          component: PKICSR
        }
      ]
    }
  ]
})
