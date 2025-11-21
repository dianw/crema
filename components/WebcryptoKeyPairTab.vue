<template>
  <div class="font-mono">
    <div class="border border-gray-200 rounded-lg">
      <div class="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0"
          :class="activeTab === tab.id ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="activeTab = tab.id"
        >
          {{ tab.title }}
        </button>
      </div>

      <div class="p-4">
        <div v-if="activeTab === 'private'" class="space-y-2">
          <div v-if="isRSAAlgorithm">
            <label for="pkcs-format" class="block text-sm font-medium text-gray-700 mb-2">PEM Format</label>
            <select
              id="pkcs-format"
              :value="selectedPkcsFormat"
              :disabled="!isRSAAlgorithm || privateKeyPem === null"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
              @change="onPkcsFormatChange"
            >
              <option
                v-for="format in pkcsFormats"
                :key="format.value"
                :value="format.value"
              >
                {{ format.name }}
              </option>
            </select>
            <p v-if="!isRSAAlgorithm" class="mt-1 text-xs text-gray-500">
              PKCS#1 is only available for RSA keys. Non-RSA keys use PKCS#8.
            </p>
          </div>
          <textarea
            :value="privateKeyPem"
            placeholder="Private Key Output"
            :rows="rowSize"
            readonly
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-xs"
          />
        </div>

        <div v-if="activeTab === 'public'" class="space-y-2">
          <textarea
            :value="publicKeyPem"
            placeholder="Public Key Output"
            :rows="rowSize"
            readonly
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-xs"
          />
        </div>

        <div v-if="activeTab === 'ssh'" class="space-y-2">
          <input
            :value="publicKeyFingerprint"
            placeholder="Public Key Fingerprint"
            readonly
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-xs"
          >
          <textarea
            :value="publicKeySSH"
            placeholder="SSH Public Key Output"
            :rows="rowSize"
            readonly
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-xs"
          />
        </div>

        <div v-if="activeTab === 'info'" class="space-y-2">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label class="block text-gray-600 font-medium">Algorithm:</label>
              <span class="text-gray-900">{{ algorithm }}</span>
            </div>
            <div v-if="keyInfo.keySize">
              <label class="block text-gray-600 font-medium">Key Size:</label>
              <span class="text-gray-900">{{ keyInfo.keySize }} bits</span>
            </div>
            <div v-if="keyInfo.curve">
              <label class="block text-gray-600 font-medium">Curve:</label>
              <span class="text-gray-900">{{ keyInfo.curve }}</span>
            </div>
            <div>
              <label class="block text-gray-600 font-medium">Extractable:</label>
              <span class="text-gray-900">{{ keyInfo.extractable ? 'Yes' : 'No' }}</span>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'save' && privateKeyPem && !saved" class="space-y-4">
          <form class="space-y-4" @submit.prevent="save">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Key-Pair Name</label>
              <input
                id="name"
                ref="nameInput"
                v-model="name"
                placeholder="Key-Pair Name"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                id="password"
                ref="passwordInput"
                v-model="password"
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Ref } from 'vue'

interface Tab {
  id: string
  title: string
}

interface PkcsFormat {
  readonly name: string
  readonly value: string
}

interface Props {
  rowSize?: number
  keyPair?: CryptoKeyPair | null | any
  algorithm?: string
  selectedPkcsFormat?: string
  pkcsFormats?: readonly PkcsFormat[] | PkcsFormat[]
  privateKeyPemValue?: string | null
  publicKeyPemValue?: string | null
  publicKeySSHValue?: string | null
  publicKeyFingerprintValue?: string | null
}

interface Emits {
  save: [name: string, password: string, keyPair: CryptoKeyPair]
  'update:selectedPkcsFormat': [format: string]
  'load-key-pair': [keyPair: CryptoKeyPair | null]
}

const props = withDefaults(defineProps<Props>(), {
  rowSize: 15,
  keyPair: null,
  algorithm: 'RSA-PSS',
  selectedPkcsFormat: 'pkcs8',
  pkcsFormats: () => [
    { name: 'PKCS#8', value: 'pkcs8' },
    { name: 'PKCS#1', value: 'pkcs1' }
  ],
  privateKeyPemValue: null,
  publicKeyPemValue: null,
  publicKeySSHValue: null,
  publicKeyFingerprintValue: null
})

const emit = defineEmits<Emits>()

const activeTab = ref<string>('private')
const name = ref<string | null>(null)
const saved = ref<boolean>(false)
const password = ref<string | null>(null)

const privateKeyPem = computed(() => props.privateKeyPemValue)
const publicKeyPem = computed(() => props.publicKeyPemValue)
const publicKeySSH = computed(() => props.publicKeySSHValue)
const publicKeyFingerprint = computed(() => props.publicKeyFingerprintValue)

const nameInput: Ref<HTMLInputElement | null> = ref(null)
const passwordInput: Ref<HTMLInputElement | null> = ref(null)

const isRSAAlgorithm = computed(() => {
  return props.algorithm === 'RSA-PSS' ||
         props.algorithm === 'RSASSA-PKCS1-v1_5' ||
         props.algorithm === 'RSA-OAEP'
})

const onPkcsFormatChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement
  emit('update:selectedPkcsFormat', target.value)
}

const keyInfo = computed(() => {
  if (!props.keyPair) {
    return { extractable: false }
  }

  const info: any = {
    extractable: props.keyPair.privateKey.extractable
  }

  // Extract algorithm-specific information
  if (props.keyPair.privateKey.algorithm) {
    const alg = props.keyPair.privateKey.algorithm as any

    if (alg.name === 'RSA-PSS' && alg.modulusLength) {
      info.keySize = alg.modulusLength
    } else if (alg.name === 'ECDSA' && alg.namedCurve) {
      info.curve = alg.namedCurve
    }
  }

  return info
})

const tabs = computed((): Tab[] => {
  const baseTabs: Tab[] = [
    { id: 'private', title: 'Private Key' },
    { id: 'public', title: 'Public Key' },
    { id: 'ssh', title: 'SSH Public Key' },
    { id: 'info', title: 'Key Info' }
  ]

  if (privateKeyPem.value && !saved.value) {
    baseTabs.push({ id: 'save', title: 'Save' })
  }

  return baseTabs
})

const save = (): void => {
  if ((name.value || '').trim() === '') {
    nameInput.value?.focus()
    return
  }
  if (name.value && password.value && props.keyPair) {
    emit('save', name.value, password.value, props.keyPair)
    saved.value = true
  }
}

const loadKeyPair = (kp: CryptoKeyPair | null): void => {
  emit('load-key-pair', kp)
}

onMounted(() => {
  loadKeyPair(props.keyPair)
})

watch(() => props.keyPair, (kp: CryptoKeyPair | null) => {
  saved.value = false
  loadKeyPair(kp)
})
</script>
