<template>
  <div>
    <h3 class="text-2xl font-bold mb-4">Password Generator</h3>
    <div class="bg-white shadow-md rounded-lg p-6">
      <!-- Length -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Length: <span class="font-bold">{{ options.length }}</span>
        </label>
        <input
          type="range"
          min="8"
          max="128"
          :value="options.length"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          @input="updateOption('length', Number(($event.target as HTMLInputElement).value))"
        >
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>8</span>
          <span>128</span>
        </div>
      </div>

      <!-- Character sets -->
      <div class="space-y-3 mb-6">
        <label class="flex items-center">
          <input
            type="checkbox"
            :checked="options.uppercase"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            @change="updateOption('uppercase', ($event.target as HTMLInputElement).checked)"
          >
          <span class="ml-2 text-sm text-gray-700">Uppercase (A-Z)</span>
        </label>
        <label class="flex items-center">
          <input
            type="checkbox"
            :checked="options.lowercase"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            @change="updateOption('lowercase', ($event.target as HTMLInputElement).checked)"
          >
          <span class="ml-2 text-sm text-gray-700">Lowercase (a-z)</span>
        </label>
        <label class="flex items-center">
          <input
            type="checkbox"
            :checked="options.numbers"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            @change="updateOption('numbers', ($event.target as HTMLInputElement).checked)"
          >
          <span class="ml-2 text-sm text-gray-700">Numbers (0-9)</span>
        </label>
        <label class="flex items-center">
          <input
            type="checkbox"
            :checked="options.symbols"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            @change="updateOption('symbols', ($event.target as HTMLInputElement).checked)"
          >
          <span class="ml-2 text-sm text-gray-700">Symbols (!@#$%...)</span>
        </label>
        <label class="flex items-center">
          <input
            type="checkbox"
            :checked="options.excludeAmbiguous"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            @change="updateOption('excludeAmbiguous', ($event.target as HTMLInputElement).checked)"
          >
          <span class="ml-2 text-sm text-gray-700">Exclude ambiguous (0, O, I, l, 1)</span>
        </label>
      </div>

      <!-- Generate Button -->
      <div class="mb-4">
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
          :disabled="!hasCharSet"
          @click="handleGenerate"
        >
          Generate Password
        </button>
        <p v-if="!hasCharSet" class="text-xs text-red-500 mt-1">Select at least one character set.</p>
      </div>

      <!-- Result -->
      <div v-if="result">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Generated Password</label>
          <div class="relative">
            <textarea
              :value="result.password"
              readonly
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 font-mono"
              rows="3"
            />
            <button
              class="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
              @click="copyPassword"
            >
              <i class="fa fa-copy" /> Copy
            </button>
          </div>
        </div>

        <!-- Strength indicator -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Strength</label>
          <div class="flex items-center space-x-3">
            <div class="flex-1 bg-gray-200 rounded-full h-3">
              <div
                class="h-3 rounded-full transition-all"
                :class="strengthClass"
                :style="{ width: strengthPercent + '%' }"
              />
            </div>
            <span class="text-sm font-medium whitespace-nowrap" :class="strengthClass">
              {{ strengthLabel }}
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-1">Entropy: {{ result.entropy }} bits</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePasswordGeneratorStore } from '~/stores/passwordgen'
import type { PasswordOptions } from '~/types'

const pwStore = usePasswordGeneratorStore()

const options = computed(() => pwStore.options)
const result = computed(() => pwStore.result)
const hasCharSet = computed(() => options.value.uppercase || options.value.lowercase || options.value.numbers || options.value.symbols)

const updateOption = (key: keyof PasswordOptions, value: any) => {
  pwStore.setOptions({ [key]: value })
}

const handleGenerate = () => {
  pwStore.generate()
}

const strengthLabel = computed(() => {
  if (!result.value) return ''
  const e = result.value.entropy
  if (e < 40) return 'Weak'
  if (e < 60) return 'Fair'
  if (e < 80) return 'Strong'
  return 'Very Strong'
})

const strengthClass = computed(() => {
  if (!result.value) return ''
  const e = result.value.entropy
  if (e < 40) return 'text-red-600'
  if (e < 60) return 'text-orange-500'
  if (e < 80) return 'text-yellow-500'
  return 'text-green-600'
})

const strengthPercent = computed(() => {
  if (!result.value) return 0
  return Math.min(100, (result.value.entropy / 128) * 100)
})

const copyPassword = async () => {
  if (result.value?.password) {
    try {
      await navigator.clipboard.writeText(result.value.password)
    } catch {
      // Fallback
    }
  }
}
</script>
