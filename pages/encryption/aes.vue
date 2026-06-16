<template>
  <div>
    <h3 class="text-2xl font-bold mb-4">AES Encrypt / Decrypt</h3>
    <div class="bg-white shadow-md rounded-lg p-6">
      <!-- Tab: Encrypt / Decrypt -->
      <div class="flex border-b border-gray-200 mb-4">
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === 'encrypt' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="switchTab('encrypt')"
        >
          Encrypt
        </button>
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === 'decrypt' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="switchTab('decrypt')"
        >
          Decrypt
        </button>
      </div>

      <!-- Mode & Key Size -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Mode</label>
          <select
            v-model="selectedMode"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option v-for="m in modes" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Key Size</label>
          <select
            v-model="selectedKeySize"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option v-for="s in keySizes" :key="s" :value="s">{{ s }} bits</option>
          </select>
        </div>
      </div>

      <!-- Password -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <div class="relative">
          <input
            v-model="passwordInput"
            :type="showPassword ? 'text' : 'password'"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter password"
          >
          <button
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'" />
          </button>
        </div>
      </div>

      <!-- IV (decrypt) -->
      <div v-if="activeTab === 'decrypt'" class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">IV (hex, from encryption output)</label>
        <input
          v-model="ivInput"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono"
          placeholder="Paste IV hex here"
        >
      </div>
      <div v-else-if="ivDisplay" class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">IV (hex — save this for decryption)</label>
        <input
          :value="ivDisplay"
          readonly
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 font-mono"
        >
      </div>

      <!-- Input -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Input</label>
        <textarea
          v-model="inputData"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter text to process"
          rows="5"
        />
      </div>

      <!-- Process Button -->
      <div class="mb-4">
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
          :disabled="!canProcess"
          @click="handleProcess"
        >
          {{ activeTab === 'encrypt' ? 'Encrypt' : 'Decrypt' }}
        </button>
      </div>

      <!-- Error -->
      <div v-if="errorMsg" class="mb-4 text-red-600 text-sm">
        {{ errorMsg }}
      </div>

      <!-- Output -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Output (hex)</label>
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
const aesStore = useAesStore()

const activeTab = ref<'encrypt' | 'decrypt'>('encrypt')
const showPassword = ref(false)
const selectedMode = ref<'CBC' | 'GCM' | 'CTR'>('CBC')
const selectedKeySize = ref<128 | 192 | 256>(256)
const passwordInput = ref('')
const ivInput = ref('')
const inputData = ref('')

const modes = ['CBC', 'GCM', 'CTR']
const keySizes = [128, 192, 256]

const outputData = computed(() => aesStore.output)
const ivDisplay = computed(() => aesStore.iv)
const errorMsg = computed(() => aesStore.errorMsg)
const canProcess = computed(() => passwordInput.value && inputData.value && (activeTab.value === 'decrypt' ? ivInput.value : true))

const switchTab = (tab: 'encrypt' | 'decrypt') => {
  activeTab.value = tab
  aesStore.setOutput('')
  aesStore.setIv('')
  aesStore.setError('')
}

const handleProcess = async () => {
  await aesStore.process({
    mode: selectedMode.value,
    keySize: selectedKeySize.value,
    password: passwordInput.value,
    input: inputData.value,
    isText: true,
    operation: activeTab.value,
    iv: activeTab.value === 'decrypt' ? ivInput.value : undefined
  })
}
</script>
