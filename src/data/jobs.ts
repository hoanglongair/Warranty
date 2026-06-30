import type { Job } from "@/types";

const employers = [
  {
    id: "emp-1",
    name: "Aurora Labs",
    avatar: "/avatars/aurora.png",
    walletAddress: "0x7a3F8B92c5E4d8b1A6F9C2E7D3B8A4F1C9E6B2D5A",
    rating: 4.9,
    reviews: 127,
    jobsPosted: 38,
    totalSpent: 284000,
    memberSince: "Mar 2022",
    verified: true,
    company: "Aurora Labs Inc.",
    location: "San Francisco, CA"
  },
  {
    id: "emp-2",
    name: "Nebula DAO",
    avatar: "/avatars/nebula.png",
    walletAddress: "0x9b4E7A82c1F5d3C6B8A4E9F2D7C1B5A8E3F6C9D2B",
    rating: 4.8,
    reviews: 89,
    jobsPosted: 24,
    totalSpent: 156000,
    memberSince: "Jul 2022",
    verified: true,
    company: "Nebula Collective",
    location: "Singapore"
  },
  {
    id: "emp-3",
    name: "Prism Studio",
    avatar: "/avatars/prism.png",
    walletAddress: "0x3c8A9F1B4E7D2C5A8B6F1D9E4C7A2B5F8D1C4A7E0",
    rating: 5.0,
    reviews: 213,
    jobsPosted: 56,
    totalSpent: 412000,
    memberSince: "Jan 2021",
    verified: true,
    company: "Prism Design Studio",
    location: "Berlin, Germany"
  },
  {
    id: "emp-4",
    name: "Vertex Capital",
    avatar: "/avatars/vertex.png",
    walletAddress: "0x6E2D8B1A4C7F3D9B5A8E2C1D6F4B7A3C9E2D5F8B1",
    rating: 4.7,
    reviews: 64,
    jobsPosted: 19,
    totalSpent: 98000,
    memberSince: "Oct 2023",
    verified: true,
    company: "Vertex Capital Partners",
    location: "London, UK"
  }
];

export const jobs: Job[] = [
  {
    id: "job-001",
    title: "Web3 Landing Page Design",
    description:
      "Design a high-converting landing page for our upcoming DeFi protocol launch. We need a sleek, modern design that communicates trust and innovation.",
    longDescription:
      "We are launching a next-generation DeFi protocol and need a landing page that stands out. The design should reflect cutting-edge Web3 aesthetics, with glassmorphism, smooth gradients, and interactive elements. You will work closely with our product and marketing team to translate the brand vision into a pixel-perfect experience. Previous experience designing for Web3 or crypto products is highly preferred.",
    category: "design",
    subcategory: "Web3 UI Design",
    budget: 1500,
    skills: ["Figma", "UI Design", "Web3", "Landing Pages", "Animation"],
    experience: "intermediate",
    duration: "2-3 weeks",
    type: "remote",
    status: "open",
    deadline: "2026-07-05",
    postedAt: "2026-06-08T10:00:00Z",
    applicants: 24,
    proposals: [],
    employer: employers[0],
    requirements: [
      "3+ years of UI/UX design experience",
      "Strong portfolio with Web3 or fintech projects",
      "Proficiency in Figma and prototyping tools",
      "Understanding of responsive design principles",
      "Ability to deliver source files and design systems"
    ],
    deliverables: [
      "High-fidelity Figma designs for desktop, tablet, and mobile",
      "Interactive prototype with key user flows",
      "Design system with components and tokens",
      "Asset exports in multiple formats",
      "Handoff documentation for developers"
    ]
  },
  {
    id: "job-002",
    title: "React Dashboard Development",
    description:
      "Build a comprehensive analytics dashboard for our SaaS platform using React, TypeScript, and modern UI libraries.",
    longDescription:
      "We need a full-featured analytics dashboard for our growing SaaS platform. The dashboard will display real-time metrics, charts, and reports. You will integrate with our REST API, implement authentication, and ensure the UI is performant and accessible. We expect clean code, thorough testing, and a polished final product.",
    category: "development",
    subcategory: "Frontend Development",
    budget: 3500,
    skills: ["React", "TypeScript", "Tailwind CSS", "Recharts", "Next.js"],
    experience: "expert",
    duration: "1-2 months",
    type: "remote",
    status: "open",
    deadline: "2026-07-20",
    postedAt: "2026-06-10T14:30:00Z",
    applicants: 41,
    proposals: [],
    employer: employers[1],
    requirements: [
      "5+ years of React development experience",
      "Strong TypeScript skills",
      "Experience with modern UI libraries (shadcn/ui, Radix)",
      "Familiarity with data visualization libraries",
      "Understanding of accessibility standards (WCAG)"
    ],
    deliverables: [
      "Fully functional React dashboard application",
      "Reusable component library",
      "Authentication and authorization flow",
      "Comprehensive test suite",
      "Deployment documentation"
    ]
  },
  {
    id: "job-003",
    title: "Telegram Trading Bot",
    description:
      "Develop a sophisticated Telegram trading bot with advanced order types, real-time price feeds, and portfolio tracking.",
    longDescription:
      "We are building a Telegram-based trading bot that allows users to execute trades directly from chat. The bot should support multiple DEXs, advanced order types (limit, stop-loss, take-profit), real-time price alerts, and a portfolio dashboard. Strong knowledge of blockchain integrations and Telegram Bot API is essential.",
    category: "development",
    subcategory: "Telegram Bots",
    budget: 7000,
    skills: ["Node.js", "Telegram Bot API", "Web3", "Solidity", "PostgreSQL"],
    experience: "expert",
    duration: "2-3 months",
    type: "remote",
    status: "open",
    deadline: "2026-08-15",
    postedAt: "2026-06-11T09:15:00Z",
    applicants: 18,
    proposals: [],
    employer: employers[0],
    requirements: [
      "Proven experience building Telegram bots",
      "Strong Web3 and DEX integration knowledge",
      "Solidity smart contract understanding",
      "Database design and optimization skills",
      "Security-first mindset"
    ],
    deliverables: [
      "Production-ready Telegram bot with full trading features",
      "Smart contract integration layer",
      "Admin panel for monitoring and management",
      "User onboarding flow",
      "Technical documentation"
    ]
  },
  {
    id: "job-004",
    title: "SEO Strategy for SaaS",
    description:
      "Develop and execute a comprehensive SEO strategy to drive organic growth for our B2B SaaS platform.",
    longDescription:
      "We are a B2B SaaS platform looking to scale our organic traffic and inbound leads. We need an SEO expert to audit our current presence, identify opportunities, and execute a 6-month content and technical SEO strategy. The goal is to rank on page 1 for our core keywords and grow organic traffic by 300%.",
    category: "marketing",
    subcategory: "SEO",
    budget: 2000,
    skills: ["SEO", "Ahrefs", "Content Strategy", "Technical SEO", "Analytics"],
    experience: "intermediate",
    duration: "6 months",
    type: "remote",
    status: "open",
    deadline: "2026-07-30",
    postedAt: "2026-06-09T16:45:00Z",
    applicants: 32,
    proposals: [],
    employer: employers[2],
    requirements: [
      "3+ years of B2B SaaS SEO experience",
      "Proven track record of organic growth",
      "Proficiency with SEO tools (Ahrefs, SEMrush, GSC)",
      "Strong analytical and reporting skills",
      "Content strategy experience"
    ],
    deliverables: [
      "Comprehensive SEO audit and opportunity report",
      "6-month content calendar with target keywords",
      "Monthly performance reports",
      "Technical SEO recommendations and implementation guide",
      "Backlink strategy and outreach templates"
    ]
  },
  {
    id: "job-005",
    title: "Brand Identity Package",
    description:
      "Create a complete brand identity for our new AI startup, including logo, typography, color system, and brand guidelines.",
    longDescription:
      "We are launching a new AI-focused startup and need a complete brand identity from the ground up. The brand should feel modern, trustworthy, and innovative. The package should include a primary logo, logo variations, typography system, color palette, brand voice, and a comprehensive brand guidelines document. We want a brand that scales across web, mobile, and print.",
    category: "design",
    subcategory: "Brand Identity",
    budget: 4000,
    skills: ["Brand Design", "Logo Design", "Figma", "Typography", "Illustration"],
    experience: "expert",
    duration: "1 month",
    type: "remote",
    status: "open",
    deadline: "2026-07-12",
    postedAt: "2026-06-07T11:20:00Z",
    applicants: 56,
    proposals: [],
    employer: employers[3],
    requirements: [
      "5+ years of brand identity design experience",
      "Strong portfolio with full brand systems",
      "Mastery of typography and color theory",
      "Experience with AI or tech brands preferred",
      "Ability to articulate brand strategy"
    ],
    deliverables: [
      "Primary logo and 5+ variations",
      "Complete color palette with usage guidelines",
      "Typography system (display, body, mono)",
      "Icon set and brand patterns",
      "40+ page brand guidelines document"
    ]
  },
  {
    id: "job-006",
    title: "English-Vietnamese Translation",
    description:
      "Translate our technical documentation and marketing materials from English to Vietnamese with high accuracy and cultural nuance.",
    longDescription:
      "We are expanding our SaaS product to the Vietnamese market and need a native Vietnamese translator with technical fluency. You will translate our product documentation, marketing website, help articles, and email campaigns. Understanding of software terminology and cultural nuance is critical for this project.",
    category: "content",
    subcategory: "Translation",
    budget: 800,
    skills: ["Translation", "Vietnamese", "Technical Writing", "Localization"],
    experience: "intermediate",
    duration: "3 weeks",
    type: "remote",
    status: "open",
    deadline: "2026-07-01",
    postedAt: "2026-06-12T08:00:00Z",
    applicants: 19,
    proposals: [],
    employer: employers[1],
    requirements: [
      "Native Vietnamese speaker with fluent English",
      "2+ years of translation experience",
      "Familiarity with software/tech terminology",
      "Experience with CAT tools",
      "Attention to detail and cultural awareness"
    ],
    deliverables: [
      "Translated product documentation (approx. 15,000 words)",
      "Localized marketing website copy",
      "Translated help center articles",
      "Email campaign translations",
      "Translation glossary for consistency"
    ]
  },
  {
    id: "job-007",
    title: "Community Growth Campaign",
    description:
      "Design and execute a 3-month community growth campaign across Discord, Twitter, and Telegram for our Web3 protocol.",
    longDescription:
      "We are launching a Web3 protocol and need to build a thriving community from scratch. You will design and execute a comprehensive community growth strategy across Discord, Twitter, and Telegram, including content calendars, engagement campaigns, ambassador programs, and partnership outreach. The goal is to reach 50K community members within 3 months.",
    category: "marketing",
    subcategory: "Community Management",
    budget: 5500,
    skills: ["Community Management", "Discord", "Twitter", "Web3", "Growth Hacking"],
    experience: "expert",
    duration: "3 months",
    type: "remote",
    status: "open",
    deadline: "2026-07-25",
    postedAt: "2026-06-06T13:30:00Z",
    applicants: 27,
    proposals: [],
    employer: employers[0],
    requirements: [
      "Proven track record growing Web3 communities to 50K+",
      "Deep understanding of crypto Twitter culture",
      "Experience running ambassador and incentive programs",
      "Strong content and copywriting skills",
      "Analytics-driven approach to community growth"
    ],
    deliverables: [
      "Comprehensive community growth strategy",
      "Discord server setup and moderation framework",
      "Weekly content calendar across platforms",
      "Ambassador program with 20+ members",
      "Monthly growth and engagement reports"
    ]
  },
  {
    id: "job-008",
    title: "AI Agent Development",
    description:
      "Build a sophisticated AI agent capable of autonomous task execution, reasoning, and tool usage for enterprise clients.",
    longDescription:
      "We are building a next-generation AI agent platform for enterprise clients. The agent should be capable of complex reasoning, tool usage, memory management, and multi-step task execution. You will work with cutting-edge LLMs, implement agent frameworks, and build production-grade infrastructure. This is a high-impact, technically challenging project with significant growth potential.",
    category: "development",
    subcategory: "AI / Machine Learning",
    budget: 10000,
    skills: ["Python", "LangChain", "OpenAI", "Vector Databases", "RAG"],
    experience: "expert",
    duration: "3-4 months",
    type: "remote",
    status: "open",
    deadline: "2026-08-30",
    postedAt: "2026-06-05T15:00:00Z",
    applicants: 12,
    proposals: [],
    employer: employers[3],
    requirements: [
      "5+ years of Python and ML engineering experience",
      "Deep knowledge of LLM frameworks (LangChain, LlamaIndex)",
      "Experience building production AI systems",
      "Understanding of prompt engineering and RAG",
      "Strong system design skills"
    ],
    deliverables: [
      "Production-ready AI agent with multi-step reasoning",
      "Tool integration framework",
      "Memory and context management system",
      "Evaluation and monitoring pipeline",
      "Technical documentation and API reference"
    ]
  }
];

export const categories = [
  {
    id: "design",
    name: "Design",
    icon: "Palette",
    color: "from-pink-500 to-rose-500",
    glow: "rgba(236, 72, 153, 0.4)",
    count: 1248,
    subcategories: ["Logo Design", "UI/UX Design", "Banner Design", "Brand Identity"]
  },
  {
    id: "development",
    name: "Development",
    icon: "Code2",
    color: "from-violet-500 to-indigo-500",
    glow: "rgba(139, 92, 246, 0.4)",
    count: 2891,
    subcategories: [
      "Website Development",
      "Mobile App Development",
      "Telegram Bots",
      "Discord Bots",
      "Smart Contracts",
      "Web3 Development"
    ]
  },
  {
    id: "content",
    name: "Content",
    icon: "PenLine",
    color: "from-amber-500 to-orange-500",
    glow: "rgba(245, 158, 11, 0.4)",
    count: 743,
    subcategories: ["Copywriting", "Translation", "Blog Writing", "Technical Writing"]
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: "TrendingUp",
    color: "from-cyan-500 to-teal-500",
    glow: "rgba(6, 182, 212, 0.4)",
    count: 612,
    subcategories: ["SEO", "Social Media", "Paid Advertising", "Community Management"]
  }
];

export const marketplaceStats = {
  totalJobs: 5494,
  totalFreelancers: 18432,
  totalVolume: 28400000,
  avgRating: 4.9,
  countries: 142,
  completionRate: 98
};
