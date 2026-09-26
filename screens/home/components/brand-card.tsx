"use client"
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import brand from "@/public/images/63e8c4e4c21faa5e03c209c5_brand (1)-min.png";

const BrandCard = () => {
  return (
    <motion.div
      className="bg-gray-100 rounded-md w-full h-24 px-3 py-2"
      initial={{ scale: 0.6, rotateY: 0 }}
      whileInView={{ scale: 1, rotateY: 4 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <div className="flex gap-x-3 items-center h-full">
        <div className=" relative rounded-full overflow-hidden aspect-square h-20">
          <Image src={brand} fill className="object-cover" alt="Brand" />
        </div>
        <div className="col-span-8">
          <h4 className="font-medium text-sm text-gray-800">Staples</h4>
          <p className="text-xs text-gray-600 mt-2">Delivery within 24 hours</p>
        </div>
      </div>
    </motion.div>
  );
};

export default BrandCard;
