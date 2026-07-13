import {
  ArrowUpRight,
  BrainCircuit,
  Camera,
  Code2,
  Cpu,
  Download,
  Mail,
  MapPin,
  PlayCircle,
  Rocket,
  Server,
  Sparkles,
  TerminalSquare,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import './App.css'

/* ================================================================
   TYPES
   ================================================================ */

type Project = {
  name: string
  summary: string
  stack: string[]
  signal: string
  period: string
  url: string
}

type Capability = {
  icon: React.ComponentType<{ size?: number }>
  title: string
  description: string
}

type Experience = {
  company: string
  role: string
  period: string
  mode: string
  summary: string
  highlights: string[]
  stack: string[]
}

type GithubEdge = {
  name: string
  url: string
  label: string
  summary: string
  stack: string[]
}

type Certification = {
  name: string
  issuer: string
  issued: string
  note: string
}

type Reflection = {
  title: string
  url: string
  videoId: string
  signal: string
  summary: string
}

/* ================================================================
   DATA
   ================================================================ */

const links = {
  github: 'https://github.com/tarkesh2shar',
  linkedin: 'https://www.linkedin.com/in/tushar-pant-46075497/',
  instagram: 'https://www.instagram.com/tarkesh2shar/',
  youtube: 'https://www.youtube.com/@tarkesh2shar',
  email: 'mailto:tarkesh2shar@gmail.com',
  resume: '/Tushar_Pant_Resume_2026.pdf',
}

const projects: Project[] = [
  {
    name: 'React Server Side Rendering with Webpack and Express',
    summary:
      'A server-side rendering development server using Express, React, and Redux, with SEO optimization possible through React Helmet.',
    stack: ['React', 'Redux', 'Express', 'Webpack'],
    signal: 'LinkedIn project',
    period: 'Aug 2020',
    url: 'https://github.com/tarkesh2shar/reactSSR',
  },
  {
    name: 'Docker Multi-Container AWS CI Pipeline',
    summary:
      'A multi-container AWS continuous integration pipeline with Travis CI, using NGINX as TLS terminator and proxy across services.',
    stack: ['Docker', 'AWS', 'Travis CI', 'NGINX'],
    signal: 'LinkedIn project',
    period: 'May 2020 - Jun 2020',
    url: 'https://github.com/tarkesh2shar/multi',
  },
  {
    name: 'Docker Single-Container AWS CI Pipeline',
    summary:
      'A focused DevOps learning project built to understand single-container deployment, CI, and AWS pipeline fundamentals.',
    stack: ['Docker', 'AWS', 'Travis CI', 'DevOps'],
    signal: 'LinkedIn project',
    period: 'Apr 2020 - May 2020',
    url: 'https://github.com/tarkesh2shar/singleCont',
  },
  {
    name: 'React + Webpack Development Server',
    summary:
      'A React/Webpack starter with API proxying, SCSS/CSS support, Prettier formatting, code splitting, lazy loading, hot reload, and autoprefixing.',
    stack: ['React', 'Webpack', 'SCSS', 'Tooling'],
    signal: 'LinkedIn project',
    period: 'Sep 2019 - Feb 2020',
    url: 'https://github.com/tarkesh2shar/reactWebpackStarter',
  },
  {
    name: 'Machine Learning Techniques Using Python',
    summary:
      'Practice work around core machine learning techniques, including regression, classification, and clustering.',
    stack: ['Python', 'Regression', 'Classification', 'Clustering'],
    signal: 'LinkedIn project',
    period: 'Dec 2019 - Jan 2020',
    url: 'https://github.com/tarkesh2shar/machineLearningPractice',
  },
  {
    name: 'Apex Legends Stats Tracker + Paytm Integration',
    summary:
      'A React + Express app for checking player stats for Apex Legends, paired with a Paytm payment integration.',
    stack: ['React', 'Express', 'Paytm', 'API'],
    signal: 'LinkedIn project',
    period: 'Nov 2019',
    url: 'https://trackapex.herokuapp.com/',
  },
]

const githubEdges: GithubEdge[] = [
  {
    name: 'Node Docker Kube Microservice',
    url: 'https://github.com/tarkesh2shar/node-docker-kube-microservce',
    label: 'Microservices depth',
    summary:
      'A multi-service Node.js system with auth, tickets, orders, payments, expiration services, shared common code, Skaffold, and Kubernetes infra.',
    stack: ['Node.js', 'Docker', 'Kubernetes', 'Skaffold', 'Microservices'],
  },
  {
    name: 'expressydecorators',
    url: 'https://github.com/tarkesh2shar/expressydecorators',
    label: 'TypeScript library',
    summary:
      'A TypeScript package-style experiment for Express decorators, metadata, Swagger UI, and reusable backend routing patterns.',
    stack: ['TypeScript', 'Express', 'Decorators', 'Swagger'],
  },
  {
    name: 'AMQP Service Work',
    url: 'https://github.com/tarkesh2shar/amqp',
    label: 'Messaging systems',
    summary:
      'A TypeScript backend exploration using AMQP/RabbitMQ, Express, MongoDB, Docker, auth, sessions, and SendGrid integration.',
    stack: ['TypeScript', 'AMQP', 'RabbitMQ', 'MongoDB', 'Docker'],
  },
  {
    name: '3js',
    url: 'https://github.com/tarkesh2shar/3js',
    label: 'Creative web',
    summary:
      'A Three.js/WebGL learning repo that supports the portfolio\u2019s interactive direction and shows comfort with visual web experiments.',
    stack: ['Three.js', 'WebGL', 'Express', 'JavaScript'],
  },
  {
    name: 'algorithmsPractice',
    url: 'https://github.com/tarkesh2shar/algorithmsPractice',
    label: 'Current fundamentals',
    summary:
      'A recently updated practice repo covering algorithms, LeetCode/Blind 75 style work, sorting, searching, sets, math, and complexity.',
    stack: ['JavaScript', 'Algorithms', 'DSA', 'LeetCode'],
  },
  {
    name: 'React Native for Web',
    url: 'https://github.com/tarkesh2shar/reactNativeForWeb',
    label: 'Cross-platform UI',
    summary:
      'An Expo/React Native for Web project with navigation, platform targets, tests, and shared mobile-web interface thinking.',
    stack: ['Expo', 'React Native', 'React Native Web', 'Jest'],
  },
]

const certifications: Certification[] = [
  {
    name: 'AWS Certified Developer - Associate',
    issuer: 'Amazon Web Services',
    issued: 'Issued Oct 2025 - Expires Oct 2028',
    note: 'Validates cloud-native application development, serverless services, deployment, and AWS developer fundamentals.',
  },
  {
    name: 'AWS Cloud Quest: Serverless Developer',
    issuer: 'Amazon Web Services',
    issued: 'Issued Jul 2025',
    note: 'Hands-on serverless learning path around Lambda, API Gateway, managed services, and event-driven application design.',
  },
  {
    name: 'Building with the Claude API',
    issuer: 'Anthropic',
    issued: 'Issued Mar 2026',
    note: 'Claude API fundamentals for building AI-powered application workflows.',
  },
  {
    name: 'Model Context Protocol: Advanced Topics',
    issuer: 'Anthropic',
    issued: 'Issued Apr 2026',
    note: 'Advanced MCP concepts for connecting AI systems with tools, resources, and structured context.',
  },
  {
    name: 'Introduction to Model Context Protocol',
    issuer: 'Anthropic',
    issued: 'Issued Apr 2026',
    note: 'Foundation in MCP architecture and agent/tool context patterns.',
  },
  {
    name: 'Claude Code in Action',
    issuer: 'Anthropic',
    issued: 'Issued Mar 2026',
    note: 'Practical Claude Code workflow training for agentic coding and developer productivity.',
  },
]

const reflections: Reflection[] = [
  {
    title: 'When Emotions Take Over, Remember This',
    url: 'https://www.youtube.com/shorts/Wi-5-fu-wMI',
    videoId: 'Wi-5-fu-wMI',
    signal: '8.4k views',
    summary:
      'A reflective short on emotional storms, awareness, and remembering the steadier self underneath reaction.',
  },
  {
    title: 'You See It\u2026 Then You Forget',
    url: 'https://www.youtube.com/shorts/EdQrO6ZTonc',
    videoId: 'EdQrO6ZTonc',
    signal: '6.2k views',
    summary:
      'A short meditation on clarity, awakening, and the strange way insight arrives, fades, and returns.',
  },
  {
    title: 'Speed Isn\u2019t Progress',
    url: 'https://www.youtube.com/shorts/do2cTI_Lqzg',
    videoId: 'do2cTI_Lqzg',
    signal: '6k views',
    summary:
      'A compact philosophy piece about movement, impatience, and the difference between velocity and meaningful direction.',
  },
]

const capabilities: Capability[] = [
  {
    icon: Code2,
    title: 'React Frontends',
    description:
      'Modern, responsive interfaces with clean component architecture and strong attention to interaction detail.',
  },
  {
    icon: Server,
    title: 'Node Backends',
    description:
      'APIs, authentication, data models, uploads, and service glue for practical product workflows.',
  },
  {
    icon: TerminalSquare,
    title: 'MERN Delivery',
    description:
      'Comfort moving across MongoDB, Express, React, and Node when a project needs the whole path shipped.',
  },
  {
    icon: Cpu,
    title: 'IoT Mindset',
    description:
      'Electrical engineering roots, Arduino, drones, and hardware curiosity that shape how systems get debugged.',
  },
  {
    icon: Rocket,
    title: 'Mobile Curiosity',
    description:
      'Flutter, Dart, Android, and web-to-mobile thinking for products that should not stop at the browser.',
  },
  {
    icon: BrainCircuit,
    title: 'Always Learning',
    description:
      'Kubernetes, Postgres, and neural networks are active study lanes, not resume confetti.',
  },
]

const experience: Experience[] = [
  {
    company: 'EPAM Systems',
    role: 'Senior Software Engineer / Software Engineer',
    period: 'Apr 2022 - Present',
    mode: 'Full-time',
    summary:
      'Working across React.js, Node.js, TypeScript, testing, Kubernetes, and AWS serverless systems for production product teams.',
    highlights: [
      'Converts Figma wireframes into reusable React components and product UI.',
      'Builds middle-service APIs, migrates code to TypeScript, and resolves production bugs.',
      'Works with DynamoDB, SQS, EventBridge, Lambda, Cypress, Nightwatch, Storybook/Chromatic, and React Testing Library.',
    ],
    stack: ['React.js', 'Node.js', 'TypeScript', 'AWS', 'Kubernetes', 'Testing'],
  },
  {
    company: 'Blinkit',
    role: 'Software Development Engineer I',
    period: 'Aug 2021 - Mar 2022',
    mode: 'Full-time / Hybrid',
    summary:
      'Worked on the Experience Team across frontend, React Native, Android, native bridges, and release operations.',
    highlights: [
      'Handled React Native and Android work, including native-to-React Native bridge communication.',
      'Worked on out-of-stock product experiences across native Android and React Native.',
      'Owned code-push release movement from staging to production across iOS, Android, and web.',
    ],
    stack: ['React Native', 'Android', 'CodePush', 'Mobile'],
  },
  {
    company: 'Acquire',
    role: 'Full Stack Developer',
    period: 'Jun 2020 - Aug 2021',
    mode: 'Full-time / Remote',
    summary:
      'Contributed to VOIP team work across frontend, backend, real-time sync, microservices, and speech-to-text integrations.',
    highlights: [
      'Built reusable React components and Redux-driven API consumption flows.',
      'Synced React state across devices with websockets and built APIs in a microservices architecture.',
      'Explored VOIP integrations, Twilio call transcript generation, Google Speech-to-Text, IBM Watson, AWS alternatives, and API unit tests.',
    ],
    stack: ['React.js', 'Node.js', 'Redux', 'RabbitMQ', 'Redis', 'MySQL', 'gRPC'],
  },
  {
    company: 'CodeMaya',
    role: 'Full Stack Engineer',
    period: 'Feb 2020 - Apr 2020',
    mode: 'Full-time',
    summary:
      'Helped build an e-commerce style web app with backend APIs, MongoDB, authentication, notifications, and SEO-aware sharing.',
    highlights: [
      'Built REST APIs, signup/signin with JSON Web Tokens, and MongoDB-backed backend features.',
      'Worked on web scraping for cheapest-deal discovery and listing into one portal.',
      'Used OneSignal notifications and meta-tag SEO optimization for shareable links.',
    ],
    stack: ['Node.js', 'MongoDB', 'React.js', 'JWT', 'OneSignal'],
  },
  {
    company: 'Freelancer',
    role: 'Full-stack Developer',
    period: 'Jan 2018 - Dec 2019',
    mode: 'Freelance / Remote',
    summary:
      'Built early full-stack, Flutter, React, and hobby/product projects that became the foundation for later professional work.',
    highlights: [
      'Worked on Flutter app prototyping and reusable Flutter widgets alongside design collaborators.',
      'Built React/React Native YouTube players, Apex stats with Paytm, fake e-commerce, and blog projects.',
      'Used React, Redux, MongoDB, Express, Passport Google OAuth, PayPal, Bootstrap, Expo, and Heroku hosting.',
    ],
    stack: ['React.js', 'Flutter', 'MongoDB', 'Express', 'Redux', 'Heroku'],
  },
]

/* ================================================================
   PARTICLE FIELD — Full-viewport Three.js constellation
   ================================================================ */

function ParticleField() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

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
    const starCount = 1200
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
    const nodeCount = 220
    const nodePositions = new Float32Array(nodeCount * 3)
    const nodeOriginals = new Float32Array(nodeCount * 3)
    const nodeColors = new Float32Array(nodeCount * 3)

    const cyan = new THREE.Color(0x00f0ff)
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
    window.addEventListener('mousemove', onMouseMove)

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    /* ---- Animation loop ---- */
    const timer = new THREE.Timer()
    let frame = 0

    const animate = () => {
      frame = requestAnimationFrame(animate)
      timer.update()
      const t = timer.getElapsed()

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

            // Cyan-tinted connection color
            lineColors[idx] = 0.0 * alpha
            lineColors[idx + 1] = 0.94 * alpha
            lineColors[idx + 2] = 1.0 * alpha
            lineColors[idx + 3] = 0.0 * alpha
            lineColors[idx + 4] = 0.94 * alpha
            lineColors[idx + 5] = 1.0 * alpha

            lineCount++
          }
        }
      }
      linePosAttr.needsUpdate = true
      lineColAttr.needsUpdate = true
      lineGeo.setDrawRange(0, lineCount * 2)

      renderer.render(scene, camera)
    }

    animate()

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

/* ================================================================
   SCROLL PROGRESS BAR
   ================================================================ */

function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div
        className="scroll-progress-bar"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}

/* ================================================================
   SCROLL REVEAL — IntersectionObserver-based entrance animation
   ================================================================ */

function ScrollReveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${revealed ? 'revealed' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

/* ================================================================
   TILT CARD — 3D perspective hover effect
   ================================================================ */

function TiltCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale3d(1.02, 1.02, 1.02)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (el) {
      el.style.transform =
        'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)'
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

/* ================================================================
   APP
   ================================================================ */

function App() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const ids = ['home', 'work', 'experience', 'skills', 'contact']
    const observers: IntersectionObserver[] = []

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.25, rootMargin: '-80px 0px -40% 0px' },
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <>
      <ParticleField />
      <ScrollProgress />

      <nav className="topbar" aria-label="Primary navigation">
        <a href="#home" className="mark">
          TP
        </a>
        <div className="nav-links">
          {['work', 'experience', 'skills', 'contact'].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={activeSection === id ? 'active' : ''}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </div>
      </nav>

      <main>
        {/* ---- HERO ---- */}
        <section id="home" className="hero-section">
          <div className="hero-content">
            <ScrollReveal>
              <p className="eyebrow">
                <Sparkles size={16} />
                Full Stack MERN Developer
              </p>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <h1 className="hero-title">
                <span className="gradient-text">Tushar Pant</span> builds web
                systems with a maker&rsquo;s brain.
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <p className="hero-text">
                React, Node.js, CSS, Flutter, and hardware curiosity brought
                together for fast-moving products, practical interfaces, and
                systems that can actually ship. Outside code, he makes philosophy
                content under the same tarkesh2shar identity.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={450}>
              <div className="hero-actions">
                <a className="button primary" href="#experience">
                  See experience
                  <ArrowUpRight size={18} />
                </a>
                <a className="button ghost" href={links.resume} download>
                  Resume
                  <Download size={18} />
                </a>
                <a
                  className="button ghost"
                  href={links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                  <TerminalSquare size={18} />
                </a>
                <a
                  className="button ghost"
                  href={links.youtube}
                  target="_blank"
                  rel="noreferrer"
                >
                  YouTube
                  <PlayCircle size={18} />
                </a>
                <a className="button ghost" href="#/3d" style={{ borderColor: 'rgba(0,240,255,0.2)', color: 'var(--accent-cyan)' }}>
                  Explore 3D
                  <Rocket size={18} />
                </a>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={600}>
              <div className="quick-facts" aria-label="Profile facts">
                <span>
                  <MapPin size={16} />
                  Lucknow, India
                </span>
                <span>7+ years full stack</span>
                <span>React.js focus</span>
              </div>
            </ScrollReveal>
          </div>
          <div className="hero-badge">
            <span className="status-dot" />
            Available for serious builds
          </div>
        </section>

        {/* ---- INTRO BAND ---- */}
        <section className="intro-band">
          <ScrollReveal>
            <p>
              Pragmatic, project-driven developer with a front-end core, backend
              range, and a philosophy channel on the side. Currently sharpening
              Kubernetes, Postgres, and neural-net fundamentals.
            </p>
          </ScrollReveal>
        </section>

        {/* ---- REFLECTIONS ---- */}
        <section className="section reflection-section">
          <ScrollReveal>
            <div className="section-heading">
              <p className="eyebrow">Inner Work</p>
              <h2>
                Spiritual curiosity, philosophy, and the habit of looking
                inward.
              </h2>
              <p>
                I also make short reflective vlogs under the tarkesh2shar name.
                They are about awareness, control, time, strength, and the
                strange work of becoming yourself.
              </p>
            </div>
          </ScrollReveal>
          <div className="reflection-grid">
            {reflections.map((item, i) => (
              <ScrollReveal key={item.videoId} delay={i * 120}>
                <TiltCard>
                  <a
                    className="reflection-card"
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`}
                      alt=""
                    />
                    <div>
                      <span>{item.signal}</span>
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                    </div>
                  </a>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={350}>
            <a
              className="channel-link"
              href={links.youtube}
              target="_blank"
              rel="noreferrer"
            >
              Visit the philosophy channel
              <ArrowUpRight size={16} />
            </a>
          </ScrollReveal>
        </section>

        {/* ---- EXPERIENCE ---- */}
        <section id="experience" className="section experience-section">
          <ScrollReveal>
            <div className="section-heading">
              <p className="eyebrow">Experience</p>
              <h2>Companies, teams, and the kind of work done there.</h2>
            </div>
          </ScrollReveal>
          <div className="experience-list">
            {experience.map((item, i) => (
              <ScrollReveal key={item.company} delay={i * 100}>
                <TiltCard>
                  <article className="experience-card">
                    <div className="experience-head">
                      <div>
                        <p className="company-name">{item.company}</p>
                        <h3>{item.role}</h3>
                      </div>
                      <div className="experience-meta">
                        <span>{item.period}</span>
                        <span>{item.mode}</span>
                      </div>
                    </div>
                    <p>{item.summary}</p>
                    <ul>
                      {item.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                    <div className="tag-row">
                      {item.stack.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                  </article>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ---- CERTIFICATIONS ---- */}
        <section className="section cert-section">
          <ScrollReveal>
            <div className="section-heading">
              <p className="eyebrow">Certifications</p>
              <h2>Cloud and AI credentials from LinkedIn.</h2>
            </div>
          </ScrollReveal>
          <div className="cert-grid">
            {certifications.map((cert, i) => (
              <ScrollReveal key={cert.name} delay={i * 80}>
                <TiltCard>
                  <article className="cert-card">
                    <p className="project-signal">{cert.issuer}</p>
                    <h3>{cert.name}</h3>
                    <span>{cert.issued}</span>
                    <p>{cert.note}</p>
                  </article>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ---- PROJECTS ---- */}
        <section id="work" className="section project-section">
          <ScrollReveal>
            <div className="section-heading">
              <p className="eyebrow">LinkedIn Projects</p>
              <h2>Selected project proof, kept compact.</h2>
            </div>
          </ScrollReveal>
          <div className="project-list">
            {projects.map((project, i) => (
              <ScrollReveal key={project.name} delay={i * 80}>
                <article className="project-row">
                  <div className="project-row-main">
                    <div className="project-meta">
                      <p className="project-signal">{project.signal}</p>
                      <span>{project.period}</span>
                    </div>
                    <h3>{project.name}</h3>
                    <p>{project.summary}</p>
                  </div>
                  <div className="project-row-side">
                    <div className="tag-row">
                      {project.stack.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                    <a
                      className="project-link"
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open project
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
          <div className="github-edge">
            <ScrollReveal>
              <div className="section-heading">
                <p className="eyebrow">GitHub Edge</p>
                <h2>Repos worth noticing in a competition setting.</h2>
              </div>
            </ScrollReveal>
            <div className="edge-grid">
              {githubEdges.map((repo, i) => (
                <ScrollReveal key={repo.name} delay={i * 80}>
                  <TiltCard>
                    <article className="edge-card">
                      <p className="project-signal">{repo.label}</p>
                      <h3>{repo.name}</h3>
                      <p>{repo.summary}</p>
                      <div className="tag-row">
                        {repo.stack.map((tech) => (
                          <span key={tech}>{tech}</span>
                        ))}
                      </div>
                      <a
                        className="project-link"
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View repo
                        <ArrowUpRight size={16} />
                      </a>
                    </article>
                  </TiltCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---- SKILLS ---- */}
        <section id="skills" className="section split-section">
          <ScrollReveal>
            <div className="section-heading sticky-heading">
              <p className="eyebrow">How I Work</p>
              <h2>
                Frontend clarity, backend practicality, systems curiosity.
              </h2>
              <p>
                The useful thing about a builder who has touched web, mobile, and
                hardware is pattern recognition. Different tools, same
                discipline: understand the flow, make it usable, keep it moving.
              </p>
            </div>
          </ScrollReveal>
          <div className="capability-grid">
            {capabilities.map((capability, i) => {
              const Icon = capability.icon
              return (
                <ScrollReveal key={capability.title} delay={i * 100}>
                  <TiltCard>
                    <article className="capability-card">
                      <Icon size={24} />
                      <h3>{capability.title}</h3>
                      <p>{capability.description}</p>
                    </article>
                  </TiltCard>
                </ScrollReveal>
              )
            })}
          </div>
        </section>

        {/* ---- TIMELINE ---- */}
        <section className="section timeline-section">
          <ScrollReveal>
            <div className="section-heading">
              <p className="eyebrow">Trajectory</p>
              <h2>
                From old-school web demos to production-minded systems.
              </h2>
            </div>
          </ScrollReveal>
          <div className="timeline">
            {[
              {
                label: '2019 roots',
                text: 'React, Node, MongoDB, CSS, blogs, APIs, product flows, and many experiments.',
              },
              {
                label: 'Now',
                text: 'Full-stack React work with stronger production instincts and sharper UI expectations.',
              },
              {
                label: 'Next',
                text: 'Kubernetes, Postgres, and AI systems as the next layer of technical depth.',
              },
            ].map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 150}>
                <div className="timeline-entry">
                  <span>{item.label}</span>
                  <p>{item.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ---- CONTACT ---- */}
        <section id="contact" className="contact-section">
          <ScrollReveal>
            <div>
              <p className="eyebrow">Contact</p>
              <h2>
                Have a product, prototype, or difficult interface to build?
              </h2>
              <p>
                Send the problem. I like work that needs taste, persistence, and
                enough engineering humility to keep asking better questions.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="contact-actions">
              <a className="button primary" href={links.email}>
                <Mail size={18} />
                Email Tushar
              </a>
              <a className="button ghost" href={links.resume} download>
                <Download size={18} />
                Download resume
              </a>
              <a
                className="button ghost"
                href={links.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <ArrowUpRight size={18} />
                LinkedIn
              </a>
              <a
                className="button ghost"
                href={links.github}
                target="_blank"
                rel="noreferrer"
              >
                <TerminalSquare size={18} />
                GitHub
              </a>
              <a
                className="button ghost"
                href={links.youtube}
                target="_blank"
                rel="noreferrer"
              >
                <PlayCircle size={18} />
                YouTube
              </a>
              <a
                className="button ghost"
                href={links.instagram}
                target="_blank"
                rel="noreferrer"
              >
                <Camera size={18} />
                Instagram
              </a>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </>
  )
}

export default App
