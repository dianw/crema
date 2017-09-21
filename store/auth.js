import firebase from 'firebase'

export const state = () => ({
  currentUser: null
})

export const mutations = {
  setCurrentUser (state, user) {
    // deep clone user
    state.currentUser = JSON.parse(JSON.stringify(user))
  }
}

export const actions = {
  login ({ commit, dispatch }, authProvider) {
    return dispatch('isLoggedIn').then(user => {
      if (user) {
        return user
      }
      const provider = new firebase.auth[authProvider + 'AuthProvider']()
      return firebase.auth().signInWithPopup(provider).then(result => {
        commit('setCurrentUser', result.user)
        return result.user
      })
    })
  },
  isLoggedIn ({ commit, state }) {
    if (state.currentUser) {
      return state.currentUser
    }
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(currentUser => {
        if (currentUser) {
          commit('setCurrentUser', currentUser)
        }
        resolve(currentUser)
      })
    })
  }
}
