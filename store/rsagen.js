import forge from 'node-forge'

export const state = () => ({
  keySize: 2048,
  keySizes: [ 512, 1024, 2048, 4096 ],
  keyPair: null,
  privateKeyPem: null,
  publicKeyPem: null,
  publicKeySSH: null,
  publicKeyFingerprint: null
})

export const mutations = {
  setKeySize (state, keySize) {
    state.keySize = keySize
  },
  setKeyPair (state, keyPair) {
    state.keyPair = keyPair.keyPair
    state.privateKeyPem = keyPair.privateKeyPem
    state.publicKeyPem = keyPair.publicKeyPem
    state.publicKeySSH = keyPair.publicKeySSH
    state.publicKeyFingerprint = keyPair.publicKeyFingerprint
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
      keyPair: keyPair,
      privateKeyPem: forge.pki.privateKeyToPem(keyPair.privateKey),
      publicKeyPem: forge.pki.publicKeyToPem(keyPair.publicKey),
      publicKeySSH: forge.ssh.publicKeyToOpenSSH(keyPair.publicKey),
      publicKeyFingerprint: forge.ssh.getPublicKeyFingerprint(keyPair.publicKey, {encoding: 'hex', delimiter: ':'})
    })).then(keyPair => {
      commit('setKeyPair', keyPair)
      return keyPair
    })
  }
}
