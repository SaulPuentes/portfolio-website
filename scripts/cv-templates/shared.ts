export interface ExperienceEntry {
  company: string;
  title: string;
  period: string;
  location?: string;
  bullets: string[];
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
  skills: {
    frontend: string[];
    backend: string[];
    tools: string[];
  };
  languages: { name: string; level: string }[];
  experience: ExperienceEntry[];
  education: {
    institution: string;
    degree: string;
    period: string;
  };
  certifications: string[];
  personal: {
    birthDate: string;
    nationality: string;
    address: string;
  };
}

export const cvData: CvData = {
  name: "Saúl Puentes",
  title: "Senior Full Stack Developer",
  location: "Monterrey, Nuevo León, México",
  phone: "+52 812 401 8274",
  email: "saul.puentess@gmail.com",
  linkedin: "linkedin.com/in/saul-puentes",
  github: "github.com/SaulPuentes",
  portfolio: "saulpuentes.com",
  summary:
    "Full Stack Developer with 8 years of experience building scalable web and mobile applications across e-commerce, logistics, and SaaS. Expert in JavaScript/TypeScript ecosystems — React, Next.js, Node.js, and AWS — with a track record of translating complex business requirements into production-ready solutions. Experienced in leading feature development, designing serverless architectures, and integrating headless CMS platforms for enterprise clients.",

  skills: {
    frontend: ["React", "Next.js", "Tailwind CSS", "React Native"],
    backend: [
      "Node.js",
      "NestJS",
      "Payload CMS",
      "Shopify (Liquid/APIs)",
      "WordPress",
    ],
    tools: [
      "AWS (Lambda, Cognito, S3, DynamoDB)",
      "Docker",
      "REST / GraphQL",
      "MongoDB",
      "Git",
      "CI/CD",
    ],
  },

  languages: [
    { name: "Español", level: "Muttersprache" },
    { name: "English", level: "C2 (EF SET Proficient)" },
    { name: "Deutsch", level: "A1/A2 (Grundkenntnisse)" },
  ],

  experience: [
    {
      company: "Freelance",
      title: "Software Developer",
      period: "Apr 2025 – Present",
      bullets: [
        "Built custom Shopify themes and WordPress sites driving measurable e-commerce growth and lead capture for corporate clients.",
        "Rebuilt the complete UI for a test automation platform (muuktest.com), improving usability and brand consistency.",
        "Delivered fully self-manageable websites enabling business owners to update content independently, reducing maintenance costs.",
        "Currently developing a nationwide social dance events platform with multilingual support using Payload CMS and Next.js.",
      ],
    },
    {
      company: "Orium",
      title: "Full Stack Developer",
      period: "Oct 2025 – Feb 2026",
      bullets: [
        "Implemented secure digital payment processing with Stripe for Grupo Xcaret, Mexico's leading tourism company, enabling PCI-compliant checkout flows at scale.",
        "Designed and prototyped high-fidelity UI interfaces to streamline the booking and purchase experience.",
      ],
    },
    {
      company: "Gluo",
      title: "Full Stack Developer",
      period: "Jul 2024 – Apr 2025",
      bullets: [
        "Built Galerías' (galerias.com) nationwide shopping mall platform with user auth, interactive maps, and a fully customizable CMS.",
        "Redesigned NordicTrack's e-commerce site with dynamic components, light/dark themes, and CMS-integrated content.",
        "Developed data-upload scripts automating product variant imports into CommerceTools.",
        "Conducted code reviews and wrote unit tests for data formatting and transformation logic.",
      ],
    },
    {
      company: "Blue People",
      title: "Full Stack Developer",
      period: "Apr 2023 – Jun 2024",
      bullets: [
        "Led development of a serverless SaaS logistics platform applying SOLID principles and AWS best practices.",
        "Built and deployed React Native mobile apps (food ordering, event scheduling) to App Store and Play Store.",
        "Integrated AWS services: Cognito, Lambda, API Gateway, SNS, SES, S3, DynamoDB, and CloudFormation.",
      ],
    },
    {
      company: "Enroute",
      title: "Full Stack Developer",
      period: "Jan 2021 – Mar 2023",
      bullets: [
        "Collaborated on redesigning VMware's global validation system, improving query performance for large data center datasets.",
        "Refactored a high-volume automated email system tied to complex business rules.",
        "Built institutional React Native apps for US-based clients and led front-end dashboard improvements.",
      ],
    },
    {
      company: "Helicon",
      title: "Full Stack Developer",
      period: "May 2019 – Nov 2020",
      bullets: [
        "Automated a full packaging production line for a leading nationwide pharmacy chain, reducing manual errors and enabling real-time monitoring.",
        "Built production line interfaces using barcode scanners and a custom state machine to track process flow.",
        "Developed admin dashboards, video logging tools, and a ticketing system for shipment tracking.",
      ],
    },
    {
      company: "Grupo 4S",
      title: "Web Master",
      period: "Feb 2018 – Apr 2019",
      location: "San Pedro Garza García, México",
      bullets: [
        "Built and maintained WordPress websites, optimizing load times and improving Google PageSpeed and SEO rankings.",
        "Developed responsive custom WordPress themes from scratch with design and marketing teams.",
        "Implemented lead-tracking scripts and integrated automated workflows using Zapier.",
      ],
    },
  ],

  education: {
    institution: "Universidad Autónoma de Nuevo León (UANL)",
    degree: "Ingeniería en Tecnologías de Software",
    period: "2015 – 2020",
  },

  certifications: [
    "MongoDB — The Complete Developer's Guide 2022",
    "EF SET English Certificate C2 Proficient",
    "Learn Ruby on Rails Course",
  ],

  personal: {
    birthDate: "1997",
    nationality: "Mexican",
    address: "Via Burgos, Monterrey, México",
  },
};
