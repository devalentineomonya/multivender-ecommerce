import React from "react";
import SectionLayout from "@/components/common/layouts/section/section-layout";
import BestStoreCard, { type BestStoreData } from "../components/best-store-card";
import { useI18nStore } from "@/lib/i18n/store";

const DIVERSE_STORES: BestStoreData[] = [
  {
    name: "Jumia Mall",
    category: "Smart TVs. Audio",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
    link: "/shop?search=TV",
  },
  {
    name: "Urban Vogue",
    category: "Bag. Perfume. Shoes",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80",
    logo: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80",
    link: "/shop?search=shoes",
  },
  {
    name: "Home Elegance",
    category: "Blender. Kettle. Cookware",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
    logo: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=200&auto=format&fit=crop&q=80",
    link: "/shop?search=kitchen",
  },
  {
    name: "Glow & Beauty",
    category: "Serum. Fragrance",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    logo: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=200&auto=format&fit=crop&q=80",
    link: "/shop?search=perfume",
  },
];

const BestStores = () => {
  const { t } = useI18nStore();
  return (
    <SectionLayout title={t("home.bestStores.title")}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 md:grid-cols-4 gap-x-3">
        {DIVERSE_STORES.map((store, index) => (
          <BestStoreCard key={index} store={store} />
        ))}
      </div>
    </SectionLayout>
  );
};

export default BestStores;
