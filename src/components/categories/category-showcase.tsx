"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { CategoryIcon } from "@/components/icons/category-icons";

const allCategories = [
  {
    id: "design",
    name: "Design",
    color: "from-pink-500 to-rose-500",
    glow: "rgba(236, 72, 153, 0.4)",
    subcategories: [
      { name: "Logo Design", desc: "Unique brand marks that capture your essence", jobs: 324 },
      { name: "UI/UX Design", desc: "Intuitive interfaces that users love", jobs: 512 },
      { name: "Banner Design", desc: "Eye-catching banners for any platform", jobs: 198 },
      { name: "Brand Identity", desc: "Complete brand systems that scale", jobs: 214 }
    ]
  },
  {
    id: "development",
    name: "Development",
    color: "from-violet-500 to-indigo-500",
    glow: "rgba(139, 92, 246, 0.4)",
    subcategories: [
      { name: "Website Development", desc: "Fast, responsive websites built to perform", jobs: 842 },
      { name: "Mobile App Development", desc: "Native and cross-platform mobile apps", jobs: 456 },
      { name: "Telegram Bots", desc: "Powerful bots for Telegram engagement", jobs: 234 },
      { name: "Discord Bots", desc: "Community bots that drive engagement", jobs: 189 },
      { name: "Smart Contracts", desc: "Secure blockchain contracts", jobs: 167 },
      { name: "Web3 Development", desc: "Decentralized apps and protocols", jobs: 298 }
    ]
  },
  {
    id: "content",
    name: "Content",
    color: "from-amber-500 to-orange-500",
    glow: "rgba(245, 158, 11, 0.4)",
    subcategories: [
      { name: "Copywriting", desc: "Words that convert and compel", jobs: 287 },
      { name: "Translation", desc: "Break language barriers globally", jobs: 156 },
      { name: "Blog Writing", desc: "Engaging content that ranks", jobs: 178 },
      { name: "Technical Writing", desc: "Clear documentation users understand", jobs: 122 }
    ]
  },
  {
    id: "marketing",
    name: "Marketing",
    color: "from-cyan-500 to-teal-500",
    glow: "rgba(6, 182, 212, 0.4)",
    subcategories: [
      { name: "SEO", desc: "Rank higher and drive organic traffic", jobs: 245 },
      { name: "Social Media", desc: "Build engaged communities", jobs: 189 },
      { name: "Paid Advertising", desc: "ROI-focused ad campaigns", jobs: 134 },
      { name: "Community Management", desc: "Grow and nurture your community", jobs: 144 }
    ]
  }
];

export function CategoryShowcase() {
  const [selectedCategory, setSelectedCategory] = useState(allCategories[0]);
  const [hoveredSub, setHoveredSub] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          <span className="gradient-text">Categories</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-white/60">
          Explore our curated categories and find the perfect specialist for your project.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                selectedCategory.id === cat.id
                  ? `bg-gradient-to-r ${cat.color} bg-opacity-20 border border-white/10`
                  : "hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                  <CategoryIcon category={cat.id} subcategory={cat.subcategories[0].name} size="sm" />
                </div>
                <div>
                  <p className="font-semibold text-white">{cat.name}</p>
                  <p className="text-xs text-white/50">{cat.subcategories.length} services</p>
                </div>
              </div>
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${selectedCategory.color} flex items-center justify-center`}>
                  <CategoryIcon category={selectedCategory.id} subcategory={selectedCategory.subcategories[0].name} size="md" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">{selectedCategory.name}</h2>
                  <p className="text-sm text-white/50">{selectedCategory.subcategories.length} subcategories</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {selectedCategory.subcategories.map((sub, i) => (
                  <motion.div
                    key={sub.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onMouseEnter={() => setHoveredSub(sub.name)}
                    onMouseLeave={() => setHoveredSub(null)}
                    className="group relative"
                  >
                    <Link href={`/marketplace?category=${selectedCategory.id}&subcategory=${encodeURIComponent(sub.name)}`}>
                      <div className="glass-card hover-lift p-5 h-full">
                        <div
                          className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-30"
                          style={{ background: selectedCategory.glow }}
                        />
                        
                        <div className="relative flex items-start gap-4">
                          <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${selectedCategory.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                            <CategoryIcon 
                              category={selectedCategory.id} 
                              subcategory={sub.name} 
                              size="sm" 
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-white group-hover:text-violet-200 transition-colors">
                              {sub.name}
                            </h3>
                            <p className="mt-1 text-sm text-white/50 line-clamp-2">
                              {sub.desc}
                            </p>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-xs text-white/40">{sub.jobs} jobs</span>
                              <span className="flex items-center gap-1 text-xs text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                Browse
                                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default CategoryShowcase;
