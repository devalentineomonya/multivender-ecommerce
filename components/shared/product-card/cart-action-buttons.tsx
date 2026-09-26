"use client";

import React from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useCartStore } from "@/lib/zustand/cart-store";
import { toast } from "react-toastify";

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
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const cartItem = items.find((i) => i.productId === productId || i.id === productId);
  const currentQuantity = cartItem?.quantity || 0;

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentQuantity >= currentStock) {
      toast.warning("Maximum stock limit reached");
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
      toast.success(`Added ${product.name} to cart`);
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

  if (currentQuantity === 0) {
    return (
      <button
        type="button"
        onClick={handleIncrease}
        className="w-full sm:w-auto bg-primary text-white hover:bg-slate-900 transition-colors py-2 px-5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
      >
        <AiOutlinePlus className="text-sm" />
        <span>Add to Cart</span>
      </button>
    );
  }

  return (
    <div className="flex justify-between items-center gap-x-3 rounded-full border border-primary py-1 px-4 w-fit bg-primary/5">
      <button
        type="button"
        title="Decrease quantity"
        aria-label="Decrease quantity"
        className="hover:text-primary transition-colors cursor-pointer text-xs"
        onClick={handleDecrease}
      >
        <AiOutlineMinus />
      </button>
      <span className="font-bold text-xs text-slate-800 px-1">{currentQuantity}</span>
      <button
        type="button"
        title="Increase quantity"
        aria-label="Increase quantity"
        className="hover:text-primary transition-colors cursor-pointer text-xs"
        onClick={handleIncrease}
      >
        <AiOutlinePlus />
      </button>
    </div>
  );
};

export default CartActionButtons;
