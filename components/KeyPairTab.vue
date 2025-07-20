<template>
  <div class="font-mono">
    <div class="border border-gray-200 rounded-lg">
      <div class="flex border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === tab.id ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="activeTab = tab.id"
        >
          {{ tab.title }}
        </button>
      </div>

      <div class="p-4">
        <div v-if="activeTab === 'private'" class="space-y-2">
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
import { pki, ssh } from 'node-forge'
import type { Ref } from 'vue'

interface KeyPair {
  privateKey?: pki.rsa.PrivateKey
  publicKey?: pki.rsa.PublicKey
  [key: string]: unknown
}

interface Tab {
  id: string
  title: string
}

interface Props {
  rowSize?: number
  keyPair?: KeyPair
}

interface Emits {
  save: [name: string, password: string, privateKeyPem: string, publicKeyPem: string]
}

const props = withDefaults(defineProps<Props>(), {
  rowSize: 15,
  keyPair: () => ({})
})

const emit = defineEmits<Emits>()

const activeTab = ref<string>('private')
const name = ref<string | null>(null)
const saved = ref<boolean>(false)
const password = ref<string | null>(null)
const privateKeyPem = ref<string | null>(null)
const publicKeyPem = ref<string | null>(null)
const publicKeySSH = ref<string | null>(null)
const publicKeyFingerprint = ref<string | null>(null)

const nameInput: Ref<HTMLInputElement | null> = ref(null)
const passwordInput: Ref<HTMLInputElement | null> = ref(null)

const tabs = computed((): Tab[] => {
  const baseTabs: Tab[] = [
    { id: 'private', title: 'Private Key' },
    { id: 'public', title: 'Public Key' },
    { id: 'ssh', title: 'SSH Public Key' }
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
  if (name.value && password.value && privateKeyPem.value && publicKeyPem.value) {
    emit('save', name.value, password.value, privateKeyPem.value, publicKeyPem.value)
    saved.value = true
  }
}

const loadKeyPair = (kp: KeyPair | undefined): void => {
  if (!kp || !kp.privateKey) return
  privateKeyPem.value = pki.privateKeyToPem(kp.privateKey)
  publicKeyPem.value = pki.publicKeyToPem(kp.publicKey)
  publicKeySSH.value = ssh.publicKeyToOpenSSH(kp.publicKey)
  publicKeyFingerprint.value = ssh.getPublicKeyFingerprint(kp.publicKey, {encoding: 'hex', delimiter: ':'}) as string
}

onMounted(() => {
  loadKeyPair(props.keyPair)
})

watch(() => props.keyPair, (kp: KeyPair | undefined) => {
  saved.value = false
  loadKeyPair(kp)
})
</script>
