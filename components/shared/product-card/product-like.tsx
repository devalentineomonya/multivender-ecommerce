"use client";
import React, { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";

type ProductLikeProps = {
  productId: string;
};

const ProductLike: React.FC<ProductLikeProps> = ({ productId }) => {
  const dummyUser = {
    isVerified: true,
    likedItems: ["product1", "product2"], // Example liked products
  };

  const [liked, setLiked] = useState(dummyUser.likedItems.includes(productId));

  const handleLike = () => {
    const newLikedStatus = !liked;
    setLiked(newLikedStatus);
    // Simulate an API call and update the state
    if (!dummyUser.isVerified) {
      console.error("User is not verified");
      setLiked(liked); // Revert to the previous state if not verified
    } else {
      console.log("Liked/unliked product:", productId);
    }
  };

  return (
    <div
      className="absolute w-10 h-10 duration-300 z-10 top-1 right-1 rounded-full bg-white flex justify-center items-center"
      title="Like"
    >
      <input
        type="checkbox"
        className={`absolute w-10 h-10 opacity-0 z-20 cursor-pointer`}
        title="Like"
        onChange={handleLike}
        checked={liked} // Dynamically update checked status based on `liked`
      />
      <div className="h-10 w-10 flex justify-center items-center">
        {liked ? (
          <GoHeartFill className="size-8 text-pink-700" />
        ) : (
          <GoHeart className="size-8 text-pink-700" />
        )}
      </div>
    </div>
  );
};

export default ProductLike;
