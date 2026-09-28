import React from "react";

/** Mirrors ProductCard's anatomy line-for-line so loading → loaded causes no shift. */
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="card-surface flex h-full w-full flex-col overflow-hidden animate-pulse" aria-hidden="true">
      <div className="aspect-square bg-gray-100" />
      <div className="flex flex-1 flex-col gap-1.5 p-3 md:p-4">
        {/* 2-line title (text-sm → 20px lines) */}
        <div className="flex h-10 flex-col justify-center gap-2">
          <div className="h-3 w-full rounded-sm bg-gray-200" />
          <div className="h-3 w-2/3 rounded-sm bg-gray-200" />
        </div>
        {/* description (text-xs → 16px) */}
        <div className="flex h-4 items-center">
          <div className="h-2.5 w-1/2 rounded-sm bg-gray-100" />
        </div>
        {/* price (text-base → 24px) */}
        <div className="mt-auto flex h-7 items-center pt-1">
          <div className="h-4 w-1/3 rounded-sm bg-gray-200" />
        </div>
        {/* add-to-cart pill */}
        <div className="pt-2">
          <div className="h-8 w-full rounded-full bg-gray-200 sm:w-28" />
        </div>
      </div>
    </div>
  );
};

export type ProductsVariant = "shop" | "deals";

/** Grid classes shared by the Shop/Deals grids and their skeletons, so loading → loaded never reflows. */
export const PRODUCT_GRID_CLASS: Record<ProductsVariant, string> = {
  shop: "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4",
  deals: "grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3",
};

export const ProductGridSkeleton: React.FC<{ variant: ProductsVariant; count?: number }> = ({
  variant,
  count = variant === "deals" ? 6 : 8,
}) => (
  <div className={PRODUCT_GRID_CLASS[variant]}>
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

/** Full Shop/Deals page placeholder: hero, controls bar, grid. Used by route loading.tsx and Suspense. */
export const ProductsPageSkeleton: React.FC<{ variant: ProductsVariant }> = ({ variant }) => (
  <div className="flex w-full justify-center" aria-busy="true">
    <div className="container max-w-7xl px-3">
      <div
        className={
          variant === "deals"
            ? "mt-4 aspect-[2/1] w-full animate-pulse rounded-panel bg-gray-800 md:aspect-[3/1] lg:max-h-[360px]"
            : "mt-4 aspect-video w-full animate-pulse rounded-panel bg-gray-100 md:aspect-[21/9] lg:max-h-[440px]"
        }
      />
      <div className="mt-3 flex h-[62px] items-center justify-between border-y border-gray-200">
        <div className="h-8 w-28 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-100" />
      </div>
      <div className="mt-14 h-9 w-48 animate-pulse rounded-md bg-gray-200" />
      <div className="mt-10">
        <ProductGridSkeleton variant={variant} />
      </div>
    </div>
  </div>
);

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
