import { md } from 'node-forge'

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
  setOutput (state, message) {
    state.outputMd = message
    state.outputHex = state.input === '' ? '' : message.toHex()
  }
}

export const actions = {
  calculate ({ commit, state }, { alg, input, isText }) {
    const message = md[alg].create()
    if (isText) {
      message.update(input)
      commit('setInput', { isText: true, input })
      commit('setOutput', message.digest())
    } else {
      const reader = new FileReader()
      reader.onload = () => {
        const binary = new Uint8Array(reader.result)
        for (let i = 0; i < binary.length; i++) {
          message.update(String.fromCharCode(binary[i]))
        }
        commit('setInput', { isText: false, input })
        commit('setOutput', message.digest())
      }
      reader.readAsArrayBuffer(input)
    }
    return state.outputHex
  }
}
