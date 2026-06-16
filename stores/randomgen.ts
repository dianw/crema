import { defineStore } from 'pinia'

export const useRandomGeneratorStore = defineStore('randomgen', () => {
  const byteCount = ref(16)
  const format = ref<'hex' | 'decimal' | 'binary'>('hex')
  const output = ref('')

  const { generateRandomBytes } = useCrypto()

  const setByteCount = (n: number) => { byteCount.value = Math.max(1, Math.min(256, n)) }
  const setFormat = (f: 'hex' | 'decimal' | 'binary') => { format.value = f }

  const generate = () => {
    const bytes = generateRandomBytes(byteCount.value)
    if (format.value === 'hex') {
      output.value = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
    } else if (format.value === 'decimal') {
      output.value = Array.from(bytes).join(', ')
    } else {
      output.value = Array.from(bytes, b => b.toString(2).padStart(8, '0')).join(' ')
    }
  }

  return {
    byteCount: readonly(byteCount),
    format: readonly(format),
    output: readonly(output),
    setByteCount,
    setFormat,
    generate
  }
})
