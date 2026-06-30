"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, SlidersHorizontal, X, Grid, List, Clock, 
  DollarSign, TrendingUp, Sparkles, Users, Filter
} from "lucide-react";
import { tasks, taskCategories, taskStats, difficultyLabels } from "@/data/tasks";
import { TaskCard } from "@/components/tasks/task-card";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/translations";

type ViewMode = "grid" | "list";
type SortBy = "newest" | "reward_high" | "reward_low" | "time_short" | "spots_left";

const sortOptions = [
  { id: "newest", label: "Newest First", icon: Clock },
  { id: "reward_high", label: "Highest Reward", icon: TrendingUp },
  { id: "reward_low", label: "Lowest Reward", icon: DollarSign },
  { id: "time_short", label: "Quick Tasks", icon: Sparkles },
  { id: "spots_left", label: "Most Spots", icon: Users }
];

export default function TasksPage() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [maxReward, setMaxReward] = useState(100);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => task.status === "open")
      .filter(task => {
        if (search) {
          const searchLower = search.toLowerCase();
          return (
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower) ||
            task.skills.some(s => s.toLowerCase().includes(searchLower)) ||
            task.tags.some(t => t.toLowerCase().includes(searchLower))
          );
        }
        return true;
      })
      .filter(task => !selectedCategory || task.category === selectedCategory)
      .filter(task => !selectedDifficulty || task.difficulty === selectedDifficulty)
      .filter(task => task.reward <= maxReward)
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
          case "reward_high":
            return b.reward - a.reward;
          case "reward_low":
            return a.reward - b.reward;
          case "time_short":
            return a.reward - b.reward;
          case "spots_left":
            return (b.maxSubmissions - b.currentSubmissions) - (a.maxSubmissions - a.currentSubmissions);
          default:
            return 0;
        }
      });
  }, [search, selectedCategory, selectedDifficulty, maxReward, sortBy]);

  const activeFiltersCount = 
    (selectedCategory ? 1 : 0) +
    (selectedDifficulty ? 1 : 0) +
    (maxReward < 100 ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          <span className="gradient-text">{t("tasks.title")}</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-white/60">
          {t("tasks.subtitle")}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: t("tasks.availableTasks"), value: taskStats.totalTasks.toString(), color: "from-violet-500 to-purple-500" },
          { label: t("tasks.totalEarned"), value: `$${taskStats.totalEarned.toLocaleString()}`, color: "from-green-500 to-emerald-500" },
          { label: t("tasks.activeWorkers"), value: taskStats.activeWorkers.toLocaleString(), color: "from-cyan-500 to-blue-500" },
          { label: t("tasks.avgReward"), value: `$${taskStats.avgReward}`, color: "from-amber-500 to-orange-500" }
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/50">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Categories Quick Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6 flex gap-2 overflow-x-auto no-scrollbar pb-2"
      >
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
            !selectedCategory
              ? "bg-white/[0.06] text-white border border-white/10"
              : "text-white/60 hover:text-white hover:bg-white/[0.03]"
          )}
        >
          {t("tasks.allTasks")}
        </button>
        {taskCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              selectedCategory === cat.id
                ? `bg-gradient-to-r ${cat.color} text-white border border-white/10`
                : "text-white/60 hover:text-white hover:bg-white/[0.03]"
            )}
          >
            {cat.name}
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{cat.count}</span>
          </button>
        ))}
      </motion.div>

      {/* Search and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("tasks.searchPlaceholder")}
            className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-violet-500/50"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={cn(
              "btn-secondary relative",
              filtersOpen && "border-violet-500/50 bg-violet-500/10"
            )}
          >
            <Filter className="h-4 w-4" />
            <span>{t("marketplace.filters")}</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="relative hidden sm:block">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="h-11 appearance-none rounded-xl border border-white/10 bg-white/[0.04] pl-4 pr-10 text-sm text-white outline-none transition-colors focus:border-violet-500/50"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-[hsl(var(--background))]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.04] p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-lg p-2 transition-colors",
                viewMode === "grid" ? "bg-white/[0.06] text-white" : "text-white/50 hover:text-white"
              )}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "rounded-lg p-2 transition-colors",
                viewMode === "list" ? "bg-white/[0.06] text-white" : "text-white/50 hover:text-white"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6"
          >
            <div className="glass-card p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/60">
                  {t("tasks.difficulty")}
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedDifficulty(null)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                      !selectedDifficulty
                        ? "border-violet-500/50 bg-violet-500/10 text-white"
                        : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
                    )}
                  >
                    {t("marketplace.all")}
                  </button>
                  {Object.entries(difficultyLabels).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedDifficulty(selectedDifficulty === key ? null : key)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                        selectedDifficulty === key
                          ? "border-violet-500/50 bg-violet-500/10 text-white"
                          : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
                      )}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/60">
                  {t("tasks.maxReward")}: ${maxReward}
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={maxReward}
                  onChange={(e) => setMaxReward(parseInt(e.target.value))}
                  className="w-full accent-violet-500"
                />
                <div className="mt-1 flex justify-between text-[10px] text-white/40">
                  <span>$10</span>
                  <span>$100+</span>
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/60">
                  Difficulty Rewards
                </label>
                <div className="space-y-2">
                  {Object.entries(difficultyLabels).map(([key, config]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-white/70 capitalize">{config.label}</span>
                      <span className="text-white/50">{config.reward}</span>
                    </div>
                  ))}
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedDifficulty(null);
                      setMaxReward(100);
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

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between text-sm text-white/50">
        <p>{filteredTasks.length} {t("marketplace.jobsAvailable")}</p>
      </div>

      {/* Task Grid/List */}
      <AnimatePresence mode="wait">
        {filteredTasks.length > 0 ? (
          <motion.div
            key="tasks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "gap-5",
              viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3" : "space-y-4"
            )}
          >
            {filteredTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card py-16 text-center"
          >
            <Search className="mx-auto h-12 w-12 text-white/30" />
            <h3 className="mt-4 font-display text-lg font-semibold text-white">{t("marketplace.noResults")}</h3>
            <p className="mt-2 text-white/50">{t("marketplace.adjustFilters")}</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory(null);
                setSelectedDifficulty(null);
                setMaxReward(100);
              }}
              className="mt-4 btn-secondary"
            >
              {t("marketplace.clearFilters")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Start Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-16"
      >
        <div className="glass-card p-8">
          <h3 className="font-display text-xl font-bold text-white mb-6">{t("tasks.howItWorks")}</h3>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: 1, key: "tasks.findTask", descKey: "tasks.findTaskDesc", icon: Search },
              { step: 2, key: "tasks.completeWork", descKey: "tasks.completeWorkDesc", icon: Clock },
              { step: 3, key: "tasks.getPaid", descKey: "tasks.getPaidDesc", icon: DollarSign }
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 font-bold text-white">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{t(item.key)}</h4>
                  <p className="mt-1 text-sm text-white/50">{t(item.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
