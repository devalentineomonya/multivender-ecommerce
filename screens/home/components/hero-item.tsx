"use client"
import React from "react";
import Image, { StaticImageData } from "next/image";

import { GoArrowRight } from "react-icons/go";
import { motion } from "framer-motion";

interface HeroItemProps {
  image: StaticImageData | string;
  name: string;
  category: string;
  offer: string;
  description: string;
  rtl?: boolean;
}

const HeroItem = ({
  image,
  name,
  category,
  offer,
  description,
  rtl = true,
}: HeroItemProps) => {

  const textVariants = {
    hidden: () => ({
      x: rtl ? 100 : -100,
      opacity: 0,
    }),
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="w-full h-full relative overflow-hidden rounded-sm ">
      <Image
        src={image}
        alt={name}
        fill
        priority
        quality={100}
        className="object-cover absolute"
      />
      <div
        className={`absolute z-10 h-full w-full px-11 md:px-20 flex flex-col justify-center text-white ${
          rtl ? "items-end" : "items-start"
        }`}
      >
        <motion.p
          variants={textVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          className="uppercase font-semibold text-base md:text-lg"
        >
          {category}
        </motion.p>
        <motion.h3
          variants={textVariants}
          initial="hidden"
          animate="visible"
          custom={1}
          className="capitalize text-3xl md:text-5xl font-bold my-2"
        >
          {name}
        </motion.h3>
        <motion.h5
          variants={textVariants}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-xl md:text-3xl font-medium mb-2"
        >
          up to{" "}
          <span className="uppercase text-red-600 font-bold">{offer} off</span>
        </motion.h5>
        <motion.p
          variants={textVariants}
          initial="hidden"
          animate="visible"
          custom={3}
          className=""
        >
          {description}
        </motion.p>
        <motion.button
          variants={textVariants}
          initial="hidden"
          animate="visible"
          custom={4}
          className="border border-white px-2 md:px-4 p-1 md:py-2 mt-3 uppercase flex items-center gap-x-2 md:gap-x-4"
        >
          <span>Shop Now</span>
          <GoArrowRight />
        </motion.button>

      </div>
    </div>
  );
};

export default HeroItem;
