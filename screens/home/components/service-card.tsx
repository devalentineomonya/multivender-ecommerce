"use client";
import { StaticImageData } from "next/image";
import Image from "next/image";
import { motion } from "framer-motion";

interface ServiceCardProps {
  service: {
    name: string;
    description: string;
    image: string | StaticImageData;
    value: number;
  };
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  // Animation variants
  const animationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="w-full sm:max-w-[300px] h-fit sm:min-h-[400px] rounded-lg overflow-hidden grid grid-rows-2 bg-[#fcfcfc] max-w-full min-w-full max-h-72"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={animationVariants}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="px-6 pt-7"
      >
        <h4 className="font-semibold text-slate-700 text-lg mb-3">
          Frequently Asked Questions
        </h4>
        <p className="text-sm font-semibold text-gray-500">
          Velit velit officia magna veniam sit veniam consectetur tempor elit.
          Do excepteur aliquip quis culpa ullamco.
        </p>
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={animationVariants}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true, amount: 0.2 }}
        className="service-image"
      >
        <Image
          className="w-full h-full"
          src={service?.image}
          alt={service?.name ?? "service-image"}
          loading="lazy"
        />
      </motion.div>
    </motion.div>
  );
};

export default ServiceCard;
