// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // App configuration
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Crema - Graphical Crypto Toolkit',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Graphical Crypto Toolkit' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
          integrity: 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==',
          crossorigin: 'anonymous'
        }
      ]
    }
  },

  // CSS configuration
  css: [
    '~/assets/css/style.scss'
  ],

  // Modules
  modules: [
    '@nuxt/icon',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  // Plugin configuration
  plugins: [
    '~/plugins/firebase.client.ts',
    '~/plugins/route.client.ts'
  ],

  // Router configuration - updated for Nuxt 4
  router: {
    options: {
      hashMode: true
    }
  },

  // SSR configuration - completely disabled for client-side only
  ssr: false,

  // Nitro configuration for static generation
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true
    },
    // GitHub Pages requires trailing slash handling
    experimental: {
      wasm: false
    }
  },

  // Vite configuration
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Remove the additionalData that was causing conflicts
        }
      }
    }
  },

  // TypeScript configuration
  typescript: {
    typeCheck: false
  },

  // Compatibility date - updated for Nuxt 4
  compatibilityDate: '2025-01-01',

  // Future flags for Nuxt 4 features
  future: {
    compatibilityVersion: 4
  }
})
