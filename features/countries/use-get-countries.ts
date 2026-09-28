import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono/hono";
import type { CountryInfo } from "@/app/api/[[...route]]/(modules)/countries/countries";

export type CountryItem = CountryInfo;

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
      return data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes cache (static metadata)
  });
};
