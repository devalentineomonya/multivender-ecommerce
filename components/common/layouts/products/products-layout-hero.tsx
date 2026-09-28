"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import MainLayout from "../main/main-layout";
import { useQueryState, parseAsString } from "nuqs";
import { useGetCategories } from "@/features/categories/use-get-categories";
import { useGetProducts } from "@/features/products/use-get-products";
import { useI18nStore } from "@/lib/i18n/store";
import { cn } from "@/lib/utils";
import type { ProductsVariant } from "@/components/shared/skeletons";
import shopHeroImage from "@/public/images/banner-1.jpg";
import dealsHeroImage from "@/public/images/banner-3.jpg";

/**
 * Shop: bright, neutral catalog hero (21:9), copy in the empty right half.
 * Deals: dark, high-contrast promo hero (3:1), copy on the left with the deal accent.
 * Below md both stack image over text so copy never sits on the subject.
 */
const ProductsLayoutHero = ({ variant }: { variant: ProductsVariant }) => {
  const isDeals = variant === "deals";
  const { t, formatNumber } = useI18nStore();
  const [categoryParam] = useQueryState("category", parseAsString);
  const { data: categories } = useGetCategories();

  // Highest current discount, for the "Save up to N%" line (same sort as the Deals grid).
  const { data: topDeal } = useGetProducts(
    { hasDiscount: true, sort: "discount_desc", limit: 1 },
    { enabled: isDeals }
  );
  const maxDiscount = topDeal?.products[0]?.discount ?? 0;

  const selectedCategory = useMemo(() => {
    if (isDeals || !categoryParam) return null;
    return categories?.find(
      (c) => c.id === categoryParam || c.name.toLowerCase() === categoryParam.toLowerCase()
    );
  }, [isDeals, categoryParam, categories]);

  const copy = isDeals
    ? {
        eyebrow: t("deals.hero.eyebrow"),
        title: t("deals.hero.title"),
        subtitle:
          maxDiscount > 0
            ? t("deals.hero.subtitleMax", { percent: formatNumber(maxDiscount / 100, { style: "percent" }) })
            : t("deals.hero.subtitle"),
      }
    : selectedCategory
      ? {
          eyebrow: t("shop.hero.eyebrowCategory"),
          title: selectedCategory.name,
          subtitle: t("shop.hero.subtitleCategory", { category: selectedCategory.name }),
        }
      : {
          eyebrow: t("shop.hero.eyebrow"),
          title: t("shop.hero.title"),
          subtitle: t("shop.hero.subtitle"),
        };

  return (
    <MainLayout>
      <section
        aria-labelledby="products-hero-title"
        className={cn(
          "relative mt-4 overflow-hidden rounded-panel",
          isDeals
            ? "bg-neutral-900 text-white md:aspect-[3/1] lg:max-h-[360px]"
            : "bg-gray-50 text-gray-900 md:aspect-[21/9] lg:max-h-[440px]"
        )}
      >
        <div
          className={cn(
            "relative w-full md:absolute md:inset-0",
            isDeals ? "aspect-[2/1] md:aspect-auto" : "aspect-video md:aspect-auto"
          )}
        >
          <Image
            src={isDeals ? dealsHeroImage : shopHeroImage}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="(max-width: 1280px) 100vw, 1256px"
            className={cn("object-cover", isDeals ? "object-[70%_center]" : "object-[20%_center]")}
          />
          {isDeals && (
            // Legibility scrim for white copy over the photo (desktop only; mobile copy sits below)
            <div className="absolute inset-0 hidden bg-gradient-to-r from-black/75 via-black/40 to-transparent md:block" />
          )}
        </div>

        <motion.div
          key={copy.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "relative flex flex-col items-start gap-3 p-6 md:absolute md:inset-y-0 md:w-1/2 md:justify-center md:p-10 lg:p-14",
            isDeals ? "md:left-0" : "md:right-0"
          )}
        >
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              isDeals ? "bg-deal text-white" : "bg-white/80 text-primary"
            )}
          >
            {copy.eyebrow}
          </span>
          <h1
            id="products-hero-title"
            className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
          >
            {copy.title}
          </h1>
          <p className={cn("max-w-md text-sm sm:text-base", isDeals ? "text-white/80" : "text-gray-600")}>
            {copy.subtitle}
          </p>
        </motion.div>
      </section>
    </MainLayout>
  );
};

export default ProductsLayoutHero;
