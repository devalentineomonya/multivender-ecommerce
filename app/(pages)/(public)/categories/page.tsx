import React from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/db/drizzle";
import { categoryTable } from "@/db/models/category";
import { productTable } from "@/db/models/product";
import { desc, sql } from "drizzle-orm";
import {
  PiTShirtThin,
  PiHouse,
  PiMonitorLight,
  PiArmchair,
  PiGiftThin,
  PiGameControllerLight,
  PiBowlFoodThin,
  PiDeviceMobileCamera,
  PiCameraLight,
  PiBookOpenThin,
  PiCoffeeThin,
  PiDesktopLight,
  PiSneakerThin,
} from "react-icons/pi";
import { BsHeartPulse, BsArrowRight } from "react-icons/bs";
import { IoDiamondOutline } from "react-icons/io5";
import { getServerTranslator } from "@/lib/i18n/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator();
  return {
    title: t("meta.categories.title"),
    description: t("meta.categories.description"),
  };
}

const CATEGORY_ICONS: Record<string, any> = {
  "Electronics": PiMonitorLight,
  "Fashion & Apparel": PiTShirtThin,
  "Home & Living": PiHouse,
  "Beauty & Personal Care": BsHeartPulse,
  "Books & Stationery": PiBookOpenThin,
  "Sports & Outdoors": PiSneakerThin,
  "Furniture": PiArmchair,
  "Gift Ideas": PiGiftThin,
  "Toys & Games": PiGameControllerLight,
  "Cooking & Kitchenware": PiBowlFoodThin,
  "Smart Phones & Tablets": PiDeviceMobileCamera,
  "Cameras & Photo": PiCameraLight,
  "Accessories & Jewelry": IoDiamondOutline,
  "Computing & Stationery": PiDesktopLight,
  "Food, Drinks & Groceries": PiCoffeeThin,
};

export default async function CategoriesPage() {
  const { t } = await getServerTranslator();
  const categories = await db.select().from(categoryTable);
  const products = await db
    .select({
      id: productTable.id,
      name: productTable.name,
      price: productTable.price,
      images: productTable.images,
      categoryIds: productTable.categoryIds,
    })
    .from(productTable)
    .orderBy(desc(productTable.createdAt));

  const categoriesWithProducts = categories.map((cat) => {
    const catProducts = products.filter((p) =>
      (p.categoryIds as string[])?.includes(cat.id)
    );
    const Icon = CATEGORY_ICONS[cat.name] || PiMonitorLight;
    return {
      ...cat,
      count: catProducts.length,
      previewProducts: catProducts.slice(0, 3),
      Icon,
    };
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          {t("nav.home")}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{t("categories.breadcrumb")}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary to-emerald-900 text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-emerald-300">
            {t("categories.eyebrow")}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight">
            {t("categories.heading", { count: categories.length })}
          </h1>
          <p className="mt-3 text-emerald-100 text-sm sm:text-base leading-relaxed">
            {t("categories.subheading")}
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesWithProducts.map((category) => {
          const Icon = category.Icon;
          return (
            <div
              key={category.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                    <Icon />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {t("categories.itemsCount", { count: category.count })}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {category.name}
                </h2>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {category.description || t("categories.defaultDescription", { name: category.name })}
                </p>

                {/* Previews */}
                {category.previewProducts.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                    {category.previewProducts.map((p, idx) => {
                      const img = Array.isArray(p.images) ? p.images[0] : null;
                      return (
                        <div
                          key={idx}
                          className="relative w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0"
                        >
                          {img ? (
                            <Image
                              src={img}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">
                              🛒
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <span className="text-[11px] text-gray-400 pl-2">
                      {t("categories.moreCount", { count: Math.max(0, category.count - 3) })}
                    </span>
                  </div>
                )}
              </div>

              <Link
                href={`/shop?category=${category.id}`}
                className="mt-6 inline-flex items-center justify-between w-full text-xs font-bold text-primary group-hover:text-primary/90 pt-3 border-t border-gray-50"
              >
                <span>{t("categories.browse", { name: category.name })}</span>
                <BsArrowRight className="text-sm transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
