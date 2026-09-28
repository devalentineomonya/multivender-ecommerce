import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { db } from "@/db/drizzle";
import { productTable } from "@/db/models/product";
import { vendorTable } from "@/db/models/vendor";
import ProductDetailMain from "@/screens/product/product-detail-main";
import { getServerTranslator } from "@/lib/i18n/server";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const { t, formatPrice } = await getServerTranslator();
  try {
    const [product] = await db
      .select({
        name: productTable.name,
        shortDescription: productTable.shortDescription,
        images: productTable.images,
        price: productTable.price,
      })
      .from(productTable)
      .where(eq(productTable.id, id))
      .limit(1);

    if (!product) {
      return {
        title: t("meta.product.notFoundTitle"),
        description: t("meta.product.notFoundDescription"),
      };
    }

    const firstImage =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : undefined;

    return {
      title: `${product.name} | ShoppingCart`,
      description:
        product.shortDescription ||
        t("meta.product.description", { name: product.name, price: formatPrice(Number(product.price)) }),
      openGraph: {
        title: `${product.name} | ShoppingCart`,
        description: product.shortDescription || undefined,
        images: firstImage ? [firstImage] : undefined,
      },
    };
  } catch {
    return {
      title: t("meta.product.notFoundTitle"),
    };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  try {
    const [product] = await db
      .select({
        id: productTable.id,
        name: productTable.name,
        price: productTable.price,
        shortDescription: productTable.shortDescription,
        longDescription: productTable.longDescription,
        label: productTable.label,
        type: productTable.type,
        stock: productTable.stock,
        discount: productTable.discount,
        sizes: productTable.sizes,
        images: productTable.images,
        colorVariants: productTable.colorVariants,
        vendorId: productTable.vendorId,
        storeName: vendorTable.storeName,
      })
      .from(productTable)
      .leftJoin(vendorTable, eq(productTable.vendorId, vendorTable.id))
      .where(eq(productTable.id, id))
      .limit(1);

    if (!product) {
      // A missing product should 404, not silently render a fictitious one that a user
      // could still add to cart and attempt to check out against a non-existent id.
      return notFound();
    }

    return <ProductDetailMain product={product} />;
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return notFound();
  }
}
