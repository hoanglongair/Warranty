import type { Freelancer } from "@/types";

export const freelancers: Freelancer[] = [
  {
    id: "fre-001",
    name: "Linh Nguyen",
    avatar: "/avatars/linh.png",
    title: "Senior Web3 Designer & Brand Strategist",
    walletAddress: "0x5a2E8B1C4D7F3A9B6E1C4D8F2A5B9E3C7D1F4A8B2",
    rating: 4.98,
    reviews: 142,
    completedJobs: 187,
    hourlyRate: 85,
    skills: ["Figma", "Web3 Design", "Brand Identity", "UI/UX", "Motion Design"],
    bio: "Award-winning designer specializing in Web3, fintech, and SaaS brands. I help startups translate complex ideas into beautiful, intuitive experiences.",
    location: "Ho Chi Minh City, Vietnam",
    verified: true,
    badges: ["Top Rated", "Web3 Verified", "Quick Responder"],
    earnings: 248000,
    responseTime: "1 hour",
    memberSince: "Jan 2022",
    portfolio: [
      { id: "p1", title: "DeFi Protocol Branding", image: "/portfolio/1.jpg", category: "design" },
      { id: "p2", title: "NFT Marketplace UI", image: "/portfolio/2.jpg", category: "design" },
      { id: "p3", title: "Crypto Wallet App", image: "/portfolio/3.jpg", category: "design" }
    ]
  },
  {
    id: "fre-002",
    name: "Marcus Chen",
    avatar: "/avatars/marcus.png",
    title: "Full-Stack Engineer | React, Next.js, Solidity",
    walletAddress: "0x8B3C5E2A9D4F1B6C8E3A5D2F9B4C7E1A6D9F2B5C8",
    rating: 4.95,
    reviews: 98,
    completedJobs: 124,
    hourlyRate: 120,
    skills: ["React", "Next.js", "TypeScript", "Solidity", "Node.js", "PostgreSQL"],
    bio: "Full-stack engineer with 8+ years of experience building scalable web applications. Specialized in React, Next.js, and Solidity smart contracts.",
    location: "Singapore",
    verified: true,
    badges: ["Top Rated", "Solidity Expert", "Rising Talent"],
    earnings: 412000,
    responseTime: "30 min",
    memberSince: "Mar 2021",
    portfolio: [
      { id: "p4", title: "SaaS Analytics Platform", image: "/portfolio/4.jpg", category: "development" },
      { id: "p5", title: "DEX Smart Contracts", image: "/portfolio/5.jpg", category: "development" }
    ]
  },
  {
    id: "fre-003",
    name: "Sofia Rodriguez",
    avatar: "/avatars/sofia.png",
    title: "Content Strategist & Copywriter",
    walletAddress: "0x2C9D4B7A1E5F3C8B6A2D9E4F1C7B5A8D3E6F9C2B5",
    rating: 4.92,
    reviews: 76,
    completedJobs: 89,
    hourlyRate: 65,
    skills: ["Copywriting", "Content Strategy", "SEO", "Brand Voice", "Storytelling"],
    bio: "I craft compelling narratives that convert. Specialized in B2B SaaS, fintech, and Web3 content that drives engagement and growth.",
    location: "Barcelona, Spain",
    verified: true,
    badges: ["Top Rated", "Content Expert"],
    earnings: 156000,
    responseTime: "2 hours",
    memberSince: "Aug 2022",
    portfolio: [
      { id: "p6", title: "SaaS Website Copy", image: "/portfolio/6.jpg", category: "content" },
      { id: "p7", title: "Brand Voice Guide", image: "/portfolio/7.jpg", category: "content" }
    ]
  },
  {
    id: "fre-004",
    name: "Aarav Patel",
    avatar: "/avatars/aarav.png",
    title: "Telegram & Discord Bot Developer",
    walletAddress: "0x7E2A5B8C1D4F9E3B6A8C2D5F1B7E4A9C3D6F2B5E8",
    rating: 4.97,
    reviews: 113,
    completedJobs: 156,
    hourlyRate: 95,
    skills: ["Node.js", "Python", "Telegram API", "Discord.js", "Web3", "Trading Bots"],
    bio: "I build powerful, secure bots for crypto communities. From trading bots to community engagement tools, I deliver production-ready solutions.",
    location: "Bangalore, India",
    verified: true,
    badges: ["Top Rated", "Bot Specialist", "Web3 Verified"],
    earnings: 324000,
    responseTime: "1 hour",
    memberSince: "May 2021",
    portfolio: [
      { id: "p8", title: "Trading Bot", image: "/portfolio/8.jpg", category: "development" },
      { id: "p9", title: "Community Bot", image: "/portfolio/9.jpg", category: "development" }
    ]
  },
  {
    id: "fre-005",
    name: "Emma Schmidt",
    avatar: "/avatars/emma.png",
    title: "SEO & Growth Marketing Expert",
    walletAddress: "0x4D8B2C5E9A3F1D6B7C4A9E2D5F8B1C6A3D9E4F7B2",
    rating: 4.89,
    reviews: 67,
    completedJobs: 78,
    hourlyRate: 110,
    skills: ["SEO", "Content Strategy", "Technical SEO", "Ahrefs", "Analytics"],
    bio: "I help B2B SaaS companies grow organic traffic 3-5x in 6 months. Data-driven, transparent, and focused on ROI.",
    location: "Berlin, Germany",
    verified: true,
    badges: ["Top Rated", "SEO Verified"],
    earnings: 198000,
    responseTime: "3 hours",
    memberSince: "Sep 2022",
    portfolio: [
      { id: "p10", title: "SaaS Growth Case Study", image: "/portfolio/10.jpg", category: "marketing" }
    ]
  },
  {
    id: "fre-006",
    name: "Kenji Tanaka",
    avatar: "/avatars/kenji.png",
    title: "AI/ML Engineer | LangChain, RAG, Agents",
    walletAddress: "0x6F1B4C8A2D5E9B3C7F1A4D8B2C6E5F9A3D7B1C4E8",
    rating: 4.96,
    reviews: 54,
    completedJobs: 61,
    hourlyRate: 150,
    skills: ["Python", "LangChain", "OpenAI", "Vector DB", "RAG", "AI Agents"],
    bio: "Building production-grade AI systems for enterprise clients. Specialized in agentic workflows, RAG pipelines, and LLM optimization.",
    location: "Tokyo, Japan",
    verified: true,
    badges: ["Top Rated", "AI Expert", "Rising Talent"],
    earnings: 287000,
    responseTime: "2 hours",
    memberSince: "Feb 2023",
    portfolio: [
      { id: "p11", title: "Enterprise AI Agent", image: "/portfolio/11.jpg", category: "development" }
    ]
  }
];
