"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { GoArrowRight } from "react-icons/go";
import { motion } from "framer-motion";

interface HeroItemProps {
  image: StaticImageData | string;
  name: string;
  category: string;
  offer: string;
  description: string;
  rtl?: boolean;
  link?: string;
}

const HeroItem = ({
  image,
  name,
  category,
  offer,
  description,
  rtl = true,
  link = "/shop",
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
    <div className="w-full h-full relative overflow-hidden rounded-sm">
      <Image
        src={image}
        alt={name}
        fill
        priority
        quality={100}
        className="object-cover absolute"
      />
      {/* Darkish gradient overlay for high color contrast */}
      <div
        className={`absolute inset-0 z-[5] pointer-events-none ${
          rtl
            ? "bg-gradient-to-l from-black/80 via-black/45 to-black/15"
            : "bg-gradient-to-r from-black/80 via-black/45 to-black/15"
        }`}
      />
      <div
        className={`absolute z-10 h-full w-full px-11 md:px-20 flex flex-col justify-center text-white ${
          rtl ? "items-end text-right" : "items-start text-left"
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
          <span className="uppercase text-red-600 font-bold">{offer}</span>
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
        <Link href={link}>
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            custom={4}
            className="border border-white px-2 md:px-4 p-1 md:py-2 mt-3 uppercase flex items-center gap-x-2 md:gap-x-4 cursor-pointer hover:bg-white hover:text-black transition-colors"
          >
            <span>SHOP NOW</span>
            <GoArrowRight />
          </motion.div>
        </Link>
      </div>
    </div>
  );
};

export default HeroItem;
