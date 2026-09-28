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

  const fallbackProducts = [
    {
      id: "ms-1",
      name: "Smart OLED 4K Ultra HD Display",
      price: 1199,
      shortDescription: "Infinite contrast, 120Hz gaming refresh rate, and Dolby Vision.",
    },
    {
      id: "ms-2",
      name: "Sony WH-1000XM5 Wireless Headphones",
      price: 398,
      shortDescription: "Industry-leading noise canceling with dual processors and 8 microphones.",
    },
  ];

  const products = data?.products && data.products.length > 0 ? data.products : fallbackProducts;

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
                images: (p as any).images,
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
