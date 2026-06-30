"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  Briefcase,
  Users,
  ChevronDown
} from "lucide-react";
import { jobs } from "@/data/jobs";
import { categories } from "@/data/jobs";
import { JobCard } from "@/components/marketplace/job-card";
import { FreelancerCard } from "@/components/marketplace/freelancer-card";
import { freelancers } from "@/data/freelancers";
import { cn } from "@/lib/utils";

type Tab = "posters" | "freelancers";
type SortBy = "newest" | "highest" | "applicants";

export default function MarketplacePage() {
  const [tab, setTab] = useState<Tab>("posters");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [budgetRange, setBudgetRange] = useState<[number, number]>([100, 10000]);
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredJobs = jobs
    .filter((job) => {
      if (search && !job.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (selectedCategory && job.category !== selectedCategory) return false;
      if (selectedExperience && job.experience !== selectedExperience) return false;
      if (job.budget < budgetRange[0] || job.budget > budgetRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      if (sortBy === "highest") return b.budget - a.budget;
      return b.applicants - a.applicants;
    });

  const filteredFreelancers = freelancers.filter((freelancer) => {
    if (
      search &&
      !freelancer.name.toLowerCase().includes(search.toLowerCase()) &&
      !freelancer.title.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (selectedExperience ? 1 : 0) +
    (budgetRange[0] !== 100 || budgetRange[1] !== 10000 ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          <span className="gradient-text">Marketplace</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-white/60">
          Discover premium opportunities and connect with elite talent.
        </p>
      </motion.div>

      <div className="mb-8 flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-xl">
        <button
          onClick={() => setTab("posters")}
          className={cn(
            "relative flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
            tab === "posters" ? "text-white" : "text-white/50 hover:text-white/80"
          )}
        >
          {tab === "posters" && (
            <motion.div
              layoutId="marketplace-tab"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/20 to-cyan-500/20 ring-1 ring-white/10"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative flex items-center justify-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span>Người Thuê · Job Posters</span>
          </span>
        </button>
        <button
          onClick={() => setTab("freelancers")}
          className={cn(
            "relative flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
            tab === "freelancers" ? "text-white" : "text-white/50 hover:text-white/80"
          )}
        >
          {tab === "freelancers" && (
            <motion.div
              layoutId="marketplace-tab"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/20 to-cyan-500/20 ring-1 ring-white/10"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative flex items-center justify-center gap-2">
            <Users className="h-4 w-4" />
            <span>Người Được Thuê · Freelancers</span>
          </span>
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder={tab === "posters" ? "Search jobs..." : "Search freelancers..."}
            className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-violet-500/50"
          />
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="btn-secondary relative"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
              {activeFiltersCount}
            </span>
          )}
        </button>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="h-11 appearance-none rounded-xl border border-white/10 bg-white/[0.04] pl-4 pr-10 text-sm text-white outline-none transition-colors focus:border-violet-500/50"
          >
            <option value="newest" className="bg-[hsl(var(--background))]">
              Newest
            </option>
            <option value="highest" className="bg-[hsl(var(--background))]">
              Highest Budget
            </option>
            <option value="applicants" className="bg-[hsl(var(--background))]">
              Most Applicants
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen && tab === "posters" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="glass-card mb-6 grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/60">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                      !selectedCategory
                        ? "border-violet-500/50 bg-violet-500/10 text-white"
                        : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
                    )}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === cat.id ? null : cat.id
                        )
                      }
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                        selectedCategory === cat.id
                          ? "border-violet-500/50 bg-violet-500/10 text-white"
                          : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/60">
                  Experience Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {["entry", "intermediate", "expert"].map((level) => (
                    <button
                      key={level}
                      onClick={() =>
                        setSelectedExperience(
                          selectedExperience === level ? null : level
                        )
                      }
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                        selectedExperience === level
                          ? "border-violet-500/50 bg-violet-500/10 text-white"
                          : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/60">
                  Budget Range
                </label>
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <span>${budgetRange[0]}</span>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={budgetRange[1]}
                    onChange={(e) =>
                      setBudgetRange([budgetRange[0], parseInt(e.target.value)])
                    }
                    className="flex-1 accent-violet-500"
                  />
                  <span>${budgetRange[1]}</span>
                </div>
                <p className="mt-1 text-[10px] text-white/40">
                  Drag the slider to set max budget
                </p>
              </div>

              {activeFiltersCount > 0 && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedExperience(null);
                      setBudgetRange([100, 10000]);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-violet-300 hover:text-violet-200"
                  >
                    <X className="h-3 w-3" />
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-4 flex items-center justify-between text-sm text-white/50">
        <p>
          {tab === "posters"
            ? `${filteredJobs.length} jobs available`
            : `${filteredFreelancers.length} freelancers available`}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {tab === "posters" ? (
          <motion.div
            key="posters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredJobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="freelancers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredFreelancers.map((freelancer, i) => (
              <FreelancerCard
                key={freelancer.id}
                freelancer={freelancer}
                index={i}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {((tab === "posters" && filteredJobs.length === 0) ||
        (tab === "freelancers" && filteredFreelancers.length === 0)) && (
        <div className="glass-card py-16 text-center">
          <p className="text-lg text-white/60">No results found</p>
          <p className="mt-1 text-sm text-white/40">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
