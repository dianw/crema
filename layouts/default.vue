<template>
  <div class="min-h-screen bg-gray-100">
    <Header :current-user="currentUser" />
    <div class="flex">
      <Sidebar :nav-items="nav" />
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
    <Footer/>
  </div>
</template>

<script setup lang="ts">
// Components are auto-imported in Nuxt 4
const authStore = useAuthStore()
const route = useRoute()

const currentUser = computed(() => authStore.currentUser)

const nav = [
  {
    name: 'Hash',
    to: { name: 'hash' },
    icon: 'fa fa-calculator'
  },
  {
    name: 'RSA KeyGen',
    to: { name: 'public-key-infrastructure-rsa-keygen' },
    icon: 'fa fa-shield'
  },
  {
    name: 'Cert Signing Request',
    to: { name: 'public-key-infrastructure-cert-signing-req' },
    icon: 'fa fa-id-card'
  }
]

onMounted(() => {
  authStore.isLoggedIn()
})
</script>
