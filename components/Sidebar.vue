<template>
  <div class="w-64 bg-gray-800 min-h-screen">
    <nav class="p-4">
      <ul class="space-y-2">
        <li v-for="(item, index) in navItems" :key="index">
          <NuxtLink
            :to="item.to"
            class="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
            active-class="bg-gray-700 text-white"
          >
            <i :class="item.icon" class="w-5 h-5"></i>
            <span>{{ item.name }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script setup lang="ts">
interface NavItem {
  name: string
  to: { name: string }
  icon: string
}

interface Props {
  navItems: NavItem[]
}

defineProps<Props>()
</script>
