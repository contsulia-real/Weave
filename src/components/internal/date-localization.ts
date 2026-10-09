import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { useWeaveDocument } from '../../renderers/dom/document-context'

const messages = {
  en: {
    chooseDate: 'Choose date',
    chooseColor: 'Choose color',
    chooseFiles: 'Choose files',
    dropFiles: 'Choose files or drag them here',
    dropFilesHint: 'Drop files here or click to browse',
    noFilesSelected: 'No files selected',
    changeFile: 'Click to change file',
    selectedFilesCount: '{count} files selected',
    clearInput: 'Clear input',
    clearSearch: 'Clear search',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    dragToAdjustNumber: 'Drag horizontally to adjust number',
    hexColor: 'Hex color',
    colorCode: 'Color code',
    changeColorFormat: 'Switch color format',
    copyColor: 'Copy color code',
    copiedColor: 'Color code copied',
    colorArea: 'Saturation and brightness',
    eyedropper: 'Pick color from screen',
    hue: 'Hue',
    alpha: 'Alpha',
    saturation: 'Saturation',
    lightness: 'Lightness',
    chooseDateTime: 'Choose date and time',
    chooseTime: 'Choose time',
    chooseWeek: 'Choose week',
    chooseHour: 'Hour',
    chooseMinute: 'Minute',
    chooseSecond: 'Second',
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
    pagination: 'Pagination',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    pageNumber: 'Page {page}',
  },
  'zh-CN': {
    chooseDate: '选择日期',
    chooseColor: '选择颜色',
    chooseFiles: '选择文件',
    dropFiles: '选择文件或拖拽至此',
    dropFilesHint: '将文件拖入此处，或点击选择',
    noFilesSelected: '尚未选择文件',
    changeFile: '点击更换文件',
    selectedFilesCount: '已选择 {count} 个文件',
    clearInput: '清除输入内容',
    clearSearch: '清除搜索内容',
    showPassword: '显示密码',
    hidePassword: '隐藏密码',
    dragToAdjustNumber: '左右拖动调整数值',
    hexColor: '十六进制颜色',
    colorCode: '颜色代码',
    changeColorFormat: '切换颜色格式',
    copyColor: '复制颜色代码',
    copiedColor: '已复制颜色代码',
    colorArea: '饱和度和亮度',
    eyedropper: '从屏幕拾取颜色',
    hue: '色相',
    alpha: '透明度',
    saturation: '饱和度',
    lightness: '明度',
    chooseDateTime: '选择日期和时间',
    chooseTime: '选择时间',
    chooseWeek: '选择周次',
    chooseHour: '小时',
    chooseMinute: '分钟',
    chooseSecond: '秒',
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
    pagination: '分页',
    previousPage: '上一页',
    nextPage: '下一页',
    pageNumber: '第 {page} 页',
  },
  'zh-TW': {
    chooseDate: '選擇日期',
    chooseColor: '選擇顏色',
    chooseFiles: '選擇檔案',
    dropFiles: '選擇檔案或拖曳至此',
    dropFilesHint: '將檔案拖入此處，或點擊選取',
    noFilesSelected: '尚未選擇檔案',
    changeFile: '點擊更換檔案',
    selectedFilesCount: '已選擇 {count} 個檔案',
    clearInput: '清除輸入內容',
    clearSearch: '清除搜尋內容',
    showPassword: '顯示密碼',
    hidePassword: '隱藏密碼',
    dragToAdjustNumber: '左右拖曳調整數值',
    hexColor: '十六進位顏色',
    colorCode: '顏色代碼',
    changeColorFormat: '切換顏色格式',
    copyColor: '複製顏色代碼',
    copiedColor: '已複製顏色代碼',
    colorArea: '飽和度和亮度',
    eyedropper: '從螢幕擷取顏色',
    hue: '色相',
    alpha: '透明度',
    saturation: '飽和度',
    lightness: '明度',
    chooseDateTime: '選擇日期和時間',
    chooseTime: '選擇時間',
    chooseWeek: '選擇週次',
    chooseHour: '小時',
    chooseMinute: '分鐘',
    chooseSecond: '秒',
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
    pagination: '分頁',
    previousPage: '上一頁',
    nextPage: '下一頁',
    pageNumber: '第 {page} 頁',
  },
  fr: {
    chooseDate: 'Choisir une date',
    chooseColor: 'Choisir une couleur',
    chooseFiles: 'Choisir des fichiers',
    dropFiles: 'Choisir des fichiers ou les glisser ici',
    dropFilesHint: 'Glisser des fichiers ici ou cliquer pour parcourir',
    noFilesSelected: 'Aucun fichier sélectionné',
    changeFile: 'Cliquer pour changer de fichier',
    selectedFilesCount: '{count} fichiers sélectionnés',
    clearInput: 'Effacer le champ',
    clearSearch: 'Effacer la recherche',
    showPassword: 'Afficher le mot de passe',
    hidePassword: 'Masquer le mot de passe',
    dragToAdjustNumber: 'Glisser horizontalement pour ajuster la valeur',
    hexColor: 'Couleur hexadécimale',
    colorCode: 'Code couleur',
    changeColorFormat: 'Changer le format de couleur',
    copyColor: 'Copier le code couleur',
    copiedColor: 'Code couleur copié',
    colorArea: 'Saturation et luminosité',
    eyedropper: 'Prélever une couleur à l’écran',
    hue: 'Teinte',
    alpha: 'Opacité',
    saturation: 'Saturation',
    lightness: 'Luminosité',
    chooseDateTime: 'Choisir une date et une heure',
    chooseTime: 'Choisir une heure',
    chooseWeek: 'Choisir une semaine',
    chooseHour: 'Heure',
    chooseMinute: 'Minute',
    chooseSecond: 'Seconde',
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
    pagination: 'Pagination',
    previousPage: 'Page précédente',
    nextPage: 'Page suivante',
    pageNumber: 'Page {page}',
  },
} as const

function documentLocale(ownerDocument: Document | null): string {
  return ownerDocument?.documentElement.lang || Intl.DateTimeFormat().resolvedOptions().locale
}

function subscribeToDocumentLocale(
  ownerDocument: Document | null,
  onChange: () => void,
): () => void {
  const Observer = ownerDocument?.defaultView?.MutationObserver
  if (ownerDocument === null || Observer === undefined) return () => {}

  const observer = new Observer(onChange)
  observer.observe(ownerDocument.documentElement, { attributes: true, attributeFilter: ['lang'] })
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
  const ownerDocument = useWeaveDocument()
  const inheritedLocale = useSyncExternalStore(
    useCallback((onChange) => subscribeToDocumentLocale(ownerDocument, onChange), [ownerDocument]),
    useCallback(() => documentLocale(ownerDocument), [ownerDocument]),
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
