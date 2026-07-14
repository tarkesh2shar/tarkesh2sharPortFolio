import {
  ArrowUpRight,
  BrainCircuit,
  Camera,
  Code2,
  Cpu,
  Download,
  Mail,
  MapPin,
  Moon,
  PlayCircle,
  Rocket,
  Server,
  Sparkles,
  Sun,
  TerminalSquare,
} from 'lucide-react'
import { lazy, Suspense, useEffect, useState } from 'react'
import ScrollProgress from './components/ScrollProgress'
import ScrollReveal from './components/ScrollReveal'
import TiltCard from './components/TiltCard'
import {
  capabilitiesData,
  certifications,
  experienceData,
  githubEdges,
  links,
  projects,
  reflections,
} from './data'
import './App.css'
import type { Theme } from './theme'

/* The constellation background pulls in Three.js; loading it lazily keeps
   the heavy 3D dependency out of the critical path so the hero text paints
   immediately. The background simply fades in when ready. */
const ParticleField = lazy(() => import('./components/ParticleField'))

/* Capability data stores icon names; resolve them to lucide components here
   so data.ts stays render-agnostic. */
const capabilityIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  Code2,
  Server,
  TerminalSquare,
  Cpu,
  Rocket,
  BrainCircuit,
}

function App({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
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
      <Suspense fallback={null}>
        <ParticleField key={theme} theme={theme} />
      </Suspense>
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
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
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
                <a className="button ghost cyan" href="#/3d">
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
            {experienceData.map((item, i) => (
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
              <h2>Cloud and AI credentials from AWS and Anthropic.</h2>
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
                <h2>Repos that show range beyond the day job.</h2>
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
            {capabilitiesData.map((capability, i) => {
              const Icon = capabilityIcons[capability.icon] ?? Sparkles
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
