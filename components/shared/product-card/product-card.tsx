"use client";

import { motion } from "framer-motion";
import ProductLike from "./product-like";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import CartActionButtons from "./cart-action-buttons";
import dummyProduct from "@/public/images/63ec6053e5b15cfafd550cbb_Rectangle 1436-3.png";
import { useI18nStore } from "@/lib/i18n/store";
import { getOriginalPrice } from "@/lib/utils";

interface ProductCardProps {
  thumbnail?: boolean;
  product: {
    id: string | number;
    name: string;
    price: number;
    image?: string;
    images?: string[];
    shortDescription?: string;
    /** Percent (0–100) already applied to `price` */
    discount?: number | null;
    stock?: number;
  };
}

const getValidImageSrc = (img: unknown): string | StaticImageData => {
  if (typeof img === "string") {
    const trimmed = img.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
      return trimmed;
    }
  }
  return dummyProduct;
};

const ProductCard = ({ thumbnail, product }: ProductCardProps) => {
  const { formatPrice, formatNumber, t } = useI18nStore();

  const imgSrc = getValidImageSrc(product.image || product.images?.[0]);
  const href = `/product/${product.id}`;
  const discount = product.discount && product.discount > 0 ? product.discount : 0;
  const discountText = formatNumber(discount / 100, { style: "percent" });

  return (
    // Reveal lives on the wrapper: framer leaves an inline transform behind, which
    // would otherwise override the card's CSS hover lift.
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <article className="card-surface card-interactive flex h-full flex-col overflow-hidden">
        <div className="relative aspect-square bg-gray-50">
          <Link href={href} className="block size-full" tabIndex={-1} aria-hidden="true">
            <Image
              src={imgSrc}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-contain p-4"
            />
          </Link>
          {discount > 0 && (
            <span
              className="absolute left-2 top-2 rounded-full bg-deal px-2.5 py-1 text-xs font-semibold text-white tabular-nums"
              aria-label={t("products.discountLabel", { percent: discountText })}
            >
              -{discountText}
            </span>
          )}
          <ProductLike productId={String(product.id)} productName={product.name} />
        </div>

        {!thumbnail && (
          <div className="flex flex-1 flex-col gap-1.5 p-3 md:p-4">
            <Link
              href={href}
              className="line-clamp-2 text-sm font-medium text-gray-800 transition-colors hover:text-primary"
            >
              {product.name}
            </Link>
            {product.shortDescription && (
              <p className="truncate text-xs text-gray-500">{product.shortDescription}</p>
            )}
            <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-1">
              <span className="text-base font-semibold text-primary tabular-nums">
                {formatPrice(product.price)}
              </span>
              {discount > 0 && (
                <s className="text-xs text-gray-400 tabular-nums">
                  <span className="sr-only">{t("products.originalPrice")}: </span>
                  {formatPrice(getOriginalPrice(product.price, discount))}
                </s>
              )}
            </div>
            <div className="pt-2">
              <CartActionButtons
                productId={String(product.id)}
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: typeof imgSrc === "string" ? imgSrc : undefined,
                }}
                currentStock={product.stock}
              />
            </div>
          </div>
        )}
      </article>
    </motion.div>
  );
};

export default ProductCard;
