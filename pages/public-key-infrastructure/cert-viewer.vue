<template>
  <div>
    <h3 class="text-2xl font-bold mb-4">Certificate Viewer</h3>
    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Paste Certificate (PEM)</label>
        <textarea
          v-model="pemInput"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-xs"
          placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
          rows="8"
        />
      </div>

      <div class="mb-6">
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          :disabled="!pemInput.trim()"
          @click="handleParse"
        >
          Parse Certificate
        </button>
      </div>

      <div v-if="errorMsg" class="mb-4 text-red-600 text-sm">
        {{ errorMsg }}
      </div>

      <div v-if="certInfo" class="space-y-6">
        <!-- Subject -->
        <section>
          <h4 class="text-lg font-semibold text-gray-900 mb-2">Subject</h4>
          <div class="bg-gray-50 rounded p-3 font-mono text-sm">
            <div v-for="(value, key) in certInfo.subject" :key="key" class="grid grid-cols-2 gap-2 py-1">
              <span class="text-gray-500">{{ key }}</span>
              <span>{{ value }}</span>
            </div>
          </div>
        </section>

        <!-- Issuer -->
        <section>
          <h4 class="text-lg font-semibold text-gray-900 mb-2">Issuer</h4>
          <div class="bg-gray-50 rounded p-3 font-mono text-sm">
            <div v-for="(value, key) in certInfo.issuer" :key="key" class="grid grid-cols-2 gap-2 py-1">
              <span class="text-gray-500">{{ key }}</span>
              <span>{{ value }}</span>
            </div>
          </div>
        </section>

        <!-- Validity -->
        <section>
          <h4 class="text-lg font-semibold text-gray-900 mb-2">Validity</h4>
          <div class="bg-gray-50 rounded p-3 font-mono text-sm">
            <div class="grid grid-cols-2 gap-2 py-1">
              <span class="text-gray-500">Not Before</span>
              <span>{{ formatDate(certInfo.notBefore) }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 py-1">
              <span class="text-gray-500">Not After</span>
              <span>{{ formatDate(certInfo.notAfter) }}</span>
            </div>
          </div>
        </section>

        <!-- Serial Number -->
        <section>
          <h4 class="text-lg font-semibold text-gray-900 mb-2">Serial Number</h4>
          <div class="bg-gray-50 rounded p-3 font-mono text-sm break-all">
            {{ certInfo.serialNumber }}
          </div>
        </section>

        <!-- Public Key -->
        <section>
          <h4 class="text-lg font-semibold text-gray-900 mb-2">Public Key</h4>
          <div class="bg-gray-50 rounded p-3 font-mono text-sm">
            <div class="grid grid-cols-2 gap-2 py-1">
              <span class="text-gray-500">Algorithm</span>
              <span>{{ certInfo.publicKeyAlgorithm }}</span>
            </div>
            <div v-if="certInfo.publicKeySize" class="grid grid-cols-2 gap-2 py-1">
              <span class="text-gray-500">Key Size</span>
              <span>{{ certInfo.publicKeySize }} bits</span>
            </div>
          </div>
        </section>

        <!-- Fingerprints -->
        <section>
          <h4 class="text-lg font-semibold text-gray-900 mb-2">Fingerprints</h4>
          <div class="bg-gray-50 rounded p-3 font-mono text-sm">
            <div class="py-1">
              <span class="text-gray-500 block mb-1">SHA-1</span>
              <span class="break-all">{{ certInfo.fingerprintSHA1 }}</span>
            </div>
            <div class="py-1">
              <span class="text-gray-500 block mb-1">SHA-256</span>
              <span class="break-all">{{ certInfo.fingerprintSHA256 }}</span>
            </div>
          </div>
        </section>

        <!-- Extensions -->
        <section v-if="certInfo.extensions.length">
          <h4 class="text-lg font-semibold text-gray-900 mb-2">Extensions ({{ certInfo.extensions.length }})</h4>
          <div class="bg-gray-50 rounded p-3 font-mono text-sm">
            <div v-for="(ext, i) in certInfo.extensions" :key="i" class="py-1 border-b border-gray-200 last:border-b-0">
              <span class="text-gray-500 block">{{ ext.name }}</span>
              <span class="break-all">{{ ext.value }}</span>
            </div>
          </div>
        </section>

        <!-- Raw PEM -->
        <section>
          <h4 class="text-lg font-semibold text-gray-900 mb-2">
            <button
              class="text-blue-600 hover:underline text-sm font-normal"
              @click="showRawPem = !showRawPem"
            >
              {{ showRawPem ? 'Hide' : 'Show' }} Raw PEM
            </button>
          </h4>
          <div v-if="showRawPem">
            <textarea
              :value="certInfo.rawPem"
              readonly
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 font-mono text-xs"
              rows="8"
            />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCertViewerStore } from '~/stores/certviewer'
import type { CertificateInfo } from '~/types'

const certViewerStore = useCertViewerStore()

const pemInput = ref('')
const showRawPem = ref(false)

const certInfo = computed<CertificateInfo | null>(() => {
  const info = certViewerStore.certInfo
  return info ? JSON.parse(JSON.stringify(info)) : null
})
const errorMsg = computed(() => certViewerStore.errorMsg)

const handleParse = () => {
  showRawPem.value = false
  certViewerStore.parse(pemInput.value)
}

const formatDate = (iso: string): string => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
