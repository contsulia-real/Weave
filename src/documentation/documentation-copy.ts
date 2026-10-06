import type { TFunction } from 'i18next'

export function documentationCopy(t: TFunction, source: string): string {
  return t(source, {
    ns: 'copy',
    keySeparator: false,
    defaultValue: source,
  })
}
