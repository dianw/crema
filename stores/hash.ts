import { hmac, md, util } from 'node-forge'
import type { HashResult } from '~/types'

interface HashInputData {
  input: string
  isText: boolean
}

interface CalculateParams {
  alg: string
  input: string | File
  isText: boolean,
  isHmac: boolean
  hmacKey: string
}

export const useHashStore = defineStore('hash', () => {
  const algs = ref<string[]>(Object.keys(md.algorithms))
  const alg = ref<string>('sha256')
  const input = ref<string>('')
  const isInputText = ref<boolean>(true)
  const outputHex = ref<string>('')
  const outputMd = ref<unknown>(null)

  const setAlg = (algorithm: string) => {
    alg.value = algorithm
  }

  const setInput = (inputData: HashInputData) => {
    input.value = inputData.input
    isInputText.value = inputData.isText
  }

  const setOutput = (message: util.ByteStringBuffer) => {
    outputMd.value = message
    outputHex.value = input.value === '' ? '' : message.toHex()
  }

  const calculate = async ({ alg: algorithm, input: inputValue, isText, isHmac, hmacKey }: CalculateParams) => {
    const algoObj = (md as unknown as Record<string, { create(): md.MessageDigest }>)[algorithm]
    if (!algoObj) {
      throw new Error(`Algorithm "${algorithm}" is not supported.`)
    }
    const message = isHmac ? hmac.create() : algoObj.create() as md.MessageDigest | hmac.HMAC
    if (isHmac) {
      if (!hmacKey) {
        throw new Error('HMAC key must be provided for HMAC operations.')
      }
      (message as hmac.HMAC).start(algoObj.create(), hmacKey)
    }

    if (isText) {
      (message as { update(data: string): void }).update(inputValue as string)
      setInput({ isText: true, input: inputValue as string })
    } else {
      // Handle file input
      if (inputValue instanceof File) {
        const arrayBuffer = await inputValue.arrayBuffer()
        const bytes = new Uint8Array(arrayBuffer)
        const binaryString = Array.from(bytes, byte => String.fromCharCode(byte)).join('')
        message.update(binaryString, 'raw')
        setInput({ isText: false, input: inputValue.name })
      } else {
        message.update(inputValue as string, 'raw')
        setInput({ isText: false, input: inputValue as string })
      }
    }

    setAlg(algorithm)
    setOutput(message.digest())
  }

  const hashResult = computed<HashResult | null>(() => {
    if (!outputHex.value) return null

    return {
      algorithm: alg.value,
      input: input.value,
      isText: isInputText.value,
      output: outputHex.value,
      digest: outputMd.value
    }
  })

  return {
    algs: readonly(algs),
    alg: readonly(alg),
    input: readonly(input),
    isInputText: readonly(isInputText),
    outputHex: readonly(outputHex),
    outputMd: readonly(outputMd),
    hashResult: readonly(hashResult),
    setAlg,
    setInput,
    setOutput,
    calculate
  }
})
