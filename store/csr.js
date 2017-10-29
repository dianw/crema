import { pki } from 'node-forge'

export const state = () => ({
  dn: null,
  csr: null,
  pem: null,
  subject: []
})

export const mutations = {
  setCSR (state, { csr, pem }) {
    state.csr = csr
    state.pem = pem
  },
  setSubject (state, subject) {
    state.dn = subject
    const csrSubject = state.subject = []
    for (const s in subject) {
      csrSubject.push({
        name: s,
        value: subject[s] || ''
      })
    }
  }
}

export const actions = {
  generate ({ commit, dispatch, state }, { keySize, dn }) {
    return dispatch('rsagen/generate', keySize, { root: true }).then(keyPair => {
      return dispatch('setSubject', dn).then(subject => {
        return { subject, keyPair }
      })
    }).then(({ subject, keyPair }) => {
      const csr = pki.createCertificationRequest()
      csr.publicKey = keyPair.publicKey
      csr.setSubject(subject)
      csr.sign(keyPair.privateKey)
      const signedCsr = {
        csr,
        pem: pki.certificationRequestToPem(csr)
      }
      commit('setCSR', signedCsr)
      return signedCsr
    })
  },
  setSubject ({ commit, state }, dn) {
    commit('setSubject', dn)
    return state.subject
  }
}
