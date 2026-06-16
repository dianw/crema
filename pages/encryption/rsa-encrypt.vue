<template>
  <div>
    <h3 class="text-2xl font-bold mb-4">RSA Encrypt / Decrypt</h3>
    <div class="bg-white shadow-md rounded-lg p-6">
      <!-- Tab: Encrypt / Decrypt -->
      <div class="flex border-b border-gray-200 mb-4">
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === 'encrypt' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="switchTab('encrypt')"
        >
          Encrypt (Public Key)
        </button>
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === 'decrypt' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="switchTab('decrypt')"
        >
          Decrypt (Private Key)
        </button>
      </div>

      <div class="mb-4 text-sm text-gray-600">
        <NuxtLink :to="{ name: 'public-key-infrastructure-rsa-keygen' }" class="text-blue-600 hover:underline">
          Need a key pair? Generate one first →
        </NuxtLink>
      </div>

      <!-- Key PEM -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ activeTab === 'encrypt' ? 'Public Key (PEM)' : 'Private Key (PEM)' }}
        </label>
        <textarea
          v-model="keyPemInput"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-xs"
          placeholder="Paste PEM here"
          rows="6"
        />
      </div>

      <!-- Input -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ activeTab === 'encrypt' ? 'Plaintext' : 'Ciphertext (Base64)' }}
        </label>
        <textarea
          v-model="inputData"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono"
          :placeholder="activeTab === 'encrypt' ? 'Enter text to encrypt' : 'Paste Base64 ciphertext'"
          rows="5"
        />
      </div>

      <!-- Process Button -->
      <div class="mb-4">
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
          :disabled="!keyPemInput || !inputData"
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
const rsaEncryptStore = useRsaEncryptStore()

const activeTab = ref<'encrypt' | 'decrypt'>('encrypt')
const keyPemInput = ref('')
const inputData = ref('')

const outputData = computed(() => rsaEncryptStore.output)
const errorMsg = computed(() => rsaEncryptStore.errorMsg)

const switchTab = (tab: 'encrypt' | 'decrypt') => {
  activeTab.value = tab
  keyPemInput.value = ''
  inputData.value = ''
  rsaEncryptStore.setOutput('')
  rsaEncryptStore.setError('')
}

const handleProcess = async () => {
  await rsaEncryptStore.process({
    keyPem: keyPemInput.value,
    input: inputData.value,
    operation: activeTab.value
  })
}
</script>
