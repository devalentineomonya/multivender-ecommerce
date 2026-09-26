import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono/hono";

export interface CategoryItem {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  productCount?: number;
}

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<CategoryItem[]> => {
      const response = await client.api.categories.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      return (data as any).data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
