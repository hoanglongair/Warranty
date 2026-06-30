"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
      <div className="font-display text-9xl font-bold gradient-text">404</div>
      <h1 className="mt-4 font-display text-3xl font-bold text-white">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-white/60">
        The page you're looking for doesn't exist or has been moved. Let's get
        you back on track.
      </p>
      <Link href="/" className="btn-primary mt-8">
        <ArrowLeft className="h-4 w-4" />
        Back Home
      </Link>
    </div>
  );
}
