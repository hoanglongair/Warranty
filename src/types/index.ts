export type Category =
  | "design"
  | "development"
  | "content"
  | "marketing";

export type ExperienceLevel = "entry" | "intermediate" | "expert";

export type JobType = "remote" | "hybrid" | "onsite";

export type JobStatus = "open" | "in_progress" | "completed" | "draft";

export interface Job {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: Category;
  subcategory: string;
  budget: number;
  skills: string[];
  experience: ExperienceLevel;
  duration: string;
  type: JobType;
  status: JobStatus;
  deadline: string;
  postedAt: string;
  applicants: number;
  proposals: Proposal[];
  employer: Employer;
  deliverables: string[];
  requirements: string[];
  attachments?: string[];
}

export interface Employer {
  id: string;
  name: string;
  avatar: string;
  banner?: string;
  walletAddress: string;
  rating: number;
  reviews: number;
  jobsPosted: number;
  totalSpent: number;
  memberSince: string;
  verified: boolean;
  bio?: string;
  company?: string;
  location?: string;
}

export interface Freelancer {
  id: string;
  name: string;
  avatar: string;
  banner?: string;
  title: string;
  walletAddress: string;
  rating: number;
  reviews: number;
  completedJobs: number;
  hourlyRate: number;
  skills: string[];
  bio: string;
  location: string;
  verified: boolean;
  badges: string[];
  earnings: number;
  responseTime: string;
  memberSince: string;
  portfolio: PortfolioItem[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  category: Category;
  url?: string;
}

export interface Proposal {
  id: string;
  freelancerId: string;
  freelancer: Freelancer;
  jobId: string;
  coverLetter: string;
  bidAmount: number;
  deliveryDays: number;
  submittedAt: string;
  status: "pending" | "shortlisted" | "rejected" | "accepted";
}

export interface Review {
  id: string;
  author: string;
  authorAvatar: string;
  rating: number;
  text: string;
  date: string;
  projectTitle: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  company?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "payments" | "wallet" | "security" | "disputes";
}

export interface Transaction {
  id: string;
  type: "incoming" | "outgoing" | "pending";
  amount: number;
  currency: "USDC" | "ETH" | "USDT";
  from: string;
  to: string;
  date: string;
  status: "completed" | "pending" | "failed";
  hash: string;
  description: string;
}

export type WalletProvider = "metamask" | "walletconnect" | "coinbase";

export interface WalletState {
  connected: boolean;
  address: string | null;
  provider: WalletProvider | null;
  balance: number;
  chainId: number;
  ensName?: string;
}
