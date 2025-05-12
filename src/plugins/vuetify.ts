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
    VRow: { dense: true }, // Apply dense to v-row as default
    VBtn: {
      style: 'text-transform: none; border-radius: 0; box-shadow: 3px 3px 0px #000000;'
    },
    VCard: {
      style: 'border: 2px solid #000000; border-radius: 0; box-shadow: 5px 5px 0px #000000;',
      class: 'y2k-card'  // Add a custom class to help with styling
    },
    VCardTitle: {
      class: 'y2k-card-title'  // Add a custom class
    },
    VTextField: {
      style: 'border-radius: 0; background-color: #FFFFFF; border: 2px solid #000000;'
    },
    VSelect: {
      style: 'border-radius: 0; background-color: #FFFFFF; border: 2px solid #000000;'
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
          primary: '#FF00FF', // Bright magenta/pink
          secondary: '#00FFFF', // Cyan
          tertiary: '#FFFF00', // Yellow
          accent: '#FF00AA', // Hot pink
          error: '#FF0000', // Red
          warning: '#FFA500', // Orange
          info: '#00FFFF', // Cyan
          success: '#00FF00', // Lime green
          surface: '#C0C0C0', // Silver (Windows 98 bg color)
          background: '#008080', // Teal (Windows 98 default)
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
