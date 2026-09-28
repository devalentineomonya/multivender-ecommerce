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

  const fallbackProducts = [
    { id: "p1", name: "Premium Wireless Headphones", price: 149, shortDescription: "Active noise cancelling with 40h battery life" },
    { id: "p2", name: "Smart Fitness Watch", price: 99, shortDescription: "Heart rate monitor with GPS tracking" },
    { id: "p3", name: "Ergonomic Laptop Stand", price: 39, shortDescription: "Aluminum adjustable height stand" },
  ];

  const products = data?.products && data.products.length > 0 ? data.products : fallbackProducts;

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
                images: (item as any).images,
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
