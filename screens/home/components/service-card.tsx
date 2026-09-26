"use client";
import { StaticImageData } from "next/image";
import Image from "next/image";
import { motion } from "framer-motion";

interface ServiceCardProps {
  service: {
    name: string;
    description: string;
    image: string | StaticImageData;
    value?: number;
    href?: string;
  };
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  // Animation variants
  const animationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const card = (
    <motion.div
      className="w-full sm:max-w-[300px] h-fit sm:min-h-[400px] rounded-lg overflow-hidden grid grid-rows-2 bg-[#fcfcfc] max-w-full min-w-full max-h-72 border border-gray-100 hover:border-primary/20 transition-all hover:shadow-sm group cursor-pointer"
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
        <h4 className="font-semibold text-slate-800 text-lg mb-2 group-hover:text-primary transition-colors">
          {service.name}
        </h4>
        <p className="text-sm font-medium text-gray-500 leading-snug line-clamp-3">
          {service.description}
        </p>
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={animationVariants}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true, amount: 0.2 }}
        className="service-image overflow-hidden"
      >
        <Image
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={service?.image}
          alt={service?.name ?? "service-image"}
          loading="lazy"
        />
      </motion.div>
    </motion.div>
  );

  if (service.href) {
    return (
      <a href={service.href} className="block w-full h-full">
        {card}
      </a>
    );
  }

  return card;
};

export default ServiceCard;
