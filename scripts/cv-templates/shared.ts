export type Variant = "fullstack" | "frontend";
export type Lang = "en" | "de";

export interface ExperienceEntry {
  company: string;
  title: string;
  period: string;
  location?: string;
  bullets: string[];
}

export interface SkillGroup {
  label: string;
  values: string[];
}

export interface CvData {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  skills: SkillGroup[];
  languages: { name: string; level: string }[];
  experience: ExperienceEntry[];
  education: {
    institution: string;
    degree: string;
    period: string;
  };
  certifications: string[];
  personal: {
    nationality: string;
    address: string;
  };
}

type Localized<T> = Record<Lang, T>;

const titles: Record<Variant, string> = {
  fullstack: "Senior Full Stack Developer",
  frontend: "Senior Frontend Developer",
};

const summaries: Record<Variant, Localized<string>> = {
  fullstack: {
    en: "Senior Full Stack Developer with 8+ years shipping revenue-driving web and mobile products across e-commerce, logistics, tourism, and SaaS. Expert in the JavaScript/TypeScript ecosystem — React, Next.js, Node.js, AWS serverless — backed by Python automation. Works with an AI-augmented workflow (Claude Code, Claude Design, Cursor, custom agents) to take features from idea to production at exceptional speed. Trusted with enterprise platforms for Grupo Xcaret, VMware, NordicTrack, and Galerías.",
    de: "Senior Full Stack Developer mit über 8 Jahren Erfahrung in der Entwicklung umsatzstarker Web- und Mobile-Produkte für E-Commerce, Logistik, Tourismus und SaaS. Experte im JavaScript-/TypeScript-Ökosystem — React, Next.js, Node.js, AWS Serverless — ergänzt durch Python-Automatisierung. Arbeitet mit einem KI-gestützten Workflow (Claude Code, Claude Design, Cursor, eigene Agents), um Features in außergewöhnlichem Tempo produktionsreif zu liefern. Enterprise-Plattformen für Grupo Xcaret, VMware, NordicTrack und Galerías umgesetzt.",
  },
  frontend: {
    en: "Senior Frontend Developer with 8+ years crafting fast, conversion-focused interfaces for e-commerce and SaaS brands. Deep expertise in React, Next.js, and TypeScript with a sharp eye for design systems, animation, and performance. Pairs hands-on UI craft with an AI-augmented workflow — Claude Code, Claude Design, Cursor, and custom agents — to move from prototype to polished production at exceptional speed. Delivered customer-facing platforms for Grupo Xcaret, NordicTrack, and Galerías.",
    de: "Senior Frontend Developer mit über 8 Jahren Erfahrung in der Entwicklung schneller, conversion-orientierter Interfaces für E-Commerce- und SaaS-Marken. Tiefe Expertise in React, Next.js und TypeScript, mit ausgeprägtem Gespür für Designsysteme, Animation und Performance. Kombiniert UI-Handwerk mit einem KI-gestützten Workflow — Claude Code, Claude Design, Cursor und eigene Agents — vom Prototyp bis zur ausgereiften Produktion. Kundenplattformen für Grupo Xcaret, NordicTrack und Galerías umgesetzt.",
  },
};

const skills: Record<Variant, Record<Lang, SkillGroup[]>> = {
  fullstack: {
    en: [
      {
        label: "Frontend",
        values: ["React", "Next.js", "TypeScript", "Tailwind CSS", "React Native"],
      },
      {
        label: "Backend",
        values: ["Node.js", "NestJS", "Python", "REST / GraphQL", "MongoDB"],
      },
      {
        label: "Cloud & DevOps",
        values: [
          "AWS (Lambda, Cognito, S3, DynamoDB)",
          "Docker",
          "CI/CD",
          "Git",
        ],
      },
      {
        label: "CMS & E-Commerce",
        values: [
          "Shopify (Liquid/APIs)",
          "WordPress",
          "Payload CMS",
          "ContentStack",
          "CommerceTools",
          "Stripe",
        ],
      },
      {
        label: "AI Tooling",
        values: ["Claude Code", "Claude Design", "AI Agents (MCP)", "Cursor"],
      },
    ],
    de: [
      {
        label: "Frontend",
        values: ["React", "Next.js", "TypeScript", "Tailwind CSS", "React Native"],
      },
      {
        label: "Backend",
        values: ["Node.js", "NestJS", "Python", "REST / GraphQL", "MongoDB"],
      },
      {
        label: "Cloud & DevOps",
        values: ["AWS Serverless", "Docker", "CI/CD", "Git"],
      },
      {
        label: "CMS & E-Commerce",
        values: [
          "Shopify",
          "WordPress",
          "Payload CMS",
          "ContentStack",
          "CommerceTools",
          "Stripe",
        ],
      },
      {
        label: "KI-Tools",
        values: ["Claude Code", "Claude Design", "AI Agents (MCP)", "Cursor"],
      },
    ],
  },
  frontend: {
    en: [
      {
        label: "Core",
        values: [
          "React",
          "Next.js",
          "TypeScript",
          "JavaScript (ES6+)",
          "React Native",
        ],
      },
      {
        label: "UI & Styling",
        values: [
          "Tailwind CSS",
          "CSS/SCSS",
          "GSAP",
          "Design Systems",
          "Responsive & Accessible UI",
        ],
      },
      {
        label: "CMS & E-Commerce",
        values: ["Shopify (Liquid)", "WordPress", "Payload CMS", "ContentStack"],
      },
      {
        label: "AI Tooling",
        values: ["Claude Code", "Claude Design", "AI Agents (MCP)", "Cursor"],
      },
      {
        label: "Tools",
        values: ["Node.js", "Python", "REST / GraphQL", "Git", "CI/CD"],
      },
    ],
    de: [
      {
        label: "Core",
        values: [
          "React",
          "Next.js",
          "TypeScript",
          "JavaScript (ES6+)",
          "React Native",
        ],
      },
      {
        label: "UI & Styling",
        values: ["Tailwind CSS", "CSS/SCSS", "GSAP", "Designsysteme", "Responsive UI"],
      },
      {
        label: "CMS & E-Commerce",
        values: ["Shopify (Liquid)", "WordPress", "Payload CMS", "ContentStack"],
      },
      {
        label: "KI-Tools",
        values: ["Claude Code", "Claude Design", "AI Agents (MCP)", "Cursor"],
      },
      {
        label: "Tools",
        values: ["Node.js", "Python", "REST / GraphQL", "Git", "CI/CD"],
      },
    ],
  },
};

const languages: Localized<{ name: string; level: string }[]> = {
  en: [
    { name: "Spanish", level: "Native" },
    { name: "English", level: "C2 (EF SET Proficient)" },
    { name: "German", level: "B1 (in progress, preparing for exam)" },
  ],
  de: [
    { name: "Spanisch", level: "Muttersprache" },
    { name: "English", level: "C2 (EF SET Proficient)" },
    { name: "Deutsch", level: "B1 (in Weiterbildung, Prüfungsvorbereitung)" },
  ],
};

interface ExperienceSource {
  company: string;
  title: string;
  period: string;
  location?: string;
  bullets: Localized<string[]>;
}

const experience: ExperienceSource[] = [
  {
    company: "Freelance",
    title: "Software Developer",
    period: "Apr 2025 – Present",
    bullets: {
      en: [
        "Run an AI-augmented delivery workflow (Claude Code, Claude Design, Cursor, custom agents) to ship client work dramatically faster without sacrificing quality.",
        "Built custom Shopify themes and WordPress sites driving measurable e-commerce sales growth and lead capture for corporate clients.",
        "Rebuilt the complete UI of a test-automation platform (muuktest.com), improving usability and brand consistency.",
        "Delivered fully self-manageable websites so business owners update content without a developer — cutting maintenance costs and time-to-market.",
        "Building a nationwide multilingual events platform with Payload CMS and Next.js.",
      ],
      de: [
        "KI-gestützter Entwicklungsworkflow mit Claude Code, Claude Design, Cursor und eigenen Agents — deutlich schnellere Lieferung bei gleichbleibender Qualität.",
        "Entwicklung individueller Shopify-Themes und WordPress-Websites mit messbarem E-Commerce-Wachstum und höherer Lead-Generierung für Firmenkunden.",
        "Komplette Neuentwicklung der UI einer Testautomatisierungs-Plattform (muuktest.com) mit verbesserter Usability und Markenkonsistenz.",
        "Umsetzung vollständig selbstverwaltbarer Websites — Inhalte ohne Entwickler aktualisierbar, geringere Wartungskosten, schnellere Time-to-Market.",
        "Aufbau einer landesweiten, mehrsprachigen Event-Plattform mit Payload CMS und Next.js.",
      ],
    },
  },
  {
    company: "Orium",
    title: "Full Stack Developer",
    period: "Oct 2025 – Feb 2026",
    bullets: {
      en: [
        "Implemented secure digital payments with Stripe for Grupo Xcaret, Mexico's leading tourism company — PCI-compliant checkout flows at scale.",
        "Designed and prototyped high-fidelity UI to streamline the booking and purchase experience.",
      ],
      de: [
        "Implementierung sicherer digitaler Zahlungen mit Stripe für Grupo Xcaret, Mexikos führendes Tourismusunternehmen — PCI-konforme Checkout-Flows im großen Maßstab.",
        "Design und Prototyping hochwertiger UI-Oberflächen zur Optimierung des Buchungs- und Kauferlebnisses.",
      ],
    },
  },
  {
    company: "Gluo",
    title: "Full Stack Developer",
    period: "Jul 2024 – Apr 2025",
    bullets: {
      en: [
        "Built Galerías' (galerias.com) nationwide shopping-mall platform with user auth, interactive maps, and a fully customizable CMS.",
        "Redesigned NordicTrack's e-commerce site with dynamic components, light/dark themes, and CMS-integrated content.",
        "Automated product-variant imports into CommerceTools with custom data pipelines, eliminating hours of manual catalog work.",
        "Drove code quality through code reviews and unit tests for data transformation logic.",
      ],
      de: [
        "Entwicklung der landesweiten Shopping-Center-Plattform von Galerías (galerias.com) mit Authentifizierung, interaktiven Karten und voll anpassbarem CMS.",
        "Redesign des E-Commerce-Shops von NordicTrack mit dynamischen Komponenten, Light/Dark-Themes und CMS-integrierten Inhalten.",
        "Automatisierung von Produktvarianten-Importen in CommerceTools durch eigene Daten-Pipelines — Wegfall stundenlanger manueller Katalogpflege.",
        "Sicherung der Codequalität durch Code-Reviews und Unit-Tests für Datentransformationslogik.",
      ],
    },
  },
  {
    company: "Blue People",
    title: "Full Stack Developer",
    period: "Apr 2023 – Jun 2024",
    bullets: {
      en: [
        "Led development of a serverless SaaS logistics platform on AWS, applying SOLID principles and architecture best practices.",
        "Built and shipped React Native apps (food ordering, event scheduling) to the App Store and Play Store, including push notifications and auth.",
        "Integrated AWS end to end: Cognito, Lambda, API Gateway, SNS, SES, S3, DynamoDB, and CloudFormation.",
      ],
      de: [
        "Leitung der Entwicklung einer serverlosen SaaS-Logistikplattform auf AWS nach SOLID-Prinzipien und Architektur-Best-Practices.",
        "Entwicklung und Veröffentlichung von React-Native-Apps (Essensbestellung, Event-Planung) im App Store und Play Store, inkl. Push-Benachrichtigungen und Authentifizierung.",
        "End-to-End-Integration von AWS: Cognito, Lambda, API Gateway, SNS, SES, S3, DynamoDB und CloudFormation.",
      ],
    },
  },
  {
    company: "Enroute",
    title: "Full Stack Developer",
    period: "Jan 2021 – Mar 2023",
    bullets: {
      en: [
        "Collaborated on redesigning VMware's global validation system, improving query performance across large data-center datasets.",
        "Refactored a high-volume automated email system tied to complex business rules.",
        "Built institutional React Native apps for US clients and led front-end dashboard and charting improvements.",
      ],
      de: [
        "Mitwirkung am Redesign von VMwares globalem Validierungssystem mit verbesserter Query-Performance über große Rechenzentrums-Datensätze.",
        "Refactoring eines automatisierten E-Mail-Systems mit hohem Volumen und komplexen Geschäftsregeln.",
        "Entwicklung institutioneller React-Native-Apps für US-Kunden sowie Leitung von Frontend-Verbesserungen (Dashboards, Charts).",
      ],
    },
  },
  {
    company: "Helicon",
    title: "Full Stack Developer",
    period: "May 2019 – Nov 2020",
    bullets: {
      en: [
        "Automated a full packaging production line for Mexico's leading nationwide pharmacy chain — fewer manual errors, real-time monitoring.",
        "Built production-line interfaces with barcode scanners and a custom state machine tracking every process step.",
        "Wrote Python scripts optimizing campaign configurations, boosting packaging speed and accuracy.",
      ],
      de: [
        "Automatisierung einer kompletten Verpackungslinie für Mexikos führende landesweite Apothekenkette — weniger manuelle Fehler, Echtzeit-Monitoring.",
        "Entwicklung von Produktionslinien-Interfaces mit Barcode-Scannern und eigener State Machine zur Verfolgung jedes Prozessschritts.",
        "Python-Skripte zur Optimierung von Kampagnenkonfigurationen — höhere Geschwindigkeit und Genauigkeit der Verpackung.",
      ],
    },
  },
  {
    company: "Grupo 4S",
    title: "Web Master",
    period: "Feb 2018 – Apr 2019",
    location: "San Pedro Garza García, México",
    bullets: {
      en: [
        "Built and maintained WordPress sites, cutting load times and lifting Google PageSpeed and SEO rankings company-wide.",
        "Developed fully custom responsive WordPress themes with design and marketing teams.",
        "Implemented lead-tracking scripts and automated workflows with Zapier.",
      ],
      de: [
        "Aufbau und Pflege von WordPress-Websites mit kürzeren Ladezeiten und besseren Google-PageSpeed- und SEO-Rankings.",
        "Entwicklung vollständig individueller, responsiver WordPress-Themes gemeinsam mit Design- und Marketingteams.",
        "Implementierung von Lead-Tracking-Skripten und automatisierten Workflows mit Zapier.",
      ],
    },
  },
];

const education: Localized<CvData["education"]> = {
  en: {
    institution: "Universidad Autónoma de Nuevo León (UANL)",
    degree: "Software Technology Engineering (B.Eng.)",
    period: "2015 – 2020",
  },
  de: {
    institution: "Universidad Autónoma de Nuevo León (UANL)",
    degree: "Ingenieurwesen in Softwaretechnologien (B.Eng.)",
    period: "2015 – 2020",
  },
};

const certifications: string[] = [
  "MongoDB — The Complete Developer's Guide 2022",
  "EF SET English Certificate C2 Proficient",
  "Goethe-Zertifikat A1 — Goethe-Institut",
  "Goethe-Zertifikat A2 — Goethe-Institut",
];

const personal: Localized<CvData["personal"]> = {
  en: {
    nationality: "Mexican",
    address: "Via Burgos, Monterrey, México",
  },
  de: {
    nationality: "Mexikanisch",
    address: "Via Burgos, Monterrey, Mexiko",
  },
};

export function getCvData(variant: Variant, lang: Lang): CvData {
  return {
    name: "Saúl Puentes",
    title: titles[variant],
    location: "Monterrey, Nuevo León, México",
    phone: "+52 812 401 8274",
    email: "saul.puentess@gmail.com",
    linkedin: "linkedin.com/in/saul-puentes",
    github: "github.com/SaulPuentes",
    portfolio: lang === "de" ? "saulpuentes.com/de" : "saulpuentes.com",
    summary: summaries[variant][lang],
    skills: skills[variant][lang],
    languages: languages[lang],
    experience: experience.map((exp) => ({
      company: exp.company,
      title: exp.title,
      period: exp.period,
      location: exp.location,
      bullets: exp.bullets[lang],
    })),
    education: education[lang],
    certifications,
    personal: personal[lang],
  };
}
