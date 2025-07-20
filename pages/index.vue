<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h1 class="text-6xl font-bold text-gray-900 mb-4">crema</h1>
    <h1 class="text-4xl font-semibold text-gray-700 mb-8">Graphical Crypto Toolkit</h1>

    <div class="flex flex-wrap gap-4">
      <div>
        <NuxtLink
          :to="{ name: 'hash' }"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block"
        >
          Hash Calculator
        </NuxtLink>
      </div>
      <div>
        <NuxtLink
          :to="{ name: 'public-key-infrastructure-rsa-keygen' }"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block"
        >
          RSA Key-Pair Generator
        </NuxtLink>
      </div>
      <div>
        <NuxtLink
          :to="{ name: 'public-key-infrastructure-cert-signing-req' }"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block"
        >
          Certificate Signing Request
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This page is purely template-based, no script logic needed
</script>
