import { lazy, Suspense, useEffect, useState } from 'react'
import App from './App.tsx'

/* World3D pulls in the heavy Three.js scene; load it only when visited. */
const World3D = lazy(() => import('./World3D.tsx'))

/* Inline styles: the World3D stylesheet ships with the lazy chunk, so the
   loader can't depend on it. */
function WorldLoader() {
  return (
    <div
      style={{
        alignItems: 'center',
        color: '#7a9ba0',
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

  useEffect(() => {
    const onHash = () => {
      setPage(window.location.hash === '#/3d' ? '3d' : 'portfolio')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (page === '3d') {
    return (
      <Suspense fallback={<WorldLoader />}>
        <World3D />
      </Suspense>
    )
  }
  return <App />
}
