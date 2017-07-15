import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import forge from 'node-forge';

import countries from 'store/countries';
import keyPair from 'store/key-pair';

Vue.use(Vuex);

const state = {
  countries,
  csr: null,
  csrSubject: [],
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
  setCSR(state, csr) {
    state.csr = csr;
  },
  setCSRSubject(state, subject) {
    const csrSubject = [];
    for (const s in subject) {
      csrSubject.push({
        name: s,
        value: subject[s]
      });
    }
    state.csrSubject = csrSubject;
  },
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
  generateCSR({ commit, dispatch, state }, { keyPairBits }) {
    dispatch('generateKeyPair', keyPairBits).then(keyPair => {
      const csr = forge.pki.createCertificationRequest();
      csr.publicKey = keyPair.publicKey;
      csr.setSubject(state.csrSubject);
      csr.sign(keyPair.privateKey);
      commit('setCSR', {
        csr: csr,
        pem: forge.pki.certificationRequestToPem(csr)
      });
    });
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
  actions,
  plugins: [ createPersistedState() ],
  modules: {
    keyPair
  }
})

export default store
