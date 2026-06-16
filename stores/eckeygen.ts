import { defineStore } from 'pinia'
import { pki, asn1, util, cipher, md, random } from 'node-forge'
import type { ECCurve, ECKeyPairData } from '~/types'

const ED25519_OID = '1.3.101.112'

function oidDer(): string {
  return (asn1.oidToDer(ED25519_OID) as any).getBytes() as string
}

function buildEd25519PrivateKeyAsn1(privateKeyBytes: Uint8Array): asn1.Asn1 {
  const algoSeq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, oidDer())
  ])
  const octetStr = asn1.create(
    asn1.Class.UNIVERSAL,
    asn1.Type.OCTETSTRING,
    false,
    String.fromCharCode(...Array.from(privateKeyBytes))
  )
  return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, '\x00'),
    algoSeq,
    octetStr
  ])
}

function buildEd25519PublicKeyAsn1(publicKeyBytes: Uint8Array): asn1.Asn1 {
  const algoSeq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, oidDer())
  ])
  return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
    algoSeq,
    asn1.create(
      asn1.Class.UNIVERSAL,
      asn1.Type.BITSTRING,
      false,
      '\x00' + String.fromCharCode(...Array.from(publicKeyBytes))
    )
  ])
}

function asn1ToPem(asn1Obj: asn1.Asn1, label: string): string {
  const der = (asn1.toDer(asn1Obj) as any).getBytes() as string
  const b64 = util.encode64(der)
  const lines = b64.match(/.{1,64}/g)?.join('\n') || b64
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----\n`
}

export const useEcKeygenStore = defineStore('eckeygen', () => {
  const curve = ref<ECCurve>('Ed25519')
  const curves: { label: string; value: ECCurve }[] = [
    { label: 'P-256 (prime256v1)', value: 'P-256' },
    { label: 'P-384', value: 'P-384' },
    { label: 'P-521', value: 'P-521' },
    { label: 'Ed25519', value: 'Ed25519' }
  ]
  const privateKeyPem = ref('')
  const publicKeyPem = ref('')
  const keyPairs = ref<ECKeyPairData[]>([])
  const errorMsg = ref('')

  const { $db, $storage, $serverTimestamp } = useNuxtApp()

  const setCurve = (c: ECCurve) => { curve.value = c }
  const setKeyPairs = (pairs: ECKeyPairData[]) => { keyPairs.value = pairs }

  const addKeyPair = (newKeyPair: ECKeyPairData) => {
    keyPairs.value.push(JSON.parse(JSON.stringify(newKeyPair)))
  }

  const generate = async (selectedCurve: ECCurve): Promise<{ privateKeyPem: string; publicKeyPem: string } | null> => {
    errorMsg.value = ''
    privateKeyPem.value = ''
    publicKeyPem.value = ''

    if (selectedCurve === 'Ed25519') {
      const { publicKey, privateKey } = pki.ed25519.generateKeyPair()
      const privAsn1 = buildEd25519PrivateKeyAsn1(privateKey)
      const pubAsn1 = buildEd25519PublicKeyAsn1(publicKey)
      privateKeyPem.value = asn1ToPem(privAsn1, 'PRIVATE KEY')
      publicKeyPem.value = asn1ToPem(pubAsn1, 'PUBLIC KEY')
      return { privateKeyPem: privateKeyPem.value, publicKeyPem: publicKeyPem.value }
    } else {
      errorMsg.value = `${selectedCurve} is not yet supported. Ed25519 is available.`
      return null
    }
  }

  const encryptPrivateKey = (password: string): string => {
    const salt = random.getBytesSync(8)
    const keyBytes = (md as any).sha256.create().update(password + salt).digest().getBytes()
    const iv = random.getBytesSync(16)
    const forgeCipher = (cipher as any).createCipher('AES-CBC', keyBytes.slice(0, 32))
    forgeCipher.start({ iv })
    forgeCipher.update(util.createBuffer(privateKeyPem.value))
    forgeCipher.finish()
    const encrypted = forgeCipher.output.getBytes()
    const combined = salt + iv + encrypted
    return util.encode64(combined)
  }

  const save = async ({ name, password }: { name: string; password: string; key: string }) => {
    const authStore = useAuthStore()
    const currentUser = authStore.currentUser as unknown

    if (!currentUser) {
      return null
    }

    // Encrypt private key with password
    const encrypted = encryptPrivateKey(password)

    // @ts-expect-error - Firebase types
    const keyPairsRef = $db.collection('keyPairs').doc()
    // @ts-expect-error - Firebase types
    const keyPairsStorageRef = $storage.ref().child(`key-pairs/${(currentUser as { uid: string }).uid}/${keyPairsRef.id}-${name}.pem`)

    await keyPairsStorageRef.putString(encrypted)
    const downloadUrl = await keyPairsStorageRef.getDownloadURL()

    await keyPairsRef.set({
      createdDate: $serverTimestamp(),
      storagePath: keyPairsStorageRef.fullPath,
      storageDownloadUrl: downloadUrl,
      name,
      uid: (currentUser as { uid: string }).uid,
      type: 'ec',
      curve: curve.value
    })

    await fetch()
    return keyPairsRef
  }

  const fetch = async () => {
    const authStore = useAuthStore()
    const currentUser = authStore.currentUser as unknown

    if (!currentUser) {
      return null
    }

    // @ts-expect-error - Firebase types
    const docs = await $db.collection('keyPairs')
      .where('uid', '==', (currentUser as { uid: string }).uid)
      .orderBy('createdDate', 'desc')
      .get()

    setKeyPairs([])
    docs.forEach((doc: unknown) => addKeyPair({
      id: (doc as { id: string }).id,
      data: (doc as { data(): unknown }).data()
    }))

    return docs
  }

  const deleteKeyPair = async (docId: string) => {
    // @ts-expect-error - Firebase types
    await $db.collection('keyPairs').doc(docId).delete()
    return fetch()
  }

  return {
    curve: readonly(curve),
    curves: readonly(curves),
    privateKeyPem: readonly(privateKeyPem),
    publicKeyPem: readonly(publicKeyPem),
    keyPairs: readonly(keyPairs),
    errorMsg: readonly(errorMsg),
    setCurve,
    setKeyPairs,
    addKeyPair,
    generate,
    save,
    fetch,
    delete: deleteKeyPair
  }
})
