"use client"
import Image from "next/image";
import React from "react";
import { StaticImageData } from "next/image";
import { motion } from "framer-motion";

interface PopularOfferCardProps {
  offer: {
    value: number;
    description: string;
    image: string | StaticImageData;
    name: string;
  };
  bg: string;
  text: string;
}

const PopularOfferCard: React.FC<PopularOfferCardProps> = ({
  offer,
  bg,
  text,
}) => {
  // Animation Variants
  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      className={`w-full h-fit sm:min-h-[400px] rounded-lg overflow-hidden grid grid-rows-2 ${text}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      {/* Text Section */}
      <motion.div
        className={`px-3 py-5 ${bg}`}
        variants={textVariants}
        transition={{ duration: 0.6 }}
      >
        <p className="text-slate-900 font-bold">Save</p>
        <h2 className="font-bold text-5xl my-2">
          <sup className="text-3xl">$</sup>
          {offer.value}
        </h2>
        <p className="text-slate-900 pb-1 text-xl sm:text-base">
          {offer.description}
        </p>
      </motion.div>

      {/* Image Section */}
      <motion.div
        className="overflow-hidden"
        variants={imageVariants}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <Image
          className="h-full rounded-b-lg w-full hover:scale-[1.15] transition-transform duration-300"
          src={offer.image}
          alt={offer.name}
          loading="lazy"
        />
      </motion.div>
    </motion.div>
  );
};

export default PopularOfferCard;
