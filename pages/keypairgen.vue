<template>
  <div>
    <h3 class="text-2xl font-bold mb-4">Generate Cryptographic Key-Pair</h3>
    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Algorithm</label>
            <select
              :value="selectedAlgorithm"
              :disabled="generating"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              @input="handleAlgorithmChange"
            >
              <option v-for="alg in algorithms" :key="alg" :value="alg">{{ alg }}</option>
            </select>
          </div>
          <div v-if="selectedAlgorithm === 'RSA-PSS'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Key Size</label>
            <select
              :value="selectedKeySize"
              :disabled="generating"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              @input="handleKeySizeChange"
            >
              <option v-for="size in keySizes" :key="size" :value="size">{{ size }}</option>
            </select>
          </div>
          <div v-else-if="selectedAlgorithm === 'ECDSA'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Curve</label>
            <select
              :value="selectedCurve"
              :disabled="generating"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              @input="handleCurveChange"
            >
              <option v-for="curve in curves" :key="curve.value" :value="curve.value">{{ curve.name }}</option>
            </select>
          </div>
          <div class="mb-4">
            <button
              :disabled="generating"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
              @click="generate"
            >
              {{ generating ? 'Generating...' : 'Generate Key Pair' }}
            </button>
          </div>
          <webcrypto-key-pair-tab :key-pair="keyPair" :algorithm="selectedAlgorithm" @save="saveKeyPair"/>
        </div>
        <div>
          <div class="bg-white border border-gray-200 rounded-lg">
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 class="text-lg font-semibold text-gray-900">Saved Key-Pairs</h4>
            </div>
            <div class="p-4">
              <div class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
                <em>Work-in-progress</em>
              </div>
              <div class="space-y-3">
                <div v-for="kp in keyPairs" :key="kp.id" class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h6 class="text-sm font-medium text-gray-900">{{ kp.data.name }}</h6>
                    <p class="text-xs text-gray-500">{{ kp.data.algorithm }} • {{ formatDate(kp.data.createdDate) }}</p>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      @click="downloadKeyPair(kp)"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      title="Download Private Key"
                    >
                      <i class="fa fa-download"/>
                    </button>
                    <button
                      class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      @click="keypairgenDelete(kp.id)"
                    >
                      <i class="fa fa-trash"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WebcryptoKeyPairTab from '~/components/WebcryptoKeyPairTab.vue'
import { useKeypairgenStore } from '~/stores/keypairgen'

const keypairgenStore = useKeypairgenStore()

const generating = ref<boolean>(false)

const selectedAlgorithm = computed(() => keypairgenStore.selectedAlgorithm)
const algorithms = computed(() => keypairgenStore.algorithms)
const selectedKeySize = computed(() => keypairgenStore.selectedKeySize)
const keySizes = computed(() => keypairgenStore.keySizes)
const selectedCurve = computed(() => keypairgenStore.selectedCurve)
const curves = computed(() => keypairgenStore.curves)
const keyPair = computed(() => keypairgenStore.keyPair)
const keyPairs = computed(() => keypairgenStore.keyPairs)

const handleAlgorithmChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement
  keypairgenStore.setSelectedAlgorithm(target.value)
}

const handleKeySizeChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement
  keypairgenStore.setSelectedKeySize(Number(target.value))
}

const handleCurveChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement
  keypairgenStore.setSelectedCurve(target.value)
}

const generate = async (): Promise<void> => {
  generating.value = true
  try {
    if (selectedAlgorithm.value === 'RSA-PSS') {
      await keypairgenStore.generate(selectedAlgorithm.value, selectedKeySize.value)
    } else if (selectedAlgorithm.value === 'ECDSA') {
      // Map curve to key size for consistency
      const curveKeySize = selectedCurve.value === 'P-384' ? 384 : selectedCurve.value === 'P-521' ? 521 : 256
      await keypairgenStore.generate(selectedAlgorithm.value, curveKeySize)
    } else {
      await keypairgenStore.generate(selectedAlgorithm.value)
    }
  } finally {
    generating.value = false
  }
}

const saveKeyPair = (name: string, password: string, privateKey: string, publicKey: string): void => {
  keypairgenStore.save({ name, password, privateKey, publicKey })
}

const keypairgenDelete = (id: string): void => {
  keypairgenStore.delete(id)
}

const downloadKeyPair = (kp: any): void => {
  if (kp.data.privateKeyData) {
    const privateKeyPem = atob(kp.data.privateKeyData)
    const blob = new Blob([privateKeyPem], { type: 'application/x-pem-file' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${kp.data.name}_private.pem`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return ''
  }
}

onMounted(() => {
  keypairgenStore.fetch()
})
</script>
