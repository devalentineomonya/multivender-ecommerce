import React from "react";

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-xs flex flex-col justify-between animate-pulse w-full">
      <div className="w-full aspect-square bg-gray-200 rounded-md mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded-sm w-3/4" />
        <div className="h-3 bg-gray-100 rounded-sm w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 bg-gray-200 rounded-sm w-1/3" />
          <div className="h-4 bg-gray-100 rounded-sm w-1/4" />
        </div>
        <div className="h-9 bg-gray-200 rounded-md w-full mt-2" />
      </div>
    </div>
  );
};

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-100/80 rounded-xl p-4 flex flex-col items-center gap-3 animate-pulse min-w-[140px]">
      <div className="w-16 h-16 rounded-full bg-gray-200" />
      <div className="h-4 bg-gray-200 rounded-sm w-20" />
    </div>
  );
};

export const StoreCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-xs animate-pulse flex flex-col">
      <div className="w-full h-32 bg-gray-200 rounded-md relative mb-6">
        <div className="absolute -bottom-4 left-3 w-10 h-10 rounded-full bg-gray-300 border-2 border-white" />
      </div>
      <div className="h-4 bg-gray-200 rounded-sm w-1/2 mb-2" />
      <div className="h-3 bg-gray-100 rounded-sm w-1/3 mb-1" />
      <div className="h-3 bg-gray-100 rounded-sm w-2/3" />
    </div>
  );
};

export const BrandCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-center gap-3 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-4 bg-gray-200 rounded-sm w-2/3" />
        <div className="h-3 bg-gray-100 rounded-sm w-1/2" />
      </div>
    </div>
  );
};

export const VendorDashboardSkeleton: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded-md w-64" />
          <div className="h-4 bg-gray-200 rounded-sm w-44" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 bg-gray-300 rounded-lg w-32" />
          <div className="h-9 bg-gray-200 rounded-lg w-24" />
        </div>
      </div>

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <div className="h-4 bg-gray-200 rounded-sm w-24" />
              <div className="h-8 w-8 bg-gray-200 rounded-full" />
            </div>
            <div className="h-8 bg-gray-300 rounded-md w-36 mb-2" />
            <div className="h-3 bg-gray-100 rounded-sm w-28" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-gray-200 rounded-md w-40" />
          <div className="h-8 bg-gray-200 rounded-lg w-28" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center justify-between border-b border-gray-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gray-200 rounded-md" />
                <div className="space-y-1.5">
                  <div className="h-4 bg-gray-200 rounded-sm w-48" />
                  <div className="h-3 bg-gray-100 rounded-sm w-24" />
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded-sm w-20" />
              <div className="h-4 bg-gray-200 rounded-sm w-16" />
              <div className="h-7 bg-gray-200 rounded-md w-24" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-4 bg-gray-200 rounded-sm w-48 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-2xl w-full" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 w-20 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div className="h-8 bg-gray-200 rounded-md w-3/4" />
          <div className="h-4 bg-gray-100 rounded-sm w-1/3" />
          <div className="h-10 bg-gray-300 rounded-md w-1/2" />
          <div className="space-y-2 py-4 border-y border-gray-100">
            <div className="h-4 bg-gray-100 rounded-sm w-full" />
            <div className="h-4 bg-gray-100 rounded-sm w-5/6" />
          </div>
          <div className="h-12 bg-gray-200 rounded-xl w-full" />
        </div>
      </div>
    </main>
  );
};
