<template>
  <div>
    <h3 class="text-2xl font-bold mb-4">Hash Calculator</h3>
    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="mb-4">
        <label for="algorithm" class="block text-sm font-medium text-gray-700 mb-2">Algorithm</label>
        <select
          id="algorithm"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          :value="alg"
          @change="(e) => { const target = e.target as HTMLSelectElement; setHashAlg(target.value); calculateHash({ input, alg: target.value, isText: true }) }"
        >
          <option v-for="option in algs" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>

      <div class="flex border-b border-gray-200 mb-4">
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === 'text' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="activeTab = 'text'"
        >
          Text Input
        </button>
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === 'file' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="activeTab = 'file'"
        >
          File Input
        </button>
      </div>

      <div class="mb-4">
        <div v-if="activeTab === 'text'">
          <textarea
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            :value="input"
            placeholder="Insert text here"
            rows="5"
            @input="(e) => { const target = e.target as HTMLTextAreaElement; calculateHash({ input: target.value, alg, isText: true }) }"
          />
        </div>
        <div v-if="activeTab === 'file'">
          <input
            type="file"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            @change="(e) => { const target = e.target as HTMLInputElement; if (target.files && target.files[0]) calculateHash({ input: target.files[0], alg, isText: false }) }"
          >
        </div>
      </div>

      <div>
        <label for="output" class="block text-sm font-medium text-gray-700 mb-2">Computed Hash</label>
        <textarea
          id="output"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 font-mono"
          :value="outputHex"
          placeholder="Hash Output"
          rows="5"
          readonly
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Algorithm {
  text: string
  value: string
}

interface HashParams {
  input: string | File
  alg: string
  isText: boolean
}

const hashStore = useHashStore()

const activeTab = ref<'text' | 'file'>('text')

const algs = computed((): Algorithm[] => {
  return hashStore.algs.map(alg => ({
    text: alg.toUpperCase(),
    value: alg
  }))
})
const alg = computed(() => hashStore.alg)
const input = computed(() => hashStore.input)
const outputHex = computed(() => hashStore.outputHex)

const setHashAlg = (algorithm: string): void => {
  hashStore.setAlg(algorithm)
}

const calculateHash = async (params: HashParams): Promise<void> => {
  await hashStore.calculate(params)
}
</script>
