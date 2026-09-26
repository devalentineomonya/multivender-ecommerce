"use client";

import React from "react";
import SectionLayout from "@/components/common/layouts/section/section-layout";
import TrendingProductCard from "../components/trending-product-card";
import { useGetProducts } from "@/features/products/use-get-products";
import { useI18nStore } from "@/lib/i18n/store";

const TrendingProducts = () => {
  const { data, isLoading } = useGetProducts({ label: "Trending", limit: 2 });
  const { t } = useI18nStore();

  const products = data?.products || [];

  return (
    <SectionLayout title={t("products.trendingProducts", "Trending Products for you!")}>
      {isLoading ? (
        <div className="py-8 text-center text-gray-400 text-sm">Loading trending products...</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((prod) => (
            <TrendingProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TrendingProductCard />
          <TrendingProductCard />
        </div>
      )}
    </SectionLayout>
  );
};

export default TrendingProducts;
