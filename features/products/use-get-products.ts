import { useQuery } from "@tanstack/react-query";
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
  label?: "BestSelling" | "Popular" | "Featured" | "Trending" | "New" | "MostSelling";
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
}

export const useGetProducts = (params?: ProductsQueryParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const queryPayload: Record<string, string> = {};
      if (params?.category) queryPayload.category = params.category;
      if (params?.brand) queryPayload.brand = params.brand;
      if (params?.label) queryPayload.label = params.label;
      if (params?.search) queryPayload.search = params.search;
      if (params?.minPrice !== undefined) queryPayload.minPrice = String(params.minPrice);
      if (params?.maxPrice !== undefined) queryPayload.maxPrice = String(params.maxPrice);
      if (params?.page !== undefined) queryPayload.page = String(params.page);
      if (params?.limit !== undefined) queryPayload.limit = String(params.limit);
      if (params?.sort) queryPayload.sort = params.sort;

      const response = await client.api.products.$get({
        query: queryPayload,
      });

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
