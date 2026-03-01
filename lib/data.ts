import type { SkillCategory, Experience, Project } from "./types"

export const skills: SkillCategory[] = [
  {
    key: "frontend",
    items: [
      { name: "React" },
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "Vue.js" },
      { name: "Tailwind CSS" },
      { name: "Redux" },
      { name: "GraphQL" },
      { name: "HTML5 / CSS3" },
      { name: "Responsive Design" },
    ],
  },
  {
    key: "backend",
    items: [
      { name: "Node.js" },
      { name: "NestJS" },
      { name: "Express" },
      { name: "Python" },
      { name: "Django" },
      { name: "REST APIs" },
      { name: "GraphQL APIs" },
      { name: "Microservices" },
    ],
  },
  {
    key: "cloud",
    items: [
      { name: "AWS (EC2, S3, Lambda)" },
      { name: "Docker" },
      { name: "Kubernetes" },
      { name: "Terraform" },
      { name: "CI/CD Pipelines" },
      { name: "Vercel" },
      { name: "GitHub Actions" },
    ],
  },
  {
    key: "databases",
    items: [
      { name: "PostgreSQL" },
      { name: "MongoDB" },
      { name: "Redis" },
      { name: "MySQL" },
      { name: "Elasticsearch" },
      { name: "Prisma ORM" },
    ],
  },
  {
    key: "practices",
    items: [
      { name: "Test-Driven Development" },
      { name: "CI/CD" },
      { name: "Agile / Scrum" },
      { name: "Code Reviews" },
      { name: "System Design" },
      { name: "Performance Optimization" },
      { name: "Monitoring & Observability" },
    ],
  },
]

export const experiences: Experience[] = [
  {
    company: {
      de: "TechScale GmbH",
      en: "TechScale GmbH",
      es: "TechScale GmbH",
    },
    role: {
      de: "Senior Full-Stack Engineer",
      en: "Senior Full-Stack Engineer",
      es: "Senior Full-Stack Engineer",
    },
    startDate: "2022-03",
    endDate: "Heute",
    achievements: {
      de: [
        "Architektur und Implementierung einer Microservices-Plattform, die 500k+ Transaktionen pro Tag verarbeitet",
        "Reduktion der API-Antwortzeiten um 40% durch Optimierung der Datenbankabfragen und Caching-Strategien",
        "Fuhrung eines 6-kopfigen Entwicklerteams und Einfuhrung von Code-Review-Prozessen",
        "Migration von Monolith zu Microservices-Architektur mit Null Ausfallzeit",
      ],
      en: [
        "Architected and implemented a microservices platform processing 500k+ transactions per day",
        "Reduced API response times by 40% through database query optimization and caching strategies",
        "Led a team of 6 developers and established code review processes",
        "Migrated from monolith to microservices architecture with zero downtime",
      ],
      es: [
        "Diseno e implementacion de una plataforma de microservicios que procesa mas de 500k transacciones diarias",
        "Reduccion de tiempos de respuesta de API en un 40% mediante optimizacion de consultas y estrategias de cache",
        "Liderazgo de un equipo de 6 desarrolladores e implementacion de procesos de revision de codigo",
        "Migracion de monolito a arquitectura de microservicios con cero tiempo de inactividad",
      ],
    },
    technologies: ["React", "Node.js", "AWS", "PostgreSQL", "Docker", "Kubernetes"],
  },
  {
    company: {
      de: "LogiFlow Solutions",
      en: "LogiFlow Solutions",
      es: "LogiFlow Solutions",
    },
    role: {
      de: "Full-Stack Developer",
      en: "Full-Stack Developer",
      es: "Full-Stack Developer",
    },
    startDate: "2020-01",
    endDate: "2022-02",
    achievements: {
      de: [
        "Entwicklung einer Echtzeit-Logistik-Tracking-Plattform fur 200+ Unternehmenskunden",
        "Implementierung von Automatisierungs-Workflows, die manuelle Prozesse um 60% reduzierten",
        "Aufbau eines Dashboard-Systems mit Echtzeit-Datenvisualisierung fur Flottenmanagement",
        "Integration von Drittanbieter-APIs (Payment, Shipping, Notifications)",
      ],
      en: [
        "Built a real-time logistics tracking platform serving 200+ enterprise clients",
        "Implemented automation workflows reducing manual processes by 60%",
        "Developed a dashboard system with real-time data visualization for fleet management",
        "Integrated third-party APIs (payment, shipping, notifications)",
      ],
      es: [
        "Desarrollo de una plataforma de seguimiento logistico en tiempo real para mas de 200 clientes empresariales",
        "Implementacion de flujos de automatizacion que redujeron procesos manuales en un 60%",
        "Construccion de un sistema de dashboard con visualizacion de datos en tiempo real para gestion de flotas",
        "Integracion de APIs de terceros (pagos, envios, notificaciones)",
      ],
    },
    technologies: ["Vue.js", "NestJS", "MongoDB", "Redis", "AWS", "GraphQL"],
  },
  {
    company: {
      de: "ShopEngine S.A.",
      en: "ShopEngine S.A.",
      es: "ShopEngine S.A.",
    },
    role: {
      de: "Frontend Developer",
      en: "Frontend Developer",
      es: "Frontend Developer",
    },
    startDate: "2018-06",
    endDate: "2019-12",
    achievements: {
      de: [
        "Aufbau eines komponentenbasierten Design-Systems fur eine E-Commerce-Plattform mit 1M+ Nutzern",
        "Verbesserung der Core Web Vitals um 35%, was zu 15% hoheren Conversion-Raten fuhrte",
        "Einfuhrung von automatisierten Tests mit 85%+ Code-Coverage",
        "Entwicklung eines A/B-Testing-Frameworks fur Produktseiten",
      ],
      en: [
        "Built a component-based design system for an e-commerce platform with 1M+ users",
        "Improved Core Web Vitals by 35%, leading to 15% higher conversion rates",
        "Introduced automated testing achieving 85%+ code coverage",
        "Developed an A/B testing framework for product pages",
      ],
      es: [
        "Construccion de un sistema de diseno basado en componentes para una plataforma e-commerce con mas de 1M de usuarios",
        "Mejora de Core Web Vitals en un 35%, resultando en un 15% mas de conversion",
        "Introduccion de pruebas automatizadas con mas del 85% de cobertura de codigo",
        "Desarrollo de un framework de pruebas A/B para paginas de productos",
      ],
    },
    technologies: ["React", "TypeScript", "Redux", "Tailwind CSS", "Jest", "Cypress"],
  },
  {
    company: {
      de: "Freelance / Selbststandig",
      en: "Freelance / Self-Employed",
      es: "Freelance / Independiente",
    },
    role: {
      de: "Web Developer",
      en: "Web Developer",
      es: "Web Developer",
    },
    startDate: "2017-01",
    endDate: "2018-05",
    achievements: {
      de: [
        "Entwicklung von 10+ Webprojekten fur KMU-Kunden in Lateinamerika",
        "Aufbau von Full-Stack-Losungen mit modernen Technologien und responsivem Design",
        "Implementierung von CMS-Losungen und E-Commerce-Integrationen",
      ],
      en: [
        "Delivered 10+ web projects for SMB clients across Latin America",
        "Built full-stack solutions with modern technologies and responsive design",
        "Implemented CMS solutions and e-commerce integrations",
      ],
      es: [
        "Entrega de mas de 10 proyectos web para clientes PyME en America Latina",
        "Construccion de soluciones full-stack con tecnologias modernas y diseno responsivo",
        "Implementacion de soluciones CMS e integraciones de e-commerce",
      ],
    },
    technologies: ["JavaScript", "PHP", "WordPress", "MySQL", "HTML/CSS"],
  },
]

export const projects: Project[] = [
  {
    id: "salsa-world",
    image: "/projects/salsa-world.jpg",
    name: {
      de: "Salsa World",
      en: "Salsa World",
      es: "Salsa World",
    },
    description: {
      de: "Eine Plattform zur Entdeckung und Forderung von Latin-Dance-Events weltweit.",
      en: "A platform to discover and promote Latin dance events worldwide.",
      es: "Una plataforma para descubrir y promover eventos de baile latino en todo el mundo.",
    },
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS", "Vercel", "Prisma"],
    liveUrl: "https://salsa-world.app",
    repoUrl: "https://github.com/saulpuentes/salsa-world",
    featured: true,
    detail: {
      problem: {
        de: "Die Latin-Dance-Community hat kein zentrales, modernes Tool, um Events zu finden, zu erstellen und zu bewerben. Bestehende Losungen sind fragmentiert und veraltet.",
        en: "The Latin dance community lacks a centralized, modern tool to find, create, and promote events. Existing solutions are fragmented and outdated.",
        es: "La comunidad de baile latino carece de una herramienta centralizada y moderna para encontrar, crear y promover eventos. Las soluciones existentes estan fragmentadas y desactualizadas.",
      },
      architecture: {
        de: "Next.js App Router mit Server Components, PostgreSQL-Datenbank mit Prisma ORM, Vercel Edge Functions fur API-Routen, und Tailwind CSS fur das UI.",
        en: "Next.js App Router with Server Components, PostgreSQL database with Prisma ORM, Vercel Edge Functions for API routes, and Tailwind CSS for the UI.",
        es: "Next.js App Router con Server Components, base de datos PostgreSQL con Prisma ORM, Vercel Edge Functions para rutas API, y Tailwind CSS para la interfaz.",
      },
      decisions: {
        de: "Entscheidung fur Next.js wegen SSR/SSG-Flexibilitat und SEO-Optimierung. PostgreSQL fur relationale Datenintegritat bei Event- und Benutzerdaten.",
        en: "Chose Next.js for SSR/SSG flexibility and SEO optimization. PostgreSQL for relational data integrity with event and user data.",
        es: "Eleccion de Next.js por flexibilidad SSR/SSG y optimizacion SEO. PostgreSQL para integridad relacional de datos de eventos y usuarios.",
      },
      challenges: {
        de: "Geolocation-basierte Suche mit performantem Datenbankdesign, mehrsprachige Unterstutzung und Echtzeit-Benachrichtigungen fur Event-Updates.",
        en: "Geolocation-based search with performant database design, multilingual support, and real-time notifications for event updates.",
        es: "Busqueda basada en geolocalizacion con diseno de base de datos eficiente, soporte multilingue y notificaciones en tiempo real para actualizaciones de eventos.",
      },
      results: {
        de: "MVP mit Event-Erstellung, Suche nach Standort und Datum, Benutzerprofilen und Community-Features. Lighthouse-Score uber 95.",
        en: "MVP with event creation, search by location and date, user profiles, and community features. Lighthouse score above 95.",
        es: "MVP con creacion de eventos, busqueda por ubicacion y fecha, perfiles de usuario y funciones de comunidad. Lighthouse score superior a 95.",
      },
      lessons: {
        de: "Produktdenken ist genauso wichtig wie technische Exzellenz. Fruhes Nutzerfeedback spart Entwicklungszeit und verbessert die Produktqualitat.",
        en: "Product thinking is as important as technical excellence. Early user feedback saves development time and improves product quality.",
        es: "El pensamiento de producto es tan importante como la excelencia tecnica. El feedback temprano de usuarios ahorra tiempo de desarrollo y mejora la calidad del producto.",
      },
    },
  },
  {
    id: "logistics-dashboard",
    image: "/projects/logistics-dashboard.jpg",
    name: {
      de: "Logistik-Dashboard",
      en: "Logistics Dashboard",
      es: "Dashboard de Logistica",
    },
    description: {
      de: "Echtzeit-Dashboard fur Flottenmanagement und Lieferverfolgung mit interaktiven Karten.",
      en: "Real-time dashboard for fleet management and delivery tracking with interactive maps.",
      es: "Dashboard en tiempo real para gestion de flotas y seguimiento de entregas con mapas interactivos.",
    },
    technologies: ["React", "NestJS", "MongoDB", "WebSocket", "Mapbox", "Docker"],
    detail: {
      problem: {
        de: "Logistikunternehmen benotigten Echtzeit-Einblick in Flottenoperationen ohne komplexe Enterprise-Losungen.",
        en: "Logistics companies needed real-time visibility into fleet operations without complex enterprise solutions.",
        es: "Las empresas de logistica necesitaban visibilidad en tiempo real de las operaciones de flota sin soluciones empresariales complejas.",
      },
      architecture: {
        de: "React-Frontend mit WebSocket-Verbindungen, NestJS-Backend mit MongoDB fur flexible Dokumentenstruktur, Mapbox-Integration fur Kartenvisualisierung.",
        en: "React frontend with WebSocket connections, NestJS backend with MongoDB for flexible document structure, Mapbox integration for map visualization.",
        es: "Frontend React con conexiones WebSocket, backend NestJS con MongoDB para estructura documental flexible, integracion Mapbox para visualizacion de mapas.",
      },
      decisions: {
        de: "WebSocket fur Echtzeit-Updates statt Polling. MongoDB fur flexible Schema-Evolution bei sich andernden Anforderungen.",
        en: "WebSocket for real-time updates instead of polling. MongoDB for flexible schema evolution with changing requirements.",
        es: "WebSocket para actualizaciones en tiempo real en lugar de polling. MongoDB para evolucion flexible del esquema con requisitos cambiantes.",
      },
      challenges: {
        de: "Skalierung von WebSocket-Verbindungen fur 1000+ gleichzeitige Nutzer und Optimierung der Kartenrendering-Performance.",
        en: "Scaling WebSocket connections for 1000+ concurrent users and optimizing map rendering performance.",
        es: "Escalado de conexiones WebSocket para mas de 1000 usuarios concurrentes y optimizacion del rendimiento de renderizado de mapas.",
      },
      results: {
        de: "40% schnellere Entscheidungsfindung durch Echtzeit-Daten. 200+ Unternehmenskunden aktiv.",
        en: "40% faster decision-making through real-time data. 200+ enterprise clients active.",
        es: "40% mas rapida la toma de decisiones gracias a datos en tiempo real. Mas de 200 clientes empresariales activos.",
      },
      lessons: {
        de: "Echtzeit-Systeme erfordern sorgfaltige Fehlerbehandlung und Reconnection-Strategien. Performance-Testing unter Last ist kritisch.",
        en: "Real-time systems require careful error handling and reconnection strategies. Performance testing under load is critical.",
        es: "Los sistemas en tiempo real requieren manejo cuidadoso de errores y estrategias de reconexion. Las pruebas de rendimiento bajo carga son criticas.",
      },
    },
  },
  {
    id: "ecommerce-platform",
    image: "/projects/ecommerce-platform.jpg",
    name: {
      de: "E-Commerce Plattform",
      en: "E-Commerce Platform",
      es: "Plataforma E-Commerce",
    },
    description: {
      de: "Skalierbare E-Commerce-Losung mit komponentenbasiertem Design-System und A/B-Testing.",
      en: "Scalable e-commerce solution with component-based design system and A/B testing.",
      es: "Solucion e-commerce escalable con sistema de diseno basado en componentes y pruebas A/B.",
    },
    technologies: ["React", "TypeScript", "Redux", "Tailwind CSS", "Node.js", "PostgreSQL"],
    detail: {
      problem: {
        de: "Eine E-Commerce-Plattform mit 1M+ Nutzern brauchte ein konsistentes Design-System und bessere Performance fur hohere Conversion-Raten.",
        en: "An e-commerce platform with 1M+ users needed a consistent design system and better performance for higher conversion rates.",
        es: "Una plataforma e-commerce con mas de 1M de usuarios necesitaba un sistema de diseno consistente y mejor rendimiento para mayores tasas de conversion.",
      },
      architecture: {
        de: "Komponentenbibliothek mit Storybook, React-Frontend mit Redux State Management, Node.js-API mit PostgreSQL.",
        en: "Component library with Storybook, React frontend with Redux state management, Node.js API with PostgreSQL.",
        es: "Biblioteca de componentes con Storybook, frontend React con gestion de estado Redux, API Node.js con PostgreSQL.",
      },
      decisions: {
        de: "Design-System-First-Ansatz fur Konsistenz. A/B-Testing-Framework fur datengetriebene Entscheidungen.",
        en: "Design system-first approach for consistency. A/B testing framework for data-driven decisions.",
        es: "Enfoque design system-first para consistencia. Framework de pruebas A/B para decisiones basadas en datos.",
      },
      challenges: {
        de: "Migration bestehender Komponenten zum neuen Design-System ohne Unterbrechung des laufenden Betriebs.",
        en: "Migrating existing components to the new design system without disrupting ongoing operations.",
        es: "Migracion de componentes existentes al nuevo sistema de diseno sin interrumpir las operaciones en curso.",
      },
      results: {
        de: "Core Web Vitals um 35% verbessert, Conversion-Rate um 15% gesteigert, 85%+ Test-Coverage erreicht.",
        en: "Improved Core Web Vitals by 35%, increased conversion rate by 15%, achieved 85%+ test coverage.",
        es: "Mejora de Core Web Vitals en un 35%, aumento de tasa de conversion en un 15%, cobertura de pruebas del 85%+.",
      },
      lessons: {
        de: "Ein gutes Design-System zahlt sich langfristig aus. Konsistenz reduziert Entwicklungszeit und verbessert die User Experience.",
        en: "A good design system pays off in the long run. Consistency reduces development time and improves user experience.",
        es: "Un buen sistema de diseno vale la pena a largo plazo. La consistencia reduce el tiempo de desarrollo y mejora la experiencia del usuario.",
      },
    },
  },
]
