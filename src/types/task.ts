export type TaskStatus = "open" | "in_progress" | "review" | "completed" | "disputed";
export type TaskDifficulty = "easy" | "medium" | "hard";
export type TaskCategory = "design" | "development" | "content" | "marketing" | "data" | "other";

export interface Task {
  id: string;
  title: string;
  description: string;
  detailedInstructions: string;
  category: TaskCategory;
  subcategory: string;
  difficulty: TaskDifficulty;
  reward: number;
  timeEstimate: string;
  deadline: string;
  status: TaskStatus;
  postedAt: string;
  employer: TaskEmployer;
  skills: string[];
  requirements: string[];
  deliverables: string[];
  attachments?: string[];
  submissions: TaskSubmission[];
  maxSubmissions: number;
  currentSubmissions: number;
  tags: string[];
  verificationSteps?: string[];
}

export interface TaskEmployer {
  id: string;
  name: string;
  avatar: string;
  walletAddress: string;
  rating: number;
  reviews: number;
  tasksPosted: number;
  tasksCompleted: number;
  verified: boolean;
  company?: string;
  location?: string;
  memberSince: string;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  workerId: string;
  worker: TaskWorker;
  content: string;
  attachments?: string[];
  submittedAt: string;
  status: "pending" | "approved" | "rejected" | "revision";
  feedback?: string;
  reviewedAt?: string;
  reward?: number;
}

export interface TaskWorker {
  id: string;
  name: string;
  avatar: string;
  walletAddress: string;
  rating: number;
  reviews: number;
  tasksCompleted: number;
  totalEarned: number;
  verified: boolean;
  badges: string[];
  skills: string[];
  bio: string;
  location: string;
  memberSince: string;
  responseTime: string;
}

export interface MicroGig {
  id: string;
  title: string;
  description: string;
  price: number;
  category: TaskCategory;
  deliveryTime: string;
  revisions: number;
  features: string[];
  requirements: string[];
  seller: TaskWorker;
  rating: number;
  sales: number;
  image?: string;
}
