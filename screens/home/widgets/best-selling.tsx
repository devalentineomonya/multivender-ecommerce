"use client";

import React from "react";
import SectionLayout from "@/components/common/layouts/section/section-layout";
import ScrollCarousel from "@/components/global/scroll-carousel";
import ProductCard from "@/components/shared/product-card/product-card";
import { ProductCardSkeleton } from "@/components/shared/skeletons";
import { useGetProducts } from "@/features/products/use-get-products";
import { useI18nStore } from "@/lib/i18n/store";

const BestSelling = () => {
  const { data, isLoading } = useGetProducts({ label: "BestSelling", limit: 6 });
  const { t } = useI18nStore();

  const fallbackProducts = [
    {
      id: "bs-1",
      name: "Minimalist Scandinavian Ceramic Vase",
      price: 45,
      shortDescription: "Handcrafted matte ceramic decorative vase for modern interior spaces.",
    },
    {
      id: "bs-2",
      name: "Leather Weekender Duffle Bag",
      price: 129,
      shortDescription: "Full grain genuine leather weekender duffle bag with brass hardware.",
    },
  ];

  const products = data?.products && data.products.length > 0 ? data.products : fallbackProducts;

  return (
    <SectionLayout title={t("products.bestSelling", "Best Selling Products for you!")} overflow>
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

export default BestSelling;
