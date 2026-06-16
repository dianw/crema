import { defineStore } from 'pinia'
import { pki, util } from 'node-forge'
import type { RSAEncryptParams, RSAEncryptResult } from '~/types'

export const useRsaEncryptStore = defineStore('rsaencrypt', () => {
  const publicKeyPem = ref('')
  const privateKeyPem = ref('')
  const inputText = ref('')
  const output = ref('')
  const errorMsg = ref('')
  const lastOperation = ref<'encrypt' | 'decrypt'>('encrypt')

  const setPublicKeyPem = (pem: string) => { publicKeyPem.value = pem }
  const setPrivateKeyPem = (pem: string) => { privateKeyPem.value = pem }
  const setInputText = (text: string) => { inputText.value = text }
  const setOutput = (text: string) => { output.value = text }
  const setError = (msg: string) => { errorMsg.value = msg }

  const process = async (params: RSAEncryptParams): Promise<RSAEncryptResult> => {
    errorMsg.value = ''
    output.value = ''
    try {
      if (params.operation === 'encrypt') {
        const pubKey = pki.publicKeyFromPem(params.keyPem)
        const encrypted = pubKey.encrypt(params.input, 'RSA-OAEP')
        output.value = util.encode64(encrypted)
      } else {
        const privKey = pki.privateKeyFromPem(params.keyPem)
        const decrypted = privKey.decrypt(util.decode64(params.input), 'RSA-OAEP')
        output.value = decrypted
      }
      lastOperation.value = params.operation
      inputText.value = params.input
      if (params.operation === 'encrypt') {
        publicKeyPem.value = params.keyPem
      } else {
        privateKeyPem.value = params.keyPem
      }
    } catch (e: any) {
      errorMsg.value = e.message || 'Operation failed'
    }
    return { output: output.value }
  }

  return {
    publicKeyPem: readonly(publicKeyPem),
    privateKeyPem: readonly(privateKeyPem),
    inputText: readonly(inputText),
    output: readonly(output),
    errorMsg: readonly(errorMsg),
    lastOperation: readonly(lastOperation),
    setPublicKeyPem,
    setPrivateKeyPem,
    setInputText,
    setOutput,
    setError,
    process
  }
})
