import { defineStore } from 'pinia'
import { md } from 'node-forge'

export const useHashStore = defineStore('hash', () => {
  const alg = ref('sha256')
  const input = ref('')
  const isInputText = ref(true)
  const outputHex = ref('')
  const outputMd = ref(null)

  const setAlg = (algorithm) => {
    alg.value = algorithm
  }

  const setInput = (inputData) => {
    input.value = inputData.input
    isInputText.value = inputData.isText
  }

  const setOutput = (message) => {
    outputMd.value = message
    outputHex.value = input.value === '' ? '' : message.digest().toHex()
  }

  const calculate = async ({ alg: algorithm, input: inputValue, isText }) => {
    const message = md[algorithm].create()
    if (isText) {
      message.update(inputValue)
      setInput({ isText: true, input: inputValue })
    } else {
      // Handle file input
      if (inputValue instanceof File) {
        const arrayBuffer = await inputValue.arrayBuffer()
        const bytes = new Uint8Array(arrayBuffer)
        const binaryString = Array.from(bytes, byte => String.fromCharCode(byte)).join('')
        message.update(binaryString, 'raw')
        setInput({ isText: false, input: inputValue.name })
      } else {
        message.update(inputValue, 'raw')
        setInput({ isText: false, input: inputValue })
      }
    }

    setAlg(algorithm)
    setOutput(message)
  }

  return {
    alg: readonly(alg),
    input: readonly(input),
    isInputText: readonly(isInputText),
    outputHex: readonly(outputHex),
    outputMd: readonly(outputMd),
    setAlg,
    setInput,
    setOutput,
    calculate
  }
})
