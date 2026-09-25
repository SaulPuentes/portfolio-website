import fs from "fs";
import path from "path";

export type Variant = "fullstack" | "frontend" | "reactnative" | "dotnet" | "backend";
export type Lang = "en" | "de";

export interface Contact {
  name: string;
  fileSlug: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  portfolio: Record<Lang, string>;
  nationality: Record<Lang, string>;
  address: Record<Lang, string>;
}

// Contact details live outside git so the public repo carries no personal data.
// Copy cv-contact.sample.json to cv-contact.json and fill it in.
const CONTACT_DIR = path.resolve("content/data");
const contactPath = path.join(CONTACT_DIR, "cv-contact.json");

export const contact: Contact = JSON.parse(
  fs.readFileSync(
    fs.existsSync(contactPath)
      ? contactPath
      : path.join(CONTACT_DIR, "cv-contact.sample.json"),
    "utf8",
  ),
);

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
  reactnative: "Senior Full Stack Developer — Mobile",
  dotnet: "Senior Full Stack Developer — .NET",
  backend: "Senior Backend Developer",
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
  reactnative: {
    en: "Senior Full Stack Developer with 8+ years across web and mobile, including three-plus years shipping cross-platform React Native apps end to end to the iOS App Store and Google Play. Strong across the JavaScript/TypeScript ecosystem — React, Next.js, Node.js, AWS serverless — with native mobile integrations such as push notifications and authentication. Works with an AI-augmented workflow (Claude Code, Claude Design, Cursor, custom agents) to move from idea to store-ready builds at exceptional speed. Shipped React Native apps for US enterprise clients and web platforms for Grupo Xcaret, VMware, NordicTrack, and Galerías.",
    // ponytail: reactnative is EN-only; de duplicates en and is never rendered
    de: "Senior Full Stack Developer with 8+ years across web and mobile, including three-plus years shipping cross-platform React Native apps end to end to the iOS App Store and Google Play. Strong across the JavaScript/TypeScript ecosystem — React, Next.js, Node.js, AWS serverless — with native mobile integrations such as push notifications and authentication. Works with an AI-augmented workflow (Claude Code, Claude Design, Cursor, custom agents) to move from idea to store-ready builds at exceptional speed. Shipped React Native apps for US enterprise clients and web platforms for Grupo Xcaret, VMware, NordicTrack, and Galerías.",
  },
  dotnet: {
    en: "Senior Full Stack Developer with 8+ years building web and mobile products, experienced across .NET/C# and Vue.js alongside the JavaScript/TypeScript ecosystem — React, Next.js, Node.js. Comfortable maintaining and extending production platforms on both .NET backends and modern JS frontends, backed by AWS and GCP cloud plus Python automation. Works with an AI-augmented workflow (Claude Code, Claude Design, Cursor, custom agents) to deliver at exceptional speed. Delivered enterprise platforms for Grupo Xcaret, VMware, NordicTrack, and Galerías.",
    // ponytail: dotnet is EN-only; de duplicates en and is never rendered
    de: "Senior Full Stack Developer with 8+ years building web and mobile products, experienced across .NET/C# and Vue.js alongside the JavaScript/TypeScript ecosystem — React, Next.js, Node.js. Comfortable maintaining and extending production platforms on both .NET backends and modern JS frontends, backed by AWS and GCP cloud plus Python automation. Works with an AI-augmented workflow (Claude Code, Claude Design, Cursor, custom agents) to deliver at exceptional speed. Delivered enterprise platforms for Grupo Xcaret, VMware, NordicTrack, and Galerías.",
  },
  backend: {
    en: "Senior Backend Developer with 8+ years building services, business logic, and system integrations in Node.js, TypeScript, Python, and .NET/C#. Hands-on manufacturing background: automated a full packaging production line for Mexico's leading pharmacy chain — barcode-driven production control with a custom state machine, station-level camera logging for full traceability, and shipment tracking. Builds cloud backends on AWS serverless and GCP, integrates third-party platforms (Stripe, Salesforce, CommerceTools), and backs every delivery with unit testing, code reviews, and production troubleshooting. Experienced in remote, multicultural Agile teams with C2 English.",
    // ponytail: backend is EN-only; de duplicates en and is never rendered
    de: "Senior Backend Developer with 8+ years building services, business logic, and system integrations in Node.js, TypeScript, Python, and .NET/C#. Hands-on manufacturing background: automated a full packaging production line for Mexico's leading pharmacy chain — barcode-driven production control with a custom state machine, station-level camera logging for full traceability, and shipment tracking. Builds cloud backends on AWS serverless and GCP, integrates third-party platforms (Stripe, Salesforce, CommerceTools), and backs every delivery with unit testing, code reviews, and production troubleshooting. Experienced in remote, multicultural Agile teams with C2 English.",
  },
};

const backendSkills: SkillGroup[] = [
  {
    label: "Backend",
    values: ["Node.js", "TypeScript", "Python", ".NET / C#", "REST / GraphQL"],
  },
  {
    label: "Data",
    values: ["DynamoDB", "MongoDB", "Data pipelines", "Query optimization"],
  },
  {
    label: "Manufacturing",
    values: [
      "Production-line automation",
      "Barcode / hardware integration",
      "State machines",
      "Traceability",
    ],
  },
  {
    label: "Integrations",
    values: ["Stripe", "Salesforce (Apex)", "CommerceTools", "Headless CMS"],
  },
  {
    label: "Cloud & DevOps",
    values: [
      "AWS (Lambda, API Gateway, SNS, SES, S3, CloudFormation)",
      "GCP",
      "Docker",
      "CI/CD",
      "Git",
    ],
  },
  {
    label: "Quality",
    values: ["Unit testing", "Code review", "SOLID", "Debugging & troubleshooting"],
  },
  {
    label: "AI Tooling",
    values: ["Claude Code", "AI Agents", "Harness Engineering", "MCP", "RAG", "LLM", "OpenAI API", "n8n", "Cursor"],
  },
];

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
        values: ["Claude Code", "Claude Design", "AI Agents", "Harness Engineering", "MCP", "RAG", "LLM", "OpenAI API", "n8n", "Cursor"],
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
        values: ["Claude Code", "Claude Design", "AI Agents", "Harness Engineering", "MCP", "RAG", "LLM", "OpenAI API", "n8n", "Cursor"],
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
        values: ["Claude Code", "Claude Design", "AI Agents", "Harness Engineering", "MCP", "RAG", "LLM", "OpenAI API", "n8n", "Cursor"],
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
        values: ["Claude Code", "Claude Design", "AI Agents", "Harness Engineering", "MCP", "RAG", "LLM", "OpenAI API", "n8n", "Cursor"],
      },
      {
        label: "Tools",
        values: ["Node.js", "Python", "REST / GraphQL", "Git", "CI/CD"],
      },
    ],
  },
  reactnative: {
    en: [
      {
        label: "Mobile",
        values: ["React Native", "Expo", "iOS (App Store)", "Android (Play Store)", "Push Notifications"],
      },
      {
        label: "Frontend",
        values: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      },
      {
        label: "Backend",
        values: ["Node.js", "NestJS", "REST / GraphQL", "MongoDB"],
      },
      {
        label: "Cloud & DevOps",
        values: ["AWS (Lambda, Cognito, S3, DynamoDB)", "Docker", "CI/CD", "Git"],
      },
      {
        label: "AI Tooling",
        values: ["Claude Code", "Claude Design", "AI Agents", "Harness Engineering", "MCP", "RAG", "LLM", "OpenAI API", "n8n", "Cursor"],
      },
    ],
    // ponytail: reactnative is EN-only; de duplicates en and is never rendered
    de: [
      {
        label: "Mobile",
        values: ["React Native", "Expo", "iOS (App Store)", "Android (Play Store)", "Push Notifications"],
      },
      {
        label: "Frontend",
        values: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      },
      {
        label: "Backend",
        values: ["Node.js", "NestJS", "REST / GraphQL", "MongoDB"],
      },
      {
        label: "Cloud & DevOps",
        values: ["AWS (Lambda, Cognito, S3, DynamoDB)", "Docker", "CI/CD", "Git"],
      },
      {
        label: "AI Tooling",
        values: ["Claude Code", "Claude Design", "AI Agents", "Harness Engineering", "MCP", "RAG", "LLM", "OpenAI API", "n8n", "Cursor"],
      },
    ],
  },
  dotnet: {
    en: [
      {
        label: ".NET & Backend",
        values: [".NET / C#", "ASP.NET", "Node.js", "Python", "REST / GraphQL", "MongoDB"],
      },
      {
        label: "Frontend",
        values: ["Vue.js", "React", "Next.js", "TypeScript", "Tailwind CSS"],
      },
      {
        label: "Cloud & DevOps",
        values: ["AWS", "GCP", "Docker", "CI/CD", "Git"],
      },
      {
        label: "CMS & E-Commerce",
        values: ["Shopify", "WordPress", "CommerceTools", "Stripe"],
      },
      {
        label: "AI Tooling",
        values: ["Claude Code", "Claude Design", "AI Agents", "Harness Engineering", "MCP", "RAG", "LLM", "OpenAI API", "n8n", "Cursor"],
      },
    ],
    // ponytail: dotnet is EN-only; de duplicates en and is never rendered
    de: [
      {
        label: ".NET & Backend",
        values: [".NET / C#", "ASP.NET", "Node.js", "Python", "REST / GraphQL", "MongoDB"],
      },
      {
        label: "Frontend",
        values: ["Vue.js", "React", "Next.js", "TypeScript", "Tailwind CSS"],
      },
      {
        label: "Cloud & DevOps",
        values: ["AWS", "GCP", "Docker", "CI/CD", "Git"],
      },
      {
        label: "CMS & E-Commerce",
        values: ["Shopify", "WordPress", "CommerceTools", "Stripe"],
      },
      {
        label: "AI Tooling",
        values: ["Claude Code", "Claude Design", "AI Agents", "Harness Engineering", "MCP", "RAG", "LLM", "OpenAI API", "n8n", "Cursor"],
      },
    ],
  },
  // ponytail: backend is EN-only; de reuses en and is never rendered
  backend: { en: backendSkills, de: backendSkills },
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
  // EN-only bullets that replace the shared ones for a given variant
  variantBullets?: Partial<Record<Variant, string[]>>;
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
    variantBullets: {
      backend: [
        "Building the backend of a nationwide multilingual events platform with Payload CMS and Next.js — data models, content collections, and editor workflows.",
        "Delivered CMS-driven sites (WordPress/PHP custom post types, Shopify) with structured content models so business owners manage data without a developer.",
        "Run an AI-augmented delivery workflow (Claude Code, Cursor, custom agents) to ship client work faster without sacrificing quality.",
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
    variantBullets: {
      backend: [
        "Implemented backend payment logic for Grupo Xcaret, Mexico's leading tourism company — Stripe integrated with Salesforce (Apex, Platform Events) to process PCI-compliant transactions from data capture to payment confirmation.",
        "Designed the card-payment flow and prototyped it to validate business rules before development.",
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
        "Provisioned and deployed application services on Google Cloud Platform (GCP), managing cloud infrastructure for production client applications.",
        "Automated product-variant imports into CommerceTools with custom data pipelines, eliminating hours of manual catalog work.",
        "Drove code quality through code reviews and unit tests for data transformation logic.",
      ],
      de: [
        "Entwicklung der landesweiten Shopping-Center-Plattform von Galerías (galerias.com) mit Authentifizierung, interaktiven Karten und voll anpassbarem CMS.",
        "Redesign des E-Commerce-Shops von NordicTrack mit dynamischen Komponenten, Light/Dark-Themes und CMS-integrierten Inhalten.",
        "Bereitstellung und Deployment von Anwendungsdiensten auf der Google Cloud Platform (GCP), inkl. Verwaltung der Cloud-Infrastruktur für produktive Kundenanwendungen.",
        "Automatisierung von Produktvarianten-Importen in CommerceTools durch eigene Daten-Pipelines — Wegfall stundenlanger manueller Katalogpflege.",
        "Sicherung der Codequalität durch Code-Reviews und Unit-Tests für Datentransformationslogik.",
      ],
    },
    variantBullets: {
      backend: [
        "Automated product-variant imports into CommerceTools with custom data pipelines, eliminating hours of manual catalog work.",
        "Provisioned and deployed application services on Google Cloud Platform (GCP), managing cloud infrastructure for production client applications.",
        "Built Galerías' (galerias.com) nationwide shopping-mall platform, integrating user authentication, Google Maps API, and a ContentStack headless CMS.",
        "Wrote unit tests for data formatting and transformation logic and performed code reviews under strict quality standards.",
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
        "Built and shipped React Native apps (food ordering, event scheduling), delivering to both the iOS App Store and Google Play with push notifications and authentication.",
        "Maintained and extended a project-management platform built with .NET and Vue.js — resolving production issues and adding features across the C# backend and Vue frontend.",
        "Integrated AWS end to end: Cognito, Lambda, API Gateway, SNS, SES, S3, DynamoDB, and CloudFormation.",
      ],
      de: [
        "Leitung der Entwicklung einer serverlosen SaaS-Logistikplattform auf AWS nach SOLID-Prinzipien und Architektur-Best-Practices.",
        "Entwicklung und Veröffentlichung von React-Native-Apps (Essensbestellung, Event-Planung) im iOS App Store und bei Google Play, inkl. Push-Benachrichtigungen und Authentifizierung.",
        "Wartung und Erweiterung einer Projektmanagement-Plattform mit .NET und Vue.js — Behebung von Produktionsfehlern und neue Features im C#-Backend und Vue-Frontend.",
        "End-to-End-Integration von AWS: Cognito, Lambda, API Gateway, SNS, SES, S3, DynamoDB und CloudFormation.",
      ],
    },
    variantBullets: {
      backend: [
        "Led development of a serverless SaaS logistics platform on AWS, applying SOLID principles and architecture best practices.",
        "Integrated AWS end to end: IAM, Cognito, Lambda, API Gateway, SNS, SES, S3, DynamoDB, and CloudFormation (infrastructure as code).",
        "Maintained and extended a project-management platform built with .NET and Vue.js — resolving production issues and adding features in the C# backend.",
        "Built authentication and push-notification services for React Native apps shipped to the iOS App Store and Google Play.",
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
    variantBullets: {
      backend: [
        "Collaborated on redesigning VMware's global validation system, optimizing queries over large data-center datasets.",
        "Refactored and optimized a high-volume automated email system driven by complex business rules.",
        "Built institutional apps and reporting dashboards for US-based clients.",
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
    variantBullets: {
      backend: [
        "Automated a full packaging production line for Mexico's leading nationwide pharmacy chain — fewer manual errors and real-time process monitoring.",
        "Built shop-floor production-control software: barcode-scanner integration and a custom state machine tracking every step of the process flow.",
        "Developed a camera service recording each station's activity and storing logs for full production traceability across major brands.",
        "Built admin dashboards and a ticketing system for shipment tracking; wrote Python scripts optimizing campaign configurations for faster, more accurate packaging.",
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

export function getCvData(variant: Variant, lang: Lang): CvData {
  return {
    name: contact.name,
    title: titles[variant],
    location: contact.location,
    phone: contact.phone,
    email: contact.email,
    linkedin: contact.linkedin,
    github: contact.github,
    portfolio: contact.portfolio[lang],
    summary: summaries[variant][lang],
    skills: skills[variant][lang],
    languages: languages[lang],
    experience: experience.map((exp) => ({
      company: exp.company,
      title: exp.title,
      period: exp.period,
      location: exp.location,
      bullets: exp.variantBullets?.[variant] ?? exp.bullets[lang],
    })),
    education: education[lang],
    certifications,
    personal: {
      nationality: contact.nationality[lang],
      address: contact.address[lang],
    },
  };
}

// Everything AI tailoring may draw from (EN only): each role's shared bullets plus every variant override.
export function getCvFacts() {
  return {
    titles: Object.values(titles),
    summaries: Object.values(summaries).map((s) => s.en),
    skills: [...new Set(Object.values(skills).flatMap((s) => s.en.flatMap((g) => g.values)))],
    experience: experience.map((e) => ({
      company: e.company,
      title: e.title,
      period: e.period,
      bullets: [
        ...new Set([...e.bullets.en, ...Object.values(e.variantBullets ?? {}).flatMap((b) => b ?? [])]),
      ],
    })),
    education: education.en,
    certifications,
    languages: languages.en,
  };
}
