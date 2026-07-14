import { useEffect, useRef } from 'react'

/* Top-of-page reading progress bar. Writes the transform directly via a
   ref inside a rAF-throttled scroll handler so scrolling never triggers
   React re-renders. */

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`
      }
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div
        ref={barRef}
        className="scroll-progress-bar"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
