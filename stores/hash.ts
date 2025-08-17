
import type { HashResult, HashInputData, CalculateParams  } from '~/types'

export const useHashStore = defineStore('hash', () => {
  const algs = ref<string[]>(['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'])
  const alg = ref<string>('SHA-256')
  const input = ref<string>('')
  const isInputText = ref<boolean>(true)
  const outputHex = ref<string>('')
  const outputBase64 = ref<string>('')
  const outputBuffer = ref<ArrayBuffer | null>(null)

  const setAlg = (algorithm: string) => {
    alg.value = algorithm
  }

  const setInput = (inputData: HashInputData) => {
    input.value = inputData.input
    isInputText.value = inputData.isText
  }

  const setOutput = (buffer: ArrayBuffer) => {
    outputBuffer.value = buffer
    outputHex.value = input.value === '' ? '' : Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    outputBase64.value = input.value === '' ? '' : btoa(String.fromCharCode(...new Uint8Array(buffer)))
  }

  const stringToArrayBuffer = (str: string): ArrayBuffer => {
    const encoder = new TextEncoder()
    return encoder.encode(str).buffer
  }

  const calculate = async ({ alg: algorithm, input: inputValue, isText, isHmac, hmacKey }: CalculateParams) => {
    try {
      let data: ArrayBuffer

      if (isText) {
        data = stringToArrayBuffer(inputValue as string)
        setInput({ isText: true, input: inputValue as string })
      } else {
        // Handle file input
        if (inputValue instanceof File) {
          data = await inputValue.arrayBuffer()
          setInput({ isText: false, input: inputValue.name })
        } else {
          // Handle binary string input
          const encoder = new TextEncoder()
          data = encoder.encode(inputValue as string).buffer
          setInput({ isText: false, input: inputValue as string })
        }
      }

      let hashBuffer: ArrayBuffer

      if (isHmac) {
        if (!hmacKey) {
          throw new Error('HMAC key must be provided for HMAC operations.')
        }
        // Import the HMAC key
        const keyData = stringToArrayBuffer(hmacKey)
        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'HMAC', hash: algorithm },
          false,
          ['sign']
        )
        // Sign the data using HMAC
        hashBuffer = await crypto.subtle.sign('HMAC', cryptoKey, data)
      } else {
        // Regular hash
        hashBuffer = await crypto.subtle.digest(algorithm, data)
      }

      setAlg(algorithm)
      setOutput(hashBuffer)
    } catch (error) {
      console.error('Hash calculation error:', error)
      throw new Error(`Failed to calculate ${algorithm} hash: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const hashResult = computed<HashResult | null>(() => {
    if (!outputHex.value) return null

    return {
      algorithm: alg.value,
      input: input.value,
      isText: isInputText.value,
      outputHex: outputHex.value,
      outputBase64: outputBase64.value,
      digest: outputBuffer.value
    }
  })

  return {
    algs: readonly(algs),
    alg: readonly(alg),
    input: readonly(input),
    isInputText: readonly(isInputText),
    outputBuffer: readonly(outputBuffer),
    hashResult: readonly(hashResult),
    setAlg,
    setInput,
    setOutput,
    calculate
  }
})
