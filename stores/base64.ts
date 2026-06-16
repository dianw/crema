import { defineStore } from 'pinia'
import { util } from 'node-forge'
import type { Base64Params, Base64Result } from '~/types'

export const useBase64Store = defineStore('base64', () => {
  const input = ref('')
  const output = ref('')
  const lastOperation = ref<'encode' | 'decode'>('encode')
  const errorMsg = ref('')

  const process = async (params: Base64Params): Promise<Base64Result> => {
    errorMsg.value = ''
    try {
      if (params.operation === 'encode') {
        if (params.isText) {
          output.value = util.encode64(params.input as string)
        } else {
          const file = params.input as File
          const buffer = await file.arrayBuffer()
          const bytes = new Uint8Array(buffer)
          const binary = Array.from(bytes, b => String.fromCharCode(b)).join('')
          output.value = util.encode64(binary)
        }
      } else {
        output.value = util.decode64(params.input as string)
      }
      input.value = params.isText ? params.input as string : (params.input as File).name
      lastOperation.value = params.operation
    } catch (e: any) {
      errorMsg.value = e.message || 'Invalid Base64 input'
    }
    return { output: output.value }
  }

  const swap = () => {
    const temp = input.value
    input.value = output.value
    output.value = temp
  }

  return {
    input: readonly(input),
    output: readonly(output),
    lastOperation: readonly(lastOperation),
    errorMsg: readonly(errorMsg),
    process,
    swap
  }
})
