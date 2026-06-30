"use client";

import { motion } from "framer-motion";

export function HeroIllustration() {
  return (
    <div className="relative w-full max-w-xl aspect-square">
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="heroGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8"/>
          </linearGradient>
          <linearGradient id="heroGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.6"/>
          </linearGradient>
          <linearGradient id="heroGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.4"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <motion.circle
          cx="200" cy="200" r="150"
          stroke="url(#heroGrad1)"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.circle
          cx="200" cy="200" r="120"
          stroke="url(#heroGrad2)"
          strokeWidth="0.5"
          fill="none"
          opacity="0.4"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.circle
          cx="200" cy="200" r="90"
          stroke="url(#heroGrad3)"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />

        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <rect x="150" y="130" width="100" height="140" rx="16" fill="url(#heroGrad1)" fillOpacity="0.15" stroke="url(#heroGrad1)" strokeWidth="1"/>
          <rect x="165" y="145" width="70" height="8" rx="4" fill="#a78bfa" fillOpacity="0.6"/>
          <rect x="165" y="160" width="50" height="6" rx="3" fill="#ec4899" fillOpacity="0.4"/>
          <rect x="165" y="175" width="60" height="6" rx="3" fill="#22d3ee" fillOpacity="0.4"/>
          <rect x="165" y="195" width="40" height="30" rx="6" fill="url(#heroGrad1)" fillOpacity="0.2" stroke="url(#heroGrad1)" strokeWidth="0.5"/>
          <rect x="210" y="195" width="25" height="30" rx="6" fill="url(#heroGrad2)" fillOpacity="0.2" stroke="url(#heroGrad2)" strokeWidth="0.5"/>
          <rect x="165" y="235" width="70" height="6" rx="3" fill="#a78bfa" fillOpacity="0.3"/>
          <rect x="165" y="248" width="45" height="6" rx="3" fill="#ec4899" fillOpacity="0.3"/>
        </motion.g>

        <motion.g
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="translate-x-[-30px]"
        >
          <rect x="70" y="180" width="50" height="80" rx="12" fill="url(#heroGrad2)" fillOpacity="0.1" stroke="url(#heroGrad2)" strokeWidth="1"/>
          <circle cx="95" cy="210" r="15" fill="url(#heroGrad1)" fillOpacity="0.3"/>
          <rect x="82" y="235" width="26" height="6" rx="3" fill="#22d3ee" fillOpacity="0.5"/>
        </motion.g>

        <motion.g
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="translate-x-[30px]"
        >
          <rect x="280" y="160" width="50" height="100" rx="12" fill="url(#heroGrad3)" fillOpacity="0.1" stroke="url(#heroGrad3)" strokeWidth="1"/>
          <rect x="290" y="180" width="30" height="30" rx="6" fill="url(#heroGrad1)" fillOpacity="0.2"/>
          <rect x="290" y="220" width="30" height="6" rx="3" fill="#ec4899" fillOpacity="0.4"/>
          <rect x="290" y="232" width="20" height="6" rx="3" fill="#fbbf24" fillOpacity="0.4"/>
        </motion.g>

        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="translate-y-[20px]"
        >
          <rect x="130" y="300" width="140" height="50" rx="12" fill="url(#heroGrad1)" fillOpacity="0.15" stroke="url(#heroGrad1)" strokeWidth="1"/>
          <circle cx="155" cy="325" r="12" fill="#a78bfa" fillOpacity="0.6"/>
          <rect x="175" cy="318" width="40" height="6" rx="3" fill="#a78bfa" fillOpacity="0.4"/>
          <rect x="175" cy="330" width="30" height="4" rx="2" fill="#ec4899" fillOpacity="0.3"/>
          <rect x="225" y="318" width="30" height="20" rx="4" fill="url(#heroGrad1)" fillOpacity="0.3"/>
        </motion.g>

        <motion.circle
          cx="80" cy="100" r="8"
          fill="#a78bfa"
          fillOpacity="0.6"
          filter="url(#glow)"
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <motion.circle
          cx="320" cy="120" r="6"
          fill="#ec4899"
          fillOpacity="0.6"
          filter="url(#glow)"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />
        
        <motion.circle
          cx="350" cy="280" r="5"
          fill="#22d3ee"
          fillOpacity="0.6"
          filter="url(#glow)"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
        
        <motion.circle
          cx="50" cy="260" r="4"
          fill="#fbbf24"
          fillOpacity="0.6"
          filter="url(#glow)"
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.85, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: 0.3 }}
        />
      </svg>
    </div>
  );
}
