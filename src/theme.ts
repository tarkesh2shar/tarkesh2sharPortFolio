export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'theme'

export function getInitialTheme(): Theme {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark'
      ? 'dark'
      : 'light'
  } catch {
    return 'light'
  }
}
