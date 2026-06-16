<template>
  <div>
    <h3 class="text-2xl font-bold mb-4">Self-Signed Certificate Generator</h3>
    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <form class="space-y-4" @submit.prevent="generate">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Key Size</label>
              <select
                v-model="keySizeValue"
                :disabled="generating"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option v-for="size in keySizes" :key="size" :value="size">{{ size }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Common Name</label>
              <input
                v-model="dn.commonName"
                :disabled="generating"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., example.com"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Organization</label>
              <input
                v-model="dn.organizationName"
                :disabled="generating"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                v-model="dn.organizationalUnitName"
                :disabled="generating"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                v-model="dn.localityName"
                :disabled="generating"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">State / Province</label>
              <input
                v-model="dn.stateOrProvinceName"
                :disabled="generating"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select
                v-model="dn.countryName"
                :disabled="generating"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option v-for="(name, code) in countries" :key="code" :value="code">{{ name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
              <input
                v-model="validUntil"
                type="date"
                :disabled="generating"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            <div>
              <button
                type="submit"
                :disabled="generating"
                class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
              >
                {{ generating ? 'Generating...' : 'Generate Self-Signed Certificate' }}
              </button>
            </div>
          </form>
        </div>
        <div class="font-mono space-y-4">
          <div v-if="errorMsg" class="text-red-600 text-sm">
            {{ errorMsg }}
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Certificate (PEM)</label>
            <textarea
              :value="certPem"
              placeholder="Certificate PEM Output"
              :rows="15"
              readonly
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
            />
          </div>
          <div v-if="keyPair">
            <key-pair-tab :key-pair="keyPair" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import KeyPairTab from '~/components/KeyPairTab.vue'
import { useSelfSignedCertStore } from '~/stores/selfsignedcert'
import { useRsagenStore } from '~/stores/rsagen'
import { useCountryStore } from '~/stores/country'
import type { DistinguishedName } from '~/types'

const certStore = useSelfSignedCertStore()
const rsagenStore = useRsagenStore()
const countryStore = useCountryStore()

const dn = ref<DistinguishedName>({
  commonName: null,
  organizationName: null,
  organizationalUnitName: null,
  localityName: null,
  stateOrProvinceName: null,
  countryName: 'ID'
})

const keySizeValue = ref(2048)
const validUntil = ref('')
const generating = ref(false)

const keySizes = computed(() => rsagenStore.keySizes)
const countries = computed(() => countryStore.countries)
const certPem = computed(() => certStore.certPem)
const keyPair = computed(() => certStore.keyPair)
const errorMsg = computed(() => certStore.errorMsg)

const generate = async () => {
  generating.value = true
  try {
    const dnForStore: Record<string, string> = {}
    Object.entries(dn.value).forEach(([key, value]) => {
      if (value !== null) {
        dnForStore[key] = value
      }
    })
    const notAfter = validUntil.value ? new Date(validUntil.value) : undefined
    await certStore.generate({ dn: dnForStore, keySize: keySizeValue.value, notAfter })
  } catch {
    // error is handled in store
  } finally {
    generating.value = false
  }
}
</script>
