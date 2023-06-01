import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import { LocalStorage } from 'quasar'

export default boot(({ app }) => {
  const i18n = createI18n({
    legacy: false,
    locale: LocalStorage.getItem('language') || 'en-US',
    globalInjection: true,
    messages,
    fallbackLocale: 'en-US'
  })

  // Set i18n instance on app
  app.use(i18n)
})
