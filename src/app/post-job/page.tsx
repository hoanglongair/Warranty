"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Upload, Plus, X, Check } from "lucide-react";
import { WalletButton } from "@/components/wallet/wallet-button";
import { useWalletStore } from "@/store/wallet-store";

const jobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  subcategory: z.string().min(1, "Please select a subcategory"),
  budget: z.number().min(50, "Minimum budget is $50"),
  duration: z.string().min(1, "Please select a duration"),
  experience: z.string().min(1, "Please select experience level"),
  type: z.string().min(1, "Please select job type"),
  skills: z.array(z.string()).min(1, "Add at least one skill"),
});

type JobFormData = z.infer<typeof jobSchema>;

const categories = [
  { id: "design", name: "Design", subcategories: ["Logo Design", "UI/UX Design", "Banner Design", "Brand Identity"] },
  { id: "development", name: "Development", subcategories: ["Website Development", "Mobile App", "Telegram Bots", "Discord Bots", "Smart Contracts", "Web3 Development"] },
  { id: "content", name: "Content", subcategories: ["Copywriting", "Translation", "Blog Writing", "Technical Writing"] },
  { id: "marketing", name: "Marketing", subcategories: ["SEO", "Social Media", "Paid Advertising", "Community Management"] },
];

const durations = ["Less than 1 week", "1-2 weeks", "2-4 weeks", "1-2 months", "2-3 months", "3+ months"];
const experienceLevels = ["Entry", "Intermediate", "Expert"];

export default function PostJobPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { connected } = useWalletStore();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      skills: [],
      budget: 500,
      type: "remote",
    }
  });

  const selectedSubcategories = categories.find(c => c.id === selectedCategory)?.subcategories || [];

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      const newSkills = [...skills, skillInput.trim()];
      setSkills(newSkills);
      setValue("skills", newSkills);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    const newSkills = skills.filter(s => s !== skill);
    setSkills(newSkills);
    setValue("skills", newSkills);
  };

  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Job posted:", data);
    setIsSubmitting(false);
    setSubmitted(true);
    reset();
    setSkills([]);
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
            Job Posted Successfully!
          </h1>
          <p className="mt-4 max-w-md mx-auto text-white/60">
            Your job is now live on the marketplace. Freelancers will be able to find and apply for your project.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/marketplace" className="btn-primary">
              View Marketplace
            </Link>
            <button onClick={() => setSubmitted(false)} className="btn-secondary">
              Post Another Job
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
          <span className="gradient-text">Post a Job</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-white/60">
          Find the perfect freelancer for your project. Describe your requirements and budget.
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
            <p className="text-white/70 mb-4">Connect your wallet to post a job</p>
            <WalletButton />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Job Title
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="e.g., Web3 Landing Page Design"
              className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder-white/40 outline-none focus:border-violet-500/50"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Job Description
            </label>
            <textarea
              {...register("description")}
              rows={6}
              placeholder="Describe your project requirements, goals, and expectations..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder-white/40 outline-none focus:border-violet-500/50 resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Category
              </label>
              <select
                {...register("category")}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setValue("category", e.target.value);
                }}
                className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-violet-500/50"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-red-400">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Subcategory
              </label>
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
              {errors.subcategory && (
                <p className="mt-1 text-xs text-red-400">{errors.subcategory.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Budget (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
                <input
                  {...register("budget", { valueAsNumber: true })}
                  type="number"
                  min="50"
                  placeholder="500"
                  className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] pl-8 pr-4 text-white placeholder-white/40 outline-none focus:border-violet-500/50"
                />
              </div>
              {errors.budget && (
                <p className="mt-1 text-xs text-red-400">{errors.budget.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Duration
              </label>
              <select
                {...register("duration")}
                className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-violet-500/50"
              >
                <option value="">Select duration</option>
                {durations.map((dur) => (
                  <option key={dur} value={dur}>{dur}</option>
                ))}
              </select>
              {errors.duration && (
                <p className="mt-1 text-xs text-red-400">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Experience Level
              </label>
              <select
                {...register("experience")}
                className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-violet-500/50"
              >
                <option value="">Select level</option>
                {experienceLevels.map((level) => (
                  <option key={level} value={level.toLowerCase()}>{level}</option>
                ))}
              </select>
              {errors.experience && (
                <p className="mt-1 text-xs text-red-400">{errors.experience.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Job Type
              </label>
              <select
                {...register("type")}
                className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-violet-500/50"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Required Skills
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Type a skill and press Enter"
                className="flex-1 h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder-white/40 outline-none focus:border-violet-500/50"
              />
              <button
                type="button"
                onClick={addSkill}
                className="h-12 px-4 rounded-xl border border-white/10 bg-white/[0.04] text-white/60 hover:text-white transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            {skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-sm text-violet-300"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {errors.skills && (
              <p className="mt-1 text-xs text-red-400">{errors.skills.message}</p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !connected}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Posting...
                </span>
              ) : (
                <>
                  Post Job
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
