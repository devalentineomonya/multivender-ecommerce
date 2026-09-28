"use client"
import Image from "next/image";
import React from "react";
import { StaticImageData } from "next/image";
import { motion } from "framer-motion";

import Link from "next/link";
import { useI18nStore } from "@/lib/i18n/store";

interface PopularOfferCardProps {
  offer: {
    value: number;
    description: string;
    image: string | StaticImageData;
    name: string;
    href?: string;
  };
  bg: string;
  text: string;
}

const PopularOfferCard: React.FC<PopularOfferCardProps> = ({
  offer,
  bg,
  text,
}) => {
  const { t, formatPrice } = useI18nStore();
  // Animation Variants
  const textVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  const imageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <Link href={offer.href || "/shop"} className="block group">
      <motion.div
        className={`w-full h-fit sm:min-h-[400px] rounded-card overflow-hidden grid grid-rows-2 ${text}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
      {/* Text Section */}
      <motion.div
        className={`px-3 py-5 ${bg}`}
        variants={textVariants}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-slate-900 font-bold">{t("home.popularOffers.save")}</p>
        <h2 className="font-bold text-5xl my-2 tabular-nums">{formatPrice(offer.value)}</h2>
        <p className="text-slate-900 pb-1 text-xl sm:text-base">
          {offer.description}
        </p>
      </motion.div>

      {/* Image Section */}
      <motion.div
        className="overflow-hidden"
        variants={imageVariants}
        transition={{ duration: 0.32, delay: 0.08 }}
      >
        <Image
          className="h-full w-full object-cover transition-transform duration-300 ease-smooth group-hover:scale-105"
          src={offer.image}
          alt={offer.name}
          loading="lazy"
        />
      </motion.div>
    </motion.div>
  </Link>
);
};

export default PopularOfferCard;
