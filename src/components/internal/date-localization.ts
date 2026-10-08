import { useMemo, useSyncExternalStore } from 'react'

const messages = {
  en: {
    chooseDate: 'Choose date',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    clear: 'Clear',
    invalidDate: 'Invalid date',
  },
  'zh-CN': {
    chooseDate: '选择日期',
    previousMonth: '上个月',
    nextMonth: '下个月',
    clear: '清除',
    invalidDate: '无效日期',
  },
  'zh-TW': {
    chooseDate: '選擇日期',
    previousMonth: '上個月',
    nextMonth: '下個月',
    clear: '清除',
    invalidDate: '無效日期',
  },
  fr: {
    chooseDate: 'Choisir une date',
    previousMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    clear: 'Effacer',
    invalidDate: 'Date invalide',
  },
} as const

function documentLocale(): string {
  return (
    (typeof document === 'undefined' ? undefined : document.documentElement.lang) ||
    Intl.DateTimeFormat().resolvedOptions().locale
  )
}

function subscribeToDocumentLocale(onChange: () => void): () => void {
  if (typeof document === 'undefined') return () => {}

  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })
  return () => observer.disconnect()
}

function languageMessages(locale: string) {
  const language = locale.toLowerCase()
  if (language.startsWith('fr')) return messages.fr
  if (language.startsWith('zh')) {
    return /(?:^|[-])(tw|hk|mo|hant)(?:-|$)/i.test(locale) ? messages['zh-TW'] : messages['zh-CN']
  }
  return messages.en
}

export function useDateLocalization(override?: string) {
  const inheritedLocale = useSyncExternalStore(
    subscribeToDocumentLocale,
    documentLocale,
    () => 'en',
  )
  const locale = override ?? inheritedLocale

  return useMemo(() => {
    const weekdayFormatter = new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      timeZone: 'UTC',
      calendar: 'gregory',
    })
    const region = new Intl.Locale(locale) as Intl.Locale & {
      weekInfo?: { firstDay: number }
      getWeekInfo?: () => { firstDay: number }
    }
    const firstWeekday = (region.weekInfo?.firstDay ?? region.getWeekInfo?.().firstDay ?? 1) % 7

    return {
      locale,
      messages: languageMessages(locale),
      firstWeekday,
      weekdays: Array.from({ length: 7 }, (_, index) =>
        weekdayFormatter.format(
          new globalThis.Date(Date.UTC(2024, 0, 7 + ((firstWeekday + index) % 7))),
        ),
      ),
      monthFormatter: new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
        calendar: 'gregory',
      }),
      dayFormatter: new Intl.DateTimeFormat(locale, {
        dateStyle: 'full',
        timeZone: 'UTC',
        calendar: 'gregory',
      }),
    }
  }, [locale])
}
