"use client";

import React from "react";
import Link from "next/link";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import Services from "@/screens/home/widgets/services";
import PopularProducts from "@/screens/home/widgets/popular-products";
import ProductCard from "@/components/shared/product-card/product-card";
import ScrollCarousel from "@/components/global/scroll-carousel";
import SectionLayout from "../section/section-layout";
import MainLayout from "../main/main-layout";
import ProductsLayoutFilter from "./products-layout-filter";
import {
  useGetProducts,
  type ProductItem,
  type ProductSort,
  type ProductsQueryParams,
} from "@/features/products/use-get-products";
import {
  PRODUCT_GRID_CLASS,
  ProductGridSkeleton,
  type ProductsVariant,
} from "@/components/shared/skeletons";
import { useI18nStore } from "@/lib/i18n/store";

const DEALS_SORTS = ["discount_desc", "price_asc", "price_desc", "newest"] as const satisfies readonly ProductSort[];
const ALL_SORTS: readonly ProductSort[] = ["newest", "price_asc", "price_desc", "popular", "discount_desc"];
const BUDGET_TIERS = ["budget", "mid", "premium"] as const;

const isSort = (v: string | null): v is ProductSort => !!v && (ALL_SORTS as readonly string[]).includes(v);
const isBudgetTier = (v: string | null): v is (typeof BUDGET_TIERS)[number] =>
  !!v && (BUDGET_TIERS as readonly string[]).includes(v);

const PAGE_SIZE: Record<ProductsVariant, number> = { shop: 16, deals: 12 };

const toCardProduct = (prod: ProductItem) => ({
  id: prod.id,
  name: prod.name,
  price: prod.price,
  images: Array.isArray(prod.images) ? (prod.images as string[]) : undefined,
  shortDescription: prod.shortDescription || "",
  discount: prod.discount,
  stock: prod.stock,
});

const ProductsLayoutMain = ({ variant }: { variant: ProductsVariant }) => {
  const isDeals = variant === "deals";
  const { t, tp } = useI18nStore();

  const [category, setCategory] = useQueryState("category", parseAsString);
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [sort, setSort] = useQueryState("sort", parseAsString);
  const [minPrice, setMinPrice] = useQueryState("minPrice", parseAsInteger);
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice", parseAsInteger);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [label, setLabel] = useQueryState("label", parseAsString);
  const [budgetTier, setBudgetTier] = useQueryState("budgetTier", parseAsString);

  const activeSort: ProductSort | undefined = isSort(sort) ? sort : isDeals ? "discount_desc" : undefined;

  // Deals is a fixed, discount-only view; catalog filters only apply to Shop.
  const params: ProductsQueryParams = isDeals
    ? { hasDiscount: true, sort: activeSort, page: page || 1, limit: PAGE_SIZE.deals }
    : {
        category: category || undefined,
        search: search || undefined,
        label: label || undefined,
        budgetTier: isBudgetTier(budgetTier) ? budgetTier : undefined,
        sort: activeSort,
        minPrice: minPrice ?? undefined,
        maxPrice: maxPrice ?? undefined,
        page: page || 1,
        limit: PAGE_SIZE.shop,
      };

  const { data, isLoading } = useGetProducts(params);
  const { data: hotData } = useGetProducts({ isHot: true, limit: 8 }, { enabled: isDeals });

  const products = data?.products || [];
  const hotProducts = hotData?.products || [];
  const pagination = data?.pagination;

  const handleResetFilters = () => {
    setCategory(null);
    setSearch(null);
    setMinPrice(null);
    setMaxPrice(null);
    setLabel(null);
    setBudgetTier(null);
    setPage(1);
  };

  return (
    <>
      {isDeals ? (
        <MainLayout className="mt-3">
          <div className="flex h-[62px] items-center justify-between gap-4 border-y border-gray-200">
            <p className="text-sm text-gray-600" aria-live="polite">
              {pagination ? tp("products.count", pagination.total) : ""}
            </p>
            <label className="flex items-center gap-2 text-xs">
              <span className="font-medium text-gray-500">{t("sort.label")}</span>
              <select
                value={activeSort}
                onChange={(e) => {
                  setSort(e.target.value === "discount_desc" ? null : e.target.value);
                  setPage(1);
                }}
                className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 font-medium text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {DEALS_SORTS.map((value) => (
                  <option key={value} value={value}>
                    {t(`sort.${value}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </MainLayout>
      ) : (
        <ProductsLayoutFilter />
      )}

      {isDeals && hotProducts.length > 0 && (
        <SectionLayout title={t("deals.hot.title")} overflow>
          <ScrollCarousel>
            {hotProducts.map((prod) => (
              <ProductCard key={prod.id} product={toCardProduct(prod)} />
            ))}
          </ScrollCarousel>
        </SectionLayout>
      )}

      <SectionLayout title={t(isDeals ? "deals.title" : "shop.title")} overflow>
        {isLoading ? (
          <ProductGridSkeleton variant={variant} />
        ) : products.length > 0 ? (
          <>
            <div className={PRODUCT_GRID_CLASS[variant]}>
              {products.map((prod) => (
                <ProductCard key={prod.id} product={toCardProduct(prod)} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <nav
                aria-label={t("pagination.label")}
                className="mt-10 flex items-center justify-center gap-3 border-t border-gray-100 pt-6"
              >
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("pagination.previous")}
                </button>
                <span className="text-xs font-medium text-gray-600 tabular-nums">
                  {t("pagination.status", { page, totalPages: pagination.totalPages })}
                  <span className="text-gray-400"> · {tp("products.count", pagination.total)}</span>
                </span>
                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("pagination.next")}
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="card-surface px-6 py-16 text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              {t(isDeals ? "deals.empty.title" : "shop.empty.title")}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t(isDeals ? "deals.empty.body" : "shop.empty.body")}
            </p>
            {isDeals ? (
              <Link
                href="/shop"
                className="mt-5 inline-block rounded-lg bg-primary px-6 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary/90"
              >
                {t("deals.empty.cta")}
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 rounded-lg bg-primary px-6 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary/90"
              >
                {t("shop.empty.reset")}
              </button>
            )}
          </div>
        )}
      </SectionLayout>

      {!isDeals && <PopularProducts />}
      <Services />
    </>
  );
};

export default ProductsLayoutMain;
