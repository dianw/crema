import { defineStore } from 'pinia'
import { pki } from 'node-forge'

interface SubjectDN {
  [key: string]: string
}

interface SubjectItem {
  name: string
  value: string
}

export const useCsrStore = defineStore('csr', () => {
  const dn = ref<SubjectDN | null>(null)
  const csr = ref<unknown>(null)
  const pem = ref<string | null>(null)
  const subject = ref<SubjectItem[]>([])

  const setCSR = ({ csr: csrValue, pem: pemValue }: { csr: unknown, pem: string }) => {
    csr.value = csrValue
    pem.value = pemValue
  }

  const setSubject = (subjectDN: SubjectDN) => {
    dn.value = subjectDN
    const csrSubject: SubjectItem[] = []
    for (const s in subjectDN) {
      csrSubject.push({
        name: s,
        value: subjectDN[s] || ''
      })
    }
    subject.value = csrSubject
  }

  const generate = async ({ keySize, dn: dnValue }: { keySize: number, dn: SubjectDN }) => {
    const { useRsagenStore } = await import('./rsagen')
    const rsagenStore = useRsagenStore()

    const keyPair = await rsagenStore.generate(keySize) as { publicKey: pki.PublicKey, privateKey: pki.PrivateKey }
    await setSubjectAction(dnValue)

    const csrObj = pki.createCertificationRequest()
    csrObj.publicKey = keyPair.publicKey
    csrObj.setSubject(subject.value)
    csrObj.sign(keyPair.privateKey as pki.MDSigner)

    const signedCsr = {
      csr: csrObj,
      pem: pki.certificationRequestToPem(csrObj)
    }

    setCSR(signedCsr)
    return signedCsr
  }

  const setSubjectAction = async (dnValue: SubjectDN) => {
    setSubject(dnValue)
    return subject.value
  }

  return {
    dn: readonly(dn),
    csr: readonly(csr),
    pem: readonly(pem),
    subject: readonly(subject),
    setCSR,
    setSubject,
    generate,
    setSubjectAction
  }
})
