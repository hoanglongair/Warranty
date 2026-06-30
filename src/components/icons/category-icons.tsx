"use client";

import { motion } from "framer-motion";

interface CategoryIconProps {
  category: string;
  subcategory: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16"
};

const iconSizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8"
};

export function CategoryIcon({ category, subcategory, size = "md", animated = false }: CategoryIconProps) {
  const wrapperClass = `${sizeClasses[size]} rounded-xl flex items-center justify-center`;
  
  const renderIcon = () => {
    const iconClass = iconSizeClasses[size];

    // DESIGN CATEGORY
    if (category === "design") {
      if (subcategory === "Logo Design") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
            <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
          </svg>
        );
      }
      if (subcategory === "UI/UX Design") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
            <circle cx="6" cy="6" r="1" fill="currentColor" stroke="none" />
            <rect x="5" y="12" width="3" height="6" rx="0.5" fill="currentColor" opacity="0.3" />
          </svg>
        );
      }
      if (subcategory === "Banner Design") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 8h20" />
            <circle cx="6" cy="6" r="1" fill="currentColor" stroke="none" />
            <circle cx="10" cy="6" r="1" fill="currentColor" stroke="none" />
            <rect x="5" y="11" width="6" height="7" rx="1" fill="currentColor" opacity="0.2" />
            <rect x="13" y="11" width="7" height="3" rx="0.5" fill="currentColor" opacity="0.3" />
            <rect x="13" y="15" width="4" height="1.5" rx="0.5" fill="currentColor" opacity="0.2" />
          </svg>
        );
      }
      if (subcategory === "Brand Identity") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
      }
    }

    // DEVELOPMENT CATEGORY
    if (category === "development") {
      if (subcategory === "Website Development") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M12 2v20" />
          </svg>
        );
      }
      if (subcategory === "Mobile App Development") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <path d="M12 18h.01" />
            <path d="M9 6h6" />
            <rect x="8" y="10" width="8" height="6" rx="1" fill="currentColor" opacity="0.2" />
          </svg>
        );
      }
      if (subcategory === "Telegram Bots") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            <path d="M8 12l3 3 5-6" />
            <circle cx="17" cy="7" r="3" fill="currentColor" opacity="0.3" />
          </svg>
        );
      }
      if (subcategory === "Discord Bots") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
            <path d="M15 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
            <path d="M7.5 7.5c1.5-1.5 4.5-1.5 4.5-1.5s0 3 0 3" />
            <path d="M7.5 16.5c1.5 1.5 4.5 1.5 4.5 1.5s0-3 0-3" />
            <path d="M12 6c3.5 0 6.5 2.5 7.5 6-1 2-3 3.5-4.5 4.5" />
            <path d="M12 6c-3.5 0-6.5 2.5-7.5 6 1 2 3 3.5 4.5 4.5" />
            <path d="M16.5 12c0 3-1.5 5-4.5 5" />
          </svg>
        );
      }
      if (subcategory === "Smart Contracts") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
            <path d="M7 15h10" />
          </svg>
        );
      }
      if (subcategory === "Web3 Development") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
            <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
          </svg>
        );
      }
    }

    // CONTENT CATEGORY
    if (category === "content") {
      if (subcategory === "Copywriting") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            <path d="M15 5l4 4" />
          </svg>
        );
      }
      if (subcategory === "Translation") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 8l6 6" />
            <path d="M4 14l6-6 2-2" />
            <path d="M2 5h12" />
            <path d="M7 2h1" />
            <path d="M22 22l-5-10-5 10" />
            <path d="M14 18h6" />
          </svg>
        );
      }
      if (subcategory === "Blog Writing") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="16" y2="17" />
            <line x1="8" y1="9" x2="10" y2="9" />
          </svg>
        );
      }
      if (subcategory === "Technical Writing") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M8 13h2" />
            <path d="M8 17h5" />
            <path d="M14 13h2" />
            <path d="M14 17h2" />
            <rect x="6" y="10" width="3" height="1.5" rx="0.5" fill="currentColor" opacity="0.3" />
          </svg>
        );
      }
    }

    // MARKETING CATEGORY
    if (category === "marketing") {
      if (subcategory === "SEO") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
            <path d="M11 8v6" />
            <path d="M8 11h6" />
          </svg>
        );
      }
      if (subcategory === "Social Media") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        );
      }
      if (subcategory === "Paid Advertising") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M12 12l4-2" />
            <circle cx="12" cy="12" r="2" />
            <path d="M6 12h.01" />
            <path d="M18 12h.01" />
          </svg>
        );
      }
      if (subcategory === "Community Management") {
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      }
    }

    // Default fallback
    return (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    );
  };

  const getGradient = () => {
    const gradients: Record<string, { from: string; to: string }> = {
      design: { from: "from-pink-500", to: "to-rose-500" },
      development: { from: "from-violet-500", to: "to-indigo-500" },
      content: { from: "from-amber-500", to: "to-orange-500" },
      marketing: { from: "from-cyan-500", to: "to-teal-500" }
    };
    return gradients[category] || gradients.development;
  };

  const gradient = getGradient();

  if (animated) {
    return (
      <motion.div
        className={`${wrapperClass} bg-gradient-to-br ${gradient.from} ${gradient.to}`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className="text-white">
          {renderIcon()}
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`${wrapperClass} bg-gradient-to-br ${gradient.from} ${gradient.to}`}>
      <div className="text-white">
        {renderIcon()}
      </div>
    </div>
  );
}

export function CategoryIconGrid({ category }: { category: string }) {
  const subcategories = getSubcategories(category);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {subcategories.map((sub) => (
        <motion.div
          key={sub}
          whileHover={{ scale: 1.05 }}
          className="glass-card p-4 flex flex-col items-center gap-2 text-center"
        >
          <CategoryIcon category={category} subcategory={sub} size="md" animated />
          <span className="text-xs text-white/70">{sub}</span>
        </motion.div>
      ))}
    </div>
  );
}

function getSubcategories(category: string): string[] {
  const subcategories: Record<string, string[]> = {
    design: ["Logo Design", "UI/UX Design", "Banner Design", "Brand Identity"],
    development: ["Website Development", "Mobile App Development", "Telegram Bots", "Discord Bots", "Smart Contracts", "Web3 Development"],
    content: ["Copywriting", "Translation", "Blog Writing", "Technical Writing"],
    marketing: ["SEO", "Social Media", "Paid Advertising", "Community Management"]
  };
  return subcategories[category] || [];
}

export default CategoryIcon;
