module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Crema - Graphical Crypto Toolkit',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Graphical Crypto Toolkit' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    bodyAttrs: {
      class: 'header-fixed footer-fixed sidebar-fixed'
    }
  },

  css: [
    '~/assets/css/style.scss'
  ],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },

  modules: [
    '@nuxtjs/font-awesome'
  ],

  plugins: [
    '~/plugins/bootstrap-vue',
    '~/plugins/vue-no-ssr',
    '~/plugins/vuefire'
  ],

  router: {
    mode: 'hash'
  },

  type: 'spa',

  /*
  ** Build configuration
  */
  build: {
    vendor: [
      'node-forge',
      'bootstrap-vue',
      'firebase',
      'vue-no-ssr',
      'vuefire',
      '@nuxtjs/font-awesome'
    ],
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
