import { lazy, Suspense, useEffect, useState } from 'react'
import App from './App.tsx'
import { getInitialTheme, THEME_STORAGE_KEY, type Theme } from './theme.ts'

/* World3D pulls in the heavy Three.js scene; load it only when visited. */
const World3D = lazy(() => import('./World3D.tsx'))

/* Inline styles: the World3D stylesheet ships with the lazy chunk, so the
   loader can't depend on it. */
function WorldLoader() {
  return (
    <div
      style={{
        alignItems: 'center',
        color: 'var(--text-secondary)',
        display: 'flex',
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        fontSize: '0.85rem',
        height: '100vh',
        justifyContent: 'center',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
      }}
    >
      Entering the 3D world…
    </div>
  )
}

/* Hash-based page switch: #/3d shows the 3D world, anything else the portfolio. */

export default function Root() {
  const [page, setPage] = useState(
    window.location.hash === '#/3d' ? '3d' : 'portfolio',
  )
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // The theme still works if storage is unavailable.
    }
  }, [theme])

  useEffect(() => {
    const onHash = () => {
      setPage(window.location.hash === '#/3d' ? '3d' : 'portfolio')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  if (page === '3d') {
    return (
      <Suspense fallback={<WorldLoader />}>
        <World3D theme={theme} onToggleTheme={toggleTheme} />
      </Suspense>
    )
  }
  return <App theme={theme} onToggleTheme={toggleTheme} />
}
