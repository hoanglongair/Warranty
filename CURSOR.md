# CURSOR.md

This file contains project-specific guidelines and instructions for working with this codebase.

## Project Overview

**Warranty** is a Premium Web3 Freelance Marketplace built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

## Code Style

- Use `cn()` utility from `@/lib/utils` for conditional classNames
- Use `"use client"` directive for client-side components
- Follow existing naming conventions (camelCase for variables, PascalCase for components)
- Use absolute imports with `@/` prefix

## Directory Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable React components
│   ├── layout/       # Layout components (Navbar, Footer)
│   ├── sections/    # Page sections
│   ├── background/  # Background effects
│   └── ...
├── hooks/            # Custom React hooks
├── store/            # Zustand stores
├── data/             # Static data
├── types/            # TypeScript types
├── lib/              # Utilities
└── i18n/             # Internationalization
```

## Branding

- **Logo**: `public/logo.png`
- **Favicon**: `public/favicon.png`
- **Color Palette**: Purple/Pink/Cyan gradient theme
