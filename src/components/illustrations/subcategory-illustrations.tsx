"use client";

import { motion } from "framer-motion";

interface SubcategoryIllustrationProps {
  category: string;
  subcategory: string;
  className?: string;
}

export function SubcategoryIllustration({ category, subcategory, className = "" }: SubcategoryIllustrationProps) {
  const getGradient = () => {
    const gradients: Record<string, string> = {
      design: "from-pink-500/20 to-rose-500/20",
      development: "from-violet-500/20 to-indigo-500/20",
      content: "from-amber-500/20 to-orange-500/20",
      marketing: "from-cyan-500/20 to-teal-500/20"
    };
    return gradients[category] || gradients.development;
  };

  const renderIllustration = () => {
    // DESIGN SUB-CATEGORIES
    if (category === "design") {
      if (subcategory === "Logo Design") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            <motion.circle
              cx="100" cy="60" r="45"
              stroke="url(#logoGrad1)" strokeWidth="2" fill="none"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              cx="100" cy="60" r="35"
              stroke="#ec4899" strokeWidth="1" fill="none" opacity="0.5"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.polygon
              points="100,30 115,55 100,80 85,55"
              fill="url(#logoGrad1)" opacity="0.8"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <circle cx="100" cy="55" r="8" fill="#fce7f3" opacity="0.9"/>
          </svg>
        );
      }
      
      if (subcategory === "UI/UX Design") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="uiGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            <rect x="40" y="20" width="120" height="80" rx="8" fill="url(#uiGrad1)" opacity="0.2" stroke="#a78bfa" strokeWidth="1.5"/>
            <rect x="50" y="30" width="100" height="12" rx="4" fill="#a78bfa" opacity="0.3"/>
            <rect x="50" y="48" width="45" height="45" rx="4" fill="#a78bfa" opacity="0.2"/>
            <rect x="100" y="48" width="50" height="10" rx="3" fill="#a78bfa" opacity="0.4"/>
            <rect x="100" y="62" width="35" height="8" rx="2" fill="#a78bfa" opacity="0.2"/>
            <rect x="100" y="74" width="50" height="8" rx="2" fill="#a78bfa" opacity="0.15"/>
            <motion.circle
              cx="150" cy="25" r="6"
              fill="#a78bfa" opacity="0.6"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="160" cy="25" r="6"
              fill="#c4b5fd" opacity="0.4"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
            <motion.circle
              cx="170" cy="25" r="6"
              fill="#ddd6fe" opacity="0.3"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            />
          </svg>
        );
      }

      if (subcategory === "Banner Design") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="bannerGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#c084fc" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8"/>
              </linearGradient>
            </defs>
            <rect x="20" y="35" width="160" height="50" rx="6" fill="url(#bannerGrad1)" opacity="0.3" stroke="url(#bannerGrad1)" strokeWidth="1"/>
            <rect x="30" y="45" width="40" height="30" rx="4" fill="#fce7f3" opacity="0.4"/>
            <rect x="80" y="50" width="90" height="6" rx="3" fill="#fdf4ff" opacity="0.5"/>
            <rect x="80" y="60" width="60" height="4" rx="2" fill="#fdf4ff" opacity="0.3"/>
            <rect x="80" y="68" width="75" height="4" rx="2" fill="#fdf4ff" opacity="0.3"/>
            <motion.rect
              x="130" y="50" width="35" height="18" rx="4"
              fill="#c084fc" opacity="0.6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </svg>
        );
      }

      if (subcategory === "Brand Identity") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="brandGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            <motion.polygon
              points="100,15 115,40 100,65 85,40"
              fill="url(#brandGrad1)" opacity="0.8"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <polygon points="100,25 110,38 100,51 90,38" fill="#fef3c7" opacity="0.6"/>
            <motion.circle
              cx="100" cy="38" r="5"
              fill="#fef3c7"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <rect x="55" y="75" width="90" height="30" rx="4" fill="url(#brandGrad1)" opacity="0.2" stroke="#fbbf24" strokeWidth="1"/>
            <text x="100" y="95" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold" opacity="0.8">BRAND</text>
          </svg>
        );
      }
    }

    // DEVELOPMENT SUB-CATEGORIES
    if (category === "development") {
      if (subcategory === "Website Development") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="webGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            <rect x="30" y="25" width="140" height="70" rx="6" fill="url(#webGrad1)" opacity="0.2" stroke="#8b5cf6" strokeWidth="1.5"/>
            <rect x="40" y="35" width="120" height="8" rx="2" fill="#8b5cf6" opacity="0.4"/>
            <rect x="40" y="48" width="50" height="40" rx="3" fill="#8b5cf6" opacity="0.2"/>
            <rect x="95" y="48" width="65" height="8" rx="2" fill="#8b5cf6" opacity="0.3"/>
            <rect x="95" y="60" width="45" height="6" rx="2" fill="#8b5cf6" opacity="0.2"/>
            <rect x="95" y="70" width="55" height="6" rx="2" fill="#8b5cf6" opacity="0.2"/>
            <rect x="95" y="80" width="35" height="8" rx="2" fill="#8b5cf6" opacity="0.3"/>
            <motion.circle
              cx="160" cy="30" r="4"
              fill="#22d3ee"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </svg>
        );
      }

      if (subcategory === "Mobile App Development") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="mobileGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            <rect x="60" y="15" width="80" height="90" rx="12" fill="url(#mobileGrad1)" opacity="0.2" stroke="#a78bfa" strokeWidth="2"/>
            <rect x="70" y="25" width="60" height="8" rx="4" fill="#a78bfa" opacity="0.4"/>
            <rect x="85" y="35" width="30" height="3" rx="1.5" fill="#a78bfa" opacity="0.2"/>
            <rect x="70" y="45" width="60" height="35" rx="4" fill="#a78bfa" opacity="0.2"/>
            <rect x="70" y="85" width="25" height="6" rx="3" fill="#a78bfa" opacity="0.3"/>
            <rect x="100" y="85" width="30" height="6" rx="3" fill="#22d3ee" opacity="0.4"/>
            <motion.circle
              cx="100" cy="18" r="3"
              fill="#a78bfa"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <circle cx="100" cy="100" r="8" stroke="#a78bfa" strokeWidth="1" fill="none" opacity="0.3"/>
          </svg>
        );
      }

      if (subcategory === "Telegram Bots") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="telegramGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            <motion.circle
              cx="100" cy="60" r="40"
              fill="url(#telegramGrad1)" opacity="0.2"
              stroke="#22d3ee" strokeWidth="2"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <path d="M100 30 L100 90 M70 60 L130 60" stroke="#22d3ee" strokeWidth="2" opacity="0.5"/>
            <motion.path
              d="M75 45 L100 60 L125 45"
              stroke="#22d3ee" strokeWidth="3" fill="none" strokeLinecap="round"
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="100" cy="60" r="8"
              fill="#22d3ee" opacity="0.6"
              animate={{ r: [8, 10, 8] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </svg>
        );
      }

      if (subcategory === "Discord Bots") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="discordGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            <motion.ellipse
              cx="100" cy="60" rx="50" ry="35"
              fill="url(#discordGrad1)" opacity="0.2"
              stroke="#8b5cf6" strokeWidth="1.5"
              animate={{ scaleX: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <circle cx="80" cy="55" r="10" fill="#8b5cf6" opacity="0.6"/>
            <circle cx="120" cy="55" r="10" fill="#8b5cf6" opacity="0.6"/>
            <circle cx="80" cy="55" r="4" fill="#c4b5fd"/>
            <circle cx="120" cy="55" r="4" fill="#c4b5fd"/>
            <motion.path
              d="M75 70 Q100 85 125 70"
              stroke="#8b5cf6" strokeWidth="2" fill="none"
              animate={{ d: ["M75 70 Q100 85 125 70", "M75 70 Q100 75 125 70", "M75 70 Q100 85 125 70"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <rect x="95" y="20" width="10" height="15" rx="2" fill="#8b5cf6" opacity="0.4"/>
          </svg>
        );
      }

      if (subcategory === "Smart Contracts") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="contractGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#059669" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            <rect x="45" y="25" width="110" height="70" rx="8" fill="url(#contractGrad1)" opacity="0.2" stroke="#10b981" strokeWidth="2"/>
            <rect x="55" y="35" width="90" height="8" rx="2" fill="#10b981" opacity="0.4"/>
            <rect x="55" y="48" width="40" height="40" rx="4" fill="#10b981" opacity="0.2" stroke="#10b981" strokeWidth="1"/>
            <path d="M65 68 L75 78 L90 63" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="100" y="50" width="40" height="6" rx="2" fill="#10b981" opacity="0.3"/>
            <rect x="100" y="60" width="30" height="4" rx="2" fill="#10b981" opacity="0.2"/>
            <rect x="100" y="68" width="35" height="4" rx="2" fill="#10b981" opacity="0.2"/>
            <rect x="100" y="76" width="25" height="6" rx="2" fill="#10b981" opacity="0.3"/>
            <motion.circle
              cx="155" cy="30" r="8"
              fill="#10b981" opacity="0.4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </svg>
        );
      }

      if (subcategory === "Web3 Development") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="web3Grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8"/>
              </linearGradient>
            </defs>
            <motion.circle
              cx="100" cy="60" r="40"
              stroke="url(#web3Grad1)" strokeWidth="2" fill="none"
              strokeDasharray="8 4"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              cx="100" cy="60" r="28"
              stroke="#a78bfa" strokeWidth="1" fill="none" opacity="0.5"
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <polygon points="100,35 115,55 105,55 105,75 95,75 95,55 85,55" fill="url(#web3Grad1)" opacity="0.8"/>
            <motion.circle cx="100" cy="55" r="4" fill="#fff" opacity="0.8" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}/>
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.circle
                key={i}
                cx={100 + 40 * Math.cos((angle * Math.PI) / 180)}
                cy={60 + 40 * Math.sin((angle * Math.PI) / 180)}
                r="3"
                fill="#ec4899"
                opacity="0.6"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </svg>
        );
      }
    }

    // CONTENT SUB-CATEGORIES
    if (category === "content") {
      if (subcategory === "Copywriting") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="copyGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            <rect x="50" y="20" width="100" height="80" rx="6" fill="url(#copyGrad1)" opacity="0.2" stroke="#fbbf24" strokeWidth="1.5"/>
            <motion.path
              d="M85 35 L100 50 L115 35"
              stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round"
              animate={{ d: ["M85 35 L100 50 L115 35", "M85 35 L100 45 L115 35", "M85 35 L100 50 L115 35"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <rect x="70" y="55" width="60" height="4" rx="2" fill="#fbbf24" opacity="0.4"/>
            <rect x="70" y="63" width="45" height="4" rx="2" fill="#fbbf24" opacity="0.3"/>
            <rect x="70" y="71" width="55" height="4" rx="2" fill="#fbbf24" opacity="0.3"/>
            <rect x="70" y="79" width="35" height="4" rx="2" fill="#fbbf24" opacity="0.3"/>
            <motion.circle
              cx="150" cy="25" r="8"
              fill="#fbbf24" opacity="0.5"
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        );
      }

      if (subcategory === "Translation") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="transGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            <rect x="45" y="25" width="50" height="70" rx="4" fill="url(#transGrad1)" opacity="0.2" stroke="#f97316" strokeWidth="1.5"/>
            <rect x="105" y="25" width="50" height="70" rx="4" fill="url(#transGrad1)" opacity="0.2" stroke="#f97316" strokeWidth="1.5"/>
            <rect x="52" y="35" width="36" height="4" rx="2" fill="#f97316" opacity="0.4"/>
            <rect x="52" y="43" width="28" height="3" rx="1.5" fill="#f97316" opacity="0.3"/>
            <rect x="52" y="50" width="32" height="3" rx="1.5" fill="#f97316" opacity="0.3"/>
            <rect x="52" y="57" width="24" height="3" rx="1.5" fill="#f97316" opacity="0.3"/>
            <rect x="112" y="35" width="36" height="4" rx="2" fill="#f97316" opacity="0.4"/>
            <rect x="112" y="43" width="30" height="3" rx="1.5" fill="#f97316" opacity="0.3"/>
            <rect x="112" y="50" width="26" height="3" rx="1.5" fill="#f97316" opacity="0.3"/>
            <rect x="112" y="57" width="32" height="3" rx="1.5" fill="#f97316" opacity="0.3"/>
            <motion.path
              d="M100 60 L100 60"
              stroke="#f97316" strokeWidth="2"
              strokeDasharray="4 2"
              animate={{ d: ["M95 60 L105 60", "M95 60 L100 55 L105 60", "M95 60 L105 60"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <path d="M95 60 L105 60 M100 55 L105 60" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      }

      if (subcategory === "Blog Writing") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="blogGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            <rect x="45" y="20" width="110" height="80" rx="6" fill="url(#blogGrad1)" opacity="0.2" stroke="#f59e0b" strokeWidth="1.5"/>
            <rect x="55" y="30" width="90" height="10" rx="3" fill="#f59e0b" opacity="0.5"/>
            <rect x="55" y="45" width="90" height="50" rx="3" fill="#f59e0b" opacity="0.1"/>
            <rect x="60" y="50" width="50" height="4" rx="2" fill="#f59e0b" opacity="0.4"/>
            <rect x="60" y="58" width="40" height="3" rx="1.5" fill="#f59e0b" opacity="0.3"/>
            <rect x="60" y="65" width="45" height="3" rx="1.5" fill="#f59e0b" opacity="0.3"/>
            <rect x="60" y="72" width="35" height="3" rx="1.5" fill="#f59e0b" opacity="0.3"/>
            <rect x="60" y="79" width="42" height="3" rx="1.5" fill="#f59e0b" opacity="0.3"/>
            <rect x="115" y="50" width="25" height="35" rx="3" fill="#f59e0b" opacity="0.15"/>
            <motion.circle
              cx="145" cy="30" r="6"
              fill="#f59e0b" opacity="0.6"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        );
      }

      if (subcategory === "Technical Writing") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="techGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#c2410c" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            <rect x="40" y="20" width="120" height="80" rx="6" fill="url(#techGrad1)" opacity="0.2" stroke="#f97316" strokeWidth="1.5"/>
            <rect x="50" y="30" width="100" height="8" rx="2" fill="#f97316" opacity="0.4"/>
            <rect x="50" y="45" width="15" height="45" rx="2" fill="#f97316" opacity="0.15"/>
            <rect x="70" y="45" width="80" height="4" rx="2" fill="#f97316" opacity="0.3"/>
            <rect x="70" y="53" width="65" height="3" rx="1.5" fill="#f97316" opacity="0.2"/>
            <rect x="70" y="60" width="70" height="3" rx="1.5" fill="#f97316" opacity="0.2"/>
            <rect x="70" y="67" width="55" height="3" rx="1.5" fill="#f97316" opacity="0.2"/>
            <rect x="70" y="74" width="75" height="3" rx="1.5" fill="#f97316" opacity="0.2"/>
            <rect x="70" y="81" width="60" height="3" rx="1.5" fill="#f97316" opacity="0.2"/>
            <path d="M52 50 L60 55 L52 60" stroke="#f97316" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <path d="M52 60 L60 65 L52 70" stroke="#f97316" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <path d="M52 70 L60 75 L52 80" stroke="#f97316" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
        );
      }
    }

    // MARKETING SUB-CATEGORIES
    if (category === "marketing") {
      if (subcategory === "SEO") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="seoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            <circle cx="100" cy="50" r="35" fill="url(#seoGrad1)" opacity="0.2" stroke="#22d3ee" strokeWidth="2"/>
            <motion.path
              d="M100 25 L100 75"
              stroke="#22d3ee" strokeWidth="3" strokeLinecap="round"
              animate={{ y1: [25, 20, 25], y2: [75, 80, 75] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.path
              d="M75 40 L125 60 M125 40 L75 60"
              stroke="#22d3ee" strokeWidth="2" strokeLinecap="round"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.circle
              cx="100" cy="50" r="6"
              fill="#22d3ee" opacity="0.6"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <rect x="60" y="85" width="80" height="20" rx="4" fill="url(#seoGrad1)" opacity="0.2" stroke="#22d3ee" strokeWidth="1"/>
            <rect x="65" y="90" width="30" height="3" rx="1.5" fill="#22d3ee" opacity="0.3"/>
            <rect x="65" y="95" width="20" height="2" rx="1" fill="#22d3ee" opacity="0.2"/>
            <rect x="100" y="90" width="35" height="10" rx="2" fill="#22d3ee" opacity="0.4"/>
          </svg>
        );
      }

      if (subcategory === "Social Media") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="socialGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            <motion.circle
              cx="100" cy="50" r="35"
              fill="url(#socialGrad1)" opacity="0.2"
              stroke="#06b6d4" strokeWidth="2"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <circle cx="70" cy="50" r="12" fill="#06b6d4" opacity="0.6"/>
            <circle cx="130" cy="50" r="12" fill="#06b6d4" opacity="0.6"/>
            <circle cx="100" cy="85" r="12" fill="#06b6d4" opacity="0.6"/>
            <motion.line x1="82" y1="50" x2="118" y2="50" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 2"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.line x1="70" y1="62" x2="100" y2="73" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 2"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            />
            <motion.line x1="130" y1="62" x2="100" y2="73" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 2"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
            />
          </svg>
        );
      }

      if (subcategory === "Paid Advertising") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="adsGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            <rect x="45" y="25" width="110" height="70" rx="6" fill="url(#adsGrad1)" opacity="0.2" stroke="#22d3ee" strokeWidth="1.5"/>
            <rect x="55" y="35" width="90" height="15" rx="3" fill="#22d3ee" opacity="0.3"/>
            <rect x="55" y="55" width="50" height="30" rx="3" fill="#22d3ee" opacity="0.2"/>
            <rect x="110" y="55" width="35" height="8" rx="2" fill="#22d3ee" opacity="0.4"/>
            <rect x="110" y="67" width="25" height="5" rx="2" fill="#22d3ee" opacity="0.2"/>
            <rect x="110" y="76" width="30" height="5" rx="2" fill="#22d3ee" opacity="0.2"/>
            <motion.path
              d="M55 75 L80 65 L105 72 L130 60"
              stroke="#22d3ee" strokeWidth="2" fill="none" strokeLinecap="round"
              animate={{ d: ["M55 75 L80 65 L105 72 L130 60", "M55 70 L80 75 L105 65 L130 70", "M55 75 L80 65 L105 72 L130 60"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="130" cy="60" r="4"
              fill="#22d3ee"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </svg>
        );
      }

      if (subcategory === "Community Management") {
        return (
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
              <linearGradient id="commGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            <motion.circle
              cx="100" cy="50" r="40"
              fill="url(#commGrad1)" opacity="0.15"
              stroke="#0ea5e9" strokeWidth="1.5"
              strokeDasharray="6 3"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <circle cx="100" cy="50" r="25" fill="url(#commGrad1)" opacity="0.2" stroke="#0ea5e9" strokeWidth="1.5"/>
            <motion.circle cx="100" cy="35" r="8" fill="#0ea5e9" opacity="0.7" animate={{ y: [-2, 2, -2] }} transition={{ duration: 2, repeat: Infinity }}/>
            <motion.circle cx="80" cy="55" r="8" fill="#0ea5e9" opacity="0.7" animate={{ y: [2, -2, 2] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}/>
            <motion.circle cx="120" cy="55" r="8" fill="#0ea5e9" opacity="0.7" animate={{ y: [-2, 2, -2] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}/>
            <circle cx="100" cy="50" r="5" fill="#e0f2fe"/>
            <circle cx="85" cy="70" r="5" fill="#0ea5e9" opacity="0.4"/>
            <circle cx="115" cy="70" r="5" fill="#0ea5e9" opacity="0.4"/>
            <circle cx="100" cy="78" r="5" fill="#0ea5e9" opacity="0.4"/>
          </svg>
        );
      }
    }

    return null;
  };

  return renderIllustration();
}

export default SubcategoryIllustration;
