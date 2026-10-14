import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import websiteCopyTranslations from '../website/website-copy.json'
import { documentationTranslationResources } from './documentation-translations'
import copyTranslations from './locales/documentation-copy.json'

export const documentationLanguages = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'fr', label: 'Français' },
] as const

export type DocumentationLanguage = (typeof documentationLanguages)[number]['code']
export type DocumentationLanguagePreference = 'auto' | DocumentationLanguage

type CopyTranslation = {
  'zh-CN': string
  'zh-TW': string
  fr: string
}

const copyResources = {
  en: Object.fromEntries(Object.keys(copyTranslations).map((key) => [key, key])),
  'zh-CN': Object.fromEntries(
    Object.entries(copyTranslations).map(([key, value]) => [
      key,
      (value as CopyTranslation)['zh-CN'],
    ]),
  ),
  'zh-TW': Object.fromEntries(
    Object.entries(copyTranslations).map(([key, value]) => [
      key,
      (value as CopyTranslation)['zh-TW'],
    ]),
  ),
  fr: Object.fromEntries(
    Object.entries(copyTranslations).map(([key, value]) => [key, (value as CopyTranslation).fr]),
  ),
}

const websiteResources = {
  en: Object.fromEntries(Object.keys(websiteCopyTranslations).map((key) => [key, key])),
  'zh-CN': Object.fromEntries(
    Object.entries(websiteCopyTranslations).map(([key, value]) => [key, value['zh-CN']]),
  ),
  'zh-TW': Object.fromEntries(
    Object.entries(websiteCopyTranslations).map(([key, value]) => [key, value['zh-TW']]),
  ),
  fr: Object.fromEntries(
    Object.entries(websiteCopyTranslations).map(([key, value]) => [key, value.fr]),
  ),
}

const applyDocumentLanguage = (language: string | undefined) => {
  if (typeof document !== 'undefined' && language !== undefined) {
    document.documentElement.lang = language
  }
}

i18n.on('languageChanged', applyDocumentLanguage)

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: documentationLanguages.map(({ code }) => code),
    ns: ['translation', 'copy', 'website'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator'],
      caches: [],
    },
    resources: Object.fromEntries(
      documentationLanguages.map(({ code }) => [
        code,
        {
          translation: documentationTranslationResources[code],
          copy: copyResources[code],
          website: websiteResources[code],
        },
      ]),
    ),
  })
  .then(() => applyDocumentLanguage(i18n.resolvedLanguage))

export default i18n
