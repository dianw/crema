import { md } from 'node-forge'
import type { HashResult } from '~/types'
import { HASH_ALGORITHMS } from '~/utils/constants'

interface HashInputData {
  input: string
  isText: boolean
}

interface CalculateParams {
  alg: string
  input: string | File
  isText: boolean
}

export const useHashStore = defineStore('hash', () => {
  const alg = ref<string>('sha256')
  const input = ref<string>('')
  const isInputText = ref<boolean>(true)
  const outputHex = ref<string>('')
  const outputMd = ref<any>(null)

  const setAlg = (algorithm: string) => {
    alg.value = algorithm
  }

  const setInput = (inputData: HashInputData) => {
    input.value = inputData.input
    isInputText.value = inputData.isText
  }

  const setOutput = (message: any) => {
    outputMd.value = message
    outputHex.value = input.value === '' ? '' : message.digest().toHex()
  }

  const calculate = async ({ alg: algorithm, input: inputValue, isText }: CalculateParams) => {
    const message = (md as any)[algorithm].create()
    if (isText) {
      message.update(inputValue as string)
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
    setOutput(message)
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
