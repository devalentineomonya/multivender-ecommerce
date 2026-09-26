"use client";

import { BsStar, BsStarFill } from "react-icons/bs";
import { motion } from "framer-motion";
import ProductLike from "./product-like";
import Image from "next/image";
import Link from "next/link";
import CartActionButtons from "./cart-action-buttons";
import dummyProduct from "@/public/images/63ec6053e5b15cfafd550cbb_Rectangle 1436-3.png";
import { useI18nStore } from "@/lib/i18n/store";

interface ProductCardProps {
  thumbnail?: boolean;
  animate?: boolean;
  product: {
    id: string | number;
    name: string;
    price: number;
    image?: string;
    images?: string[];
    shortDescription?: string;
  };
}

const getValidImageSrc = (img: any) => {
  if (!img) return dummyProduct;
  if (typeof img === "object") return img; // StaticImageData
  if (typeof img === "string") {
    const trimmed = img.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
      return trimmed;
    }
  }
  return dummyProduct;
};

const ProductCard = ({ thumbnail, product, animate }: ProductCardProps) => {
  const { formatPrice, t } = useI18nStore();

  const rawImg =
    product?.image ||
    (Array.isArray(product?.images) && product.images.length > 0
      ? product.images[0]
      : null);

  const imgSrc = getValidImageSrc(rawImg);

  return (
    <motion.div
      className="w-full max-w-full sm:max-w-[410px] sm:mr-6 hover:-translate-y-2 cursor-pointer transition-transform"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: animate ? 1 : 0.8, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="rounded-lg h-[320px] flex justify-center items-center relative overflow-hidden bg-gray-50 border border-gray-100 group">
        <Link href={`/shop?product=${product?.id}`} className="w-full h-full relative block">
          <Image
            src={imgSrc}
            alt={product?.name || "Product Image"}
            fill
            sizes="(max-width: 640px) 100vw, 410px"
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
          />
        </Link>
        <ProductLike productId={product?.id.toString()} />
      </div>

      {!thumbnail && (
        <div className="px-2">
          <div className="flex justify-between items-center text-gray-800 text-lg font-semibold mt-3">
            <Link href={`/shop?product=${product?.id}`} className="truncate hover:text-primary transition-colors">
              {product?.name}
            </Link>
            <span className="whitespace-nowrap text-primary font-bold ml-2">
              {formatPrice(product?.price || 0)}
            </span>
          </div>
          <p className="truncate text-sm text-gray-500 mt-1">
            {product?.shortDescription}
          </p>
          <div className="flex justify-start items-center gap-x-2 mt-2">
            <BsStarFill className="size-4 text-amber-400" />
            <BsStarFill className="size-4 text-amber-400" />
            <BsStarFill className="size-4 text-amber-400" />
            <BsStarFill className="size-4 text-amber-400" />
            <BsStar className="size-4 text-gray-300" />
            <span className="text-xs text-gray-400">(4.0)</span>
          </div>
          <div className="cart-buttons mt-3">
            <CartActionButtons
              cartValue={0}
              currentStock={10}
              productId={product?.id.toString()}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;
