import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import World3D from './World3D.tsx'

function Root() {
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

  return page === '3d' ? <World3D /> : <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
