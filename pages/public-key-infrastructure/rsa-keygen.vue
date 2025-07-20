<template>
  <div>
    <h3 class="text-2xl font-bold mb-4">Generate RSA Key-Pair</h3>
    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Key Size</label>
            <select
              :value="keySize"
              :disabled="generating"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              @input="handleKeySizeChange"
            >
              <option v-for="size in keySizes" :key="size" :value="size">{{ size }}</option>
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
          <key-pair-tab :key-pair="keyPair" @save="saveKeyPair"/>
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
                  <h6 class="text-sm font-medium text-gray-900">{{ kp.data.name }}</h6>
                  <div class="flex space-x-2">
                    <a
                      :download="`${kp.data.name}.pem`"
                      :href="kp.data.storageDownloadUrl"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <i class="fa fa-download"/>
                    </a>
                    <button
                      class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      @click="rsagenDelete(kp.id)"
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
import KeyPairTab from '~/components/KeyPairTab.vue'

const rsagenStore = useRsagenStore()
const authStore = useAuthStore()

const generating = ref<boolean>(false)

const keySize = computed(() => rsagenStore.keySize)
const keySizes = computed(() => rsagenStore.keySizes)
const keyPair = computed(() => rsagenStore.keyPair)
const keyPairs = computed(() => rsagenStore.keyPairs)

const handleKeySizeChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement
  rsagenStore.setKeySize(Number(target.value))
}

const generate = async (): Promise<void> => {
  generating.value = true
  try {
    await rsagenStore.generate(keySize.value)
  } finally {
    generating.value = false
  }
}

const saveKeyPair = (name: string, password: string, key: string): void => {
  rsagenStore.save({ name, password, key })
}

const rsagenDelete = (id: string): void => {
  rsagenStore.delete(id)
}

onMounted(async () => {
  await authStore.isLoggedIn()
  await rsagenStore.fetch()
})
</script>
