import SectionLayout from "@/components/common/layouts/section/section-layout";
import React from "react";
import BrandCard from "../components/brand-card";

const TopBrands = () => {
  return (
    <SectionLayout title="Choose by Brand" overflow>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BrandCard />
        <BrandCard />
        <BrandCard />
        <BrandCard />
        <BrandCard />
        <BrandCard />
        <BrandCard />
        <BrandCard />
      </div>
    </SectionLayout>
  );
};

export default TopBrands;
