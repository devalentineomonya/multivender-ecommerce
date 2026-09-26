"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { BiRefresh, BiHomeAlt } from "react-icons/bi";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="size-20 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center text-red-600 text-3xl font-black mb-6">
        !
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        Something Went Wrong
      </h1>
      <p className="text-gray-500 max-w-md mt-2 text-sm">
        An unexpected error occurred while loading this page. Our engineers have been notified.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        <button
          type="button"
          onClick={() => reset()}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-black transition-colors cursor-pointer"
        >
          <BiRefresh className="text-base" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors"
        >
          <BiHomeAlt className="text-base" />
          <span>Go to Home</span>
        </Link>
      </div>
    </div>
  );
}
