<template>
  <div>
    <v-tabs dark fixed icons>
      <v-tabs-bar slot="activators" class="blue darken-4">
        <v-tabs-slider class="orange darken-2"></v-tabs-slider>
        <v-tabs-item href="#tab-1">
          <v-icon>short_text</v-icon>
          Text
        </v-tabs-item>
        <v-tabs-item href="#tab-2">
          <v-icon>attachment</v-icon>
          File
        </v-tabs-item>
      </v-tabs-bar>
      <v-tabs-content id="tab-1">
        <v-card flat>
          <v-card-text>
            <v-text-field label="Input Text" multi-line autofocus v-model="inputText" @input="hash(true)"></v-text-field>
            <v-text-field label="Computed Hash" multi-line disabled v-model="hashOutputHex"></v-text-field>
          </v-card-text>
        </v-card>
      </v-tabs-content>
      <v-tabs-content id="tab-2">
        <v-card flat>
          <v-card-text>
            <v-btn class="ml-0 mr-0 mb-4" @click="chooseFile">
              <v-icon>attach_file</v-icon>
              Choose file
            </v-btn>
            <input ref="inputFile" name="inputFile" type="file" style="visibility: hidden;" @change="hashFile" />
            <v-text-field label="Computed Hash" multi-line disabled v-model="hashOutputHex"></v-text-field>
          </v-card-text>
        </v-card>
      </v-tabs-content>
    </v-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      alg: 'sha256',
      inputText: '',
      inputFile: {}
    }
  },
  computed: {
    ...mapState({
      hashInput: 'hashInput',
      hashOutputHex: state => state.hashOutput.hex
    })
  },
  methods: {
    changeAlg(alg) {
      this.alg = alg || this.alg;
      this.isText = this.hashInput.isText;
      if (this.isText) {
        this.inputText = this.hashInput.value;
      } else {
        this.inputFile = this.hashInput.value;
      }
      this.hash(true);
    },
    chooseFile() {
      this.$refs.inputFile.click();
    },
    hash(isText) {
      this.$store.dispatch('hash', { alg: this.alg, isText, input: isText ? this.inputText : this.inputFile });
    },
    hashFile(file) {
      this.inputFile = file.target.files[0];
      this.hash(false);
    }
  },
  mounted() {
    this.changeAlg(this.$route.params.alg);
  },
  watch: {
    ['$route.params.alg'](alg) {
      this.changeAlg(alg);
    }
  }
}
</script>

<style>
</style>
