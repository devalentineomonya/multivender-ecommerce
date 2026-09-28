"use client";

import React from "react";
import SectionLayout from "@/components/common/layouts/section/section-layout";
import ScrollCarousel from "@/components/global/scroll-carousel";
import ProductCard from "@/components/shared/product-card/product-card";
import { ProductCardSkeleton } from "@/components/shared/skeletons";
import { useGetProducts } from "@/features/products/use-get-products";
import { useI18nStore } from "@/lib/i18n/store";

const PopularProducts = () => {
  const { data, isLoading } = useGetProducts({ label: "Popular", limit: 8 });
  const { t } = useI18nStore();

  const products = data?.products ?? [];

  // Hide the section when there is nothing real to show (never render placeholder products).
  if (!isLoading && products.length === 0) return null;

  return (
    <SectionLayout title={t("products.popularProducts")} overflow>
      {isLoading ? (
        <div className="flex gap-4 overflow-hidden py-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-[240px] sm:min-w-[280px]">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <ScrollCarousel>
          {products.map((item) => (
            <ProductCard
              key={item.id}
              product={{
                id: item.id,
                name: item.name,
                price: item.price,
                discount: item.discount,
                stock: item.stock,
                images: item.images,
                shortDescription: item.shortDescription || "",
              }}
            />
          ))}
        </ScrollCarousel>
      )}
    </SectionLayout>
  );
};

export default PopularProducts;
