import Vue from 'vue'
import VueFire from 'vuefire'
import firebase from 'firebase'

Vue.use(VueFire)

const config = {
  apiKey: 'AIzaSyBcFESXRfDqbzueVN-IIMOeKBlahr-nkpg',
  authDomain: 'tlsfree-crema.firebaseapp.com',
  databaseURL: 'https://tlsfree-crema.firebaseio.com',
  projectId: 'tlsfree-crema',
  storageBucket: '',
  messagingSenderId: '557427128749'
}

if (firebase.apps.length === 0) {
  firebase.initializeApp(config)
}
