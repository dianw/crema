<template>
  <!-- Mobile overlay -->
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden sidebar-mobile-overlay"
    :class="{ 'hidden': !isMobileOpen }"
    @click="closeMobileSidebar"
  />

  <!-- Sidebar -->
  <div
    class="sidebar fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out lg:transform-none"
    :class="{
      'translate-x-0': isMobileOpen,
      '-translate-x-full lg:translate-x-0': !isMobileOpen,
      'lg:w-16': isMinimized,
      'lg:w-64': !isMinimized
    }"
  >
    <nav class="p-4">
      <ul class="space-y-2">
        <li v-for="(item, index) in navItems" :key="index">
          <NuxtLink
            :to="item.to"
            class="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors group"
            active-class="bg-gray-700 text-white"
            @click="handleNavClick"
          >
            <i :class="item.icon" class="w-5 h-5 flex-shrink-0"/>
            <span
              class="sidebar-text transition-opacity duration-300"
              :class="{ 'lg:opacity-0 lg:hidden': isMinimized }"
            >
              {{ item.name }}
            </span>
            <!-- Tooltip for minimized state -->
            <div
              v-if="isMinimized"
              class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-60 hidden lg:block"
            >
              {{ item.name }}
            </div>
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

defineOptions({
  name: 'AppSidebar'
})

defineProps<Props>()

// Reactive state for sidebar
const isMobileOpen = ref(false)
const isMinimized = ref(false)

// Watch for body class changes to sync with header toggle buttons
const updateSidebarState = () => {
  isMobileOpen.value = document.body.classList.contains('sidebar-mobile-show')
  isMinimized.value = document.body.classList.contains('sidebar-minimized')
}

// Close mobile sidebar
const closeMobileSidebar = () => {
  document.body.classList.remove('sidebar-mobile-show')
  isMobileOpen.value = false
}

// Handle navigation click (close mobile sidebar)
const handleNavClick = () => {
  // On mobile, close sidebar when navigating
  if (window.innerWidth < 1024) {
    closeMobileSidebar()
  }
}

// Listen for body class changes
onMounted(() => {
  // Initial state
  updateSidebarState()

  // Create a MutationObserver to watch for class changes on body
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        updateSidebarState()
      }
    })
  })

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  })

  // Cleanup observer on unmount
  onUnmounted(() => {
    observer.disconnect()
  })
})
</script>
