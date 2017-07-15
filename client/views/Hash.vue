<template>
  <div class="row">
    <div class="col-xs-12 col-md-4 col-lg-3">
      <sidenav :tabs="hashTypes" @link-click="changeAlg"></sidenav>
    </div>
    <div class="col-xs-12 col-md-8 col-lg-9">
      <b-card>
        <b-nav slot="header" tabs class="card-header-tabs">
          <b-nav-item :active="isText" @click="isText = true">Text</b-nav-item>
          <b-nav-item :active="!isText" @click="isText = false">File</b-nav-item>
        </b-nav>
        <b-form @submit.prevent>
          <div class="form-group" v-if="isText">
            <label for="text-input">Text Input</label>
            <b-form-input id="text-input" v-model="inputText" :rows="3" ref="inputText" @input="hash" textarea autofocus></b-form-input>
          </div>
          <div class="form-group" v-if="!isText">
            <b-form-file id="file-input" v-model="inputFile" type="file" ref="inputFile" @input="hash"></b-form-file>
          </div>
        </b-form>
        <div class="form-group">
          <label for="hex-output">Computed {{ hashType.title }}</label>
          <b-form-input id="hex-output" v-model="hashOutputHex" :rows="5" textarea readonly></b-form-input>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import Sidenav from 'components/Sidenav';
import { mapState } from 'vuex';

export default {
  components: {
    Sidenav
  },
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
          title: 'MD5',
          alg: 'md5'
        },
        {
          title: 'SHA-1',
          alg: 'sha1'
        },
        {
          title: 'SHA-256',
          alg: 'sha256',
          active: true
        },
        {
          title: 'SHA-512',
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
