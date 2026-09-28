"use client";
import React, { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { useI18nStore } from "@/lib/i18n/store";

type ProductLikeProps = {
  productId: string;
  productName: string;
};

// Wishlist persistence is not wired to an API yet; state is local to the card.
const ProductLike: React.FC<ProductLikeProps> = ({ productName }) => {
  const { t } = useI18nStore();
  const [liked, setLiked] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={t(liked ? "products.removeFromWishlist" : "products.addToWishlist", { name: productName })}
      onClick={() => setLiked((prev) => !prev)}
      className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-pink-700 transition-colors hover:bg-white"
    >
      {liked ? <GoHeartFill className="size-4" /> : <GoHeart className="size-4" />}
    </button>
  );
};

export default ProductLike;
