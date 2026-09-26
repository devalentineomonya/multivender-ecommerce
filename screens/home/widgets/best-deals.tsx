"use client";

import React, { useState } from "react";
import Link from "next/link";
import SectionLayout from "@/components/common/layouts/section/section-layout";
import ProductCard from "@/components/shared/product-card/product-card";
import { ProductCardSkeleton } from "@/components/shared/skeletons";
import { useGetProducts } from "@/features/products/use-get-products";
import { useGetCategories } from "@/features/categories/use-get-categories";
import { useI18nStore } from "@/lib/i18n/store";
import { BsArrowRight } from "react-icons/bs";

const BestDeals = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const { data: categoriesData } = useGetCategories();
  const { data: productsData, isLoading } = useGetProducts({
    category: selectedCategory,
    limit: 8,
  });
  const { t } = useI18nStore();

  const products = productsData?.products || [];
  const categories = categoriesData || [];

  return (
    <SectionLayout title={t("products.bestDeals", "Today's Best Deals for you!")}>
      <>
        {/* Category filter pills */}
        <div className="flex justify-start items-center gap-2 sm:gap-4 mb-6 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`px-5 py-1.5 text-xs sm:text-sm font-semibold rounded-full border transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === undefined
                ? "bg-primary border-primary text-white"
                : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
            }`}
            title="All"
            aria-label="All"
          >
            All
          </button>
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-1.5 text-xs sm:text-sm font-semibold rounded-full border transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-primary border-primary text-white"
                  : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
              }`}
              title={cat.name}
              aria-label={cat.name}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {products.map((prod) => (
              <ProductCard
                key={prod.id}
                product={{
                  id: prod.id,
                  name: prod.name,
                  price: prod.price,
                  images: prod.images,
                  shortDescription: prod.shortDescription || "",
                }}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">No products found in this category.</div>
        )}

        {/* View More Deals Button */}
        <div className="mt-10 flex justify-center">
          <Link
            href={selectedCategory ? `/shop?category=${selectedCategory}` : "/shop"}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-xs group"
          >
            <span>View More Deals in Shop</span>
            <BsArrowRight className="text-base group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </>
    </SectionLayout>
  );
};

export default BestDeals;
