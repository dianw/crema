import Vue from 'vue';
import Vuex from 'vuex';
import forge from 'node-forge';

Vue.use(Vuex);

const state = {
  hashInput: {
    isText: true,
    value: ''
  },
  hashOutput: {
    md: null,
    hex: null
  }
}

const mutations = {
  setHashInput(state, { isText, value }) {
    state.hashInput.isText = isText;
    state.hashInput.value = value;
  },
  setHashOutput(state, md) {
    state.hashOutput.md = md;
    state.hashOutput.hex = state.hashInput.value === '' ? '' : md.toHex();
  }
}

const actions = {
  generateRandom(ctx, bytes = 16) {
    const randomBytes = forge.random.getBytesSync(bytes);
    return {
      bytes: randomBytes,
      hex: forge.util.bytesToHex(randomBytes)
    }
  },
  cipher({commit}, { alg, iv, input, password }) {
    const salt = forge.random.getBytesSync(128);
    const key = forge.pkcs5.pbkdf2(password, salt, 16, 16);
    const cipher = forge.cipher.createCipher(alg, key);
    cipher.start({ iv: iv.bytes });
    cipher.update(forge.util.createBuffer(input));
    cipher.finish();
    return cipher.output;
  },
  hash({ commit, state }, { alg, input, isText }) {
    const md = forge.md[alg].create();
    if (isText) {
      md.update(input);
      commit('setHashInput', { isText: true, value: input });
      commit('setHashOutput', md.digest());
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const binary = new Uint8Array(reader.result);
        for (let i = 0; i < binary.length; i++) {
          md.update(String.fromCharCode(binary[i]));
        }
        commit('setHashInput', { isText: false, value: input });
        commit('setHashOutput', md.digest());
      };
      reader.readAsArrayBuffer(input);
    }
    return state.hashOutput;
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

export default store
