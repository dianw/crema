<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h1 class="text-6xl font-bold text-gray-900 mb-4">crema</h1>
    <h1 class="text-4xl font-semibold text-gray-700 mb-8">Graphical Crypto Toolkit</h1>

    <!-- DIGESTS -->
    <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6 first:mt-0">Digests</h2>
    <div class="flex flex-wrap gap-4 mb-2">
      <NuxtLink :to="{ name: 'hash' }" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block">
        Message Digests
      </NuxtLink>
    </div>

    <!-- PUBLIC KEY INFRASTRUCTURE -->
    <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Public Key Infrastructure</h2>
    <div class="flex flex-wrap gap-4 mb-2">
      <NuxtLink :to="{ name: 'public-key-infrastructure-rsa-keygen' }" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block">
        RSA KeyGen
      </NuxtLink>
      <NuxtLink :to="{ name: 'public-key-infrastructure-ec-keygen' }" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block">
        EC KeyGen
      </NuxtLink>
      <NuxtLink :to="{ name: 'public-key-infrastructure-cert-signing-req' }" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block">
        Cert Signing Request
      </NuxtLink>
      <NuxtLink :to="{ name: 'public-key-infrastructure-self-signed-cert' }" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block">
        Self-Signed Cert
      </NuxtLink>
      <NuxtLink :to="{ name: 'public-key-infrastructure-cert-viewer' }" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block">
        Certificate Viewer
      </NuxtLink>
    </div>

    <!-- ENCRYPTION -->
    <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Encryption</h2>
    <div class="flex flex-wrap gap-4 mb-2">
      <NuxtLink :to="{ name: 'encryption-aes' }" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block">
        AES Encrypt/Decrypt
      </NuxtLink>
      <NuxtLink :to="{ name: 'encryption-rsa-encrypt' }" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block">
        RSA Encrypt/Decrypt
      </NuxtLink>
    </div>

    <!-- SIGNING -->
    <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Signing</h2>
    <div class="flex flex-wrap gap-4 mb-2">
      <NuxtLink :to="{ name: 'signing-digital-signature' }" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block">
        Digital Signature
      </NuxtLink>
    </div>

    <!-- ENCODING -->
    <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Encoding</h2>
    <div class="flex flex-wrap gap-4 mb-2">
      <NuxtLink :to="{ name: 'encoding-base64' }" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block">
        Base64 Encoder/Decoder
      </NuxtLink>
      <NuxtLink :to="{ name: 'encoding-hex' }" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block">
        Hex Converter
      </NuxtLink>
    </div>

    <!-- UTILITIES -->
    <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Utilities</h2>
    <div class="flex flex-wrap gap-4">
      <NuxtLink :to="{ name: 'utilities-password-generator' }" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block">
        Password Generator
      </NuxtLink>
      <NuxtLink :to="{ name: 'utilities-random' }" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block">
        Random Generator
      </NuxtLink>
      <NuxtLink :to="{ name: 'utilities-pbkdf2' }" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block">
        PBKDF2 Derivation
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// This page is purely template-based, no script logic needed
</script>
