import { defineStore } from 'pinia'
// @ts-ignore
import { pki } from 'node-forge'

interface KeyPairData {
  id: string
  data: any
}

export const useRsagenStore = defineStore('rsagen', () => {
  const keySize = ref<number>(2048)
  const keySizes = ref<number[]>([512, 1024, 2048, 4096])
  const keyPair = ref<any>(null)
  const keyPairs = ref<KeyPairData[]>([])

  const { $db, $storage, $serverTimestamp } = useNuxtApp()

  const addKeyPair = (newKeyPair: KeyPairData) => {
    keyPairs.value.push(JSON.parse(JSON.stringify(newKeyPair)))
  }

  const setKeySize = (size: number) => {
    keySize.value = size
  }

  const setKeyPair = (pair: any) => {
    keyPair.value = pair
  }

  const setKeyPairs = (pairs: KeyPairData[]) => {
    keyPairs.value = pairs
  }

  const deleteKeyPair = async (docId: string) => {
    // @ts-ignore
    await $db.collection('keyPairs').doc(docId).delete()
    return fetch()
  }

  const fetch = async () => {
    const authStore = useAuthStore()
    const currentUser = authStore.currentUser as any

    if (!currentUser) {
      return null
    }

    // @ts-ignore
    const docs = await $db.collection('keyPairs')
      .where('uid', '==', currentUser.uid)
      .orderBy('createdDate', 'desc')
      .get()

    setKeyPairs([])
    docs.forEach((doc: any) => addKeyPair({
      id: doc.id,
      data: doc.data()
    }))

    return docs
  }

  const generate = async (keySize: number) => {
    setKeyPair({})

    return new Promise((resolve, reject) => {
      pki.rsa.generateKeyPair({ bits: keySize, workers: 4 }, (err: any, keyPair: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(keyPair)
        }
      })
    }).then((keyPair: any) => {
      setKeyPair(keyPair)
      return keyPair
    })
  }

  const save = async ({ name, password, key }: { name: string, password: string, key: string }) => {
    const authStore = useAuthStore()
    const currentUser = authStore.currentUser as any

    if (!currentUser) {
      return null
    }

    const privateKey = pki.privateKeyFromPem(key)
    const pem = pki.encryptRsaPrivateKey(privateKey, password)

    // @ts-ignore
    const keyPairsRef = $db.collection('keyPairs').doc()
    // @ts-ignore
    const keyPairsStorageRef = $storage.ref().child(`key-pairs/${currentUser.uid}/${keyPairsRef.id}-${name}.pem`)

    const snapshot = await keyPairsStorageRef.putString(pem)
    const downloadUrl = await keyPairsStorageRef.getDownloadURL()

    await keyPairsRef.set({
      createdDate: $serverTimestamp(),
      storagePath: keyPairsStorageRef.fullPath,
      storageDownloadUrl: downloadUrl,
      name,
      uid: currentUser.uid
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
