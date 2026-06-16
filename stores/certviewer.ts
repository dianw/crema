import { defineStore } from 'pinia'
import { pki, md } from 'node-forge'
import type { CertificateInfo } from '~/types'

export const useCertViewerStore = defineStore('certviewer', () => {
  const certPem = ref('')
  const certInfo = ref<CertificateInfo | null>(null)
  const errorMsg = ref('')

  const parse = (pem: string): CertificateInfo | null => {
    errorMsg.value = ''
    certPem.value = pem
    try {
      const cert = pki.certificateFromPem(pem)

      const subject: Record<string, string> = {}
      cert.subject.attributes.forEach((attr: any) => { subject[attr.shortName || attr.name] = attr.value })
      const issuer: Record<string, string> = {}
      cert.issuer.attributes.forEach((attr: any) => { issuer[attr.shortName || attr.name] = attr.value })

      const extensions = (cert.extensions || []).map((ext: any) => ({
        name: ext.name || ext.id || 'Unknown',
        value: ext.value || JSON.stringify(ext)
      }))

      const derBytes = pki.pemToDer(pem).getBytes()
      const fingerprintSHA1 = (md as any).sha1.create().update(derBytes).digest().toHex()
      const fingerprintSHA256 = (md as any).sha256.create().update(derBytes).digest().toHex()

      const info: CertificateInfo = {
        subject,
        issuer,
        serialNumber: cert.serialNumber,
        notBefore: cert.validity.notBefore.toISOString(),
        notAfter: cert.validity.notAfter.toISOString(),
        publicKeyAlgorithm: cert.publicKey?.constructor?.name?.replace('PublicKey', '') || 'RSA',
        publicKeySize: (cert.publicKey as any)?.n?.bitLength?.() || 0,
        fingerprintSHA1: fingerprintSHA1.match(/.{1,2}/g)?.join(':') || fingerprintSHA1,
        fingerprintSHA256: fingerprintSHA256.match(/.{1,2}/g)?.join(':') || fingerprintSHA256,
        extensions,
        rawPem: pem
      }
      certInfo.value = info
      return info
    } catch (e: any) {
      errorMsg.value = e.message || 'Invalid certificate PEM'
      certInfo.value = null
      return null
    }
  }

  return {
    certPem: readonly(certPem),
    certInfo: readonly(certInfo),
    errorMsg: readonly(errorMsg),
    parse
  }
})
