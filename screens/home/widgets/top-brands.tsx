import SectionLayout from "@/components/common/layouts/section/section-layout";
import React from "react";
import BrandCard, { type BrandCardData } from "../components/brand-card";
import { useI18nStore } from "@/lib/i18n/store";

const DIVERSE_BRANDS: BrandCardData[] = [
  {
    id: "859c2a44-cc17-4bf7-8116-be6792715fdf",
    name: "Samsung",
    delivery: "Delivery within 24 hours",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&auto=format&fit=crop&q=80",
    link: "/shop?search=Samsung",
  },
  {
    id: "665c1f5d-f0dc-4f0d-9a5a-2db02b029771",
    name: "Apple",
    delivery: "Official Warranty",
    image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&auto=format&fit=crop&q=80",
    link: "/shop?search=Apple",
  },
  {
    id: "21cfd266-0f8c-40c6-ba93-cc83acef62c5",
    name: "Nike",
    delivery: "Verified Authentic",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80",
    link: "/shop?search=Nike",
  },
  {
    id: "e75238ec-1309-465f-856a-8f0fa71c7836",
    name: "Adidas",
    delivery: "Original Performance",
    image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=400&auto=format&fit=crop&q=80",
    link: "/shop?search=Adidas",
  },
  {
    id: "6aab03cc-56c5-4896-98eb-4b3b95118792",
    name: "HP",
    delivery: "Delivery within 24 hours",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80",
    link: "/shop?search=HP",
  },
  {
    id: "fa5c24cb-5904-41fa-9e99-b8e9298b4beb",
    name: "Sony",
    delivery: "Japanese Engineering",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
    link: "/shop?search=Sony",
  },
  {
    id: "75de0ac8-361e-4e41-95e1-a0e40efa59e9",
    name: "Oraimo",
    delivery: "Delivery within 24 hours",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80",
    link: "/shop?search=Oraimo",
  },
  {
    id: "332abe27-9984-42a4-8b19-c400bae1c48b",
    name: "Hisense",
    delivery: "Delivery within 24 hours",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&auto=format&fit=crop&q=80",
    link: "/shop?search=Hisense",
  },
];

const TopBrands = () => {
  const { t } = useI18nStore();
  return (
    <SectionLayout title={t("home.topBrands.title")} overflow>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DIVERSE_BRANDS.map((brand, index) => (
          <BrandCard key={index} brand={brand} />
        ))}
      </div>
    </SectionLayout>
  );
};

export default TopBrands;
