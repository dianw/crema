<template>
  <div>
    <h3 class="text-2xl font-bold mb-4">Random Generator</h3>
    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Byte Count: <span class="font-bold">{{ byteCount }}</span>
        </label>
        <input
          type="range"
          min="1"
          max="256"
          :value="byteCount"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          @input="setByteCount(Number(($event.target as HTMLInputElement).value))"
        >
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>1</span>
          <span>256</span>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
        <div class="flex space-x-4">
          <label class="inline-flex items-center">
            <input
              type="radio"
              :checked="format === 'hex'"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              @change="setFormat('hex')"
            >
            <span class="ml-2 text-sm text-gray-700">Hex</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="radio"
              :checked="format === 'decimal'"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              @change="setFormat('decimal')"
            >
            <span class="ml-2 text-sm text-gray-700">Decimal</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="radio"
              :checked="format === 'binary'"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              @change="setFormat('binary')"
            >
            <span class="ml-2 text-sm text-gray-700">Binary</span>
          </label>
        </div>
      </div>

      <div class="mb-4">
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
          @click="handleGenerate"
        >
          Generate
        </button>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Output</label>
        <div class="relative">
          <textarea
            :value="output"
            readonly
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 font-mono"
            :rows="outputRows"
            placeholder="Click Generate to create random output"
          />
          <button
            v-if="output"
            class="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
            @click="copyOutput"
          >
            <i class="fa fa-copy" /> Copy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const randomStore = useRandomGeneratorStore()

const byteCount = computed(() => randomStore.byteCount)
const format = computed(() => randomStore.format)
const output = computed(() => randomStore.output)

const outputRows = computed(() => Math.max(3, Math.min(10, Math.ceil((output.value?.length || 1) / 40))))

const setByteCount = (n: number) => { randomStore.setByteCount(n) }
const setFormat = (f: 'hex' | 'decimal' | 'binary') => { randomStore.setFormat(f) }

const handleGenerate = () => {
  randomStore.generate()
}

const copyOutput = async () => {
  if (output.value) {
    try {
      await navigator.clipboard.writeText(output.value)
    } catch {
      // fallback
    }
  }
}
</script>
