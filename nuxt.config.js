import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode

  publicRuntimeConfig: {
    GEODE_URL: process.env.NODE_ENV == 'production' ? 'https://api.share-twin.com' : 'http://localhost:80',
    VIEWER_URL: process.env.NODE_ENV == 'production' ? 'wss://api.share-twin.com' : 'ws://localhost:80',
    SITE_URL: process.env.SITE_URL,
    SITE_BRANCH: process.env.NODE_ENV === 'production' ? process.env.SITE_BRANCH : '',
    NODE_ENV: process.env.NODE_ENV,
    recaptcha: {
      siteKey: process.env.RECAPTCHA_SITE_KEY
    }
  },

  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'ShareTwin_Front',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/axios'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/recaptcha'
  ],

  recaptcha: {
    version: 2,
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: colors.teal.darken1,
          secondary: colors.teal.lighten4,
          accent: colors.red.darken4
        }
      }
    },
    icons: { iconfont: 'mdi', values: { logo: { component: 'GeodeLogo' } } }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
