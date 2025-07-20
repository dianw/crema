import { defineStore } from 'pinia'
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  const { $auth } = useNuxtApp()

  const setCurrentUser = (user) => {
    // deep clone user
    currentUser.value = user ? JSON.parse(JSON.stringify(user)) : null
  }

  const login = async (authProvider = 'Google') => {
    const user = await isLoggedIn()
    if (user) {
      return user
    }

    let provider
    if (authProvider === 'Google') {
      provider = new GoogleAuthProvider()
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
