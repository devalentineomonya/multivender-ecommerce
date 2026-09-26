import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono/hono";
import type { ProductItem } from "./use-get-products";

export const useGetProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async (): Promise<ProductItem | null> => {
      if (!id) return null;
      const response = await client.api.products[":id"].$get({
        param: { id },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await response.json();
      return (data as any).data || null;
    },
    enabled: !!id,
  });
};
