/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import colors from 'vuetify/util/colors'
import { fa, en, vi, zhHans, zhHant, ru } from 'vuetify/locale'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  defaults: {
    VRow: { dense: true },
    VBtn: {
      class: 'y2k-btn'
    },
    VCard: {
      class: 'y2k-card'
    },
    VCardTitle: {
      class: 'y2k-card-title'
    },
    VTextField: {
      class: 'y2k-text-field'
    },
    VSelect: {
      class: 'y2k-select'
    }
  },
  theme: {
    defaultTheme: 'y2k',
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
          tertiary: '#E57373',
          accent: '#005CAF',
          error: colors.red.accent3,
          warning: colors.amber.base,
          info: colors.teal.darken1,
          success: colors.green.base,
          background: colors.grey.lighten4,
        },
      },
      dark: {
        colors: {
          primary: colors.blue.darken4,
          secondary: colors.grey.darken3,
          accent: colors.pink.darken3,
          error: colors.red.accent3,
          warning: colors.amber.darken3,
          info: colors.teal.lighten1,
          success: colors.green.darken2,
          surface: colors.grey.darken3,
          background: colors.grey.darken4,
        },
      },
      y2k: {
        dark: false,
        colors: {
          primary: '#FF00FF',
          secondary: '#00FFFF',
          tertiary: '#FFFF00',
          accent: '#FF00AA',
          error: '#FF0000',
          warning: '#FFA500',
          info: '#00FFFF',
          success: '#00FF00',
          surface: '#C0C0C0',
          background: '#008080',
        },
      },
    },
  },
  locale: {
    locale: localStorage.getItem("locale") ?? 'en',
    fallback: 'en',
    messages: { en, fa, vi, zhHans, zhHant, ru },
  },
})
