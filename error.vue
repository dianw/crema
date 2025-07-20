<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-red-100">
          <Icon name="i-heroicons-exclamation-triangle" class="h-10 w-10 text-red-600" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Oops! Something went wrong
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Error {{ error.statusCode }}
        </p>
      </div>

      <div class="mt-8 space-y-4">
        <div class="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 class="text-sm font-medium text-red-800">
            {{ error.statusMessage || 'An unexpected error occurred' }}
          </h3>
          <div v-if="error.message" class="mt-2 text-sm text-red-700">
            {{ error.message }}
          </div>
        </div>

        <div class="flex flex-col space-y-2">
          <button
            @click="handleError"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Try Again
          </button>

          <NuxtLink
            to="/"
            class="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go Home
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}

const props = defineProps<Props>()

// Handle error retry
const handleError = () => {
  clearError({ redirect: '/' })
}

// Set page meta
useHead({
  title: `Error ${props.error.statusCode} - Crema`,
  meta: [
    { name: 'description', content: 'An error occurred in Crema - Graphical Crypto Toolkit' }
  ]
})
</script>
