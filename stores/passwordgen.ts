import { defineStore } from 'pinia'
import type { PasswordOptions, PasswordResult } from '~/types'

export const usePasswordGeneratorStore = defineStore('passwordgen', () => {
  const options = ref<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    excludeAmbiguous: false
  })
  const result = ref<PasswordResult | null>(null)

  const { generateRandomBytes } = useCrypto()

  const generate = () => {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
    const lower = 'abcdefghjkmnpqrstuvwxyz'
    const nums = '23456789'
    const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?'

    const upperFull = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowerFull = 'abcdefghijklmnopqrstuvwxyz'
    const numsFull = '0123456789'

    let charset = ''
    if (options.value.uppercase) charset += options.value.excludeAmbiguous ? upper : upperFull
    if (options.value.lowercase) charset += options.value.excludeAmbiguous ? lower : lowerFull
    if (options.value.numbers) charset += options.value.excludeAmbiguous ? nums : numsFull
    if (options.value.symbols) charset += syms

    if (!charset) {
      result.value = null
      return
    }

    const bytes = generateRandomBytes(options.value.length)
    let password = ''
    for (let i = 0; i < options.value.length; i++) {
      const byteVal = bytes[i]
      if (byteVal !== undefined) {
        password += charset[byteVal % charset.length]
      }
    }

    const entropy = Math.log2(charset.length) * options.value.length
    result.value = { password, entropy: Math.round(entropy) }
  }

  const setOptions = (opts: Partial<PasswordOptions>) => {
    Object.assign(options.value, opts)
  }

  return {
    options: readonly(options),
    result: readonly(result),
    generate,
    setOptions
  }
})
