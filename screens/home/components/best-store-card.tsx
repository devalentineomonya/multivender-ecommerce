"use client"
import Image from "next/image";
import { motion } from "framer-motion";

import testImage from "@/public/images/63e8c4e6eaf8537c8058cf04_store four-min.png";
import testLogo from "@/public/images/63e8c4e4c21faa5e03c209c5_brand (1)-min.png";
import priceTag from "@/public/images/63ea2eeefd8efb290e2d7d78_Icon.png";

const BestStoreCard = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const logoVariants = {
    hover: { scale: 1.2 },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      className="best-store-card"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      {/* Image Section */}
      <motion.div
        className="relative z-0"
        variants={containerVariants}
        transition={{ duration: 0.6 }}
      >
        <div className="overflow-hidden rounded-md">
          <Image
            src={testImage}

            className="object-cover h-full w-full"
            alt="best-store-product-image"
            loading="lazy"
          />
        </div>
        {/* Logo with Scale Effect */}
        <motion.div
          className="absolute rounded-full border border-white -bottom-8 left-3 z-10"
          variants={logoVariants}
          whileHover="hover"
        >
          <Image
            className="w-full rounded-md scale-[1.15]"
            src={testLogo}
            alt="best-store-logo"
            loading="lazy"
          />
        </motion.div>
      </motion.div>

      {/* Text Section */}
      <motion.div
        className="mt-8"
        variants={textVariants}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <h4 className="text-slate-900 font-bold">Staple</h4>
        <p className="text-xs font-semibold text-gray-500 my-1">Bag. Perfume</p>
        <p className="text-xs font-semibold text-pink-500 flex gap-x-2 justify-start items-center">
          <Image src={priceTag} alt="price-tag" loading="lazy" /> Delivered
          within 24 hours
        </p>
      </motion.div>
    </motion.div>
  );
};

export default BestStoreCard;
