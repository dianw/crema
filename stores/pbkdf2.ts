import { defineStore } from 'pinia'
import { pkcs5, md, util } from 'node-forge'

export const usePBKDF2Store = defineStore('pbkdf2', () => {
  const password = ref('')
  const salt = ref('')
  const iterations = ref(100000)
  const keyLength = ref(32)
  const algorithm = ref('sha256')
  const output = ref('')
  const errorMsg = ref('')

  const { generateRandomHex } = useCrypto()

  const setPassword = (p: string) => { password.value = p }
  const setSalt = (s: string) => { salt.value = s }
  const setIterations = (i: number) => { iterations.value = i }
  const setKeyLength = (k: number) => { keyLength.value = k }
  const setAlgorithm = (a: string) => { algorithm.value = a }

  const generateSalt = () => {
    salt.value = generateRandomHex(32)
  }

  const derive = () => {
    errorMsg.value = ''
    try {
      if (!password.value) throw new Error('Password is required')
      if (!salt.value) throw new Error('Salt is required')
      const dk = pkcs5.pbkdf2(
        password.value,
        salt.value,
        iterations.value,
        keyLength.value,
        (md as any)[algorithm.value].create
      )
      output.value = util.bytesToHex(dk)
    } catch (e: any) {
      errorMsg.value = e.message || 'Derivation failed'
      output.value = ''
    }
  }

  return {
    password: readonly(password),
    salt: readonly(salt),
    iterations: readonly(iterations),
    keyLength: readonly(keyLength),
    algorithm: readonly(algorithm),
    output: readonly(output),
    errorMsg: readonly(errorMsg),
    setPassword,
    setSalt,
    setIterations,
    setKeyLength,
    setAlgorithm,
    generateSalt,
    derive
  }
})
