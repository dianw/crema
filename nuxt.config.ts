// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // App configuration
  app: {
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

  // Router configuration
  router: {
    options: {
      hashMode: true
    }
  },

  // SSR configuration (equivalent to mode: 'spa')
  ssr: false,

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

  // Compatibility date
  compatibilityDate: '2024-11-01'
})
