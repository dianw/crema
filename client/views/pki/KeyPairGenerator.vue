<template>
  <b-card>
    <navtab slot="header" :tabs="tabs" card></navtab>
    <b-form @submit.prevent="genKeyPair">
      <div class="form-group">
        <label for="key-size">Key Size</label>
        <b-form-select id="key-size" v-model="keySize" :options="keySizes"></b-form-select>
      </div>
      <div class="form-group">
        <label for="passphrase">Passphrase</label>
        <b-form-input id="passphrase" type="password" v-model="opensshParam.passphrase"></b-form-input>
      </div>
      <div class="form-group">
        <label for="comment">Comment</label>
        <b-form-input id="comment" v-model="opensshParam.comment"></b-form-input>
      </div>
      <div class="form-group">
        <b-button type="submit" size="lg" variant="primary">Generate Key Pair</b-button>
      </div>
    </b-form>
    <br />
    <div v-if="keyPair">
      <navtab :tabs="[{ title: 'Private Key' }, { title: 'Public Key' }]" @link-click="(t, i) => tab = i"></navtab>
      <div class="form-group" v-if="tab === 0">
        <b-form-input id="private-key-pem" v-model="pem.privateKey" :class="[ 'monospace' ]" :rows="20" textarea readonly></b-form-input>
      </div>
      <div class="form-group" v-if="tab === 1">
        <b-form-input id="public-key-pem" v-model="pem.publicKey" :class="[ 'monospace' ]" :rows="20" textarea readonly></b-form-input>
      </div>
    </div>
  </b-card>
</template>

<script>
// import Navtab from 'components/Navtab';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    // Navtab
  },
  data() {
    return {
      keyPair: null,
      keySize: 2048,
      opensshParam: {
        passphrase: '',
        comment: ''
      },
      pem: {},
      ssh: {},
      tab: 0
    }
  },
  computed: {
    tabs() {
      return [
        {
          title: 'Generate'
        },
        {
          title: 'Saved Keys'
        }
      ]
    },
    ...mapState({
      keySizes: state => state.keyPair.keySizes
    })
  },
  methods: {
    genKeyPair() {
      this.generateKeyPair(this.keySize).then(keyPair => {
        return this.keyPair = keyPair;
      }).then(keyPair => {
        this.keyPairToPem(keyPair).then(pem => {
          this.pem = pem;
        });
        this.keyPairToOpenSSH({ keyPair, ...this.opensshParam }).then(ssh => {
          this.ssh = ssh;
        });
      });
    },
    ...mapActions([
      'generateKeyPair',
      'keyPairToOpenSSH',
      'keyPairToPem',
    ])
  }
}
</script>
