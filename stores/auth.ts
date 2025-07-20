import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth'
import type { User } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const { $auth } = useNuxtApp()

  const setCurrentUser = (user: FirebaseUser | null) => {
    // Convert Firebase user to our User type
    currentUser.value = user ? {
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    } : null
  }

  const login = async (authProvider: string = 'Google') => {
    const user = await isLoggedIn()
    if (user) {
      return user
    }

    let provider: GoogleAuthProvider
    if (authProvider === 'Google') {
      provider = new GoogleAuthProvider()
    } else {
      throw new Error(`Unsupported auth provider: ${authProvider}`)
    }

    try {
      const result = await signInWithPopup($auth, provider)
      setCurrentUser(result.user)
      return result.user
    } catch (error) {
      throw error
    }
  }

  const isLoggedIn = () => {
    if (currentUser.value) {
      return Promise.resolve(currentUser.value)
    }

    return new Promise((resolve) => {
      onAuthStateChanged($auth, (user) => {
        setCurrentUser(user)
        resolve(user)
      })
    })
  }

  const logout = async () => {
    try {
      await signOut($auth)
      setCurrentUser(null)
    } catch (error) {
      throw error
    }
  }

  return {
    currentUser: readonly(currentUser),
    setCurrentUser,
    login,
    logout,
    isLoggedIn
  }
})
