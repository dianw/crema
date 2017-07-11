<template>
  <div class="row">
    <div class="col-xs-12 col-md-4 col-lg-3">
      <b-nav vertical pills>
        <b-nav-item v-for="h in hashTypes" :key="h" :active="hashType.alg === h.alg" @click="changeAlg(h)">{{ h.text }}</b-nav-item>
      </b-nav>
    </div>
    <div class="col-xs-12 col-md-8 col-lg-9">
      <b-form @submit.prevent="hashText(hashType.alg, inputText)">
        <div class="form-group">
          <label for="input">Text Input</label>
          <b-form-input id="input" v-model="inputText" :value="hashInputText"></b-form-input>
        </div>
        <div class="form-group">
          <b-button type="submit" variant="primary">{{ hashType.text }}</b-button>
        </div>
      </b-form>
      <div class="form-group">
        <label for="output">Output</label>
        <b-form-input id="output" v-model="hashOutputHex" readonly></b-form-input>
      </div>
    </div>
  </div>
</template>

<script>
import forge from 'node-forge';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      hashType: {},
      inputText: ''
    }
  },
  computed: {
    hashTypes() {
      return [
        {
          text: 'MD5',
          alg: 'md5'
        },
        {
          text: 'SHA-1',
          alg: 'sha1'
        },
        {
          text: 'SHA-256',
          alg: 'sha256'
        },
        {
          text: 'SHA-512',
          alg: 'sha512'
        }
      ];
    },
    ...mapState({
      hashInputText: 'hashInputText',
      hashOutputHex: state => state.hashOutput.hex
    })
  },
  methods: {
    changeAlg(hashType) {
      this.hashType = hashType;
      this.hashText(hashType.alg, this.inputText);
    },
    hashText(alg, text) {
      this.$store.dispatch('hashText', { alg, text });
    }
  },
  mounted() {
    this.inputText = this.hashInputText;
    this.hashType = this.hashTypes[0];
  }
}
</script>
