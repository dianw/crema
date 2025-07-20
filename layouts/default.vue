<template>
  <div class="min-h-screen bg-gray-100">
    <AppHeader :current-user="currentUser" />
    <div class="flex">
      <Sidebar :nav-items="nav" />
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
    <AppFooter/>
  </div>
</template>

<script setup lang="ts">
import { Header as AppHeader, Sidebar, Footer as AppFooter } from '~/components/'

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
