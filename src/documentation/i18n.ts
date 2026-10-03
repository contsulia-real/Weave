import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const documentationLanguages = [
  {
    code: 'en',
    labelKey: 'docs.language.english',
  },
] as const

export type DocumentationLanguage = (typeof documentationLanguages)[number]['code']
export type DocumentationLanguagePreference = 'auto' | DocumentationLanguage

const supportedLanguages = new Set<DocumentationLanguage>(
  documentationLanguages.map(({ code }) => code),
)

export function detectDocumentationLanguage(): DocumentationLanguage {
  if (typeof navigator !== 'undefined') {
    for (const language of navigator.languages) {
      const base = language.toLowerCase().split('-')[0] as DocumentationLanguage
      if (supportedLanguages.has(base)) return base
    }
  }

  return 'en'
}

void i18n.use(initReactI18next).init({
  lng: detectDocumentationLanguage(),
  fallbackLng: 'en',
  supportedLngs: documentationLanguages.map(({ code }) => code),
  load: 'languageOnly',
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
        'docs.language': 'Language',
        'docs.language.auto': 'Auto detect',
        'docs.language.english': 'English',
        'docs.nav.overview': 'Overview',
        'docs.nav.gettingStarted': 'Getting Started',
        'docs.nav.installation': 'Installation',
        'docs.nav.weaveAZ': 'Weave A-Z',
        'docs.nav.foundation': 'Foundation',
        'docs.nav.layout': 'Layout',
        'docs.nav.contentActions': 'Content and actions',
        'docs.nav.formsStatus': 'Forms and status',
        'docs.nav.compositeUI': 'Composite UI',
        'docs.nav.themeApplication': 'Theme and application',
        'docs.nav.componentsApi': 'Components API',
        'docs.route.overview': 'Documentation',
        'docs.route.components': 'Components',
        'docs.route.placeholder': 'Documentation page framework',
        'docs.drawer.search': 'Search Weave',
      },
    },
  },
})

export default i18n
