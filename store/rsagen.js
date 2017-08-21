import forge from 'node-forge'

export const state = () => ({
  keySize: 2048,
  privateKeyPem: null,
  publicKeyPem: null,
  publicKeySSH: null
})

export const mutations = {
  setKeySize (state, keySize) {
    state.keySize = keySize
  },
  setKeyPair (state, keyPair) {
    state.privateKeyPem = keyPair.privateKeyPem
    state.publicKeyPem = keyPair.publicKeyPem
    state.publicKeySSH = keyPair.publicKeySSH
  }
}

export const actions = {
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
      privateKeyPem: forge.pki.privateKeyToPem(keyPair.privateKey),
      publicKeyPem: forge.pki.publicKeyToPem(keyPair.publicKey),
      publicKeySSH: forge.ssh.publicKeyToOpenSSH(keyPair.publicKey)
    })).then(keyPair => {
      commit('setKeyPair', keyPair)
      return keyPair
    })
  }
}
