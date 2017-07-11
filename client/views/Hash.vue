<template>
  <div class="row">
    <div class="col-xs-12 col-md-4 col-lg-3">
      <b-nav vertical pills>
        <b-nav-item v-for="h in hashTypes" :key="h" :active="hashType.alg === h.alg" @click="changeAlg(h)">{{ h.text }}</b-nav-item>
      </b-nav>
    </div>
    <div class="col-xs-12 col-md-8 col-lg-9">
      <b-nav tabs>
        <b-nav-item :active="isText" @click="isText = true">Text</b-nav-item>
        <b-nav-item :active="!isText" @click="isText = false">File</b-nav-item>
      </b-nav>
      <br />
      <b-form @submit.prevent>
        <div class="form-group" v-if="isText">
          <label for="text-input">Text Input</label>
          <b-form-input id="text-input" v-model="inputText" :rows="3" ref="inputText" @input="hash" textarea autofocus></b-form-input>
        </div>
        <div class="form-group" v-if="!isText">
          <b-form-file id="file-input" v-model="inputFile" type="file" ref="inputFile" @input="hash"></b-form-file>
        </div>
      </b-form>
      <br />
      <div class="form-group">
        <label for="hex-output">Hex Output</label>
        <b-form-input id="hex-output" v-model="hashOutputHex" :rows="5" textarea readonly></b-form-input>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      hashType: {},
      inputText: '',
      inputFile: {},
      isText: true
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
      hashInput: 'hashInput',
      hashOutputHex: state => state.hashOutput.hex
    })
  },
  methods: {
    changeAlg(hashType) {
      this.hashType = hashType || this.hashTypes[2];
      this.isText = this.hashInput.isText;
      if (this.isText) {
        this.inputText = this.hashInput.value;
      } else {
        this.inputFile = this.hashInput.value;
      }
      this.hash();
    },
    hash() {
      this.$store.dispatch('hash', { alg: this.hashType.alg, isText: this.isText, input: this.isText ? this.inputText : this.inputFile });
    }
  },
  mounted() {
    this.changeAlg();
  }
}
</script>
