import Vue from 'vue';
import Vuex from 'vuex';
import forge from 'node-forge';

Vue.use(Vuex);

const state = {
  hashInputText: '',
  hashOutput: {
    md: null,
    hex: null
  }
}

const mutations = {
  setHashInputText(state, inputText) {
    state.hashInputText = inputText;
  },
  setHashOutputHexText(state, md) {
    state.hashOutput.md = md;
    state.hashOutput.hex = md.toHex();
  }
}

const actions = {
  hashText({ commit }, {alg, text}) {
    const md = forge.md[alg].create();
    md.update(text);
    const digest = md.digest();
    commit('setHashInputText', text);
    commit('setHashOutputHexText', digest);
    return digest;
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

export default store
