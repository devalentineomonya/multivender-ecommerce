"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaStar, FaRegStar } from "react-icons/fa";
import { GoHeart, GoHeartFill } from "react-icons/go";
import defaultImg from "@/public/images/63e8c4e563db5560c31bbfce_leptop sleeve macbook-min.png";
import { useI18nStore } from "@/lib/i18n/store";
import { useCartStore } from "@/lib/zustand/cart-store";
import { toast } from "react-toastify";
import type { ProductItem } from "@/features/products/use-get-products";

interface TrendingProductCardProps {
  product?: ProductItem;
}

const TrendingProductCard: React.FC<TrendingProductCardProps> = ({ product }) => {
  const [liked, setLiked] = useState(false);
  const { formatPrice, t } = useI18nStore();
  const addItem = useCartStore((state) => state.addItem);

  const title = product?.name || "Laptop sleeve macbook";
  const price = product ? product.price : 20;
  const description =
    product?.shortDescription ||
    "High quality durable accessory crafted with premium materials for everyday convenience.";
  const rawFirstImg =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images[0]
      : null;

  const getValidImg = (img: any) => {
    if (!img) return defaultImg;
    if (typeof img === "object") return img;
    if (typeof img === "string") {
      const trimmed = img.trim();
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
        return trimmed;
      }
    }
    return defaultImg;
  };

  const firstImage = getValidImg(rawFirstImg);

  const handleAddToCart = () => {
    addItem({
      productId: product?.id ? String(product.id) : "trending-default",
      name: title,
      price: price,
      image: typeof firstImage === "string" ? firstImage : undefined,
      quantity: 1,
    });
    toast.success(`Added ${title} to cart!`);
  };

  const textAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const productLink = product ? `/product/${product.id}` : "/shop";

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden p-2 grid grid-cols-12 bg-white shadow-xs hover:shadow-md transition-shadow">
      <div className="col-span-12 sm:col-span-5 h-64 sm:h-auto bg-gray-50 relative rounded-md overflow-hidden">
        <Link href={productLink} className="block w-full h-full relative">
          <Image
            src={firstImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 40vw"
            className="object-contain p-4 hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {product?.discount ? (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{product.discount}% {t("products.discount", "OFF")}
          </span>
        ) : null}
      </div>

      <div className="col-span-12 sm:col-span-7 flex flex-col justify-center p-4">
        <Link href={productLink}>
          <motion.h2
            variants={textAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-lg sm:text-xl font-bold text-gray-900 hover:text-primary transition-colors line-clamp-1"
          >
            {title}
          </motion.h2>
        </Link>

        <motion.div
          variants={textAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-x-1 my-1 text-amber-400"
        >
          <FaStar className="size-3.5" />
          <FaStar className="size-3.5" />
          <FaStar className="size-3.5" />
          <FaStar className="size-3.5" />
          <FaRegStar className="size-3.5 text-gray-300" />
          <span className="text-xs text-gray-500 ml-1">
            4.8 (12 {t("products.reviews", "Reviews")})
          </span>
        </motion.div>

        <motion.h3
          variants={textAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-primary font-bold text-2xl my-2"
        >
          {formatPrice(price)}
        </motion.h3>

        <motion.p
          variants={textAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-xs sm:text-sm text-gray-500 line-clamp-2"
        >
          {description}
        </motion.p>

        <div className="flex items-center gap-x-3 mt-4">
          <motion.button
            type="button"
            onClick={handleAddToCart}
            variants={textAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="border-2 border-primary bg-primary text-white hover:bg-transparent hover:text-primary transition-colors py-2 px-5 rounded-md font-semibold text-sm cursor-pointer shadow-xs"
          >
            {t("products.addToCart", "Add to Cart")}
          </motion.button>

          <motion.button
            type="button"
            aria-label="Wishlist"
            onClick={() => setLiked(!liked)}
            variants={textAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="h-10 w-10 flex justify-center items-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {liked ? (
              <GoHeartFill className="size-6 text-red-500" />
            ) : (
              <GoHeart className="size-6 text-gray-400 hover:text-red-500 transition-colors" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TrendingProductCard;
