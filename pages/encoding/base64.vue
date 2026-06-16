<template>
  <div>
    <h3 class="text-2xl font-bold mb-4">Base64 Encoder / Decoder</h3>
    <div class="bg-white shadow-md rounded-lg p-6">
      <!-- Tab: Encode / Decode -->
      <div class="flex border-b border-gray-200 mb-4">
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === 'encode' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="switchTab('encode')"
        >
          Encode
        </button>
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === 'decode' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="switchTab('decode')"
        >
          Decode
        </button>
      </div>

      <!-- Input tabs: Text or File -->
      <div class="flex border-b border-gray-200 mb-4">
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="inputTab === 'text' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="inputTab = 'text'"
        >
          Text Input
        </button>
        <button
          v-if="activeTab === 'encode'"
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="inputTab === 'file' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="inputTab = 'file'"
        >
          File Input
        </button>
      </div>

      <div class="mb-4">
        <div v-if="inputTab === 'text'">
          <textarea
            v-model="inputData"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono"
            :placeholder="activeTab === 'encode' ? 'Enter text to encode' : 'Paste Base64 to decode'"
            rows="5"
          />
        </div>
        <div v-if="inputTab === 'file'">
          <input
            type="file"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            @change="handleFileInput"
          >
        </div>
      </div>

      <!-- Process Button -->
      <div class="mb-4 flex space-x-3">
        <button
          class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
          :disabled="!canProcess"
          @click="handleProcess"
        >
          {{ activeTab === 'encode' ? 'Encode' : 'Decode' }}
        </button>
        <button
          v-if="outputData"
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg transition-colors"
          title="Swap input and output"
          @click="handleSwap"
        >
          <i class="fa fa-arrows-left-right" />
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
const base64Store = useBase64Store()

const activeTab = ref<'encode' | 'decode'>('encode')
const inputTab = ref<'text' | 'file'>('text')
const inputData = ref('')
const selectedFile = ref<File | null>(null)

const outputData = computed(() => base64Store.output)
const errorMsg = computed(() => base64Store.errorMsg)
const canProcess = computed(() => inputTab.value === 'text' ? inputData.value : selectedFile.value !== null)

const switchTab = (tab: 'encode' | 'decode') => {
  activeTab.value = tab
  inputData.value = ''
  selectedFile.value = null
  inputTab.value = 'text'
}

const handleFileInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

const handleProcess = async () => {
  if (inputTab.value === 'file' && selectedFile.value) {
    await base64Store.process({ input: selectedFile.value, operation: activeTab.value, isText: false })
  } else {
    await base64Store.process({ input: inputData.value, operation: activeTab.value, isText: true })
  }
}

const handleSwap = () => {
  inputData.value = outputData.value
  base64Store.swap()
}
</script>
