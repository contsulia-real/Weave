export const documentationThemeColors = [
  { id: 'pink', labelKey: 'docs.theme.color.pink', seed: '#c2185b' },
  { id: 'red', labelKey: 'docs.theme.color.red', seed: '#d32f2f' },
  { id: 'deep-orange', labelKey: 'docs.theme.color.deepOrange', seed: '#e64a19' },
  { id: 'orange', labelKey: 'docs.theme.color.orange', seed: '#ef6c00' },
  { id: 'amber', labelKey: 'docs.theme.color.amber', seed: '#ff6f00' },
  { id: 'light-green', labelKey: 'docs.theme.color.lightGreen', seed: '#558b2f' },
  { id: 'green', labelKey: 'docs.theme.color.green', seed: '#388e3c' },
  { id: 'teal', labelKey: 'docs.theme.color.teal', seed: '#00796b' },
  { id: 'cyan', labelKey: 'docs.theme.color.cyan', seed: '#00838f' },
  { id: 'blue', labelKey: 'docs.theme.color.blue', seed: '#1976d2' },
  { id: 'indigo', labelKey: 'docs.theme.color.indigo', seed: '#303f9f' },
  { id: 'purple', labelKey: 'docs.theme.color.purple', seed: '#7b1fa2' },
] as const

export type DocumentationThemeColorId = (typeof documentationThemeColors)[number]['id']

export const defaultDocumentationThemeColor = documentationThemeColors[0]
