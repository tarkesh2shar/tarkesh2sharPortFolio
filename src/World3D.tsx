import { ArrowUpRight, Moon, Sun } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  capabilitiesData,
  certifications,
  experienceData,
  githubEdges,
  links,
  projects,
} from './data'
import './World3D.css'
import type { Theme } from './theme'

/* ================================================================
   PLATFORM DEFINITIONS
   ================================================================ */

type Platform = {
  id: string
  label: string
  position: readonly [number, number, number]
  color: number
  camOffset: readonly [number, number, number]
}

const PLATFORMS: Platform[] = [
  { id: 'hub', label: 'Home', position: [0, 0, 0] as const, color: 0x3ddbe8, camOffset: [0, 7, 22] as const },
  { id: 'experience', label: 'Experience', position: [42, 0, -12] as const, color: 0x35c9d6, camOffset: [4, 11, 33] as const },
  { id: 'projects', label: 'Projects', position: [-32, 6, -38] as const, color: 0xf7b267, camOffset: [3, 9, 28] as const },
  { id: 'skills', label: 'Skills', position: [-42, -2, 18] as const, color: 0x39d2df, camOffset: [3, 9, 25] as const },
  { id: 'certs', label: 'Certifications', position: [28, 4, -36] as const, color: 0xf0a050, camOffset: [3, 9, 29] as const },
  { id: 'contact', label: 'Contact', position: [5, -4, 46] as const, color: 0x3ddbe8, camOffset: [2, 8, 25] as const },
]

const OVERVIEW = { position: new THREE.Vector3(0, 35, 75), lookAt: new THREE.Vector3(0, 0, 0) }

const WORLD_PALETTES = {
  dark: {
    background: 0x050a0f,
    base: 0x0a1620,
    text: '#e8f4f8',
    stars: 0xc8e0f0,
    cyan: 0x3ddbe8,
    cyanMid: 0x35c9d6,
    cyanAlt: 0x2bb8c6,
    gold: 0xf7b267,
    goldMid: 0xf0a050,
    ambient: 0x80a0c0,
    ambientIntensity: 0.5,
    sunIntensity: 0.6,
    pointIntensity: 15,
    starOpacity: 0.5,
    toneExposure: 1.15,
    fogDensity: 0.006,
    glowOpacity: 0.35,
    blending: THREE.AdditiveBlending,
  },
  light: {
    background: 0xf5f9fb,
    base: 0xd7e4e8,
    text: '#10222b',
    stars: 0x5a7c88,
    cyan: 0x0b7f8e,
    cyanMid: 0x1f8996,
    cyanAlt: 0x3b7780,
    gold: 0x9d640e,
    goldMid: 0xb27724,
    ambient: 0xffffff,
    ambientIntensity: 1.2,
    sunIntensity: 1.25,
    pointIntensity: 5,
    starOpacity: 0.25,
    toneExposure: 1,
    fogDensity: 0.0045,
    glowOpacity: 0.16,
    blending: THREE.NormalBlending,
  },
} as const

type WorldPalette = (typeof WORLD_PALETTES)[Theme]

function platformColor(platform: Platform, palette: WorldPalette) {
  if (platform.id === 'projects') return palette.gold
  if (platform.id === 'certs') return palette.goldMid
  if (platform.id === 'experience') return palette.cyanMid
  if (platform.id === 'skills') return palette.cyanAlt
  return palette.cyan
}

function colorToRgb(color: number) {
  return `rgb(${(color >> 16) & 255}, ${(color >> 8) & 255}, ${color & 255})`
}

/* ================================================================
   TEXT SPRITE HELPER
   ================================================================ */

function createTextSprite(
  text: string,
  palette: WorldPalette,
  scale = 10,
  glow = `#${palette.cyan.toString(16).padStart(6, '0')}`,
): THREE.Sprite {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = 1024
  canvas.height = 256
  ctx.clearRect(0, 0, 1024, 256)
  ctx.font = '600 76px "Space Grotesk", "Inter", sans-serif'
  ctx.fillStyle = palette.text
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = glow
  ctx.shadowBlur = 28
  ctx.fillText(text.toUpperCase(), 512, 128)
  ctx.shadowBlur = 0
  ctx.fillText(text.toUpperCase(), 512, 128)
  const tex = new THREE.CanvasTexture(canvas)
  tex.minFilter = THREE.LinearFilter
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.9, depthTest: false })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(scale, scale * 0.25, 1)
  sprite.userData.isLabel = true
  return sprite
}

/* Soft radial glow texture, used for platform under-glows, nebula
   backdrops, and the pulses that travel the light paths. */
function createGlowTexture(color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  grad.addColorStop(0, color)
  grad.addColorStop(0.4, color.replace(')', ', 0.35)').replace('rgb', 'rgba'))
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(canvas)
}

/* Orbit ring + under-glow shared by every platform so the islands read
   as lit objects instead of unlit primitives floating in the void. */
function addPlatformGlow(
  group: THREE.Group,
  radius: number,
  color: number,
  palette: WorldPalette,
  y = 0.35,
) {
  const hex = `#${color.toString(16).padStart(6, '0')}`

  const ringPts = new THREE.EllipseCurve(0, 0, radius + 0.5, radius + 0.5, 0, Math.PI * 2).getPoints(72)
  const ring = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(ringPts),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.45, blending: palette.blending, depthWrite: false }),
  )
  ring.rotation.x = -Math.PI / 2
  ring.position.y = y
  group.add(ring)

  const glowMat = new THREE.SpriteMaterial({
    map: createGlowTexture(`rgb(${(color >> 16) & 255}, ${(color >> 8) & 255}, ${color & 255})`),
    color: hex,
    transparent: true,
    opacity: palette.glowOpacity,
    blending: palette.blending,
    depthWrite: false,
  })
  const glow = new THREE.Sprite(glowMat)
  glow.scale.setScalar(radius * 4)
  glow.position.y = -1.5
  group.add(glow)

  return ring
}

/* ================================================================
   PLATFORM BUILDERS — return animatable objects
   ================================================================ */

function buildHub(group: THREE.Group, palette: WorldPalette) {
  // Hex base
  const baseMat = new THREE.MeshStandardMaterial({ color: palette.base, emissive: palette.cyan, emissiveIntensity: 0.14, metalness: 0.8, roughness: 0.3 })
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 0.5, 6), baseMat))
  addPlatformGlow(group, 7, palette.cyan, palette)

  // Core icosahedron (wireframe)
  const coreMat = new THREE.MeshStandardMaterial({ color: palette.cyan, emissive: palette.cyan, emissiveIntensity: 0.3, wireframe: true, transparent: true, opacity: 0.75 })
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2, 1), coreMat)
  core.position.y = 4
  group.add(core)

  // Inner solid
  const innerMat = new THREE.MeshStandardMaterial({ color: palette.cyanAlt, emissive: palette.cyan, emissiveIntensity: 0.2, metalness: 0.5, roughness: 0.4 })
  const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 1), innerMat)
  inner.position.y = 4
  group.add(inner)

  // Orbital rings
  const ringMat = new THREE.LineBasicMaterial({ color: palette.gold, transparent: true, opacity: 0.45 })
  const rings: THREE.LineLoop[] = []
  for (let i = 0; i < 3; i++) {
    const pts = new THREE.EllipseCurve(0, 0, 4 + i * 0.9, 4 + i * 0.9, 0, Math.PI * 2).getPoints(100)
    const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), ringMat.clone())
    ring.rotation.x = i * 0.7 + 0.8
    ring.rotation.y = i * 0.5
    ring.position.y = 4
    group.add(ring)
    rings.push(ring)
  }

  const label = createTextSprite('Tushar Pant', palette)
  label.position.y = 9
  group.add(label)

  return { core, inner, rings }
}

function buildExperience(group: THREE.Group, palette: WorldPalette) {
  const baseMat = new THREE.MeshStandardMaterial({ color: palette.base, emissive: palette.cyanMid, emissiveIntensity: 0.12, metalness: 0.8, roughness: 0.3 })
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 0.4, 6), baseMat))
  addPlatformGlow(group, 9, palette.cyanMid, palette)

  const companies = [
    { h: 9, c: palette.cyan, x: -6 },
    { h: 4.5, c: palette.cyanAlt, x: -3 },
    { h: 6, c: palette.cyanMid, x: 0 },
    { h: 2.5, c: palette.cyanAlt, x: 3 },
    { h: 7, c: palette.cyan, x: 6 },
  ]
  const pillars: THREE.Mesh[] = []
  companies.forEach(({ h, c, x }) => {
    const mat = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.32, metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.6 })
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, h, 8), mat)
    pillar.position.set(x, h / 2 + 0.2, 0)
    group.add(pillar)
    pillars.push(pillar)
    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 1.6), mat.clone())
    ;(cap.material as THREE.MeshStandardMaterial).opacity = 1
    cap.position.set(x, h + 0.35, 0)
    group.add(cap)
  })

  const label = createTextSprite('Experience', palette)
  label.position.y = 12
  group.add(label)
  return { pillars }
}

function buildProjects(group: THREE.Group, palette: WorldPalette) {
  const positions = [
    { x: 0, y: 2, z: 0, s: 1.6 },
    { x: 3.5, y: 1, z: 2, s: 1.3 },
    { x: -3, y: 3.5, z: -1.5, s: 1.1 },
    { x: 2.5, y: -0.5, z: -3, s: 1.4 },
    { x: -4, y: 0.5, z: 2.5, s: 1 },
    { x: 1.5, y: 4, z: -2, s: 1.2 },
  ]
  addPlatformGlow(group, 6, palette.gold, palette, -1)
  const cubes: THREE.Mesh[] = []
  const wires: THREE.Mesh[] = []
  positions.forEach(({ x, y, z, s }) => {
    const mat = new THREE.MeshStandardMaterial({ color: palette.gold, emissive: palette.gold, emissiveIntensity: 0.5, metalness: 0.4, roughness: 0.5, transparent: true, opacity: 0.8 })
    const cube = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), mat)
    cube.position.set(x, y, z)
    cube.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2)
    group.add(cube)
    cubes.push(cube)
    const wireMat = new THREE.MeshBasicMaterial({ color: palette.gold, wireframe: true, transparent: true, opacity: 0.4 })
    const wire = new THREE.Mesh(new THREE.BoxGeometry(s * 1.2, s * 1.2, s * 1.2), wireMat)
    wire.position.copy(cube.position)
    wire.rotation.copy(cube.rotation)
    group.add(wire)
    wires.push(wire)
  })

  const label = createTextSprite('Projects', palette, 10, `#${palette.gold.toString(16).padStart(6, '0')}`)
  label.position.y = 8
  group.add(label)
  return { cubes, wires }
}

function buildSkills(group: THREE.Group, palette: WorldPalette) {
  const baseMat = new THREE.MeshStandardMaterial({ color: palette.base, emissive: palette.cyanAlt, emissiveIntensity: 0.1, metalness: 0.8, roughness: 0.3 })
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 0.3, 6), baseMat))
  addPlatformGlow(group, 6, palette.cyanAlt, palette)

  const nodes = [
    { x: 0, y: 2.5, z: 0, s: 1.2, c: palette.cyan },
    { x: 3.5, y: 2, z: 1, s: 0.85, c: palette.cyanAlt },
    { x: -2.5, y: 3.5, z: 1.5, s: 0.75, c: palette.cyanMid },
    { x: 2.5, y: 4, z: -2.5, s: 0.65, c: palette.gold },
    { x: -3.5, y: 1.5, z: -1.5, s: 0.75, c: palette.cyanAlt },
    { x: 1.5, y: 0.8, z: 3, s: 0.65, c: palette.cyanMid },
  ]
  const spheres: THREE.Mesh[] = []
  nodes.forEach(({ x, y, z, s, c }) => {
    const mat = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.45, metalness: 0.3, roughness: 0.5 })
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(s, 16, 16), mat)
    sphere.position.set(x, y, z)
    sphere.userData.baseScale = s
    group.add(sphere)
    spheres.push(sphere)
  })

  const conns = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [3, 4]]
  conns.forEach(([a, b]) => {
    const pts = [new THREE.Vector3(nodes[a].x, nodes[a].y, nodes[a].z), new THREE.Vector3(nodes[b].x, nodes[b].y, nodes[b].z)]
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: palette.cyan, transparent: true, opacity: 0.35, blending: palette.blending, depthWrite: false })))
  })

  const label = createTextSprite('Skills', palette)
  label.position.y = 7
  group.add(label)
  return { spheres }
}

function buildCerts(group: THREE.Group, palette: WorldPalette) {
  const baseMat = new THREE.MeshStandardMaterial({ color: palette.base, emissive: palette.goldMid, emissiveIntensity: 0.1, metalness: 0.8, roughness: 0.3 })
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 0.3, 6), baseMat))
  addPlatformGlow(group, 8, palette.goldMid, palette)

  const obelisks = [
    { x: -5, h: 5.5, c: palette.gold, z: 0.8 },
    { x: -2.5, h: 3.8, c: palette.goldMid, z: -1 },
    { x: 0, h: 4.8, c: palette.gold, z: 0.4 },
    { x: 2.5, h: 3.2, c: palette.goldMid, z: -0.8 },
    { x: 5, h: 4.2, c: palette.gold, z: 0.6 },
    { x: 7.5, h: 3.6, c: palette.goldMid, z: -0.4 },
  ]
  obelisks.forEach(({ x, h, c, z }) => {
    const mat = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.5, metalness: 0.5, roughness: 0.3, transparent: true, opacity: 0.85 })
    const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 0), mat)
    mesh.position.set(x, h / 2 + 0.5, z)
    mesh.scale.set(1, h / 1.6, 1)
    group.add(mesh)
    const wire = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.98, 0),
      new THREE.MeshBasicMaterial({ color: c, wireframe: true, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false }),
    )
    wire.position.copy(mesh.position)
    wire.scale.copy(mesh.scale)
    group.add(wire)
  })

  const label = createTextSprite('Certifications', palette, 12, `#${palette.goldMid.toString(16).padStart(6, '0')}`)
  label.position.y = 8
  group.add(label)
  return {}
}

function buildContact(group: THREE.Group, palette: WorldPalette) {
  const baseMat = new THREE.MeshStandardMaterial({ color: palette.base, emissive: palette.cyan, emissiveIntensity: 0.1, metalness: 0.8, roughness: 0.3 })
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 0.3, 8), baseMat))
  addPlatformGlow(group, 5, palette.cyan, palette)

  // Tower
  const towerMat = new THREE.MeshStandardMaterial({ color: palette.cyanMid, emissive: palette.cyan, emissiveIntensity: 0.3, metalness: 0.6, roughness: 0.3 })
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.4, 7, 8), towerMat)
  tower.position.set(0, 3.7, 0)
  group.add(tower)

  // Cone top
  const coneMat = new THREE.MeshStandardMaterial({ color: palette.gold, emissive: palette.gold, emissiveIntensity: 0.6, metalness: 0.5, roughness: 0.3 })
  const cone = new THREE.Mesh(new THREE.ConeGeometry(1, 2.5, 8), coneMat)
  cone.position.set(0, 8.5, 0)
  group.add(cone)

  // Signal rings
  const signalRings: THREE.Mesh[] = []
  for (let i = 0; i < 3; i++) {
    const ringMat = new THREE.MeshBasicMaterial({ color: palette.cyan, transparent: true, opacity: 0.25 - i * 0.06, side: THREE.DoubleSide })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.5 + i * 1.8, 0.04, 8, 48), ringMat)
    ring.position.y = 7
    ring.rotation.x = Math.PI / 2
    ring.userData.baseRadius = 2.5 + i * 1.8
    ring.userData.phaseOffset = i * 0.33
    group.add(ring)
    signalRings.push(ring)
  }

  const label = createTextSprite('Contact', palette)
  label.position.y = 12
  group.add(label)
  return { signalRings }
}

/* ================================================================
   CONTENT PANELS
   ================================================================ */

function HubPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <button className="panel-close" onClick={onClose}>✕</button>
      <h2>Tushar Pant</h2>
      <span className="panel-subtitle">Full Stack MERN Developer</span>
      <p className="panel-bio">
        React, Node.js, CSS, Flutter, and hardware curiosity brought together for
        fast-moving products, practical interfaces, and systems that can actually ship.
        Outside code, he makes philosophy content under the tarkesh2shar identity.
      </p>
      <p className="panel-bio">
        Pragmatic, project-driven developer with a front-end core, backend range, and
        a philosophy channel on the side. Currently sharpening Kubernetes, Postgres, and
        neural-net fundamentals.
      </p>
      <div className="panel-links">
        <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
        <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href={links.youtube} target="_blank" rel="noreferrer">YouTube</a>
        <a href={links.email}>Email</a>
        <a href={links.resume} download>Resume</a>
        <a href={links.instagram} target="_blank" rel="noreferrer">Instagram</a>
      </div>
    </>
  )
}

function ExperiencePanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <button className="panel-close" onClick={onClose}>✕</button>
      <h2>Experience</h2>
      <div className="panel-scroll">
        {experienceData.map((item) => (
          <div className="panel-card" key={item.company}>
            <span className="panel-tag">{item.company}</span>
            <h3>{item.role}</h3>
            <p className="panel-meta">{item.period} · {item.mode}</p>
            <p>{item.summary}</p>
            <ul>{item.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
            <div className="panel-tags">
              {item.stack.map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function ProjectsPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <button className="panel-close" onClick={onClose}>✕</button>
      <h2>Projects</h2>
      <div className="panel-scroll">
        {projects.map((p) => (
          <div className="panel-card" key={p.name}>
            <span className="panel-tag gold">{p.signal}</span>
            <h3>{p.name}</h3>
            <p className="panel-meta">{p.period}</p>
            <p>{p.summary}</p>
            <div className="panel-tags">
              {p.stack.map((t) => <span key={t}>{t}</span>)}
            </div>
            <a className="panel-project-link" href={p.url} target="_blank" rel="noreferrer">
              Open project <ArrowUpRight size={14} />
            </a>
          </div>
        ))}
        <h2 style={{ marginTop: 24 }}>GitHub Edge</h2>
        {githubEdges.map((r) => (
          <div className="panel-card" key={r.name}>
            <span className="panel-tag">{r.label}</span>
            <h3>{r.name}</h3>
            <p>{r.summary}</p>
            <div className="panel-tags">
              {r.stack.map((t) => <span key={t}>{t}</span>)}
            </div>
            <a className="panel-project-link" href={r.url} target="_blank" rel="noreferrer">
              View repo <ArrowUpRight size={14} />
            </a>
          </div>
        ))}
      </div>
    </>
  )
}

function SkillsPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <button className="panel-close" onClick={onClose}>✕</button>
      <h2>How I Work</h2>
      <p className="panel-bio">
        Frontend clarity, backend practicality, systems curiosity. The useful thing
        about a builder who has touched web, mobile, and hardware is pattern
        recognition.
      </p>
      <div className="panel-scroll">
        {capabilitiesData.map((c) => (
          <div className="panel-card" key={c.title}>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
          </div>
        ))}
      </div>
    </>
  )
}

function CertsPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <button className="panel-close" onClick={onClose}>✕</button>
      <h2>Certifications</h2>
      <div className="panel-scroll">
        {certifications.map((c) => (
          <div className="panel-card" key={c.name}>
            <span className="panel-tag gold">{c.issuer}</span>
            <h3>{c.name}</h3>
            <p className="panel-meta">{c.issued}</p>
            <p>{c.note}</p>
          </div>
        ))}
      </div>
    </>
  )
}

function ContactPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <button className="panel-close" onClick={onClose}>✕</button>
      <h2>Get in Touch</h2>
      <p className="panel-bio">
        Have a product, prototype, or difficult interface to build? Send the problem.
        I like work that needs taste, persistence, and enough engineering humility to
        keep asking better questions.
      </p>
      <div className="panel-links">
        <a href={links.email}>Email Tushar</a>
        <a href={links.resume} download>Download Resume</a>
        <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
        <a href={links.youtube} target="_blank" rel="noreferrer">YouTube</a>
        <a href={links.instagram} target="_blank" rel="noreferrer">Instagram</a>
      </div>
    </>
  )
}

function PanelContent({ id, onClose }: { id: string; onClose: () => void }) {
  switch (id) {
    case 'hub': return <HubPanel onClose={onClose} />
    case 'experience': return <ExperiencePanel onClose={onClose} />
    case 'projects': return <ProjectsPanel onClose={onClose} />
    case 'skills': return <SkillsPanel onClose={onClose} />
    case 'certs': return <CertsPanel onClose={onClose} />
    case 'contact': return <ContactPanel onClose={onClose} />
    default: return null
  }
}

/* ================================================================
   WORLD 3D — Main Component
   ================================================================ */

export default function World3D({
  theme,
  onToggleTheme,
}: {
  theme: Theme
  onToggleTheme: () => void
}) {
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const focusedRef = useRef<string | null>(null)
  const [webglFailed, setWebglFailed] = useState(() => {
    try {
      const probe = document.createElement('canvas')
      return !(probe.getContext('webgl2') || probe.getContext('webgl'))
    } catch {
      return true
    }
  })
  const isTouch = window.matchMedia('(pointer: coarse)').matches

  // Refs for imperative Three.js communication
  const cameraAnim = useRef({
    active: false,
    position: OVERVIEW.position.clone(),
    lookAt: OVERVIEW.lookAt.clone(),
  })
  const controlsRef = useRef<OrbitControls | null>(null)
  const flyToRef = useRef<(id: string) => void>(() => {})
  const flyToOverviewRef = useRef<() => void>(() => {})

  /* ---- flyTo / flyToOverview ---- */
  const flyTo = useCallback((platformId: string) => {
    const def = PLATFORMS.find((p) => p.id === platformId)
    if (!def) return
    const pos = new THREE.Vector3(...def.position)
    const offset = new THREE.Vector3(...def.camOffset)
    const camPos = pos.clone().add(offset)
    // Aim at the structure's mid-height, panned toward camera-right so the
    // platform sits left of center, clear of the content panel
    const dir = pos.clone().sub(camPos).normalize()
    const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize()
    // Pan further right on narrow viewports, where the panel covers more
    // of the canvas
    const panelFraction = Math.min(430, window.innerWidth * 0.46) / window.innerWidth
    const pan = 4 + panelFraction * 12
    const lookAt = pos.clone().add(right.multiplyScalar(pan)).add(new THREE.Vector3(0, 3, 0))
    cameraAnim.current = { active: true, position: camPos, lookAt }
    if (controlsRef.current) controlsRef.current.autoRotate = false
    setFocused(platformId)
  }, [])

  const flyToOverview = useCallback(() => {
    cameraAnim.current = { active: true, position: OVERVIEW.position.clone(), lookAt: OVERVIEW.lookAt.clone() }
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    setFocused(null)
  }, [])

  // Keep refs current
  useEffect(() => {
    flyToRef.current = flyTo
    flyToOverviewRef.current = flyToOverview
  }, [flyTo, flyToOverview])

  useEffect(() => {
    focusedRef.current = focused
  }, [focused])

  /* ---- Three.js setup ---- */
  useEffect(() => {
    const mount = canvasRef.current
    if (!mount) return
    const palette = WORLD_PALETTES[theme]
    const hasFocusedPlatform = focusedRef.current !== null
    const initialPosition = hasFocusedPlatform
      ? cameraAnim.current.position.clone()
      : OVERVIEW.position.clone()
    const initialTarget = hasFocusedPlatform
      ? cameraAnim.current.lookAt.clone()
      : OVERVIEW.lookAt.clone()
    cameraAnim.current.active = false

    // Scene
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(palette.background, palette.fogDensity)

    // Camera
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 500)
    camera.position.copy(initialPosition)

    // Renderer — WebGL can be unavailable (old GPU, disabled); fail gracefully
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
    } catch {
      // Rare: context creation failed despite the support probe
      queueMicrotask(() => setWebglFailed(true))
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(palette.background)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = palette.toneExposure
    mount.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.copy(initialTarget)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minDistance = 12
    controls.maxDistance = 120
    controls.autoRotate = !hasFocusedPlatform && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    controls.autoRotateSpeed = 0.35
    controls.maxPolarAngle = Math.PI * 0.85
    controls.update()
    controlsRef.current = controls
    if (import.meta.env.DEV) {
      ;(window as unknown as Record<string, unknown>).__world3dDebug = { camera, controls, cameraAnim }
    }

    // Lighting
    scene.add(new THREE.AmbientLight(palette.ambient, palette.ambientIntensity))
    const sunLight = new THREE.DirectionalLight(0xffffff, palette.sunIntensity)
    sunLight.position.set(20, 40, 30)
    scene.add(sunLight)

    // Per-platform point lights
    PLATFORMS.forEach((def) => {
      const light = new THREE.PointLight(platformColor(def, palette), palette.pointIntensity, 30)
      light.position.set(def.position[0], def.position[1] + 6, def.position[2])
      scene.add(light)
    })

    // Star field
    const starCount = 2500
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const r = 40 + Math.random() * 160
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      starPositions[i * 3 + 2] = r * Math.cos(phi)
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
      color: palette.stars, size: 0.22, transparent: true, opacity: palette.starOpacity, sizeAttenuation: true, blending: palette.blending, depthWrite: false,
    }))
    scene.add(stars)

    // Nebula backdrops — huge soft glows that give the void some color depth
    const nebulae: Array<{ pos: [number, number, number]; scale: number; color: string; opacity: number }> = [
      { pos: [0, -25, -50], scale: 240, color: colorToRgb(palette.cyan), opacity: theme === 'light' ? 0.025 : 0.05 },
      { pos: [-60, 15, -80], scale: 190, color: colorToRgb(palette.gold), opacity: theme === 'light' ? 0.02 : 0.04 },
      { pos: [70, -5, 30], scale: 170, color: colorToRgb(palette.cyanAlt), opacity: theme === 'light' ? 0.022 : 0.045 },
    ]
    nebulae.forEach(({ pos, scale, color, opacity }) => {
      const mat = new THREE.SpriteMaterial({
        map: createGlowTexture(color), transparent: true, opacity,
        blending: palette.blending, depthWrite: false,
      })
      const sprite = new THREE.Sprite(mat)
      sprite.position.set(...pos)
      sprite.scale.setScalar(scale)
      scene.add(sprite)
    })

    // Concentric ground rings centered on the hub — spatial grounding
    for (let r = 20; r <= 100; r += 20) {
      const pts = new THREE.EllipseCurve(0, 0, r, r, 0, Math.PI * 2).getPoints(128)
      const ring = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({
          color: palette.cyan, transparent: true, opacity: 0.05 * (1 - r / 140),
          blending: palette.blending, depthWrite: false,
        }),
      )
      ring.rotation.x = -Math.PI / 2
      ring.position.y = -8
      scene.add(ring)
    }

    // Build platforms
    const platformGroups: THREE.Group[] = []

    const hubGroup = new THREE.Group()
    hubGroup.position.set(...PLATFORMS[0].position)
    hubGroup.userData.platformId = 'hub'
    const hubAnim = buildHub(hubGroup, palette)
    scene.add(hubGroup)
    platformGroups.push(hubGroup)

    const expGroup = new THREE.Group()
    expGroup.position.set(...PLATFORMS[1].position)
    expGroup.userData.platformId = 'experience'
    buildExperience(expGroup, palette)
    scene.add(expGroup)
    platformGroups.push(expGroup)

    const projGroup = new THREE.Group()
    projGroup.position.set(...PLATFORMS[2].position)
    projGroup.userData.platformId = 'projects'
    const projAnim = buildProjects(projGroup, palette)
    scene.add(projGroup)
    platformGroups.push(projGroup)

    const skillGroup = new THREE.Group()
    skillGroup.position.set(...PLATFORMS[3].position)
    skillGroup.userData.platformId = 'skills'
    const skillAnim = buildSkills(skillGroup, palette)
    scene.add(skillGroup)
    platformGroups.push(skillGroup)

    const certGroup = new THREE.Group()
    certGroup.position.set(...PLATFORMS[4].position)
    certGroup.userData.platformId = 'certs'
    buildCerts(certGroup, palette)
    scene.add(certGroup)
    platformGroups.push(certGroup)

    const contactGroup = new THREE.Group()
    contactGroup.position.set(...PLATFORMS[5].position)
    contactGroup.userData.platformId = 'contact'
    const contactAnim = buildContact(contactGroup, palette)
    scene.add(contactGroup)
    platformGroups.push(contactGroup)

    // Light paths from the hub to each platform, echoing the 2D site's
    // constellation lines, with a glowing pulse traveling each path
    const pulsePaths: Array<{ curve: THREE.QuadraticBezierCurve3; pulse: THREE.Sprite }> = []
    PLATFORMS.slice(1).forEach((def) => {
      const pathColor = platformColor(def, palette)
      const start = new THREE.Vector3(0, 2, 0)
      const end = new THREE.Vector3(def.position[0], def.position[1] + 1, def.position[2])
      const mid = start.clone().add(end).multiplyScalar(0.5)
      mid.y += 7
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end)

      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)),
        new THREE.LineBasicMaterial({
          color: pathColor, transparent: true, opacity: 0.18,
          blending: palette.blending, depthWrite: false,
        }),
      )
      scene.add(line)

      const hex = `#${pathColor.toString(16).padStart(6, '0')}`
      const pulse = new THREE.Sprite(new THREE.SpriteMaterial({
        map: createGlowTexture(colorToRgb(pathColor)),
        color: hex, transparent: true, opacity: 0.9,
        blending: palette.blending, depthWrite: false,
      }))
      pulse.scale.setScalar(1.6)
      scene.add(pulse)
      pulsePaths.push({ curve, pulse })
    })

    // Labels fade out as the camera approaches, so they never sit on
    // top of a focused platform
    const labelSprites: THREE.Sprite[] = []
    scene.traverse((obj) => {
      if (obj instanceof THREE.Sprite && obj.userData.isLabel) labelSprites.push(obj)
    })
    const labelWorldPos = new THREE.Vector3()

    // Raycaster click detection
    const raycaster = new THREE.Raycaster()
    let pointerDown = { x: 0, y: 0 }

    const onPointerDown = (e: PointerEvent) => {
      pointerDown = { x: e.clientX, y: e.clientY }
    }
    const onPointerUp = (e: PointerEvent) => {
      if (Math.abs(e.clientX - pointerDown.x) + Math.abs(e.clientY - pointerDown.y) > 6) return
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      )
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(platformGroups, true)
      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object
        while (obj && !obj.userData.platformId) obj = obj.parent
        if (obj?.userData.platformId) flyToRef.current(obj.userData.platformId)
      }
    }
    // Pointer cursor over clickable platforms
    const onPointerMove = (e: PointerEvent) => {
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      )
      raycaster.setFromCamera(mouse, camera)
      renderer.domElement.style.cursor =
        raycaster.intersectObjects(platformGroups, true).length > 0 ? 'pointer' : 'grab'
    }
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointerup', onPointerUp)
    renderer.domElement.addEventListener('pointermove', onPointerMove)

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // Animation loop
    const timer = new THREE.Timer()
    let frame = 0
    const animate = () => {
      frame = requestAnimationFrame(animate)
      timer.update()
      const t = timer.getElapsed()

      // Stars
      stars.rotation.y = t * 0.008

      // Hub animations
      hubAnim.core.rotation.y = t * 0.3
      hubAnim.core.rotation.x = t * 0.2
      hubAnim.inner.rotation.y = -t * 0.2
      hubAnim.inner.rotation.z = t * 0.15
      hubAnim.rings.forEach((ring, i) => { ring.rotation.z = t * (0.08 + i * 0.04) })

      // Project cubes float + rotate
      projAnim.cubes.forEach((cube, i) => {
        cube.rotation.x += 0.002
        cube.rotation.y += 0.003
        cube.position.y += Math.sin(t * 0.4 + i * 1.3) * 0.002
      })
      projAnim.wires.forEach((wire, i) => {
        wire.rotation.copy(projAnim.cubes[i].rotation)
        wire.position.copy(projAnim.cubes[i].position)
      })

      // Skill spheres pulse
      skillAnim.spheres.forEach((sphere, i) => {
        const s = 1 + Math.sin(t * 0.7 + i * 1.1) * 0.1
        const base = sphere.userData.baseScale as number
        const radius = (sphere.geometry as THREE.SphereGeometry).parameters.radius
        sphere.scale.setScalar(s * (base / radius))
      })

      // Contact signal rings
      contactAnim.signalRings.forEach((ring) => {
        const phase = ((t * 0.25 + (ring.userData.phaseOffset as number)) % 1)
        const s = 1 + phase * 2.5
        ring.scale.setScalar(s)
        ;(ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.25 * (1 - phase))
      })

      // Pulses traveling the light paths
      pulsePaths.forEach(({ curve, pulse }, i) => {
        const phase = (t * 0.08 + i * 0.2) % 1
        pulse.position.copy(curve.getPoint(phase))
        ;(pulse.material as THREE.SpriteMaterial).opacity = 0.9 * Math.sin(phase * Math.PI)
      })

      // Distance-based label fade
      labelSprites.forEach((sprite) => {
        sprite.getWorldPosition(labelWorldPos)
        const d = camera.position.distanceTo(labelWorldPos)
        ;(sprite.material as THREE.SpriteMaterial).opacity =
          THREE.MathUtils.clamp((d - 30) / 22, 0, 1) * 0.9
      })

      // Camera fly-to lerp
      if (cameraAnim.current.active) {
        camera.position.lerp(cameraAnim.current.position, 0.04)
        controls.target.lerp(cameraAnim.current.lookAt, 0.04)
        if (camera.position.distanceTo(cameraAnim.current.position) < 0.4) {
          cameraAnim.current.active = false
        }
      }

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', onResize)
      controls.dispose()
      controlsRef.current = null
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
          obj.geometry.dispose()
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
          materials.forEach((m) => m.dispose())
        }
        if (obj instanceof THREE.Sprite) {
          obj.material.map?.dispose()
          obj.material.dispose()
        }
      })
      renderer.dispose()
    }
  }, [theme])

  /* ---- Keyboard shortcuts ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') flyToOverview()
      const idx = parseInt(e.key) - 1
      if (idx >= 0 && idx < PLATFORMS.length) flyTo(PLATFORMS[idx].id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flyTo, flyToOverview])

  /* ---- Render ---- */
  if (webglFailed) {
    return (
      <div className="world-3d world-fallback">
        <button
          className="world-theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <p>This 3D view needs WebGL, which your browser or device has disabled.</p>
        <a href="#/" className="world-back-link world-fallback-link">← Back to the portfolio</a>
      </div>
    )
  }

  return (
    <div className={`world-3d ${focused ? 'has-panel' : ''}`}>
      <div ref={canvasRef} className="world-canvas" />

      <a href="#/" className="world-back-link">← Portfolio</a>

      <button
        className="world-theme-toggle"
        type="button"
        onClick={onToggleTheme}
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      <div className="world-nav">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            className={focused === p.id ? 'active' : ''}
            onClick={() => flyTo(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {!focused && (
        <div className="world-help">
          {isTouch
            ? 'Drag to orbit · Pinch to zoom · Tap a platform to explore'
            : 'Drag to orbit · Scroll to zoom · Click a platform to explore · Keys 1–6'}
        </div>
      )}

      {focused && (
        <div className="world-panel">
          <PanelContent id={focused} onClose={flyToOverview} />
        </div>
      )}
    </div>
  )
}
