import React from "react";
import Link from "next/link";
import { BiSearch, BiHomeAlt } from "react-icons/bi";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="size-24 rounded-full bg-emerald-50 border-2 border-primary/20 flex items-center justify-center text-primary text-4xl font-black mb-6">
        404
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
        Page Not Found
      </h1>
      <p className="text-gray-500 max-w-md mt-2 text-sm">
        We could not find the page or product you were looking for. It might have been moved, renamed, or is temporarily unavailable.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-black transition-colors"
        >
          <BiHomeAlt className="text-base" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/shop"
          className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors"
        >
          <BiSearch className="text-base" />
          <span>Browse Products</span>
        </Link>
      </div>
    </div>
  );
}
