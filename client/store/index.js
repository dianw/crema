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
  hashText({ commit, state }, { alg, text }) {
    const md = forge.md[alg].create();
    md.update(text);
    commit('setHashInputText', text);
    commit('setHashOutputHexText', md.digest());
    return state.hashOutput;
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

export default store
