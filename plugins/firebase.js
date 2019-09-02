import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const config = {
  apiKey: 'AIzaSyBcFESXRfDqbzueVN-IIMOeKBlahr-nkpg',
  authDomain: 'tlsfree-crema.firebaseapp.com',
  databaseURL: 'https://tlsfree-crema.firebaseio.com',
  projectId: 'tlsfree-crema',
  storageBucket: 'gs://tlsfree-crema.appspot.com',
  messagingSenderId: '557427128749'
}

if (firebase.apps.length === 0) {
  firebase.initializeApp(config)
}

export default (context, inject) => {
  inject('firebase', firebase)
  inject('db', firebase.firestore())
  inject('storage', firebase.storage())
  inject('serverTimestamp', () => firebase.firestore.FieldValue.serverTimestamp())
}
