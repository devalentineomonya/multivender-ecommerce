import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { client } from "@/lib/hono/hono";

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  shortDescription: string | null;
  longDescription: string | null;
  label: "BestSelling" | "Popular" | "Featured" | "Trending" | "New" | "MostSelling";
  type: string | null;
  stock: number;
  discount: number | null;
  sizes: string[] | any;
  images: string[] | any;
  colorVariants: any;
  brandIds: string[] | any;
  categoryIds: string[] | any;
  additionalInfo: any;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ProductsQueryParams {
  category?: string;
  brand?: string;
  label?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  budgetTier?: "budget" | "mid" | "premium";
  isHot?: boolean;
  isSponsored?: boolean;
  /** Only products with discount > 0 */
  hasDiscount?: boolean;
  page?: number;
  limit?: number;
  sort?: ProductSort;
}

export type ProductSort = "newest" | "price_asc" | "price_desc" | "popular" | "discount_desc";

export interface ProductsResult {
  products: ProductItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number } | undefined;
}

type ProductsQueryOptions = Pick<UseQueryOptions<ProductsResult>, "enabled" | "placeholderData">;

export const useGetProducts = (params?: ProductsQueryParams, options?: ProductsQueryOptions) => {
  return useQuery({
    ...options,
    queryKey: ["products", params],
    queryFn: async ({ signal }): Promise<ProductsResult> => {
      const queryPayload: Record<string, string> = {};
      if (params?.category) queryPayload.category = params.category;
      if (params?.brand) queryPayload.brand = params.brand;
      if (params?.label) queryPayload.label = params.label;
      if (params?.search) queryPayload.search = params.search;
      if (params?.minPrice !== undefined) queryPayload.minPrice = String(params.minPrice);
      if (params?.maxPrice !== undefined) queryPayload.maxPrice = String(params.maxPrice);
      if (params?.budgetTier) queryPayload.budgetTier = params.budgetTier;
      if (params?.isHot !== undefined) queryPayload.isHot = String(params.isHot);
      if (params?.isSponsored !== undefined) queryPayload.isSponsored = String(params.isSponsored);
      if (params?.hasDiscount) queryPayload.hasDiscount = "true";
      if (params?.page !== undefined) queryPayload.page = String(params.page);
      if (params?.limit !== undefined) queryPayload.limit = String(params.limit);
      if (params?.sort) queryPayload.sort = params.sort;

      // Passing React Query's signal aborts superseded requests (e.g. fast typing in search)
      const response = await client.api.products.$get({ query: queryPayload }, { init: { signal } });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const json = await response.json();
      return {
        products: ((json as any).data || []) as ProductItem[],
        pagination: (json as any).pagination,
      };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });
};
