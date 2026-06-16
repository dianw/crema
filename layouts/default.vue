<template>
  <div class="min-h-screen bg-gray-100">
    <Header :current-user="currentUser" />
    <div class="relative">
      <Sidebar :nav-items="nav" />
      <!-- Main content with responsive margin handled by CSS -->
      <main class="p-6 transition-all duration-300 ease-in-out">
        <slot />
      </main>
    </div>
    <Footer/>
  </div>
</template>

<script setup lang="ts">
// Components are auto-imported in Nuxt 4
const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const nav = [
  // --- DIGESTS ---
  { name: 'DIGESTS', isCategory: true },
  { name: 'Message Digests', to: { name: 'hash' }, icon: 'fa fa-calculator' },

  // --- PUBLIC KEY INFRASTRUCTURE ---
  { name: 'PUBLIC KEY INFRASTRUCTURE', isCategory: true },
  { name: 'RSA KeyGen', to: { name: 'public-key-infrastructure-rsa-keygen' }, icon: 'fa fa-shield' },
  { name: 'EC KeyGen', to: { name: 'public-key-infrastructure-ec-keygen' }, icon: 'fa fa-circle-nodes' },
  { name: 'Cert Signing Request', to: { name: 'public-key-infrastructure-cert-signing-req' }, icon: 'fa fa-id-card' },
  { name: 'Self-Signed Cert', to: { name: 'public-key-infrastructure-self-signed-cert' }, icon: 'fa fa-certificate' },
  { name: 'Certificate Viewer', to: { name: 'public-key-infrastructure-cert-viewer' }, icon: 'fa fa-magnifying-glass' },

  // --- ENCRYPTION ---
  { name: 'ENCRYPTION', isCategory: true },
  { name: 'AES Encrypt/Decrypt', to: { name: 'encryption-aes' }, icon: 'fa fa-lock' },
  { name: 'RSA Encrypt/Decrypt', to: { name: 'encryption-rsa-encrypt' }, icon: 'fa fa-key' },

  // --- SIGNING ---
  { name: 'SIGNING', isCategory: true },
  { name: 'Digital Signature', to: { name: 'signing-digital-signature' }, icon: 'fa fa-pen-to-square' },

  // --- ENCODING ---
  { name: 'ENCODING', isCategory: true },
  { name: 'Base64 Encoder/Decoder', to: { name: 'encoding-base64' }, icon: 'fa fa-file-code' },
  { name: 'Hex Converter', to: { name: 'encoding-hex' }, icon: 'fa fa-hashtag' },

  // --- UTILITIES ---
  { name: 'UTILITIES', isCategory: true },
  { name: 'Password Generator', to: { name: 'utilities-password-generator' }, icon: 'fa fa-dice' },
  { name: 'Random Generator', to: { name: 'utilities-random' }, icon: 'fa fa-shuffle' },
  { name: 'PBKDF2 Derivation', to: { name: 'utilities-pbkdf2' }, icon: 'fa fa-droplet' },
]

onMounted(() => {
  authStore.isLoggedIn()
})
</script>
