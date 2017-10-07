import firebase from 'firebase'
import 'firebase/firestore'

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

export default (context, inject) => {
  inject('firebase', firebase)
  inject('db', firebase.firestore())
}
