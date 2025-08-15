<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h1 class="text-6xl font-bold text-gray-900 mb-4">crema</h1>
    <h1 class="text-4xl font-semibold text-gray-700 mb-8">Graphical Crypto Toolkit</h1>

    <div class="flex flex-wrap gap-4">
      <div v-for="(item, index) in navItems" :key="index">
        <NuxtLink
          :to="item.to"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block"
        >
          <i :class="item.icon" class="w-5 h-5 flex-shrink-0"/>
          {{ item.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface NavItem {
  name: string
  to: string
  icon: string
}

const navItems = inject<NavItem[]>('navItems', [])
</script>
