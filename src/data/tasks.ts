import type { Task, TaskWorker, TaskEmployer, MicroGig } from "@/types/task";

const employers: TaskEmployer[] = [
  {
    id: "emp-task-1",
    name: "Aurora Labs",
    avatar: "/avatars/aurora.png",
    walletAddress: "0x7a3F8B92c5E4d8b1A6F9C2E7D3B8A4F1C9E6B2D5A",
    rating: 4.9,
    reviews: 127,
    tasksPosted: 45,
    tasksCompleted: 42,
    verified: true,
    company: "Aurora Labs Inc.",
    location: "San Francisco, CA",
    memberSince: "Mar 2022"
  },
  {
    id: "emp-task-2",
    name: "Nebula DAO",
    avatar: "/avatars/nebula.png",
    walletAddress: "0x9b4E7A82c1F5d3C6B8A4E9F2D7C1B5A8E3F6C9D2B",
    rating: 4.8,
    reviews: 89,
    tasksPosted: 28,
    tasksCompleted: 26,
    verified: true,
    company: "Nebula Collective",
    location: "Singapore",
    memberSince: "Jul 2022"
  },
  {
    id: "emp-task-3",
    name: "Prism Studio",
    avatar: "/avatars/prism.png",
    walletAddress: "0x3c8A9F1B4E7D2C5A8B6F1D9E4C7A2B5F8D1C4A7E0",
    rating: 5.0,
    reviews: 213,
    tasksPosted: 67,
    tasksCompleted: 65,
    verified: true,
    company: "Prism Design Studio",
    location: "Berlin, Germany",
    memberSince: "Jan 2021"
  }
];

const workers: TaskWorker[] = [
  {
    id: "worker-1",
    name: "Minh Tran",
    avatar: "/avatars/minh.png",
    walletAddress: "0x5a2E8B1C4D7F3A9B6E1C4D8F2A5B9E3C7D1F4A8B2",
    rating: 4.95,
    reviews: 89,
    tasksCompleted: 234,
    totalEarned: 12450,
    verified: true,
    badges: ["Top Earner", "Quick Turnaround", "Verified"],
    skills: ["Data Entry", "Web Research", "Copywriting", "Translation"],
    bio: "Detail-oriented professional with 5+ years of experience in data entry and research.",
    location: "Ho Chi Minh City, Vietnam",
    memberSince: "Jan 2023",
    responseTime: "Under 1 hour"
  },
  {
    id: "worker-2",
    name: "Alex Kim",
    avatar: "/avatars/alex.png",
    walletAddress: "0x8B3C5E2A9D4F1B6C8E3A5D2F9B4C7E1A6D9F2B5C8",
    rating: 4.88,
    reviews: 156,
    tasksCompleted: 412,
    totalEarned: 18900,
    verified: true,
    badges: ["Speed Demon", "Quality Pro", "Rising Star"],
    skills: ["Logo Design", "Banner Design", "Social Media Graphics", "Figma"],
    bio: "Creative designer specializing in social media graphics and branding materials.",
    location: "Seoul, South Korea",
    memberSince: "Aug 2022",
    responseTime: "Under 2 hours"
  },
  {
    id: "worker-3",
    name: "Sarah Chen",
    avatar: "/avatars/sarah.png",
    walletAddress: "0x2C9D4B7A1E5F3C8B6A2D9E4F1C7B5A8D3E6F9C2B5",
    rating: 4.92,
    reviews: 78,
    tasksCompleted: 189,
    totalEarned: 8920,
    verified: true,
    badges: ["Bug Hunter", "Code Master", "Web3 Verified"],
    skills: ["QA Testing", "Bug Reporting", "Website Testing", "UX Review"],
    bio: "Expert QA tester helping businesses deliver flawless products.",
    location: "Toronto, Canada",
    memberSince: "Mar 2023",
    responseTime: "Under 30 min"
  },
  {
    id: "worker-4",
    name: "David Nguyen",
    avatar: "/avatars/david.png",
    walletAddress: "0x7E2A5B8C1D4F9E3B6A8C2D5F1B7E4A9C3D6F2B5E8",
    rating: 4.78,
    reviews: 45,
    tasksCompleted: 98,
    totalEarned: 4560,
    verified: true,
    badges: ["New Talent", "Quick Learner"],
    skills: ["Content Writing", "Blog Posts", "SEO Articles", "Product Reviews"],
    bio: "Freelance writer with a passion for creating engaging content.",
    location: "Sydney, Australia",
    memberSince: "Nov 2023",
    responseTime: "Under 3 hours"
  }
];

export const tasks: Task[] = [
  // DESIGN TASKS
  {
    id: "task-001",
    title: "Design 5 Social Media Post Templates",
    description: "Create 5 editable Instagram post templates for product launch. Simple, modern design with placeholder text.",
    detailedInstructions: "Create 5 Instagram post templates (1080x1080px) for our upcoming product launch. Each template should have:\n\n1. A unique layout/design but consistent color scheme\n2. Space for product image placeholder\n3. Text overlay area for headlines\n4. Consistent branding elements (logo, fonts)\n\nStyle: Modern, minimalist, use our brand colors (Purple #7C3AED, White, Black)\n\nDeliver as: Figma files or PNG exports\n\nEach approved template = $15 reward",
    category: "design",
    subcategory: "Social Media Design",
    difficulty: "medium",
    reward: 75,
    timeEstimate: "2-3 hours",
    deadline: "2026-07-05",
    status: "open",
    postedAt: "2026-06-28T10:00:00Z",
    employer: employers[0],
    skills: ["Figma", "Social Media", "Graphic Design", "Instagram"],
    requirements: [
      "1080x1080px dimensions",
      "Editable layers in Figma",
      "Modern, minimalist style",
      "Use brand colors provided",
      "Include placeholder images"
    ],
    deliverables: [
      "5 Figma files with templates",
      "Export each template as PNG",
      "Brief design documentation"
    ],
    submissions: [],
    maxSubmissions: 5,
    currentSubmissions: 3,
    tags: ["figma", "instagram", "templates", "product-launch"]
  },
  {
    id: "task-002",
    title: "Create App Icon for Crypto Wallet",
    description: "Design a clean, modern app icon for a crypto wallet app. Simple enough to scale, distinctive enough to stand out.",
    detailedInstructions: "Design an app icon for 'CoinVault' - a crypto wallet application.\n\nRequirements:\n- Must be simple and recognizable at small sizes (even 16x16)\n- Vector-based (SVG)\n- Consider: shield, coin, vault, lock, hexagon shapes\n- Color palette: Blue (#2563EB) and Gold (#F59E0B)\n- Must look good on both light and dark backgrounds OR provide light/dark variants\n\nDeliverables:\n- SVG file\n- PNG at 1024x1024px\n- Light and dark versions\n\nReward per approved design: $25",
    category: "design",
    subcategory: "App Icon Design",
    difficulty: "medium",
    reward: 25,
    timeEstimate: "1-2 hours",
    deadline: "2026-07-03",
    status: "open",
    postedAt: "2026-06-29T14:00:00Z",
    employer: employers[1],
    skills: ["Vector Design", "App Icon", "Figma", "Crypto"],
    requirements: [
      "SVG vector format",
      "1024x1024 PNG export",
      "Works at small sizes",
      "Blue and Gold colors",
      "Light/dark variants"
    ],
    deliverables: [
      "SVG file (vector)",
      "1024x1024 PNG",
      "Light variant",
      "Dark variant"
    ],
    submissions: [],
    maxSubmissions: 10,
    currentSubmissions: 7,
    tags: ["app-icon", "crypto", "vector", "mobile"]
  },
  {
    id: "task-003",
    title: "Design Twitter Banner for DAO",
    description: "Create a Twitter banner that represents our DAO governance model. Abstract but meaningful.",
    detailedInstructions: "Design a Twitter banner (1500x500px) for 'Nebula DAO' that represents:\n\n- Decentralized governance\n- Community participation\n- Future/tech aesthetic\n\nStyle: Abstract, modern, Web3 vibes\nColors: Purple (#8B5CF6), Cyan (#06B6D4), Dark background\n\nCan use abstract shapes, geometric patterns, or conceptual illustrations.\n\nDeliver as: PNG, 1500x500px minimum\n\nReward: $20 per approved design",
    category: "design",
    subcategory: "Banner Design",
    difficulty: "easy",
    reward: 20,
    timeEstimate: "1 hour",
    deadline: "2026-07-02",
    status: "open",
    postedAt: "2026-06-30T09:00:00Z",
    employer: employers[1],
    skills: ["Banner Design", "Twitter", "Web3", "Abstract"],
    requirements: [
      "1500x500px dimensions",
      "PNG format",
      "Web3 aesthetic",
      "Purple/Cyan colors",
      "Abstract or geometric"
    ],
    deliverables: [
      "Banner PNG file",
      "Optional Figma source file"
    ],
    submissions: [],
    maxSubmissions: 15,
    currentSubmissions: 8,
    tags: ["twitter", "banner", "dao", "web3", "abstract"]
  },

  // DEVELOPMENT TASKS
  {
    id: "task-004",
    title: "Test Login Flow on Staging Website",
    description: "Test our staging login flow and report any bugs or UX issues. Take screenshots of any problems found.",
    detailedInstructions: "Test the login flow on our staging website at staging.nebulaprotocol.xyz\n\nTasks:\n1. Test registration with email\n2. Test login with email\n3. Test 'Forgot Password' flow\n4. Test social login (Google, Twitter)\n5. Test 2FA setup and verification\n6. Test logout\n\nReport:\n- Any bugs encountered\n- UX issues or confusing steps\n- Screenshots of problems\n- Screenshots of successful flows\n\nFormat: Google Doc or Notion page with:\n- Step by step test results\n- Screenshots\n- Severity of each bug (Low/Medium/High/Critical)\n\nReward: $30 for comprehensive bug report with screenshots",
    category: "development",
    subcategory: "QA Testing",
    difficulty: "easy",
    reward: 30,
    timeEstimate: "30-45 min",
    deadline: "2026-07-01",
    status: "open",
    postedAt: "2026-06-29T16:00:00Z",
    employer: employers[1],
    skills: ["QA Testing", "Bug Reporting", "UX Testing", "Screenshots"],
    requirements: [
      "Test all login scenarios",
      "Provide screenshots",
      "Categorize bug severity",
      "Clear bug descriptions",
      "Professional report format"
    ],
    deliverables: [
      "Bug report document",
      "Screenshots folder",
      "Summary of findings"
    ],
    submissions: [],
    maxSubmissions: 20,
    currentSubmissions: 12,
    tags: ["qa", "testing", "bugs", "ux", "login"]
  },
  {
    id: "task-005",
    title: "Write Python Script to Extract Product Data",
    description: "Write a Python script to scrape product data from an e-commerce site. Simple web scraping task.",
    detailedInstructions: "Write a Python script using BeautifulSoup or Selenium to extract product data from:\n\nURL: Will be provided after task acceptance\n\nData to extract:\n- Product name\n- Price\n- Rating\n- Number of reviews\n- Product image URL\n- Product URL\n\nRequirements:\n- Save to CSV file\n- Handle pagination (extract from multiple pages)\n- Handle rate limiting (add delays)\n- Include error handling\n- Add comments explaining the code\n\nDeliver:\n- Python script (.py file)\n- Sample output CSV (first 10 products)\n- Brief documentation\n\nReward: $40 for working script",
    category: "development",
    subcategory: "Web Scraping",
    difficulty: "medium",
    reward: 40,
    timeEstimate: "1-2 hours",
    deadline: "2026-07-04",
    status: "open",
    postedAt: "2026-06-28T11:00:00Z",
    employer: employers[0],
    skills: ["Python", "BeautifulSoup", "Web Scraping", "CSV"],
    requirements: [
      "Python script file",
      "Works without errors",
      "Handles pagination",
      "Saves to CSV format",
      "Well-commented code"
    ],
    deliverables: [
      "Python script",
      "Sample CSV output",
      "Documentation"
    ],
    submissions: [],
    maxSubmissions: 8,
    currentSubmissions: 4,
    tags: ["python", "scraping", "automation", "data"]
  },

  // CONTENT TASKS
  {
    id: "task-006",
    title: "Write 3 Product Descriptions for SaaS Tool",
    description: "Write compelling product descriptions for 3 features of our project management SaaS. Each 100-150 words.",
    detailedInstructions: "Write 3 product descriptions for our SaaS tool 'TaskFlow':\n\nFeature 1: Kanban Board\nFeature 2: Time Tracking\nFeature 3: Team Chat\n\nEach description should:\n- Be 100-150 words\n- Highlight benefits, not just features\n- Use a professional but friendly tone\n- Include a call-to-action\n- Be SEO-friendly (include relevant keywords)\n\nFormat:\n[Feature Name]\n[Description]\n[3 bullet points of benefits]\n[CTA]\n\nWe will provide:\n- Product overview\n- Target audience\n- Brand voice guidelines\n\nReward: $25 for all 3 descriptions",
    category: "content",
    subcategory: "Product Description",
    difficulty: "easy",
    reward: 25,
    timeEstimate: "1 hour",
    deadline: "2026-07-03",
    status: "open",
    postedAt: "2026-06-29T08:00:00Z",
    employer: employers[2],
    skills: ["Copywriting", "SaaS", "Product Writing", "SEO"],
    requirements: [
      "100-150 words each",
      "Benefit-focused writing",
      "SEO-friendly",
      "Professional tone",
      "Include CTAs"
    ],
    deliverables: [
      "3 product descriptions",
      "Formatted in provided template",
      "Brief keyword list used"
    ],
    submissions: [],
    maxSubmissions: 25,
    currentSubmissions: 15,
    tags: ["copywriting", "product", "saas", "description"]
  },
  {
    id: "task-007",
    title: "Translate 10 Product Pages to Vietnamese",
    description: "Translate product page content from English to Vietnamese. Cultural adaptation required.",
    detailedInstructions: "Translate the following content to Vietnamese with cultural adaptation:\n\n- 10 product page headlines (5-10 words each)\n- 10 product descriptions (50-100 words each)\n- 10 CTAs (2-5 words each)\n\nImportant:\n- Native Vietnamese speaker preferred\n- Adapt idioms and expressions, don't translate literally\n- Keep technical terms in English if commonly used\n- Ensure natural Vietnamese flow\n- Match the tone (professional, friendly)\n\nContent will be provided in English after task acceptance.\n\nReward: $35 for all translations",
    category: "content",
    subcategory: "Translation",
    difficulty: "easy",
    reward: 35,
    timeEstimate: "1-2 hours",
    deadline: "2026-07-05",
    status: "open",
    postedAt: "2026-06-29T10:00:00Z",
    employer: employers[0],
    skills: ["Vietnamese", "Translation", "Localization", "E-commerce"],
    requirements: [
      "Native Vietnamese",
      "Natural flow",
      "Cultural adaptation",
      "Accurate terminology",
      "Match tone"
    ],
    deliverables: [
      "Translated headlines",
      "Translated descriptions",
      "Translated CTAs",
      "Notes on adaptation choices"
    ],
    submissions: [],
    maxSubmissions: 15,
    currentSubmissions: 6,
    tags: ["translation", "vietnamese", "localization", "ecommerce"]
  },
  {
    id: "task-008",
    title: "Write 5 SEO Blog Post Outlines",
    description: "Create detailed outlines for 5 blog posts about productivity tips. Include headings, key points, and suggested word counts.",
    detailedInstructions: "Create detailed outlines for 5 blog posts on productivity:\n\nTopics:\n1. Remote Work Productivity\n2. Time Management Techniques\n3. Digital Detox for Professionals\n4. Morning Routines of Successful People\n5. Tools for Better Productivity\n\nEach outline must include:\n- SEO-optimized title (H1)\n- Meta description suggestion (150-160 chars)\n- 3-5 H2 subheadings\n- Key points under each H2\n- Suggested sources/stats to include\n- Target word count (800-1500 words)\n- Internal linking opportunities\n\nFormat: Google Doc with clear hierarchy\n\nReward: $30 for all 5 outlines",
    category: "content",
    subcategory: "Content Planning",
    difficulty: "easy",
    reward: 30,
    timeEstimate: "1-2 hours",
    deadline: "2026-07-04",
    status: "open",
    postedAt: "2026-06-30T07:00:00Z",
    employer: employers[2],
    skills: ["SEO", "Content Planning", "Blog Writing", "Research"],
    requirements: [
      "SEO-optimized titles",
      "Detailed outlines",
      "Include key points",
      "Word count suggestions",
      "Source recommendations"
    ],
    deliverables: [
      "5 complete outlines",
      "Google Doc format",
      "SEO suggestions"
    ],
    submissions: [],
    maxSubmissions: 20,
    currentSubmissions: 9,
    tags: ["seo", "blog", "outline", "content", "planning"]
  },

  // DATA TASKS
  {
    id: "task-009",
    title: "Enter 50 Product Listings to Spreadsheet",
    description: "Enter product information from images into a Google Sheet. Simple data entry task.",
    detailedInstructions: "Enter data from product images into this Google Sheet:\n[Sheet link provided after acceptance]\n\nData to enter for each product:\n- Product Name\n- SKU\n- Price (extract from image)\n- Category\n- Short Description\n- Image URL (we'll provide)\n\nSource: 50 product images will be provided\n\nRequirements:\n- Accurate data entry\n- Consistent formatting\n- Fill all required fields\n- Flag any unclear items\n\nReward: $20 for complete and accurate data entry",
    category: "data",
    subcategory: "Data Entry",
    difficulty: "easy",
    reward: 20,
    timeEstimate: "2-3 hours",
    deadline: "2026-07-06",
    status: "open",
    postedAt: "2026-06-29T12:00:00Z",
    employer: employers[0],
    skills: ["Data Entry", "Google Sheets", "Accuracy", "E-commerce"],
    requirements: [
      "Accurate data entry",
      "Complete all 50 products",
      "Consistent formatting",
      "Flag unclear items",
      "On-time delivery"
    ],
    deliverables: [
      "Completed Google Sheet",
      "Notes on unclear items"
    ],
    submissions: [],
    maxSubmissions: 30,
    currentSubmissions: 18,
    tags: ["data-entry", "spreadsheet", "products", "ecommerce"]
  },
  {
    id: "task-010",
    title: "Research 20 Competitors and Compile Report",
    description: "Research competitors for our B2B SaaS product. Find their pricing, features, and positioning.",
    detailedInstructions: "Research 20 competitors for our B2B project management SaaS.\n\nFor each competitor, find:\n- Company name and website\n- Pricing (plans and costs)\n- Key features (list 5-8)\n- Target audience\n- Strengths and weaknesses\n- Marketing positioning\n\nFormat: Google Sheet with columns for each data point\n\nProvide sources/links for each competitor's pricing page.\n\nDeliver as: Completed spreadsheet with all data\n\nReward: $45 for comprehensive research",
    category: "data",
    subcategory: "Market Research",
    difficulty: "medium",
    reward: 45,
    timeEstimate: "3-4 hours",
    deadline: "2026-07-07",
    status: "open",
    postedAt: "2026-06-28T15:00:00Z",
    employer: employers[2],
    skills: ["Market Research", "Competitive Analysis", "B2B SaaS", "Research"],
    requirements: [
      "20 competitors researched",
      "Pricing information",
      "Feature comparison",
      "Source citations",
      "Well-organized format"
    ],
    deliverables: [
      "Google Sheet with all data",
      "Source links",
      "Executive summary (optional)"
    ],
    submissions: [],
    maxSubmissions: 10,
    currentSubmissions: 4,
    tags: ["research", "competitors", "saas", "market-analysis"]
  },

  // MARKETING TASKS
  {
    id: "task-011",
    title: "Write 10 Twitter Threads on Web3 Topics",
    description: "Write engaging Twitter threads (5-7 tweets each) about Web3 concepts. Educational content for beginners.",
    detailedInstructions: "Write 10 Twitter threads on Web3 topics for our educational content:\n\nTopics (2 threads each):\n1. What is DeFi?\n2. How to use MetaMask\n3. Understanding NFTs\n4. Staking explained\n5. DAO basics\n\nEach thread:\n- 5-7 tweets long\n- Educational, beginner-friendly\n- Include relevant hashtags\n- Include a hook/opener tweet\n- End with engagement question\n\nStyle: Casual, informative, encouraging\n\nDeliver: Document with all 10 threads formatted for Twitter\n\nReward: $40 for all 10 threads",
    category: "marketing",
    subcategory: "Social Media Content",
    difficulty: "easy",
    reward: 40,
    timeEstimate: "2-3 hours",
    deadline: "2026-07-05",
    status: "open",
    postedAt: "2026-06-30T08:00:00Z",
    employer: employers[1],
    skills: ["Twitter", "Content Writing", "Web3", "Crypto"],
    requirements: [
      "5-7 tweets per thread",
      "Educational content",
      "Beginner-friendly",
      "Include hashtags",
      "Engagement hooks"
    ],
    deliverables: [
      "10 complete threads",
      "Formatted for Twitter",
      "Topic suggestions"
    ],
    submissions: [],
    maxSubmissions: 15,
    currentSubmissions: 7,
    tags: ["twitter", "web3", "content", "threads", "crypto"]
  },
  {
    id: "task-012",
    title: "Find 50 Email Addresses for Outreach",
    description: "Find professional email addresses for marketing outreach. LinkedIn and company website research.",
    detailedInstructions: "Find professional email addresses for:\n\n50 marketing managers or CMOs at:\n- SaaS companies\n- E-commerce brands\n- Tech startups\n\nFor each person, find:\n- Full name\n- Company name\n- Job title\n- LinkedIn profile URL\n- Email address (format: firstname.lastname@company.com or similar)\n\nRequirements:\n- Must be real, verified emails\n- Focus on US-based companies\n- Small to medium businesses (50-500 employees)\n- No gmail/yahoo emails\n\nDeliver: Google Sheet with all data\n\nReward: $35 for 50 verified emails",
    category: "marketing",
    subcategory: "Lead Generation",
    difficulty: "medium",
    reward: 35,
    timeEstimate: "2-3 hours",
    deadline: "2026-07-06",
    status: "open",
    postedAt: "2026-06-29T14:00:00Z",
    employer: employers[2],
    skills: ["Lead Generation", "LinkedIn", "Email Research", "Outreach"],
    requirements: [
      "50 verified emails",
      "Real company domains",
      "Proper job titles",
      "LinkedIn profiles",
      "No free email providers"
    ],
    deliverables: [
      "Google Sheet",
      "All required fields",
      "Verification notes"
    ],
    submissions: [],
    maxSubmissions: 12,
    currentSubmissions: 5,
    tags: ["lead-gen", "email", "outreach", "marketing"]
  }
];

export const microGigs: MicroGig[] = [
  {
    id: "gig-001",
    title: "I will design a professional logo for your brand",
    description: "Modern, minimalist logo design with 3 concepts and unlimited revisions until you're happy.",
    price: 50,
    category: "design",
    deliveryTime: "2 days",
    revisions: -1,
    features: [
      "3 logo concepts",
      "Vector files (SVG, AI)",
      "Stationery mockups",
      "Unlimited revisions"
    ],
    requirements: [
      "Brand name",
      "Industry",
      "Color preferences",
      "Style inspiration"
    ],
    seller: workers[1],
    rating: 4.9,
    sales: 234
  },
  {
    id: "gig-002",
    title: "I will write SEO-optimized blog content",
    description: "High-quality, engaging blog posts optimized for search engines. 1000+ words with keyword research included.",
    price: 35,
    category: "content",
    deliveryTime: "3 days",
    revisions: 2,
    features: [
      "1000+ word article",
      "Keyword research",
      "SEO optimization",
      "Plagiarism-free"
    ],
    requirements: [
      "Topic/keywords",
      "Target audience",
      "Word count preference",
      "Tone of voice"
    ],
    seller: workers[3],
    rating: 4.8,
    sales: 156
  },
  {
    id: "gig-003",
    title: "I will do data entry and web research for you",
    description: "Accurate, fast data entry services. Excel, Google Sheets, or any format you need.",
    price: 15,
    category: "data",
    deliveryTime: "1 day",
    revisions: 1,
    features: [
      "100 entries",
      "Any format",
      "100% accuracy",
      "Fast turnaround"
    ],
    requirements: [
      "Source format",
      "Target format",
      "Data type",
      "Quality expectations"
    ],
    seller: workers[0],
    rating: 4.95,
    sales: 567
  }
];

export const taskStats = {
  totalTasks: 156,
  totalEarned: 89400,
  activeWorkers: 2341,
  avgReward: 45,
  completionRate: 97
};

export const taskCategories = [
  { id: "design", name: "Design", icon: "Palette", count: 42, color: "from-pink-500 to-rose-500" },
  { id: "development", name: "Development", icon: "Code2", count: 28, color: "from-violet-500 to-indigo-500" },
  { id: "content", name: "Content", icon: "PenLine", count: 35, color: "from-amber-500 to-orange-500" },
  { id: "marketing", name: "Marketing", icon: "TrendingUp", count: 24, color: "from-cyan-500 to-teal-500" },
  { id: "data", name: "Data", icon: "Database", count: 18, color: "from-emerald-500 to-green-500" },
  { id: "other", name: "Other", icon: "MoreHorizontal", count: 9, color: "from-slate-500 to-gray-500" }
];

export const difficultyLabels = {
  easy: { label: "Easy", reward: "$10-30", time: "Under 1 hour" },
  medium: { label: "Medium", reward: "$30-60", time: "1-3 hours" },
  hard: { label: "Hard", reward: "$60-100+", time: "3+ hours" }
};
