import { defineStore } from 'pinia'
import { pki } from 'node-forge'

interface KeyPairData {
  id: string
  data: unknown
}

export const useRsagenStore = defineStore('rsagen', () => {
  const keySize = ref<number>(2048)
  const keySizes = ref<number[]>([512, 1024, 2048, 4096])
  const keyPair = ref<unknown>(null)
  const keyPairs = ref<KeyPairData[]>([])

  const { $db, $storage, $serverTimestamp } = useNuxtApp()

  const addKeyPair = (newKeyPair: KeyPairData) => {
    keyPairs.value.push(JSON.parse(JSON.stringify(newKeyPair)))
  }

  const setKeySize = (size: number) => {
    keySize.value = size
  }

  const setKeyPair = (pair: unknown) => {
    keyPair.value = pair
  }

  const setKeyPairs = (pairs: KeyPairData[]) => {
    keyPairs.value = pairs
  }

  const deleteKeyPair = async (docId: string) => {
    // @ts-expect-error - Firebase types not available in this context
    await $db.collection('keyPairs').doc(docId).delete()
    return fetch()
  }

  const fetch = async () => {
    const authStore = useAuthStore()
    const currentUser = authStore.currentUser as unknown

    if (!currentUser) {
      return null
    }

    // @ts-expect-error - Firebase types not available in this context
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

  const generate = async (keySize: number) => {
    setKeyPair({})

    return new Promise((resolve, reject) => {
      pki.rsa.generateKeyPair({ bits: keySize, workers: 4 }, (err: unknown, keyPair: unknown) => {
        if (err) {
          reject(err)
        } else {
          resolve(keyPair)
        }
      })
    }).then((keyPair: unknown) => {
      setKeyPair(keyPair)
      return keyPair
    })
  }

  const save = async ({ name, password, key }: { name: string, password: string, key: string }) => {
    const authStore = useAuthStore()
    const currentUser = authStore.currentUser as unknown

    if (!currentUser) {
      return null
    }

    const privateKey = pki.privateKeyFromPem(key)
    const pem = pki.encryptRsaPrivateKey(privateKey, password)

    // @ts-expect-error - Firebase types not available in this context
    const keyPairsRef = $db.collection('keyPairs').doc()
    // @ts-expect-error - Firebase types not available in this context
    const keyPairsStorageRef = $storage.ref().child(`key-pairs/${(currentUser as { uid: string }).uid}/${keyPairsRef.id}-${name}.pem`)

    await keyPairsStorageRef.putString(pem)
    const downloadUrl = await keyPairsStorageRef.getDownloadURL()

    await keyPairsRef.set({
      createdDate: $serverTimestamp(),
      storagePath: keyPairsStorageRef.fullPath,
      storageDownloadUrl: downloadUrl,
      name,
      uid: (currentUser as { uid: string }).uid
    })

    await fetch()
    return keyPairsRef
  }

  return {
    keySize: readonly(keySize),
    keySizes: readonly(keySizes),
    keyPair: readonly(keyPair),
    keyPairs: readonly(keyPairs),
    addKeyPair,
    setKeySize,
    setKeyPair,
    setKeyPairs,
    delete: deleteKeyPair,
    fetch,
    generate,
    save
  }
})
