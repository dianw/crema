import { defineStore } from 'pinia'
import { cipher, md, util, random } from 'node-forge'
import type { AESParams, AESResult } from '~/types'

export const useAesStore = defineStore('aes', () => {
  const mode = ref<'CBC' | 'GCM' | 'CTR'>('CBC')
  const keySize = ref<128 | 192 | 256>(256)
  const password = ref('')
  const inputText = ref('')
  const output = ref('')
  const iv = ref('')
  const lastOperation = ref<'encrypt' | 'decrypt'>('encrypt')
  const errorMsg = ref('')

  const setMode = (m: 'CBC' | 'GCM' | 'CTR') => { mode.value = m }
  const setKeySize = (s: 128 | 192 | 256) => { keySize.value = s }
  const setPassword = (p: string) => { password.value = p }
  const setInput = (i: string) => { inputText.value = i }
  const setOutput = (o: string) => { output.value = o }
  const setIv = (i: string) => { iv.value = i }
  const setError = (e: string) => { errorMsg.value = e }

  const process = async (params: AESParams): Promise<AESResult> => {
    errorMsg.value = ''
    output.value = ''
    const { mode: opMode, keySize: ks, password: pw, input, isText, operation, iv: providedIv } = params

    // Derive key from password using SHA-256
    const keyHex = (md as any)['sha256'].create().update(pw).digest().toHex()
    const keySlice = keyHex.slice(0, ks / 4)

    let ivBytes: string
    if (operation === 'encrypt') {
      ivBytes = random.getBytesSync(16)
    } else {
      if (!providedIv) throw new Error('IV is required for decryption')
      ivBytes = util.hexToBytes(providedIv)
    }
    iv.value = util.bytesToHex(ivBytes)

    const cipherName = `AES-${opMode}` as any
    const forgeCipher = operation === 'encrypt'
      ? (cipher as any).createCipher(cipherName, util.hexToBytes(keySlice))
      : (cipher as any).createDecipher(cipherName, util.hexToBytes(keySlice))

    forgeCipher.start({ iv: ivBytes })

    let data: string
    if (isText) {
      data = input as string
      forgeCipher.update(util.createBuffer(data))
    } else {
      if (input instanceof File) {
        const arrayBuffer = await input.arrayBuffer()
        const bytes = new Uint8Array(arrayBuffer)
        data = Array.from(bytes, b => String.fromCharCode(b)).join('')
      } else {
        data = input as string
      }
      forgeCipher.update(util.createBuffer(data))
    }

    forgeCipher.finish()
    output.value = forgeCipher.output.toHex()
    lastOperation.value = operation

    if (isText) inputText.value = input as string

    return { output: output.value, iv: iv.value, mode: opMode, keySize: ks }
  }

  return {
    mode: readonly(mode),
    keySize: readonly(keySize),
    password: readonly(password),
    inputText: readonly(inputText),
    output: readonly(output),
    iv: readonly(iv),
    lastOperation: readonly(lastOperation),
    errorMsg: readonly(errorMsg),
    setMode,
    setKeySize,
    setPassword,
    setInput,
    setOutput,
    setIv,
    setError,
    process
  }
})
