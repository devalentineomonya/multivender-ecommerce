import React from "react";

export default function CategoriesLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-4 w-32 bg-gray-200 rounded mb-6" />
      <div className="h-44 bg-gray-200 rounded-3xl mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 h-56 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="w-16 h-6 bg-gray-200 rounded-full" />
              </div>
              <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-full bg-gray-200 rounded" />
            </div>
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </main>
  );
}
