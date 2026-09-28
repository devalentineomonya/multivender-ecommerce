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
      <div
        className="relative overflow-hidden rounded-md w-full aspect-[1/1.3] bg-white flex flex-col justify-end
      items-center pb-4 cursor-pointer border border-gray-200 group-hover/category:shadow-[0_5px_20px_rgba(0,_0,_0,_0.08)] group-hover/category:border-transparent transition-all"
      >
        <Image
          src={imgSrc}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          priority
          className="w-full h-full object-cover group-hover/category:scale-105 transition-transform duration-500"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Category title badge */}
        <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-xs">
          {name}
        </div>

        <button
          type="button"
          className="relative overflow-hidden cursor-pointer rounded-[50px]
        border-[solid] border-[hsl(50deg_100%_50%)] outline-none z-10 bg-white/95 px-3 py-1 shadow-md"
        >
          <div
            className="flex items-center gap-2 text-xs font-semibold
           uppercase transition-all duration-300 ease
          rounded-[50px] group-hover/category:translate-x-[0%] group-hover/category:-translate-y-full"
          >
            <MdOutlineRemoveRedEye className="text-sm" />
            <span className="text-gray-800">{t("products.quickView")}</span>
          </div>
          <div
            className="flex items-center gap-2 text-xs font-medium uppercase transition-all
           duration-300 ease rounded-[50px] absolute
           translate-x-[0%] translate-y-full inset-0 group-hover/category:translate-x-[0%]
            group-hover/category:translate-y-[0%] justify-center"
          >
            <IoCartOutline className="text-sm text-[hsl(50deg_100%_50%)]" />
            <span className="text-[hsl(50deg_100%_50%)]">{t("nav.shopNow")}</span>
          </div>
        </button>
      </div>
    </Link>
  );
};

export default CategoryCard;
