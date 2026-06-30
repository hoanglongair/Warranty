"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { CategoryIcon } from "@/components/icons/category-icons";
import { SubcategoryIllustration } from "@/components/illustrations/subcategory-illustrations";

const allCategories = [
  {
    id: "design",
    name: "Design",
    color: "from-pink-500 to-rose-500",
    glow: "rgba(236, 72, 153, 0.4)",
    description: "Create stunning visuals that captivate and convert. From logos to complete brand identities.",
    subcategories: [
      { name: "Logo Design", desc: "Unique brand marks that capture your essence", jobs: 324, keywords: ["minimalist", "modern", "custom", "brand"] },
      { name: "UI/UX Design", desc: "Intuitive interfaces that users love", jobs: 512, keywords: ["figma", "prototype", "mobile", "web"] },
      { name: "Banner Design", desc: "Eye-catching banners for any platform", jobs: 198, keywords: ["social media", "ads", "campaign", "display"] },
      { name: "Brand Identity", desc: "Complete brand systems that scale", jobs: 214, keywords: ["style guide", "typography", "colors", "assets"] }
    ]
  },
  {
    id: "development",
    name: "Development",
    color: "from-violet-500 to-indigo-500",
    glow: "rgba(139, 92, 246, 0.4)",
    description: "Build cutting-edge applications with expert developers. Web3, bots, and beyond.",
    subcategories: [
      { name: "Website Development", desc: "Fast, responsive websites built to perform", jobs: 842, keywords: ["react", "nextjs", "wordpress", "shopify"] },
      { name: "Mobile App Development", desc: "Native and cross-platform mobile apps", jobs: 456, keywords: ["ios", "android", "flutter", "react native"] },
      { name: "Telegram Bots", desc: "Powerful bots for Telegram engagement", jobs: 234, keywords: ["automation", "trading", "crypto", "payments"] },
      { name: "Discord Bots", desc: "Community bots that drive engagement", jobs: 189, keywords: ["moderation", "gaming", "music", "utility"] },
      { name: "Smart Contracts", desc: "Secure blockchain contracts", jobs: 167, keywords: ["solidity", "ethereum", "nft", "defi"] },
      { name: "Web3 Development", desc: "Decentralized apps and protocols", jobs: 298, keywords: ["blockchain", "web3", "dapp", "crypto"] }
    ]
  },
  {
    id: "content",
    name: "Content",
    color: "from-amber-500 to-orange-500",
    glow: "rgba(245, 158, 11, 0.4)",
    description: "Compelling content that engages audiences and drives results across all channels.",
    subcategories: [
      { name: "Copywriting", desc: "Words that convert and compel", jobs: 287, keywords: ["sales", "landing page", "email", "persuasive"] },
      { name: "Translation", desc: "Break language barriers globally", jobs: 156, keywords: ["localization", "multilingual", "cultural", "native"] },
      { name: "Blog Writing", desc: "Engaging content that ranks", jobs: 178, keywords: ["seo", "articles", "long-form", "content"] },
      { name: "Technical Writing", desc: "Clear documentation users understand", jobs: 122, keywords: ["docs", "api", "guides", "manuals"] }
    ]
  },
  {
    id: "marketing",
    name: "Marketing",
    color: "from-cyan-500 to-teal-500",
    glow: "rgba(6, 182, 212, 0.4)",
    description: "Strategic campaigns that amplify your reach and grow your community.",
    subcategories: [
      { name: "SEO", desc: "Rank higher and drive organic traffic", jobs: 245, keywords: ["google", "keywords", "ranking", "organic"] },
      { name: "Social Media", desc: "Build engaged communities", jobs: 189, keywords: ["twitter", "instagram", "tiktok", "linkedin"] },
      { name: "Paid Advertising", desc: "ROI-focused ad campaigns", jobs: 134, keywords: ["google ads", "facebook", "ppc", "campaigns"] },
      { name: "Community Management", desc: "Grow and nurture your community", jobs: 144, keywords: ["discord", "telegram", "engagement", "support"] }
    ]
  }
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState(allCategories[0]);
  const [hoveredSub, setHoveredSub] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = searchQuery
    ? allCategories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.subcategories.some(sub => 
          sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      )
    : allCategories;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          <span className="gradient-text">Service Categories</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/60">
          Explore our curated categories and find the perfect specialist for your project.
        </p>
        
        <div className="mt-6 relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories, services, or skills..."
            className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-white placeholder-white/40 outline-none focus:border-violet-500/50"
          />
        </div>
      </motion.div>

      {searchQuery ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60">No categories found matching your search.</p>
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <div key={cat.id} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                    <CategoryIcon category={cat.id} subcategory={cat.subcategories[0].name} size="sm" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-white">{cat.name}</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.subcategories.filter(sub => 
                    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    sub.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    sub.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()))
                  ).map((sub) => (
                    <Link
                      key={sub.name}
                      href={`/marketplace?category=${cat.id}&subcategory=${encodeURIComponent(sub.name)}`}
                    >
                      <div className="glass-card hover-lift p-5 h-full">
                        <h3 className="font-semibold text-white">{sub.name}</h3>
                        <p className="mt-1 text-sm text-white/50">{sub.desc}</p>
                        <p className="mt-2 text-xs text-white/40">{sub.jobs} jobs</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </motion.div>
      ) : (
        <div className="grid gap-12">
          {allCategories.map((cat, catIndex) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg`}>
                  <CategoryIcon category={cat.id} subcategory={cat.subcategories[0].name} size="md" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">{cat.name}</h2>
                  <p className="text-sm text-white/50">{cat.subcategories.length} services available</p>
                </div>
              </div>
              
              <p className="text-white/60 max-w-2xl">{cat.description}</p>
              
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cat.subcategories.map((sub, subIndex) => (
                  <motion.div
                    key={sub.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: catIndex * 0.1 + subIndex * 0.05 }}
                    onMouseEnter={() => setHoveredSub(sub.name)}
                    onMouseLeave={() => setHoveredSub(null)}
                    className="group relative"
                  >
                    <Link href={`/marketplace?category=${cat.id}&subcategory=${encodeURIComponent(sub.name)}`}>
                      <div className="glass-card hover-lift p-5 h-full overflow-hidden">
                        <div
                          className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-25"
                          style={{ background: cat.glow }}
                        />
                        
                        <div className="relative">
                          <div className="flex items-start gap-4">
                            <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                              <CategoryIcon 
                                category={cat.id} 
                                subcategory={sub.name} 
                                size="md" 
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="font-display text-lg font-semibold text-white group-hover:text-violet-200 transition-colors">
                                {sub.name}
                              </h3>
                              <p className="mt-1 text-sm text-white/50 line-clamp-2">
                                {sub.desc}
                              </p>
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {hoveredSub === sub.name && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 overflow-hidden"
                              >
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {sub.keywords.map((kw) => (
                                    <span
                                      key={kw}
                                      className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/50"
                                    >
                                      {kw}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-white/40">{sub.jobs} jobs posted</span>
                                  <span className="flex items-center gap-1 text-xs text-violet-300">
                                    Browse
                                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                  </span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          {hoveredSub !== sub.name && (
                            <>
                              <div className="flex items-center justify-between mt-4">
                                <span className="text-xs text-white/40">{sub.jobs} jobs posted</span>
                                <span className="flex items-center gap-1 text-xs text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                  Browse
                                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
