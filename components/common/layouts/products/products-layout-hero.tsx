"use client"
import { motion } from "framer-motion";
import testImage from "@/public/images/63e8c4e4aed3c6720e446aa1_airpod max-min.png";
import Image from "next/image";
import MainLayout from "../main/main-layout";

const ProductsLayoutHero = () => {
  return (
    <MainLayout>
      <div className="bg-[#ffe6cc] rounded-md h-[30vh] md:h-96 flex justify-between  items-center flex-col md:flex-row px-6 overflow-hidden mt-6 md:mt-1">
        {/* Text Section */}
        <motion.div
          className="flex-1 flex flex-col justify-center items-center"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h1 className="text-5xl text-customGreen font-bold text-center">
            Grab up to 50% Off on Selected Items
          </h1>
          <motion.button
            title="Buy"
            aria-label="Buy"
            className="px-10 py-3 mt-4 rounded-full bg-primary text-white hover:bg-black max-w-52"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Buy Now
          </motion.button>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className=" flex-1 flex justify-center items-end"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Image className="w-3/4 md:w-2/3 h-full" src={testImage} alt="product-layout-image" loading="lazy" />
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ProductsLayoutHero;
