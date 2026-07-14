import { ArrowUpRight } from 'lucide-react'
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
  { id: 'hub', label: 'Home', position: [0, 0, 0] as const, color: 0x3ddbe8, camOffset: [0, 8, 20] as const },
  { id: 'experience', label: 'Experience', position: [42, 0, -12] as const, color: 0x35c9d6, camOffset: [0, 12, 24] as const },
  { id: 'projects', label: 'Projects', position: [-32, 6, -38] as const, color: 0xf7b267, camOffset: [0, 12, 26] as const },
  { id: 'skills', label: 'Skills', position: [-42, -2, 18] as const, color: 0x39d2df, camOffset: [0, 10, 20] as const },
  { id: 'certs', label: 'Certifications', position: [28, 4, -36] as const, color: 0xf0a050, camOffset: [0, 10, 24] as const },
  { id: 'contact', label: 'Contact', position: [5, -4, 46] as const, color: 0x3ddbe8, camOffset: [0, 8, 20] as const },
]

const OVERVIEW = { position: new THREE.Vector3(0, 35, 75), lookAt: new THREE.Vector3(0, 0, 0) }

/* ================================================================
   TEXT SPRITE HELPER
   ================================================================ */

function createTextSprite(text: string, scale = 10): THREE.Sprite {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = 512
  canvas.height = 128
  ctx.clearRect(0, 0, 512, 128)
  ctx.font = '600 44px "Space Grotesk", "Inter", sans-serif'
  ctx.fillStyle = '#e8f4f8'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 256, 64)
  const tex = new THREE.CanvasTexture(canvas)
  tex.minFilter = THREE.LinearFilter
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.85, depthTest: false })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(scale, scale * 0.25, 1)
  return sprite
}

/* ================================================================
   PLATFORM BUILDERS — return animatable objects
   ================================================================ */

function buildHub(group: THREE.Group) {
  // Hex base
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x0a1620, emissive: 0x3ddbe8, emissiveIntensity: 0.08, metalness: 0.8, roughness: 0.3 })
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 0.5, 6), baseMat))

  // Core icosahedron (wireframe)
  const coreMat = new THREE.MeshStandardMaterial({ color: 0x3ddbe8, emissive: 0x3ddbe8, emissiveIntensity: 0.3, wireframe: true, transparent: true, opacity: 0.75 })
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2, 1), coreMat)
  core.position.y = 4
  group.add(core)

  // Inner solid
  const innerMat = new THREE.MeshStandardMaterial({ color: 0x2bb8c6, emissive: 0x3ddbe8, emissiveIntensity: 0.2, metalness: 0.5, roughness: 0.4 })
  const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 1), innerMat)
  inner.position.y = 4
  group.add(inner)

  // Orbital rings
  const ringMat = new THREE.LineBasicMaterial({ color: 0xf7b267, transparent: true, opacity: 0.45 })
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

  const label = createTextSprite('Tushar Pant')
  label.position.y = 9
  group.add(label)

  return { core, inner, rings }
}

function buildExperience(group: THREE.Group) {
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x0a1620, emissive: 0x35c9d6, emissiveIntensity: 0.06, metalness: 0.8, roughness: 0.3 })
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 0.4, 6), baseMat))

  const companies = [
    { h: 9, c: 0x3ddbe8, x: -6 },
    { h: 4.5, c: 0x2bb8c6, x: -3 },
    { h: 6, c: 0x00a0b0, x: 0 },
    { h: 2.5, c: 0x008090, x: 3 },
    { h: 7, c: 0x006878, x: 6 },
  ]
  const pillars: THREE.Mesh[] = []
  companies.forEach(({ h, c, x }) => {
    const mat = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.15, metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.7 })
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, h, 8), mat)
    pillar.position.set(x, h / 2 + 0.2, 0)
    group.add(pillar)
    pillars.push(pillar)
    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 1.6), mat.clone())
    ;(cap.material as THREE.MeshStandardMaterial).opacity = 1
    cap.position.set(x, h + 0.35, 0)
    group.add(cap)
  })

  const label = createTextSprite('Experience')
  label.position.y = 12
  group.add(label)
  return { pillars }
}

function buildProjects(group: THREE.Group) {
  const positions = [
    { x: 0, y: 2, z: 0, s: 1.6 },
    { x: 3.5, y: 1, z: 2, s: 1.3 },
    { x: -3, y: 3.5, z: -1.5, s: 1.1 },
    { x: 2.5, y: -0.5, z: -3, s: 1.4 },
    { x: -4, y: 0.5, z: 2.5, s: 1 },
    { x: 1.5, y: 4, z: -2, s: 1.2 },
  ]
  const cubes: THREE.Mesh[] = []
  const wires: THREE.Mesh[] = []
  positions.forEach(({ x, y, z, s }) => {
    const mat = new THREE.MeshStandardMaterial({ color: 0xf7b267, emissive: 0xf7b267, emissiveIntensity: 0.2, metalness: 0.4, roughness: 0.5, transparent: true, opacity: 0.75 })
    const cube = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), mat)
    cube.position.set(x, y, z)
    cube.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2)
    group.add(cube)
    cubes.push(cube)
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xf7b267, wireframe: true, transparent: true, opacity: 0.25 })
    const wire = new THREE.Mesh(new THREE.BoxGeometry(s * 1.2, s * 1.2, s * 1.2), wireMat)
    wire.position.copy(cube.position)
    wire.rotation.copy(cube.rotation)
    group.add(wire)
    wires.push(wire)
  })

  const label = createTextSprite('Projects')
  label.position.y = 8
  group.add(label)
  return { cubes, wires }
}

function buildSkills(group: THREE.Group) {
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x0a1620, emissive: 0x39d2df, emissiveIntensity: 0.05, metalness: 0.8, roughness: 0.3 })
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 0.3, 6), baseMat))

  const nodes = [
    { x: 0, y: 2.5, z: 0, s: 1.2, c: 0x3ddbe8 },
    { x: 3.5, y: 2, z: 1, s: 0.85, c: 0x2bb8c6 },
    { x: -2.5, y: 3.5, z: 1.5, s: 0.75, c: 0x00a0b0 },
    { x: 2.5, y: 4, z: -2.5, s: 0.65, c: 0xf7b267 },
    { x: -3.5, y: 1.5, z: -1.5, s: 0.75, c: 0x00d0e0 },
    { x: 1.5, y: 0.8, z: 3, s: 0.65, c: 0x00b0c0 },
  ]
  const spheres: THREE.Mesh[] = []
  nodes.forEach(({ x, y, z, s, c }) => {
    const mat = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.25, metalness: 0.3, roughness: 0.5 })
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(s, 16, 16), mat)
    sphere.position.set(x, y, z)
    sphere.userData.baseScale = s
    group.add(sphere)
    spheres.push(sphere)
  })

  const conns = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [3, 4]]
  conns.forEach(([a, b]) => {
    const pts = [new THREE.Vector3(nodes[a].x, nodes[a].y, nodes[a].z), new THREE.Vector3(nodes[b].x, nodes[b].y, nodes[b].z)]
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x3ddbe8, transparent: true, opacity: 0.2 })))
  })

  const label = createTextSprite('Skills')
  label.position.y = 7
  group.add(label)
  return { spheres }
}

function buildCerts(group: THREE.Group) {
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x0a1620, emissive: 0xf0a050, emissiveIntensity: 0.05, metalness: 0.8, roughness: 0.3 })
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 0.3, 6), baseMat))

  const obelisks = [
    { x: -5, h: 5.5, c: 0xf7b267 },
    { x: -2.5, h: 3.8, c: 0xf0a050 },
    { x: 0, h: 4.8, c: 0xe89040 },
    { x: 2.5, h: 3.2, c: 0xf7b267 },
    { x: 5, h: 4.2, c: 0xf0a050 },
    { x: 7.5, h: 3.6, c: 0xe89040 },
  ]
  obelisks.forEach(({ x, h, c }) => {
    const mat = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.2, metalness: 0.5, roughness: 0.3, transparent: true, opacity: 0.8 })
    const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 0), mat)
    mesh.position.set(x, h / 2 + 0.5, 0)
    mesh.scale.set(1, h / 1.6, 1)
    group.add(mesh)
  })

  const label = createTextSprite('Certifications', 12)
  label.position.y = 8
  group.add(label)
  return {}
}

function buildContact(group: THREE.Group) {
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x0a1620, emissive: 0x3ddbe8, emissiveIntensity: 0.05, metalness: 0.8, roughness: 0.3 })
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 0.3, 8), baseMat))

  // Tower
  const towerMat = new THREE.MeshStandardMaterial({ color: 0x35c9d6, emissive: 0x3ddbe8, emissiveIntensity: 0.15, metalness: 0.6, roughness: 0.3 })
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.4, 7, 8), towerMat)
  tower.position.set(0, 3.7, 0)
  group.add(tower)

  // Cone top
  const coneMat = new THREE.MeshStandardMaterial({ color: 0xf7b267, emissive: 0xf7b267, emissiveIntensity: 0.3, metalness: 0.5, roughness: 0.3 })
  const cone = new THREE.Mesh(new THREE.ConeGeometry(1, 2.5, 8), coneMat)
  cone.position.set(0, 8.5, 0)
  group.add(cone)

  // Signal rings
  const signalRings: THREE.Mesh[] = []
  for (let i = 0; i < 3; i++) {
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x3ddbe8, transparent: true, opacity: 0.25 - i * 0.06, side: THREE.DoubleSide })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.5 + i * 1.8, 0.04, 8, 48), ringMat)
    ring.position.y = 7
    ring.rotation.x = Math.PI / 2
    ring.userData.baseRadius = 2.5 + i * 1.8
    ring.userData.phaseOffset = i * 0.33
    group.add(ring)
    signalRings.push(ring)
  }

  const label = createTextSprite('Contact')
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

export default function World3D() {
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const [focused, setFocused] = useState<string | null>(null)

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
    cameraAnim.current = { active: true, position: pos.clone().add(offset), lookAt: pos.clone() }
    if (controlsRef.current) controlsRef.current.autoRotate = false
    setFocused(platformId)
  }, [])

  const flyToOverview = useCallback(() => {
    cameraAnim.current = { active: true, position: OVERVIEW.position.clone(), lookAt: OVERVIEW.lookAt.clone() }
    if (controlsRef.current) controlsRef.current.autoRotate = true
    setFocused(null)
  }, [])

  // Keep refs current
  useEffect(() => {
    flyToRef.current = flyTo
    flyToOverviewRef.current = flyToOverview
  }, [flyTo, flyToOverview])

  /* ---- Three.js setup ---- */
  useEffect(() => {
    const mount = canvasRef.current
    if (!mount) return

    // Scene
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x050a0f, 0.006)

    // Camera
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 500)
    camera.position.copy(OVERVIEW.position)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x050a0f)
    mount.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.copy(OVERVIEW.lookAt)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minDistance = 12
    controls.maxDistance = 120
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.35
    controls.maxPolarAngle = Math.PI * 0.85
    controls.update()
    controlsRef.current = controls

    // Lighting
    scene.add(new THREE.AmbientLight(0x80a0c0, 0.5))
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.6)
    sunLight.position.set(20, 40, 30)
    scene.add(sunLight)

    // Per-platform point lights
    PLATFORMS.forEach((def) => {
      const light = new THREE.PointLight(def.color, 15, 30)
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
      color: 0xc8e0f0, size: 0.18, transparent: true, opacity: 0.4, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
    }))
    scene.add(stars)

    // Build platforms
    const platformGroups: THREE.Group[] = []

    const hubGroup = new THREE.Group()
    hubGroup.position.set(...PLATFORMS[0].position)
    hubGroup.userData.platformId = 'hub'
    const hubAnim = buildHub(hubGroup)
    scene.add(hubGroup)
    platformGroups.push(hubGroup)

    const expGroup = new THREE.Group()
    expGroup.position.set(...PLATFORMS[1].position)
    expGroup.userData.platformId = 'experience'
    buildExperience(expGroup)
    scene.add(expGroup)
    platformGroups.push(expGroup)

    const projGroup = new THREE.Group()
    projGroup.position.set(...PLATFORMS[2].position)
    projGroup.userData.platformId = 'projects'
    const projAnim = buildProjects(projGroup)
    scene.add(projGroup)
    platformGroups.push(projGroup)

    const skillGroup = new THREE.Group()
    skillGroup.position.set(...PLATFORMS[3].position)
    skillGroup.userData.platformId = 'skills'
    const skillAnim = buildSkills(skillGroup)
    scene.add(skillGroup)
    platformGroups.push(skillGroup)

    const certGroup = new THREE.Group()
    certGroup.position.set(...PLATFORMS[4].position)
    certGroup.userData.platformId = 'certs'
    buildCerts(certGroup)
    scene.add(certGroup)
    platformGroups.push(certGroup)

    const contactGroup = new THREE.Group()
    contactGroup.position.set(...PLATFORMS[5].position)
    contactGroup.userData.platformId = 'contact'
    const contactAnim = buildContact(contactGroup)
    scene.add(contactGroup)
    platformGroups.push(contactGroup)

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
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointerup', onPointerUp)

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
      window.removeEventListener('resize', onResize)
      controls.dispose()
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
  }, [])

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
  return (
    <div className="world-3d">
      <div ref={canvasRef} className="world-canvas" />

      <a href="#/" className="world-back-link">← Portfolio</a>

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
          Drag to orbit · Scroll to zoom · Click a platform to explore · Keys 1–6
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
