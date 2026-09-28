"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import defaultImg from "@/public/images/63e8c4e563db5560c31bbfce_leptop sleeve macbook-min.png";
import { useI18nStore } from "@/lib/i18n/store";
import { getOriginalPrice } from "@/lib/utils";
import type { ProductItem } from "@/features/products/use-get-products";
import CartActionButtons from "@/components/shared/product-card/cart-action-buttons";
import ProductLike from "@/components/shared/product-card/product-like";

interface TrendingProductCardProps {
  product: ProductItem;
}

const getValidImg = (img: unknown) => {
  if (typeof img === "string") {
    const trimmed = img.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
      return trimmed;
    }
  }
  return defaultImg;
};

const TrendingProductCard: React.FC<TrendingProductCardProps> = ({ product }) => {
  const { formatPrice, formatNumber, t } = useI18nStore();

  const image = getValidImg(product.images?.[0]);
  const productLink = `/product/${product.id}`;
  const discount = product.discount && product.discount > 0 ? product.discount : 0;
  const discountText = formatNumber(discount / 100, { style: "percent" });

  return (
    <article className="card-surface card-interactive grid w-full grid-cols-12 overflow-hidden p-2">
      <div className="relative col-span-12 h-64 overflow-hidden rounded-md bg-gray-50 sm:col-span-5 sm:h-auto">
        <Link href={productLink} className="relative block size-full" tabIndex={-1} aria-hidden="true">
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 40vw"
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

      <motion.div
        className="col-span-12 flex flex-col justify-center gap-2 p-4 sm:col-span-7"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <h3 className="line-clamp-1 text-lg font-semibold text-gray-900 sm:text-xl">
          <Link href={productLink} className="transition-colors hover:text-primary">
            {product.name}
          </Link>
        </h3>

        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-2xl font-semibold text-primary tabular-nums">{formatPrice(product.price)}</span>
          {discount > 0 && (
            <s className="text-sm text-gray-400 tabular-nums">
              <span className="sr-only">{t("products.originalPrice")}: </span>
              {formatPrice(getOriginalPrice(product.price, discount))}
            </s>
          )}
        </div>

        {product.shortDescription && (
          <p className="line-clamp-2 text-xs text-gray-500 sm:text-sm">{product.shortDescription}</p>
        )}

        <div className="pt-2">
          <CartActionButtons
            productId={String(product.id)}
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: typeof image === "string" ? image : undefined,
            }}
            currentStock={product.stock}
          />
        </div>
      </motion.div>
    </article>
  );
};

export default TrendingProductCard;
