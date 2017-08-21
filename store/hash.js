import forge from 'node-forge'

export const state = () => ({
  alg: 'sha256',
  input: '',
  isInputText: true,
  outputHex: '',
  outputMd: null
})

export const mutations = {
  setAlg (state, alg) {
    state.alg = alg
  },
  setInput (state, { isText, input }) {
    state.input = input
    state.isInputText = isText
  },
  setOutput (state, md) {
    state.outputMd = md
    state.outputHex = state.input === '' ? '' : md.toHex()
  }
}

export const actions = {
  calculate ({ commit, state }, { alg, input, isText }) {
    const md = forge.md[alg].create()
    if (isText) {
      md.update(input)
      commit('setInput', { isText: true, input })
      commit('setOutput', md.digest())
    } else {
      const reader = new FileReader()
      reader.onload = () => {
        const binary = new Uint8Array(reader.result)
        for (let i = 0; i < binary.length; i++) {
          md.update(String.fromCharCode(binary[i]))
        }
        commit('setInput', { isText: false, input })
        commit('setOutput', md.digest())
      }
      reader.readAsArrayBuffer(input)
    }
    return state.outputHex
  }
}
