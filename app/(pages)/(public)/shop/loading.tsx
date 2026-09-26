import React from "react";
import { ProductCardSkeleton } from "@/components/shared/skeletons";

export default function ShopLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="w-full h-44 bg-gray-200 rounded-2xl mb-8" />
      {/* Filters Skeleton */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-9 w-28 bg-gray-200 rounded-full shrink-0" />
        ))}
      </div>
      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
