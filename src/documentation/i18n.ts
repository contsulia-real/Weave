import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: {
        'docs.title': 'Weave',
        'docs.navigation': 'Documentation navigation',
        'docs.menu': 'Toggle navigation',
        'docs.search': 'Search documentation',
        'docs.theme': 'Theme mode',
        'docs.theme.system': 'System',
        'docs.theme.light': 'Light',
        'docs.theme.dark': 'Dark',
        'docs.nav.overview': 'Overview',
        'docs.nav.components': 'Components',
        'docs.route.overview': 'Documentation',
        'docs.route.components': 'Components',
        'docs.route.placeholder': 'Documentation page framework',
      },
    },
  },
})

export default i18n
