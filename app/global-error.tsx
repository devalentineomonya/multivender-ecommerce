"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global fatal error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans text-slate-800">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-md text-center">
          <div className="size-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
            !
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Application Error</h2>
          <p className="text-sm text-gray-500 mb-6">
            A fatal error prevented the application from rendering properly.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              Reload Application
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 border border-gray-200 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
