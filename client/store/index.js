import Vue from 'vue';
import Vuex from 'vuex';
import forge from 'node-forge';
import countries from 'store/countries';

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
  },
  keyPairs: [],
  keySizes: [ 512, 1024, 2048, 4096 ]
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
  },
  addKeyPair(state, keyPair) {
    state.keyPairs.push(keyPair);
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
    dispatch('generateKeyPair', keyPairBits).then(() => {
      const keyPair = state.keyPairs[state.keyPairs.length - 1].keyPair;
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
  generateKeyPair({ commit }, bits = 2048) {
    return new Promise((resolve, reject) => {
      forge.pki.rsa.generateKeyPair({ bits, workers: 2 }, (err, keyPair) => {
        if (err) {
          reject(err);
        } else {
          const result = {
            keyPair,
            privateKeyPem: forge.pki.privateKeyToPem(keyPair.privateKey),
            publicKeyPem: forge.pki.publicKeyToPem(keyPair.publicKey)
          };
          commit("addKeyPair", result);
          resolve(result);
        }
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
  actions
})

export default store
