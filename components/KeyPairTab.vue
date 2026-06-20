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

        <div v-if="activeTab === 'pkcs8'" class="space-y-2">
          <textarea
            :value="privateKeyPkcs8Pem"
            placeholder="PKCS#8 Private Key Output"
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
import { pki, ssh, asn1, util } from 'node-forge'
import type { RsaAlgorithm } from '~/stores/rsagen'
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
  algorithm?: RsaAlgorithm
}

interface Emits {
  save: [name: string, password: string, privateKeyPem: string, publicKeyPem: string]
}

const props = withDefaults(defineProps<Props>(), {
  rowSize: 15,
  keyPair: () => ({}),
  algorithm: 'pkcs1'
})

const emit = defineEmits<Emits>()

const activeTab = ref<string>('private')
const name = ref<string | null>(null)
const saved = ref<boolean>(false)
const password = ref<string | null>(null)
const privateKeyPem = ref<string | null>(null)
const publicKeyPem = ref<string | null>(null)
const privateKeyPkcs8Pem = ref<string | null>(null)
const publicKeySSH = ref<string | null>(null)
const publicKeyFingerprint = ref<string | null>(null)

const nameInput: Ref<HTMLInputElement | null> = ref(null)
const passwordInput: Ref<HTMLInputElement | null> = ref(null)

const tabs = computed((): Tab[] => {
  const baseTabs: Tab[] = [
    { id: 'private', title: 'Private Key (PKCS#1)' },
    { id: 'pkcs8', title: 'Private Key (PKCS#8)' },
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

const buildPkcs8Pem = (privateKey: pki.rsa.PrivateKey, alg: RsaAlgorithm): string => {
  const rsaPrivateKey = pki.privateKeyToAsn1(privateKey)

  // Well-known OIDs
  const OID_SHA256 = '2.16.840.1.101.3.4.2.1'
  const OID_MGF1 = '1.2.840.113549.1.1.8'
  const OID_RSASSA_PSS = '1.2.840.113549.1.1.10'

  const oidDer = (oid: string): string => (asn1.oidToDer(oid) as { getBytes: () => string }).getBytes()

  if (alg === 'pss') {
    // Build RSASSA-PSS AlgorithmIdentifier with SHA-256, MGF1-SHA256, saltLength=32
    const hashAlgoSeq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, oidDer(OID_SHA256)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
    ])

    const mgf1Params = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, oidDer(OID_SHA256)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
    ])

    const mgfAlgoSeq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, oidDer(OID_MGF1)),
      mgf1Params
    ])

    const pssParams = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [hashAlgoSeq]),
      asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [mgfAlgoSeq]),
      asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, String.fromCharCode(32))
      ]),
      asn1.create(asn1.Class.CONTEXT_SPECIFIC, 3, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, String.fromCharCode(1))
      ])
    ])

    const algorithmIdentifier = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, oidDer(OID_RSASSA_PSS)),
      pssParams
    ])

    const version = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, String.fromCharCode(0))

    const privateKeyInfo = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      version,
      algorithmIdentifier,
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, (asn1.toDer(rsaPrivateKey) as { getBytes: () => string }).getBytes())
    ])

    const der = (asn1.toDer(privateKeyInfo) as { getBytes: () => string }).getBytes()
    const b64 = util.encode64(der)
    const lines = b64.match(/.{1,64}/g)?.join('\n') || b64
    return `-----BEGIN PRIVATE KEY-----\n${lines}\n-----END PRIVATE KEY-----\n`
  }

  // pkcs1 and oaep: standard rsaEncryption OID
  const privateKeyInfo = pki.wrapRsaPrivateKey(rsaPrivateKey)
  return pki.privateKeyInfoToPem(privateKeyInfo)
}

const loadKeyPair = (kp: KeyPair | undefined): void => {
  if (!kp || !kp.privateKey || !kp.publicKey) return
  privateKeyPem.value = pki.privateKeyToPem(kp.privateKey)
  publicKeyPem.value = pki.publicKeyToPem(kp.publicKey)
  privateKeyPkcs8Pem.value = buildPkcs8Pem(kp.privateKey, props.algorithm)
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

watch(() => props.algorithm, () => {
  if (props.keyPair?.privateKey) {
    privateKeyPkcs8Pem.value = buildPkcs8Pem(props.keyPair.privateKey, props.algorithm)
  }
})
</script>
