import { defineStore } from 'pinia'

export const useHexConverterStore = defineStore('hexconv', () => {
  const input = ref('')
  const output = ref('')
  const lastOperation = ref<'toHex' | 'fromHex'>('toHex')
  const errorMsg = ref('')
  const format = ref<'plain' | 'spaced' | '0x'>('plain')

  const { stringToHex, hexToString } = useCrypto()

  const convert = (params: { input: string; operation: 'toHex' | 'fromHex' }) => {
    errorMsg.value = ''
    try {
      if (params.operation === 'toHex') {
        let hex = stringToHex(params.input)
        if (format.value === 'spaced') hex = hex.match(/.{1,2}/g)?.join(' ') || hex
        if (format.value === '0x') hex = '0x' + hex.match(/.{1,2}/g)?.join(', 0x') || hex
        output.value = hex
      } else {
        const clean = params.input.replace(/\s+/g, '').replace(/^0x|,0x/g, '').replace(/,/g, '')
        output.value = hexToString(clean)
      }
      input.value = params.input
      lastOperation.value = params.operation
    } catch (e: any) {
      errorMsg.value = 'Invalid hex input'
    }
  }

  const setFormat = (f: 'plain' | 'spaced' | '0x') => { format.value = f }

  return {
    input: readonly(input),
    output: readonly(output),
    lastOperation: readonly(lastOperation),
    errorMsg: readonly(errorMsg),
    format: readonly(format),
    convert,
    setFormat
  }
})
