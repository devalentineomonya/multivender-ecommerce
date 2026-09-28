"use client";

import React from "react";
import SectionLayout from "@/components/common/layouts/section/section-layout";
import ScrollCarousel from "@/components/global/scroll-carousel";
import ProductCard from "@/components/shared/product-card/product-card";
import { ProductCardSkeleton } from "@/components/shared/skeletons";
import { useGetProducts } from "@/features/products/use-get-products";
import { useI18nStore } from "@/lib/i18n/store";

const MostSelling = () => {
  const { data, isLoading } = useGetProducts({ label: "MostSelling", limit: 6 });
  const { t } = useI18nStore();

  const products = data?.products ?? [];

  // Hide the section when there is nothing real to show (never render placeholder products).
  if (!isLoading && products.length === 0) return null;

  return (
    <SectionLayout title={t("products.bestSelling")} overflow>
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
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                id: p.id,
                name: p.name,
                price: p.price,
                discount: p.discount,
                stock: p.stock,
                images: p.images,
                shortDescription: p.shortDescription || "",
              }}
            />
          ))}
        </ScrollCarousel>
      )}
    </SectionLayout>
  );
};

export default MostSelling;
