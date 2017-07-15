import forge from 'node-forge';

const state = {
  keyPairs: [],
  keySizes: [ 512, 1024, 2048, 4096 ]
}

const mutations = {
  deleteSavedKeyPair(state, index) {
    state.keyPairs.splice(index, 1);
  },
  saveKeyPair(state, kp) {
    state.keyPairs.push(kp);
  }
}

const actions = {
  generateKeyPair({ commit }, bits = 2048) {
    return new Promise((resolve, reject) => {
      forge.pki.rsa.generateKeyPair({ bits, workers: 2 }, (err, keyPair) => {
        if (err) {
          reject(err);
        } else {
          resolve(keyPair);
        }
      });
    });
  },
  keyPairToPem(ctx, keyPair) {
    return {
      privateKey: forge.pki.privateKeyToPem(keyPair.privateKey),
      publicKey: forge.pki.publicKeyToPem(keyPair.publicKey)
    }
  },
  saveKeyPair({ commit }, { name, keyPair }) {
    if (keyPair && keyPair.privateKey && keyPair.publicKey) {
      if (!name || name.trim() === '') {
        name = forge.ssh.getPublicKeyFingerprint(keyPair.publicKey, {encoding: 'hex', delimiter: ':'});
      }
      commit('saveKeyPair', { name, keyPair })
    }
  }
}

export default { actions, mutations, state }
