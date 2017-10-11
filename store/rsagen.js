import forge from 'node-forge'

export const state = () => ({
  keySize: 2048,
  keySizes: [ 512, 1024, 2048, 4096 ],
  keyPair: null,
  keyPairs: [],
  privateKeyPem: null,
  publicKeyPem: null,
  publicKeySSH: null,
  publicKeyFingerprint: null
})

export const mutations = {
  addKeyPair (state, keyPair) {
    state.keyPairs.push(JSON.parse(JSON.stringify(keyPair)))
  },
  setKeySize (state, keySize) {
    state.keySize = keySize
  },
  setKeyPair (state, keyPair) {
    state.keyPair = keyPair.keyPair
    state.privateKeyPem = keyPair.privateKeyPem
    state.publicKeyPem = keyPair.publicKeyPem
    state.publicKeySSH = keyPair.publicKeySSH
    state.publicKeyFingerprint = keyPair.publicKeyFingerprint
  },
  setKeyPairs (state, keyPairs) {
    state.keyPairs = keyPairs
  }
}

export const actions = {
  fetch ({ rootState, commit }) {
    const currentUser = rootState.auth.currentUser
    if (!currentUser) {
      return null
    }
    return this.$db.collection('keyPairs')
      .where('uid', '==', currentUser.uid)
      .orderBy('createdDate', 'desc')
      .get()
      .then(docs => {
        commit('setKeyPairs', [])
        docs.forEach(doc => commit('addKeyPair', {
          id: doc.id, data: doc.data()
        }))
        return docs
      })
  },
  generate ({ commit }, keySize) {
    commit('setKeyPair', {})
    return new Promise((resolve, reject) => {
      forge.pki.rsa.generateKeyPair({ bits: keySize, workers: 4 }, (err, keyPair) => {
        if (err) {
          reject(err)
        } else {
          resolve(keyPair)
        }
      })
    }).then(keyPair => ({
      keyPair: keyPair,
      privateKeyPem: forge.pki.privateKeyToPem(keyPair.privateKey),
      publicKeyPem: forge.pki.publicKeyToPem(keyPair.publicKey),
      publicKeySSH: forge.ssh.publicKeyToOpenSSH(keyPair.publicKey),
      publicKeyFingerprint: forge.ssh.getPublicKeyFingerprint(keyPair.publicKey, {encoding: 'hex', delimiter: ':'})
    })).then(keyPair => {
      commit('setKeyPair', keyPair)
      return keyPair
    })
  },
  save ({ rootState, dispatch }, { name, key }) {
    const currentUser = rootState.auth.currentUser
    if (!currentUser) {
      return null
    }
    const keyPairsRef = this.$db.collection('keyPairs').doc()
    return keyPairsRef.set({
      createdDate: this.$serverTimestamp(),
      key,
      name,
      uid: currentUser.uid
    }).then(data => {
      dispatch('fetch')
      return data
    })
  }
}
