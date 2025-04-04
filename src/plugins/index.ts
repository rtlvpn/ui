// Plugins
import vuetify from './vuetify'
import * as y2kEffects from './y2kEffects'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(vuetify)
  
  // Make Y2K effects globally available
  app.config.globalProperties.$y2k = y2kEffects
}
