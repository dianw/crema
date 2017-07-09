import Vue from 'vue';
import Router from 'vue-router';
import Home from 'views/Home';
import EncryptDecrypt from 'views/EncryptDecrypt';
import Hash from 'views/Hash';
import KeyPairGen from 'views/KeyPairGen';

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
      path: '/hash',
      component: Hash
    },
    {
      name: 'encrypt-decrypt',
      path: '/encrypt-decrypt',
      component: EncryptDecrypt
    },
    {
      name: 'key-pair-gen',
      path: '/key-pair-gen',
      component: KeyPairGen
    }
  ]
})
