import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono/hono";

export interface CountryItem {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  phoneCode: string;
  defaultLocale: string;
  exchangeRateToUSD: number;
}

export const useGetCountries = (search?: string) => {
  return useQuery({
    queryKey: ["countries", search],
    queryFn: async (): Promise<CountryItem[]> => {
      const response = await client.api.countries.$get({
        query: search ? { search } : {},
      });
      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }
      const data = await response.json();
      return (data as any).data || [];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes cache (static metadata)
  });
};
