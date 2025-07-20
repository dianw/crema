<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <div v-if="currentUser">
      <h1 class="text-3xl font-bold text-gray-900 flex items-center">
        <i class="fa fa-user mr-3"></i>
        {{ currentUser.displayName }}
      </h1>
    </div>
    <div v-else>
      <h1 class="text-3xl font-bold text-gray-900 mb-6">
        Login with
      </h1>
      <div class="flex flex-wrap gap-4">
        <div>
          <button
            @click="login('Google')"
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors flex items-center"
          >
            <i class="fa fa-google mr-2"></i>
            <span>Google</span>
          </button>
        </div>
        <div>
          <button
            @click="login('Github')"
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors flex items-center"
          >
            <i class="fa fa-github mr-2"></i>
            <span>GitHub</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  displayName?: string | null
  email?: string | null
  uid?: string
  [key: string]: any
}

const authStore = useAuthStore()

const currentUser = computed((): User | null => authStore.currentUser)

const login = (provider: string): void => {
  authStore.login(provider)
}
</script>
