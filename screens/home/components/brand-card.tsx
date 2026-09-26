"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import defaultBrandImg from "@/public/images/63e8c4e4c21faa5e03c209c5_brand (1)-min.png";

export interface BrandCardData {
  id?: string;
  name: string;
  image?: StaticImageData | string;
  link?: string;
  delivery?: string;
}

interface BrandCardProps {
  brand?: BrandCardData;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  const name = brand?.name || "Staples";
  const image = brand?.image || defaultBrandImg;
  const link = brand?.link || `/shop?search=${encodeURIComponent(name)}`;
  const delivery = brand?.delivery || "Delivery within 24 hours";

  return (
    <motion.div
      className="bg-gray-100 rounded-md w-full h-24 px-3 py-2 cursor-pointer"
      initial={{ scale: 0.6, rotateY: 0 }}
      whileInView={{ scale: 1, rotateY: 4 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <Link href={link} className="flex gap-x-3 items-center h-full">
        <div className="relative rounded-full overflow-hidden aspect-square h-20 shrink-0">
          <Image src={image} fill className="object-cover" alt={name} />
        </div>
        <div className="col-span-8">
          <h4 className="font-medium text-sm text-gray-800">{name}</h4>
          <p className="text-xs text-gray-600 mt-2">{delivery}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default BrandCard;
