import type { FAQItem, Testimonial } from "@/types";

export const faqs: FAQItem[] = [
  {
    id: "faq-1",
    question: "How does the hiring process work on Warranty?",
    answer:
      "Warranty makes hiring simple. Post your job with detailed requirements, receive proposals from vetted freelancers within hours, review their portfolios and ratings, interview your top candidates, and hire the best fit. Funds are held in smart contract escrow and released upon milestone completion.",
    category: "general"
  },
  {
    id: "faq-2",
    question: "What payment methods are supported?",
    answer:
      "Warranty supports both traditional payments (credit card, bank transfer via Stripe) and Web3 payments (USDC, ETH, USDT) through your connected wallet. All payments are protected by smart contract escrow to ensure both parties are protected throughout the engagement.",
    category: "payments"
  },
  {
    id: "faq-3",
    question: "How do I connect my Web3 wallet?",
    answer:
      "Click the 'Connect Wallet' button in the top navigation. We support MetaMask, WalletConnect, and Coinbase Wallet. Once connected, your wallet address becomes your identity on the platform, enabling seamless crypto payments and NFT-based credentials.",
    category: "wallet"
  },
  {
    id: "faq-4",
    question: "Is my payment secure?",
    answer:
      "Yes. All payments are secured by smart contract escrow. Funds are locked when a contract begins and only released when both parties confirm milestone completion. In case of disputes, our resolution team mediates and ensures fair outcomes.",
    category: "security"
  },
  {
    id: "faq-5",
    question: "How are freelancers verified?",
    answer:
      "Freelancers can earn verification through identity verification (KYC), skill assessments, portfolio reviews, and on-chain reputation. Look for the blue checkmark on profiles to identify fully verified freelancers. We also run continuous background checks on top-rated talent.",
    category: "security"
  },
  {
    id: "faq-6",
    question: "What fees does Warranty charge?",
    answer:
      "Warranty charges a 5% service fee on the total project value, split between employer and freelancer (2.5% each). There are no fees for posting jobs, browsing, or connecting your wallet. Web3 payments have minimal network gas fees.",
    category: "payments"
  },
  {
    id: "faq-7",
    question: "What happens if there's a dispute?",
    answer:
      "If a dispute arises, either party can open a case within 14 days of milestone completion. Our resolution team reviews evidence from both sides within 48 hours and makes a binding decision. Funds in escrow are protected and distributed according to the resolution.",
    category: "disputes"
  },
  {
    id: "faq-8",
    question: "Can I get a refund?",
    answer:
      "Yes. If work has not been started, you can cancel the contract and receive a full refund. For in-progress work, refunds are pro-rated based on completed milestones and resolved through our dispute process if needed.",
    category: "disputes"
  },
  {
    id: "faq-9",
    question: "How are reviews and ratings calculated?",
    answer:
      "After project completion, both parties leave a 1-5 star rating and a written review. Ratings are weighted by recency and project value. Our algorithm filters out fake reviews, and we maintain a 98% authentic review rate platform-wide.",
    category: "general"
  },
  {
    id: "faq-10",
    question: "Is my personal data safe?",
    answer:
      "Absolutely. We use bank-grade encryption for all data in transit and at rest. Personal information is never sold to third parties. On-chain identity (wallet address) is pseudonymous by default, and you control what information is publicly visible on your profile.",
    category: "security"
  },
  {
    id: "faq-11",
    question: "Do I need to pay to apply for jobs?",
    answer:
      "No. Browsing and applying to jobs is completely free for freelancers. We only charge a small service fee when you successfully complete a project and get paid.",
    category: "payments"
  },
  {
    id: "faq-12",
    question: "What is the Warranty NFT credential?",
    answer:
      "When you complete a project successfully, you receive an on-chain NFT credential that proves your skills and experience. These credentials are portable, verifiable, and travel with you across the Web3 ecosystem.",
    category: "general"
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Sarah Kim",
    role: "Founder, Polyflow",
    avatar: "/avatars/sarah.png",
    rating: 5,
    text: "Warranty transformed how we hire. We shipped our entire Web3 landing page in 2 weeks with a designer we found here. The escrow system gave us peace of mind, and the quality was exceptional.",
    company: "Polyflow"
  },
  {
    id: "test-2",
    name: "David Park",
    role: "CTO, Lendex",
    avatar: "/avatars/david.png",
    rating: 5,
    text: "We've hired 12 engineers through Warranty in the past year. The vetting is excellent, and the smart contract escrow means we only pay for delivered work. It's our go-to platform for Web3 talent.",
    company: "Lendex"
  },
  {
    id: "test-3",
    name: "Ana Costa",
    role: "Marketing Lead, Vertex",
    avatar: "/avatars/ana.png",
    rating: 5,
    text: "The SEO freelancer we hired delivered 4x organic traffic growth in 5 months. The platform's transparency and review system made it easy to find the right person. Highly recommended.",
    company: "Vertex"
  },
  {
    id: "test-4",
    name: "Linh Nguyen",
    role: "Independent Designer",
    avatar: "/avatars/linh.png",
    rating: 5,
    text: "As a freelancer, Warranty has been a game-changer. The clients are serious, the payments are guaranteed via escrow, and the community is world-class. My income has tripled since joining.",
    company: "Freelance Designer"
  },
  {
    id: "test-5",
    name: "Marcus Chen",
    role: "Full-Stack Engineer",
    avatar: "/avatars/marcus.png",
    rating: 5,
    text: "The quality of clients on Warranty is unmatched. Every project I've taken has been well-scoped, fairly compensated, and led to long-term relationships. Best freelance platform for serious developers.",
    company: "Independent Engineer"
  }
];
