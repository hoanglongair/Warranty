import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AnimatedBackground } from "@/components/background/animated-background";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Warranty — Premium Web3 Freelance Marketplace",
    template: "%s | Warranty"
  },
  description:
    "Connect with elite freelancers or find premium projects. Warranty is the next-generation Web3 freelance marketplace with smart contract escrow, NFT credentials, and global talent.",
  keywords: [
    "freelance",
    "marketplace",
    "web3",
    "blockchain",
    "jobs",
    "designers",
    "developers"
  ],
  openGraph: {
    title: "Warranty — Premium Web3 Freelance Marketplace",
    description:
      "The next-generation freelance marketplace connecting elite talent with forward-thinking clients.",
    type: "website"
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>
        <AnimatedBackground />
        <Navbar />
        <main className="relative z-10 min-h-screen pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
