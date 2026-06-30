"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Upload, Plus, X, Check, DollarSign, Clock, Users } from "lucide-react";
import { WalletButton } from "@/components/wallet/wallet-button";
import { useWalletStore } from "@/store/wallet-store";

const taskSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(30, "Description must be at least 30 characters"),
  detailedInstructions: z.string().min(50, "Instructions must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  subcategory: z.string().min(1, "Please select a subcategory"),
  difficulty: z.string().min(1, "Please select difficulty"),
  reward: z.number().min(5, "Minimum reward is $5"),
  timeEstimate: z.string().min(1, "Please estimate time"),
  deadline: z.string().min(1, "Please set a deadline"),
  maxSubmissions: z.number().min(1, "At least 1 submission needed"),
  skills: z.array(z.string()).min(1, "Add at least one skill"),
  requirements: z.array(z.string()).min(1, "Add at least one requirement"),
  deliverables: z.array(z.string()).min(1, "Add at least one deliverable"),
});

type TaskFormData = z.infer<typeof taskSchema>;

const categories = [
  { id: "design", name: "Design", subcategories: ["Logo Design", "Social Media Design", "App Icon", "Banner Design", "Brand Identity", "UI/UX Design"] },
  { id: "development", name: "Development", subcategories: ["QA Testing", "Web Scraping", "Bug Reports", "Code Review", "Documentation"] },
  { id: "content", name: "Content", subcategories: ["Copywriting", "Translation", "Product Description", "Blog Writing", "Content Planning"] },
  { id: "marketing", name: "Marketing", subcategories: ["Social Media Content", "Lead Generation", "SEO", "Email Research", "Market Research"] },
  { id: "data", name: "Data", subcategories: ["Data Entry", "Web Research", "Market Research", "Data Analysis", "Competitor Research"] },
  { id: "other", name: "Other", subcategories: ["Virtual Assistant", "Research", "Admin Support", "Customer Service"] },
];

const difficulties = [
  { id: "easy", name: "Easy", desc: "Under 1 hour", reward: "$5-30" },
  { id: "medium", name: "Medium", desc: "1-3 hours", reward: "$30-60" },
  { id: "hard", name: "Hard", desc: "3+ hours", reward: "$60-100+" },
];

const timeEstimates = [
  "15-30 minutes",
  "30-60 minutes",
  "1-2 hours",
  "2-3 hours",
  "3-5 hours"
];

export default function CreateTaskPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [reqInput, setReqInput] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [delInput, setDelInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { connected } = useWalletStore();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      reward: 25,
      maxSubmissions: 10,
      difficulty: "easy",
      category: "",
      subcategory: "",
      timeEstimate: "30-60 minutes",
    }
  });

  const selectedSubcategories = categories.find(c => c.id === selectedCategory)?.subcategories || [];

  const addToList = (input: string, setInput: (v: string) => void, list: string[], setList: (v: string[]) => void) => {
    if (input.trim() && !list.includes(input.trim())) {
      setList([...list, input.trim()]);
      setInput("");
    }
  };

  const removeFromList = (item: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.filter(i => i !== item));
  };

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Task created:", { ...data, skills, requirements, deliverables });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">
            Task Posted Successfully!
          </h1>
          <p className="mt-4 max-w-md mx-auto text-white/60">
            Your task is now live. Workers can start submitting their work immediately.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/tasks" className="btn-primary">
              View Tasks
            </Link>
            <button onClick={() => {
              setSubmitted(false);
              reset();
              setSkills([]);
              setRequirements([]);
              setDeliverables([]);
            }} className="btn-secondary">
              Create Another Task
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          <span className="gradient-text">Create a Task</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-white/60">
          Post a micro-task and get work done quickly. Workers complete small tasks and get paid instantly.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8"
      >
        {!connected && (
          <div className="mb-8 rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 p-6 text-center">
            <p className="text-white/70 mb-4">Connect your wallet to create tasks</p>
            <WalletButton />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-xs font-bold">1</span>
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Task Title</label>
              <input
                {...register("title")}
                type="text"
                placeholder="e.g., Design 5 Social Media Post Templates"
                className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder-white/40 outline-none focus:border-violet-500/50"
              />
              {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Short Description</label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Brief overview of the task..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder-white/40 outline-none focus:border-violet-500/50 resize-none"
              />
              {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Detailed Instructions</label>
              <textarea
                {...register("detailedInstructions")}
                rows={6}
                placeholder="Provide detailed instructions for workers to follow..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder-white/40 outline-none focus:border-violet-500/50 resize-none"
              />
              {errors.detailedInstructions && <p className="mt-1 text-xs text-red-400">{errors.detailedInstructions.message}</p>}
              <p className="mt-1 text-xs text-white/40">Be specific and clear. Workers need detailed instructions to complete the task correctly.</p>
            </div>
          </div>

          {/* Category & Difficulty */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-xs font-bold">2</span>
              Category & Difficulty
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Category</label>
                <select
                  {...register("category")}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setValue("category", e.target.value);
                    setValue("subcategory", "");
                  }}
                  className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-violet-500/50"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Subcategory</label>
                <select
                  {...register("subcategory")}
                  disabled={!selectedCategory}
                  className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-violet-500/50 disabled:opacity-50"
                >
                  <option value="">Select subcategory</option>
                  {selectedSubcategories.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-3">Difficulty Level</label>
              <div className="grid gap-3 sm:grid-cols-3">
                {difficulties.map((diff) => (
                  <label
                    key={diff.id}
                    className="relative cursor-pointer"
                  >
                    <input
                      type="radio"
                      {...register("difficulty")}
                      value={diff.id}
                      className="peer sr-only"
                    />
                    <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] peer-checked:border-violet-500 peer-checked:bg-violet-500/10 transition-colors">
                      <p className="font-semibold text-white">{diff.name}</p>
                      <p className="text-xs text-white/50 mt-1">{diff.desc}</p>
                      <p className="text-xs text-green-400 mt-1">{diff.reward}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Reward & Time */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-xs font-bold">3</span>
              Reward & Timeline
            </h3>

            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Reward ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
                  <input
                    {...register("reward", { valueAsNumber: true })}
                    type="number"
                    min="5"
                    className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] pl-8 pr-4 text-white outline-none focus:border-violet-500/50"
                  />
                </div>
                <p className="mt-1 text-xs text-white/40">Minimum $5</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Time Estimate</label>
                <select
                  {...register("timeEstimate")}
                  className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-violet-500/50"
                >
                  {timeEstimates.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Max Submissions</label>
                <input
                  {...register("maxSubmissions", { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="100"
                  className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-violet-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Deadline</label>
              <input
                {...register("deadline")}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-xs font-bold">4</span>
              Required Skills
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToList(skillInput, setSkillInput, skills, setSkills))}
                placeholder="Type a skill and press Enter"
                className="flex-1 h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder-white/40 outline-none focus:border-violet-500/50"
              />
              <button type="button" onClick={() => addToList(skillInput, setSkillInput, skills, setSkills)} className="h-12 px-4 rounded-xl border border-white/10 bg-white/[0.04] text-white/60 hover:text-white transition-colors">
                <Plus className="h-5 w-5" />
              </button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-sm text-violet-300">
                    {skill}
                    <button type="button" onClick={() => removeFromList(skill, skills, setSkills)}><X className="h-3.5 w-3.5" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Requirements */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-xs font-bold">5</span>
              Requirements
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={reqInput}
                onChange={(e) => setReqInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToList(reqInput, setReqInput, requirements, setRequirements))}
                placeholder="Type a requirement and press Enter"
                className="flex-1 h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder-white/40 outline-none focus:border-violet-500/50"
              />
              <button type="button" onClick={() => addToList(reqInput, setReqInput, requirements, setRequirements)} className="h-12 px-4 rounded-xl border border-white/10 bg-white/[0.04] text-white/60 hover:text-white transition-colors">
                <Plus className="h-5 w-5" />
              </button>
            </div>
            {requirements.length > 0 && (
              <div className="space-y-2">
                {requirements.map((req, i) => (
                  <div key={req} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <Check className="h-4 w-4 text-violet-400" />
                    <span className="flex-1 text-sm text-white/70">{req}</span>
                    <button type="button" onClick={() => removeFromList(req, requirements, setRequirements)} className="text-white/40 hover:text-red-400"><X className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deliverables */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-xs font-bold">6</span>
              What to Deliver
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={delInput}
                onChange={(e) => setDelInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToList(delInput, setDelInput, deliverables, setDeliverables))}
                placeholder="Type a deliverable and press Enter"
                className="flex-1 h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder-white/40 outline-none focus:border-violet-500/50"
              />
              <button type="button" onClick={() => addToList(delInput, setDelInput, deliverables, setDeliverables)} className="h-12 px-4 rounded-xl border border-white/10 bg-white/[0.04] text-white/60 hover:text-white transition-colors">
                <Plus className="h-5 w-5" />
              </button>
            </div>
            {deliverables.length > 0 && (
              <div className="space-y-2">
                {deliverables.map((del, i) => (
                  <div key={del} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-[10px] font-bold text-violet-300">{i + 1}</span>
                    <span className="flex-1 text-sm text-white/70">{del}</span>
                    <button type="button" onClick={() => removeFromList(del, deliverables, setDeliverables)} className="text-white/40 hover:text-red-400"><X className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-white/5">
            <div className="glass-card p-4 mb-6 bg-green-500/5 border-green-500/20">
              <div className="flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-green-400" />
                <div>
                  <p className="font-medium text-white">Platform Fee: 10%</p>
                  <p className="text-sm text-white/50">Total cost will be shown at checkout</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !connected}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating Task...
                </span>
              ) : (
                <>
                  Post Task
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
