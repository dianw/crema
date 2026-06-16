<template>
  <div>
    <h3 class="text-2xl font-bold mb-4">Hex Converter</h3>
    <div class="bg-white shadow-md rounded-lg p-6">
      <!-- Tab: Text→Hex / Hex→Text -->
      <div class="flex border-b border-gray-200 mb-4">
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === 'toHex' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="switchTab('toHex')"
        >
          Text → Hex
        </button>
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === 'fromHex' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="switchTab('fromHex')"
        >
          Hex → Text
        </button>
      </div>

      <!-- Format selector (only for toHex) -->
      <div v-if="activeTab === 'toHex'" class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
        <div class="flex space-x-4">
          <label class="inline-flex items-center">
            <input
              type="radio"
              :checked="format === 'plain'"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              @change="setFormat('plain')"
            >
            <span class="ml-2 text-sm text-gray-700">Plain</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="radio"
              :checked="format === 'spaced'"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              @change="setFormat('spaced')"
            >
            <span class="ml-2 text-sm text-gray-700">Spaced</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="radio"
              :checked="format === '0x'"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              @change="setFormat('0x')"
            >
            <span class="ml-2 text-sm text-gray-700">0x Prefixed</span>
          </label>
        </div>
      </div>

      <!-- Input -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ activeTab === 'toHex' ? 'Text' : 'Hex' }}
        </label>
        <textarea
          v-model="inputData"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono"
          :placeholder="activeTab === 'toHex' ? 'Enter text to convert to hex' : 'Enter hex to convert to text'"
          rows="5"
        />
      </div>

      <!-- Convert Button -->
      <div class="mb-4">
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
          :disabled="!inputData"
          @click="handleConvert"
        >
          {{ activeTab === 'toHex' ? 'Convert to Hex' : 'Convert to Text' }}
        </button>
      </div>

      <!-- Error -->
      <div v-if="errorMsg" class="mb-4 text-red-600 text-sm">
        {{ errorMsg }}
      </div>

      <!-- Output -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Output</label>
        <textarea
          :value="outputData"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 font-mono"
          placeholder="Output"
          rows="5"
          readonly
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const hexStore = useHexConverterStore()

const activeTab = ref<'toHex' | 'fromHex'>('toHex')
const inputData = ref('')

const outputData = computed(() => hexStore.output)
const errorMsg = computed(() => hexStore.errorMsg)
const format = computed(() => hexStore.format)

const setFormat = (f: 'plain' | 'spaced' | '0x') => {
  hexStore.setFormat(f)
}

const switchTab = (tab: 'toHex' | 'fromHex') => {
  activeTab.value = tab
  inputData.value = ''
}

const handleConvert = () => {
  hexStore.convert({ input: inputData.value, operation: activeTab.value })
}
</script>
