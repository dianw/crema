<template>
  <footer class="bg-white border-t border-gray-200 px-6 py-4">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-2">
      <span class="text-gray-700 text-sm font-medium">
        Made by <a href="https://github.com/dianw" target="_blank" class="text-blue-600 hover:text-blue-800 font-medium">Dian Aditya</a> · {{ new Date().getFullYear() }}
      </span>
      <span class="text-gray-500 text-xs">
        All crypto operations run entirely in your browser. Nothing leaves your machine.
      </span>
    </div>
  </footer>
</template>
<script setup lang="ts">
// AppFooter component using Composition API
defineOptions({
  name: 'AppFooter'
})
</script>
