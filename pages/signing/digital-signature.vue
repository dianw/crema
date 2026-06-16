<template>
  <div>
    <h3 class="text-2xl font-bold mb-4">Digital Signature</h3>
    <div class="bg-white shadow-md rounded-lg p-6">
      <!-- Tab: Sign / Verify -->
      <div class="flex border-b border-gray-200 mb-4">
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === 'sign' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="switchTab('sign')"
        >
          Sign
        </button>
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === 'verify' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="switchTab('verify')"
        >
          Verify
        </button>
      </div>

      <!-- Sign tab -->
      <template v-if="activeTab === 'sign'">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Private Key (PEM)</label>
          <textarea
            v-model="keyPemInput"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-xs"
            placeholder="Paste private key PEM"
            rows="6"
          />
          <p class="text-xs text-gray-500 mt-1">
            <NuxtLink :to="{ name: 'public-key-infrastructure-rsa-keygen' }" class="text-blue-600 hover:underline">
              Generate a key pair first →
            </NuxtLink>
          </p>
        </div>
      </template>

      <!-- Verify tab -->
      <template v-if="activeTab === 'verify'">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Public Key (PEM)</label>
          <textarea
            v-model="keyPemInput"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-xs"
            placeholder="Paste public key PEM"
            rows="6"
          />
        </div>
      </template>

      <!-- Algorithm -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Hash Algorithm</label>
        <select
          v-model="selectedAlg"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option v-for="alg in algorithms" :key="alg" :value="alg">{{ alg.toUpperCase() }}</option>
        </select>
      </div>

      <!-- Input / Text mode toggle -->
      <div class="flex border-b border-gray-200 mb-4">
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="inputTab === 'text' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="inputTab = 'text'"
        >
          Text Input
        </button>
        <button
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
            placeholder="Enter text"
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

      <!-- Verify: signature input -->
      <div v-if="activeTab === 'verify'" class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Signature (hex)</label>
        <textarea
          v-model="signatureInput"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono"
          placeholder="Paste signature hex"
          rows="3"
        />
      </div>

      <!-- Process Button -->
      <div class="mb-4">
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
          :disabled="!canProcess"
          @click="handleProcess"
        >
          {{ activeTab === 'sign' ? 'Sign' : 'Verify' }}
        </button>
      </div>

      <!-- Error -->
      <div v-if="errorMsg" class="mb-4 text-red-600 text-sm">
        {{ errorMsg }}
      </div>

      <!-- Verification result -->
      <div v-if="activeTab === 'verify' && valid !== null" class="mb-4">
        <div
          class="px-4 py-3 rounded font-bold"
          :class="valid ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'"
        >
          {{ valid ? '✅ Signature is VALID' : '❌ Signature is INVALID' }}
        </div>
      </div>

      <!-- Output -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ activeTab === 'sign' ? 'Signature (hex)' : 'Output' }}
        </label>
        <textarea
          :value="outputData"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 font-mono"
          :placeholder="activeTab === 'sign' ? 'Signature Output' : ''"
          rows="5"
          readonly
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const signatureStore = useSignatureStore()

const activeTab = ref<'sign' | 'verify'>('sign')
const inputTab = ref<'text' | 'file'>('text')
const keyPemInput = ref('')
const inputData = ref('')
const signatureInput = ref('')
const selectedFile = ref<File | null>(null)
const selectedAlg = ref('sha256')

const algorithms = ['sha256', 'sha384', 'sha512']

const outputData = computed(() => signatureStore.output)
const errorMsg = computed(() => signatureStore.errorMsg)
const valid = computed(() => signatureStore.valid)
const canProcess = computed(() => {
  if (!keyPemInput.value) return false
  if (inputTab.value === 'text' && !inputData.value) return false
  if (inputTab.value === 'file' && !selectedFile.value) return false
  if (activeTab.value === 'verify' && !signatureInput.value) return false
  return true
})

const switchTab = (tab: 'sign' | 'verify') => {
  activeTab.value = tab
  keyPemInput.value = ''
  inputData.value = ''
  signatureInput.value = ''
  selectedFile.value = null
}

const handleFileInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

const handleProcess = async () => {
  const input = inputTab.value === 'file' && selectedFile.value ? selectedFile.value : inputData.value
  const isText = inputTab.value === 'text'

  await signatureStore.process({
    keyPem: keyPemInput.value,
    input,
    isText,
    algorithm: selectedAlg.value,
    operation: activeTab.value,
    signatureHex: activeTab.value === 'verify' ? signatureInput.value : undefined
  })
}
</script>
