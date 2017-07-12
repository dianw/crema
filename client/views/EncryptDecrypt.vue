<template>
  <div class="row">
    <div class="col-xs-12 col-md-4 col-lg-3">
      <b-nav vertical pills>
        <b-nav-item v-for="h in algs" :key="h" :active="alg.alg === h.alg" @click="changeAlg(h)">{{ h.text }}</b-nav-item>
      </b-nav>
    </div>
    <div class="col-xs-12 col-md-8 col-lg-9">
      <b-form @submit.prevent="encrypt">
        <div class="form-group">
          <label for="mode">Mode of operation</label>
          <b-form-select id="mode" v-model="mode" :options="alg.modes"></b-form-select>
        </div>
        <div class="form-group">
          <label for="iv">Initialization Vector</label>
          <b-input-group>
            <b-form-input id="iv" :value="iv.hex" readonly></b-form-input>
            <b-button variant="primary" @click="generateIV">Regenerate</b-button>
          </b-input-group>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <b-form-input id="password" v-model="password" type="password"></b-form-input>
        </div>
        <div class="form-group">
          <label for="input-text">Input Text</label>
          <b-form-input id="input-text" v-model="inputText" :rows="3" textarea></b-form-input>
        </div>
        <div class="form-group">
          <b-button type="submit" variant="primary">Encrypt</b-button>
        </div>
      </b-form>
      <br />
      <div class="form-group">
        <label for="output-text">Hex Output</label>
        <b-form-input id="output-text" v-model="outputText" :rows="5" textarea readonly></b-form-input>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      alg: {},
      iv: null,
      inputText: null,
      mode: null,
      outputText: null,
      password: null
    }
  },
  computed: {
    algs() {
      return [
        {
          text: 'AES',
          alg: 'AES',
          modes: [ 'ECB', 'CBC', 'CFB', 'OFB', 'CTR', 'GCM' ]
        },
        {
          text: '3DES',
          alg: '3DES',
          modes: [ 'ECB', 'CBC' ]
        },
        {
          text: 'DES',
          alg: 'DES',
          modes: [ 'ECB', 'CBC' ]
        }
      ];
    },
    ...mapState({
      hashInput: 'hashInput',
      hashOutputHex: state => state.hashOutput.hex
    })
  },
  methods: {
    changeAlg(alg) {
      this.alg = alg || this.algs[0];
      this.mode = this.alg.modes[0];
      this.generateIV();
    },
    generateIV() {
      this.$store.dispatch('generateRandom').then(random => {
        this.iv = random;
      });
    },
    encrypt() {
      const alg = `${this.alg.alg}-${this.mode}`;
      this.$store.dispatch('cipher', {
        alg, iv: this.iv, input: this.inputText, password: this.password
      }).then(cipher => {
        this.outputText = cipher.toHex();
      });
    }
  },
  mounted() {
    this.changeAlg();
  }
}
</script>
