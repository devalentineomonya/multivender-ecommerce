"use client";

import React from "react";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import Services from "@/screens/home/widgets/services";
import PopularProducts from "@/screens/home/widgets/popular-products";
import ProductCard from "@/components/shared/product-card/product-card";
import SectionLayout from "../section/section-layout";
import ProductsLayoutFilter from "./products-layout-filter";
import { useGetProducts } from "@/features/products/use-get-products";
import { ProductCardSkeleton } from "@/components/shared/skeletons";

const ProductsLayoutMain = () => {
  const [category, setCategory] = useQueryState("category", parseAsString);
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [sort] = useQueryState("sort", parseAsString);
  const [minPrice, setMinPrice] = useQueryState("minPrice", parseAsInteger);
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice", parseAsInteger);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [label] = useQueryState("label", parseAsString);
  const [budgetTier] = useQueryState("budgetTier", parseAsString);

  const { data, isLoading } = useGetProducts({
    category: category || undefined,
    search: search || undefined,
    label: label || undefined,
    budgetTier: (budgetTier as "budget" | "mid" | "premium") || undefined,
    sort: (sort as "newest" | "price_asc" | "price_desc" | "popular") || undefined,
    minPrice: minPrice !== null ? minPrice : undefined,
    maxPrice: maxPrice !== null ? maxPrice : undefined,
    page: page || 1,
    limit: 16,
  });

  const products = data?.products || [];

  const handleResetFilters = () => {
    setCategory(null);
    setSearch(null);
    setMinPrice(null);
    setMaxPrice(null);
    setPage(1);
  };

  return (
    <>
      <ProductsLayoutFilter />
      <SectionLayout title="Products For You !">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid sm:justify-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-3 gap-y-12">
              {products.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={{
                    id: prod.id,
                    name: prod.name,
                    price: prod.price,
                    image: Array.isArray(prod.images) && prod.images.length > 0 ? (prod.images[0] as string) : undefined,
                    images: Array.isArray(prod.images) ? (prod.images as string[]) : undefined,
                    shortDescription: prod.shortDescription || "",
                  }}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {data?.pagination && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 my-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 text-xs font-bold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-600 font-medium">
                  Page <strong className="text-slate-900">{page}</strong> of{" "}
                  <strong className="text-slate-900">{data.pagination.totalPages}</strong> ({data.pagination.total} products)
                </span>
                <button
                  type="button"
                  disabled={page >= data.pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center bg-gray-50 rounded-xl border border-gray-100 p-8">
            <h3 className="text-lg font-semibold text-gray-800">No products match your criteria</h3>
            <p className="text-gray-500 text-xs mt-1">
              Try adjusting your price range, searching a different keyword, or selecting another department.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 px-6 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-black transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
        <PopularProducts />
        <Services />
      </SectionLayout>
    </>
  );
};

export default ProductsLayoutMain;
