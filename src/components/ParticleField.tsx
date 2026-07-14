import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/* Full-viewport Three.js constellation background.
   Honors prefers-reduced-motion (renders a single static frame)
   and scales particle counts down on small screens. */

export default function ParticleField() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const isSmallScreen = window.innerWidth < 768

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )
    camera.position.z = 50

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    mount.appendChild(renderer.domElement)

    /* ---- Ambient star field ---- */
    const starCount = isSmallScreen ? 500 : 1200
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const r = 25 + Math.random() * 55
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      starPositions[i * 3 + 2] = r * Math.cos(phi)
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starMat = new THREE.PointsMaterial({
      color: 0xc8e0f0,
      size: 0.12,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    /* ---- Constellation nodes ---- */
    const nodeCount = isSmallScreen ? 90 : 220
    const nodePositions = new Float32Array(nodeCount * 3)
    const nodeOriginals = new Float32Array(nodeCount * 3)
    const nodeColors = new Float32Array(nodeCount * 3)

    const cyan = new THREE.Color(0x3ddbe8)
    const gold = new THREE.Color(0xf7b267)
    const white = new THREE.Color(0xd0eaf0)

    for (let i = 0; i < nodeCount; i++) {
      const r = 8 + Math.random() * 28
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      nodePositions[i * 3] = x
      nodePositions[i * 3 + 1] = y
      nodePositions[i * 3 + 2] = z
      nodeOriginals[i * 3] = x
      nodeOriginals[i * 3 + 1] = y
      nodeOriginals[i * 3 + 2] = z

      const t = Math.random()
      const color = t < 0.5 ? cyan : t < 0.8 ? white : gold
      nodeColors[i * 3] = color.r
      nodeColors[i * 3 + 1] = color.g
      nodeColors[i * 3 + 2] = color.b
    }

    const nodeGeo = new THREE.BufferGeometry()
    const nodePosAttr = new THREE.BufferAttribute(nodePositions, 3)
    nodeGeo.setAttribute('position', nodePosAttr)
    nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3))

    const nodeMat = new THREE.PointsMaterial({
      size: 0.35,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    })
    const nodes = new THREE.Points(nodeGeo, nodeMat)
    scene.add(nodes)

    /* ---- Connection lines ---- */
    const maxLines = 500
    const linePositions = new Float32Array(maxLines * 6)
    const lineColors = new Float32Array(maxLines * 6)
    const lineGeo = new THREE.BufferGeometry()
    const linePosAttr = new THREE.BufferAttribute(linePositions, 3)
    const lineColAttr = new THREE.BufferAttribute(lineColors, 3)
    lineGeo.setAttribute('position', linePosAttr)
    lineGeo.setAttribute('color', lineColAttr)
    lineGeo.setDrawRange(0, 0)

    const lineMat = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0.18,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const lines = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lines)

    const connectionThreshold = 11
    const connectionThresholdSq = connectionThreshold * connectionThreshold

    /* ---- Event handlers ---- */
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    if (!prefersReducedMotion) {
      window.addEventListener('mousemove', onMouseMove)
    }

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      if (prefersReducedMotion) renderFrame(0)
    }
    window.addEventListener('resize', onResize)

    /* ---- Render ---- */
    // New accent cyan #3ddbe8 in normalized RGB, for line tinting
    const lineR = 0.239
    const lineG = 0.859
    const lineB = 0.91

    const renderFrame = (t: number) => {
      // Gentle ambient rotation
      stars.rotation.y = t * 0.015
      stars.rotation.x = Math.sin(t * 0.07) * 0.03
      nodes.rotation.y = t * 0.012
      lines.rotation.y = t * 0.012

      // Mouse-reactive node positions
      const mx = mouseRef.current.x * 18
      const my = mouseRef.current.y * 14

      for (let i = 0; i < nodeCount; i++) {
        const ox = nodeOriginals[i * 3]
        const oy = nodeOriginals[i * 3 + 1]
        const oz = nodeOriginals[i * 3 + 2]

        // Organic wave motion
        const px = ox + Math.sin(t * 0.25 + oy * 0.08) * 0.6
        const py = oy + Math.cos(t * 0.18 + ox * 0.08) * 0.6
        const pz = oz + Math.sin(t * 0.2 + ox * 0.12) * 0.35

        // Mouse push-away
        const dx = px - mx
        const dy = py - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        const pushStrength = Math.max(0, 1 - dist / 14) * 3.5

        nodePositions[i * 3] = px + (dist > 0.01 ? (dx / dist) * pushStrength : 0)
        nodePositions[i * 3 + 1] = py + (dist > 0.01 ? (dy / dist) * pushStrength : 0)
        nodePositions[i * 3 + 2] = pz
      }
      nodePosAttr.needsUpdate = true

      // Update connection lines
      let lineCount = 0
      for (let i = 0; i < nodeCount && lineCount < maxLines; i++) {
        for (let j = i + 1; j < nodeCount && lineCount < maxLines; j++) {
          const ddx = nodePositions[i * 3] - nodePositions[j * 3]
          const ddy = nodePositions[i * 3 + 1] - nodePositions[j * 3 + 1]
          const ddz = nodePositions[i * 3 + 2] - nodePositions[j * 3 + 2]
          const distSq = ddx * ddx + ddy * ddy + ddz * ddz

          if (distSq < connectionThresholdSq) {
            const idx = lineCount * 6
            const alpha = 1 - Math.sqrt(distSq) / connectionThreshold

            linePositions[idx] = nodePositions[i * 3]
            linePositions[idx + 1] = nodePositions[i * 3 + 1]
            linePositions[idx + 2] = nodePositions[i * 3 + 2]
            linePositions[idx + 3] = nodePositions[j * 3]
            linePositions[idx + 4] = nodePositions[j * 3 + 1]
            linePositions[idx + 5] = nodePositions[j * 3 + 2]

            lineColors[idx] = lineR * alpha
            lineColors[idx + 1] = lineG * alpha
            lineColors[idx + 2] = lineB * alpha
            lineColors[idx + 3] = lineR * alpha
            lineColors[idx + 4] = lineG * alpha
            lineColors[idx + 5] = lineB * alpha

            lineCount++
          }
        }
      }
      linePosAttr.needsUpdate = true
      lineColAttr.needsUpdate = true
      lineGeo.setDrawRange(0, lineCount * 2)

      renderer.render(scene, camera)
    }

    const timer = new THREE.Timer()
    let frame = 0

    const animate = () => {
      frame = requestAnimationFrame(animate)
      timer.update()
      renderFrame(timer.getElapsed())
    }

    if (prefersReducedMotion) {
      renderFrame(0)
    } else {
      animate()
    }

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
      starGeo.dispose()
      starMat.dispose()
      nodeGeo.dispose()
      nodeMat.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="particle-field" aria-hidden="true" />
}
