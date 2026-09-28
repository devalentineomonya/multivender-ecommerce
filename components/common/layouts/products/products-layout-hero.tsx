"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import MainLayout from "../main/main-layout";
import { useQueryState, parseAsString } from "nuqs";
import { useGetCategories } from "@/features/categories/use-get-categories";
import testImage from "@/public/images/63e8c4e4aed3c6720e446aa1_airpod max-min.png";

// Curated category banners
const CATEGORY_BANNERS: Record<string, { title: string; subtitle: string; bg: string; image?: any }> = {
  electronics: {
    title: "Next-Gen Electronics & Smart Tech",
    subtitle: "Up to 45% Off on 4K QLEDs, Audio & Computing",
    bg: "bg-tint-green",
  },
  fashion: {
    title: "Trending Fashion & Designer Apparel",
    subtitle: "Up to 50% Off on Footwear, Dresses & Streetwear",
    bg: "bg-tint-rose",
  },
  home: {
    title: "Modern Home & Kitchen Essentials",
    subtitle: "Up to 40% Off on Cookware, Blenders & Living Decor",
    bg: "bg-tint-amber",
  },
  beauty: {
    title: "Luxury Beauty, Serums & Wellness",
    subtitle: "Up to 35% Off on Verified Authentic Skincare & Fragrances",
    bg: "bg-tint-pink",
  },
  sports: {
    title: "Pro Athletics, Gym Gear & Outdoor Equipment",
    subtitle: "Up to 50% Off on Training Kits, Flasks & Accessories",
    bg: "bg-tint-teal",
  },
  books: {
    title: "Computing, Office Supplies & Tech Essentials",
    subtitle: "Up to 30% Off on Laptops, Storage & Office Stationery",
    bg: "bg-tint-indigo",
  },
};

const ProductsLayoutHero = () => {
  const [categoryParam] = useQueryState("category", parseAsString);
  const { data: categories } = useGetCategories();

  // Find category name if categoryParam is an ID
  const selectedCat = useMemo(() => {
    if (!categoryParam) return null;
    return categories?.find(
      (c) => c.id === categoryParam || c.name.toLowerCase() === categoryParam.toLowerCase()
    );
  }, [categoryParam, categories]);

  // Determine banner details based on selected category or random selection
  const banner = useMemo(() => {
    if (selectedCat) {
      const lower = selectedCat.name.toLowerCase();
      for (const [key, val] of Object.entries(CATEGORY_BANNERS)) {
        if (lower.includes(key)) return { ...val, catName: selectedCat.name };
      }
      return {
        title: `Explore ${selectedCat.name}`,
        subtitle: "Handpicked deals & verified seller warranties",
        bg: "bg-tint-green",
        catName: selectedCat.name,
      };
    }

    // Default or random selection when no category is selected
    return {
      title: "Grab up to 50% Off on Selected Marketplace Items",
      subtitle: "Discover over 300+ authentic products with verified local delivery",
      bg: "bg-tint-peach",
      catName: "Marketplace Deals",
    };
  }, [selectedCat]);

  return (
    <MainLayout>
      <div
        className={`${banner.bg} rounded-xl h-[30vh] md:h-80 flex justify-between items-center flex-col md:flex-row px-8 overflow-hidden mt-4 transition-colors duration-500`}
      >
        {/* Text Section */}
        <motion.div
          key={banner.title}
          className="flex-1 flex flex-col justify-center items-start text-left max-w-xl"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs uppercase font-bold tracking-wider text-primary mb-2 bg-white/70 px-3 py-1 rounded-full">
            {banner.catName}
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl text-gray-900 font-extrabold leading-tight">
            {banner.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-700 mt-2 font-medium">
            {banner.subtitle}
          </p>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="flex-1 flex justify-end items-end h-full max-h-72"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Image
            className="w-auto h-full object-contain max-h-64 drop-shadow-md"
            src={testImage}
            alt="product-layout-image"
            priority
          />
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ProductsLayoutHero;
