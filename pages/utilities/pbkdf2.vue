<template>
  <div>
    <h3 class="text-2xl font-bold mb-4">PBKDF2 Key Derivation</h3>
    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input
          v-model="passwordInput"
          type="password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter password"
        >
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Salt</label>
        <div class="flex space-x-2">
          <input
            :value="salt"
            readonly
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 font-mono text-sm"
            placeholder="Salt will be auto-generated"
          >
          <button
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md transition-colors text-sm"
            @click="handleGenerateSalt"
          >
            Generate
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Iterations</label>
          <input
            :value="iterations"
            type="number"
            min="1000"
            max="10000000"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            @input="setIterations(Number(($event.target as HTMLInputElement).value))"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Key Length</label>
          <select
            :value="keyLength"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            @change="setKeyLength(Number(($event.target as HTMLSelectElement).value))"
          >
            <option value="16">16 bytes (128-bit)</option>
            <option value="24">24 bytes (192-bit)</option>
            <option value="32">32 bytes (256-bit)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Algorithm</label>
          <select
            :value="algorithm"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            @change="setAlgorithm(($event.target as HTMLSelectElement).value)"
          >
            <option value="sha256">SHA-256</option>
            <option value="sha512">SHA-512</option>
          </select>
        </div>
      </div>

      <div class="mb-4">
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
          :disabled="!passwordInput || !salt"
          @click="handleDerive"
        >
          Derive Key
        </button>
      </div>

      <div v-if="errorMsg" class="mb-4 text-red-600 text-sm">
        {{ errorMsg }}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Derived Key (hex)</label>
        <textarea
          :value="output"
          readonly
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 font-mono"
          placeholder="Derived key output"
          rows="5"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const pbkdf2Store = usePBKDF2Store()

const passwordInput = ref('')
const salt = computed(() => pbkdf2Store.salt)
const iterations = computed(() => pbkdf2Store.iterations)
const keyLength = computed(() => pbkdf2Store.keyLength)
const algorithm = computed(() => pbkdf2Store.algorithm)
const output = computed(() => pbkdf2Store.output)
const errorMsg = computed(() => pbkdf2Store.errorMsg)

const setIterations = (n: number) => { pbkdf2Store.setIterations(n) }
const setKeyLength = (n: number) => { pbkdf2Store.setKeyLength(n) }
const setAlgorithm = (a: string) => { pbkdf2Store.setAlgorithm(a) }

const handleGenerateSalt = () => {
  pbkdf2Store.generateSalt()
}

const handleDerive = () => {
  pbkdf2Store.setPassword(passwordInput.value)
  pbkdf2Store.derive()
}
</script>
