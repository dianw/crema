<template>
  <div>
    <h3 class="text-2xl font-bold mb-4">Generate EC Key-Pair</h3>
    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Curve</label>
            <select
              :value="curve"
              :disabled="generating"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              @input="handleCurveChange"
            >
              <option v-for="c in curves" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
          </div>
          <div v-if="errorMsg" class="mb-4 text-amber-600 text-sm bg-amber-50 border border-amber-200 rounded p-3">
            {{ errorMsg }}
          </div>
          <div class="mb-4">
            <button
              :disabled="generating || !supportsCurve"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
              @click="generate"
            >
              {{ generating ? 'Generating...' : 'Generate Key Pair' }}
            </button>
          </div>

          <!-- Key display tabs -->
          <div v-if="privateKeyPem || publicKeyPem" class="font-mono">
            <div class="border border-gray-200 rounded-lg">
              <div class="flex border-b border-gray-200">
                <button
                  class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
                  :class="activeTab === 'private' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700'"
                  @click="activeTab = 'private'"
                >
                  Private Key
                </button>
                <button
                  class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
                  :class="activeTab === 'public' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700'"
                  @click="activeTab = 'public'"
                >
                  Public Key
                </button>
                <button
                  v-if="!saved"
                  class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
                  :class="activeTab === 'save' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700'"
                  @click="activeTab = 'save'"
                >
                  Save
                </button>
              </div>
              <div class="p-4">
                <div v-if="activeTab === 'private'">
                  <textarea
                    :value="privateKeyPem"
                    readonly
                    rows="15"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-xs"
                  />
                </div>
                <div v-if="activeTab === 'public'">
                  <textarea
                    :value="publicKeyPem"
                    readonly
                    rows="15"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-xs"
                  />
                </div>
                <div v-if="activeTab === 'save' && !saved" class="space-y-4">
                  <form class="space-y-4" @submit.prevent="saveKey">
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Key-Pair Name</label>
                      <input
                        id="name"
                        v-model="keyName"
                        placeholder="Key-Pair Name"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                    </div>
                    <div>
                      <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <input
                        id="password"
                        v-model="keyPassword"
                        type="password"
                        placeholder="Password"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                    </div>
                    <div>
                      <button
                        type="submit"
                        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="bg-white border border-gray-200 rounded-lg">
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 class="text-lg font-semibold text-gray-900">Saved Key-Pairs</h4>
            </div>
            <div class="p-4">
              <div class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
                <em>Login required to save keys</em>
              </div>
              <div class="space-y-3">
                <div v-for="kp in keyPairs" :key="kp.id" class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <h6 class="text-sm font-medium text-gray-900">{{ (kp.data as Record<string, any>).name }}</h6>
                  <div class="flex space-x-2">
                    <a
                      :download="`${(kp.data as Record<string, any>).name}.pem`"
                      :href="(kp.data as Record<string, any>).storageDownloadUrl"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <i class="fa fa-download" />
                    </a>
                    <button
                      class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      @click="ecDelete(kp.id)"
                    >
                      <i class="fa fa-trash" />
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
import { useEcKeygenStore } from '~/stores/eckeygen'
import type { ECCurve } from '~/types'

const ecStore = useEcKeygenStore()

const generating = ref(false)
const activeTab = ref('private')
const saved = ref(false)
const keyName = ref('')
const keyPassword = ref('')

const curve = computed(() => ecStore.curve)
const curves = computed(() => ecStore.curves)
const privateKeyPem = computed(() => ecStore.privateKeyPem)
const publicKeyPem = computed(() => ecStore.publicKeyPem)
const keyPairs = computed(() => ecStore.keyPairs)
const errorMsg = computed(() => ecStore.errorMsg)
const supportsCurve = computed(() => curve.value === 'Ed25519')

const handleCurveChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  ecStore.setCurve(target.value as ECCurve)
}

const generate = async () => {
  generating.value = true
  saved.value = false
  activeTab.value = 'private'
  try {
    await ecStore.generate(curve.value)
  } finally {
    generating.value = false
  }
}

const saveKey = () => {
  if (!keyName.value.trim()) return
  if (keyName.value && keyPassword.value && privateKeyPem.value) {
    ecStore.save({ name: keyName.value, password: keyPassword.value, key: privateKeyPem.value })
    saved.value = true
    keyName.value = ''
    keyPassword.value = ''
  }
}

const ecDelete = (id: string) => {
  ecStore.delete(id)
}
</script>
