"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import testImage from "@/public/images/63e8c4e6eaf8537c8058cf04_store four-min.png";
import testLogo from "@/public/images/63e8c4e4c21faa5e03c209c5_brand (1)-min.png";
import priceTag from "@/public/images/63ea2eeefd8efb290e2d7d78_Icon.png";

export interface BestStoreData {
  id?: string;
  name: string;
  category: string;
  image?: StaticImageData | string;
  logo?: StaticImageData | string;
  link?: string;
}

interface BestStoreCardProps {
  store?: BestStoreData;
}

const BestStoreCard: React.FC<BestStoreCardProps> = ({ store }) => {
  const name = store?.name || "Staple";
  const category = store?.category || "Bag. Perfume";
  const image = store?.image || testImage;
  const logo = store?.logo || testLogo;
  const link = store?.link || `/shop?search=${encodeURIComponent(name)}`;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  const logoVariants = {
    hover: { scale: 1.05 },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <Link href={link} className="block">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Image Section */}
        <motion.div
          className="relative z-0"
          variants={containerVariants}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="overflow-hidden rounded-card aspect-[16/10] relative">
            <Image
              src={image}
              fill
              className="object-cover h-full w-full"
              alt={`${name} product`}
              loading="lazy"
            />
          </div>
          {/* Logo with Scale Effect */}
          <motion.div
            className="absolute rounded-full border border-white -bottom-8 left-3 z-10 w-16 h-16 overflow-hidden bg-white shadow-sm"
            variants={logoVariants}
            whileHover="hover"
          >
            <Image
              fill
              className="w-full h-full object-cover rounded-md scale-[1.15]"
              src={logo}
              alt={`${name} logo`}
              loading="lazy"
            />
          </motion.div>
        </motion.div>

        {/* Text Section */}
        <motion.div
          className="mt-8"
          variants={textVariants}
          transition={{ duration: 0.32, delay: 0.08 }}
        >
          <h4 className="text-slate-900 font-bold">{name}</h4>
          <p className="text-xs font-semibold text-gray-500 my-1">{category}</p>
          <p className="text-xs font-semibold text-pink-500 flex gap-x-2 justify-start items-center">
            <Image src={priceTag} alt="" loading="lazy" /> Delivered within 24 hours
          </p>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default BestStoreCard;
