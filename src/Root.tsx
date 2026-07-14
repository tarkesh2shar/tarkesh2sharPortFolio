import { lazy, Suspense, useEffect, useState } from 'react'
import App from './App.tsx'

/* World3D pulls in the heavy Three.js scene; load it only when visited. */
const World3D = lazy(() => import('./World3D.tsx'))

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
      <Suspense fallback={null}>
        <World3D />
      </Suspense>
    )
  }
  return <App />
}
