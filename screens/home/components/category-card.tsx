"use client";

import React from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import defaultProductImg from "@/public/images/63e8c4e4aed3c6720e446aa1_airpod max-min.png";
import { useI18nStore } from "@/lib/i18n/store";

interface CategoryCardProps {
  category?: {
    id: string;
    name: string;
    imageUrl?: string | null;
    productCount?: number;
  };
}

const getValidCategoryImg = (img: any) => {
  if (!img) return defaultProductImg;
  if (typeof img === "object") return img;
  if (typeof img === "string") {
    const trimmed = img.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
      return trimmed;
    }
  }
  return defaultProductImg;
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { t } = useI18nStore();
  const name = category?.name || "Category";
  const href = category?.id ? `/shop?category=${encodeURIComponent(category.id)}` : "/shop";
  const imgSrc = getValidCategoryImg(category?.imageUrl);

  return (
    <Link href={href} className="block group/category my-2">
      <div className="card-surface card-interactive relative flex aspect-[1/1.3] w-full flex-col items-center justify-end overflow-hidden pb-4">
        <Image
          src={imgSrc}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          className="h-full w-full object-cover"
        />

        {/* Category title badge */}
        <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-xs">
          {name}
        </div>

        {/* Decorative label swap; the whole card is the link */}
        <span
          aria-hidden="true"
          className="relative z-10 overflow-hidden rounded-full bg-white/95 px-3 py-1 shadow-card"
        >
          <span className="flex items-center gap-2 text-xs font-semibold uppercase transition-transform duration-300 ease-smooth group-hover/category:-translate-y-full">
            <MdOutlineRemoveRedEye className="text-sm" />
            <span className="text-gray-800">{t("products.quickView")}</span>
          </span>
          <span className="absolute inset-0 flex translate-y-full items-center justify-center gap-2 text-xs font-semibold uppercase text-primary transition-transform duration-300 ease-smooth group-hover/category:translate-y-0">
            <IoCartOutline className="text-sm" />
            <span>{t("nav.shopNow")}</span>
          </span>
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
