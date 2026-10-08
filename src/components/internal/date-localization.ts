import { useMemo, useSyncExternalStore } from 'react'

const messages = {
  en: {
    chooseDate: 'Choose date',
    chooseMonth: 'Choose month',
    chooseYear: 'Choose year',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    previousYear: 'Previous year',
    nextYear: 'Next year',
    previousYears: 'Previous 12 years',
    nextYears: 'Next 12 years',
    clear: 'Clear',
    invalidDate: 'Invalid date',
  },
  'zh-CN': {
    chooseDate: '选择日期',
    chooseMonth: '选择月份',
    chooseYear: '选择年份',
    previousMonth: '上个月',
    nextMonth: '下个月',
    previousYear: '上一年',
    nextYear: '下一年',
    previousYears: '前12年',
    nextYears: '后12年',
    clear: '清除',
    invalidDate: '无效日期',
  },
  'zh-TW': {
    chooseDate: '選擇日期',
    chooseMonth: '選擇月份',
    chooseYear: '選擇年份',
    previousMonth: '上個月',
    nextMonth: '下個月',
    previousYear: '上一年',
    nextYear: '下一年',
    previousYears: '前12年',
    nextYears: '後12年',
    clear: '清除',
    invalidDate: '無效日期',
  },
  fr: {
    chooseDate: 'Choisir une date',
    chooseMonth: 'Choisir un mois',
    chooseYear: 'Choisir une année',
    previousMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    previousYear: 'Année précédente',
    nextYear: 'Année suivante',
    previousYears: '12 années précédentes',
    nextYears: '12 années suivantes',
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
      monthNameFormatter: new Intl.DateTimeFormat(locale, {
        month: 'long',
        timeZone: 'UTC',
        calendar: 'gregory',
      }),
      monthShortFormatter: new Intl.DateTimeFormat(locale, {
        month: 'short',
        timeZone: 'UTC',
        calendar: 'gregory',
      }),
      yearFormatter: new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        timeZone: 'UTC',
        calendar: 'gregory',
      }),
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
