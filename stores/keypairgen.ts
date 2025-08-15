import { defineStore } from 'pinia'
import type { KeyPairData } from '~/types'

export const useKeypairgenStore = defineStore('keypairgen', () => {
  const selectedKeySize = ref<number>(2048)
  const keySizes = ref<number[]>([1024, 2048, 4096])
  const selectedAlgorithm = ref<string>('RSA-PSS')
  const algorithms = ref<string[]>(['RSA-PSS', 'ECDSA', 'Ed25519'])
  const selectedCurve = ref<string>('P-256')
  const curves = ref([
    { name: 'P-256 (secp256r1)', value: 'P-256' },
    { name: 'P-384 (secp384r1)', value: 'P-384' },
    { name: 'P-521 (secp521r1)', value: 'P-521' }
  ])
  const keyPair = ref<CryptoKeyPair | null>(null)
  const keyPairs = ref<KeyPairData[]>([])

  const addKeyPair = (newKeyPair: KeyPairData) => {
    keyPairs.value.push(JSON.parse(JSON.stringify(newKeyPair)))
  }

  const setSelectedKeySize = (size: number) => {
    selectedKeySize.value = size
    // Clear the previously generated key pair when key size changes
    setKeyPair(null)
  }

  const setSelectedAlgorithm = (alg: string) => {
    selectedAlgorithm.value = alg
    // Clear the previously generated key pair when algorithm changes
    setKeyPair(null)
  }

  const setSelectedCurve = (curve: string) => {
    selectedCurve.value = curve
    // Clear the previously generated key pair when curve changes
    setKeyPair(null)
  }

  const setKeyPair = (pair: CryptoKeyPair | null) => {
    keyPair.value = pair
  }

  const setKeyPairs = (pairs: KeyPairData[]) => {
    keyPairs.value = pairs
  }

  const generate = async (algorithm: string, keySize?: number) => {
    setKeyPair(null)

    try {
      let keyGenAlgorithm: RsaHashedKeyGenParams | EcKeyGenParams | { name: string }
      let keyUsages: KeyUsage[]

      switch (algorithm) {
        case 'RSA-PSS':
          keyGenAlgorithm = {
            name: 'RSA-PSS',
            modulusLength: keySize || 2048,
            publicExponent: new Uint8Array([1, 0, 1]), // 65537
            hash: 'SHA-256'
          }
          keyUsages = ['sign', 'verify']
          break

        case 'ECDSA':
          keyGenAlgorithm = {
            name: 'ECDSA',
            namedCurve: keySize === 384 ? 'P-384' : keySize === 521 ? 'P-521' : selectedCurve.value
          }
          keyUsages = ['sign', 'verify']
          break

        case 'Ed25519':
          keyGenAlgorithm = {
            name: 'Ed25519'
          }
          keyUsages = ['sign', 'verify']
          break

        default:
          throw new Error(`Unsupported algorithm: ${algorithm}`)
      }

      const generatedKeyPair = await window.crypto.subtle.generateKey(
        keyGenAlgorithm,
        true, // extractable
        keyUsages
      ) as CryptoKeyPair

      setKeyPair(generatedKeyPair)

      return generatedKeyPair
    } catch (error) {
      console.error('Error generating key pair:', error)
      throw error
    }
  }

  const exportKeyToPem = async (key: CryptoKey, type: 'private' | 'public'): Promise<string> => {
    // All supported algorithms use the same PEM format
    const format: KeyFormat = type === 'private' ? 'pkcs8' : 'spki'
    const pemHeader = type === 'private' ? '-----BEGIN PRIVATE KEY-----' : '-----BEGIN PUBLIC KEY-----'
    const pemFooter = type === 'private' ? '-----END PRIVATE KEY-----' : '-----END PUBLIC KEY-----'

    const exported = await window.crypto.subtle.exportKey(format, key)
    const exportedAsBase64 = btoa(String.fromCharCode(...new Uint8Array(exported)))

    // Split the base64 string into 64-character lines
    const pemBody = exportedAsBase64.match(/.{1,64}/g)?.join('\n') || ''

    return `${pemHeader}\n${pemBody}\n${pemFooter}`
  }

  const deleteKeyPair = (docId: string) => {
    // Remove from local storage
    const currentPairs = keyPairs.value.filter(kp => kp.id !== docId)
    setKeyPairs(currentPairs)

    // Save to localStorage
    localStorage.setItem('keypairgen-keypairs', JSON.stringify(currentPairs))
  }

  const fetch = () => {
    // Load from localStorage
    try {
      const stored = localStorage.getItem('keypairgen-keypairs')
      if (stored) {
        const pairs = JSON.parse(stored)
        setKeyPairs(pairs)
      }
    } catch (error) {
      console.error('Error loading key pairs from localStorage:', error)
      setKeyPairs([])
    }
  }

  const save = ({ name, password, privateKey, publicKey }: { name: string, password: string, privateKey: string, publicKey: string }) => {
    // For simplicity, we'll store the password-protected PEM directly
    // In a real application, you'd want to properly encrypt the private key
    let processedPrivateKey = privateKey

    if (password) {
      // Add a simple password protection marker (this is not secure encryption)
      processedPrivateKey = `# Password Protected (${password})\n${privateKey}`
    }

    // Create a new key pair entry
    const newKeyPair = {
      id: Date.now().toString(),
      data: {
        name,
        algorithm: selectedAlgorithm.value,
        createdDate: new Date().toISOString(),
        // Store keys as base64 encoded data for download
        privateKeyData: btoa(processedPrivateKey),
        publicKeyData: btoa(publicKey)
      }
    }

    // Add to current list
    const updatedPairs = [newKeyPair, ...keyPairs.value]
    setKeyPairs(updatedPairs)

    // Save to localStorage
    localStorage.setItem('keypairgen-keypairs', JSON.stringify(updatedPairs))

    return newKeyPair
  }

  const getPublicKeyPem = async (): Promise<string | null> => {
    if (!keyPair.value) {
      return null
    }

    return await exportKeyToPem(keyPair.value.publicKey, 'public')
  }

  const getPrivateKeyPem = async (): Promise<string | null> => {
    if (!keyPair.value) {
      return null
    }

    return await exportKeyToPem(keyPair.value.privateKey, 'private')
  }

  return {
    selectedKeySize: readonly(selectedKeySize),
    keySizes: readonly(keySizes),
    selectedAlgorithm: readonly(selectedAlgorithm),
    algorithms: readonly(algorithms),
    selectedCurve: readonly(selectedCurve),
    curves: readonly(curves),
    keyPair: readonly(keyPair),
    keyPairs: readonly(keyPairs),
    addKeyPair,
    setSelectedKeySize,
    setSelectedAlgorithm,
    setSelectedCurve,
    setKeyPair,
    setKeyPairs,
    delete: deleteKeyPair,
    fetch,
    generate,
    save,
    getPublicKeyPem,
    getPrivateKeyPem,
    exportKeyToPem
  }
})
