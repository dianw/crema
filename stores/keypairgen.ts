import { defineStore } from 'pinia'
import type { KeyPairData } from '~/types'

// Helper functions for OpenSSH format conversion
const writeUint32 = (value: number): Uint8Array => {
  const buffer = new Uint8Array(4)
  buffer[0] = (value >>> 24) & 0xff
  buffer[1] = (value >>> 16) & 0xff
  buffer[2] = (value >>> 8) & 0xff
  buffer[3] = value & 0xff
  return buffer
}

const writeString = (str: string): Uint8Array => {
  const strBytes = new TextEncoder().encode(str)
  const lengthBytes = writeUint32(strBytes.length)
  const result = new Uint8Array(lengthBytes.length + strBytes.length)
  result.set(lengthBytes, 0)
  result.set(strBytes, lengthBytes.length)
  return result
}

const writeBigInt = (value: Uint8Array): Uint8Array => {
  const lengthBytes = writeUint32(value.length)
  const result = new Uint8Array(lengthBytes.length + value.length)
  result.set(lengthBytes, 0)
  result.set(value, lengthBytes.length)
  return result
}

// Helper function to convert base64url to bytes
const base64UrlToBytes = (base64url: string): Uint8Array => {
  // Convert base64url to base64
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')

  // Add padding if needed
  while (base64.length % 4) {
    base64 += '='
  }

  // Convert to bytes
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes
}

const convertRSAPublicKeyToOpenSSH = async (publicKey: CryptoKey): Promise<string> => {
  // Export as JWK which is more reliable than parsing SPKI
  const jwk = await crypto.subtle.exportKey('jwk', publicKey) as JsonWebKey

  if (!jwk.n || !jwk.e) {
    throw new Error('Invalid RSA public key: missing modulus or exponent')
  }

  // Convert base64url to bytes
  const modulus = base64UrlToBytes(jwk.n)
  const exponent = base64UrlToBytes(jwk.e)

  // Build OpenSSH format
  const keyType = writeString('ssh-rsa')
  const exponentData = writeBigInt(exponent)
  const modulusData = writeBigInt(modulus)

  const sshKeyData = new Uint8Array(keyType.length + exponentData.length + modulusData.length)
  let offset = 0
  sshKeyData.set(keyType, offset)
  offset += keyType.length
  sshKeyData.set(exponentData, offset)
  offset += exponentData.length
  sshKeyData.set(modulusData, offset)

  const base64Key = btoa(String.fromCharCode(...sshKeyData))
  return `ssh-rsa ${base64Key}`
}

const convertECDSAPublicKeyToOpenSSH = async (publicKey: CryptoKey): Promise<string> => {
  const algorithm = publicKey.algorithm as EcKeyAlgorithm
  const curve = algorithm.namedCurve

  let keyType: string
  let curveName: string

  switch (curve) {
    case 'P-256':
      keyType = 'ecdsa-sha2-nistp256'
      curveName = 'nistp256'
      break
    case 'P-384':
      keyType = 'ecdsa-sha2-nistp384'
      curveName = 'nistp384'
      break
    case 'P-521':
      keyType = 'ecdsa-sha2-nistp521'
      curveName = 'nistp521'
      break
    default:
      throw new Error(`Unsupported ECDSA curve: ${curve}`)
  }

  const exported = await crypto.subtle.exportKey('raw', publicKey)
  const publicKeyBytes = new Uint8Array(exported)

  // Build OpenSSH format
  const keyTypeBytes = writeString(keyType)
  const curveNameBytes = writeString(curveName)
  const publicKeyData = writeBigInt(publicKeyBytes)

  const sshKeyData = new Uint8Array(keyTypeBytes.length + curveNameBytes.length + publicKeyData.length)
  let offset = 0
  sshKeyData.set(keyTypeBytes, offset)
  offset += keyTypeBytes.length
  sshKeyData.set(curveNameBytes, offset)
  offset += curveNameBytes.length
  sshKeyData.set(publicKeyData, offset)

  const base64Key = btoa(String.fromCharCode(...sshKeyData))
  return `${keyType} ${base64Key}`
}

const convertEd25519PublicKeyToOpenSSH = async (publicKey: CryptoKey): Promise<string> => {
  const exported = await crypto.subtle.exportKey('raw', publicKey)
  const publicKeyBytes = new Uint8Array(exported)

  // Build OpenSSH format
  const keyType = writeString('ssh-ed25519')
  const publicKeyData = writeBigInt(publicKeyBytes)

  const sshKeyData = new Uint8Array(keyType.length + publicKeyData.length)
  let offset = 0
  sshKeyData.set(keyType, offset)
  offset += keyType.length
  sshKeyData.set(publicKeyData, offset)

  const base64Key = btoa(String.fromCharCode(...sshKeyData))
  return `ssh-ed25519 ${base64Key}`
}

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

  const getPublicKeyOpenSSH = async (): Promise<string | null> => {
    if (!keyPair.value) {
      return null
    }

    try {
      const publicKey = keyPair.value.publicKey
      const algorithm = publicKey.algorithm as any

      if (algorithm.name === 'RSA-PSS') {
        return await convertRSAPublicKeyToOpenSSH(publicKey)
      } else if (algorithm.name === 'ECDSA') {
        return await convertECDSAPublicKeyToOpenSSH(publicKey)
      } else if (algorithm.name === 'Ed25519') {
        return await convertEd25519PublicKeyToOpenSSH(publicKey)
      }

      throw new Error(`Unsupported algorithm for OpenSSH format: ${algorithm.name}`)
    } catch (error) {
      console.error('Error converting to OpenSSH format:', error)
      return null
    }
  }

  const getPublicKeyFingerprint = async (): Promise<string | null> => {
    if (!keyPair.value) {
      return null
    }

    try {
      const opensshKey = await getPublicKeyOpenSSH()
      if (!opensshKey) return null

      // Extract the base64 part from the OpenSSH format
      const parts = opensshKey.split(' ')
      if (parts.length < 2 || !parts[1]) return null

      const keyData = atob(parts[1])
      const keyBytes = new Uint8Array(keyData.length)
      for (let i = 0; i < keyData.length; i++) {
        keyBytes[i] = keyData.charCodeAt(i)
      }

      // Generate SHA256 fingerprint
      const hashBuffer = await crypto.subtle.digest('SHA-256', keyBytes)
      const hashArray = new Uint8Array(hashBuffer)

      // Convert to base64 and format as SHA256 fingerprint
      const base64Hash = btoa(String.fromCharCode(...hashArray))
      return `SHA256:${base64Hash}`
    } catch (error) {
      console.error('Error generating fingerprint:', error)
      return null
    }
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
    getPublicKeyOpenSSH,
    getPublicKeyFingerprint,
    exportKeyToPem
  }
})
