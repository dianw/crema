<template>
  <div>
    <div class="mb-3">
      <p class="mb-0">Key Size</p>
      <v-btn-toggle :items="keySizes.map(k => ({ text: k, value: k }))" v-model="keySize"></v-btn-toggle>
      <v-btn primary @click="genKeyPair" :loading="generating">
        Generate Key Pair
      </v-btn>
    </div>

    <v-tabs v-if="pem && !generating" dark fixed>
      <v-tabs-bar slot="activators" class="blue darken-4">
        <v-tabs-slider class="orange darken-2"></v-tabs-slider>
        <v-tabs-item href="#tab-1">
          Private Key
        </v-tabs-item>
        <v-tabs-item href="#tab-2">
          Public Key
        </v-tabs-item>
        <v-tabs-item href="#tab-3">
          SSH Public Key
        </v-tabs-item>
      </v-tabs-bar>
      <v-tabs-content id="tab-1">
        <v-card flat>
          <v-card-text>
            <code class="pa-2" v-text="pem.privateKey"></code>
          </v-card-text>
        </v-card>
      </v-tabs-content>
      <v-tabs-content id="tab-2">
        <v-card flat>
          <v-card-text>
            <code class="pa-2" v-text="pem.publicKey"></code>
          </v-card-text>
        </v-card>
      </v-tabs-content>
      <v-tabs-content id="tab-3">
        <v-card flat>
          <v-card-text>
            <v-text-field multi-line disabled rows="15" v-model="ssh.publicKey" style="font-family: monospace;"></v-text-field>
          </v-card-text>
        </v-card>
      </v-tabs-content>
    </v-tabs>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data: () => ({
    generating: false,
    keyPair: null,
    keySize: 2048,
    opensshParam: {
      passphrase: '',
      comment: ''
    },
    pem: null,
    ssh: null,
    tab: 0
  }),
  computed: {
    ...mapState({
      keySizes: state => state.keyPair.keySizes
    })
  },
  methods: {
    genKeyPair() {
      this.generating = true;
      this.generateKeyPair(this.keySize).then(keyPair => {
        return this.keyPair = keyPair;
      }).then(keyPair => {
        this.keyPairToPem(keyPair).then(pem => {
          this.pem = pem;
        });
        this.keyPairToOpenSSH({ keyPair, ...this.opensshParam }).then(ssh => {
          this.ssh = ssh;
        });
        this.generating = false;
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
