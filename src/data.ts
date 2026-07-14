/* ================================================================
   TYPES
   ================================================================ */

export type Project = {
  name: string
  summary: string
  stack: string[]
  signal: string
  period: string
  url: string
}

export type Capability = {
  icon: string
  title: string
  description: string
}

export type Experience = {
  company: string
  role: string
  period: string
  mode: string
  summary: string
  highlights: string[]
  stack: string[]
}

export type GithubEdge = {
  name: string
  url: string
  label: string
  summary: string
  stack: string[]
}

export type Certification = {
  name: string
  issuer: string
  issued: string
  note: string
}

export type Reflection = {
  title: string
  url: string
  videoId: string
  signal: string
  summary: string
}

/* ================================================================
   DATA
   ================================================================ */

export const links = {
  github: 'https://github.com/tarkesh2shar',
  linkedin: 'https://www.linkedin.com/in/tushar-pant-46075497/',
  instagram: 'https://www.instagram.com/tarkesh2shar/',
  youtube: 'https://www.youtube.com/@tarkesh2shar',
  email: 'mailto:tarkesh2shar@gmail.com',
  resume: '/Tushar_Pant_Resume_2026.pdf',
}

export const projects: Project[] = [
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

export const githubEdges: GithubEdge[] = [
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

export const certifications: Certification[] = [
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

export const reflections: Reflection[] = [
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

export const capabilitiesData: Capability[] = [
  {
    icon: 'Code2',
    title: 'React Frontends',
    description:
      'Modern, responsive interfaces with clean component architecture and strong attention to interaction detail.',
  },
  {
    icon: 'Server',
    title: 'Node Backends',
    description:
      'APIs, authentication, data models, uploads, and service glue for practical product workflows.',
  },
  {
    icon: 'TerminalSquare',
    title: 'MERN Delivery',
    description:
      'Comfort moving across MongoDB, Express, React, and Node when a project needs the whole path shipped.',
  },
  {
    icon: 'Cpu',
    title: 'IoT Mindset',
    description:
      'Electrical engineering roots, Arduino, drones, and hardware curiosity that shape how systems get debugged.',
  },
  {
    icon: 'Rocket',
    title: 'Mobile Curiosity',
    description:
      'Flutter, Dart, Android, and web-to-mobile thinking for products that should not stop at the browser.',
  },
  {
    icon: 'BrainCircuit',
    title: 'Always Learning',
    description:
      'Kubernetes, Postgres, and neural networks are active study lanes, not resume confetti.',
  },
]

export const experienceData: Experience[] = [
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
