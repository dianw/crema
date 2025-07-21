<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <div v-if="currentUser">
      <h1 class="text-3xl font-bold text-gray-900 flex items-center">
        <i class="fa fa-user mr-3"/>
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
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors flex items-center"
            @click="login('Google')"
          >
            <i class="fa fa-google mr-2"/>
            <span>Google</span>
          </button>
        </div>
        <div>
          <button
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors flex items-center"
            @click="login('Github')"
          >
            <i class="fa fa-github mr-2"/>
            <span>GitHub</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'

const authStore = useAuthStore()

const currentUser = computed((): User | null => authStore.currentUser)

const login = (provider: string): void => {
  authStore.login(provider)
}
</script>
