import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleUsers = [
  {
    walletAddress: "0x7a3f8b92c5e4d8b1a6f9c2e7d3b8a4f1c9e6b2d5",
    role: "EMPLOYER" as const,
    employerStatus: "APPROVED" as const,
    name: "Alex Riviera - Web3 Ventures",
    email: "alex@polyflow.io",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Core contributor at Polyflow & DeFi Founder.",
    skills: ["DeFi", "Product Management", "Smart Contracts"],
    rating: 4.9,
    totalEarned: 0
  },
  {
    walletAddress: "0x9b4e7a82c1f5d3c6b8a4e9f2d7c1b5a8e3f6c9d2",
    role: "EMPLOYER" as const,
    employerStatus: "APPROVED" as const,
    name: "Sarah Chen - Vertex Protocol",
    email: "sarah@vertex.io",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    bio: "VP of Engineering at Vertex Labs.",
    skills: ["Rust", "Solidity", "System Architecture"],
    rating: 5.0,
    totalEarned: 0
  },
  {
    walletAddress: "0x9f2a8b4c1d7e3f5b8a2c9d4e6f1b7a3c8e2d5f9b",
    role: "FREELANCER" as const,
    employerStatus: "NONE" as const,
    name: "Elena Rostova",
    email: "elena@web3design.io",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bio: "Senior Web3 UI/UX Designer & Brand Strategist. Created designs for top 10 DeFi protocols.",
    skills: ["UI/UX Design", "Figma", "Design Systems", "Web3", "Brand Identity"],
    rating: 5.0,
    totalEarned: 42500
  },
  {
    walletAddress: "0x3b8a4f1c9e6b2d5a7a3f8b92c5e4d8b1a6f9c2e7",
    role: "FREELANCER" as const,
    employerStatus: "NONE" as const,
    name: "Marcus Vance",
    email: "marcus@solidity.dev",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "Full-Stack Web3 Engineer & Smart Contract Auditor. 6+ years in EVM & Rust development.",
    skills: ["Solidity", "React", "Next.js", "Foundry", "TypeScript", "Node.js"],
    rating: 4.9,
    totalEarned: 68000
  },
  {
    walletAddress: "0x5e4d8b1a6f9c2e7d3b8a4f1c9e6b2d5a7a3f8b92",
    role: "FREELANCER" as const,
    employerStatus: "NONE" as const,
    name: "Sophia Tanaka",
    email: "sophia@content3.io",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Web3 Copywriter & Technical Writer. Author of whitepapers & documentation for Layer 2s.",
    skills: ["Copywriting", "Whitepapers", "Technical Documentation", "SEO", "Community"],
    rating: 4.8,
    totalEarned: 29000
  }
];

const sampleJobs = [
  {
    id: "job-001",
    title: "Web3 Dashboard Design & Frontend Implementation",
    description: "Chúng tôi đang tìm kiếm một Senior Frontend Engineer & UI Designer xuất sắc để xây dựng giao diện ứng dụng Web3 Dashboard với React, Next.js và Tailwind CSS. Yêu cầu tích hợp ví Wagmi / Viem và hiển thị số dư realtime.",
    category: "development",
    budget: 3500,
    budgetType: "fixed",
    tokenSymbol: "USDC",
    status: "OPEN" as const,
    location: "Remote",
    deadline: "2 weeks",
    skills: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Web3.js"],
    requirements: [
      "Tối thiểu 3 năm kinh nghiệm phát triển Web3 frontend với React/Next.js",
      "Kinh nghiệm làm việc sâu sắc với Viem / Ethers.js / Wagmi",
      "Khả năng thiết kế giao diện tối giản, hiện đại và chuẩn Responsive"
    ],
    deliverables: [
      "Mã nguồn hoàn chỉnh đưa lên repository GitHub",
      "Bản dựng thử nghiệm trực tiếp trên Vercel",
      "Tài liệu hướng dẫn vận hành và cấu hình biến môi trường"
    ],
    employerAddress: "0x7a3f8b92c5e4d8b1a6f9c2e7d3b8a4f1c9e6b2d5"
  },
  {
    id: "job-002",
    title: "Smart Contract Escrow Audit & Security Verification",
    description: "Cần Chuyên gia Audit Smart Contract thực hiện rà soát lỗ hổng bảo mật cho bộ Hợp đồng thông minh Ký quỹ Escrow (Solidity, Foundry). Yêu cầu viết báo cáo Audit hoàn chỉnh và hướng dẫn khắc phục.",
    category: "development",
    budget: 5000,
    budgetType: "fixed",
    tokenSymbol: "ETH",
    status: "OPEN" as const,
    location: "Remote",
    deadline: "1 week",
    skills: ["Solidity", "Foundry", "Slither", "Smart Contract Audit", "Security"],
    requirements: [
      "Đã có kinh nghiệm audit các dự án DeFi / Escrow / DEX",
      "Sử dụng thành thạo các công cụ kiểm thử tĩnh Slither, Echidna, Foundry fuzz testing",
      "Báo cáo chi tiết điểm yếu Reentrancy, Overflow, Authorization bugs"
    ],
    deliverables: [
      "File Báo cáo Bỏ mật PDF chính thức",
      "Pull Request chứa bộ unit tests kiểm thử các kịch bản tấn công"
    ],
    employerAddress: "0x9b4e7a82c1f5d3c6b8a4e9f2d7c1b5a8e3f6c9d2"
  },
  {
    id: "job-003",
    title: "Telegram Bot cho Thông Báo Giao Dịch Escrow Realtime",
    description: "Phát triển Telegram Bot kết nối RPC Arc Testnet / Ethereum để lắng nghe sự kiện Smart Contract Escrow (Created, Funded, Released) và gửi thông báo tức thì vào nhóm Telegram của dự án.",
    category: "development",
    budget: 1200,
    budgetType: "fixed",
    tokenSymbol: "USDC",
    status: "OPEN" as const,
    location: "Remote",
    deadline: "5 days",
    skills: ["Node.js", "TypeScript", "Telegram Bot API", "Ethers.js", "Webhooks"],
    requirements: [
      "Kinh nghiệm viết Telegram Bot chuyên nghiệp bằng Telegraf / gramJS",
      "Hiểu rõ cơ chế WebSocket / Event Listening trong Web3"
    ],
    deliverables: [
      "Mã nguồn Node.js / Dockerfile hoàn chỉnh",
      "Hướng dẫn triển khai bot lên Server VPS"
    ],
    employerAddress: "0x7a3f8b92c5e4d8b1a6f9c2e7d3b8a4f1c9e6b2d5"
  },
  {
    id: "job-004",
    title: "Thiết Kế Bộ Nhận Diện Thương Hiệu & Logo Web3 Protocol",
    description: "Cần Designer thiết kế bộ nhận diện thương hiệu độc đáo cho sản phẩm Web3 Marketplace. Bao gồm Logo vector, Bảng màu chuẩn HSL Darkmode, Font chữ và Banner truyền thông.",
    category: "design",
    budget: 2000,
    budgetType: "fixed",
    tokenSymbol: "USDC",
    status: "OPEN" as const,
    location: "Remote",
    deadline: "1-2 weeks",
    skills: ["Logo Design", "Brand Identity", "Figma", "Illustrator", "UI/UX"],
    requirements: [
      "Portfolio dự án thương hiệu phong cách Web3 / Cyberpunk / Clean Dark",
      "Bàn giao đầy đủ file nguồn Figma, SVG, AI, PNG HD"
    ],
    deliverables: [
      "File thiết kế Brand Guidelines (PDF)",
      "Bộ file Logo vector đa kích thước"
    ],
    employerAddress: "0x9b4e7a82c1f5d3c6b8a4e9f2d7c1b5a8e3f6c9d2"
  }
];

async function main() {
  console.log("🌱 Seeding Database with Real Data...");

  // Seed Users
  for (const u of sampleUsers) {
    await prisma.user.upsert({
      where: { walletAddress: u.walletAddress },
      update: {
        role: u.role,
        employerStatus: u.employerStatus,
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        bio: u.bio,
        skills: u.skills,
        rating: u.rating,
        totalEarned: u.totalEarned
      },
      create: u
    });
  }

  // Seed Jobs
  for (const j of sampleJobs) {
    await prisma.job.upsert({
      where: { id: j.id },
      update: j,
      create: j
    });
  }

  console.log("✅ Database Seeded Successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
