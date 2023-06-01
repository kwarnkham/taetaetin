import { LocalStorage, Quasar } from 'quasar'

export default async () => {

  const langIso = LocalStorage.getItem('language') || 'en-US'

  try {
    await import(
      /* webpackInclude: /(mm|en-US)\.js$/ */
      'quasar/lang/' + langIso
    ).then(lang => {
      Quasar.lang.set(lang.default)
    })
  }
  catch (err) {
    // Requested Quasar Language Pack does not exist,
    // let's not break the app, so catching error
  }
}
