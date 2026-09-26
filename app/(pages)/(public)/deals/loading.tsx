import React from "react";
import { ProductCardSkeleton } from "@/components/shared/skeletons";

export default function DealsLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="w-full h-44 bg-gray-200 rounded-2xl mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
