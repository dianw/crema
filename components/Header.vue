<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <nav class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center space-x-4">
        <button class="lg:hidden text-gray-600 hover:text-gray-900" @click="mobileSidebarToggle">
          <span class="text-xl">&#9776;</span>
        </button>
        <NuxtLink :to="{ name: 'index' }" class="text-2xl font-bold text-gray-900 hover:text-gray-700">
          crema
        </NuxtLink>
        <button class="hidden md:block text-gray-600 hover:text-gray-900" @click="sidebarMinimize">
          <span class="text-xl">&#9776;</span>
        </button>
      </div>
      <div class="flex items-center space-x-4">
        <NuxtLink
          v-if="!currentUser || !currentUser.displayName"
          :to="{ name: 'login' }"
          class="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Login
        </NuxtLink>
        <span v-else class="text-gray-700">
          {{ currentUser.displayName }}
        </span>
        <a
          href="https://github.com/dianw/crema"
          target="_blank"
          class="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <i class="fa fa-github text-lg"></i>
        </a>
      </div>
    </nav>
  </header>
</template>
<script setup lang="ts">
interface User {
  displayName?: string | null
  email?: string | null
  uid?: string
  [key: string]: any
}

interface Props {
  currentUser?: User | null
}

defineProps<Props>()

const sidebarToggle = (e: Event): void => {
  e.preventDefault()
  document.body.classList.toggle('sidebar-hidden')
}

const sidebarMinimize = (e: Event): void => {
  e.preventDefault()
  document.body.classList.toggle('sidebar-minimized')
}

const mobileSidebarToggle = (e: Event): void => {
  e.preventDefault()
  document.body.classList.toggle('sidebar-mobile-show')
}

const asideToggle = (e: Event): void => {
  e.preventDefault()
  document.body.classList.toggle('aside-menu-hidden')
}
</script>
