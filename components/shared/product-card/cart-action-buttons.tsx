"use client";

import React from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useCartStore } from "@/lib/zustand/cart-store";
import { toast } from "react-toastify";
import { useI18nStore } from "@/lib/i18n/store";

interface CartActionButtonsProps {
  productId: string;
  product?: {
    id: string | number;
    name: string;
    price: number;
    image?: string;
    stock?: number;
    vendorId?: string;
  };
  currentStock?: number;
}

const CartActionButtons: React.FC<CartActionButtonsProps> = ({
  productId,
  product,
  currentStock = 99,
}) => {
  const { t } = useI18nStore();
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const cartItem = items.find((i) => i.productId === productId || i.id === productId);
  const currentQuantity = cartItem?.quantity || 0;

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentQuantity >= currentStock) {
      toast.warning(t("products.maxStockReached"));
      return;
    }

    if (currentQuantity === 0 && product) {
      addItem({
        productId: String(product.id),
        name: product.name,
        price: product.price,
        image: product.image,
        vendorId: product.vendorId,
        quantity: 1,
      });
      toast.success(t("products.addedToCart", { name: product.name }));
    } else {
      updateQuantity(productId, currentQuantity + 1);
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentQuantity > 0) {
      updateQuantity(productId, currentQuantity - 1);
    }
  };

  if (currentQuantity === 0 && currentStock <= 0) {
    return (
      <button
        type="button"
        disabled
        className="w-full sm:w-auto py-2 px-5 rounded-full text-xs font-semibold border border-gray-200 text-gray-400 cursor-not-allowed"
      >
        {t("products.outOfStock")}
      </button>
    );
  }

  if (currentQuantity === 0) {
    return (
      <button
        type="button"
        onClick={handleIncrease}
        className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 transition-colors py-2 px-5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5"
      >
        <AiOutlinePlus className="text-sm" />
        <span>{t("products.addToCart")}</span>
      </button>
    );
  }

  return (
    <div className="flex justify-between items-center gap-x-1 rounded-full border border-primary w-fit bg-primary/5">
      <button
        type="button"
        aria-label={t("products.decreaseQuantity")}
        className="flex size-8 items-center justify-center rounded-full text-xs transition-colors hover:text-primary"
        onClick={handleDecrease}
      >
        <AiOutlineMinus />
      </button>
      <span className="min-w-5 text-center font-bold text-xs text-slate-800 tabular-nums" aria-live="polite">
        <span className="sr-only">{t("products.quantityInCart", { count: currentQuantity })}</span>
        <span aria-hidden="true">{currentQuantity}</span>
      </span>
      <button
        type="button"
        aria-label={t("products.increaseQuantity")}
        className="flex size-8 items-center justify-center rounded-full text-xs transition-colors hover:text-primary"
        onClick={handleIncrease}
      >
        <AiOutlinePlus />
      </button>
    </div>
  );
};

export default CartActionButtons;
