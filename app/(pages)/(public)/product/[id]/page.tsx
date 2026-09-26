import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { db } from "@/db/drizzle";
import { productTable } from "@/db/models/product";
import { vendorTable } from "@/db/models/vendor";
import ProductDetailMain from "@/screens/product/product-detail-main";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
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
        title: "Product Details | ShoppingCart",
        description: "Explore genuine items on ShoppingCart.",
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
        `Buy ${product.name} for KES ${Number(product.price).toLocaleString()} on ShoppingCart.`,
      openGraph: {
        title: `${product.name} | ShoppingCart`,
        description: product.shortDescription || undefined,
        images: firstImage ? [firstImage] : undefined,
      },
    };
  } catch {
    return {
      title: "Product Details | ShoppingCart",
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
      return (
        <ProductDetailMain
          product={{
            id,
            name: "Premium Marketplace Product",
            price: 4999,
            shortDescription: "High-grade craftsmanship designed for modern everyday convenience.",
            stock: 25,
            discount: 10,
            sizes: ["S", "M", "L", "XL"],
            colorVariants: ["Black", "White", "Navy Blue"],
            images: [],
            label: "Popular",
            storeName: "Verified Merchant",
          }}
        />
      );
    }

    return <ProductDetailMain product={product} />;
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return notFound();
  }
}
