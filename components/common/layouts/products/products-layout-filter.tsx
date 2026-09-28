"use client";
import React, { useState } from "react";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { BiFilter } from "react-icons/bi";
import { BsCheck2, BsX } from "react-icons/bs";
import { motion } from "framer-motion";
import MainLayout from "../main/main-layout";
import { useGetCategories } from "@/features/categories/use-get-categories";
import { useI18nStore } from "@/lib/i18n/store";
import type { TranslationKey } from "@/lib/i18n/translations";

const PRICE_RANGE_BOUNDS: { min: number | null; max: number | null }[] = [
  { min: null, max: null },
  { min: 0, max: 1000 },
  { min: 1000, max: 5000 },
  { min: 5000, max: 20000 },
  { min: 20000, max: null },
];

const SORT_OPTIONS: { value: string; labelKey: TranslationKey }[] = [
  { value: "newest", labelKey: "sort.newest" },
  { value: "price_asc", labelKey: "sort.price_asc" },
  { value: "price_desc", labelKey: "sort.price_desc" },
  { value: "popular", labelKey: "sort.popular" },
];

const LABEL_OPTIONS: { val: string; labelKey: TranslationKey }[] = [
  { val: "", labelKey: "filter.labels.all" },
  { val: "Hot", labelKey: "filter.labels.hot" },
  { val: "New", labelKey: "filter.labels.new" },
  { val: "Featured", labelKey: "filter.labels.featured" },
  { val: "Trending", labelKey: "filter.labels.trending" },
  { val: "BestSelling", labelKey: "filter.labels.bestSelling" },
  { val: "Sponsored", labelKey: "filter.labels.sponsored" },
];

export default function ScalableFilters() {
  const { t, formatPrice } = useI18nStore();
  const [isOpen, setIsOpen] = useState(false);

  // nuqs URL query state management
  const [category, setCategory] = useQueryState("category", parseAsString.withDefault(""));
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("newest"));
  const [minPrice, setMinPrice] = useQueryState("minPrice", parseAsInteger);
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice", parseAsInteger);
  const [label, setLabel] = useQueryState("label", parseAsString.withDefault(""));
  const [budgetTier, setBudgetTier] = useQueryState("budgetTier", parseAsString.withDefault(""));

  const { data: categories } = useGetCategories();

  const priceRangeLabel = (min: number | null, max: number | null) => {
    if (min === null && max === null) return t("filter.priceRanges.all");
    if (min === 0 && max !== null) return t("filter.priceRanges.under", { amount: formatPrice(max) });
    if (min !== null && max !== null)
      return t("filter.priceRanges.between", { min: formatPrice(min), max: formatPrice(max) });
    if (min !== null && max === null) return t("filter.priceRanges.above", { amount: formatPrice(min) });
    return "";
  };

  // Active filter count
  let activeFilterCount = 0;
  if (category) activeFilterCount++;
  if (search) activeFilterCount++;
  if (label) activeFilterCount++;
  if (budgetTier) activeFilterCount++;
  if (sort && sort !== "newest") activeFilterCount++;
  if (minPrice !== null || maxPrice !== null) activeFilterCount++;

  const handleClearAll = () => {
    setCategory(null);
    setSearch(null);
    setLabel(null);
    setBudgetTier(null);
    setSort(null);
    setMinPrice(null);
    setMaxPrice(null);
  };

  const selectedCategoryName = categories?.find((c) => c.id === category)?.name || "";

  return (
    <MainLayout className="bg-white mt-3">
      <section aria-labelledby="filter-heading" className="relative z-10 border-t border-b border-gray-200">
        <h2 id="filter-heading" className="sr-only">
          {t("filter.filtersLabel")}
        </h2>
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="w-full flex flex-wrap items-center justify-between gap-4 text-sm">
            {/* Filter Toggle and Clear All */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                className={`group px-3 py-1.5 rounded-lg border font-medium flex items-center gap-2 transition-colors ${
                  isOpen || activeFilterCount > 0
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                }`}
              >
                <BiFilter className="w-5 h-5" />
                <span>
                  {activeFilterCount > 0
                    ? t("filter.filtersCount", { count: activeFilterCount })
                    : t("filter.filtersLabel")}
                </span>
              </button>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1 font-medium"
                >
                  <BsX className="text-base" />
                  {t("filter.clearAll")}
                </button>
              )}
            </div>

            {/* Quick Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-medium">{t("filter.sortBy")}</span>
              <select
                value={sort || "newest"}
                onChange={(e) => setSort(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {t(opt.labelKey)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Badges */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-3">
              {category && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200">
                  {t("filter.categoryBadge", { name: selectedCategoryName || category })}
                  <button type="button" onClick={() => setCategory(null)} className="hover:text-emerald-700">
                    <BsX className="text-sm" />
                  </button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200">
                  {t("filter.searchBadge", { query: search })}
                  <button type="button" onClick={() => setSearch(null)} className="hover:text-emerald-700">
                    <BsX className="text-sm" />
                  </button>
                </span>
              )}
              {(minPrice !== null || maxPrice !== null) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200">
                  {t("filter.priceBadge", {
                    min: formatPrice(minPrice || 0),
                    max: maxPrice ? formatPrice(maxPrice) : t("filter.above"),
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice(null);
                      setMaxPrice(null);
                    }}
                    className="hover:text-emerald-700"
                  >
                    <BsX className="text-sm" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Animated Disclosure Panel */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden border-t border-gray-100 bg-gray-50/60"
        >
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                  {t("filter.department")}
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
                  <button
                    type="button"
                    onClick={() => setCategory(null)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                      !category ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{t("filter.allDepartments")}</span>
                    {!category && <BsCheck2 />}
                  </button>
                  {categories?.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id === category ? null : cat.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                        cat.id === category ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {cat.id === category && <BsCheck2 />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                  {t("filter.priceRangeHeading")}
                </h4>
                <div className="space-y-1.5">
                  {PRICE_RANGE_BOUNDS.map((pr, idx) => {
                    const isSelected = minPrice === pr.min && maxPrice === pr.max;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setMinPrice(null);
                            setMaxPrice(null);
                          } else {
                            setMinPrice(pr.min);
                            setMaxPrice(pr.max);
                          }
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                          isSelected ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span>{priceRangeLabel(pr.min, pr.max)}</span>
                        {isSelected && <BsCheck2 />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product Label Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                  {t("filter.productLabel")}
                </h4>
                <div className="space-y-1.5">
                  {LABEL_OPTIONS.map((l) => {
                    const isSelected = (!label && !l.val) || label === l.val;
                    return (
                      <button
                        key={l.val}
                        type="button"
                        onClick={() => setLabel(l.val || null)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                          isSelected ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span>{t(l.labelKey)}</span>
                        {isSelected && <BsCheck2 />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Keyword Search Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                  {t("filter.keywordFilter")}
                </h4>
                <div className="relative">
                  <input
                    type="text"
                    value={search || ""}
                    onChange={(e) => setSearch(e.target.value || null)}
                    placeholder={t("filter.keywordPlaceholder")}
                    className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch(null)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <BsX className="text-base" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-2">{t("filter.keywordHint")}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </MainLayout>
  );
}
