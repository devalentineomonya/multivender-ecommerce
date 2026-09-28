"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineMinus, AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { useCartStore, type CartProductItem } from "@/lib/zustand/cart-store";
import { useI18nStore } from "@/lib/i18n/store";
import defaultImg from "@/public/images/63e8c4e4aed3c6720e446aa1_airpod max-min.png";

interface CartItemCardProps {
  item: CartProductItem;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { formatPrice, t } = useI18nStore();

  const getValidImg = (img?: string) => {
    if (!img) return defaultImg;
    if (img.startsWith("http") || img.startsWith("/")) return img;
    return defaultImg;
  };

  return (
    <div className="w-full flex items-center justify-between gap-4 p-4 border border-gray-100 bg-white hover:bg-gray-50/50 rounded-xl transition-colors mb-3">
      {/* Product Image */}
      <Link
        href={`/product/${item.productId}`}
        className="w-20 h-20 relative bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center p-2"
      >
        <Image
          src={getValidImg(item.image)}
          alt={item.name}
          fill
          className="object-contain p-1"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${item.productId}`}
          className="font-semibold text-slate-900 text-sm hover:text-primary transition-colors truncate block"
        >
          {item.name}
        </Link>

        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          {item.size && <span>{t("cart.item.size")} <strong className="text-gray-700">{item.size}</strong></span>}
          {item.size && item.color && <span>&bull;</span>}
          {item.color && <span>{t("cart.item.color")} <strong className="text-gray-700">{item.color}</strong></span>}
        </div>

        <div className="text-primary font-bold text-sm mt-1">
          {formatPrice(item.price)}
        </div>
      </div>

      {/* Quantity & Controls */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <button
            type="button"
            title={t("products.decreaseQuantity")}
            aria-label={t("products.decreaseQuantity")}
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-1.5 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <AiOutlineMinus className="text-xs" />
          </button>
          <span className="px-2.5 text-xs font-bold text-slate-800">{item.quantity}</span>
          <button
            type="button"
            title={t("products.increaseQuantity")}
            aria-label={t("products.increaseQuantity")}
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-1.5 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <AiOutlinePlus className="text-xs" />
          </button>
        </div>

        <div className="text-end min-w-[70px]">
          <div className="text-slate-900 font-extrabold text-sm">
            {formatPrice(item.price * item.quantity)}
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-1 cursor-pointer transition-colors"
          >
            <AiOutlineDelete />
            <span>{t("cart.item.remove")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
