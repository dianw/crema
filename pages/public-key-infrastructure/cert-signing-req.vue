<template>
  <div>
    <h3 class="text-2xl font-bold mb-4">Certificate Signing Request</h3>
    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <form @submit.prevent="generate" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Key Size</label>
              <select
                :value="keySize"
                @input="handleKeySizeChange"
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
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Organization</label>
              <input
                v-model="dn.organizationName"
                :disabled="generating"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                v-model="dn.organizationalUnitName"
                :disabled="generating"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                v-model="dn.localityName"
                :disabled="generating"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">State / Province</label>
              <input
                v-model="dn.stateOrProvinceName"
                :disabled="generating"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
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
              <button
                type="submit"
                :disabled="generating"
                class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
              >
                {{ generating ? 'Generating...' : 'Generate CSR' }}
              </button>
            </div>
          </form>
        </div>
        <div class="font-mono space-y-4">
          <div>
            <textarea
              placeholder="CSR PEM Output"
              :rows="15"
              readonly
              :value="csrPem"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
            />
          </div>
          <div>
            <key-pair-tab :key-pair="keyPair"></key-pair-tab>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import KeyPairTab from '~/components/KeyPairTab.vue'
import { useCsrStore } from '~/stores/csr'
import { useRsagenStore } from '~/stores/rsagen'
import { useCountryStore } from '~/stores/country'

interface DistinguishedName {
  commonName: string | null
  organizationName: string | null
  organizationalUnitName: string | null
  localityName: string | null
  stateOrProvinceName: string | null
  countryName: string
}

const csrStore = useCsrStore()
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

const generating = ref<boolean>(false)

const subject = computed(() => csrStore.subject)
const subjectDn = computed(() => csrStore.dn)
const csrPem = computed(() => csrStore.pem)
const keySize = computed(() => rsagenStore.keySize)
const keySizes = computed(() => rsagenStore.keySizes)
const countries = computed(() => countryStore.countries)
const keyPair = computed(() => rsagenStore.keyPair)

const handleKeySizeChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement
  rsagenStore.setKeySize(Number(target.value))
}

const generate = async (): Promise<void> => {
  generating.value = true
  try {
    // Convert dn to the format expected by the store
    const dnForStore: Record<string, string> = {}
    Object.entries(dn.value).forEach(([key, value]) => {
      if (value !== null) {
        dnForStore[key] = value
      }
    })
    await csrStore.generate({ dn: dnForStore, keySize: keySize.value })
  } finally {
    generating.value = false
  }
}

onMounted(() => {
  if (subjectDn.value) {
    // Map the store DN to our component DN structure
    dn.value = {
      commonName: subjectDn.value.commonName || null,
      organizationName: subjectDn.value.organizationName || null,
      organizationalUnitName: subjectDn.value.organizationalUnitName || null,
      localityName: subjectDn.value.localityName || null,
      stateOrProvinceName: subjectDn.value.stateOrProvinceName || null,
      countryName: subjectDn.value.countryName || 'ID'
    }
  }
})
</script>
