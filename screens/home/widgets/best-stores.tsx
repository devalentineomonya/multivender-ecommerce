import React from "react";
import SectionLayout from "@/components/common/layouts/section/section-layout";
import BestStoreCard from "../components/best-store-card";

const BestStores = () => {
  return (
    <SectionLayout title="Best Selling Stores">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 md:grid-cols-4 gap-x-3">
        <BestStoreCard />
        <BestStoreCard />
        <BestStoreCard />
        <BestStoreCard />
      </div>
    </SectionLayout>
  );
};

export default BestStores;
