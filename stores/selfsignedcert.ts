import { defineStore } from 'pinia'
import { pki, md } from 'node-forge'
import type { SelfSignedCertResult } from '~/types'

export const useSelfSignedCertStore = defineStore('selfsignedcert', () => {
  const certPem = ref('')
  const privateKeyPem = ref('')
  const publicKeyPem = ref('')
  const keyPair = ref<unknown>(null)
  const errorMsg = ref('')
  const generating = ref(false)

  const generate = async (params: { dn: Record<string, string>; keySize: number; notBefore?: Date; notAfter?: Date }): Promise<SelfSignedCertResult> => {
    generating.value = true
    errorMsg.value = ''
    try {
      const { useRsagenStore } = await import('./rsagen')
      const rsagenStore = useRsagenStore()

      const kp = await rsagenStore.generate(params.keySize) as { publicKey: any; privateKey: any }
      keyPair.value = kp

      const cert = pki.createCertificate()
      cert.publicKey = kp.publicKey
      cert.serialNumber = Date.now().toString(16) + Math.random().toString(16).slice(2, 10)

      // Set subject from DN
      const fieldMap: Record<string, string> = {
        commonName: 'CN',
        organizationName: 'O',
        organizationalUnitName: 'OU',
        localityName: 'L',
        stateOrProvinceName: 'ST',
        countryName: 'C'
      }
      const subjectAttrs: { name: string; value: string }[] = []
      for (const [key, value] of Object.entries(params.dn)) {
        if (value) {
          subjectAttrs.push({ name: fieldMap[key] || key, value })
        }
      }
      cert.setSubject(subjectAttrs)
      cert.setIssuer(subjectAttrs) // self-signed

      cert.validity.notBefore = params.notBefore || new Date()
      const notAfter = params.notAfter || new Date()
      notAfter.setFullYear(notAfter.getFullYear() + 1)
      cert.validity.notAfter = notAfter

      cert.sign(kp.privateKey, (md as any).sha256.create())

      certPem.value = pki.certificateToPem(cert)
      privateKeyPem.value = pki.privateKeyToPem(kp.privateKey)
      publicKeyPem.value = pki.publicKeyToPem(kp.publicKey)

      return { certPem: certPem.value, privateKeyPem: privateKeyPem.value, publicKeyPem: publicKeyPem.value }
    } catch (e: any) {
      errorMsg.value = e.message || 'Certificate generation failed'
      throw e
    } finally {
      generating.value = false
    }
  }

  const reset = () => {
    certPem.value = ''
    privateKeyPem.value = ''
    publicKeyPem.value = ''
    keyPair.value = null
    errorMsg.value = ''
  }

  return {
    certPem: readonly(certPem),
    privateKeyPem: readonly(privateKeyPem),
    publicKeyPem: readonly(publicKeyPem),
    keyPair: readonly(keyPair),
    errorMsg: readonly(errorMsg),
    generating: readonly(generating),
    generate,
    reset
  }
})
