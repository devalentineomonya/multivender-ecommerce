import type { Metadata } from "next";
import ProductsLayout from "@/components/common/layouts/products/products-layout";
import { getServerTranslator } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator();
  return {
    title: t("meta.deals.title"),
    description: t("meta.deals.description"),
  };
}

const Deals = () => <ProductsLayout variant="deals" />;

export default Deals;
