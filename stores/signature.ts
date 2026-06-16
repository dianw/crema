import { defineStore } from 'pinia'
import { pki, md, util } from 'node-forge'
import type { SignatureParams, SignatureResult } from '~/types'

export const useSignatureStore = defineStore('signature', () => {
  const keyPem = ref('')
  const inputText = ref('')
  const output = ref('')
  const algorithm = ref('sha256')
  const lastOperation = ref<'sign' | 'verify'>('sign')
  const valid = ref<boolean | null>(null)
  const errorMsg = ref('')

  const setAlgorithm = (alg: string) => { algorithm.value = alg }

  const process = async (params: SignatureParams): Promise<SignatureResult> => {
    errorMsg.value = ''
    valid.value = null
    output.value = ''
    keyPem.value = params.keyPem
    try {
      const mdObj = (md as any)[params.algorithm].create()

      // Prepare message bytes
      let messageBytes: string
      if (params.isText) {
        messageBytes = params.input as string
      } else if (params.input instanceof File) {
        const buf = await params.input.arrayBuffer()
        messageBytes = Array.from(new Uint8Array(buf), b => String.fromCharCode(b)).join('')
      } else {
        messageBytes = params.input as string
      }

      mdObj.update(messageBytes, 'raw')

      if (params.operation === 'sign') {
        const privKey = pki.privateKeyFromPem(params.keyPem)
        const signature = privKey.sign(mdObj)
        output.value = util.bytesToHex(signature)
        lastOperation.value = 'sign'
        inputText.value = params.isText ? params.input as string : (params.input as File).name
        return { signature: output.value, algorithm: params.algorithm }
      } else {
        const pubKey = pki.publicKeyFromPem(params.keyPem)
        if (!params.signatureHex) throw new Error('Signature is required for verification')
        const sigBytes = util.hexToBytes(params.signatureHex)
        valid.value = pubKey.verify(mdObj.digest().getBytes(), sigBytes)
        lastOperation.value = 'verify'
        inputText.value = params.isText ? params.input as string : (params.input as File).name
        return { valid: valid.value, algorithm: params.algorithm }
      }
    } catch (e: any) {
      errorMsg.value = e.message || 'Signature operation failed'
      return { algorithm: params.algorithm }
    }
  }

  return {
    keyPem: readonly(keyPem),
    inputText: readonly(inputText),
    output: readonly(output),
    algorithm: readonly(algorithm),
    lastOperation: readonly(lastOperation),
    valid: readonly(valid),
    errorMsg: readonly(errorMsg),
    setAlgorithm,
    process
  }
})
