import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, serverTimestamp  } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin(() => {
  const config = {
    apiKey: 'AIzaSyBcFESXRfDqbzueVN-IIMOeKBlahr-nkpg',
    authDomain: 'tlsfree-crema.firebaseapp.com',
    databaseURL: 'https://tlsfree-crema.firebaseio.com',
    projectId: 'tlsfree-crema',
    storageBucket: 'gs://tlsfree-crema.appspot.com',
    messagingSenderId: '557427128749'
  }

  let firebaseApp
  if (getApps().length === 0) {
    firebaseApp = initializeApp(config)
  } else {
    firebaseApp = getApps()[0]
  }

  const auth = getAuth(firebaseApp)
  const db = getFirestore(firebaseApp)
  const storage = getStorage(firebaseApp)

  return {
    provide: {
      firebase: firebaseApp,
      auth,
      db,
      storage,
      serverTimestamp
    }
  }
})
